// ============================================
// routes/users.js
// กำหนด URL สำหรับ จัดการผู้ใช้
// ============================================

const router     = require('express').Router()
const controller = require('../controllers/userController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

// ทุก route ต้อง login + เป็น admin
router.use(verifyToken, verifyAdmin)

// GET /api/users → รายชื่อผู้ใช้ทั้งหมด
router.get('/', controller.getAll)

// POST /api/users → สร้างผู้ใช้ใหม่
router.post('/', controller.create)

// PUT /api/users/:id → แก้ไขผู้ใช้
router.put('/:id', controller.update)

// DELETE /api/users/:id → ลบผู้ใช้
router.delete('/:id', controller.remove)

module.exports = router
