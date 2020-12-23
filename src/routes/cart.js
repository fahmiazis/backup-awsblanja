const { Router } = require('express')
const { createCart, deleteCart, getDetailCart, updateCartIncrement, updateCartDecrement } = require('../controllers/cart')
const router = Router()

router.get('/detail', getDetailCart)
router.post('/add', createCart)
router.delete('/:id', deleteCart)
router.patch('/increment/:id', updateCartIncrement)
router.patch('/decrement/:id', updateCartDecrement)

module.exports = router
