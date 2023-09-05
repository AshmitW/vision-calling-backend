'use strict'

// const User = require('../models/user.model')

exports.joinRequest = async (req, res, next) => {
  try {
    return res.json({ message: 'success', data: res.req.user })
  } catch (error) {
    next(error)
  }
}
