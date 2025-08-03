import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Product from '../views/Product.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: Login,
    name: 'login',

  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    component: Product,
    name: 'Products',
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard untuk autentikasi
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Jika state user belum ada, coba fetch dulu
  if (authStore.user === null) {
    await authStore.fetchUser();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuthenticated) {
    // Jika rute butuh login tapi pengguna belum login, redirect ke halaman login
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated) {
    // Jika pengguna sudah login dan mencoba mengakses halaman login, redirect ke dashboard
    next({ name: 'dashboard' });
  } else {
    // Lanjutkan navigasi
    next();
  }
});

export default router
