'use strict'

const Message = require('../models/message.model')
const User = require('../models/user.model')
const httpStatus = require('http-status')
const mongoose = require('mongoose')
const APIError = require('../utils/APIError')
const { draftNotification } = require('../helpers/notification')

exports.send = async (req, res, next) => {
  try {
    const match = {}
    const user = await User.findById(res.req.user._id)
    if (!user) return 'No user found'
    const firstParticipantId = mongoose.Types.ObjectId(res.req.user._id)
    const secondParticipantId = mongoose.Types.ObjectId(req.body.recieverId)
    if (firstParticipantId === secondParticipantId) throw new APIError(`Incorrect Email ID or password`, httpStatus.CONFLICT)
    match.participants = {$in: [firstParticipantId && secondParticipantId]}
    const existingMsg = await Message.findOne(match)
    if (existingMsg) {
      existingMsg.lastMessage = req.body.text
      existingMsg.chats.push({
        senderId: res.req.user._id,
        receiverId: req.body.recieverId,
        text: req.body.text
      })
      existingMsg.updateBy = res.req.user._id
      await existingMsg.save()
      return res.json({ message: 'success', data: existingMsg || {} })
    } else {
      const body = {}
      body.participants = [res.req.user._id, req.body.recieverId]
      body.lastMessage = req.body.text
      body.chats = [{
        senderId: res.req.user._id,
        receiverId: req.body.recieverId,
        text: req.body.text
      }]
      body.updateBy = res.req.user._id
      const msg = new Message(body)
      const savedMsg = await msg.save()
      res.status(httpStatus.CREATED)
      res.send(savedMsg.transform())
    }
    req.notificationData = draftNotification('Message', user.name, res.req.user._id, user.fcmToken)
  } catch (error) {
    return next(error)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const match = {}
    const userId = mongoose.Types.ObjectId(res.req.user._id)
    match.participants = {$in: [userId]}
    const existingMsg = await Message.findOne(match)
    return res.json({ message: 'success', data: existingMsg || {} })
  } catch (error) {
    return next(error)
  }
}
