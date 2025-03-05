import { setupLayouts } from 'virtual:generated-layouts'
import type { App } from 'vue'

import type { RouteRecordRaw } from 'vue-router/auto'

import { createRouter, createWebHistory } from 'vue-router/auto'
import { useAuthStore } from '@/@core/stores/auth'

// const routes: RouteRecordRaw[] = [
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import('@/pages/login.vue'),
//     meta: { layout: 'blank', public: true }
//   },
//   {
//     path: '/register',
//     name: 'register',
//     component: () => import('@/pages/register.vue'),
//     meta: { layout: 'blank', public: true }
//   }
// ]

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])

    return route
  }

  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }

    return { top: 0 }
  },
  extendRoutes: pages => [
    // ...routes.map(route => recursiveLayouts(route)),
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated()

  console.log("TOKEN VALUE", authStore.tokenValue());

  // console.log("authStore", authStore.tokenValue);
  

  // Check if route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } }) // Redirect to login with return URL
  } 
  // Prevent logged-in users from accessing login/register
  else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'dashboard' }) // Redirect authenticated users to dashboard
  } 
  else {
    next() // Proceed normally
  }
})

export { router }

export default function (app: App) {
  app.use(router)
}
