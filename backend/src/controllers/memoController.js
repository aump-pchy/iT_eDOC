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
// ──────────────────────────────────────────
// GET /api/memos (เวอร์ชันซ่อมแซมเสร็จสมบูรณ์)
// ──────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, status } = req.query

    // 1. ✨ เปลี่ยนเป็นเครื่องหมาย Backtick (`) เพื่อให้เคาะขึ้นบรรทัดใหม่ใน select ได้อย่างถูกต้อง
    let query = supabase
      .from('memos')
      .select(`
        *,
        profiles!created_by (
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    // 2. ถ้ามีคำค้นหา (search)
    if (search) {
      // ค้นหาจากหัวข้อ หรือ เลขที่หนังสือ
      query = query.or(`subject.ilike.%${search}%,memo_number.ilike.%${search}%`)
    }

    // 3. ถ้ามีสถานะ (status)
    if (status) {
      query = query.eq('status', status)
    }

    const { data: memos, error } = await query

    if (error) throw error

    // ส่งข้อมูลที่มีโครงสร้าง profiles พ่วงกลับไปหาหน้าบ้าน
    res.status(200).json(memos)

  } catch (err) {
    console.error("🚨 ฟังก์ชัน getAll พังเพราะ ->", err)
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
        return res.status(400).json({ message: 'เลขที่บันทึกข้อความ ทส. นี้ ถูกใช้งานในระบบไปแล้ว' })
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
// แก้ไขบันทึก (เวอร์ชันอัปเกรด ดักจับบั๊ก 500 และ 403)
// ──────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { subject, recipient, full_name, content, status } = req.body

    // 1. ตรวจสอบว่ามีเอกสารรหัส ID นี้อยู่จริงหรือไม่
    // (เอา .single() ออกชั่วคราว เพื่อไม่ให้ Supabase โยนเออร์เรอร์ 500 PGRST116 เวลาใส่ ID ผิด)
    const { data: memos, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)

    // เช็กว่าถ้าเกิด error หรือค้นหาแล้วไม่เจอข้อมูลเลยสักแถวในระบบ
    if (fetchError || !memos || memos.length === 0) {
      return res.status(404).json({ error: 'ไม่พบเอกสารที่ต้องการแก้ไขในระบบ' })
    }

    // ดึงข้อมูลแถวแรกออกมาเพื่อนำมาเช็กสิทธิ์ต่อ
    const memo = memos[0]

    // 2. เช็กสิทธิ์ความปลอดภัย — แก้ไขได้เฉพาะคนสร้าง (เจ้าของ) หรือผู้ที่มีสิทธิ์เป็น admin
    // (ใส่เครื่องหมาย // เปิดใช้งาน หรือปิดใช้งานตามที่อ้ายต้องการเทสได้เลยครับ)
    if (memo.created_by !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'คุณไม่มีสิทธิ์แก้ไขเอกสารฉบับนี้ สิทธิ์นี้เป็นของเจ้าของหรือผู้ดูแลระบบเท่านั้น' })
    }

    let dbStatus = status; // ค่าเริ่มต้น
    if (status === 'กำลังดำเนินการ') {
      dbStatus = 'draft'; // หรือ 'pending' (อิงตามค่าเก่าของคุณเปาที่เป็น draft ค่ะ)
    } else if (status === 'ดำเนินการแล้ว') {
      dbStatus = 'completed'; // หรือคำภาษาอังกฤษที่ระบบของกลุ่มกำหนดไว้
    }

    // 3. เริ่มทำการเขียนข้อมูลใหม่ทับลงไป
    const { data: updatedMemo, error: updateError } = await supabase
      .from('memos')
      .update({ 
        subject, 
        recipient, 
        content,
        status: dbStatus
        // ตัด status และตัวแปรอื่น ๆ ออกเพื่อไม่ให้โดน RLS บล็อกสิทธิ์ชั่วคราว
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
    console.log("❌ Supabase พังเพราะสาเหตุนี้ ->", updateError)
      throw updateError
    }

const targetUserId = memo.user_id || memo.profile_id || memo.created_by || memo.operator_id;

    if (targetUserId && full_name) {
      // อัปเดตชื่อใหม่ลงตาราง profiles จริงๆ บน Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: full_name }) 
        .eq('id', targetUserId); 

      if (profileError) throw profileError;
    }

    const responseData = {
      ...updatedMemo,
      status: status, // ส่งสถานะคำไทยกลับไปอัปเดตหน้าบ้านทันที
      profiles: {
        full_name: full_name // ✨ พ่วงชื่อใหม่ส่งกลับไปด้วย หน้าบ้านจะได้มีของใช้
      }
    }

    res.status(200).json({ message: 'อัปเดตข้อมูลเอกสารเรียบร้อยแล้ว', data: responseData })

  } catch (err) {
    console.error("🚨 ระบบหลังบ้านพังเพราะ ->",err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลภายในเซิร์ฟเวอร์' })
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

    res.status(200).json({ message: 'ลบข้อมูลบันทึกข้อความแล้ว' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลเอกสาร' })
  }
}