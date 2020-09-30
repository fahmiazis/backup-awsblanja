const route = require('express').Router()
const { loginController, signupSellerController, signupCustomerController } = require('../controllers/auth')

route.post('/login', loginController)
route.post('/signup/seller', signupSellerController)
route.post('/signup/customer', signupCustomerController)

module.exports = route
