import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      // ← ลบ public: true ออก เพราะต้อง login ก่อน
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
      path: '/memos/:id',
      name: 'memo-detail',
      component: () => import('../views/MemoDetailView.vue'),
    },
    {
      path: '/memos/:id/edit',
      name: 'memo-edit',
      component: () => import('../views/MemoFormView.vue'),
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/AdminUsersView.vue'),
      meta: { adminOnly: true }
    },
    {
    path: '/developers',
    name: 'developers',
    component: () => import('../views/DeveloperView.vue'),
    },
    // ✨ เติมพาร์ทดักจับบั๊กไว้ตรงนี้ครับอ้าย! ถ้าหลุดไปหน้าไม่มีอยู่จริง (เช่น /memos/1) จะดีดกลับหน้าหลักทันที ไม่ปล่อยให้จอขาว
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()

  if (!to.meta.public && !auth.isLoggedIn) return next('/login')
  if (to.name === 'login' && auth.isLoggedIn) return next('/')
  if (to.meta.adminOnly && !auth.isAdmin) return next('/memos')

  next()
})

export default router