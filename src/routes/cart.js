const { Router } = require('express')
const { createCart, deleteCart, getDetailCart } = require('../controllers/cart')
const router = Router()

router.get('/detail', getDetailCart)
router.post('/add', createCart)
router.delete('/:id', deleteCart)

module.exports = router
