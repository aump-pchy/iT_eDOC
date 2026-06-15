<template>
  <div class="min-h-screen pt-14" style="background: #fdf2f6;">
    <div class="max-w-2xl mx-auto px-4 py-8">

      <div class="mb-6">
        <h1 class="text-xl font-semibold" style="color: #16080e;">ภาพรวมระบบ</h1>
        <p class="text-xs font-light text-gray-400">
          แผนกวิชาเทคโนโลยีสารสนเทศ · วิทยาลัยเทคนิคเลย
        </p>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 text-center border" style="border-color: #a0163f;">
          <div class="text-3xl font-semibold" style="color: #a0163f;">
            {{ loading ? '...' : stats.total }}
          </div>
          <div class="text-xs font-light text-gray-400 mt-1">บันทึกทั้งหมด</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div class="text-3xl font-semibold text-yellow-600">
            {{ loading ? '...' : stats.pending }}
          </div>
          <div class="text-xs font-light text-gray-400 mt-1">รอดำเนินการ</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
          <div class="text-3xl font-semibold text-green-600">
            {{ loading ? '...' : stats.completed }}
          </div>
          <div class="text-xs font-light text-gray-400 mt-1">เสร็จสิ้น</div>
        </div>
      </div>

      <p class="text-xs font-semibold mb-3" style="color: #16080e;">🗂️ เมนูหลัก</p>
      <div class="grid grid-cols-2 gap-3 mb-6">
        <RouterLink v-for="item in menus" :key="item.to" :to="item.to"
          class="bg-white border border-gray-100 rounded-xl p-3.5 flex gap-3 items-center
                 hover:border-rose-400 transition-all duration-150"
          style="text-decoration: none;">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
               style="background: #fdf2f6;">
            {{ item.icon }}
          </div>
          <div>
            <div class="text-sm font-medium" style="color: #16080e;">{{ item.name }}</div>
            <div class="text-xs font-light text-gray-400">{{ item.desc }}</div>
          </div>
        </RouterLink>
      </div>

      <p class="text-xs font-semibold mb-3" style="color: #16080e;">🔄 ขั้นตอนการทำงานที่แนะนำ</p>
      <div class="flex flex-col">
        <div v-for="(step, i) in steps" :key="i" class="flex gap-3 items-start">

          <div class="flex flex-col items-center flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white z-10"
                 style="background: #a0163f;">
              {{ i + 1 }}
            </div>
            <div v-if="i < steps.length - 1"
                 class="w-0.5 flex-1 min-h-7" style="background: #e8d5dc;"></div>
          </div>

          <div class="bg-white border border-gray-100 rounded-xl p-3 flex-1 mb-2">
            <div class="text-sm font-medium" style="color: #16080e;">{{ step.title }}</div>
            <div class="text-xs font-light text-gray-400 mt-0.5 leading-relaxed">{{ step.desc }}</div>
            <div class="inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded-full border"
                 style="background: #fdf2f6; color: #a0163f; border-color: #f0c8d8;">
              {{ step.tag }}
            </div>
          </div>

        </div>
      </div>

      <p class="text-center text-xs font-light mt-6" style="color: #cbb0ba;">
        iT-e-Document v0.1 · ทีมพัฒนาแผนกวิชา IT
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const loading = ref(true)
const stats   = ref({ total: 0, pending: 0, completed: 0 })

const menus = [
  { to: '/memos',       icon: '📋', name: 'บันทึกข้อความ',  desc: 'รายการบันทึกทั้งหมด' },
  { to: '/memos/new',   icon: '➕', name: 'สร้างบันทึกใหม่', desc: 'เพิ่มบันทึกข้อความ' },
  { to: '/memos',       icon: '📸', name: 'อัพโหลดเอกสาร',  desc: 'ถ่ายรูป / บันทึก PDF' },
  { to: '/admin/users', icon: '👥', name: 'จัดการผู้ใช้',    desc: 'เฉพาะ Admin' },
]

const steps = [
  {
    title: 'ป้อนข้อมูลบันทึกข้อความ',
    desc:  'กรอกเรื่อง เรียน ผู้ดำเนินงาน เพื่อบันทึกเลขหนังสือ',
    tag:   '📋 สร้างบันทึกใหม่',
  },
  {
    title: 'จัดพิมพ์บันทึกข้อความ',
    desc:  'นำเลขหนังสือที่ได้ไปจัดพิมพ์เอกสารตามแบบฟอร์มราชการ',
    tag:   '🖨️ ดำเนินการภายนอกระบบ',
  },
  {
    title: 'เสนอบันทึกข้อความ',
    desc:  'นำเอกสารเสนอผู้บริหารพิจารณาและลงนาม',
    tag:   '✍️ ดำเนินการภายนอกระบบ',
  },
  {
    title: 'ถ่ายรูป / บันทึก PDF ลงระบบ',
    desc:  'เมื่อผู้บริหารเซ็นแล้ว ถ่ายรูปหรืออัพโหลด PDF เก็บไว้ในระบบ',
    tag:   '📸 อัพโหลดเอกสาร',
  },
]

onMounted(async () => {
  try {
    const { data } = await api.get('/memos')
    
    // แกะกล่องข้อมูล Array ของเอกสารทั้งหมดจากหลังบ้าน
    const all = Array.isArray(data) ? data : (data.data || [])
    
    stats.value = {
      total: all.length,
      
      // 🔥 อัปเดต: ดักจับสเตตัสเริ่มต้น 'draft' ตามที่ระบุไว้ในฐานข้อมูล Supabase เพื่อนำมาแสดงที่กลุ่มรอดำเนินการ
      pending: all.filter(m => 
        m.status === 'pending' || 
        m.status === 'draft' || 
        m.status === 'กำลังดำเนินการ' || 
        !m.status
      ).length,
      
      // ดักจับสเตตัสเอกสารที่ดำเนินการเสร็จสิ้นสมบูรณ์
      completed: all.filter(m => 
        m.status === 'completed' || 
        m.status === 'approved' || 
        m.status === 'เสร็จสิ้น' ||
        m.status === 'อนุมัติแล้ว'
      ).length,
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสถิติหน้าโฮม:', error)
  } finally {
    loading.value = false
  }
})
</script>