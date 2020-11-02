const mysql = require('mysql')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'root1234',
  database: 'ecommerce'
})
conn.connect()
module.exports = conn
