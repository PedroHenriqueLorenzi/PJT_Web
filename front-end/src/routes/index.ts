import { createRouter, createWebHistory } from 'vue-router'

import home from '../pages/home/index.vue'
import login from '../pages/login/index.vue'
import register from '../pages/register/index.vue'
import config from '../pages/config/index.vue'
import post from '../pages/post/index.vue'
import community from '../pages/community/index.vue'
import CreateCommunity from '../pages/community/create.vue'
import Users from '../pages/users/index.vue'


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
    {
        path: '/create-post',
        name: 'post',
        component: post,
        meta: { requiresAuth: true },
    },
    {
        path: '/communities',
        name: 'communities',
        component: community,
        meta: { requiresAuth: true },
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
        meta: { requiresAuth: true },
    },
    {
        path: '/create-community',
        name: 'CreateCommunity',
        component: CreateCommunity,
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
