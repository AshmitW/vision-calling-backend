'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const httpStatus = require('http-status')
const APIError = require('../utils/APIError')
const transporter = require('../services/transporter')
const config = require('../config')
const Schema = mongoose.Schema

const roles = [
  'user', 'admin'
]

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 128
  },
  name: {
    type: String,
    maxlength: 50
  },
  activationKey: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user',
    enum: roles
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function save (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = bcrypt.hashSync(this.password)

    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.post('save', async function saved (doc, next) {
  try {
    const mailOptions = {
      from: config.transporter.sender,
      to: this.email,
      subject: 'Confirm creating account',
      html: `<div><h2>Hello ${this.name}!</h2><p>Click <a href="${config.hostname}/api/auth/confirm?key=${this.activationKey}">here</a> to activate your account.</p></div>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })

    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.method({
  transform () {
    const transformed = {}
    const fields = ['id', 'name', 'email', 'createdAt', 'role']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  },

  passwordMatches (password) {
    return bcrypt.compareSync(password, this.password)
  }
})

userSchema.statics = {
  roles,

  checkDuplicateEmailError (err) {
    if (err.code === 11000) {
      var error = new Error('Email already taken')
      error.errors = [{
        field: 'email',
        location: 'body',
        messages: ['Email already taken']
      }]
      error.status = httpStatus.CONFLICT
      return error
    }

    return err
  },

  async findAndGenerateToken (payload) {
    const { email, password } = payload
    if (!email) throw new APIError('Email must be provided for login')

    const user = await this.findOne({ email }).exec()
    if (!user) throw new APIError(`No user associated with ${email}`, httpStatus.NOT_FOUND)

    const passwordOK = await user.passwordMatches(password)

    if (!passwordOK) throw new APIError(`Incorrect email or password`, httpStatus.UNAUTHORIZED)

    if (!user.active) throw new APIError(`User not activated`, httpStatus.UNAUTHORIZED)

    return user
  },

  async changePassword (payload, id) {
    const { oldPassword, newPassword } = payload
    if (!oldPassword) throw new APIError('Current Password must be provided')
    if (!newPassword) throw new APIError('New Password must be provided')
    const user = await this.findById(id).exec()
    if (!user) throw new APIError(`No user found`, httpStatus.NOT_FOUND)

    const oldPasswordOK = await user.passwordMatches(oldPassword)
    if (!oldPasswordOK) throw new APIError(`Current Password does not match`, httpStatus.UNAUTHORIZED)

    const newPasswordOK = await user.passwordMatches(newPassword)
    if (newPasswordOK) throw new APIError(`New Password cannot be same as Current Password`, httpStatus.BAD_REQUEST)
    await this.updateOne({_id: id}, { password: bcrypt.hashSync(newPassword) }, { runValidators: true })
  }
}

module.exports = mongoose.model('User', userSchema)
