<template>
  <div class="min-h-screen bg-slate-100 p-4 md:p-10 font-semibold flex justify-center">

    <div
      class="w-full max-w-5xl bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 mt-12 md:mt-16 self-start">

      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">ทะเบียนหนังสือส่ง(ภายใน)</h1>
          <p class="text-slate-500 text-sm mt-1">แผนกวิชาเทคโนโลยีสารสนเทศ และ เทคโนโลยีปัญญาประดิษฐ์ วิทยาลัยเทคนิคเลย
          </p>
        </div>

        <div class="w-full lg:w-96 shrink-0">
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="พิมพ์เลขที่, ปี พ.ศ., เรื่อง หรือ ผู้บันทึก..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pl-11 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm" />
            <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm min-h-[300px]">
        <div class="overflow-x-auto">

          <div v-if="loading" class="text-center py-24 text-slate-400 font-medium flex flex-col items-center gap-3">
            <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p>กำลังโหลดข้อมูลบันทึกข้อความจากฐานข้อมูล...</p>
          </div>

          <!-- ✨ ปรับปรุงโครงสร้างตารางตามบรีฟอาจารย์ เหลือ 3 คอลัมน์ -->
          <table v-else class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                <!-- ข้อ 1: คอลัมน์แรก ข้อมูลเอกสาร -->
                <th class="py-4 px-6">ข้อมูลเอกสาร</th>
                <!-- ข้อ 2: เปลี่ยนหัวข้อจาก ผู้บันทึก เป็น ผู้ดำเนินงาน -->
                <th class="py-4 px-6 w-56">ผู้ดำเนินงาน</th>
                <!-- ข้อ 3: คอลัมน์จัดการยังคงอยู่เหมือนเดิม -->
                <th class="py-4 px-6 w-64 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="memo in filteredMemos" :key="memo.id" class="hover:bg-slate-50/70 transition-colors">

                <!-- 🟢 คอลัมน์ที่ 1: ข้อมูลเอกสาร (มัดรวม 4 อย่างแนวดิ่ง) -->
                <td class="py-4 px-6">
                  <div class="flex flex-col gap-1.5">
                    <!-- 1.1 เลขที่หนังสือ -->
                    <span class="font-bold text-blue-600 text-base">
                      {{ memo.memo_number }}
                    </span>

                    <!-- 1.2 เรื่อง -->
                    <span class="font-medium text-slate-800 text-sm">
                      เรื่อง: {{ memo.subject }}
                    </span>

                    <!-- 1.3 ลงเมื่อวันที่ (แปลงวันที่ให้อ่านง่ายสไตล์ไทย) -->
                    <span class="text-xs text-slate-400">
                      ลงเมื่อวันที่: {{ memo.memo_date ? new Date(memo.memo_date).toLocaleDateString('th-TH', {
                        year:
                          'numeric', month: 'long', day: 'numeric' }) : '-' }}
                    </span>

                    <!-- 1.4 สถานะเอกสาร (ย้ายมารวมอยู่ด้านล่างข้อมูลเอกสาร) -->
                    <div class="inline-flex items-center gap-2 font-bold text-xs mt-0.5">
                      <span class="w-2 h-2 rounded-full inline-block shrink-0 shadow-sm" :class="{
                        'bg-amber-400': memo.status === 'กำลังดำเนินการ' || memo.status === 'draft',
                        'bg-emerald-500': memo.status === 'ดำเนินการแล้ว' || memo.status === 'completed',
                        'bg-slate-300': memo.status !== 'กำลังดำเนินการ' && memo.status !== 'draft' && memo.status !== 'ดำเนินการแล้ว' && memo.status !== 'completed'
                      }"></span>

                      <span :class="{
                        'text-amber-600': memo.status === 'กำลังดำเนินการ' || memo.status === 'draft',
                        'text-emerald-600': memo.status === 'ดำเนินการแล้ว' || memo.status === 'completed',
                        'text-slate-500': memo.status !== 'กำลังดำเนินการ' && memo.status !== 'draft' && memo.status !== 'ดำเนินการแล้ว' && memo.status !== 'completed'
                      }">
                        {{ memo.status === 'draft' || memo.status === 'กำลังดำเนินการ' ? 'กำลังดำเนินการ' : (memo.status
                          === 'completed' || memo.status === 'ดำเนินการแล้ว' ? 'ดำเนินการแล้ว' : memo.status) }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- 🟢 คอลัมน์ที่ 2: ผู้ดำเนินงาน -->
                <td class="py-4 px-6 text-slate-500 whitespace-nowrap align-middle">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase">
                      {{ memo.profiles?.full_name ? memo.profiles.full_name.charAt(0) : 'U' }}
                    </div>
                    <span class="font-medium text-slate-700">{{ memo.profiles?.full_name || 'ไม่ระบุชื่อผู้ดำเนินการ'
                      }}</span>
                  </div>
                </td>

                <!-- 🟢 คอลัมน์ที่ 3: จัดการ (ซ่อนปุ่มแก้ไขถ้าสถานะดำเนินการแล้ว) -->
                <td class="py-4 px-6 whitespace-nowrap align-middle">
                  <div class="flex flex-row items-center justify-center gap-2">

                    <router-link :to="`/memos/${memo.id}`"
                      class="bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                      รายละเอียด
                    </router-link>

                    <!-- 🔥 เช็กสถานะ: ถ้าเท่ากับ 'completed' หรือ 'ดำเนินการแล้ว' จะซ่อนปุ่มแก้ไขนี้ไปทันทีค่ะ -->
                    <button v-if="memo.status !== 'completed' && memo.status !== 'ดำเนินการแล้ว'"
                      @click="openEditModal(memo)"
                      class="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                      แก้ไข
                    </button>

                    <button @click="deleteMemo(memo.id)"
                      class="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                      ลบ
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ────────────────────────────────────────── -->
    <!-- 📦 ฟอร์มแก้ไขข้อมูล Modal (คงเดิมไม่เปลี่ยนแปลง) -->
    <!-- ────────────────────────────────────────── -->
    <div v-if="showEditModal"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
      <div
        class="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div class="border-b border-slate-100 pb-4 mb-5">
          <h3 class="text-xl font-bold text-slate-800 tracking-tight">แก้ไขข้อมูลบันทึกข้อความ</h3>
          <p class="text-xs text-slate-400 mt-0.5">แก้ไขรายละเอียดเอกสารและบันทึกข้อมูลกลับเข้าสู่ระบบ</p>
        </div>

        <form @submit.prevent="submitUpdate">
          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">เลขที่บันทึกข้อความ
              ศส. (แก้ไขไม่ได้)</label>
            <input type="text" :value="editForm.memo_number" disabled
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 font-bold cursor-not-allowed text-sm focus:outline-none" />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">เรื่อง</label>
            <input v-model="editForm.subject" type="text" required
              class="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>

          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">ผู้ดำเนินการ (ชื่อ-นามสกุล)</label>
            <input v-model="editForm.full_name" type="text" required readonly
              class="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>

          <div class="mb-6">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">สถานะเอกสาร</label>
            <div class="relative">
              <select v-model="editForm.status">
                <option value="draft">กำลังดำเนินการ</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="completed">ดำเนินการแล้ว</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" @click="showEditModal = false"
              class="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 text-sm font-semibold transition-colors">
              ยกเลิก
            </button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-sm shadow-blue-200 transition-colors">
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMemoStore } from '@/stores/memo'

