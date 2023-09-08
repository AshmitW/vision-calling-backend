'use strict'

const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth.controller')
const auth = require('../../middlewares/authorization')
const validator = require('express-validation')
const { create, login } = require('../../validations/auth.validation')

router.post('/register', validator(create), authController.register) // validate and register
router.post('/login', validator(login), authController.login) // validate and login
router.get('/logout', auth(), authController.logout) // logout
router.get('/verify-email-id', authController.verifyEmailId) // verify the Email ID
router.get('/forgot-password', authController.forgotPassword) // forgot password
router.post('/reset-password', authController.resetPassword) // reset password

module.exports = router
