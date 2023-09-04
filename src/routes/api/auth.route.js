'use strict'

const express = require('express')
const router = express.Router()
const authController = require('../../controllers/auth.controller')
const validator = require('express-validation')
const { create, login } = require('../../validations/auth.validation')

router.post('/register', validator(create), authController.register) // validate and register
router.post('/login', validator(login), authController.login) // validate and login
router.get('/confirm', authController.confirm)

module.exports = router
