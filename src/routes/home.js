const { Router } = require('express')
const { getItem } = require('../controllers/product')
const { getCat } = require('../controllers/category')

const router = Router()

router.get('/new', getItem)
router.get('/category', getCat)
router.get('/popular')

module.exports = router
