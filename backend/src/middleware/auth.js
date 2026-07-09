const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  if (!token) {
    return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบก่อน' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'iT-e-DOC@LoeiTech#2569!SecretKey')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'สิทธิ์ไม่เพียงพอ (admin เท่านั้น)' })
  }
  next()
}

module.exports = { verifyToken, verifyAdmin }
