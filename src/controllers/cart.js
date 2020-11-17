const responseStandard = require('../helpers/response')
const { createCartModel, createCartModel1, getPicture, getDetailCartModel, deleteCartModel, deleteCartModel1 } = require('../models/cart')

module.exports = {
  createCart: (req, res) => {
    const { product, quantity } = req.body
    const id = req.user.id
    const role = req.user.role
    if (role === 3) {
      if (product && quantity) {
        createCartModel([product], result => {
          if (result.length) {
            const { name, price } = result[0]
            const total = quantity * price
            createCartModel1([name, quantity, price, total, id, product], result => {
              if (result.affectedRows) {
                responseStandard(res, 'cart has been added')
              }
            })
          } else {
            responseStandard(res, 'failed to added cart', {}, 400, false)
          }
        })
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
            res.send({
              success: true,
              message: `Cart with id ${id} has been deleted`
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
        const product = result.product_id
	getPicture(product, data => {
	if (data.length) {
	  const url = data
	  responseStandard(res, 'Success get cart', {data: {result, url}}) 
	}
	})
      } else {
        responseStandard(res, 'Data not found', {}, 400, false)
      }
    })
  }
}
