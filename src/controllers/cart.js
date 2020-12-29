const responseStandard = require('../helpers/response')
const { createCartModel, updateOrder, deleteOrderDetail, createOrderDetails, createCartModel1, getDetailCartModel, deleteCartModel, deleteCartModel1, update, getDetailCartModelById, getDetailCartModelByProduct } = require('../models/cart')

module.exports = {
  createCart: async (req, res) => {
    const { product, quantity } = req.body
    const id = req.user.id
    const role = req.user.role
    if (role === 3) {
      if (product && quantity) {
        const findCart = await getDetailCartModelByProduct(id, product)
        if (findCart.length) {
          return responseStandard(res, 'cart has been added')
        } else {
          createCartModel([product], result => {
            if (result.length) {
              const { name, price } = result[0]
              const total = quantity * price
              createCartModel1([name, quantity, price, total, id, product], result => {
                if (result.affectedRows) {
                  createOrderDetails([id, product, quantity, price, total, name, result.insertId], result => {
                    if (result.affectedRows) {
                      responseStandard(res, 'cart has been added')
                    } else {
                      responseStandard(res, 'failed to added cart', {}, 400, false)
                    }
                  })
                }
              })
            } else {
              responseStandard(res, 'failed to added cart', {}, 400, false)
            }
          })
        }
      } else {
        responseStandard(res, 'all field must be filled', {}, 400, false)
      }
    } else {
      responseStandard(res, 'You not a customer', {}, 401, false)
    }
  },
  // getCart: (req, res) => {
  //   let { page, limit, search, sort } = req.query
  //   let searchKey = ''
  //   let searchValue = ''
  //   let sortKey = ''
  //   let sortValue = ''
  //   if (typeof sort === 'object') {
  //     sortKey = Object.keys(sort)[0]
  //     sortValue = Object.values(sort)[0]
  //   } else {
  //     sortKey = 'id'
  //     sortValue = 'asc'
  //   }
  //   if (typeof search === 'object') {
  //     searchKey = Object.keys(search)[0]
  //     searchValue = Object.values(search)[0]
  //   } else {
  //     searchKey = 'product'
  //     searchValue = search || ''
  //   }
  //   if (!limit) {
  //     limit = 5
  //   } else {
  //     limit = parseInt(limit)
  //   }
  //   if (!page) {
  //     page = 1
  //   } else {
  //     page = parseInt(page)
  //   }
  //   getCartModel([searchKey, searchValue, limit, page, sortKey, sortValue], (err, result) => {
  //     if (!err) {
  //       const pageInfo = {
  //         count: 0,
  //         pages: 0,
  //         currentPage: page,
  //         limitPerPage: limit,
  //         nextLink: null,
  //         prevLink: null
  //       }
  //       if (result.length) {
  //         getCartModel1([searchKey, searchValue], data => {
  //           const { count } = data[0]
  //           pageInfo.count = count
  //           pageInfo.pages = Math.round(count / limit)

  //           const { pages, currentPage } = pageInfo
  //           if (currentPage < pages) {
  //             pageInfo.nextLink = `http://localhost:8080/product?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
  //           }
  //           if (currentPage > 1) {
  //             pageInfo.prevLink = `http://localhost:8080/product?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
  //           }

  //           res.send({
  //             success: true,
  //             message: 'List of items',
  //             data: result,
  //             pageInfo
  //           })
  //         })
  //       } else {
  //         res.send({
  //           success: false,
  //           message: 'There is no items',
  //           pageInfo
  //         })
  //       }
  //     } else {
  //       console.log(err)
  //       res.status(500).send({
  //         success: false,
  //         message: 'Internal Server Error'
  //       })
  //     }
  //   })
  // },
  deleteCart: (req, res) => {
    const id = req.params.id
    deleteCartModel(id, result => {
      if (result.length) {
        deleteCartModel1(id, result => {
          if (result.affectedRows) {
            deleteOrderDetail(id, result => {
              if (result.affectedRows) {
                responseStandard(res, `Cart with id ${id} has been deleted`)
              } else {
                responseStandard(res, 'Failed to delete data', {}, 400, false)
              }
            })
          } else {
            responseStandard(res, 'Failed to delete data', {}, 400, false)
          }
        })
      } else {
        responseStandard(res, 'Data not found', {}, 400, false)
      }
    })
  },
  getDetailCart: (req, res) => {
    const id = req.user.id
    getDetailCartModel(id, result => {
      if (result.length) {
        responseStandard(res, 'Success get cart', { data: result })
      } else {
        responseStandard(res, 'Data not found', {}, 400, false)
      }
    })
  },
  updateCartIncrement: async (req, res) => {
    const id = req.params.id
    const result = await getDetailCartModelById(id)
    if (result.length) {
      const quantity = result.map(item => {
        return item.quantity + 1
      })
      const count = result.map(item => {
        return item.price * quantity
      })
      const data = await update({ quantity: quantity, total_price: count }, id)
      if (data) {
        const results = await updateOrder({ quantity: quantity, total_price: count }, id)
        if (results) {
          responseStandard(res, 'Success update cart')
        } else {
          responseStandard(res, 'Failed update cart', {}, 400, false)
        }
      } else {
        responseStandard(res, 'Failed update cart', {}, 400, false)
      }
    }
  },
  updateCartDecrement: async (req, res) => {
    const id = req.params.id
    const result = await getDetailCartModelById(id)
    if (result.length) {
      const quantity = result.map(item => {
        return item.quantity - 1
      })
      const count = result.map(item => {
        return item.price * quantity
      })
      if (quantity <= 0) {
        deleteCartModel1(id, result => {
          if (result.affectedRows) {
            deleteOrderDetail(id, result => {
              if (result.affectedRows) {
                responseStandard(res, `Cart with id ${id} has been deleted`)
              } else {
                responseStandard(res, 'Failed to delete data', {}, 400, false)
              }
            })
          } else {
            responseStandard(res, 'Failed to delete data', {}, 400, false)
          }
        })
      } else {
        const data = await update({ quantity: quantity, total_price: count }, id)
        if (data) {
          const results = await updateOrder({ quantity: quantity, total_price: count }, id)
          if (results) {
            responseStandard(res, 'Success update cart')
          } else {
            responseStandard(res, 'Failed update cart', {}, 400, false)
          }
        } else {
          responseStandard(res, 'Failed update cart', {}, 400, false)
        }
      }
    }
  }
}
