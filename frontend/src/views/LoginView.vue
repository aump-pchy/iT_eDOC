<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow w-full ">
      
      <h1 class="text-2xl font-bold text-gray-800 mb-6">เข้าสู่ระบบ</h1>

      <!-- แสดงค่า ref แบบ real-time -->
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

      <!-- computed จะเปลี่ยนสีปุ่มให้อัตโนมัติ -->
      <button
        @click="handleLogin"
        :disabled="!isValid"
        :class="isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
        class="w-full text-white font-medium py-2 rounded-lg transition-colors"
      >
        เข้าสู่ระบบ
      </button>

      <!-- แสดง error ถ้ามี -->
      <p v-if="errorMsg" class="text-red-500 text-sm mt-3">{{ errorMsg }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ref = กล่องเก็บค่าที่ Vue "มองเห็น" การเปลี่ยนแปลง
const email    = ref('')
const password = ref('')
const errorMsg = ref('')
const loading  = ref(false)

// computed = ค่าที่คำนวณจาก ref อื่น — อัปเดตอัตโนมัติ
const isValid = computed(() => {
  return email.value.length > 0 && password.value.length >= 6
})

// function ธรรมดา — ใช้ .value เพื่อเข้าถึงค่าใน ref
function handleLogin() {
  errorMsg.value = ''

  // ทดสอบก่อน (ยังไม่เชื่อม API จริง)
  if (email.value === 'test@test.com' && password.value === '123456') {
    alert('เข้าสู่ระบบสำเร็จ!')
  } else {
    errorMsg.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  }
}
</script>