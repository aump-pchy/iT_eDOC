<template>
  <div class="min-h-screen bg-gray-50 py-8 px-6 md:pt-20">
    
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div class="flex items-center justify-between mb-8 border-b pb-4">
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          สร้างบันทึกข้อความใหม่
        </h1>
        <button 
          type="button"
          @click="router.push('/memos')"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors text-sm"
        >
          ย้อนกลับ
        </button>
      </div>

      <div class="p-6 md:p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <div class="flex flex-col md:flex-row md:items-start gap-2">
            <label class="w-full md:w-48 text-gray-800 font-semibold text-base md:pt-2.5">
              เลขที่ บันทึกข้อความ ทส.
            </label>
            <div class="flex-1 w-full">
              <div class="flex items-center gap-3">
                
                <span class="text-gray-800 font-bold text-base">ทส.</span>

                <input 
                  v-model="formData.memoSeq"
                  type="text" 
                  :class="[
                    'w-32 p-2.5 border border-gray-300 rounded-xl bg-white text-black font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm shadow-sm text-center',
                    errors.memoSeq ? 'border-red-500 focus:border-red-500' : ''
                  ]"
                  placeholder="เช่น 1"
                />
                
                <span class="text-gray-800 font-bold text-base shrink-0">
                  / {{ currentYearTh }}
                </span>

                <button 
                  type="button"
                  @click="handleCheckMemo"
                  :disabled="checking || loadingSeq"
                  class="shrink-0 p-2.5 px-5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm disabled:bg-gray-400"
                >
                  {{ checking ? 'กำลังเช็ก...' : 'ตรวจสอบ' }}
                </button>
              </div>

              <p v-if="errors.memoSeq" class="text-red-500 text-xs mt-1.5 font-medium">
                {{ errors.memoSeq }}
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
                  'w-full p-2.5 border border-gray-300 rounded-xl bg-white text-black font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm shadow-sm',
                  errors.subject ? 'border-red-500 focus:border-red-500' : ''
                ]"
                placeholder="กรอกชื่อเรื่องบันทึกข้อความ"
              />
              <p v-if="errors.subject" class="text-red-500 text-xs mt-1.5 font-medium">
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
                  'w-full p-2.5 border border-gray-300 rounded-xl bg-white text-black font-medium placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm shadow-sm',
                  errors.attendTo ? 'border-red-500 focus:border-red-500' : ''
                ]"
                placeholder="กรอกตำแหน่งหรือชื่อผู้รับ"
              />
              <p v-if="errors.attendTo" class="text-red-500 text-xs mt-1.5 font-medium">
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
                class="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium cursor-not-allowed text-sm shadow-sm"
              />
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-2 border-t">
            <button 
              type="button"
              @click="router.push('/memos')"
              class="px-6 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              :disabled="submitting || loadingSeq"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors text-sm disabled:bg-gray-400"
            >
              {{ submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
            </button>
          </div>
        </form>
      </div> 
    </div> 
  </div> 
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import api from '@/api' 

const memoStore = useMemoStore()
const authStore = useAuthStore()
const router = useRouter()

const checking = ref(false)
const submitting = ref(false)
const loadingSeq = ref(false)

// ดึงปี พ.ศ. ปัจจุบัน (ค.ศ. + 543)
const currentYearTh = computed(() => new Date().getFullYear() + 543)

// รีแอคทีฟฟอร์ม
const formData = reactive({
  memoSeq: '', 
  subject: '',
  attendTo: 'ผู้อำนวยการวิทยาลัยเทคนิคเลย', 
  operator: 'กำลังโหลดข้อมูลผู้ดำเนินการ...', // ข้อความเมื่อเริ่มโหลดหน้าจอ
  content: 'บันทึกข้อความภายในสถานศึกษา' 
})

const errors = reactive({
  memoSeq: '',
  subject: '',
  attendTo: ''
})

// 🔥 ฟังก์ชันดึงชื่อ-นามสกุลจริงจากตาราง profiles ดักจับข้อมูลทุกรูปแบบ
const fetchOperatorProfile = async (email) => {
  try {
    const response = await api.get('/profiles')
    
    // ดักจับข้อมูลเผื่อ API ส่งมาไม่เหมือนกัน (รองรับทั้ง array ตรงๆ หรือห่อใน .data หรือ .data.data)
    let profiles = []
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      profiles = response.data.data
    } else if (response.data && Array.isArray(response.data)) {
      profiles = response.data
    } else if (Array.isArray(response)) {
      profiles = response
    }

    // ทำการค้นหาแถวที่มีอีเมลตรงกัน (แปลงเป็นตัวพิมพ์เล็กเพื่อไม่ให้พลาดตอนเช็ก)
    const matchedUser = profiles.find(p => p.email?.toLowerCase() === email?.toLowerCase())
    
    if (matchedUser && matchedUser.full_name) {
      formData.operator = matchedUser.full_name // คืนค่าเป็นชื่อ นามสกุลจริงสำเร็จ 🎉
    } else {
      // เซฟตี้สเต็ปที่ 1: ถ้าหาไม่เจอใน profiles ให้ดึงชื่อจาก Store หรือ LocalStorage ที่บันทึกไว้ตอน Login
      const storeName = authStore.user?.full_name || 
                        authStore.user?.user_metadata?.full_name || 
                        JSON.parse(localStorage.getItem('user'))?.full_name
      formData.operator = storeName || email
    }
  } catch (error) {
    console.error('ดึงโปรไฟล์ผู้ดำเนินการล้มเหลว:', error)
    // เซฟตี้สเต็ปที่ 2: หาก API ฝั่ง profiles พัง ให้ถอยกลับมาใช้ชื่อจากระบบล็อกอินหลักทันที หน้าจอจะได้ไม่ค้างตัวหนังสือโหลด
    const storeName = authStore.user?.full_name || JSON.parse(localStorage.getItem('user'))?.full_name
    formData.operator = storeName || email
  }
}

// ค้นหาเลขที่เอกสารสูงสุดของปีปัจจุบันบนหน้าเว็บเพื่อ Auto รันลำดับถัดไป
const fetchNextMemoNumber = async () => {
  loadingSeq.value = true
  try {
    const response = await api.get('/memos')
    
    let memos = []
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      memos = response.data.data
    } else if (response.data && Array.isArray(response.data)) {
      memos = response.data
    }

    let maxSeq = 0
    const suffix = `/${currentYearTh.value}`

    memos.forEach(memo => {
      if (memo.memo_number && memo.memo_number.endsWith(suffix)) {
        const match = memo.memo_number.match(/ทส\.([0-9]+)\//)
        if (match && match[1]) {
          const seq = parseInt(match[1], 10)
          if (seq > maxSeq) maxSeq = seq
        }
      }ฟ
    })

    formData.memoSeq = (maxSeq + 1).toString()
  } catch (error) {
    console.error('ดึงลำดับเลขล้มเหลว:', error)
    formData.memoSeq = '1'
  } finally {
    loadingSeq.value = false
  }
}

// รันกระบวนการดึงข้อมูลเมื่อคอมโพเนนต์ถูกติดตั้ง
onMounted(async () => {
  // ดึงค่าอีเมลจากระบบล็อกอินหลัก (ตรวจเช็กแบบละเอียดทุกพาร์ท)
  const userStoreEmail = authStore.user?.email
  const userStorageEmail = JSON.parse(localStorage.getItem('user'))?.email
  const currentEmail = userStoreEmail || userStorageEmail || 'admin@loeitech.ac.th'

  // 1. วิ่งไป Map เอาชื่อ-นามสกุลจริงมาจากตาราง profiles
  await fetchOperatorProfile(currentEmail)

  // 2. รันเลขอัตโนมัติ ทส. ล่าสุด
  await fetchNextMemoNumber()
})

// ฟังก์ชันปุ่ม "ตรวจสอบ" ตรวจสอบฟอร์แมตเต็ม ทส.X/ปีพ.ศ. บน DB
const handleCheckMemo = async () => {
  if (!formData.memoSeq.trim()) {
    errors.memoSeq = 'กรุณาระบุเลขลำดับ'
    return
  }

  const fullMemoNumber = `ทส.${formData.memoSeq.trim()}/${currentYearTh.value}`

  checking.value = true
  try {
    errors.memoSeq = ''
    const response = await api.get('/memos')
    
    let memos = []
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      memos = response.data.data
    } else if (response.data && Array.isArray(response.data)) {
      memos = response.data
    }
    
    const isDuplicate = memos.some(m => m.memo_number === fullMemoNumber)

    if (isDuplicate) {
      errors.memoSeq = `❌ ${fullMemoNumber} ถูกใช้งานในระบบไปแล้ว!`
      alert(`⚠️ เลขบันทึกข้อความ ${fullMemoNumber} ซ้ำในระบบ! กรุณาเปลี่ยนตัวเลข`)
    } else {
      alert(`✅ ${fullMemoNumber} สามารถใช้งานได้!`)
    }
  } catch (error) {
    console.error(error)
    alert('⚠️ ไม่สามารถเชื่อมต่อฐานข้อมูลเพื่อตรวจสอบได้')
  } finally {
    checking.value = false
  }
}

