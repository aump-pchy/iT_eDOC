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
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    {
  path: '/admin/users',
  name: 'admin-users',
  component: () => import('../views/AdminUsersView.vue'),
},
  ],
})

// Route Guard — ยังไม่ login ไป /memos ไม่ได้
// router.beforeEach((to, _, next) => {
//   const auth = useAuthStore()
//   if (!to.meta.public && !auth.isLoggedIn) return next('/login')
//   if (to.name === 'login' && auth.isLoggedIn) return next('/memos')
//   next()
// })

export default router