<template>
  <div class="min-h-screen bg-gray-50 py-8 px-6 md:pt-20">
    
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <h1 class="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        สร้างบันทึกข้อความใหม่
      </h1>

      <div class="p-6 md:p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <div class="flex flex-col md:flex-row md:items-start gap-2">
            <label class="w-full md:w-48 text-gray-800 font-semibold text-base md:pt-2.5">
              เลขที่ บันทึกข้อความ ทส.
            </label>
            <div class="flex-1 w-full">
              <div class="flex gap-2">
                <input 
                  v-model="formData.memoNumber"
                  type="text" 
                  :class="[
                    'flex-1 p-2 border-2 rounded-xl bg-white text-gray-950 placeholder-gray-400 focus:outline-none transition-colors font-medium text-sm',
                    errors.memoNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  ]"
                  placeholder="กรอกเลขที่บันทึกข้อความ"
                />
                <button 
                  type="button"
                  @click="handleCheckMemo"
                  :disabled="checking"
                  class="shrink-0 p-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm disabled:bg-gray-400"
                >
                  {{ checking ? 'กำลังเช็ก...' : 'ตรวจสอบ' }}
                </button>
              </div>
              <p v-if="errors.memoNumber" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                {{ errors.memoNumber }}
              </p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row md:items-start gap-2">
            <label class="w-full md:w-48 text-gray-800 font-semibold text-base md:pt-2.5">
              เรื่อง
            </label>
            <div class="flex-1 w-full">
              <input 
                v-model="formData.subject"
                type="text" 
                :class="[
                  'w-full p-2 border-2 rounded-xl bg-white text-gray-950 placeholder-gray-400 focus:outline-none transition-colors font-medium text-sm',
                  errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="กรอกเรื่อง"
              />
              <p v-if="errors.subject" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                {{ errors.subject }}
              </p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row md:items-start gap-2">
            <label class="w-full md:w-48 text-gray-800 font-semibold text-base md:pt-2.5">
              เรียน
            </label>
            <div class="flex-1 w-full">
              <input 
                v-model="formData.attendTo"
                type="text" 
                :class="[
                  'w-full p-2 border-2 rounded-xl bg-white text-gray-950 placeholder-gray-400 focus:outline-none transition-colors font-medium text-sm',
                  errors.attendTo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="กรอกชื่อผู้อำนวยการ"
              />
              <p v-if="errors.attendTo" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                {{ errors.attendTo }}
              </p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row md:items-start gap-2">
            <label class="w-full md:w-48 text-gray-800 font-semibold text-base md:pt-2.5">
              ผู้ดำเนินการ
            </label>
            <div class="flex-1 w-full">
              <input 
                v-model="formData.operator"
                type="text" 
                disabled
                class="w-full p-2 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button 
              type="submit" 
              :disabled="submitting"
              class="px-6 p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors text-sm disabled:bg-gray-400"
            >
              {{ submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
            </button>
          </div>
        </form>
      </div> 
    </div> 
  </div> 
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import api from '@/api' // เรียกใช้ตัวแปรแกนกลางที่ตั้งค่า baseURL เอาไว้แล้ว

const memoStore = useMemoStore()
const router = useRouter()
const checking = ref(false)
const submitting = ref(false)

// 1. ตัวแปรเก็บข้อมูลฟอร์ม
const formData = reactive({
  memoNumber: '',
  subject: '',
  attendTo: '',    
  operator: '',
  content: 'บันทึกข้อความภายในสถานศึกษา' 
})

// 2. ตัวแปรเก็บข้อความ Error
const errors = reactive({
  memoNumber: '',
  subject: '',
  attendTo: ''
})

// 🚀 โหลดข้อมูลชื่อผู้ใช้ตัวจริงจาก localStorage มาใส่ช่องผู้ดำเนินการอัตโนมัติ
onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    // ถ้ามีชื่อให้ใส่ชื่อ ถ้าไม่มีให้เอาอีเมลแอดมินมาโชว์หล่อ ๆ ครับ
    formData.operator = userData.name || userData.email || 'แอดมินระบบ'
  } else {
    formData.operator = 'ผู้ใช้งานทั่วไป'
  }
})

// 🔍 ฟังก์ชันปุ่ม "ตรวจสอบ" ซ้ำ (ปรับมาใช้แกนกลาง api.js ของกลุ่ม)
const handleCheckMemo = async () => {
  if (!formData.memoNumber.trim()) {
    errors.memoNumber = 'กรุณากรอกเลขที่บันทึกข้อความก่อนสั่งตรวจสอบ'
    return
  }
  
  checking.value = true
  try {
    errors.memoNumber = ''
    
    // ดึงผ่าน api.get ค้นหาเลขที่กรอกมา
    const response = await api.get('/memos', {
      params: { search: formData.memoNumber.trim() }
    })
    
    // คอนโทรลเลอร์หลังบ้านส่วนใหญ่จะห่อข้อมูลไว้ใน response.data.data
    const memoList = response.data.data || response.data || []
    const isDuplicate = memoList.some(m => m.memo_number === formData.memoNumber.trim())
    
    if (isDuplicate) {
      errors.memoNumber = '❌ เลขที่บันทึก ทส. นี้ ถูกใช้งานไปแล้วในระบบ!'
      alert('⚠️ เลขที่บันทึก ทส. นี้ ถูกใช้งานไปแล้วในระบบ! กรุณาเปลี่ยนเลขใหม่ครับ')
    } else {
      alert('✅ เลขที่บันทึกนี้สามารถใช้งานได้ครับอ้าย!')
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบเลขบันทึก:', error)
    alert('⚠️ ไม่สามารถเชื่อมต่อระบบตรวจสอบได้ กรุณาตรวจสอบสถานะเซิร์ฟเวอร์หลังบ้าน')
  } finally {
    checking.value = false
  }
}

// 3. ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง (Validation)
const validateForm = () => {
  let isValid = true
  
  errors.memoNumber = ''
  errors.subject = ''
  errors.attendTo = ''

  if (!formData.memoNumber.trim()) {
    errors.memoNumber = 'กรุณากรอกเลขที่บันทึกข้อความ ทส.'
    isValid = false
  }
  if (!formData.subject.trim()) {
    errors.subject = 'กรุณากรอกเรื่อง'
    isValid = false
  }
  if (!formData.attendTo.trim()) {
    errors.attendTo = 'กรุณากรอกชื่อผู้อำนวยการ'
    isValid = false
  }

  return isValid
}

// 4. ฟังก์ชันส่งฟอร์มเพื่อบันทึกข้อมูลผ่าน Store ปลุกพลัง Pinia
const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    // จัดก้อน Payload ส่งเข้า Store ของครู
    const payload = {
      memo_number: formData.memoNumber.trim(),
      subject: formData.subject.trim(),
      recipient: formData.attendTo.trim(), 
      operator: formData.operator,
      content: formData.content      
    }

    // เรียกใช้ฟังก์ชันของ Store โดยตรง ไม่ต้องยิง fetch ดิบเองแล้วครับ!
    await memoStore.createMemo(payload)
    
    alert('🎉 ยอดเยี่ยมครับอ้าย! บันทึกข้อมูลลงฐานข้อมูลผ่าน Store สำเร็จแล้ว!')
    
    // พอบันทึกเสร็จ ให้เด้งหน้าจอกลับไปที่หน้ารายการรวม (MemoListView) เพื่อดูผลงาน
    router.push('/memos')

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error)
    alert('⚠️ บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบความถูกต้องของข้อมูลหรือสิทธิ์การใช้งาน')
  } finally {
    submitting.value = false
  }
}
</script>