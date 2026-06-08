# iT-e-Document · Backend API
### คู่มือสำหรับทีมพัฒนา แผนกวิชาเทคโนโลยีสารสนเทศ

---

## 🗂️ โครงสร้างโปรเจกต์

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              ← ตั้งค่าเชื่อมต่อ Supabase
│   ├── middleware/
│   │   └── auth.js            ← ตรวจสอบ JWT Token
│   ├── controllers/           ← logic การทำงานของแต่ละ feature
│   │   ├── authController.js  ← login / logout
│   │   ├── memoController.js  ← CRUD บันทึกข้อความ
│   │   └── userController.js  ← จัดการผู้ใช้ (admin)
│   ├── routes/                ← กำหนด URL ของ API
│   │   ├── auth.js
│   │   ├── memos.js
│   │   └── users.js
│   └── app.js                 ← จุดเริ่มต้นของ server
├── .env.example               ← ตัวอย่างไฟล์ config
├── .env                       ← config จริง (ห้าม commit!)
└── package.json
```

---

## 🧩 แต่ละไฟล์ทำหน้าที่อะไร?

### `app.js`
จุดเริ่มต้นของ server — เหมือน "ประตูหน้า" ของ backend
รับ request ที่เข้ามา แล้วส่งต่อให้ routes ที่ถูกต้อง

### `config/db.js`
ตั้งค่าการเชื่อมต่อกับ Supabase (ฐานข้อมูล)
ไฟล์อื่นๆ จะ import ไปใช้เพื่อดึง/บันทึกข้อมูล

### `middleware/auth.js`
"ยาม" ที่คอยเช็ค Token ก่อนให้เข้าถึง API
ถ้าไม่มี Token หรือ Token ผิด → ปฏิเสธทันที

### `controllers/`
**ที่นี่คือหัวใจของงานทุกคน** — เขียน logic ที่นี่
เช่น คำนวณเลขบันทึก, เช็ค password, สร้าง token

### `routes/`
กำหนดว่า URL ไหนใช้ controller ไหน
เหมือนป้ายบอกทางในอาคาร

---

## 🌐 API Endpoints ทั้งหมด

### Auth (ไม่ต้องมี Token)
| Method | URL | หน้าที่ |
|--------|-----|--------|
| POST | `/api/auth/login` | เข้าสู่ระบบ รับ Token กลับมา |
| POST | `/api/auth/logout` | ออกจากระบบ |

### Memos (ต้องมี Token)
| Method | URL | หน้าที่ |
|--------|-----|--------|
| GET | `/api/memos` | ดูรายการบันทึกทั้งหมด |
| GET | `/api/memos/:id` | ดูบันทึกรายการเดียว |
| POST | `/api/memos` | สร้างบันทึกใหม่ |
| PUT | `/api/memos/:id` | แก้ไขบันทึก |
| DELETE | `/api/memos/:id` | ลบบันทึก (admin เท่านั้น) |

### Users (ต้องมี Token + เป็น Admin)
| Method | URL | หน้าที่ |
|--------|-----|--------|
| GET | `/api/users` | ดูรายชื่อผู้ใช้ทั้งหมด |
| POST | `/api/users` | สร้างผู้ใช้ใหม่ |
| PUT | `/api/users/:id` | แก้ไขข้อมูลผู้ใช้ |
| DELETE | `/api/users/:id` | ลบผู้ใช้ |

---

## 🔐 JWT คืออะไร? (สำคัญมาก)

JWT = **JSON Web Token** คือ "บัตรประจำตัว" ดิจิทัล

**Flow การทำงาน:**
```
1. User กด Login
        ↓
2. Backend เช็ค email + password
        ↓
3. ถูกต้อง → สร้าง Token ส่งกลับ
        ↓
4. Frontend เก็บ Token ไว้
        ↓
5. ทุกครั้งที่เรียก API → แนบ Token ไปด้วย
        ↓
6. Backend เช็ค Token → ถูกต้อง → อนุญาต
```

**Token หน้าตาแบบนี้:**
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123xyz
```
แบ่งเป็น 3 ส่วน คั่นด้วย `.`
- ส่วนที่ 1 = Header (วิธีเข้ารหัส)
- ส่วนที่ 2 = Payload (ข้อมูลที่ฝังไว้ เช่น userId, role)
- ส่วนที่ 3 = Signature (ลายเซ็น กันปลอมแปลง)

---

## 📦 Packages ที่ใช้

| Package | หน้าที่ |
|---------|--------|
| `express` | สร้าง Web Server |
| `@supabase/supabase-js` | เชื่อมต่อ Supabase |
| `jsonwebtoken` | สร้างและตรวจสอบ JWT |
| `bcryptjs` | เข้ารหัส password |
| `cors` | อนุญาต Frontend เรียก API |
| `dotenv` | อ่านค่าจากไฟล์ .env |
| `morgan` | log การเรียก API |
| `nodemon` | restart server อัตโนมัติตอน dev |

ติดตั้งทั้งหมด:
```bash
npm install express @supabase/supabase-js jsonwebtoken bcryptjs cors dotenv morgan
npm install -D nodemon
```

---

## 🚀 ขั้นตอน Setup (ทำครั้งแรกครั้งเดียว)

```bash
# 1. Clone และเข้าโฟลเดอร์
git clone <URL>
cd it_edoc/backend

# 2. ติดตั้ง packages
npm install

# 3. ตั้งค่า .env
cp .env.example .env
# เปิดไฟล์ .env แล้วใส่ค่าจาก Supabase
# (ครูจะแจก SUPABASE_URL และ SUPABASE_SERVICE_KEY ให้)

# 4. รัน server
npm run dev
# Server จะรันที่ http://localhost:3000
```

---

## 📅 Workflow รายวัน

```bash
# เช้า — ดึงงานล่าสุด
git checkout dev
git pull
git checkout feature/ชื่อ-branch-ตัวเอง
git merge dev

# ระหว่างวัน — ทดสอบ API ด้วย
npm run dev
# แล้วใช้ Postman หรือ Thunder Client ทดสอบ

# เย็น — บันทึกงาน
git add .
git commit -m "feat: สิ่งที่ทำวันนี้"
git push
```

---

## 👥 งานของแต่ละคน

| คน | Branch | ไฟล์หลัก |
|----|--------|---------|
| **คนที่ 1** | `feature/backend-auth` | `controllers/authController.js` |
| **คนที่ 2** | `feature/backend-memos` | `controllers/memoController.js` |
| **คนที่ 3** | `feature/backend-memos` | `controllers/memoController.js` |
| **คนที่ 4** | `feature/backend-users` | `controllers/userController.js` |

---

## 🧪 วิธีทดสอบ API

ใช้ **Thunder Client** (VS Code extension) หรือ **Postman**

ตัวอย่าง Test Login:
```
POST http://localhost:3000/api/auth/login

Body (JSON):
{
  "email": "admin@loeitech.ac.th",
  "password": "123456"
}
```

ถ้าสำเร็จจะได้ Token กลับมา:
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "full_name": "อาจารย์อำพล",
    "role": "admin"
  }
}
```

---

## ❓ เจอปัญหาให้ทำอะไร

1. อ่าน error ใน terminal ให้ครบ
2. ถ่ายรูปหน้าจอไว้
3. **บอกครูทันที** อย่าเดาแก้เอง

---

*iT-e-Document · แผนกวิชาเทคโนโลยีสารสนเทศ · วิทยาลัยเทคนิคเลย*
