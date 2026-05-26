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
    // ดึงข้อมูลทุกคนจากตาราง users โดยเลือกเฉพาะฟิลด์ที่จำเป็น (ไม่ส่ง password กลับไป)
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, department, created_at')
      .order('created_at', { ascending: false }) // เรียงจากใหม่ไปเก่า

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // ส่งข้อมูลผู้ใช้ทั้งหมดกลับไปให้หน้าบ้าน
    res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' })
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
    if (!full_name || !email || !password) {
      return res.status(400).json ({error:"กรุณากรอกข้อมูลให้ครบถ้วน"})
    }
    // TODO: เช็คว่า email ซ้ำไหม
    const {data: existingUser, error : checkError} = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

      if (existingUser) {
        return res.status (400).json({eror: 'อีเมลนี้ถูกใช้งานแล้ว'})

      }

    // TODO: เข้ารหัส password ด้วย bcrypt
    const hashesPassword = await bcrypt.hash(password, 10)
    // const hashedPassword = await bcrypt.hash(password, 10)
    //       10 คือ salt rounds — ยิ่งมากยิ่งปลอดภัย แต่ช้าขึ้น
    // TODO: บันทึกลง Supabase
    //       ใช้ hashedPassword แทน password จริง
    // TODO: ส่งข้อมูลกลับ (ไม่ต้องส่ง password)
  const { data: newUser, error: insertError} = await supabase
      .from('users')
      .insert([
        {
          full_name,       
          email,
          password: hashedPassword,
          role: role || 'user',
          department :department || '-'
        }
      ])
      .select('id , full_name, email, role ,department ,created_at')
      .single()

    if (insertError) {
      return res.status(400).json ({ error : insertError.message})
    }

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
    const { data: userCheck, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single()

    if (!userCheck) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

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
