const draftNotification = (type, senderName, senderId, fcmToken) => {
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
    sent: false,
    error: null,
    date: new Date()
  }

  return notificationData
}

exports.draftNotification = draftNotification
