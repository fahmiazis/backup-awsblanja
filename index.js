const express = require('express')
const bodyParser = require('body-parser')
const productRouter = require('./src/routes/product')
const categoryRouter = require('./src/routes/category')
const cartRouter = require('./src/routes/cart')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/cart', cartRouter)

app.listen(8080, () => {
  console.log('App listening on port 8080')
})
