'use strict'

const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')

exports.register = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    body.activationKey = activationKey
    const user = new User(body)
    const savedUser = await user.save()
    res.status(httpStatus.CREATED)
    res.send(savedUser.transform())
  } catch (error) {
    return next(User.checkDuplicateEmailError(error))
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const payload = {sub: user.id}
    const token = jwt.sign(payload, config.secret, {expiresIn: '365d'})
    if (req.body.fcmToken) {
      await User.updateOne(
        { '_id': user.id },
        {'fcmToken': req.body.fcmToken},
        { runValidators: true }
      )
    }
    return res.json({ message: 'success', token: token })
  } catch (error) {
    next(error)
  }
}

exports.verifyEmailId = async (req, res, next) => {
  try {
    await User.updateOne(
      { 'activationKey': req.query.key },
      {'active': true},
      { runValidators: true }
    )
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const forgotPasswordKey = uuidv1()
    await User.forgotPassword(req.query.email, forgotPasswordKey)
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const status = await User.resetPassword(req.body, req.query.key)
    res.redirect(`../../status?status=${status}`)
  } catch (error) {
    next(error)
  }
}
