const draftNotification = (type, senderName, senderId, fcmToken) => {
  let body = `${type} from ${senderName}`
  let title = 'Vision Calling'

  let notificationData = {
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
