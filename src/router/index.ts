import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path:'/ordenes',
      name: 'ordenes',
      component: () => import('../views/OrdenesView.vue')
    },
    {
      path:'/productos',
      name: 'productos',
      component: () => import('../views/ProductosView.vue')
    },
    {
      path:'/reportes',
      name: 'reportes',
      component: () => import('../views/ReporteView.vue')
    }
  ]
})

export default router
