import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/zlecenia',
            component: () => import('../views/About.vue')
        },
        {
            path: '/klienci',
            component: () => import('../views/About.vue')
        },
        {
            path: '/about',
            component: () => import('../views/About.vue')
        }
    ]
})

export default router