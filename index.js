const express = require('express')
const bodyParser = require('body-parser')

const productRouter = require('./src/routes/product')
const categoryRouter = require('./src/routes/category')
const cartRouter = require('./src/routes/cart')
const roleRouter = require('./src/routes/roles')
const userRoute = require('./src/routes/users')
const condition = require('./src/routes/conditions')
const home = require('./src/routes/home')
const authRoute = require('./src/routes/auth')
const profileroute = require('./src/routes/profile')
const cors = require('cors')
// const APP_URL  = process.env
require('dotenv/config')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

const authMiddleware = require('./src/middlewares/auth')

app.use('/auth', authRoute)
app.use('/users', authMiddleware, userRoute)
app.use('/uploads', express.static('assets/uploads/'))
app.use('/product', authMiddleware, productRouter)
app.use('/home', home)
app.use('/profile', authMiddleware, profileroute)
app.use('/category', authMiddleware, categoryRouter)
app.use('/cart', authMiddleware, cartRouter)
app.use('/roles', authMiddleware, roleRouter)
app.use('/conditions', authMiddleware, condition)

app.listen(7070, () => {
  console.log('App listening on port 7070')
})
