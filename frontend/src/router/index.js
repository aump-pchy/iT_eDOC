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
      meta: { public: true }
    },
    {
      path: '/memos',
      name: 'memos',
      component: () => import('../views/MemoListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/memos/new',
      name: 'memo-new',
      component: () => import('../views/MemoFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/memo-detail/:id',
      name: 'memo-detail',
      component: () => import('../views/MemoDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/memos/:id/edit',
      name: 'memo-edit',
      component: () => import('../views/MemoFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/AdminUsersView.vue'),
      meta: { requiresAuth: true, adminOnly: true }
    },
    // ✨ เติมพาร์ทดักจับบั๊กไว้ตรงนี้ครับอ้าย! ถ้าหลุดไปหน้าไม่มีอยู่จริง (เช่น /memos/1) จะดีดกลับหน้าหลักทันที ไม่ปล่อยให้จอขาว
    {
      path: '/:pathMatch(.*)*',
      redirect: '/memos'
    }
  ],
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()

  // ยังไม่ได้ login แต่จะเข้าหน้าที่ต้อง login → เตะไป /login
  if (!to.meta.public && !auth.isLoggedIn) {
    return next('/login')
  }

  // login แล้วแต่พิมพ์ /login → ดันไป /memos
  if (to.name === 'login' && auth.isLoggedIn) {
    return next('/memos')
  }

  // หน้า admin เฉพาะ role admin เท่านั้น
  if (to.meta.adminOnly && !auth.isAdmin) {
    return next('/memos')
  }

  next()
})

export default router