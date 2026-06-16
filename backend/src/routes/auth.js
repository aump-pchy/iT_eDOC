const express  = require('express')
const router   = express.Router()
const authCtrl = require('../controllers/authController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.post('/login',    authCtrl.login)
router.post('/logout',   authCtrl.logout)
router.post('/register', verifyToken, verifyAdmin, authCtrl.register)
router.get('/me',        verifyToken, authCtrl.getMe)
router.post('/signup', authCtrl.signup) 

module.exports = router
