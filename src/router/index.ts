import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
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
//guardian de rutas con el metodo beforeEach y usando el metodo validateToken de Services.ts
router.beforeEach(async (to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('accessToken')) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
