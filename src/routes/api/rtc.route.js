'use strict'

const express = require('express')
const router = express.Router()
const rtcController = require('../../controllers/rtc.controller')
const auth = require('../../middlewares/authorization')
const { joinCall, inviteCall, createStream, joinStream } = require('../../validations/rtc.validation')
const validator = require('express-validation')

router.get('/join-call', validator(joinCall), auth(), rtcController.joinCall) // send a join call request with validator
router.get('/invite-call', validator(inviteCall), auth(), rtcController.inviteCall) // send a invite call request with validator
router.get('/create-stream', validator(createStream), auth(), rtcController.createStream) // send a create stream request with validator
router.get('/join-stream', validator(joinStream), auth(), rtcController.joinStream) // send a join stream request with validator
router.get('/end-session', auth(), rtcController.endRtcSession) // end all RTC session

module.exports = router
