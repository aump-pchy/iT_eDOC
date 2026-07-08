# ============================================================
# backend/Dockerfile
# ============================================================
FROM node:22-alpine

# ตั้ง working directory
WORKDIR /app

# คัดลอก package files ก่อน (cache layer)
COPY package*.json ./

# ติดตั้ง dependencies (production only)
RUN npm install --omit=dev

# คัดลอก source code
COPY src/ ./src/

# เปิด port 3000
EXPOSE 3000

# รัน server
CMD ["node", "src/app.js"]
