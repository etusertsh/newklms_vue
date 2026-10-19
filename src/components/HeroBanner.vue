<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'

defineProps({
  actionYear: String,
  schoolName: String,
  siteName: String,
  siteSlogan: String
})

// 取得全域日期參數
const dateVars = inject('dateVars', ref({}))

const now = ref(new Date())
let timer = null

onMounted(() => {
  // 每秒更新當前時間
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 動態計算倒數資訊 (根據 system_end)
const countdownInfo = computed(() => {
  const endStr = dateVars.value?.system_end
  if (!endStr) return { days: 0, text: '計算中...', isExpired: false }

  // 相容跨瀏覽器 ISO 格式 (將空白替換為 T)
  const targetDate = new Date(endStr.replace(' ', 'T'))
  const diffMs = targetDate - now.value

  if (diffMs <= 0) {
    return { days: 0, text: '已截止', isExpired: true }
  }

  // 計算剩餘天數
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return { days, text: `${days} 天`, isExpired: false }
})

// 格式化截止時間顯示 (例如: 2026-03-13 14:00)
const formattedEndTime = computed(() => {
  const endStr = dateVars.value?.system_end
  if (!endStr) return ''
  return endStr.substring(0, 16)
})
</script>
<template>
  <div class="hero-banner mb-4">
    <div class="row align-items-center">
      <div class="col-lg-8">
        <span class="badge bg-white text-dark mb-2 px-3 py-2 fw-semibold rounded-pill">115學年度體育班甄試線上報名</span>
        <h1 class="fw-bold display-6 mb-3">歡迎進入{{ actionYear }}學年度{{ schoolName }}{{  siteName }}</h1>
        <p class="lead opacity-90 fs-6 mb-4">
          {{ siteSlogan }}
        </p>
        <div class="d-flex flex-wrap gap-3">
          <a href="https://etuser2.hopto.org/newklms/register" class="btn btn-light fw-bold px-4 py-2 text-teal shadow-sm d-flex align-items-center gap-1">
            <span class="material-symbols-outlined">arrow_forward</span> 立即開始報名
          </a>
          <a href="https://etuser2.hopto.org/newklms/member/auth" class="btn btn-outline-light px-4 py-2 fw-semibold d-flex align-items-center gap-1">
            <span class="material-symbols-outlined">find_in_page</span> 查詢報名與報名表
          </a>
        </div>
      </div>
      <div class="col-lg-4 d-none d-lg-block text-center">
        <div class="p-3 bg-white bg-opacity-10 rounded-4 backdrop-blur border border-white border-opacity-25">
          <div class="fs-7 text-uppercase fw-bold text-white-75">距離報名截止剩餘</div>
          <div v-if="!countdownInfo.isExpired" class="display-5 fw-bold my-2 text-white-50">
            {{ countdownInfo.days }} 天
          </div>
          <div v-else class="display-6 fw-bold my-2 text-warning">
            {{ countdownInfo.text }}
          </div>
          <div class="text-white-75 fs-7">截止時間：{{ formattedEndTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>