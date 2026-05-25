// ============================================
// controllers/authController.js
// งานของ คนที่ 1 — ระบบ Login / Logout
// ============================================

const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const supabase = require('../config/db')

// ──────────────────────────────────────────
// POST /api/auth/login
// รับ email + password → คืน token
// ──────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // TODO: 1. เช็คว่าส่ง email และ password มาไหม
    //          ถ้าไม่มี → ส่ง error 400 กลับไป

    // TODO: 2. ดึงข้อมูล user จาก Supabase โดยใช้ email
    //          ตัวอย่างดึงข้อมูล:
    //          const { data: user } = await supabase
    //            .from('profiles')
    //            .select('*')
    //            .eq('email', email)
    //            .single()

    // TODO: 3. เช็คว่ามี user ไหม
    //          ถ้าไม่มี → ส่ง error 401 "อีเมลหรือรหัสผ่านไม่ถูกต้อง"

    // TODO: 4. เช็ค password ด้วย bcrypt
    //          const isMatch = await bcrypt.compare(password, user.password)
    //          ถ้าไม่ตรง → ส่ง error 401

    // TODO: 5. สร้าง JWT Token
    //          const token = jwt.sign(
    //            { id: user.id, role: user.role },
    //            process.env.JWT_SECRET,
    //            { expiresIn: process.env.JWT_EXPIRES_IN }
    //          )

    // TODO: 6. ส่ง token และข้อมูล user กลับไป
    //          res.json({ token, user: { ... } })

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────
exports.logout = async (req, res) => {
  // TODO: ส่งข้อความว่า logout สำเร็จ
  //       (JWT เป็น stateless ไม่ต้องลบใน server)
  //       res.json({ message: 'ออกจากระบบเรียบร้อย' })
}

// ──────────────────────────────────────────
// GET /api/auth/me
// ดูข้อมูลตัวเอง (ดึงจาก token ที่แนบมา)
// ──────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // req.user มาจาก middleware/auth.js
    // TODO: ดึงข้อมูล user จาก Supabase โดยใช้ req.user.id
    //       แล้วส่งกลับไป

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
