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
                  usersModel.createTransaction([product, totalItem, summary, orderNo, tracking, id], result => {
                    if (result.affectedRows) {
                      const idProduct = resultCart.map(item => {
                        return item
                      })
                      for (let i = 0; i < idProduct.length; i++) {
                        const goOrder = usersModel.createNewOrderDetail({ order_id: result.insertId, user_id: idProduct[i].user_id, product_id: idProduct[i].product_id, quantity: idProduct[i].quantity, price: idProduct[i].price, total_price: idProduct[i].total_price })
                        if (i === (idProduct.length - 1) && goOrder.length) {
                          usersModel.deleteCart(id, result => {
                            if (result.affectedRows) {
                              responseStandard(res, 'purchase was succesful')
                            } else {
                              responseStandard(res, 'transaction failed', {}, 400, false)
                            }
                          })
                        }
                      }
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
  }
}
