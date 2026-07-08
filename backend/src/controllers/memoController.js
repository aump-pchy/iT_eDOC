// ============================================================
// controllers/memoController.js
// จัดการบันทึกข้อความ (Memos) และอัปโหลดไฟล์ PDF เข้า MinIO S3
// ใช้ pg (raw SQL) + minioClient แทน Supabase
// ============================================================

const pool = require("../config/db");
const { minioClient, BUCKET } = require("../config/minio");
const multer = require("multer");

// ── multer: สำหรับหิ้วไฟล์ PDF เข้า Memory ──
const upload = multer({ storage: multer.memoryStorage() });
exports.uploadMiddleware = upload.single("pdf");

// ── Helper: สร้างเลขที่บันทึกข้อความ ────────────
async function generateMemoNumber() {
  const yearBE = new Date().getFullYear() + 543;
  
  // ดึงค่า running number ล่าสุด
  const { rows } = await pool.query(
    'SELECT * FROM memo_sequences WHERE year_be = $1',
    [yearBE]
  );
  let seqData = rows[0];

  let nextSeq = 1;
  if (!seqData) {
    // สร้างปีใหม่ เริ่มต้นที่ 1
    await pool.query(
      'INSERT INTO memo_sequences (year_be, last_seq) VALUES ($1, 1)',
      [yearBE]
    );
  } else {
    nextSeq = seqData.last_seq + 1;
    // อัปเดตบวก 1 เข้าไป
    await pool.query(
      'UPDATE memo_sequences SET last_seq = $1 WHERE year_be = $2',
      [nextSeq, yearBE]
    );
  }
  return `ทส.${nextSeq}/${yearBE}`;
}

// ── GET /api/memos ────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let queryStr = `
      SELECT m.*, 
             json_build_object('id', p.id, 'full_name', p.full_name, 'department', p.department) AS profiles
      FROM memos m
      LEFT JOIN profiles p ON m.created_by = p.id
    `;
    let params = [];
    let conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(m.subject ILIKE $${params.length} OR m.memo_number ILIKE $${params.length})`);
    }

    if (status) {
      params.push(status);
      conditions.push(`m.status = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryStr += " WHERE " + conditions.join(" AND ");
    }

    queryStr += " ORDER BY m.created_at DESC";

    const { rows } = await pool.query(queryStr, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("🔥 getAll memos error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด" });
  }
};

// ── GET /api/memos/:id ────────────────────────
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM memos WHERE id = $1',
      [id]
    );
    const memo = rows[0];

    if (!memo) {
      return res.status(404).json({ error: "ไม่พบรายการบันทึกข้อความนี้" });
    }
    res.status(200).json(memo);
  } catch (err) {
    console.error("🔥 getOne memo error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร" });
  }
};

// ── POST /api/memos ───────────────────────────
exports.create = async (req, res) => {
  try {
    const { subject, recipient, content, memo_number, memo_date } = req.body;
    
    if (!subject || !recipient) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    let finalMemoNumber = memo_number;
    if (!finalMemoNumber) {
      finalMemoNumber = await generateMemoNumber();
    } else {
      const { rows } = await pool.query(
        'SELECT memo_number FROM memos WHERE memo_number = $1',
        [finalMemoNumber]
      );
      if (rows.length > 0) {
        return res.status(400).json({ message: "เลขที่บันทึกข้อความนี้ถูกใช้งานไปแล้ว" });
      }
    }

    const createdBy = req.user?.id || null;
    const memoDateVal = memo_date || new Date().toISOString().split("T")[0];

    const { rows } = await pool.query(
      `INSERT INTO memos (memo_number, subject, recipient, content, memo_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [finalMemoNumber, subject, recipient, content, memoDateVal, createdBy]
    );

    res.status(201).json({ message: "บันทึกสำเร็จเรียบร้อยแล้ว", data: rows[0] });
  } catch (err) {
    console.error('🔥 create memo error:', err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างบันทึกใหม่" });
  }
};

// ── PUT /api/memos/:id ────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, recipient, content, status } = req.body;

    const { rows } = await pool.query(
      'SELECT * FROM memos WHERE id = $1',
      [id]
    );
    const memo = rows[0];

    if (!memo) {
      return res.status(404).json({ error: "ไม่พบเอกสารที่ต้องการแก้ไข" });
    }

    if (req.user) {
      if (memo.created_by && memo.created_by !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "ไม่มีสิทธิ์แก้ไขเอกสารฉบับนี้" });
      }
    }

    const updates = [];
    const params = [];

    if (subject !== undefined) {
      params.push(subject);
      updates.push(`subject = $${params.length}`);
    }
    if (recipient !== undefined) {
      params.push(recipient);
      updates.push(`recipient = $${params.length}`);
    }
    if (content !== undefined) {
      params.push(content);
      updates.push(`content = $${params.length}`);
    }
    if (status !== undefined) {
      params.push(status);
      updates.push(`status = $${params.length}`);
    }

    if (updates.length === 0) {
      return res.status(200).json({ message: "ไม่มีข้อมูลที่เปลี่ยนแแปลง", data: memo });
    }

    params.push(id);
    const queryStr = `UPDATE memos SET ${updates.join(", ")}, updated_at = now() WHERE id = $${params.length} RETURNING *`;
    
    const { rows: updatedRows } = await pool.query(queryStr, params);

    res.status(200).json({ message: "อัปเดตข้อมูลเรียบร้อยแล้ว", data: updatedRows[0] });
  } catch (err) {
    console.error("🔥 update memo error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" });
  }
};

// ── DELETE /api/memos/:id ─────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM memos WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบเอกสารที่ต้องการลบ" });
    }

    await pool.query('DELETE FROM memos WHERE id = $1', [id]);
    res.status(200).json({ message: "ลบข้อมูลบันทึกข้อความสำเร็จแล้ว" });
  } catch (err) {
    console.error("🔥 remove memo error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};

// ── POST /api/memos/:id/upload-pdf ───────────
exports.uploadPdf = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({
        error: "หน้าบ้านไม่ได้แนบไฟล์มา หรือคีย์ไฟล์ไม่ตรง (ต้องชื่อ pdf)",
      });
    }

    // 1. ตรวจสอบว่าแถว ID นี้มีอยู่จริงไหม
    const { rows } = await pool.query(
      'SELECT * FROM memos WHERE id = $1',
      [id]
    );
    const memo = rows[0];

    if (!memo) {
      return res.status(404).json({ error: "ไม่พบไอดีเอกสารบันทึกข้อความนี้ในฐานข้อมูล" });
    }

    const fileName = `${id}_${Date.now()}.pdf`;

    // 2. อัปโหลดไฟล์เข้า MinIO bucket
    await minioClient.putObject(BUCKET, fileName, req.file.buffer, req.file.size, {
      "content-type": "application/pdf"
    });

    // 3. สร้างลิงก์ไฟล์สาธารณะ (ให้ชี้ผ่าน Nginx ไปยัง bucket memos-pdf)
    const filePublicUrl = `/memos-pdf/${fileName}`;

    // 4. บันทึกกลับลงตาราง memos
    const { rows: updatedRows } = await pool.query(
      `UPDATE memos 
       SET status = 'completed', 
           pdf_url = $1, 
           file_url = $1, 
           file_path = $2,
           updated_at = now()
       WHERE id = $3
       RETURNING *`,
      [filePublicUrl, fileName, id]
    );

    return res.status(200).json({
      message: "บันทึกเอกสารและอัปโหลด PDF เรียบร้อยแล้ว",
      data: updatedRows[0],
    });
  } catch (err) {
    console.error("🔥 uploadPdf error:", err);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" });
  }
};
