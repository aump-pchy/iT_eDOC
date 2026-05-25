<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 md:pt-20">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div class="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">เลขที่บันทึกข้อความ</h1>
          <p class="text-sm text-gray-500">แสดงข้อมูลบันทึกข้อความรายบุคคล</p>
        </div>
        
      </div>

      <div class="space-y-4">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            เลขที่ บันทึกข้อความ:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              value="EDOC-2026-004" 
              disabled
              class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            เรื่อง:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              value="ขออนุมัติจัดซื้อครุภัณฑ์คอมพิวเตอร์ประจำปี 2026" 
              disabled
              class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            เรียน:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              value="ผู้อำนวยการสำนักคอมพิวเตอร์และเทคโนโลยีสารสนเทศ" 
              disabled
              class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            ลงวันที่:
          </label>
          <div class="md:col-span-3">
            <input 
              type="date" 
              value="2026-05-25" 
              disabled
              class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <label class="block text-base font-semibold text-gray-800 mb-3">
            ไฟล์ pdf บันทึกข้อความที่แนบไว้
          </label>
          
          <div class="w-full h-96 border border-gray-300 rounded-lg bg-gray-200 shadow-inner flex flex-col justify-center items-center overflow-hidden relative">
            <div class="text-center p-6 text-gray-500">
              <svg class="mx-auto h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-sm font-medium text-gray-700">[ พื้นที่แสดงผลพรีวิวเอกสาร PDF อัตโนมัติ ]</p>
              <p class="text-xs text-gray-400 mt-1">เมื่อเชื่อมต่อกับ API วันจันทร์ จะดึงไฟล์จริงมาเปิดตรงนี้ทันที</p>
            </div>
          </div>
        </div>

        <div class="flex justify-start pt-4 border-t border-gray-100 mt-6">
          <button 
            type="button" 
            @click="goBack"
            class="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
            bg-blue-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center 
            space-x-2 transition duration-150"
          >
            <svg class="h-4 w-4 text-white" fill="none" viewBox=" 0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>ย้อนกลับ</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// เรียกใช้งาน Router ของ Vue
const router = useRouter()

// ฟังก์ชันกดแล้วให้ลิงก์ย้อนกลับไปหน้ารายการ (MemoListView)
const goBack = () => {
  // ใส่ชื่อ path หรือชื่อ name ของหน้า MemoListView ที่คุณตั้งไว้ในไฟล์ router/index.js
  // ตัวอย่างเช่น หากหน้าลิสต์ใช้ path: '/memos' หรือคุณจะใช้ router.back() เพื่อถอยหลังกลับก็ได้ครับ
  router.push('/memos') 
}
</script>

<style scoped>
</style>