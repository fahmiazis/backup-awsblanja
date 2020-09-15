const { Router } = require('express')
const { createCat, getCat, updateCat, deleteCat, getDetailCat } = require('../controllers/category')
const router = Router()

router.get('/', getCat)
router.get('/:id', getDetailCat)
router.post('/', createCat)
router.put('/:id', updateCat)
router.delete('/:id', deleteCat)

module.exports = router
