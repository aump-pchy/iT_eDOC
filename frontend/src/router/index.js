import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true } // หน้าสาธารณะ ไม่ต้องล็อกอินก็เข้าได้
    },
    {
      path: '/memos',
      name: 'memos',
      component: () => import('../views/MemoListView.vue'),
    },
    {
      path: '/memos/new',
      name: 'memo-new',
      component: () => import('../views/MemoFormView.vue'),
    },
    {
      // 🛠️ แก้ไขตรงนี้ให้ตรงกับที่ปุ่มใน MemoListView.vue ของอ้ายกดส่งมา (เปลี่ยนจาก /memos/:id เป็น /memo-detail/:id)
      path: '/memo-detail/:id',
      name: 'memo-detail',
      component: () => import('../views/MemoDetailView.vue'),
    },
    {
      path: '/memos/:id/edit',
      name: 'memo-edit',
      component: () => import('../views/MemoFormView.vue'),
    },  
    { 
      path: '/', 
      name: 'home', 
      component: () => import('../views/HomeView.vue'),
      meta: { public: true } // เปิดให้หน้าแรกสุดเป็นสาธารณะด้วย เผื่อกรณีไม่ได้ล็อกอิน
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/AdminUsersView.vue'),
    },
  ],
})

// 👥 สเต็ปที่ 5: เปิดใช้งานด่านตรวจความปลอดภัย (Route Guard) แบบสมบูรณ์
router.beforeEach((to, _, next) => {
  // ต้องเรียกเรียกใช้งาน useAuthStore() ด้านในนี้เท่านั้น เพื่อป้องกันปัญหา Store โหลดไม่ทัน
  const auth = useAuthStore()
  
  // 1. ถ้าหน้าที่จะไปไม่ได้ใส่ meta: { public: true } และผู้ใช้ยังไม่ได้ล็อกอิน ให้เตะกลับไปหน้า Login
  if (!to.meta.public && !auth.isLoggedIn) {
    return next('/login')
  }
  
  // 2. ถ้าผู้ใช้ล็อกอินค้างไว้ในระบบอยู่แล้ว แต่อุตริพิมพ์ URL จะกลับมาหน้า login ให้ดันกลับไปหน้าทะเบียนหนังสือ (/memos)
  if (to.name === 'login' && auth.isLoggedIn) {
    return next('/memos')
  }
  
  next() // ปล่อยผ่านไปยังหน้าปลายทางได้ปกติ
})

export default router