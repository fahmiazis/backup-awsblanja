const usersModel = require('../models/users')
const responseStandard = require('../helpers/response')
const cartModel = require('../models/cart')

function noOrder () {
  return Math.ceil(Math.random() * 100000)
}

function trackingNumber () {
  return Math.ceil(Math.random() * 100000000)
}

module.exports = {
  buy: (req, res) => {
    const id = req.user.id
    usersModel.getNewCart(id, resultCart => {
      if (resultCart.length) {
        const sum = resultCart.map(item => {
          return item.total_price
        })
        const item = resultCart.map(item => {
          return item.product
        })
        const amount = resultCart.map(item => {
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
                  usersModel.createTransaction([product, totalItem, summary, orderNo, tracking, id], resultBuy => {
                    if (resultBuy.affectedRows) {
                      usersModel.deleteCart(id, result => {
                        if (result.affectedRows) {
                          usersModel.updateOrderId([resultBuy.insertId, id], results => {
                            if (results.affectedRows) {
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
                  responseStandard(res, 'transaction failed', {}, 400, false)
                }
              })
            } else {
              responseStandard(res, 'less balance', {}, 401, false)
            }
          } else {
            responseStandard(res, 'you have no item', {}, 400, false)
          }
        })
      } else {
        responseStandard(res, 'you have no item', {}, 400, false)
      }
    })
  },
  getHistoryTransaction: (req, res) => {
    const id = req.user.id
    usersModel.getHistoryTransaction(id, result => {
      if (result.length) {
        usersModel.getHistoryCount(id, results => {
          if (results.length) {
            responseStandard(res, 'your history transaction', { data: result, count: results[0].count })
          } else {
            responseStandard(res, 'you haven\'t history transaction')
          }
        })
      } else {
        responseStandard(res, 'you haven\'t history transaction')
      }
    })
  },
  getOrderDetails: (req, res) => {
    const id = req.params.id
    cartModel.getOrderDetails(id, result => {
      if (result.length) {
        responseStandard(res, 'Success get order details', { data: result })
      } else {
        responseStandard(res, 'Data not found', {}, 400, false)
      }
    })
  },
  getHistoryDetails: (req, res) => {
    const id = req.params.id
    usersModel.getHistoryDetail(id, result => {
      if (result.length) {
        responseStandard(res, 'Success get history details', { data: result })
      } else {
        responseStandard(res, 'Data not found', {}, 400, false)
      }
    })
  }
}
