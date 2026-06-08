<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow w-full max-w-md">
      
      <h1 class="text-2xl font-bold text-gray-800 mb-6">เข้าสู่ระบบ</h1>

      <p class="text-sm text-gray-500 mb-4">
        พิมพ์อยู่: {{ email }}
      </p>

      <input
        v-model="email"
        type="email"
        placeholder="อีเมล"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
      />

      <input
        v-model="password"
        type="password"
        placeholder="รหัสผ่าน"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
      />

      <button
        @click="handleLogin"
        :disabled="!isValid || loading"
        :class="isValid && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
        class="w-full text-white font-medium py-2 rounded-lg transition-colors"
      >
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>

      <p v-if="errorMsg" class="text-red-500 text-sm mt-3">{{ errorMsg }}</p>

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
const error    = ref('')
const loading  = ref(false)

// เปิดระบบล็อกปุ่มถ้ากรอกข้อมูลไม่ครบตามเงื่อนไขครู
const isValid = computed(() => {
  return email.value.trim() !== '' && password.value.trim() !== ''
})

// ฟังก์ชันล็อกอินเชื่อม API ของจริง ยิงหาหลังบ้านพอร์ต 3000
async function handleLogin() {
  errorMsg.value   = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/memos') // ถ้าผ่านจริง จะวาร์ปไปหน้าดึงรายการบันทึกข้อความทันที
  } catch (err) {
    errorMsg.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>