import { defineStore } from 'pinia'
import { authApi, setUnauthorizedHandler, systemApi } from '../api'
import { showSuccess } from '../utils/swal'

const defaultSysParams = {
  schoolname: '基隆市立中正國中',
  actionyear: '115',
  sitename: '體育班甄試線上報名',
  dep: '學務處體育組',
  deptel: '(02)24282191 #20、#21',
  reward_type: ['單人', '雙人', '三人', '團體'],
  reward_category: ['國際性', '全國性', '全市性', '其他'],
  extra_test: ['私立二信中學入學測驗', '私立聖心中學入學測驗', '其他(請註明測驗學校)'],
  st_step: [{ '1': '初報名', '2': '已填資料', '3': '報名完成' }],
  user_type: [{ guest: '訪客', teacher: '教師', student: '學生', admin: '管理員' }],
  primary_class_type: ['舞蹈班', '音樂班', '民俗班', '美術班', '普通班'],
  notice_flag: '0',
  prospectus: 'https://etuser2.hopto.org/newklms/media/files/115/115doc.pdf',
  exam_skill: ['民俗體育'],
  register_skill_notice: '115學年度僅民俗體育甄試項目需線上報名。',
  unregister_message: '抱歉，目前非線上報名系統開放時間。',
  on_site_time: '115 年 3 月 9 日至 3 月 13 日，每日 10 時至 14 時止。',
  on_site_place: '本校正德樓三樓會議室。',
  slogan: '提供公平、公開、便利的數位化報名流程。請備齊個人資格資料與學籍資料後進行線上申辦。'
}

const defaultDateVars = {
  system_open: '2026-03-06 12:00:00',
  system_end: '2026-03-13 14:00:00',
  school_open: '2026-03-09 10:00:00',
  school_end: '2026-03-13 14:00:00',
  exam_date: '2026-03-21 00:00:00',
  score_open: '2026-04-07 08:59:00',
  score_end: '2026-04-30 23:59:00'
}

const parseJsonField = (value) => {
  if (typeof value !== 'string') return value

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export const useAppStore = defineStore('app', {
  state: () => ({
    auth: {
      isLoggedIn: false,
      user: null,
      isReady: false
    },
    sysParams: { ...defaultSysParams },
    dateVars: { ...defaultDateVars }
  }),
  actions: {
    setAuth(userData) {
      this.auth = userData
        ? { isLoggedIn: true, user: userData, isReady: true }
        : { isLoggedIn: false, user: null, isReady: true }
    },
    registerUnauthorizedHandler() {
      setUnauthorizedHandler(() => {
        if (this.auth.isLoggedIn) {
          this.setAuth(null)
          showSuccess('您的登入狀態已逾時，請重新登入！')
        }
      })
    },
    async checkAuth() {
      try {
        const data = await authApi.checkAuthMe()
        this.setAuth(data?.isLoggedIn ? data.user : null)
      } catch (err) {
        this.setAuth(null)
        if (err.status !== 401) {
          console.error('Check Auth Failed:', err)
        }
      }

      return this.auth
    },
    async fetchSystemParams() {
      try {
        const resData = await systemApi.getSystemParams()
        const data = resData.data || resData

        this.sysParams = {
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
      }
    },
    async fetchDateVars() {
      try {
        const resData = await systemApi.getDateVars()
        this.dateVars = resData.data || resData
      } catch (err) {
        console.error('Fetch DateVars Error:', err)
      }
    }
  }
})
