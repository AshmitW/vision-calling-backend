'use strict'

const Message = require('../models/message.model')
const User = require('../models/user.model')
const httpStatus = require('http-status')
const mongoose = require('mongoose')
const APIError = require('../utils/APIError')
const { draftNotification } = require('../helpers/notification')
const Notification = require('../models/notification.model')

exports.send = async (req, res, next) => {
  try {
    const match = {}
    const sender = await User.findById(res.req.user._id)
    if (!sender) return 'No user found'
    const receiver = await User.findById(req.body.receiverId)
    if (!receiver) return 'No user found'
    const firstParticipantId = mongoose.Types.ObjectId(res.req.user._id)
    const secondParticipantId = mongoose.Types.ObjectId(req.body.receiverId)
    if (firstParticipantId === secondParticipantId) throw new APIError(`Incorrect Email ID or password`, httpStatus.CONFLICT)
    match.participants = {$in: [firstParticipantId && secondParticipantId]}
    const existingMsg = await Message.findOne(match)
    if (existingMsg) {
      existingMsg.lastMessage = req.body.text
      existingMsg.chats.push({
        senderId: res.req.user._id,
        receiverId: req.body.receiverId,
        text: req.body.text
      })
      existingMsg.updateBy = res.req.user._id
      const savedMsg = await existingMsg.save()
      for (const internalIndex of Object.keys(savedMsg.participants)) {
        if (savedMsg.participants[internalIndex] !== res.req.user._id) {
          const user = await User.findById(savedMsg.participants[internalIndex])
          const transformedUser = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          savedMsg.receiver = transformedUser
        }
      }
      const rawNotiDraft = draftNotification('message', sender, receiver, '', '', req.body.text)
      const noti = new Notification(rawNotiDraft)
      await noti.save()
      return res.json({ message: 'success', data: savedMsg || {} })
    } else {
      const body = {}
      body.participants = [res.req.user._id, req.body.receiverId]
      body.lastMessage = req.body.text
      body.chats = [{
        senderId: res.req.user._id,
        receiverId: req.body.receiverId,
        text: req.body.text
      }]
      body.updateBy = res.req.user._id
      const msg = new Message(body)
      const savedMsg = await msg.save()
      res.status(httpStatus.CREATED)
      for (const internalIndex of Object.keys(savedMsg.participants)) {
        if (savedMsg.participants[internalIndex] !== res.req.user._id) {
          const user = await User.findById(savedMsg.participants[internalIndex])
          const transformedUser = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          savedMsg.receiver = transformedUser
        }
      }
      const rawNotiDraft = draftNotification('message', sender, receiver, req.body.text)
      const noti = new Notification(rawNotiDraft)
      await noti.save()
      return res.json({ message: 'success', data: savedMsg || {} })
    }
  } catch (error) {
    return next(error)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const query = []
    const match = {}
    const userId = mongoose.Types.ObjectId(res.req.user._id)
    match.participants = {$in: [userId]}
    if (req.query.msgId) match._id = mongoose.Types.ObjectId(req.query.msgId)
    const project = {
      _id: 1,
      participants: 1,
      updateBy: 1,
      lastMessage: 1,
      chats: 1,
      createdAt: 1,
      updatedAt: 1
    }

    query.push(
      {$sort: {updatedAt: -1}},
      { $skip: +req.query.skip || 0 },
      { $limit: +req.query.limit || 10 }
    )
    query.push({$match: match}, {$project: project})
    const combQuery = {$facet: {items: query}}
    const existingMsg = await Message.aggregate([combQuery]).allowDiskUse(true)
    for (const index of Object.keys(existingMsg[0].items)) {
      for (const internalIndex of Object.keys(existingMsg[0].items[index].participants)) {
        if (existingMsg[0].items[index].participants[internalIndex] !== res.req.user._id) {
          const user = await User.findById(existingMsg[0].items[index].participants[internalIndex])
          const transformedUser = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          existingMsg[0].items[index].receiver = transformedUser
        }
      }
    }
    return res.json({ message: 'success', data: existingMsg || {} })
  } catch (error) {
    return next(error)
  }
}
