const qs = require('querystring')

const { createCatModel, getDetailCatModel, getDetailCatModel1, getCatModel, getCatModel1, updateCatModel, updateCatModel1, deleteCatModel, deleteCatModel1 } = require('../models/category')

module.exports = {
  createCat: (req, res) => {
    const { category } = req.body
    if (category) {
      createCatModel([category], err => {
        if (err) throw err
        res.status(201).send({
          success: true,
          message: 'Item has been created',
          data: {
            id: res.insertId,
            ...req.body
          }
        })
      })
    } else {
      res.status(400).send({
        success: false,
        message: 'All field must be filled!'
      })
    }
  },
  getCat: (req, res) => {
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
      searchKey = 'category'
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
    getCatModel([searchKey, searchValue, limit, page, sortKey, sortValue], (err, result) => {
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
          getCatModel1([searchKey, searchValue], data => {
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
  updateCat: (req, res) => {
    const { id } = req.params
    const { name, price, description } = req.body
    if (name.trim() && price.trim() && description.trim()) {
      updateCatModel(id, result => {
        if (result.length) {
          updateCatModel1([name, price, description, id], result => {
            if (result.affectedRows) {
              res.send({
                success: true,
                message: `Item with id ${id} has been updated`
              })
            } else {
              res.send({
                success: false,
                message: 'failed to update data'
              })
            }
          })
        } else {
          res.send({
            success: false,
            message: `Item with id ${id} not found`
          })
        }
      })
    } else {
      res.send({
        success: false,
        message: 'All field must be filled!'
      })
    }
  },
  deleteCat: (req, res) => {
    const id = req.params.id
    deleteCatModel(id, result => {
      if (result.length) {
        deleteCatModel1(id, result => {
          if (result.affectedRows) {
            res.send({
              success: true,
              message: `Item with id ${id} has been deleted`
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
  getDetailCat: (req, res) => {
    const id = req.params.id
    getDetailCatModel1(id, data => {
      const { category } = data[0]
      getDetailCatModel(id, result => {
        if (result.length) {
          res.send({
            success: true,
            category: `${category}`,
            data: result
          })
        } else {
          res.send({
            success: false,
            message: 'Data not found'
          })
        }
      })
    })
  }
}
