const { createRoleModel } = require('../models/Roles')

module.exports = {
  createRole: (req, res) => {
    const { name } = req.body
    if (name) {
      createRoleModel([name], result => {
        res.status(201).send({
          success: true,
          message: 'Item has been created',
          data: {
            id: res.insertId,
            ...req.body
          }
        })
      })
    } else {
      res.status(400).send({
        success: false,
        message: 'All field must be filled!'
      })
    }
  }
}
