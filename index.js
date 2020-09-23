const express = require('express')
const bodyParser = require('body-parser')
const productRouter = require('./src/routes/product')
const categoryRouter = require('./src/routes/category')
const cartRouter = require('./src/routes/cart')
// const userRoute = require('./src/routes/users')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

// const authMiddleware = require('./src/middlewares/auth')

// app.use('/users', authMiddleware, userRoute)
app.use('/uploads', express.static('E:/riset3/src/assets/uploads/'))
app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/cart', cartRouter)

app.listen(8080, () => {
  console.log('App listening on port 8080')
})
