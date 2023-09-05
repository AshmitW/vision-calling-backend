'use strict'

const Joi = require('joi')

// Message validation rules
module.exports = {
  send: {
    body: {
      recieverId: Joi.string().max(128).required(),
      text: Joi.string().max(256).required()
    }
  }
}
