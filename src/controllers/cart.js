const qs = require('querystring')

const { createCartModel, createCartModel1, getDetailCartModel, getCartModel, getCartModel1, deleteCartModel, deleteCartModel1 } = require('../models/cart')

module.exports = {
  createCart: (req, res) => {
    const { product, quantity } = req.body
    createCartModel([product], result => {
      if (result.length) {
        const { name, price } = result[0]
        const total = quantity * price
        createCartModel1([name, quantity, price, total], result => {
          res.send({
            success: true,
            data: 'cart has been added'
          })
        })
      } else {
        res.send({
          succcess: false,
          message: 'no data'
        })
      }
    })
  },
  getCart: (req, res) => {
    let { page, limit, search, sort } = req.query
    let searchKey = ''
    let searchValue = ''
    let sortKey = ''
    let sortValue = ''
    if (typeof sort === 'object') {
      sortKey = Object.keys(sort)[0]
      sortValue = Object.values(sort)[0]
    } else {
      sortKey = 'id'
      sortValue = 'asc'
    }
    if (typeof search === 'object') {
      searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      searchKey = 'product'
      searchValue = search || ''
    }
    if (!limit) {
      limit = 5
    } else {
      limit = parseInt(limit)
    }
    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
    }
    getCartModel([searchKey, searchValue, limit, page, sortKey, sortValue], (err, result) => {
      if (!err) {
        const pageInfo = {
          count: 0,
          pages: 0,
          currentPage: page,
          limitPerPage: limit,
          nextLink: null,
          prevLink: null
        }
        if (result.length) {
          getCartModel1([searchKey, searchValue], data => {
            const { count } = data[0]
            pageInfo.count = count
            pageInfo.pages = Math.round(count / limit)

            const { pages, currentPage } = pageInfo
            if (currentPage < pages) {
              pageInfo.nextLink = `http://localhost:8080/product?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
            }
            if (currentPage > 1) {
              pageInfo.prevLink = `http://localhost:8080/product?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
            }

            res.send({
              success: true,
              message: 'List of items',
              data: result,
              pageInfo
            })
          })
        } else {
          res.send({
            success: false,
            message: 'There is no items',
            pageInfo
          })
        }
      } else {
        console.log(err)
        res.status(500).send({
          success: false,
          message: 'Internal Server Error'
        })
      }
    })
  },
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
            res.send({
              success: false,
              message: 'Failed to delete data'
            })
          }
        })
      } else {
        res.send({
          success: false,
          message: 'Data not found'
        })
      }
    })
  },
  getDetailCart: (req, res) => {
    const id = req.params.id
    getDetailCartModel(id, result => {
      if (result.length) {
        res.send({
          success: true,
          message: `Item with id ${id}`,
          data: result[0]
        })
      } else {
        res.send({
          success: false,
          message: 'Data not found'
        })
      }
    })
  }
}
