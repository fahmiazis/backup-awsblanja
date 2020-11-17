const { Router } = require('express')
const { getItem, getDetailItem } = require('../controllers/product')
const { getCat } = require('../controllers/category')

const router = Router()

router.get('/new', getItem)
router.get('/category', getCat)
router.get('/popular')
router.get('/detail/:id', getDetailItem)

module.exports = router
