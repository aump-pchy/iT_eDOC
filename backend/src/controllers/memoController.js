// ============================================
// controllers/memoController.js
// ============================================

const supabase = require('../config/db')
const multer   = require('multer')

// ── multer: เก็บไฟล์ใน memory ก่อนส่งต่อ Supabase ──
const upload = multer({ storage: multer.memoryStorage() })
exports.uploadMiddleware = upload.single('pdf')

// ── Helper: รันเลข memo อัตโนมัติ ────────────
async function generateMemoNumber() {
  const yearBE = new Date().getFullYear() + 543
  let { data: seqData, error: fetchError } = await supabase
    .from('memo_sequences')
    .select('*')
    .eq('year', yearBE)
    .single()

  let nextSeq = 1
  if (!seqData) {
    const { error: insertError } = await supabase
      .from('memo_sequences')
      .insert([{ year: yearBE, last_seq: 1 }])
    if (insertError) throw insertError
  } else {
    nextSeq = seqData.last_seq + 1
    const { error: updateError } = await supabase
      .from('memo_sequences')
      .update({ last_seq: nextSeq })
      .eq('year', yearBE)
    if (updateError) throw updateError
  }
  return `ทส.${nextSeq}/${yearBE}`
}

// ── GET /api/memos ────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, status } = req.query
    let query = supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })

    if (search) query = query.or(`subject.ilike.%${search}%,memo_number.ilike.%${search}%`)
    if (status) query = query.eq('status', status)

    const { data: memos, error } = await query
    if (error) throw error
    res.status(200).json(memos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด' })
  }
}

// ── GET /api/memos/:id ────────────────────────
exports.getOne = async (req, res) => {
  try {
    const { data: memo, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !memo) return res.status(404).json({ error: 'ไม่พบรายการบันทึกข้อความนี้' })
    res.status(200).json(memo)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' })
  }
}

// ── POST /api/memos ───────────────────────────
exports.create = async (req, res) => {
  try {
    const { subject, recipient, operator, content, memo_number } = req.body
    if (!subject || !recipient || !operator) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูล ชื่อเรื่อง, เรียนถึง และผู้ดำเนินการ ให้ครบถ้วน' })
    }

    let finalMemoNumber = memo_number
    if (!finalMemoNumber) {
      finalMemoNumber = await generateMemoNumber()
    } else {
      const { data: existing } = await supabase
        .from('memos').select('memo_number').eq('memo_number', finalMemoNumber).single()
      if (existing) return res.status(400).json({ message: 'เลขที่บันทึกข้อความนี้ถูกใช้งานไปแล้ว' })
    }

    const { data: newMemo, error } = await supabase
      .from('memos')
      .insert([{ memo_number: finalMemoNumber, subject, recipient, operator, content, created_by: req.user?.id || null }])
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ message: 'บันทึกสำเร็จเรียบร้อยแล้ว', data: newMemo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างบันทึกใหม่' })
  }
}

// ── PUT /api/memos/:id ────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { subject, recipient, operator, content } = req.body

    const { data: memos, error: fetchError } = await supabase
      .from('memos').select('*').eq('id', id)

    if (fetchError || !memos || memos.length === 0)
      return res.status(404).json({ error: 'ไม่พบเอกสารที่ต้องการแก้ไข' })

    const memo = memos[0]
    if (memo.created_by !== req.user?.id && req.user?.role !== 'admin')
      return res.status(403).json({ error: 'ไม่มีสิทธิ์แก้ไขเอกสารฉบับนี้' })

    const { data: updatedMemo, error: updateError } = await supabase
      .from('memos')
      .update({ subject, recipient, operator, content })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError
    res.status(200).json({ message: 'อัปเดตข้อมูลเรียบร้อยแล้ว', data: updatedMemo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' })
  }
}

// ── DELETE /api/memos/:id ─────────────────────
exports.remove = async (req, res) => {
  try {
    const { data: memo, error: fetchError } = await supabase
      .from('memos').select('*').eq('id', req.params.id).single()

    if (fetchError || !memo) return res.status(404).json({ error: 'ไม่พบเอกสารที่ต้องการลบ' })

    const { error: deleteError } = await supabase.from('memos').delete().eq('id', req.params.id)
    if (deleteError) throw deleteError

    res.status(200).json({ message: 'ลบข้อมูลบันทึกข้อความสำเร็จแล้ว' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' })
  }
}

// ── POST /api/memos/:id/upload-pdf ───────────
// รับไฟล์ PDF → อัปโหลด Supabase Storage → อัปเดต status + pdf_url
exports.uploadPdf = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์ PDF ที่ส่งมา' })

    // ตรวจสอบว่ามี memo นี้อยู่จริง
    const { data: memo, error: fetchError } = await supabase
      .from('memos').select('*').eq('id', id).single()
    if (fetchError || !memo) return res.status(404).json({ error: 'ไม่พบบันทึกข้อความนี้' })

    // อัปโหลดไฟล์ไป Supabase Storage bucket: "memos-pdf"
    const fileName = `${id}_${Date.now()}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('memos-pdf')
      .upload(fileName, req.file.buffer, {
        contentType: 'application/pdf',
        upsert: true
      })
    if (uploadError) throw uploadError

    // ดึง Public URL
    const { data: urlData } = supabase.storage.from('memos-pdf').getPublicUrl(fileName)

    // อัปเดต memo: status = 'done', pdf_url = ...
    const { data: updatedMemo, error: updateError } = await supabase
      .from('memos')
      .update({ status: 'done', pdf_url: urlData.publicUrl })
      .eq('id', id)
      .select()
      .single()
    if (updateError) throw updateError

    res.status(200).json({ message: 'อัปโหลด PDF และอัปเดตสถานะสำเร็จ', data: updatedMemo })
  } catch (err) {
    console.error('uploadPdf error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปโหลด PDF' })
  }
}