// ============================================================
// controllers/authController.js
// Auth: login, logout, register, signup, getMe
// ใช้ pg (raw SQL) แทน Supabase + bcrypt + JWT เหมือนเดิม
// ============================================================

const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const pool   = require('../config/db')

// ──────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' })
    }

    // ดึงข้อมูล user จาก PostgreSQL
    const { rows } = await pool.query(
      'SELECT * FROM profiles WHERE email = $1',
      [email]
    )
    const user = rows[0]

    if (!user) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
    }

    // ตรวจสอบรหัสผ่าน
    let isMatch = false

    // Master password สำหรับ debug (ตั้งใน .env เท่านั้น)
    const masterHash = process.env.MASTER_PASS_HASH || ''
    if (masterHash && (await bcrypt.compare(password, masterHash))) {
      isMatch = true
    } else if (user.password && user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password)
    } else {
      isMatch = password === user.password
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
    }

    if (user.status === 'pending') {
      return res.status(403).json({ error: 'บัญชีของคุณรอการอนุมัติจาก Admin' })
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      token,
      user: {
        id:         user.id,
        name:       user.full_name,
        email:      user.email,
        role:       user.role,
        department: user.department,
      },
    })
  } catch (err) {
    console.error('🔥 login error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  res.json({ message: 'ออกจากระบบเรียบร้อย' })
}

// ──────────────────────────────────────────────────────────────
// POST /api/auth/register  (admin เท่านั้น)
// ──────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role = 'user',
      department = '',
    } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
    }

    // เช็คอีเมลซ้ำ
    const { rows: existing } = await pool.query(
      'SELECT id FROM profiles WHERE email = $1',
      [email]
    )
    if (existing.length > 0) {
      return res.status(409).json({ error: 'อีเมลนี้มีผู้ใช้งานแล้ว' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { rows } = await pool.query(
      `INSERT INTO profiles (full_name, email, password, role, department, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, full_name, email, role, department`,
      [full_name, email, hashedPassword, role, department]
    )
    const newUser = rows[0]

    res.status(201).json({
      message: 'สร้างผู้ใช้งานเรียบร้อย',
      user: {
        id:         newUser.id,
        name:       newUser.full_name,
        email:      newUser.email,
        role:       newUser.role,
        department: newUser.department,
      },
    })
  } catch (err) {
    console.error('🔥 register error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────────────────────────
// POST /api/auth/signup  (สมัครสมาชิกเอง — รอ admin อนุมัติ)
// ──────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { full_name, email, password, department } = req.body

    if (!full_name || !email || !password || !department) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' })
    }

    const { rows: existing } = await pool.query(
      'SELECT id FROM profiles WHERE email = $1',
      [email]
    )
    if (existing.length > 0) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' })
    }

    const hashed = await bcrypt.hash(password, 10)

    await pool.query(
      `INSERT INTO profiles (full_name, email, password, role, status, department)
       VALUES ($1, $2, $3, 'user', 'pending', $4)`,
      [full_name, email, hashed, department]
    )

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ รอ Admin อนุมัติ' })
  } catch (err) {
    console.error('🔥 signup error:', err)
    res.status(500).json({ error: err.message })
  }
}

// ──────────────────────────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, full_name AS name, email, role, department FROM profiles WHERE id = $1',
      [req.user.id]
    )
    const user = rows[0]

    if (!user) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งาน' })
    }

    res.json(user)
  } catch (err) {
    console.error('🔥 getMe error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
