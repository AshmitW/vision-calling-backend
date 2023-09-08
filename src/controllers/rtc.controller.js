'use strict'

const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const { draftNotification } = require('../helpers/notification')

exports.joinCall = async (req, res, next) => {
  try {
    await User.updateOne(
      { '_id': res.req.user._id },
      {'visionCode': req.query.visionCode},
      { runValidators: true }
    )
    const agoraToken = await User.generateAgoraToken(req.query.visionCode, res.req.user._id, 'PUBLISHER')
    return res.json({ message: 'success', data: { agoraToken } })
  } catch (error) {
    next(error)
  }
}

exports.inviteCall = async (req, res, next) => {
  try {
    await User.updateOne(
      { '_id': res.req.user._id },
      {'visionCode': req.query.visionCode},
      { runValidators: true }
    )
    await User.updateOne(
      { '_id': req.query.receiverId },
      {'visionCode': req.query.visionCode},
      { runValidators: true }
    )
    const receiver = await User.findById(req.query.receiverId)
    const agoraToken = await User.generateAgoraToken(req.query.visionCode, res.req.user._id, 'PUBLISHER')
    const receiverAgoraToken = await User.generateAgoraToken(req.query.visionCode, receiver._id, 'PUBLISHER')
    const rawNotiDraft = draftNotification('call', res.req.user, receiver, req.query.visionCode, receiverAgoraToken, '')
    const noti = new Notification(rawNotiDraft)
    await noti.save()
    return res.json({ message: 'success', data: { agoraToken } })
  } catch (error) {
    next(error)
  }
}

exports.createStream = async (req, res, next) => {
  try {
    await User.updateOne(
      { '_id': res.req.user._id },
      {'visionCode': req.query.visionCode, 'isLiveStreaming': true},
      { runValidators: true }
    )
    const agoraToken = await User.generateAgoraToken(req.query.visionCode, res.req.user._id, 'PUBLISHER')
    return res.json({ message: 'success', data: { agoraToken } })
  } catch (error) {
    next(error)
  }
}

exports.joinStream = async (req, res, next) => {
  try {
    const host = await User.findById(req.query.hostId)
    await User.updateOne(
      { '_id': res.req.user._id },
      {'visionCode': host.visionCode},
      { runValidators: true }
    )
    const agoraToken = await User.generateAgoraToken(host.visionCode, res.req.user._id, 'SUBSCRIBER')
    return res.json({ message: 'success', data: { agoraToken, visionCode: host.visionCode } })
  } catch (error) {
    next(error)
  }
}

exports.endRtcSession = async (req, res, next) => {
  try {
    const user = await User.updateOne(
      { '_id': res.req.user._id },
      {'visionCode': '', 'isLiveStreaming': false},
      { runValidators: true }
    )
    return res.json({ message: 'success', data: user })
  } catch (error) {
    next(error)
  }
}
