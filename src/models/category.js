const db = require('../helpers/db')
const table = 'category'

module.exports = {
  getDetailCatModel: (id, cb) => {
    db.query(`SELECT * FROM product WHERE category LIKE '%${id[0]}%'`, (_err, result, _field) => {
      cb(result)
    })
  },
  getDetailCatModel1: (id, cb) => {
    db.query(`SELECT * FROM ${table} WHERE id LIKE '%${id[0]}%'`, (_err, data, _field) => {
      cb(data)
    })
  },
  createCatModel: (arr, cb) => {
    db.query(`INSERT INTO ${table} (category) VALUES ('${arr[0]}')`, (err, _result, _fields) => {
      cb(err)
    })
  },
  getCatModel: (arr, cb) => {
    const query = `SELECT category FROM ${table} WHERE ${arr[0]} LIKE '%${arr[1]}%' ORDER BY ${arr[4]} ${arr[5]} LIMIT ${arr[2]} OFFSET ${(arr[3] - 1) * arr[2]}`
    db.query(query, (err, result, _field) => {
      cb(err, result)
    })
  },
  getCatModel1: (arr, cb) => {
    const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${arr[0]} LIKE '%${arr[1]}%'`
    db.query(query, (_err, data, _field) => {
      cb(data)
    })
  },
  updateCatModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  },
  updateCatModel1: (arr, cb) => {
    const query = `UPDATE ${table} SET name='${arr[0]}', price=${arr[1]}, description='${arr[2]}' WHERE id=${arr[3]}`
    db.query(query, (_err, result, _field) => {
      cb(result)
    })
  },
  deleteCatModel: (id, cb) => {
    const query = `SELECT * FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  },
  deleteCatModel1: (id, cb) => {
    const query = `DELETE FROM ${table} WHERE id=${id}`
    db.query(query, (_err, result, _fields) => {
      cb(result)
    })
  }
}
