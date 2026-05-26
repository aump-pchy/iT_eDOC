// ============================================
// controllers/authController.js (FIXED)
// ============================================

console.log("โหลด bcrypt")
const bcrypt = require('bcrypt')

console.log("โหลด jwt")
const jwt      = require('jsonwebtoken')

console.log("โหลด supabase")
const supabase = require('../config/db')

// ──────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("📥 input:", email, password)

    // 1. เช็คข้อมูล
    if (!email || !password) {
      return res.status(400).json({
        error: 'กรุณากรอกอีเมลและรหัสผ่าน'
      })
    }

    // 2. ดึง user
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle()   // 🔥 เปลี่ยนจาก single เป็น maybeSingle

    if (error) {
      console.log("❌ supabase error:", error)
      return res.status(500).json({
        error: 'Database error'
      })
    }

    if (!user) {
      return res.status(401).json({
        error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      })
    }

    console.log("🔐 db password:", user.password)

    // 3. เช็ค password
    let isMatch = false

    // 🔥 รองรับ 2 กรณี (กันพลาด)
    if (user.password.startsWith('$2')) {
      // กรณีเป็น hash
      isMatch = await bcrypt.compare(password, user.password)
    } else {
      // กรณีเป็น plain text (เอาไว้ debug)
      isMatch = password === user.password
    }

    if (!isMatch) {
      return res.status(401).json({
        error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      })
    }

    // 4. สร้าง token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    )

    // 5. response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (err) {
    console.log("🔥 server error:", err)
    res.status(500).json({
      error: 'เกิดข้อผิดพลาด'
    })
  }
}

// ──────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────
exports.logout = async (req, res) => {
  res.json({
    message: 'ออกจากระบบเรียบร้อย'
  })
}

// ──────────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {

    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('id', req.user.id)
      .maybeSingle()

    if (error || !user) {
      return res.status(404).json({
        error: 'ไม่พบผู้ใช้งาน'
      })
    }

    res.json(user)

  } catch (err) {
    res.status(500).json({
      error: 'เกิดข้อผิดพลาด'
    })
  }
}