// ============================================================
// config/db.js
// PostgreSQL connection pool (แทน Supabase client)
// ============================================================

const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST     || 'postgres',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'itedoc',
  user:     process.env.DB_USER     || 'itedoc',
  password: process.env.DB_PASSWORD || 'secret',
})

// ทดสอบการเชื่อมต่อเมื่อ server เริ่มต้น
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ ไม่สามารถเชื่อมต่อ PostgreSQL ได้:', err.message)
  } else {
    console.log('✅ PostgreSQL เชื่อมต่อสำเร็จ')
    release()
  }
})

module.exports = pool
