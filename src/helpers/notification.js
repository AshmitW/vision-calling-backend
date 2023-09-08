'use strict'
const draftNotification = (type, sender, receiver, visionCode = '', agoraToken = '', msg = '') => {
  try {
    const body = type === 'call' ? `Incoming call invitation` : `${msg}`
    const title = sender.name

    const notificationData = {
      message: {
        notification: {
          title: title,
          body: body
        },
        data: {
          type: type,
          senderId: sender._id,
          receiverId: receiver._id,
          visionCode: visionCode,
          agoraToken: agoraToken
        },
        token: receiver.fcmToken
      },
      type: type,
      senderId: sender._id,
      receiverId: receiver._id,
      visionCode: visionCode,
      agoraToken: agoraToken,
      sent: false,
      error: null
    }

    return notificationData
  } catch (error) {
    return error
  }
}

exports.draftNotification = draftNotification
