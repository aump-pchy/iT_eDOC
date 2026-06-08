// ============================================
// config/db.js
// ตั้งค่าเชื่อมต่อ Supabase
// ไฟล์อื่นๆ import ไปใช้เพื่อดึง/บันทึกข้อมูล
// ============================================

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

module.exports = supabase
