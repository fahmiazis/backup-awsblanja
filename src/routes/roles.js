const { Router } = require('express')
const { createRole } = require('../controllers/roles')
const router = Router()

router.post('/', createRole)

module.exports = router
