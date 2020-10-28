const qs = require('querystring')
const responseStandard = require('../helpers/response')
const { createItemModel, validateCat, validateCond, postPictModel, getDetailItemModel, getItemModel, getItemModel1, updateItemModel, updateItemModel1, updatePartialItemModel, deleteItemModel, deleteItemModel1 } = require('../models/product')
require('dotenv/config')

module.exports = {
  createItem: (req, res) => {
    const role = req.user.role
    if (role === 2 || role === 1) {
      let { name, price, quantity, condition, description, category } = req.body
      category = parseInt(category)
      condition = parseInt(condition)
      if (name && price && quantity && condition && description && category) {
        validateCat([category], result => {
          const idcat = result[0].id
          console.log(idcat)
          validateCond([condition], result => {
            const idcond = result[0].id
            console.log(idcond)
            if (category === idcat && condition === idcond) {
              createItemModel([name, price, quantity, condition, description, category], result => {
                if (result) {
                  res.status(201).send({
                    success: true,
                    message: 'Item has been created',
                    data: {
                      id: res.insertId,
                      ...req.body
                    }
                  })
                } else {
                  res.status(201).send({
                    success: false,
                    message: 'Failed to create item'
                  })
                }
              })
            } else {
              res.send({
                succes: false,
                message: 'Category or condition is not listed'
              })
            }
          })
        })
      } else {
        res.status(400).send({
          success: false,
          message: 'All field must be filled!'
        })
      }
    } else {
      responseStandard(res, 'You not a Seller')
    }
  },
  postPict: (req, res) => {
    const id = req.user.id
    const role = req.user.role
    if (role === 2 && role === 1) {
      const { product, picture = `uploads/${id}-${req.file.filename}` } = req.body
      console.log(picture)
      console.log(product)
      postPictModel([product, picture], result => {
        if (result) {
          responseStandard(res, 'picture has been uploaded', { picture, ...req.body })
        } else {
          responseStandard(res, 'Failed to upload picture', {}, 401, false)
        }
      })
    } else {
      responseStandard(res, 'You not a Seller')
    }
  },
  getItem: (req, res) => {
    let { page, limit, search, sort } = req.query
    let searchKey = ''
    let searchValue = ''
    let sortKey = ''
    let sortValue = ''
    if (typeof sort === 'object') {
      sortKey = Object.keys(sort)[0]
      sortValue = Object.values(sort)[0]
    } else {
      sortKey = 'created_at'
      sortValue = 'desc'
    }
    if (typeof search === 'object') {
      searchKey = Object.keys(search)[0]
      searchValue = Object.values(search)[0]
    } else {
      searchKey = 'name'
      searchValue = search || ''
    }
    if (!limit) {
      limit = 15
    } else {
      limit = parseInt(limit)
    }
    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
    }
    getItemModel([searchKey, searchValue, limit, page, sortKey, sortValue], (err, result) => {
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
          getItemModel1([searchKey, searchValue], data => {
            const { count } = data[0]
            pageInfo.count = count
            pageInfo.pages = Math.ceil(count / limit)

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
  updateItem: (req, res) => {
    const { id } = req.params
    const { name, price, description } = req.body
    if (name.trim() && price.trim() && description.trim()) {
      updateItemModel(id, result => {
        if (result.length) {
          updateItemModel1([name, price, description, id], result => {
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
  updatePartialItem: (req, res) => {
    const { id } = req.params
    const { name, price, description } = req.body
    if (name.trim() || price.trim() || description.trim()) {
      updateItemModel(id, result => {
        if (result.length) {
          const data = Object.entries(req.body).map(item => {
            return parseInt(item[1]) > 0 ? `${item[0]}=${item[1]}` : `${item[0]}='${item[1]}'`
          })
          updatePartialItemModel([id, data], result => {
            if (result.affectedRows) {
              res.send({
                success: true,
                message: `Item ${id} has been updated`
              })
            } else {
              res.send({
                success: false,
                message: 'Failed to update data'
              })
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
  deleteItem: (req, res) => {
    const id = req.params.id
    deleteItemModel(id, result => {
      if (result.length) {
        deleteItemModel1(id, result => {
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
  getDetailItem: (req, res) => {
    const id = req.params.id
    getDetailItemModel(id, result => {
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
