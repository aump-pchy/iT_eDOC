<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden"
       style="background: linear-gradient(135deg, #a0163f 0%, #c4185a 40%, #e8c4d0 100%);">

    <!-- Card -->
    <div class="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8">

      <!-- Logo + Title -->
      <div class="flex flex-col items-center mb-8">
        <img src="/img/IT.png" alt="logo"
             class="w-20 h-20 object-contain mb-3"
             @error="$event.target.style.display='none'" />
        <h1 class="text-2xl font-bold" style="color: #a0163f;">iT-e-Document</h1>
        <p class="text-xs text-gray-400 mt-1">ระบบจัดการหนังสือราชการภายในออนไลน์</p>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">อีเมล</label>
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
            style="focus-ring-color: #a0163f;"
            @keyup.enter="handleLogin"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">รหัสผ่าน</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
            @keyup.enter="handleLogin"
          />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-xs text-center">{{ errorMsg }}</p>

        <button
          @click="handleLogin"
          :disabled="!isValid || loading"
          class="w-full py-2.5 rounded-xl text-white font-medium text-sm transition-all"
          :class="isValid && !loading
            ? 'opacity-100 cursor-pointer hover:opacity-90'
            : 'opacity-60 cursor-not-allowed'"
          style="background: linear-gradient(135deg, #a0163f, #c4185a);"
        >
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
    router.push('/memos')
  } catch (err) {
    errorMsg.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>