<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 md:pt-20">
    <div class="max-w-3xl mx-auto">

      <div v-if="loading" class="bg-white p-10 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-500">
        <svg class="animate-spin h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p class="text-sm">กำลังโหลดข้อมูลบันทึกข้อความ...</p>
      </div>

      <div v-else-if="fetchError" class="bg-white p-10 rounded-xl shadow-md border border-red-200 text-center">
        <p class="text-red-500 font-medium mb-1">{{ fetchError }}</p>
        <p class="text-sm text-gray-400 mb-4">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่</p>
        <button @click="fetchMemo" class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          ลองใหม่
        </button>
      </div>

      <div v-else class="bg-white p-6 rounded-xl shadow-md border border-gray-200">

        <div class="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              รายละเอียดบันทึกข้อความ เลขที่ {{ memo.memo_number || '....' }}
            </h1>
            <p class="text-sm text-gray-500">แสดงข้อมูลและจัดการสถานะเอกสารบันทึกข้อความกลุ่ม</p>
          </div>
          <span
            :class="statusBadgeClass"
            class="text-xs font-semibold px-3 py-1 rounded-full border uppercase"
          >
            {{ memo.status }}
          </span>
        </div>

        <div class="space-y-4">

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <label class="block text-sm font-medium text-gray-500 md:col-span-1">เลขที่ บันทึกข้อความ:</label>
            <div class="md:col-span-3">
              <input type="text" :value="memo.memo_number" disabled
                class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <label class="block text-sm font-medium text-gray-500 md:col-span-1">เรื่อง:</label>
            <div class="md:col-span-3">
              <input type="text" :value="memo.subject" disabled
                class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <label class="block text-sm font-medium text-gray-500 md:col-span-1">เรียน:</label>
            <div class="md:col-span-3">
              <input type="text" :value="memo.recipient" disabled
                class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <label class="block text-sm font-medium text-gray-500 md:col-span-1">ลงวันที่:</label>
            <div class="md:col-span-3">
              <input type="text" :value="formattedThaiDate" disabled
                class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
            <label class="block text-sm font-medium text-gray-500 md:col-span-1">ผู้ดำเนินงาน:</label>
            <div class="md:col-span-3">
              <input type="text" :value="memo.operator" disabled
                class="w-full rounded-xl border-gray-200 bg-gray-100 text-gray-700 shadow-sm sm:text-sm border p-2 cursor-not-allowed"/>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200">
            <label class="block text-base font-semibold text-gray-800 mb-3">
              เนื้อหาข้อความรายละเอียดภายใน
            </label>

            <div v-if="memo.status === 'กำลังดำเนินการ' || memo.status === 'draft' || !displayPdfUrl"
              class="w-full p-8 border-2 border-dashed border-yellow-300 rounded-xl bg-yellow-50 flex flex-col justify-center items-center text-center">
              <svg class="h-12 w-12 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <p class="text-sm font-medium text-gray-700 mb-1">เลือกไฟล์ PDF บันทึกข้อความเพื่ออัปโหลดระบบ</p>
              <p class="text-xs text-red-500 mb-4">* เมื่อกดอัปโหลดเสร็จสิ้น ระบบจะปรับเปลี่ยนสถานะเป็น ดำเนินการแล้ว โดยอัตโนมัติ</p>

              <input
                type="file"
                ref="pdfInput"
                @change="handlePdfUpload"
                accept="application/pdf"
                :disabled="uploading"
                class="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 cursor-pointer disabled:opacity-50"
              />

              <div v-if="uploading" class="mt-4 flex items-center gap-2 text-sm text-yellow-700">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                กำลังอัปโหลดและอัปเดตสถานะ...
              </div>
            </div>

            <div v-else
              class="w-full h-[550px] border border-gray-300 rounded-xl bg-gray-100 shadow-inner overflow-hidden relative">
              <iframe :src="displayPdfUrl" width="100%" height="100%"
                class="w-full h-full bg-white rounded-xl"></iframe>
            </div>
          </div>

          <transition name="fade">
            <div v-if="toast.show"
              :class="toast.type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'"
              class="flex items-center gap-2 border rounded-xl px-4 py-3 text-sm mt-4">
              <svg v-if="toast.type === 'success'" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <svg v-else class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ toast.message }}
            </div>
          </transition>

          <div class="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
            <button type="button" @click="goBack"
              class="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center space-x-2 transition duration-150">
              <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>ย้อนกลับ</span>
            </button>

            <div class="flex space-x-2">
              <button
                type="button"
                @click="cancelMemo"
                :disabled="deleting"
                class="px-5 py-2 rounded-xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition duration-150 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="!deleting" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <svg v-else class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span>{{ deleting ? 'กำลังลบ...' : 'ยกเลิกบันทึกข้อความ' }}</span>
              </button>

              <button
                v-if="memo.status === 'กำลังดำเนินการ' || memo.status === 'draft'"
                type="button"
                @click="goToEdit"
                class="px-5 py-2 rounded-xl shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 transition duration-150 flex items-center space-x-1">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                <span>แก้ไขข้อมูล</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// ─── การตั้งค่า API ───────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ─── ตัวช่วยจัดการเส้นทาง ───────────────────────────
