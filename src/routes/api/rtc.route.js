'use strict'

const express = require('express')
const router = express.Router()
const rtcController = require('../../controllers/rtc.controller')
const auth = require('../../middlewares/authorization')

router.get('/join-request', auth(), rtcController.joinRequest) // send a join call request

module.exports = router
