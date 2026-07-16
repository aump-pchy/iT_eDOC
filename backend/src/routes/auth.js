const express  = require('express')
const router   = express.Router()
const authCtrl = require('../controllers/authController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.post('/login',    authCtrl.login)
router.post('/logout',   authCtrl.logout)
router.post('/register', verifyToken, verifyAdmin, authCtrl.register)   // ต้อง login เป็น admin ก่อนถึงจะสร้างคนอื่นได้
router.get('/me',        verifyToken, authCtrl.getMe)
router.post('/signup', authCtrl.signup)                                  // ← อันนี้คือ endpoint สมัครเองจากภายนอก ไม่ต้อง token

module.exports = router
