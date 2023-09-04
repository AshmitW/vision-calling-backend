'use strict'

const User = require('../models/user.model')

exports.me = async (req, res, next) => {
  try {
    return res.json({ message: 'success', data: res.req.user })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const {email, name} = req.body
    if (email) await User.updateOne({_id: res.req.user._id}, {email: email}, { runValidators: true })
    if (name) await User.updateOne({_id: res.req.user._id}, {name: name}, { runValidators: true })
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    await User.changePassword(req.body, res.req.user._id)
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}
