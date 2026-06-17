// ============================================
// controllers/memoController.js
// ============================================

const supabase = require("../config/db");
const multer = require("multer");

// ── multer: สำหรับหิ้วไฟล์ PDF เข้า Memory ──
const upload = multer({ storage: multer.memoryStorage() });
exports.uploadMiddleware = upload.single("pdf");

// ── Helper: สร้างเลขที่บันทึกข้อความ ────────────
async function generateMemoNumber() {
  const yearBE = new Date().getFullYear() + 543;
  let { data: seqData, error: fetchError } = await supabase
    .from("memo_sequences")
    .select("*")
    .eq("year_be", yearBE)
    .single();

  let nextSeq = 1;
  if (!seqData) {
    const { error: insertError } = await supabase
      .from("memo_sequences")
      .insert([{ year_be: yearBE, last_seq: 1 }]);
    if (insertError) throw insertError;
  } else {
    nextSeq = seqData.last_seq + 1;
    const { error: updateError } = await supabase
      .from("memo_sequences")
      .update({ last_seq: nextSeq })
      .eq("year_be", yearBE);
    if (updateError) throw updateError;
  }
  return `ทส.${nextSeq}/${yearBE}`;
}

// ── GET /api/memos ────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = supabase
      .from("memos")
      .select("*, profiles:created_by(id, full_name, department)") // ← join profiles
      .order("created_at", { ascending: false });

    if (search)
      query = query.or(
        `subject.ilike.%${search}%,memo_number.ilike.%${search}%`,
      );
    if (status) query = query.eq("status", status);

    const { data: memos, error } = await query;
    if (error) throw error;
    res.status(200).json(memos);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด" });
  }
};

// ── GET /api/memos/:id ────────────────────────
exports.getOne = async (req, res) => {
  try {
    const { data: memo, error } = await supabase
      .from("memos")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !memo)
      return res.status(404).json({ error: "ไม่พบรายการบันทึกข้อความนี้" });
    res.status(200).json(memo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร" });
  }
};

