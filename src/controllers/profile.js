const usersModel = require('../models/users')
const responseStandard = require('../helpers/response')
const joi = require('joi')

module.exports = {
  getProfile: (req, res) => {
    const id = req.user.id
    usersModel.getProfile(id, result => {
      if (result.length) {
        usersModel.getDetailProfile(id, data => {
          if (data.length) {
            responseStandard(res, 'Data user', { data })
          } else {
            responseStandard(res, 'User Not found', {}, 401, false)
          }
        })
      } else {
        responseStandard(res, 'User Not found', {}, 401, false)
      }
    })
  },
  updateProfileVii: (req, res) => {
    const id = req.user.id
    const schema = joi.object({
      name: joi.string(),
      email: joi.string(),
      phone: joi.string(),
      gender: joi.string(),
      birthday: joi.string()
    })

    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const result = usersModel.updatePartialProfile(results, id)
      if (result) {
        responseStandard(res, `user profile ${id} has been updated`)
      } else {
        responseStandard(res, 'Failed to update profile', {}, 401, false)
      }
    }
  },
  updateProfile: (req, res) => {
    const id = req.user.id
    const { name, email, phone, gender, birthday, store } = req.body
    if (email) {
      const isExist = usersModel.getUserByCondition({ email })
      if (isExist.length > 0) {
        return responseStandard(res, 'Email already used', {}, 401, false)
      } else {
        usersModel.updateEmail([id, email.trim()], result => {
          if (result.affectedRows) {
            responseStandard(res, 'Email has been updated')
          } else {
            responseStandard(res, 'Fail update email', {}, 401, false)
          }
        })
      }
    }
    if (name || phone || gender || birthday || store || email) {
      usersModel.getDetailProfile(id, result => {
        if (result.length) {
          const data = Object.entries(req.body).map(item => {
            return parseInt(item[1]) > 0 ? `${item[0].trim()}='${item[1]}'` : `${item[0].trim()}='${item[1]}'`
          })
          usersModel.updatePartialProfile([id, data], result => {
            if (result.affectedRows) {
              responseStandard(res, `user profile ${id} has been updated`)
            } else {
              responseStandard(res, 'Failed to update profile', {}, 401, false)
            }
          })
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
  },
  updateImage: (req, res) => {
    const id = req.user.id
    const role = req.user.role
    if (role === 3 || role === 2) {
      const picture = `uploads/${req.file.filename}`
      usersModel.postPictModel([id, picture], result => {
        if (result) {
          responseStandard(res, `user profile ${id} has been updated`)
        } else {
          responseStandard(res, 'Failed to update profile', {}, 401, false)
        }
      })
    } else {
      responseStandard(res, 'You not a customer', {}, 500, false)
    }
  },
  getCheckout: (req, res) => {
    const id = req.user.id
    const role = req.user.role
    if (role === 3) {
      usersModel.getCart(id, data1 => {
        if (data1.length) {
          const sum = data1.map(item => {
            return item.total_price
          })
          const summary = sum.reduce((total, value) => total + value, 0)
          usersModel.getAddress(id, data2 => {
            if (data2.length) {
              responseStandard(res, 'This is your item', { product: data1, address: data2, summary: summary })
            } else {
              responseStandard(res, 'fail to show your checkuot page', {}, 401, false)
            }
          })
        } else {
          responseStandard(res, 'fail to show your checkuot page', {}, 401, false)
        }
      })
    } else {
      responseStandard(res, 'You not a customer', {}, 500, false)
    }
  },
  getAddress: (req, res) => {
    const id = req.user.id
    usersModel.getAddress(id, result => {
      if (result.length) {
        responseStandard(res, 'This is your item', { data: result })
      } else {
        responseStandard(res, 'fail to show your checkuot page', {}, 401, false)
      }
    })
  }
}
