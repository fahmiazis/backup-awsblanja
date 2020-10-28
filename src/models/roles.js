const db = require('../helpers/db')
const table = 'roles'

module.exports = {
  createRoleModel: (arr, cb) => {
    db.query(`INSERT INTO ${table} (name) VALUES ("${arr[0]}")`, (_err, result, _fields) => {
      cb(result)
    })
  }
}