// ตรวจสอบข้อมูลก่อนเซฟจริง
const validateForm = () => {
  let isValid = true
  errors.memoSeq = ''
  errors.subject = ''
  errors.attendTo = ''

  if (!formData.memoSeq.trim() || isNaN(formData.memoSeq.trim())) {
    errors.memoSeq = 'กรุณาระบุเลขลำดับเป็นตัวเลข'
    isValid = false
  }
  if (!formData.subject.trim()) {
    errors.subject = 'กรุณากรอกเรื่อง'
    isValid = false
  }
  if (!formData.attendTo.trim()) {
    errors.attendTo = 'กรุณากรอกตำแหน่งหรือชื่อผู้รับ'
    isValid = false
  }

  return isValid
}

// บันทึกข้อมูลเข้าสโตร์และฐานข้อมูล
const handleSubmit = async () => {
  if (!validateForm()) return

  const finalMemoNumber = `ทส.${formData.memoSeq.trim()}/${currentYearTh.value}`

  submitting.value = true
  try {
    const payload = {
      memo_number: finalMemoNumber,
      subject: formData.subject.trim(),
      recipient: formData.attendTo.trim(), 
      operator: formData.operator, 
      content: formData.content,
      status: 'draft' 
    }

    await memoStore.createMemo(payload)
    alert('🎉 บันทึกข้อมูลและจัดเก็บลงระบบเรียบร้อย!')
    router.push('/memos')

  } catch (error) {
    console.error(error)
    alert('⚠️ เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้')
  } finally {
    submitting.value = false
  }
}
</script>