// ── POST /api/memos ───────────────────────────
exports.create = async (req, res) => {
  try {
    const { subject, recipient, content, memo_number, memo_date } =
      req.body;
    if (!subject || !recipient )
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });

    let finalMemoNumber = memo_number;
    if (!finalMemoNumber) {
      finalMemoNumber = await generateMemoNumber();
    } else {
      const { data: existing } = await supabase
        .from("memos")
        .select("memo_number")
        .eq("memo_number", finalMemoNumber)
        .single();
      if (existing)
        return res
          .status(400)
          .json({ message: "เลขที่บันทึกข้อความนี้ถูกใช้งานไปแล้ว" });
    }

    const { data: newMemo, error } = await supabase
      .from("memos")
      .insert([
        {
          memo_number: finalMemoNumber,
          subject,
          recipient,
          content,
          memo_date: memo_date || new Date().toISOString().split("T")[0], // ← เพิ่ม
          created_by: req.user?.id || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res
      .status(201)
      .json({ message: "บันทึกสำเร็จเรียบร้อยแล้ว", data: newMemo });
  } catch (err) {
    console.error('create error:', err) 
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างบันทึกใหม่" });
  }
};

// ── PUT /api/memos/:id ────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, recipient, operator, content, status } = req.body;

    const { data: memos, error: fetchError } = await supabase
      .from("memos")
      .select("*")
      .eq("id", id);

    if (fetchError || !memos || memos.length === 0)
      return res.status(404).json({ error: "ไม่พบเอกสารที่ต้องการแก้ไข" });

    if (req.user) {
      const memo = memos[0];
      console.log("req.user.id:", req.user.id);
      console.log("memo.created_by:", memo.created_by);
      console.log("req.user.role:", req.user.role);
      if (
        memo.created_by &&
        memo.created_by !== req.user.id &&
        req.user.role !== "admin"
      )
        return res.status(403).json({ error: "ไม่มีสิทธิ์แก้ไขเอกสารฉบับนี้" });
    }

    // ── แก้: เพิ่ม status เข้าไปใน update ──
    const updates = {};
    if (subject !== undefined) updates.subject = subject;
    if (recipient !== undefined) updates.recipient = recipient;
    if (content !== undefined) updates.content = content;
    if (status !== undefined) updates.status = status;

    const { data: updatedMemo, error: updateError } = await supabase
      .from("memos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;
    res
      .status(200)
      .json({ message: "อัปเดตข้อมูลเรียบร้อยแล้ว", data: updatedMemo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" });
  }
};

// ── DELETE /api/memos/:id ─────────────────────
exports.remove = async (req, res) => {
  try {
    const { data: memo, error: fetchError } = await supabase
      .from("memos")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !memo)
      return res.status(404).json({ error: "ไม่พบเอกสารที่ต้องการลบ" });

    const { error: deleteError } = await supabase
      .from("memos")
      .delete()
      .eq("id", req.params.id);
    if (deleteError) throw deleteError;

    res.status(200).json({ message: "ลบข้อมูลบันทึกข้อความสำเร็จแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};

// ── POST /api/memos/:id/upload-pdf ───────────
exports.uploadPdf = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("uploadPdf called, id:", id);
    console.log("file:", req.file);
    if (!req.file) {
      return res.status(400).json({
        error: "หน้าบ้านไม่ได้แนบไฟล์มา หรือคีย์ไฟล์ไม่ตรง (ต้องชื่อ pdf)",
      });
    }

    // 1. ตรวจสอบว่าแถว ID นี้มีอยู่จริงไหม
    const { data: memo, error: fetchError } = await supabase
      .from("memos")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !memo) {
      return res
        .status(404)
        .json({ error: "ไม่พบไอดีเอกสารบันทึกข้อความนี้ในฐานข้อมูล" });
    }

    const fileName = `${id}_${Date.now()}.pdf`;

    // 2. อัปโหลดไฟล์เข้า Supabase Storage บักเก็ต memos-pdf
    if (!supabase.storage) {
      return res.status(500).json({
        error:
          "อินสแตนซ์ Supabase หลังบ้านไม่มีฟังก์ชัน .storage กรุณาเช็กไฟล์ตั้งค่า db",
      });
    }

    const { error: uploadError } = await supabase.storage
      .from("memos-pdf")
      .upload(fileName, req.file.buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("รายละเอียดความผิดพลาดจาก Supabase Storage:", uploadError);
      return res.status(500).json({
        error:
          "เกิดปัญหาในขณะอัปโหลดไฟล์ไป Storage กรุณาตรวจสอบว่าคุณได้สร้าง Bucket ชื่อ memos-pdf บนเว็บ Supabase แล้วหรือยัง",
      });
    }

    // 3. ดึงลิงก์ไฟล์สาธารณะออกมา
    const { data: urlData } = supabase.storage
      .from("memos-pdf")
      .getPublicUrl(fileName);
    const filePublicUrl = urlData?.publicUrl || urlData;

    // 4. บันทึกกลับลงตาราง memos ทุกคอลัมน์ที่เกี่ยวข้องเพื่อความชัวร์
    const { data: updatedMemo, error: updateError } = await supabase
      .from("memos")
      .update({
        status: "completed", // ปรับเปลี่ยนสถานะในตาราง
        pdf_url: filePublicUrl,
        file_url: filePublicUrl,
        file_path: fileName,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "รายละเอียดความผิดพลาดจากขั้นตอนอัปเดต Table Memos:",
        updateError,
      );
      return res.status(500).json({
        error:
          "ไฟล์เข้า Storage สำเร็จแล้ว แต่ติดขัดขั้นตอนอัปเดตข้อมูลกลับลงตาราง",
      });
    }

    // ส่งสถานะกลับไปหน้าบ้าน Vue ให้รับรู้อย่างสวยงาม
    return res.status(200).json({
      message: "บันทึกเอกสารและอัปโหลด PDF เรียบร้อยแล้ว",
      data: updatedMemo,
    });
  } catch (err) {
    console.error("จุดขัดข้องภาพรวมเซิร์ฟเวอร์:", err);
    return res
      .status(500)
      .json({ error: "เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์หลังบ้าน" });
  }
};
