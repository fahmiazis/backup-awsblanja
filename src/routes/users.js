const { Router } = require('express')
const { createUser, getUser, addAddress } = require('../controllers/users')
const router = Router()

router.post('/', createUser)
router.get('/', getUser)
router.post('/address', addAddress)

module.exports = router
