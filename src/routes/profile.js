const { Router } = require('express')
const { getProfile, updateProfile, getCheckout, updateImage, getAddress } = require('../controllers/profile')
const uploadHelper = require('../helpers/upload')
const router = Router()

router.get('/', getProfile)
router.patch('/seller')
router.patch('/customer', updateProfile)
router.patch('/customer/img', uploadHelper, updateImage)
router.get('/checkout', getCheckout)
router.get('/address', getAddress)
router.get('/buy')

module.exports = router