const router = useRouter()
const route  = useRoute()

// ─── ตัวแปรเก็บสถานะการทำงานภายในหน้าจอ ─────────────────
const memo       = ref({})
const localPdf   = ref(null) 
const loading    = ref(true)
const uploading  = ref(false)
const deleting   = ref(false)
const fetchError = ref(null)
const pdfInput   = ref(null)

const toast = ref({ show: false, type: 'success', message: '' })

// ─── ฟังก์ชันคํานวณตัวแปรอัตโนมัติ ─────────────────────
const formattedThaiDate = computed(() => {
  if (!memo.value.created_at) return 'ไม่มีข้อมูลวันที่'
  return new Date(memo.value.created_at).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
})

const statusBadgeClass = computed(() => {
  if (memo.value.status === 'ดำเนินการแล้ว' || memo.value.status === 'completed') return 'bg-green-100 text-green-800'
  if (memo.value.status === 'draft' || memo.value.status === 'กำลังดำเนินการ') return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  return 'bg-amber-100 text-amber-800'
})

const displayPdfUrl = computed(() => {
  if (localPdf.value) return localPdf.value
  return memo.value.pdf_url || memo.value.pdf_path || memo.value.file_url || null
})

// ─── ฟังก์ชันโชว์แจ้งเตือนเด้งขึ้นมา ─────────────────────
function showToast(message, type = 'success') {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 4000)
}

// ─── ดึงข้อมูลบันทึกข้อความเดี่ยวๆ จากหลังบ้าน ───────────────────
async function fetchMemo() {
  loading.value   = true
  fetchError.value = null
  try {
    const res = await fetch(`${BASE_URL}/memos/${route.params.id}`, {
      headers: authHeaders()
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'โหลดข้อมูลไม่สำเร็จ')
    }
    const data = await res.json()
    memo.value = data.data !== undefined ? data.data : data
  } catch (err) {
    fetchError.value = err.message
  } finally {
    loading.value = false
  }
}

// ─── แพ็กไฟล์และข้อความเป็น FormData ยิง PUT ไปหาเซิร์ฟเวอร์หลังบ้าน ───
async function handlePdfUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('pdf', file)  // ← แก้จาก 'pdf_file' เป็น 'pdf'

    const res = await fetch(`${BASE_URL}/memos/${memo.value.id}/upload-pdf`, {  // ← แก้ endpoint
      method: 'POST',  // ← แก้จาก PUT เป็น POST
      headers: { ...authHeaders() },
      body: formData
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'อัปโหลดไม่สำเร็จ')
    }

    const updated = await res.json()
    const updatedData = updated.data !== undefined ? updated.data : updated

    memo.value = updatedData
    showToast('อัปโหลดและอัปเดตสถานะเป็น "ดำเนินการแล้ว" เรียบร้อยแล้ว')
  } catch (err) {
    showToast(err.message, 'error')
    if (pdfInput.value) pdfInput.value.value = ''
  } finally {
    uploading.value = false
  }
}

// ─── ลบข้อมูลบันทึก ────────────────────────
async function cancelMemo() {
  if (!confirm('คุณแน่ใจใช่ไหมว่าต้องการ "ยกเลิกและลบ" ข้อมูลบันทึกข้อความรายการนี้ทิ้ง?')) return

  deleting.value = true
  try {
    const res = await fetch(`${BASE_URL}/memos/${memo.value.id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'ลบข้อมูลไม่สำเร็จ')
    }
    showToast('ลบข้อมูลบันทึกข้อความเรียบร้อยแล้ว')
    setTimeout(() => router.push('/memos'), 1500)
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    deleting.value = false
  }
}

// ─── ป้อนสิทธิ์และ Token ติดไปด้วย ─────────────────────
const goBack   = () => router.push('/memos')
const goToEdit = () => router.push(`/memos/${memo.value.id}/edit`)

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

onMounted(fetchMemo)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>