import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/tasks',
            component: () => import('../views/About.vue')
        },
        {
            path: '/history',
            component: () => import('../views/History.vue')
        },
        {
            path: '/charts',
            component: () => import('../views/Charts.vue')
        },
        {
            path: '/settings',
            component: () => import('../views/Settings.vue')
        }
    ]
})

export default router