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

  // TODO: ดึง last_seq ของปีนี้จาก memo_sequences
  //       ถ้ายังไม่มีปีนี้ ให้สร้างใหม่ด้วย last_seq = 0

  // TODO: บวก 1 แล้วอัปเดตกลับไปใน memo_sequences

  // TODO: return เลขบันทึก เช่น 'ทส.4/2569'
}

// ──────────────────────────────────────────
// GET /api/memos
// ดูรายการบันทึกทั้งหมด (มี search และ filter)
// ──────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, status } = req.query

    // TODO: ดึงข้อมูลจาก Supabase ตาราง memos
    //       เรียงตาม created_at ล่าสุดก่อน

    // TODO: ถ้ามี search → กรองตาม subject หรือ memo_number

    // TODO: ถ้ามี status → กรองตาม status

    // TODO: ส่งข้อมูลกลับ

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// GET /api/memos/:id
// ดูบันทึกรายการเดียว
// ──────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params

    // TODO: ดึงข้อมูล memo จาก id
    //       ถ้าไม่พบ → ส่ง error 404

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// POST /api/memos
// สร้างบันทึกใหม่
// ──────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { subject, recipient, operator, content, memo_number } = req.body

    // TODO: เช็คว่าส่ง subject, recipient, operator มาไหม

    // TODO: ถ้าไม่ส่ง memo_number มา → สร้างอัตโนมัติด้วย generateMemoNumber()
    //       ถ้าส่งมา → เช็คว่าซ้ำไหม ถ้าซ้ำ → error 400

    // TODO: บันทึกลง Supabase
    //       created_by ใช้ req.user.id

    // TODO: ส่งข้อมูลที่สร้างกลับไป พร้อม status 201

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
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

    // TODO: เช็คว่า memo นั้นมีอยู่ไหม

    // TODO: เช็คสิทธิ์ — แก้ได้เฉพาะเจ้าของหรือ admin
    //       req.user.id คือคนที่กำลัง login อยู่
    //       req.user.role คือ role ของคนนั้น

    // TODO: อัปเดตข้อมูล

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}

// ──────────────────────────────────────────
// DELETE /api/memos/:id
// ลบบันทึก (admin เท่านั้น — เช็คใน route แล้ว)
// ──────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // TODO: เช็คว่า memo นั้นมีอยู่ไหม

    // TODO: ลบข้อมูล

    // TODO: ส่งข้อความยืนยันกลับ

  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
