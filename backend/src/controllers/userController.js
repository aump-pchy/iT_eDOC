// ============================================
// controllers/userController.js
// งานของ คนที่ 4 — จัดการผู้ใช้งาน (Admin)
// ============================================

const bcrypt   = require('bcryptjs')
const supabase = require('../config/db')

// ──────────────────────────────────────────
// GET /api/users
// รายชื่อผู้ใช้ทั้งหมด
// ──────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    // TODO: ดึงข้อมูลทุกคนจาก Supabase
    //       ไม่ต้องส่ง password กลับไป!
    //       ใช้ .select('id, full_name, email, role, department, created_at')

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// POST /api/users
// สร้างผู้ใช้ใหม่
// ──────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { full_name, email, password, role, department } = req.body

    // TODO: เช็คว่าส่ง full_name, email, password มาไหม

    // TODO: เช็คว่า email ซ้ำไหม

    // TODO: เข้ารหัส password ด้วย bcrypt
    //       const hashedPassword = await bcrypt.hash(password, 10)
    //       10 คือ salt rounds — ยิ่งมากยิ่งปลอดภัย แต่ช้าขึ้น

    // TODO: บันทึกลง Supabase
    //       ใช้ hashedPassword แทน password จริง

    // TODO: ส่งข้อมูลกลับ (ไม่ต้องส่ง password)

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// PUT /api/users/:id
// แก้ไขข้อมูลผู้ใช้
// ──────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, role, department } = req.body

    // TODO: เช็คว่า user นั้นมีอยู่ไหม

    // TODO: อัปเดตข้อมูล
    //       หมายเหตุ: ไม่อนุญาตให้เปลี่ยน password ที่นี่

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// DELETE /api/users/:id
// ลบผู้ใช้
// ──────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // TODO: ห้ามลบตัวเอง
    //       if (id === req.user.id) → error 400

    // TODO: เช็คว่า user นั้นมีอยู่ไหม

    // TODO: ลบข้อมูล

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
