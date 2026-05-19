import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const token   = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(userData, tokenData) {
    user.value  = userData
    token.value = tokenData
    localStorage.setItem('token', tokenData)
  }

  function logout() {
    user.value  = null
    token.value = ''
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, setAuth, logout }
})