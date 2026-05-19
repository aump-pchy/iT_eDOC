# iT-e-Document
### ระบบจัดการหนังสือราชการภายในออนไลน์
> แผนกวิชาเทคโนโลยีสารสนเทศ · วิทยาลัยเทคนิคเลย

---

## 📁 โครงสร้างโปรเจกต์

```
frontend/
├── src/
│   ├── assets/          ← ไฟล์ CSS หลัก
│   ├── components/      ← ชิ้นส่วน UI ที่ใช้ซ้ำได้ (Navbar ฯลฯ)
│   ├── views/           ← หน้าเต็มแต่ละหน้า (1 URL = 1 View)
│   ├── stores/          ← เก็บข้อมูลกลาง (Pinia)
│   ├── router/          ← กำหนด URL ทั้งหมด
│   ├── api.js           ← ตัวเชื่อมต่อ API (Axios)
│   ├── App.vue          ← Root component
│   └── main.js          ← จุดเริ่มต้นของแอป
├── index.html
├── tailwind.config.js
└── package.json
```

---

## 👥 ทีมและงานที่รับผิดชอบ

| คน | Branch | งานหลัก | ไฟล์หลัก |
|----|--------|---------|----------|
| **คนที่ 1** | `feature/admin-users` | หน้าจัดการผู้ใช้งาน | `src/views/AdminUsersView.vue` |
| **คนที่ 2** | `feature/memo-list` | หน้ารายการบันทึกข้อความ | `src/views/MemoListView.vue` |
| **คนที่ 3** | `feature/memo-form` | หน้าสร้าง/แก้ไขบันทึก | `src/views/MemoFormView.vue` |
| **คนที่ 4** | `feature/memo-detail` | หน้าดูรายละเอียด + อัพโหลด | `src/views/MemoDetailView.vue` |

---

## 🚀 ขั้นตอนครั้งแรก (ทำครั้งเดียวเท่านั้น)

### 1. ติดตั้ง Git (ถ้ายังไม่มี)
ดาวน์โหลดที่ https://git-scm.com แล้วติดตั้ง

ตรวจสอบว่ามีแล้ว:
```bash
git --version
```

### 2. ติดตั้ง Node.js (ถ้ายังไม่มี)
ดาวน์โหลดที่ https://nodejs.org (เลือก LTS)

ตรวจสอบ:
```bash
node --version
npm --version
```

### 3. Clone โปรเจกต์
```bash
git clone <URL ที่ครูให้>
cd it_edoc
cd frontend
```

### 4. ติดตั้ง packages
```bash
npm install
```

### 5. ตั้งค่าไฟล์ .env
```bash
cp .env.example .env
```
> ไม่ต้องแก้อะไรใน .env ตอนนี้ ครูจะแจ้งให้ทีหลัง

### 6. Checkout branch ของตัวเอง
```bash
git checkout dev
git pull
git checkout feature/ชื่อ-branch-ของตัวเอง
```

ตัวอย่าง คนที่ 2:
```bash
git checkout feature/memo-list
```

### 7. รันโปรเจกต์
```bash
npm run dev
```
เปิด browser แล้วไปที่ → **http://localhost:5173**

---

## 📅 Workflow รายวัน

### ⏰ เช้า — ก่อนเริ่มทำงาน (ทำทุกวัน ไม่มีข้อยกเว้น)

```bash
# 1. ไปที่ branch dev ก่อน
git checkout dev

# 2. ดึงงานล่าสุดจาก server
git pull

# 3. กลับไป branch ตัวเอง
git checkout feature/ชื่อ-branch-ของตัวเอง

# 4. รวมงานล่าสุดจาก dev เข้ามา
git merge dev
```

> ⚠️ ถ้าขึ้น CONFLICT ให้บอกครูทันที อย่าแก้เอง

---

### 💻 ระหว่างวัน — ขณะทำงาน

รันโปรเจกต์ไว้ตลอด:
```bash
npm run dev
```

แก้ไขไฟล์ใน **branch ของตัวเอง** เท่านั้น  
❌ ห้ามแก้ไฟล์ที่เป็นงานของคนอื่น  
❌ ห้าม push ตรงเข้า `main` หรือ `dev`

---

### 💾 บันทึกงาน (Commit) — ทำบ่อยๆ อย่างน้อยทุก 1-2 ชั่วโมง

```bash
# 1. ดูว่าไฟล์ไหนเปลี่ยนบ้าง
git status

# 2. เพิ่มไฟล์ที่แก้แล้ว
git add .

# 3. บันทึกพร้อมข้อความอธิบาย
git commit -m "feat: อธิบายสิ่งที่ทำ"

# 4. ส่งขึ้น server
git push
```

#### ✍️ รูปแบบข้อความ commit
| prefix | ใช้เมื่อ | ตัวอย่าง |
|--------|---------|---------|
| `feat:` | เพิ่มฟีเจอร์ใหม่ | `feat: เพิ่มตารางรายการบันทึก` |
| `fix:` | แก้บัค | `fix: แก้ปุ่ม submit ไม่ทำงาน` |
| `style:` | แก้ UI/CSS | `style: ปรับสีปุ่มและ layout` |
| `wip:` | งานยังไม่เสร็จ | `wip: กำลังทำ search bar` |

---

### 🌙 เย็น — ก่อนกลับบ้าน

```bash
# บันทึกงานทั้งหมดก่อนออก
git add .
git commit -m "wip: สรุปสิ่งที่ทำวันนี้"
git push
```

> 📌 **ทุกคนต้อง push ก่อนกลับทุกวัน** ไม่ว่างานจะเสร็จหรือไม่

---

## ✅ เมื่องานเสร็จพร้อม Review

เมื่อทำฟีเจอร์เสร็จแล้ว ให้บอกครูเพื่อ review และ merge เข้า `dev`

```bash
# push งานล่าสุดขึ้นไปก่อน
git add .
git commit -m "feat: ชื่อฟีเจอร์ เสร็จแล้ว"
git push

# แล้วบอกครูว่าพร้อม review
```

ครูจะตรวจและ merge ให้ผ่าน GitHub

---

## 🌿 สรุป Branch ทั้งหมด

```
main          ← production (ครูดูแล)
└── dev       ← รวมงานทุกคน (ครูดูแล)
    ├── feature/admin-users    ← คนที่ 1
    ├── feature/memo-list      ← คนที่ 2
    ├── feature/memo-form      ← คนที่ 3
    └── feature/memo-detail    ← คนที่ 4
```

---

## 🛠️ คำสั่ง Git ที่ใช้บ่อย

| คำสั่ง | ความหมาย |
|--------|---------|
| `git status` | ดูไฟล์ที่เปลี่ยนแปลง |
| `git add .` | เตรียมไฟล์ทั้งหมดเพื่อ commit |
| `git commit -m "..."` | บันทึกงานพร้อมข้อความ |
| `git push` | ส่งงานขึ้น server |
| `git pull` | ดึงงานล่าสุดจาก server |
| `git checkout ชื่อ-branch` | สลับ branch |
| `git merge dev` | รวมงานจาก dev เข้า branch ตัวเอง |
| `git log --oneline` | ดูประวัติ commit |

---

## ❓ เจอปัญหาให้ทำอะไร

1. **อย่า panic** 😄
2. อ่าน error message ให้ครบ
3. ถ่ายรูปหน้าจอไว้
4. **บอกครูทันที** อย่าแก้เดาเอง โดยเฉพาะเรื่อง Git conflict


---

*iT-e-Document · แผนกวิชาเทคโนโลยีสารสนเทศ · วิทยาลัยเทคนิคเลย*