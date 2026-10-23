<script setup>
import {ref, onMounted, onUnmounted, provide } from 'vue'
import Navbar from './components/Navbar.vue'
import FooterBar from './components/FooterBar.vue'
import { authApi, systemApi, setUnauthorizedHandler } from './api'

// 1. 定義系統參數響應式物件（帶有預設值，避免載入前畫面空白）
const sysParams = ref({
  schoolname: '基隆市立中正國中',
  actionyear: '115',
  sitename: '體育班甄試線上報名',
  dep: '學務處體育組',
  deptel: '(02)24282191 #20、#21',
  reward_type: ['單人', '雙人', '三人', '團體'],
  reward_category: ['國際性', '全國性', '全市性', '其他'],
  extra_test: ['私立二信中學入學測驗', '私立聖心中學入學測驗', '其他(請註明測驗學校)'],
  st_step: [{ '1': '初報名', '2': '已填資料', '3': '報名完成' }],
  user_type: [{ 'guest': '訪客', 'teacher': '教師', 'student': '學生', 'admin': '管理員' }],
  primary_class_type: ['舞蹈班', '音樂班', '民俗班', '美術班', '普通班'],
  notice_flag: '0',
  prospectus: 'https://etuser2.hopto.org/newklms/media/files/115/115doc.pdf',
  exam_skill: ['民俗體育'],
  register_skill_notice: '115學年度僅民俗體育甄試項目需線上報名。',
  unregister_message: '抱歉，目前非線上報名系統開放時間。',
  on_site_time: '115 年 3 月 9 日至 3 月 13 日，每日 10 時至 14 時止。',
  on_site_place: '本校正德樓三樓會議室。',
  slogan: '提供公平、公開、便利的數位化報名流程。請備齊個人資格資料與學籍資料後進行線上申辦。'
})

const authState = ref({
  isLoggedIn: false,
  user: null,
  isReady: false
})

const setAuth = (userData) => {
  if (userData) {
    authState.value = {
      isLoggedIn: true,
      user: userData,
      isReady: true
    }
  } else {
    authState.value = {
      isLoggedIn: false,
      user: null,
      isReady: true
    }
  }
}

// 註冊全域 401 逾時攔截
setUnauthorizedHandler(() => {
  if (authState.value.isLoggedIn) {
    setAuth(null)
    alert('您的登入狀態已逾時，請重新登入！')
  }
})

// 1. 檢查 Auth 狀態 API
const checkAuth = async () => {
  try {
    const data = await authApi.checkAuthMe()
    if (data?.isLoggedIn) {
      setAuth(data.user)
    } else {
      setAuth(null)
    }
    return authState.value
  } catch (err) {
    setAuth(null)
    if (err.status !== 401) {
      console.error('Check Auth Failed:', err)
    }
    return authState.value
  }
}

// 2. 統一的 API Fetch 工具（自動處理 401 攔截）
const apiFetch = async (url, options = {}) => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers
  }
  
  const response = await fetch(url, { ...options, headers })

  // 若發送操作時發現 Session 已過期
  if (response.status === 401) {
    if (authState.value.isLoggedIn) {
      setAuth(null)
      alert('您的登入狀態已逾時，請重新登入！')
    }
  }

  return response
}

// 3. 頁面切換/聚焦時自動檢核 (VisibilityChange)
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    checkAuth() // 切換回頁面時主動檢查一次
  }
}
provide('auth', authState)
provide('setAuth', setAuth)
provide('checkAuth', checkAuth)
provide('apiFetch', apiFetch)

const loadingParams = ref(true)

// 安全解析 JSON 字串 Helper
const parseJsonField = (val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch (e) {
      return val
    }
  }
  return val
}

// 2. 向 API 讀取系統參數
const fetchSystemParams = async () => {
  try {
    const resData = await systemApi.getSystemParams()
    const data = resData.data || resData // 容錯處理 API 格式

    // 格式化解析字串化的 JSON 陣列與物件
    sysParams.value = {
      ...data,
      reward_type: parseJsonField(data.reward_type),
      reward_category: parseJsonField(data.reward_category),
      extra_test: parseJsonField(data.extra_test),
      st_step: parseJsonField(data.st_step),
      user_type: parseJsonField(data.user_type),
      primary_class_type: parseJsonField(data.primary_class_type),
      exam_skill: parseJsonField(data.exam_skill)
    }
  } catch (err) {
    console.error('Fetch System Params Error:', err)
  } finally {
    loadingParams.value = false
  }
}

// 3. 使用 provide 將系統參數全域提供給所有子元件
provide('sysParams', sysParams)

// 1. 定義日期參數物件（設定預設值以防止 API 載入前畫面空白）
const dateVars = ref({
  system_open: '2026-03-06 12:00:00',
  system_end: '2026-03-13 14:00:00',
  school_open: '2026-03-09 10:00:00',
  school_end: '2026-03-13 14:00:00',
  exam_date: '2026-03-21 00:00:00',
  score_open: '2026-04-07 08:59:00',
  score_end: '2026-04-30 23:59:00'
})
let pollInterval = null

// 2. 讀取日期設定 API
const fetchDateVars = async () => {
  try {
    const resData = await systemApi.getDateVars()
    dateVars.value = resData.data || resData
  } catch (err) {
    console.error('Fetch DateVars Error:', err)
  }
}

// 3. 廣播 dateVars 提供給 HeroBanner 與 Schedule 使用
provide('dateVars', dateVars)
provide('fetchDateVars', fetchDateVars)
provide('fetchDataVars', fetchDateVars)

let heartBeatInterval = null

onMounted(() => {
  checkAuth()
  fetchSystemParams()
  fetchDateVars()
  pollInterval = setInterval(() => {
    fetchDateVars()
  }, 1 * 60 * 1000)

  // 事件監聽：切換 Tab 時同步檢核
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 低頻率探針：每 10 分鐘檢查一次 Session 是否仍有效
  heartBeatInterval = setInterval(() => {
    checkAuth()
  }, 30 * 60 * 1000)
})

onUnmounted(() =>{
  if(pollInterval) clearInterval(pollInterval)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (heartBeatInterval) clearInterval(heartBeatInterval)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar 
      :school-name="sysParams.schoolname" 
      :site-name="sysParams.sitename" 
    />

    <!-- 主區域：根據當前網址切換顯示 HomeView 或 NewsDetail -->
    <main class="container my-4 flex-grow-1">
      <router-view />
    </main>

    <FooterBar 
      :school-name="sysParams.schoolname" 
      :site-name="sysParams.sitename"
      :dep="sysParams.dep"
      :deptel="sysParams.deptel"
    />
  </div>
</template>