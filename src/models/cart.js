const db = require('../helpers/db')
const table = 'cart'

module.exports = {
  getDetailCartModel: (id, cb) => {
    db.query(`SELECT cart.id, cart.product, cart.quantity, cart.price, cart.total_price, cart.user_id, cart.product_id, product_images.url FROM ${table} INNER JOIN product_images ON cart.product_id=product_images.product_id WHERE user_id=${id} ORDER BY id desc`, (_err, result, _field) => {
      cb(result)
    })
  },
  getDetailCartModelById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table} WHERE id=${id}`, (_err, result, _field) => {
        if (_err) {
          reject(_err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getDetailCartModelByProduct: (id, product) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table} WHERE user_id=${id} AND product_id=${product}`, (_err, result, _field) => {
        if (_err) {
          reject(_err)
        } else {
          resolve(result)
        }
      })
    })
  },
  createCartModel: (arr, cb) => {
    db.query(`SELECT * FROM products WHERE id=${arr[0]}`, (_err, result, _fields) => {
      cb(result)
    })
  },
  createCartModel1: (arr, cb) => {
    db.query(`INSERT INTO ${table} (product, quantity, price, total_price, user_id, product_id) VALUES ('${arr[0]}', ${arr[1]}, ${arr[2]}, ${arr[3]}, ${arr[4]}, ${arr[5]})`, (_err, result, _fields) => {
      cb(result)
    })
  },
  getCartModel: (arr, cb) => {
    const query = `SELECT * FROM ${table} WHERE ${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${arr[4]} ${arr[5]} LIMIT ${arr[2]} OFFSET ${(arr[3] - 1) * arr[2]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getCartModel1: (arr, cb) => {
    const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${arr[0]} LIKE '%${arr[1]}%'`
    db.query(query, (_err, data, _field) => {
      cb(data)
    })
  },
  deleteCartModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  },
  deleteCartModel1: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  },
  update: (data, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], (_err, result, _field) => {
        if (_err) {
          reject(_err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
