// ============================================================
// config/minio.js
// MinIO S3-compatible client (แทน Supabase Storage)
// ============================================================

const Minio = require('minio')

const minioClient = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT  || 'minio',
  port:      parseInt(process.env.MINIO_PORT || '9000'),
  useSSL:    process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

const BUCKET = process.env.MINIO_BUCKET || 'memos-pdf'

// สร้าง bucket ถ้ายังไม่มี (รันครั้งแรก)
async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET)
    if (!exists) {
      await minioClient.makeBucket(BUCKET, 'us-east-1')
      console.log(`✅ MinIO: สร้าง bucket "${BUCKET}" สำเร็จ`)
    } else {
      console.log(`✅ MinIO: bucket "${BUCKET}" พร้อมใช้งาน`)
    }

    // กำหนด Policy ให้คนทั่วไปสามารถดาวน์โหลด/อ่านไฟล์ PDF ได้ (แก้ปัญหา AccessDenied 403)
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicRead",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET}/*`]
        }
      ]
    }
    await minioClient.setBucketPolicy(BUCKET, JSON.stringify(policy))
    console.log(`✅ MinIO: ตั้งค่า Public Read Policy สำหรับ "${BUCKET}" สำเร็จ`)
  } catch (err) {
    console.error('❌ MinIO bucket error:', err.message)
  }
}

ensureBucket()

module.exports = { minioClient, BUCKET }
