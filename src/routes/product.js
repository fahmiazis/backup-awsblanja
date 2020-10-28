const { Router } = require('express')
const { createItem, postPict, getItem, updateItem, updatePartialItem, deleteItem, getDetailItem } = require('../controllers/product')
const router = Router()
const uploadHelper = require('../helpers/upload')

router.get('/', getItem)
router.get('/:id', getDetailItem)
router.post('/', createItem)
router.post('/uploadimg', uploadHelper, postPict)
router.put('/:id', updateItem)
router.patch('/:id', updatePartialItem)
router.delete('/:id', deleteItem)

module.exports = router
