import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewsDetail from '../views/NewsDetail.vue'
import LoginView from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import ScoreView from '../views/ScoreView.vue'
import RegisterView from '../views/RegisterView.vue'
import MemberloginView from '../views/MemberloginView.vue'
import MemberareaView from '../views/MemberareaView.vue'

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
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/memberlogin',
        name: 'MemberLogin',
        alias: ['/member/auth'],
        component: MemberloginView
    },
    {
        path: '/memberarea/:memberid',
        alias: ['/member/data/:memberid'],
        name: 'Memberarea',
        component: MemberareaView
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // 處理滾動行為：包含錨點平滑滾動、頁面切換置頂與上一頁位置還原
    scrollBehavior(to, from, savedPosition) {
        // 1. 如果是按上一頁/下一頁，保留原瀏覽位置
        if (savedPosition) {
            return savedPosition
        }
        // 2. 如果帶有 Hash 錨點 (例如 #announce)
        if (to.hash) {
            return new Promise((resolve) => {
                // 延遲 300ms 等待首頁 API 資料載入與 DOM 渲染完成
                setTimeout(() => {
                    resolve({
                        el: to.hash,
                        behavior: 'smooth',
                        top: 70 // 扣除上方 sticky navbar 的高度，避免標題被遮擋
                    })
                }, 300)
            })
        }
        // 3. 一般頁面切換，預設滾動至最上方
        return { top: 0 }
    }
})

export default router