import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { 
    path: '/', 
    component: Login,
    name: 'Login',
        
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    name: 'Dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard untuk autentikasi
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.name !== 'Login') {
    next({ name: 'Login' })
    return
  }
  
  if (token && to.name === 'Login') {
    next({ name: 'Dashboard' })
    return
  }

  console.log("token ", token)
  next()
  
})

export default router
