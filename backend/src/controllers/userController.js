// ============================================
// controllers/userController.js
// ============================================

const bcrypt   = require('bcryptjs')
const supabase = require('../config/db')

// GET /api/users
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, department, created_at')
      .order('created_at', { ascending: false })

    if (error) return res.status(400).json({ error: error.message })
    res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' })
  }
}

// POST /api/users
exports.create = async (req, res) => {
  try {
    console.log("📥 req.body:", req.body)
    const { full_name, email, password, role, department } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูล ชื่อ-นามสกุล, อีเมล และรหัสผ่าน ให้ครบถ้วน' })
    }

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert([{
        full_name,
        email,
        password: hashedPassword,
        role: role || 'user',
        department: department || '-'
      }])
      .select('id, full_name, email, role, department, created_at')
      .single()

    if (insertError) {
      return res.status(400).json({
        error: "Supabase ปฏิเสธการบันทึก",
        details: insertError.message,
        code: insertError.code
      })
    }

    res.status(201).json({ message: 'สร้างผู้ใช้งานสำเร็จ', user: newUser })

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์', message: err.message })
  }
}

// PUT /api/users/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, role, department, password } = req.body

    const { data: userCheck, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)

    if (checkError) {
      return res.status(400).json({ error: 'เกิดข้อผิดพลาดในการเช็คข้อมูล', details: checkError.message })
    }

    if (!userCheck || userCheck.length === 0) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

    // ✅ สร้าง object สำหรับ update
    const updateData = {
      full_name,
      role,
      department
    }

    // ✅ ถ้ามีการส่ง password มาด้วย ให้ hash ก่อนบันทึก
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select('id, full_name, email, role, department')

    if (updateError) {
      return res.status(400).json({ error: 'อัปเดตข้อมูลไม่สำเร็จ', details: updateError.message })
    }

    res.status(200).json({
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      user: updatedUser ? updatedUser[0] : null
    })

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์', message: err.message })
  }
}

// DELETE /api/users/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user && id === req.user.id) {
      return res.status(400).json({ error: 'คุณไม่สามารถลบบัญชีของตัวเองได้' })
    }

    const { data: userCheck, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single()

    if (!userCheck) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message })
    }

    res.status(200).json({ message: 'ลบผู้ใช้งานออกจากระบบสำเร็จ' })

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' })
  }
}