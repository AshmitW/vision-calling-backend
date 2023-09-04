'use strict'
const express = require('express')
const router = express.Router()
const authRouter = require('./auth.route')
const userRouter = require('./user.route')

router.get('/status', (req, res) => { res.send({status: 'success'}) }) // api status
router.use('/auth', authRouter) // mount auth paths
router.use('/user', userRouter) // mount user paths

module.exports = router
