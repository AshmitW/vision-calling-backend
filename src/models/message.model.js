'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  participants: [
    { type: mongoose.Schema.ObjectId, required: true }
  ],
  lastMessage: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  chats: [
    {
      senderId: {
        type: mongoose.Schema.ObjectId,
        required: true
      },
      receiverId: {
        type: mongoose.Schema.ObjectId,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  updateBy: { type: mongoose.Schema.ObjectId, default: null }
}, {
  timestamps: true
})

messageSchema.pre('save', async function save (next) {
  try {
    return next()
  } catch (error) {
    return next(error)
  }
})

messageSchema.post('save', async function saved (doc, next) {
  try {
    return next()
  } catch (error) {
    return next(error)
  }
})

messageSchema.method({
  transform () {
    const transformed = {}
    const fields = ['participants', 'lastMessage', 'status', 'chats', 'updateBy']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  }
})

messageSchema.statics = {

}

module.exports = mongoose.model('Message', messageSchema)
