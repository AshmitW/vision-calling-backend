'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user.controller')
const auth = require('../../middlewares/authorization')
const { update, changePassword } = require('../../validations/user.validation')
const validator = require('express-validation')

router.get('/me', auth(), userController.me) // get current user info
router.post('/update', validator(update), auth(), userController.update) // validate and update user
router.post('/change-password', validator(changePassword), auth(), userController.changePassword) // validate and change password
router.get('/all', auth(), userController.getAll) // get all users
router.get('/get', auth(), userController.getUser) // get user

module.exports = router
