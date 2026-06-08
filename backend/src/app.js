// ============================================
// iT-e-Document · Backend Server
// จุดเริ่มต้นของ server ทั้งหมด
// ============================================

require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')

const app = express()

// ── Middleware ────────────────────────────────
// อนุญาตให้ Frontend เรียก API ได้
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}))

// แปลง JSON ที่รับมาให้อ่านได้
app.use(express.json())

// log ทุก request ที่เข้ามา (ใช้ตอน dev)
app.use(morgan('dev'))

// ── Routes ───────────────────────────────────
app.use('/api/auth',  require('./routes/auth'))
app.use('/api/memos', require('./routes/memos'))
app.use('/api/users', require('./routes/users'))

// ── Health Check ─────────────────────────────
// ใช้เช็คว่า server ยังทำงานอยู่ไหม
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'iT-e-Document API is running 🚀'
  })
})

// ── 404 Handler ──────────────────────────────
// ถ้าเรียก URL ที่ไม่มี
app.use((req, res) => {
  res.status(404).json({ error: 'ไม่พบ URL ที่ต้องการ' })
})

// ── Error Handler ────────────────────────────
// จัดการ error ทั้งหมด
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  })
})

// ── Start Server ─────────────────────────────
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Server รันที่ http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})
