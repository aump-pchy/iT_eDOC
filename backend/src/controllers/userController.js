// ============================================
// controllers/userController.js
// งานของ คนที่ 4 — จัดการผู้ใช้งาน (Admin) [ฉบับสมบูรณ์]
// ============================================

const bcrypt   = require('bcryptjs')
const supabase = require('../config/db')

// ──────────────────────────────────────────
// GET /api/users
// รายชื่อผู้ใช้ทั้งหมด
// ──────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, department, created_at')
      .order('created_at', { ascending: false }) 

    if (error) {
      return res.status(400).json({ error: error.message })
    }

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
     console.log("📥 req.body:", req.body) 
    const { full_name, email, password, role, department } = req.body
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูล ชื่อ-นามสกุล, อีเมล และรหัสผ่าน ให้ครบถ้วน' })
    }

    // เช็คอีเมลซ้ำ
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

    if (insertError) {
      return res.status(400).json({ 
        error: "Supabase ปฏิเสธการบันทึก", 
        details: insertError.message
      })
    }

    res.status(201).json({
      message: 'สร้างผู้ใช้งานสำเร็จ',
      user: newUser
    })
  } catch (err) {
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์ (Internal Error)', 
      message: err.message 
    })
  }
}

// ──────────────────────────────────────────
// PUT /api/users/:id
// แก้ไขข้อมูลผู้ใช้ (ปรับปรุงโครงสร้างการส่งข้อมูลกลับหน้าบ้าน)
// ──────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, role, department } = req.body

    // 1. เช็คว่ามีผู้ใช้งานรหัสนี้อยู่จริงไหม
    const { data: userCheck, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single() // ใส่ single เพื่อความแม่นยำในการดึงข้อมูลรายบุคคล

    if (checkError || !userCheck) {
      return res.status(404).json({ 
        error: 'ไม่พบผู้ใช้งานนี้ในระบบ', 
        hint: `ลองเช็คดูว่า ID ตรงกับในตาราง profiles จริงไหม` 
      })
    }

    // 2. สั่งอัปเดตข้อมูลและส่งข้อมูลวัตถุ (Object) กลับไปให้ฟรอนต์เอ็นด์ไปหยอดใส่กล่องได้ทันที
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name,
        role,
        department
      })
      .eq('id', id)
      .select('id, full_name, email, role, department') 
      .single() // ใช้ single เพื่อให้ได้ก้อน Object นำไปใช้ที่หน้าบ้านง่ายๆ ไม่ติด Array []

    if (updateError) {
      return res.status(400).json({ error: 'อัปเดตข้อมูลไม่สำเร็จ', details: updateError.message })
    } 

    res.status(200).json({
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      user: updatedUser
    })
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดระดับเซิร์ฟเวอร์', message: err.message })
  }
}

// ──────────────────────────────────────────
// DELETE /api/users/:id
// ลบผู้ใช้ (เวอร์ชันป้องกันฝั่งฐานข้อมูลพัง Cascade Delete)
// ──────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // 1. ป้องกันการลบตัวเอง
    if (req.user && id === req.user.id) {
      return res.status(400).json({ error: 'คุณไม่สามารถลบบัญชีของตัวเองได้' })
    }

    // 2. เช็คว่ามีผู้ใช้งานคนนี้อยู่จริงไหม
    const { data: userCheck } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single()

    if (!userCheck) {
      return res.status(404).json({ error: 'ไม่พบผู้ใช้งานนี้ในระบบ' })
    }

    // 🔥 [จุดแก้ไขตามบรีฟ]: เคลียร์ลบประวัติเอกสาร (Memos) ที่ผู้ใช้คนนี้เคยสร้างไว้ก่อน
    // เพื่อไม่ให้เกิดปัญหากฎความปลอดภัย Foreign Key ผูกมัดจนยิงลบไม่ผ่าน
    await supabase
      .from('memos')
      .delete()
      .eq('by_user', id) // แก้ไขชื่อคอลัมน์เชื่อมโยงให้ตรงกับตาราง memos ของกลุ่มคุณ (เช่น created_by หรือ by_user)

    // 3. สั่งลบข้อมูลผู้ใช้งานออกจากตารางหลักอย่างปลอดภัย
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message })
    }

    res.status(200).json({ message: 'ลบผู้ใช้งานและเอกสารที่เกี่ยวข้องออกจากระบบสำเร็จแล้วครับ' })
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน', message: err.message })
  }
}