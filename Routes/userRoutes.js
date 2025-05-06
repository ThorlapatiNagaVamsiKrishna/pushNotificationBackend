const express = require('express')
const Router = express.Router()
const userController = require('../Controllers/userController')

Router.post('/register', userController.userRegister)
Router.post('/login', userController.userLogin)
Router.post('/otp', userController.otpVerification)

module.exports = Router