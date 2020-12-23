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
        telephone: joi.string(),
        postal_code: joi.string().required(),
        status: joi.string()
      })
      const { value: results, error } = schema.validate(req.body)
      if (error) {
        return responseStandard(res, 'Error', { error: error.message }, 401, false)
      } else {
        usersModel.getPriAddress(id, data => {
          if (data.length) {
            const status = 'secondary'
            const telephone = '0'
            usersModel.addAddress([results.addr_name, results.recipient, results.address, results.city, telephone, results.postal_code, status, id], (result) => {
              if (result.affectedRows) {
                responseStandard(res, 'create address success', { results })
              }
            })
          } else {
            const phone = '0'
            const statuspri = 'primary'
            usersModel.addAddress([results.addr_name, results.recipient, results.address, results.city, phone, results.postal_code, statuspri, id], (result) => {
              if (result.affectedRows) {
                responseStandard(res, 'Create Address success', { results })
              } else {
                responseStandard(res, 'Failed to create address', {}, 401, false)
              }
            })
          }
        })
      }
    } else {
      responseStandard(res, 'You not a customer', {}, 401, false)
    }
  },
  editAddress: async (req, res) => {
    const role = req.user.role
    const idAdd = req.params.id
    if (role === 3) {
      const schema = joi.object({
        addr_name: joi.string(),
        recipient: joi.string(),
        address: joi.string(),
        city: joi.string(),
        telephone: joi.string(),
        postal_code: joi.string(),
        status: joi.string()
      })
      const { value: results, error } = schema.validate(req.body)
      if (error) {
        return responseStandard(res, 'Error', { error: error.message }, 401, false)
      } else {
        const data = usersModel.getPriAddressById(idAdd)
        if (data) {
          const status = 'primary'
          const telephone = '0'
          const tes = await usersModel.editAddress({ addr_name: results.addr_name, recipient: results.recipient, address: results.address, city: results.city, telephone: telephone, postal_code: results.postal_code, status: status }, idAdd)
          if (tes.affectedRows) {
            responseStandard(res, 'edit address success')
          } else {
            responseStandard(res, 'Failed edit address', {}, 401, false)
          }
        } else {
          const status = 'secondary'
          const telephone = '0'
          const result = await usersModel.editAddress({ addr_name: results.addr_name, recipient: results.recipient, address: results.address, city: results.city, telephone: telephone, postal_code: results.postal_code, status: status }, idAdd)
          console.log(result)
          if (result.affectedRows) {
            responseStandard(res, 'edit address success')
          } else {
            responseStandard(res, 'Failed edit address', {}, 401, false)
          }
        }
      }
    } else {
      responseStandard(res, 'You not a customer', {}, 401, false)
    }
  },
  changeStatus: async (req, res) => {
    const id = req.user.id
    const idAdd = req.params.id
    const data = await usersModel.getPriAddressById(idAdd)
    if (data.length) {
      responseStandard(res, 'change status success')
    } else {
      const tes = await usersModel.getPriAddressByUser(id)
      if (tes.length) {
        const findId = tes.map(item => {
          return item.id
        })
        const result = await usersModel.editAddress({ status: 'secondary' }, findId)
        if (result) {
          const results = usersModel.editAddress({ status: 'primary' }, idAdd)
          if (results) {
            responseStandard(res, 'change status success')
          } else {
            responseStandard(res, 'Failed change status', {}, 401, false)
          }
        } else {
          responseStandard(res, 'Failed change status', {}, 401, false)
        }
      } else {
        const results = usersModel.editAddress({ status: 'primary' }, idAdd)
        if (results) {
          responseStandard(res, 'change status success')
        } else {
          responseStandard(res, 'Failed change status', {}, 401, false)
        }
      }
    }
  },
  deleteAddress: async (req, res) => {
    const idAdd = req.params.id
    const idUser = req.user.id
    const result = await usersModel.deleteAddress(idAdd)
    if (result) {
      const findPri = await usersModel.getPriAddressByUser(idUser)
      if (findPri.length) {
        responseStandard(res, 'delete address success')
      } else {
        const data = await usersModel.getAddressByUser(idUser)
        if (data.length) {
          const { id } = data[0]
          const update = usersModel.editAddress({ status: 'primary' }, id)
          if (update) {
            responseStandard(res, 'delete address success')
          } else {
            responseStandard(res, 'Failed delete address', {}, 401, false)
          }
        } else {
          responseStandard(res, 'Failed delete address', {}, 401, false)
        }
      }
    } else {
      responseStandard(res, 'Failed delete address', {}, 401, false)
    }
  },
  getPriAddress: async (req, res) => {
    const idUser = req.user.id
    const result = await usersModel.getPriAddressByUser(idUser)
    if (result.length) {
      responseStandard(res, 'your primary address', { data: result })
    } else {
      responseStandard(res, 'fail to get address', {}, 401, false)
    }
  }
}
