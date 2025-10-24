import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth to initialize
  if (isLoading.value) {
    // Wait for loading to complete
    const checkAuth = () => {
      if (!isLoading.value) {
        proceedWithNavigation()
      } else {
        setTimeout(checkAuth, 50)
      }
    }
    checkAuth()
    return
  }

  proceedWithNavigation()

  function proceedWithNavigation() {
    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Check if route is guest only (login/signup) and user is already authenticated
    if (to.meta.guestOnly && isAuthenticated.value) {
      next({ name: 'dashboard' })
      return
    }

    next()
  }
})

export default router
