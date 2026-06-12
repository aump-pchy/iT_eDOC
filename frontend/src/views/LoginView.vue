<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4"
       style="background: linear-gradient(160deg, #6d0d30 0%, #a0163f 30%, #d45080 60%, #f5e0ea 85%, #fff 100%);">

    <!-- Logo -->
    <div class="mb-3">
      <img src="/logo.png" alt="IT Loei" class="w-24 h-24 object-contain drop-shadow-lg" />
    </div>

    <!-- ชื่อระบบ -->
    <h1 class="text-2xl font-semibold text-white mb-1">iT-e-Document</h1>
    <p class="text-sm font-light mb-8" style="color: rgba(255,255,255,0.6);">
      ระบบจัดการหนังสือราชการภายในออนไลน์
    </p>

    <!-- Card -->
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h2 class="text-base font-semibold text-gray-800 mb-5">เข้าสู่ระบบ</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">อีเมล</label>
          <input v-model="email" type="email"
            placeholder="your@email.com"
            @keyup.enter="handleLogin"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400 transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">รหัสผ่าน</label>
          <input v-model="password" type="password"
            placeholder="••••••••"
            @keyup.enter="handleLogin"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400 transition-colors" />
        </div>

        <p v-if="errorMsg" class="text-xs text-red-500">{{ errorMsg }}</p>

        <button
          @click="handleLogin"
          :disabled="!isValid || loading"
          :class="isValid && !loading ? 'opacity-100' : 'opacity-50 cursor-not-allowed'"
          class="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity"
          style="background: #a0163f;">
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth     = useAuthStore()
const router   = useRouter()
const email    = ref('')
const password = ref('')
const errorMsg = ref('')
const loading  = ref(false)

const isValid = computed(() =>
  email.value.trim() !== '' && password.value.trim() !== ''
)

async function handleLogin() {
  if (!isValid.value || loading.value) return
  errorMsg.value = ''
  loading.value  = true
  try {
    await auth.login(email.value, password.value)
    router.push('/') // ไปหน้า dashboard
  } catch (err) {
    errorMsg.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>