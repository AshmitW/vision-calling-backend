const firebase = require('firebase-admin')

module.exports = async function (req, res, next) {
  if (!req.notificationData) next()
  let notificationData = req.notificationData
  try {
    await firebase.messaging().send(req.notificationData.message)
    notificationData.sent = true
  } catch (error) {
    notificationData.error = error.message
  }
  return ''
}
