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
      .from('profiles')
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
// สร้างผู้ใช้ใหม่ (เวอร์ชันแกะรอย Error 500)
exports.create = async (req, res) => {
  try {
     console.log("📥 req.body:", req.body) 
    const { full_name, email, password, role, department } = req.body
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูล ชื่อ-นามสกุล, อีเมล และรหัสผ่าน ให้ครบถ้วน' })
    }

    // เช็คอีเมลซ้ำ
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // สั่งบันทึกลงตาราง profile
    const { data: newUser, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          full_name,
          email,
          password: hashedPassword,
          role: role || 'user',
          department: department || '-'
        }
      ])
      .select('id, full_name, email, role, department, created_at')
      .single()

    // 🔴 จุดเช็คที่ 1: ถ้าตารางพังเพราะ Supabase ไม่ยอมรับข้อมูล
    if (insertError) {
      return res.status(400).json({ 
        error: "Supabase ปฏิเสธการบันทึก", 
        details: insertError.message,
        code: insertError.code 
      })
    }

    res.status(201).json({
      message: 'สร้างผู้ใช้งานสำเร็จ',
      user: newUser
    })

  } catch (err) {
    // 🔴 จุดเช็คที่ 2: ถ้าโค้ดพังในระดับ JavaScript (จากตัวแปรพังหรือคำสั่งผิด)
    // เปลี่ยนจากแค่ "เกิดข้อผิดพลาด" ให้พ่น err.message ตัวจริงออกมาเลย!
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์ (Internal Error)', 
      message: err.message 
    })
  }
}

// PUT /api/users/:id
// แก้ไขข้อมูลผู้ใช้ (เวอร์ชันตาราง profiles มี s)
// ──────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, role, department } = req.body

    // 1. เช็คว่ามีผู้ใช้งาน id นี้ในตาราง profiles ไหม
    const { data: userCheck, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)

    // ถ้าเกิด Error ตอนเชื่อมต่อหรือค้นหา ให้พ่นบอกทันที
    if (checkError) {
      return res.status(400).json({ error: 'เกิดข้อผิดพลาดในการเช็คข้อมูล', details: checkError.message })
    }

    // ถ้าไม่มีข้อมูลกลับมาเลย แปลว่าหา ID นี้ไม่เจอจริง ๆ
    if (!userCheck || userCheck.length === 0) {
      return res.status(404).json({ 
        error: 'ไม่พบผู้ใช้งานนี้ในระบบ', 
        hint: `ลองเช็คดูว่า ID: ${id} ที่ส่งมา ตรงกับในตาราง profiles จริงไหม` 
      })
    }

    // 2. สั่งอัปเดตข้อมูลลงตาราง profiles
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: full_name,
        role: role,
        department: department
      })
      .eq('id', id)
      .select('id, full_name, email, role, department') // ตัด updated_at เผื่อในตารางไม่มีคอลัมน์นี้

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

// ──────────────────────────────────────────
// DELETE /api/users/:id
// ลบผู้ใช้
// ──────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // 1. ห้ามลบตัวเองเด็ดขาด! (เปรียบเทียบ id ที่จะลบ กับ id ของคนล็อกอินที่อยู่ใน req.user.id)
    // หมายเหตุ: req.user.id จะมาจาก Middleware ล็อกอินของคุณครูวันจันทร์ครับ
    if (req.user && id === req.user.id) {
      return res.status(400).json({ error: 'คุณไม่สามารถลบบัญชีของตัวเองได้' })
    }

    // 2. เช็คว่ามีผู้ใช้งานคนนี้อยู่ในระบบจริงไหมก่อนสั่งลบ
    const { data: userCheck, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single()

    if (!userCheck) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

    // 3. สั่งลบข้อมูลออกจาก Supabase
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message })
    }

    // ส่งข้อความแจ้งหน้าบ้านว่าลบเรียบร้อย
    res.status(200).json({ message: 'ลบผู้ใช้งานออกจากระบบสำเร็จ' })

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' })
  }
}