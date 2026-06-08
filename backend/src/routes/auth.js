// ============================================
// routes/auth.js
// กำหนด URL สำหรับ Authentication
// ============================================

const router     = require('express').Router()
const controller = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

// POST /api/auth/login → เข้าสู่ระบบ
router.post('/login', controller.login)

// POST /api/auth/logout → ออกจากระบบ
router.post('/logout', verifyToken, controller.logout)

// GET /api/auth/me → ดูข้อมูลตัวเอง
router.get('/me', verifyToken, controller.getMe)

module.exports = router
