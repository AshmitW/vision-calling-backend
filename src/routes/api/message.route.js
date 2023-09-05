'use strict'

const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/message.controller')
const auth = require('../../middlewares/authorization')
const { send } = require('../../validations/message.validation')
const validator = require('express-validation')

router.get('/all', auth(), messageController.getAllMessages) // get all current user's msges
router.post('/send', validator(send), auth(), messageController.sendMessage) // send message

module.exports = router
