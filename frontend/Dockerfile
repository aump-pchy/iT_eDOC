# ============================================================
# frontend/Dockerfile  (Multi-stage build)
# Stage 1: Build Vue app with Vite
# Stage 2: Serve static files with Nginx
# ============================================================

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# ติดตั้ง packages ก่อน (ใช้ cache layer ถ้า package.json ไม่เปลี่ยน)
COPY package*.json ./
RUN npm install

# คัดลอก source ทั้งหมดแล้ว build
COPY . .
RUN npm run build
# ผลลัพธ์จะอยู่ที่ /app/dist

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:alpine

# คัดลอกไฟล์ที่ build เสร็จไปไว้ใน Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# ใช้ config ของเราเอง (รองรับ Vue Router history mode)
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
