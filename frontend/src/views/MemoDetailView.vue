<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div v-if="memo" class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div class="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Memo Detail</h1>
          <p class="text-sm text-gray-500">แสดงข้อมูลบันทึกข้อความรายบุคคล</p>
        </div>
        <span 
          :class="{
            'text-yellow-800 bg-yellow-100': memo.status === 'pending',
            'text-green-800 bg-green-100': memo.status === 'approved',
            'text-red-800 bg-red-100': memo.status === 'rejected'
          }"
          class="px-3 py-1 text-xs font-semibold rounded-full"
        >
          {{ memo.status === 'approved' ? 'อนุมัติแล้ว' : memo.status === 'rejected' ? 'ปฏิเสธ' : 'รอดำเนินการ' }}
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
              :value="memo.memo_number" 
              disabled
              class="w-full rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed font-medium"
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
              :value="memo.subject" 
              disabled
              class="w-full rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed font-medium"
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
              :value="memo.recipient" 
              disabled
              class="w-full rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed font-medium"
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
              :value="memo.operator" 
              disabled
              class="w-full rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <label class="block text-sm font-medium text-gray-500 md:col-span-1">
            ลงวันที่ระบบ:
          </label>
          <div class="md:col-span-3">
            <input 
              type="text" 
              :value="memo.created_at ? new Date(memo.created_at).toLocaleString('th-TH') : ''" 
              disabled
              class="w-full rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed font-medium"
            />
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <label class="block text-base font-semibold text-gray-800 mb-3">
            เนื้อหาข้อความรายละเอียดภายใน
          </label>
          
          <div class="w-full h-auto p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-inner min-h-[120px]">
            <p class="text-gray-700 whitespace-pre-line font-medium text-sm">
              {{ memo.content || 'ไม่มีข้อความรายละเอียดเพิ่มเติม' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200 mt-6">
          <button 
            type="button" 
            @click="router.push('/memos')"
            class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>ย้อนกลับ</span>
          </button>

          <div class="flex flex-wrap gap-2 justify-end">
            <button 
              @click="changeStatus('rejected')"
              class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              ❌ ปฏิเสธ
            </button>
            <button 
              @click="changeStatus('approved')"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors cursor-pointer"
            >
              ✅ อนุมัติ
            </button>
            
            <router-link 
              :to="`/memos/${memo?.id}/edit`"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors flex items-center justify-center"
            >
              📝 แก้ไขข้อมูล
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="text-center py-40 text-gray-500 font-medium w-full flex flex-col items-center justify-center gap-2">
      <div class="animate-spin inline-block w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
      <p class="text-slate-600 font-bold">กำลังดึงรายละเอียดข้อมูลเอกสารจากฐานข้อมูลวิทยาลัย...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'

const store = useMemoStore()
const route = useRoute()
const router = useRouter()

// ดึงวิญญาณข้อมูลชิ้นปัจจุบันมาจากตู้เซฟ Pinia
const memo = computed(() => store.current)

// เมื่อเปิดหน้านี้ขึ้นมา ให้ไปดึงข้อมูลเดี่ยวตามไอดีบน URL ทันที
onMounted(async () => {
  try {
    await store.fetchMemo(route.params.id)
  } catch (error) {
    console.error('Failed to fetch memo:', error)
  }
})

// ฟังก์ชันเปลี่ยนสถานะ เมื่อกดปุ่มจะอัปเดตขึ้นคลาวด์และรีโหลดสเตตัสใหม่
async function changeStatus(status) {
  try {
    await store.updateMemo(route.params.id, { status })
    alert(`เปลี่ยนสถานะเอกสารชิ้นนี้เป็น "${status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}" สำเร็จแล้วครับอ้าย!`)
    await store.fetchMemo(route.params.id) // ดึงข้อมูลอัปเดตล่าสุดมากางใหม่อีกรอบ
  } catch (error) {
    console.error(error)
    alert('⚠️ เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนสถานะเอกสารได้')
  }
}
</script>

<style scoped>
</style>