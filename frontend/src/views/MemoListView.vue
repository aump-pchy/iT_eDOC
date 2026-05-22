<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-10 pt-24 md:pt-28 font-semibold">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">Memo List</h1>
          <p class="text-slate-500 text-sm mt-1">ระบบจัดการและบันทึกข้อความภายในองค์กร</p>
        </div>
        
        <button class="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-emerald-100 transition-all active:scale-95 self-start md:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          สร้างบันทึกใหม่
        </button>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div class="flex flex-col sm:flex-row gap-4 items-end">
          <div class="w-full">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">เลขที่ หรือ เรื่อง</label>
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="พิมพ์เลขที่หนังสือ หรือ ชื่อเรื่องที่ต้องการค้นหา..." 
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
                </svg>
              </span>
            </div>
          </div>
          <button 
            @click="handleSearch"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors active:scale-95"
          >
            ค้นหา
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm font-semibold">
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
                    <button 
                      @click="viewDetails(memo)"
                      class="flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      รายละเอียด
                    </button>
                    <button 
                      @click="editMemo(memo)"
                      class="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                      แก้ไข
                    </button>
                    <button 
                      @click="deleteMemo(memo.id)"
                      class="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m12.452-1.521c.466-.008.94-.005 1.415-.005M11.742 10.344a6.52 6.52 0 0 1-1.006-.035c-1.527-.165-2.715-1.422-2.715-2.977V6a.5.5 0 0 1 .5-.5h2.25A3.333 3.333 0 0 1 11.666 2.25h2.668A3.333 3.333 0 0 1 17.666 5.5H19.9a.5.5 0 0 1 .5.5v.333c0 1.555-1.188 2.812-2.715 2.977a6.522 6.522 0 0 1-1.006.035m-4.74 0V2.25" />
                      </svg>
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredMemos.length === 0">
                <td colspan="4" class="py-12 text-center text-slate-400 bg-slate-50/20">
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

// ช่องเก็บข้อมูลคำค้นหา
const searchQuery = ref('')

// [แก้ไขแล้ว] ลบข้อมูลสมมุติออกทั้งหมด เหลือเพียงอาร์เรย์ว่างเพื่อรอรับข้อมูลจริง
const memos = ref([])

// ฟังก์ชันคัดกรองข้อมูลตามคำค้นหา
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

const handleSearch = () => {
  console.log('กำลังค้นหาคำว่า:', searchQuery.value)
}

const viewDetails = (memo) => {
  alert(`ดูรายละเอียดของเลขที่หนังสือ: ${memo.docNumber}`)
}

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