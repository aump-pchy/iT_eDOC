// ============================================
// middleware/auth.js
// "ยาม" ตรวจสอบ Token ก่อนเข้า API
// ============================================

const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  // ดึง Token จาก Header
  // รูปแบบ: Authorization: Bearer <token>
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  // ไม่มี Token → ปฏิเสธ
  if (!token) {
    return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' })
  }

  try {
    // ตรวจสอบ Token ว่าถูกต้องไหม
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // แนบข้อมูล user ไว้ใน req เพื่อให้ controller ใช้ต่อ
    req.user = decoded
    next()

  } catch (err) {
    return res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}

// Middleware เช็คว่าเป็น admin ไหม
// ใช้ต่อจาก verifyToken เสมอ
function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'สิทธิ์ไม่เพียงพอ (admin เท่านั้น)' })
  }
  next()
}

module.exports = { verifyToken, verifyAdmin }
