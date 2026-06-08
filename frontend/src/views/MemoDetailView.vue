<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 md:pt-20">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div class="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            รายละเอียดบันทึกข้อความ เลขที่ ทส {{ memo.document_no || '....' }}/2569
          </h1>
          <p class="text-sm text-gray-500">แสดงข้อมูลและจัดการสถานะเอกสารบันทึกข้อความกลุ่ม</p>
        </div>
        <span 
          :class="memo.status === 'ดำเนินการแล้ว' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
          class="text-xs font-semibold px-3 py-1 rounded-full border"
        >
          {{ memo.status }}
        </span>
      </div>

      <div class="space-y-4">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            เลขที่ บันทึกข้อความ:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              :value="memo.document_no" 
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
              :value="memo.title" 
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
              :value="memo.to_position" 
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
              type="text" 
              :value="formattedThaiDate" 
              disabled
              class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            ผู้ดำเนินงาน:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              :value="memo.creator_name" 
              disabled
              class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <label class="block text-base font-semibold text-gray-800 mb-3">
            เนื้อหาข้อความรายละเอียดภายใน
          </label>
          
          <div v-if="memo.status === 'กำลังดำเนินการ'" class="w-full p-8 border-2 border-dashed border-yellow-300 rounded-xl bg-yellow-50 flex flex-col justify-center items-center text-center">
            <svg class="h-12 w-12 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p class="text-sm font-medium text-gray-700 mb-1">เลือกไฟล์ PDF บันทึกข้อความเพื่ออัปโหลดระบบ</p>
            <p class="text-xs text-red-500 mb-4">* เมื่อกดอัปโหลดเสร็จสิ้น ระบบจะปรับเปลี่ยนสถานะเป็น ดำเนินการแล้ว โดยอัตโนมัติ</p>
            
            <input 
              type="file" 
              @change="handlePdfUpload" 
              accept="application/pdf"
              class="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 cursor-pointer"
            />
          </div>

          <div v-else-if="memo.status === 'ดำเนินการแล้ว'" class="w-full h-[550px] border border-gray-300 rounded-xl bg-gray-100 shadow-inner overflow-hidden relative">
            <iframe 
              :src="memo.pdf_url" 
              width="100%" 
              height="100%" 
              class="w-full h-full bg-white rounded-xl"
            ></iframe>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
          
          <button 
            type="button" 
            @click="goBack"
            class="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
            bg-blue-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center 
            space-x-2 transition duration-150"
          >
            <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>ย้อนกลับ</span>
          </button>

          <div class="flex space-x-2">
            <button 
              type="button"
              @click="cancelMemo"
              class="px-5 py-2 rounded-xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150 flex items-center space-x-1"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>ยกเลิกบันทึกข้อความ</span>
            </button>

            <button 
              v-if="memo.status === 'กำลังดำเนินการ'"
              type="button"
              @click="goToEdit"
              class="px-5 py-2 rounded-xl shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 transition duration-150 flex items-center space-x-1"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>แก้ไขข้อมูล</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const memo = ref({
  id: '',
  document_no: '....',
  title: '',
  to_position: '',
  creator_name: '',
  created_at: '',
  status: 'กำลังดำเนินการ', 
  pdf_url: ''
})

const formattedThaiDate = computed(() => {
  if (!memo.value.created_at) return 'ไม่มีข้อมูลวันที่'
  const date = new Date(memo.value.created_at)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handlePdfUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    alert('ระบบกำลังดึงไฟล์เข้าหน่วยความจำและดำเนินการเปลี่ยนสถานะ...')
    memo.value.status = 'ดำเนินการแล้ว'
    memo.value.pdf_url = URL.createObjectURL(file) 
    alert('บันทึกและปรับปรุงสถานะเป็น "ดำเนินการแล้ว" เรียบร้อย!')
  } catch (error) {
    console.error('Upload Error:', error)
  }
}

const cancelMemo = async () => {
  if (confirm('คุณแน่ใจใช่ไหมว่าต้องการ "ยกเลิกและลบ" ข้อมูลบันทึกข้อความรายการนี้ทิ้ง?')) {
    alert('ลบข้อมูลบันทึกข้อความเรียบร้อยแล้ว')
    router.push('/memos')
  }
}

const goBack = () => {
  router.push('/memos') 
}

const goToEdit = () => {
  router.push(`/memos/${memo.value.id}/edit`)
}

onMounted(() => {
  const memoId = route.params.id || '1'
  memo.value.id = memoId

  // Mock ข้อมูลทดสอบ (ช่อง document_no จะเอาเลข 56 ไปหยอดในกล่อง Input ให้ทันทีครับ)
  memo.value.document_no = '56'
  memo.value.title = 'ขออนุมัติจัดซื้อครุภัณฑ์คอมพิวเตอร์ประจำปี 2026'
  memo.value.to_position = 'ผู้อำนวยการวิทยาลัยเทคนิคเลย'
  memo.value.creator_name = 'สมชาย สายลุย'
  memo.value.created_at = '2026-06-08T07:00:00.000Z'
  memo.value.status = 'กำลังดำเนินการ' 
})
</script>