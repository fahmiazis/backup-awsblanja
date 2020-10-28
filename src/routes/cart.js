const { Router } = require('express')
const { createCart, deleteCart, getDetailCart } = require('../controllers/cart')
const router = Router()

router.get('/', getDetailCart)
router.post('/', createCart)
router.delete('/:id', deleteCart)

module.exports = router
