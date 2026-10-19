<script setup>
import {ref, onMounted, provide } from 'vue'
import Navbar from './components/Navbar.vue'
import FooterBar from './components/FooterBar.vue'

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
  user: null
})

const setAuth = (userData) => {
  if(userData) {
    authState.value = {
      isLoggedIn: true,
      user: userData
    }
  }else{
    authState.value = {
      isLoggedIn: false,
      user: null
    }
  }
}

const checkAuth = async() => {
  try {
    const res = await fetch('/newklms/api/auth/me', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    if (res.ok) {
      const data = await res.json()
      if (data.isLoggedIn) {
        setAuth(data.user)
      }
    }
  } catch (err) {
    console.error('Check Auth Failed:', err)
  }
}
provide('auth', authState)
provide('setAuth', setAuth)

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
    // 提示：開發階段若有跨域，可透過 Vite Proxy 轉發至 /api/param
    const response = await fetch('/newklms/api/param', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) throw new Error('無法取得系統參數 API')

    const resData = await response.json()
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

// 2. 讀取日期設定 API
const fetchDateVars = async () => {
  try {
    const response = await fetch('/newklms/api/datevars', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    if (!response.ok) throw new Error('無法讀取日期設定 API')
    
    const resData = await response.json()
    dateVars.value = resData.data || resData
  } catch (err) {
    console.error('Fetch DateVars Error:', err)
  }
}

// 3. 廣播 dateVars 提供給 HeroBanner 與 Schedule 使用
provide('dateVars', dateVars)

onMounted(() => {
  checkAuth()
  fetchSystemParams()
  fetchDateVars()
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