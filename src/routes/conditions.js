const { Router } = require('express')
const { createCond, getCart, deleteCart, getDetailCart } = require('../controllers/conditions')
const router = Router()

router.get('/', getCart)
router.get('/:id', getDetailCart)
router.post('/', createCond)
router.delete('/:id', deleteCart)

module.exports = router
