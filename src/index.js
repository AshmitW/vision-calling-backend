'use strict'

const mongoose = require('./services/mongoose')
const app = require('./services/express')
const nodemailer = require('nodemailer')
const { host, port, username, password } = require('./config').transporter

// start app and connect to database
app.start()
mongoose.connect()

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: username,
    pass: password
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages')
  }
})

module.exports = app
