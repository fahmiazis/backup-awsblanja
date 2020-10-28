const usersModel = require('../models/users')
const paging = require('../helpers/pagination')
const responseStandard = require('../helpers/response')
const joi = require('joi')
const bcrypt = require('bcryptjs')

module.exports = {
  getUser: async (req, res) => {
    const count = await usersModel.countUsers()
    const page = paging(req, count)
    const { offset, pageInfo } = page
    const { limitData: limit } = pageInfo
    const results = await usersModel.getUser([limit, offset])
    return responseStandard(res, 'List of users', { results, pageInfo })
  },
  createUser: async (req, res) => {
    const schema = joi.object({
      role_id: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required()
    })

    let { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const { email } = results
      const isExist = await usersModel.getUserByCondition({ email })
      if (isExist.length > 0) {
        return responseStandard(res, 'Email already used', {}, 401, false)
      } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(results.password, salt)
        results = {
          ...results,
          password: hashedPassword
        }
        const data = await usersModel.createUsers(results)
        if (data.affectedRows) {
          results = {
            id: data.insertId,
            ...results
          }
          return responseStandard(res, 'Create user successfully', { results })
        } else {
          return responseStandard(res, 'Failed to create user', {}, 401, false)
        }
      }
    }
  },
  addAddress: (req, res) => {
    const id = req.user.id
    const role = req.user.role
    if (role === 3) {
      const schema = joi.object({
        addr_name: joi.string().required(),
        recipient: joi.string().required(),
        address: joi.string().required(),
        city: joi.string().required(),
        telephone: joi.string().required(),
        postal_code: joi.string().required(),
        status: joi.string().required()
      })
      const { value: results, error } = schema.validate(req.body)
      if (error) {
        return responseStandard(res, 'Error', { error: error.message }, 401, false)
      } else {
        usersModel.addAddress([results.addr_name, results.recipient, results.address, results.city, results.telephone, results.postal_code, results.status, id], (result) => {
          if (result.affectedRows) {
            responseStandard(res, 'Create Address success', { results })
          } else {
            responseStandard(res, 'Failed to create user', {}, 401, false)
          }
        })
      }
    } else {
      responseStandard(res, 'You not a customer', {}, 401, false)
    }
  }
}
