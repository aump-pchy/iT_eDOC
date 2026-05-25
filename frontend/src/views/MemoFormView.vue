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
                  class="shrink-0 p-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
                >
                  ตรวจสอบ
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
              class="px-6 p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors text-sm"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div> </div> </div> </template>

<script setup>
import { reactive, onMounted } from 'vue'

// 1. ตัวแปรเก็บข้อมูลฟอร์ม
const formData = reactive({
  memoNumber: '',
  subject: '',
  attendTo: '',
  operator: '' 
})

// 2. ตัวแปรเก็บข้อความ Error
const errors = reactive({
  memoNumber: '',
  subject: '',
  attendTo: ''
})

// 🚀 โหลดข้อมูลผู้ใช้อัตโนมัติเมื่อเปิดหน้าเว็บ
onMounted(() => {
  const currentUserName = 'สมชาย ใจดี' 
  formData.operator = currentUserName
})

// 🔍 ฟังก์ชันปุ่ม "ตรวจสอบ"
const handleCheckMemo = () => {
  if (!formData.memoNumber.trim()) {
    errors.memoNumber = 'กรุณากรอกเลขที่บันทึกข้อความก่อนสั่งตรวจสอบ'
    return
  }
  errors.memoNumber = ''
  alert(`ระบบกำลังตรวจสอบเลขที่: ${formData.memoNumber}`)
}

// 3. ตรวจสอบความถูกต้องของข้อมูล (Validation)
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

// 4. ฟังก์ชันเมื่อกดส่งฟอร์มเพื่อบันทึก
const handleSubmit = () => {
  if (validateForm()) {
    alert('ระบบสร้างบันทึกข้อความใหม่สำเร็จแล้วครับอ้าย!')
    console.log('ส่งข้อมูลฟอร์ม:', formData)
  } else {
    console.log('กรอกข้อมูลไม่ครบถ้วน')
  }
}
</script>