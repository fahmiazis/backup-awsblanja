const db = require('../helpers/db')
const table = 'products'

module.exports = {
  getDetailItemModel: (id, cb) => {
    db.query(`SELECT products.id, products.name, products.price, products.description, products.created_at, product_images.url FROM ${table} INNER JOIN product_images ON products.id=product_images.product_id WHERE products.id=${id}`, (_err, result, _field) => {
      cb(result)
    })
  },
  createItemModel: (arr, cb) => {
    db.query(`INSERT INTO ${table} (name, price, quantity, condition_id, description, category_id) VALUES ("${arr[0]}", ${arr[1]}, ${arr[2]}, ${arr[3]}, "${arr[4]}", ${arr[5]})`, (_err, result, _fields) => {
      cb(result)
    })
  },
  validateCat: (arr, cb) => {
    db.query(`SELECT * FROM category WHERE id LIKE '%${arr[0]}%'`, (_err, result, _fields) => {
      cb(result)
    })
  },
  validateCond: (arr, cb) => {
    db.query(`SELECT * FROM conditions WHERE id LIKE '%${arr[0]}%'`, (_err, result, _fields) => {
      cb(result)
    })
  },
  postPictModel: (arr, cb) => {
    db.query(`INSERT INTO product_images (product_id, url) VALUES (${arr[0]}, '${arr[1]}')`, (_err, result, _field) => {
      cb(result)
    })
  },
  getItemModel: (arr, cb) => {
    const query = `SELECT products.id, products.name, products.price, products.description, products.created_at, product_images.url FROM ${table} INNER JOIN product_images ON products.id=product_images.product_id WHERE ${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${arr[4]} ${arr[5]} LIMIT ${arr[2]} OFFSET ${(arr[3] - 1) * arr[2]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getItemModel1: (arr, cb) => {
    const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${arr[0]} LIKE '%${arr[1]}%'`
    db.query(query, (_err, data, _field) => {
      cb(data)
    })
  },
  // getItemModel2: (_arr, cb) => {
  //   const query = `SELECT ${table}.id, ${table}.name, ${table}.price, ${table}.description, category.category FROM ${table} INNER JOIN category ON ${table}.category = category.id`
  //   db.query(query, (_err, result1, _field) => {
  //     cb(result1)
  //   })
  // },
  updateItemModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  },
  updateItemModel1: (arr, cb) => {
    const query = `UPDATE ${table} SET name='${arr[0]}', price=${arr[1]}, description='${arr[2]}' WHERE id=${arr[3]}`
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  },
  updatePartialItemModel: (arr, cb) => {
    const query = `UPDATE ${table} SET ${arr[1]} WHERE id=${arr[0]}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  },
  deleteItemModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  },
  deleteItemModel1: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  }
}
