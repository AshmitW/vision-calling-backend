'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const firebase = require('firebase-admin')

const notificationSchema = new Schema({
  message: {
    notification: {
      title: {type: String},
      body: {type: String}
    },
    data: {
      type: {type: String},
      senderId: {type: String},
      receiverId: {type: String},
      visionCode: {type: String},
      agoraToken: {type: String}
    },
    token: {type: String}
  },
  type: {type: String},
  senderId: {type: mongoose.Schema.ObjectId},
  receiverId: {type: mongoose.Schema.ObjectId},
  visionCode: {type: String},
  agoraToken: {type: String},
  sent: {
    type: Boolean,
    default: false
  },
  error: {type: String || null, default: null}
}, {
  timestamps: true
})

notificationSchema.pre('save', async function save (next) {
  try {
    try {
      await firebase.messaging().send(this.message)
      this.sent = true
    } catch (error) {
      this.error = error.message
    }
    return next()
  } catch (error) {
    return next(error)
  }
})

notificationSchema.post('save', async function saved (doc, next) {
  try {
    return next()
  } catch (error) {
    return next(error)
  }
})

notificationSchema.method({
  transform () {
    const transformed = {}
    const fields = ['message', 'type', 'senderId', 'receiverId', 'visionCode', 'agoraToken', 'sent', 'error', 'createdAt']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  }
})

notificationSchema.statics = {
}

module.exports = mongoose.model('Notification', notificationSchema)
