'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  update: {
    body: {
      email: Joi.string().email(),
      name: Joi.string().max(128)
    }
  },
  changePassword: {
    body: {
      oldPassword: Joi.string().min(6).max(128).required(),
      newPassword: Joi.string().min(6).max(128).required()
    }
  }
}
