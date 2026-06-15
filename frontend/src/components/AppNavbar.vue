<template>
  <nav class="fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-6"
       style="background: #16080e;">

    <!-- Brand -->
    <RouterLink to="/" class="flex items-center gap-2.5">
      <div class="w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-0"
           style="background: #a0163f;">
        <span class="text-white text-[9px] font-semibold leading-none tracking-wide">iT</span>
        <span class="text-[9px] font-light leading-none tracking-wide" style="color: #f0b8cc;">e-DOC</span>
      </div>
      <div>
        <div class="text-white text-sm font-medium">iT-e-Document</div>
        <div class="text-[11px] font-light" style="color: rgba(255,255,255,0.35);">
          IT_LOEIETCH
        </div>
      </div>
    </RouterLink>

    <!-- Nav links -->
    <div class="hidden md:flex items-center gap-1">
      <RouterLink to="/memos"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] transition-all"
        :class="$route.path.startsWith('/memos')
          ? 'text-[#f0b8cc] bg-[rgba(160,22,63,0.3)]'
          : 'text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'">
        📋 บันทึกข้อความ
      </RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin/users"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] transition-all"
        :class="$route.path.startsWith('/admin')
          ? 'text-[#f0b8cc] bg-[rgba(160,22,63,0.3)]'
          : 'text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]'">
        👥 จัดการผู้ใช้
      </RouterLink>
      <RouterLink 
        to="/developers" 
        class="text-slate-600 hover:text-[#d4145a] px-3 py-2 rounded-md text-sm font-bold transition-colors"
      >
        คณะผู้พัฒนา ⚡
      </RouterLink>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-2.5">
      <RouterLink to="/memos/new" class="btn-primary text-[13px] py-1.5 px-3.5">
        + สร้างใหม่
      </RouterLink>

      <!-- Avatar + Dropdown -->
      <div class="relative" ref="dropdownRef">
        <div
          @click="showDropdown = !showDropdown"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer select-none"
          style="background: rgba(160,22,63,0.35); border: 1px solid rgba(160,22,63,0.55); color: #f0b8cc;">
          {{ initials }}
        </div>

        <!-- Dropdown Menu -->
        <div v-if="showDropdown"
          class="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-xl z-50"
          style="background: #1e0a12; border: 1px solid rgba(160,22,63,0.4);">

          <!-- User info -->
          <div class="px-4 py-3 border-b" style="border-color: rgba(160,22,63,0.3);">
            <p class="text-white text-xs font-medium truncate">{{ auth.user?.name || 'ผู้ใช้งาน' }}</p>
            <p class="text-[11px] truncate" style="color: rgba(255,255,255,0.4);">{{ auth.user?.email }}</p>
          </div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2.5 text-[13px] transition-colors hover:bg-[rgba(160,22,63,0.3)]"
            style="color: #f0b8cc;">
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth         = useAuthStore()
const router       = useRouter()
const showDropdown = ref(false)
const dropdownRef  = ref(null)

const initials = computed(() =>
  auth.user?.name?.slice(0, 1).toUpperCase() || 'U'
)

// ปิด dropdown เมื่อคลิกข้างนอก
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>