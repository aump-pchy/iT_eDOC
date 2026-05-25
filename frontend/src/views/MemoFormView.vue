<template>
  <div class="p-8 mt-7 max-w-5xl mx-auto bg-white rounded-xl shadow-md border border-gray-100">
    <h1 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
      MemoForm
    </h1>
    <p class="text-sm text-gray-400 mb-12">กรอกข้อมูลบันทึกข้อความให้ครบถ้วนก่อนทำการบันทึก</p>

    <form @submit.prevent="handleSubmit" class="space-y-10">
      
      <div class="flex flex-col md:flex-row md:items-start gap-4">
        <label class="w-full md:w-64 text-gray-800 font-semibold text-base md:pt-2">
          เลขที่ บันทึกข้อความ ทส.
        </label>
        <div class="flex-1 w-full">
          <input 
            v-model="formData.memoNumber"
            type="text" 
            :class="[
              'w-full py-3 px-4 border rounded-lg bg-gray-50/50 text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium text-sm',
              errors.memoNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
            placeholder="กรอกเลขที่บันทึกข้อความ"
          />
          <p v-if="errors.memoNumber" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
            {{ errors.memoNumber }}
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-start gap-4">
        <label class="w-full md:w-64 text-gray-800 font-semibold text-base md:pt-2">
          เรื่อง
        </label>
        <div class="flex-1 w-full">
          <input 
            v-model="formData.subject"
            type="text" 
            :class="[
              'w-full py-3 px-4 border rounded-lg bg-gray-50/50 text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium text-sm',
              errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
            placeholder="กรอกเรื่อง"
          />
          <p v-if="errors.subject" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
            {{ errors.subject }}
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-start gap-4">
        <label class="w-full md:w-64 text-gray-800 font-semibold text-base md:pt-2">
          เรียน
        </label>
        <div class="flex-1 w-full">
          <input 
            v-model="formData.attendTo"
            type="text" 
            :class="[
              'w-full py-3 px-4 border rounded-lg bg-gray-50/50 text-gray-950 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium text-sm',
              errors.attendTo ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
            placeholder="กรอกชื่อผู้อำนวยการ"
          />
          <p v-if="errors.attendTo" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
            {{ errors.attendTo }}
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-start gap-4">
        <label class="w-full md:w-64 text-gray-800 font-semibold text-base md:pt-2">
          ผู้ดำเนินการ
        </label>
        <div class="flex-1 w-full">
          <div class="relative">
            <select 
              v-model="formData.operator"
              :class="[
                'w-full py-3 px-4 border rounded-lg bg-gray-50/50 text-gray-950 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer font-medium text-sm',
                errors.operator ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              ]"
              style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.65rem auto;"
            >
              <option value="" disabled class="text-gray-400">เลือกผู้ดำเนินการ</option>
              <option value="1" class="text-gray-950 bg-white">เจ้าหน้าที่บุคคล</option>
              <option value="2" class="text-gray-950 bg-white">เจ้าหน้าที่ไอที</option>
              <option value="3" class="text-gray-950 bg-white">หัวหน้าแผนก</option>
            </select>
          </div>
          <p v-if="errors.operator" class="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
            {{ errors.operator }}
          </p>
        </div>
      </div>

      <div class="pt-6 flex justify-end">
        <button 
          type="submit" 
          class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 1. สร้างตัวแปรเก็บข้อมูลฟอร์ม
const formData = reactive({
  memoNumber: '',
  subject: '',
  attendTo: '',
  operator: ''
})

// 2. สร้างตัวแปรไว้เก็บข้อความแจ้งเตือน Error
const errors = reactive({
  memoNumber: '',
  subject: '',
  attendTo: '',
  operator: ''
})

// 3. ฟังก์ชันตรวจสอบความถูกต้อง (Validation)
const validateForm = () => {
  let isValid = true
  
  // ล้างค่าเก่าออกก่อนเช็กใหม่ทุกครั้ง
  errors.memoNumber = ''
  errors.subject = ''
  errors.attendTo = ''
  errors.operator = ''

  if (!formData.memoNumber.trim()) {
    errors.memoNumber = 'กรุณากรอกเลขที่บันทึกข้อความ ทส.'
    isValid = false
  }
  
  if (!formData.subject.trim()) {
    errors.subject = 'กรุณากรอกเรื่อง'
    isValid = false
  }
  
  if (!formData.attendTo.trim()) {
    errors.attendTo = 'กรุณากรอกชื่อผู้เรียน (ถึงใคร)'
    isValid = false
  }
  
  if (!formData.operator) {
    errors.operator = 'กรุณาเลือกผู้ดำเนินการ'
    isValid = false
  }

  return isValid
}

// 4. ฟังก์ชันเมื่อกดปุ่มส่งฟอร์ม บันทึกข้อมูล
const handleSubmit = () => {
  if (validateForm()) {
    alert('บันทึกข้อมูลสำเร็จแล้วครับอ้าย!')
    console.log('Data to send:', formData)
  } else {
    console.log('ฟอร์มไม่ถูกต้อง กรุณากรอกข้อมูลให้ครบ')
  }
}
</script>