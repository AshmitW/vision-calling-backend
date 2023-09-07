'use strict'

const Joi = require('joi')

// RTC validation rules
module.exports = {
  joinCall: {
    query: {
      visionCode: Joi.string().max(20).required()
    }
  },
  inviteCall: {
    query: {
      visionCode: Joi.string().max(20).required(),
      receiverId: Joi.string().max(128).required()
    }
  },
  createStream: {
    query: {
      visionCode: Joi.string().max(20).required()
    }
  },
  joinStream: {
    query: {
      hostId: Joi.string().max(128).required()
    }
  }
}
