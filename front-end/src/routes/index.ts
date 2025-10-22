import { createRouter, createWebHistory } from 'vue-router'

import home from '../pages/home/index.vue'
import login from '../pages/login/index.vue'
import register from '../pages/register/index.vue'
import config from '../pages/config/index.vue'


const routes = [
    {
        path: '/',
        name: 'home',
        component: home,
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: login,
    },
    {
        path: '/register',
        name: 'register',
        component: register,
    },
    {
        path: '/config',
        name: 'config',
        component: config,
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth && !token) {
        return next('/login')
    }

    if (to.path === '/login' && token) {
        return next('/')
    }

    next()
})

export default router
