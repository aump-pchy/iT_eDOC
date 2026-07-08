// ============================================================
// controllers/userController.js
// จัดการผู้ใช้งาน (Admin เท่านั้น)
// ใช้ pg (raw SQL) แทน Supabase client
// ============================================================

const bcrypt = require('bcryptjs')
const pool   = require('../config/db')

// GET /api/users
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, full_name, email, role, department, created_at, status FROM profiles ORDER BY created_at DESC'
    )
    res.status(200).json(rows)
  } catch (err) {
    console.error('🔥 getAll users error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' })
  }
}

// POST /api/users (สร้างโดย Admin)
exports.create = async (req, res) => {
  try {
    const { full_name, email, password, role, department } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูล ชื่อ-นามสกุล, อีเมล และรหัสผ่าน ให้ครบถ้วน' })
    }

    const { rows: existing } = await pool.query(
      'SELECT email FROM profiles WHERE email = $1',
      [email]
    )
    if (existing.length > 0) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { rows } = await pool.query(
      `INSERT INTO profiles (full_name, email, password, role, department, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, full_name, email, role, department, created_at`,
      [full_name, email, hashedPassword, role || 'user', department || '-']
    )

    res.status(201).json({
      message: 'สร้างผู้ใช้งานสำเร็จ',
      user: rows[0]
    })
  } catch (err) {
    console.error('🔥 create user error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์' })
  }
}

// PUT /api/users/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, role, department, password } = req.body

    const { rows: check } = await pool.query(
      'SELECT id FROM profiles WHERE id = $1',
      [id]
    )
    if (check.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

    let queryStr = `UPDATE profiles SET full_name = $1, role = $2, department = $3`
    let params = [full_name, role, department, id]

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10)
      queryStr += `, password = $5 WHERE id = $4`
      params.push(hashedPassword)
    } else {
      queryStr += ` WHERE id = $4`
    }

    queryStr += ` RETURNING id, full_name, email, role, department`

    const { rows } = await pool.query(queryStr, params)

    res.status(200).json({
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      user: rows[0]
    })
  } catch (err) {
    console.error('🔥 update user error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์' })
  }
}

// DELETE /api/users/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user && id === req.user.id) {
      return res.status(400).json({ error: 'คุณไม่สามารถลบบัญชีของตัวเองได้' })
    }

    const { rows: check } = await pool.query(
      'SELECT id FROM profiles WHERE id = $1',
      [id]
    )
    if (check.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

    await pool.query('DELETE FROM profiles WHERE id = $1', [id])

    res.status(200).json({ message: 'ลบผู้ใช้งานออกจากระบบสำเร็จ' })
  } catch (err) {
    console.error('🔥 remove user error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' })
  }
}

// PUT /api/users/:id/approve
exports.approve = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE profiles SET status = 'active' WHERE id = $1 RETURNING *`,
      [req.params.id]
    )
    res.json({ message: 'อนุมัติผู้ใช้สำเร็จ', data: rows[0] })
  } catch (err) {
    console.error('🔥 approve user error:', err)
    res.status(500).json({ error: err.message })
  }
}

// PUT /api/users/:id/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { new_password } = req.body
    if (!new_password) return res.status(400).json({ error: 'กรุณาระบุรหัสผ่านใหม่' })

    const hashed = await bcrypt.hash(new_password, 10)

    await pool.query(
      'UPDATE profiles SET password = $1 WHERE id = $2',
      [hashed, req.params.id]
    )

    res.json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' })
  } catch (err) {
    console.error('🔥 reset password error:', err)
    res.status(500).json({ error: err.message })
  }
}
