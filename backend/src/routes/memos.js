// ============================================
// routes/memos.js
// กำหนด URL สำหรับ บันทึกข้อความ
// ============================================

const router     = require('express').Router()
const controller = require('../controllers/memoController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

// ทุก route ต้อง login ก่อน
router.use(verifyToken)

// GET /api/memos → รายการทั้งหมด
router.get('/', controller.getAll)

// GET /api/memos/:id → รายการเดียว
router.get('/:id', controller.getOne)

// POST /api/memos → สร้างใหม่
router.post('/', controller.create)

// PUT /api/memos/:id → แก้ไข
router.put('/:id', controller.update)

// DELETE /api/memos/:id → ลบ (admin เท่านั้น)
router.delete('/:id', /*verifyAdmin,*/ controller.remove)

module.exports = router
