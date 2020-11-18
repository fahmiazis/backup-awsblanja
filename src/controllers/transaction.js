const usersModel = require('../models/users')
const responseStandard = require('../helpers/response')

function noOrder () {
  return Math.ceil(Math.random() * 100000)
}

function trackingNumber () {
  return Math.ceil(Math.random() * 100000000)
}

module.exports = {
  buy: (req, res) => {
    const id = req.user.id
    usersModel.getCart(id, result => {
      if (result.length) {
        const sum = result.map(item => {
          return item.total_price
        })
        const item = result.map(item => {
          return item.product
        })
        const amount = result.map(item => {
          return item.quantity
        })
        const product = item.toString()
        const totalItem = amount.reduce((total, value) => total + value, 0)
        const summary = sum.reduce((total, value) => total + value, 0)
        usersModel.getDetailProfile(id, result => {
          if (result.length) {
            const balance = result[0].balance
            const count = balance - (summary + 30000)
            if (count >= 0) {
              usersModel.updateBalance([id, count], result => {
                if (result.affectedRows) {
                  const orderNo = noOrder() + id.toString()
                  const tracking = 'TR' + trackingNumber() + id.toString()
                  usersModel.createTransaction([product, totalItem, summary, orderNo, tracking, id], result => {
                    if (result.affectedRows) {
                      usersModel.deleteCart(id, result => {
                        if (result.affectedRows) {
                          responseStandard(res, 'purchase was succesful')
                        } else {
                          responseStandard(res, 'transaction failed', {}, 400, false)
                        }
                      })
                    } else {
                      responseStandard(res, 'transaction failed', {}, 400, false)
                    }
                  })
                } else {
                  responseStandard(res, 'transaction failed', {}, 400, false)
                }
              })
            } else {
              responseStandard(res, 'less balance', {}, 401, false)
            }
          }
        })
      }
    })
  },
  getHistoryTransaction: (req, res) => {
    const id = req.user.id
    usersModel.getHistoryTransaction(id, result => {
      if (result.length) {
        responseStandard(res, 'your history transaction', { data: result })
      } else {
        responseStandard(res, 'you haven\'t history transaction')
      }
    })
  }
}
