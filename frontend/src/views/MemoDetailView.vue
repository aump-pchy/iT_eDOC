<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div class="border-b border-gray-200 pb-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Memo Detail</h1>
        <p class="text-sm text-gray-500">รายละเอียดบันทึกข้อความและไฟล์แนบ (Frontend Static UI)</p>
      </div>

      <form class="space-y-4">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-700 md:col-span-1">
            เลขที่ บันทึกข้อความ:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="กรอกเลขที่บันทึกข้อความ"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-700 md:col-span-1">
            เรื่อง:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="กรอกเรื่อง"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-700 md:col-span-1">
            เรียน:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="กรอกผู้รับ (เรียน...)"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-700 md:col-span-1">
            ลงวันที่:
          </label>
          <div class="md:col-span-3">
            <input 
              type="date" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <label class="block text-base font-semibold text-gray-800 mb-3">
            ไฟล์ pdf บันทึกข้อความ
          </label>
          
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20L28 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M28 8v12h12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              
              <div class="flex text-sm text-gray-600 justify-center">
                <span class="font-medium text-gray-400">
                  พื้นที่สำหรับแสดงผล / อัพโหลดไฟล์ PDF
                </span>
              </div>
              <p class="text-xs text-gray-400">รองรับเฉพาะไฟล์ .pdf เท่านั้น (รอระบบหลังบ้านวันจันทร์)</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button 
            type="button" 
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            บันทึกข้อมูล
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
// ฝั่ง Logic ปล่อยว่างไว้ 100% รอคุณครูพามาเขียนผูกตัวแปรเชื่อมโยง Backend วันจันทร์ครับ
</script>

<style scoped>
/* สไตล์จาก Tailwind CSS ครอบคลุมแล้ว ไม่ต้องเขียน CSS เพิ่มเติมครับ */
</style>