const store = useMemoStore()
const searchQuery = ref('')

// สำหรับจัดการ Pop-up แก้ไขข้อมูล (ข้อ 6)
const showEditModal = ref(false)
const editForm = ref({ id: null, memo_number: '', subject: '', full_name: '', status: '' })

const memos = computed(() => store.memos)
const loading = computed(() => store.loading)

onMounted(() => {
  store.fetchMemos()
})

// 👀 ข้อ 2: ปรับปรุงเงื่อนไข Filter ค้นหาได้ครอบคลุมจาก เลขที่หนังสือ, ปี พ.ศ., เรื่อง, ชื่อผู้ดำเนินการ
const filteredMemos = computed(() => {
  const currentMemos = memos.value || []
  if (!searchQuery.value.trim()) {
    return currentMemos
  }
  const query = searchQuery.value.toLowerCase()
  return currentMemos.filter(memo => {
    // 1. ดักหาจากเลขหนังสือเดี่ยวๆ
    const matchMemoNumber = memo.memo_number && memo.memo_number.toLowerCase().includes(query)

    // 2. ดักหาจากชื่อเรื่อง
    const matchSubject = memo.subject && memo.subject.toLowerCase().includes(query)

    // 3. ดักหาจากชื่อ-นามสกุลจริงผู้ดำเนินการ
    const actualFullName = memo.profiles?.full_name || memo.full_name || ''
    const matchFullName = actualFullName.toLowerCase().includes(query)

    // 4. พิเศษ!! ดักคำนวณปี พ.ศ. ปัจจุบันที่แสดงบนหน้าจอ (2569) เผื่อผู้ใช้พิมพ์ค้นหาปีพ.ศ. โดยเฉพาะ
    const currentYearBE = (new Date().getFullYear() + 543).toString()
    const matchYear = currentYearBE.includes(query) && memo.memo_number // ถ้าพิมพ์ปีตรงกับปีที่แสดงผลให้แสดงข้อมูลขึ้นมา

    return matchMemoNumber || matchSubject || matchFullName || matchYear
  })
})

