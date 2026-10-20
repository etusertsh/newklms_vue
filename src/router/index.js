import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsDetail from '../views/NewsDetail.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import ScoreView from '../views/ScoreView.vue'

const routes = [
    {
        path: '/',
        alias: ['/index.html'],
        name: 'Home',
        component: HomeView
    },
    {
        path: '/viewnews/:id',
        name: 'NewsDetail',
        component: NewsDetail
    },
    {
        path: '/about', // 👈 新增關於頁面路由
        name: 'About',
        component: AboutView
    },
    {
        path: '/auth', // 👈 新增管理登入路由
        name: 'Login',
        component: LoginView
    },
    {
        path: '/score',
        name: 'Score',
        component: ScoreView
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    // ⚠️ 關鍵設定：會自動讀取 vite.config.js 設定的 base ('/vue/')
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // 處理滾動行為：當切換路由或點擊 #announce 時平滑滾動
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }
        }
        return { top: 0 }
    }
})

export default router