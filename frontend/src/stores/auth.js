import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  async function login(email, password) {
    // 🚀 [ปรับตรงนี้]: เติม /api นำหน้า เพื่อให้ระเบิดพลังวิ่งเข้า Route หลังบ้านที่เพื่อนเพิ่งทำมาได้ถูกต้อง
    const { data } = await api.post('/api/auth/login', { email, password })
    
    token.value = data.token
    user.value  = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function logout() {
    token.value = ''
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, isLoggedIn, isAdmin, login, logout }
})