// 📝 ข้อ 6: ฟังก์ชันสปริงข้อมูลเดิมเปิด Modal ฟอร์มแก้ไขจริง
const openEditModal = (memo) => {
  editForm.value = { ...memo } // โคลนข้อมูลเดิมมา

  // ✨ จุดสำคัญ: ต้องวิ่งไปแกะชื่อจริงมาจากวัตถุพ่วง memo.profiles.full_name ก่อนส่งเข้าฟอร์มค่ะ
  editForm.value.full_name = memo.profiles?.full_name || memo.full_name || ''

  if (!editForm.value.status) editForm.value.status = 'กำลังดำเนินการ'
  showEditModal.value = true
}

// ฟังก์ชันบันทึกข้อมูลแก้ไขส่งกลับหาเซิร์ฟเวอร์
const submitUpdate = async () => {
  try {
    // 1. ส่งข้อมูลไปอัปเดตหลังบ้านตามปกติ
    await store.updateMemo(editForm.value.id, {
      subject: editForm.value.subject,
      status: editForm.value.status
    })

    // 2. ปิดหน้าต่าง Pop-up แก้ไข
    showEditModal.value = false

    // 3. ✨ ดักสั่งโหลดข้อมูลใหม่ยกแผงอย่างสมบูรณ์แบบเพื่อบังคับให้ Vue.js วาดตารางที่มีชื่อเชื่อมข้ามตารางใหม่แกะกล่อง
    await store.fetchMemos()

    // 4. ขึ้นแจ้งเตือนเมื่อสำเร็จชัวร์ๆ
    alert('อัปเดตข้อมูลเอกสารเรียบร้อยแล้ว')

  } catch (err) {
    console.error("หน้าบ้านพังตอนกดเซฟ ->", err)
    alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล')
  }
}

// 🗑️ ข้อ 7: ส่วนลบ ต้องกดยืนยันก่อน และเปลี่ยนข้อความแจ้งเตือนใหม่ตรงสเปก
const deleteMemo = async (id) => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการบันทึกนี้?')) {
    try {
      await store.deleteMemo(id)
      // ข้อความแจ้งเตือนปรับปรุงตามบรีฟข้อ 7 เป๊ะๆ ครับอ้าย
      alert('ลบข้อมูลบันทึกข้อความแล้ว')
      await store.fetchMemos()
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }
}
</script>