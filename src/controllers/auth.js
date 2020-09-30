const jwt = require('jsonwebtoken')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const responseStandard = require('../helpers/response')
const { validateUser } = require('../models/users')
const usersModel = require('../models/users')

module.exports = {
  loginController: async (req, res) => {
    const { email, password } = req.body
    validateUser([email], (result) => {
      if (result.length) {
        if (result[0].email === email) {
          const iduser = result[0].id
          const role = result[0].role_id
          bcrypt.compare(password, result[0].password, function (_err, result) {
            if (result === true) {
              jwt.sign({ id: result.id }, 'KODERAHASIA', (_err, token) => {
                return responseStandard(res, 'login success', { user: `${iduser}`, role: `${role}`, Token: `${token}` })
              })
            } else {
              return responseStandard(res, 'Wrong password', {}, 400, false)
            }
          })
        } else {
          return responseStandard(res, 'Wrong email', {}, 400, false)
        }
      } else {
        return responseStandard(res, 'Wrong email', {}, 400, false)
      }
    })
  },
  signupSellerController: async (req, res) => {
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().required(),
      phone_number: joi.string().required(),
      store: joi.string().required(),
      password: joi.string().required()
    })

    let { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const roleId = 2
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
        usersModel.createSeller([roleId, results.email, results.password], (result) => {
          if (result.affectedRows) {
            result = {
              id: result.insertId,
              ...results
            }
            usersModel.createDetailUsers([results.name, results.phone_number, results.store, result.id], (data) => {
              if (data.affectedRows) {
                data = {
                  id: data.insertId,
                  ...results
                }
                return responseStandard(res, 'Create user successfully', { data })
              } else {
                return responseStandard(res, 'Failed to create user', {}, 401, false)
              }
            })
          } else {
            return responseStandard(res, 'Failed to create user', {}, 500, false)
          }
        })
      }
    }
  },
  signupCustomerController: async (req, res) => {
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required()
    })

    let { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const roleId = 3
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
        usersModel.createSeller([roleId, results.email, results.password], (result) => {
          if (result.affectedRows) {
            result = {
              id: result.insertId,
              ...results
            }
            usersModel.createDetailUsers([results.name, [], [], result.id], (data) => {
              if (data.affectedRows) {
                data = {
                  id: data.insertId,
                  ...results
                }
                return responseStandard(res, 'Create user successfully', { data })
              } else {
                return responseStandard(res, 'Failed to create user', {}, 401, false)
              }
            })
          } else {
            return responseStandard(res, 'Failed to create user', {}, 500, false)
          }
        })
      }
    }
  },
  getDetailProfile: (req, res) => {
    const { id } = req.params
    usersModel.getDetailProfile(id, result => {
      if (result.length) {
        responseStandard(res, ` User ${id}`, { data: result })
      } else {
        responseStandard(res, 'User Not found', {}, 401, false)
      }
    })
  },
  updateProfileCustomer: (req, res) => {
    const { id } = req.params
    const { name, email, phone, gender, birthday, store } = req.body
    if (name.trim() || email.trim() || phone.trim() || gender.trim() || birthday.trim() || store.trim()) {
      usersModel.getDetailProfile(id, result => {
        if (result.length) {
          if (result.role_id !== 3) {
            responseStandard(res, 'user not a custommer')
          } else {
            const data = Object.entries(req.body).map(item => {
              return parseInt(item[1]) > 0 ? `${item[0]}=${item[1]}` : `${item[0]}='${item[1]}'`
            })
            usersModel.updatePartialProfile([id, data], result => {
              if (result.affectedRows) {
                responseStandard(res, `user profile ${id} has been updated`)
              } else {
                res.send({
                  success: false,
                  message: 'Failed to update data'
                })
              }
            })
          }
        } else {
          res.send({
            success: false,
            message: `There is no item with id ${id}`
          })
        }
      })
    } else {
      res.send({
        success: false,
        message: 'At least one column is filled'
      })
    }
  }
}
