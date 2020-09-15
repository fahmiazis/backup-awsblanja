const { Router } = require('express')
const { createCart, getCart, deleteCart, getDetailCart } = require('../controllers/cart')
const router = Router()

router.get('/', getCart)
router.get('/:id', getDetailCart)
router.post('/', createCart)
router.delete('/:id', deleteCart)

module.exports = router
