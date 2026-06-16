<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4"
    style="background: linear-gradient(160deg, #6d0d30 0%, #a0163f 30%, #d45080 60%, #f5e0ea 85%, #fff 100%);">

    <div class="mb-3">
      <img src="/logo.png" alt="IT Loei" class="w-24 h-24 object-contain drop-shadow-lg" />
    </div>

    <h1 class="text-2xl font-semibold text-white mb-1">iT-e-Document</h1>
    <p class="text-sm font-light mb-8" style="color: rgba(255,255,255,0.6);">
      ระบบจัดการหนังสือราชการภายในออนไลน์
    </p>

    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h2 class="text-base font-semibold text-gray-800 mb-5">เข้าสู่ระบบ</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">อีเมล</label>
          <input v-model="email" type="email" placeholder="your@email.com" @keyup.enter="handleLogin"
            :class="errorMsg ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-pink-300'"
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition" />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">รหัสผ่าน</label>
          <input v-model="password" type="password" placeholder="••••••••" @keyup.enter="handleLogin"
            :class="errorMsg ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-pink-300'"
            class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition" />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-xs text-center">{{ errorMsg }}</p>

        <button @click="handleLogin" :disabled="!isValid || loading"
          class="w-full py-2.5 rounded-xl text-white font-medium text-sm transition-all" :class="isValid && !loading
            ? 'opacity-100 cursor-pointer hover:opacity-90'
            : 'opacity-60 cursor-not-allowed'" style="background: linear-gradient(135deg, #a0163f, #c4185a);">
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            กำลังเข้าสู่ระบบ...
          </span>
          <span v-else>เข้าสู่ระบบ</span>
        </button>
      </div>
    </div>
     <p class="text-center text-xs mt-3" style="color: rgba(255,255,255,0.6);">
          ยังไม่มีบัญชี?
          <RouterLink to="/signup" class="text-rose-200 hover:underline">สมัครสมาชิก</RouterLink>
        </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const isValid = computed(() =>
  email.value.trim() !== '' && password.value.trim() !== ''
)

async function handleLogin() {
  if (!isValid.value || loading.value) return  // ← มีแล้ว แต่เช็คว่า loading ทำงานจริงไหม

  errorMsg.value = ''
  loading.value = true  // ← set true ก่อน await

  try {
    await auth.login(email.value.trim(), password.value)
    router.push('/')  // ← เปลี่ยนจาก /memos เป็น /
  } catch (err) {
    errorMsg.value =
      err?.response?.data?.error ||
      err?.message ||
      'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>