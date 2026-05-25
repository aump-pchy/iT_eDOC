<template>
  <div class="min-h-screen bg-slate-100 p-4 md:p-10 font-semibold flex justify-center">
    
    <div class="w-full max-w-5xl bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 mt-12 md:mt-16 self-start">
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">ทะเบียนหนังสือส่ง(ภายใน)</h1>
          <p class="text-slate-500 text-sm mt-1">แผนกวิชาเทคโนโลยีสารสนเทศ และ เทคโนโลยีปัญญาประดิษฐ์ วิทยาลัยเทคนิคเลย</p>
        </div>

        <div class="w-full lg:w-96 shrink-0">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="พิมพ์เลขที่หนังสือ หรือ ชื่อเรื่อง..." 
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pl-11 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm min-h-[300px]">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                <th class="py-4 px-6 w-32 text-center">เลขที่หนังสือ</th>
                <th class="py-4 px-6">เรื่อง</th>
                <th class="py-4 px-6 w-48">ผู้บันทึก</th>
                <th class="py-4 px-6 w-64 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="memo in filteredMemos" :key="memo.id" class="hover:bg-slate-50/70 transition-colors">
                <td class="py-4 px-6 text-center font-bold text-blue-600 bg-blue-50/30 whitespace-nowrap">
                  {{ memo.docNumber }}
                </td>
                <td class="py-4 px-6 font-medium text-slate-800">
                  {{ memo.title }}
                </td>
                <td class="py-4 px-6 text-slate-500 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
                      {{ memo.author ? memo.author.charAt(0) : '' }}
                    </div>
                    <span>{{ memo.author }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 whitespace-nowrap">
                  <div class="flex flex-row items-center justify-center gap-2">
                    
                    <router-link 
                      :to="`/memo-detail/${memo.id}`" 
                      class="bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      รายละเอียด
                    </router-link>

                    <button 
                      @click="editMemo(memo)"
                      class="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      แก้ไข
                    </button>

                    <button 
                      @click="deleteMemo(memo.id)"
                      class="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredMemos.length === 0">
                <td colspan="4" class="py-20 text-center text-slate-400 bg-slate-50/20">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-slate-300">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 17.625 3h-11.25A2.25 2.25 0 0 0 4.125 5.25v6a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <span>ไม่มีข้อมูลบันทึกข้อความในระบบ</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const memos = ref([
  { id: 1, docNumber: '001/2569', title: 'ขออนุมัติจัดซื้อวัสดุสำนักงานประจำไตรมาสที่ 1', author: 'สมชาย สายลุย' },
  { id: 2, docNumber: '002/2569', title: 'แจ้งกำหนดการนัดหมายอบรมการใช้งานระบบ iT_eDOC', author: 'สมหญิง รักเรียน' },
  { id: 3, docNumber: '003/2569', title: 'ขอส่งรายงานผลการซ่อมบำรุงเครื่องแม่ข่าย (Server)', author: 'สมศักดิ์ ช่างคอม' },
  { id: 4, docNumber: '004/2569', title: 'โครงการปรับปรุงระบบเครือข่ายภายในองค์กรประจำปี 2026', author: 'แอดมิน ไอที' }
])

const filteredMemos = computed(() => {
  if (!searchQuery.value.trim()) {
    return memos.value
  }
  const query = searchQuery.value.toLowerCase()
  return memos.value.filter(memo => 
    memo.docNumber.toLowerCase().includes(query) || 
    memo.title.toLowerCase().includes(query)
  )
})

const editMemo = (memo) => {
  alert(`กำลังเปิดหน้าแก้ไข: ${memo.title}`)
}

const deleteMemo = (id) => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการบันทึกนี้?')) {
    memos.value = memos.value.filter(memo => memo.id !== id)
  }
}
</script>

<style scoped>
</style>