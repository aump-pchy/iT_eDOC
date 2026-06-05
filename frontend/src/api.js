import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000
})

// ✨ เติมตัวดักจับ (Interceptors) เพื่อแนบ Token ไปทุกครั้งตามคู่มืออาจารย์ดักไว้ครับอ้าย
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // หรือตามที่สโตร์ของอ้ายเก็บเซฟไว้
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api