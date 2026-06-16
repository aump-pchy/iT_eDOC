<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4"
       style="background: linear-gradient(160deg, #6d0d30 0%, #a0163f 30%, #d45080 60%, #f5e0ea 85%, #fff 100%);">

    <div class="mb-3">
      <img src="/logo.png" alt="IT Loei" class="w-24 h-24 object-contain drop-shadow-lg" />
    </div>
    <h1 class="text-2xl font-semibold text-white mb-1">iT-e-Document</h1>
    <p class="text-sm font-light mb-8" style="color: rgba(255,255,255,0.6);">
      สมัครสมาชิก
    </p>

    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h2 class="text-base font-semibold text-gray-800 mb-5">สร้างบัญชีใหม่</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">ชื่อ-สกุล</label>
          <input v-model="form.full_name" type="text" placeholder="ชื่อ นามสกุล"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">อีเมล</label>
          <input v-model="form.email" type="email" placeholder="your@email.com"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">รหัสผ่าน</label>
          <input v-model="form.password" type="password" placeholder="••••••••"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
        </div>

        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
        <p v-if="success" class="text-xs text-green-600">{{ success }}</p>

        <button @click="handleSignup" :disabled="loading"
          class="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity"
          :class="loading ? 'opacity-50' : 'opacity-100'"
          style="background: #a0163f;">
          {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
        </button>

        <p class="text-center text-xs text-gray-400">
          มีบัญชีแล้ว?
          <RouterLink to="/login" class="text-rose-600 hover:underline">เข้าสู่ระบบ</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'

const form    = ref({ full_name: '', email: '', password: '', department: '' })
const loading = ref(false)
const error   = ref('')
const success = ref('')

async function handleSignup() {
  error.value = ''; success.value = ''
  loading.value = true
  try {
    await api.post('/auth/signup', form.value)
    success.value = 'สมัครสำเร็จ! รอ Admin อนุมัติบัญชีของคุณ'
    form.value = { full_name: '', email: '', password: '', department: '' }
  } catch (err) {
    error.value = err.response?.data?.error || 'เกิดข้อผิดพลาด'
  } finally {
    loading.value = false
  }
}
</script>