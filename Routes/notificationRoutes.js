const express = require('express')
const Router = express.Router()
const notificationController = require('../Controllers/notificationController')

Router.post('/order', notificationController.orderNotification)
Router.post('/fcm', notificationController.storeFcmToken)
Router.get('/all', notificationController.sendNotificationToAll)

module.exports = Router