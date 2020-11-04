const mysql = require('mysql')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '123',
  database: 'ecommerce'
})
conn.connect()
module.exports = conn
