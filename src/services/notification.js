'use strict'

const firebase = require('firebase-admin')
const { notification } = require('../config')

module.exports = () => {
  firebase.initializeApp({
    credential: firebase.credential.cert(notification.fcm.serviceAccount),
    databaseURL: ''
  })
  console.info('Initialized Firebase SDK')
}
