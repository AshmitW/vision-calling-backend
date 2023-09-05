require('dotenv').config() // load .env file

module.exports = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET,
  hostname: process.env.HOSTNAME,
  mongo: {
    uri: process.env.MONGOURI
  },
  transporter: {
    host: process.env.TRANSPORTER_HOST,
    port: process.env.TRANSPORTER_PORT,
    username: process.env.TRANSPORTER_USERNAME,
    password: process.env.TRANSPORTER_PASSWORD,
    sender: process.env.TRANSPORTER_SENDER
  },
  notification: {
    fcm: {
      serviceAccount: JSON.parse(process.env.FCM_CONFIG || '{}')
    }
  }
}
