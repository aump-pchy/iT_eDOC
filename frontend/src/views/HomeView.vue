<template>
  <div class="min-h-screen flex flex-col items-center pt-14">

    <div class="w-full min-h-screen flex flex-col items-center px-6 pb-12"
         style="background: linear-gradient(170deg,
           #6d0d30 0%, #a0163f 22%, #d45080 42%,
           #f0c8d8 62%, #faf0f3 78%, #ffffff 100%);">

      <!-- Hero -->
      <div class="text-center pt-14 pb-8">
        <h1 class="text-4xl font-semibold text-white mb-2 tracking-tight">
          <span style="color: #f9d0e0;">iT</span>-e-Document
        </h1>
        <p class="text-sm font-light mb-1" style="color: rgba(255,255,255,0.75);">
          ระบบจัดการหนังสือราชการภายในออนไลน์
        </p>
        <p class="text-xs font-light" style="color: rgba(255,255,255,0.45);">
          แผนกวิชาเทคโนโลยีสารสนเทศ · วิทยาลัยเทคนิคเลย
        </p>
      </div>

      <div class="w-10 h-0.5 rounded-full mb-7" style="background: rgba(255,255,255,0.25);"></div>

      <!-- Dev badge -->
      <div class="text-xs font-light px-4 py-1.5 rounded-full mb-6"
           style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.9);">
        🚧 Dev Mode — เลือกหน้าที่ต้องการทดสอบ
      </div>

      <!-- Feature cards -->
      <div class="grid grid-cols-3 gap-2 w-full max-w-sm">
        <RouterLink v-for="page in pages" :key="page.to" :to="page.to"
          class="flex flex-col gap-1 p-4 rounded-xl cursor-pointer transition-all duration-150"
          :class="page.featured
            ? 'bg-white border border-[#a0163f]'
            : 'border border-white/60 hover:bg-white hover:border-[#a0163f]'"
          style="background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);">
          <span class="text-lg mb-1">{{ page.icon }}</span>
          <div class="text-[13px] font-medium"
               :style="page.featured ? 'color: #a0163f' : 'color: #16080e'">
            {{ page.label }}
          </div>
          <div class="text-[11px] font-light text-gray-400">{{ page.desc }}</div>
        </RouterLink>
      </div>

      <p class="text-[11px] font-light mt-8" style="color: #cbb0ba;">
        iT-e-Document v0.1 · ทีมพัฒนาแผนกวิชา IT
      </p>
    </div>
  </div>
</template>

<script setup>
const pages = [
  { to: '/login',        icon: '🔐', label: 'Login',        desc: 'เข้าสู่ระบบ',   featured: false },
  { to: '/memos',        icon: '📋', label: 'MemoList',     desc: 'รายการบันทึก', featured: false },
  { to: '/memos/new',    icon: '📝', label: 'MemoForm',     desc: 'สร้าง / แก้ไข', featured: false },
  { to: '/memos/1',      icon: '🔍', label: 'MemoDetail',   desc: 'รายละเอียด',   featured: false },
  { to: '/admin/users',  icon: '👥', label: 'Manage Users', desc: 'จัดการผู้ใช้',  featured: true  },
]
</script>