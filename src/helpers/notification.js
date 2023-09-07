const draftNotification = (type, senderName, senderId, fcmToken, visionCode = '', agoraToken = '') => {
  try {
    const body = `${type} from ${senderName}`
    const title = 'Vision Calling'

    const notificationData = {
      message: {
        notification: {
          title: title,
          body: body
        },
        token: fcmToken
      },
      userId: senderId,
      visionCode: visionCode,
      agoraToken: agoraToken,
      sent: false,
      error: null,
      date: new Date()
    }

    return notificationData
  } catch (error) {
    return error
  }
}

exports.draftNotification = draftNotification
