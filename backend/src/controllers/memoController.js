// ============================================
// controllers/memoController.js
// งานของ คนที่ 2 และ 3 — บันทึกข้อความ CRUD
// ============================================

const supabase = require('../config/db')

// ── Helper: สร้างเลขบันทึกอัตโนมัติ ──────────
// ใช้ใน create() เท่านั้น
async function generateMemoNumber() {
  // คำนวณปี พ.ศ. ปัจจุบัน
  const yearBE = new Date().getFullYear() + 543

  // 1. ดึง last_seq ของปีนี้จาก memo_sequences
  let { data: seqData, error: fetchError } = await supabase
    .from('memo_sequences')
    .select('*')
    .eq('year', yearBE)
    .single()

  let nextSeq = 1

  if (!seqData) {
    // ถ้ายังไม่มีปีนี้ ให้สร้างแถวใหม่ด้วย last_seq = 1
    const { error: insertError } = await supabase
      .from('memo_sequences')
      .insert([{ year: yearBE, last_seq: 1 }])
    
    if (insertError) throw insertError
  } else {
    // ถ้ามีอยู่แล้ว ให้บวกเพิ่ม 1 แล้วอัปเดตกลับไป
    nextSeq = seqData.last_seq + 1
    const { error: updateError } = await supabase
      .from('memo_sequences')
      .update({ last_seq: nextSeq })
      .eq('year', yearBE)

    if (updateError) throw updateError
  }

  // ส่งค่าเลขบันทึกกลับออกไปใช้งาน เช่น 'ทส.4/2569'
  return `ทส.${nextSeq}/${yearBE}`
}

// ──────────────────────────────────────────
// GET /api/memos
// ดูรายการบันทึกทั้งหมด (มี search และ filter)
// ──────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, status } = req.query

    // เริ่มต้นสร้าง Query ดึงข้อมูลจาก Supabase ตาราง memos เรียงจากใหม่ไปเก่า
    let query = supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })

    // ถ้ามีคำค้นหา (search) -> ให้กรองจาก subject หรือ memo_number
    if (search) {
      query = query.or(`subject.ilike.%${search}%,memo_number.ilike.%${search}%`)
    }

    // ถ้ามีสถานะ (status) -> ให้กรองตรง ๆ ตามสถานะเอกสาร
    if (status) {
      query = query.eq('status', status)
    }

    const { data: memos, error } = await query

    if (error) throw error

    // ส่งข้อมูลกลับไปหาหน้าบ้าน
    res.status(200).json(memos)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด' })
  }
}

// ──────────────────────────────────────────
// GET /api/memos/:id
// ดูบันทึกรายการเดียว
// ──────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params

    // ดึงข้อมูลตาม ID ที่ส่งมา
    const { data: memo, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single()

    // ถ้าไม่พบข้อมูลเอกสารชิ้นนั้น
    if (error || !memo) {
      return res.status(404).json({ error: 'ไม่พบรายการบันทึกข้อความนี้' })
    }

    res.status(200).json(memo)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' })
  }
}

// ──────────────────────────────────────────
// POST /api/memos
// สร้างบันทึกใหม่
// ──────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { subject, recipient, operator, content, memo_number } = req.body
    console.log('Received create request with data:', req.body)

    // ตรวจสอบความถูกต้องว่าส่งข้อมูลจำเป็นมาครบหรือไม่
    if (!subject || !recipient || !operator) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูล ชื่อเรื่อง, เรียนถึง และผู้ดำเนินการ ให้ครบถ้วนครับ' })
    }

    let finalMemoNumber = memo_number

    // ถ้าผู้ใช้ไม่ได้ใส่เลขมา -> ให้ระบบคำนวณรันเลขให้อัตโนมัติ
    if (!finalMemoNumber) {
      finalMemoNumber = await generateMemoNumber()
    } else {
      // ถ้าใส่เลขมาเอง -> เช็กความซ้ำซ้อนในระบบก่อน
      const { data: existingMemo } = await supabase
        .from('memos')
        .select('memo_number')
        .eq('memo_number', finalMemoNumber)
        .single()

      if (existingMemo) {
        return res.status(400).json({ message: 'เลขที่บันทึกข้อความ ทส. นี้ ถูกใช้งานในระบบไปแล้วครับ' })
      }
    }

    // ทำการบันทึกข้อมูลก้อนจริงลงในฐานข้อมูลคลาวด์ Supabase
    const { data: newMemo, error } = await supabase
      .from('memos')
      .insert([
        {
          memo_number: finalMemoNumber,
          subject,
          recipient,
          operator,
          content,
          created_by: req.user?.id || null // ดึงรหัสไอดีของผู้ใช้งานที่ล็อกอินอยู่ในขณะนั้น
        }
      ])
      .select()
      .single()

    if (error) throw error

    // ส่งก้อนข้อมูลที่เซฟลงคลาวด์สำเร็จแล้วคืนกลับไปบอกหน้าบ้าน
    res.status(201).json({
      message: 'บันทึกสำเร็จเรียบร้อยแล้ว',
      data: newMemo
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างบันทึกใหม่' })
  }
}

// ──────────────────────────────────────────
// PUT /api/memos/:id
// แก้ไขบันทึก
// ──────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { subject, recipient, operator, content, status } = req.body

    // 1. ตรวจสอบว่ามีเอกสารรหัส ID นี้อยู่จริงหรือไม่
    const { data: memo, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !memo) {
      return res.status(404).json({ error: 'ไม่พบเอกสารที่ต้องการแก้ไข' })
    }

    // 2. เช็กสิทธิ์ความปลอดภัย — แก้ไขได้เฉพาะคนสร้าง (เจ้าของ) หรือผู้ที่มีสิทธิ์เป็น admin
    if (memo.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'อ้ายไม่มีสิทธิ์แก้ไขเอกสารฉบับนี้ครับ สิทธิ์นี้เป็นของเจ้าของหรือผู้ดูแลระบบเท่านั้น' })
    }

    // 3. เริ่มทำการเขียนข้อมูลใหม่ทับลงไป
    const { data: updatedMemo, error: updateError } = await supabase
      .from('memos')
      .update({ subject, recipient, operator, content, status })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    res.status(200).json({ message: 'อัปเดตข้อมูลเอกสารเรียบร้อยแล้วครับ', data: updatedMemo })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' })
  }
}

// ──────────────────────────────────────────
// DELETE /api/memos/:id
// ลบบันทึก (admin เท่านั้น — เช็คใน route แล้ว)
// ──────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // 1. ตรวจสอบความถูกต้องว่ามีไอดีนี้อยู่จริงไหมก่อนกดลบ
    const { data: memo, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !memo) {
      return res.status(404).json({ error: 'ไม่พบเอกสารที่ต้องการลบในระบบ' })
    }

    // 2. ส่งคำสั่งทำลาย/ลบ แถวข้อมูลนี้ออกจากคลาวด์ Supabase ทันที
    const { error: deleteError } = await supabase
      .from('memos')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    res.status(200).json({ message: 'ลบข้อมูลบันทึกข้อความออกจากระบบสำเร็จแล้วครับอ้าย!' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลเอกสาร' })
  }
}