const db = require('../helpers/db')
const table = 'users'

module.exports = {
  getUser: (data = []) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table} LIMIT ? OFFSET ?`, data, (err, results, _fields) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  countUsers: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as count FROM ${table}`, (err, results, _fields) => {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].count)
        }
      })
    })
  },
  validateUser: (arr, cb) => {
    db.query(`SELECT * FROM ${table} WHERE email LIKE '%${arr[0]}%'`, (_err, result, _fields) => {
      cb(result)
    })
  },
  getUserByCondition: (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${table} WHERE ?`, data, (err, results, _fields) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  createUsers: (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO ${table} SET ?`, data, (err, results, _fields) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  createSeller: (arr, cb) => {
    db.query(`INSERT INTO ${table} (role_id, email, password) VALUES (${arr[0]}, '${arr[1]}', '${arr[2]}')`, (_err, result, _fields) => {
      cb(result)
    })
  },
  createDetailUsers: (arr, cb) => {
    db.query(`INSERT INTO user_details (email, name, balance, user_id) VALUES ('${arr[0]}', '${arr[1]}', 500000, ${arr[2]})`, (_err, results, _fields) => {
      cb(results)
    })
  },
  createDetailSeller: (arr, cb) => {
    db.query(`INSERT INTO store (name, phone_number, user_id, email) VALUES ('${arr[0]}', ${arr[1]}, ${arr[2]}, '${arr[3]}')`, (_err, results, _fields) => {
      cb(results)
    })
  },
  getProfile: (id, cb) => {
    db.query(`SELECT * FROM ${table} WHERE id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  },
  getDetailProfile: (id, cb) => {
    db.query(`SELECT * FROM user_details WHERE user_id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  },
  postPictModel: (arr, cb) => {
    db.query(`UPDATE user_details SET picture='${arr[1]}' where user_id=${arr[0]} `, (_err, result, _field) => {
      cb(result)
    })
  },
  updateEmail: (arr, cb) => {
    db.query(`UPDATE ${table} SET email='${arr[1]}' where id=${arr[0]}`)
  },
  updatePartialProfile: (arr, id) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE user_details SET ? WHERE user_id = ?', [arr, id], (_err, result, _fields) => {
        if (_err) {
          reject(_err)
        } else {
          resolve(result)
        }
      })
    })
  },
  addAddress: (arr, cb) => {
    db.query(`INSERT INTO user_address (addr_name, recipient, address, city, telephone, postal_code, status, user_id) VALUES ('${arr[0]}', '${arr[1]}', '${arr[2]}', '${arr[3]}', ${arr[4]}, ${arr[5]}, '${arr[6]}', ${arr[7]})`, (_err, result, _fields) => {
      cb(result)
    })
  },
  addCheckout: (arr, cb) => {
    db.query(`INSERT INTO checkout (user_id) VALUES (${arr[0]})`, (_err, result, _field) => {
      cb(result)
    })
  },
  getCheckout: (arr, cb) => {
    db.query(`SELECT * FROM checkout WHERE user_id=${arr[0]}`, (_err, result, _field) => {
      cb(result)
    })
  },
  getCart: (id, cb) => {
    db.query(`SELECT product, quantity, price, total_price FROM cart WHERE user_id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  },
  getAddress: (id, cb) => {
    db.query(`SELECT * FROM user_address WHERE user_id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  },
  deleteCart: (id, cb) => {
    db.query(`DELETE FROM cart WHERE user_id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  },
  createTransaction: (arr, cb) => {
    db.query(`INSERT INTO transaction (item, amount, delivery, summary, order_no, no_tracking, user_id) VALUES ('${arr[0]}', ${arr[1]}, 15000, ${arr[2]}, ${arr[3]}, '${arr[4]}', ${arr[5]})`, (_err, result, _field) => {
      cb(result)
    })
  },
  updateBalance: (arr, cb) => {
    db.query(`UPDATE user_details SET balance=${arr[1]} WHERE user_id=${arr[0]}`, (_err, result, _field) => {
      cb(result)
    })
  },
  getHistoryTransaction: (id, cb) => {
    db.query(`SELECT * FROM transaction WHERE user_id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  }
}
