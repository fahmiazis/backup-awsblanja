const mysql = require('mysql')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'ecommerce'
})
conn.connect()
module.exports = conn
