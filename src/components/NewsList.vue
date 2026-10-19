<script setup>
import { ref, onMounted } from 'vue'

const newsList = ref([])
const loading = ref(true)
const error = ref(null)

// 格式化日期函式：將 DATETIME 轉為 YYYY-MM-DD
const formatDate = (dateStr) => {
  if (!dateStr) return ''

  // 1. 若後端傳回標準 DATETIME 字串 (YYYY-MM-DD HH:mm:ss) 或 ISO 字串
  // 取前 10 個字元即可取得 YYYY-MM-DD，直觀且不會受時區轉換影響
  if (typeof dateStr === 'string' && dateStr.length >= 10) {
    // 檢查前 10 個字元是否符合 YYYY-MM-DD 格式
    const datePattern = /^\d{4}-\d{2}-\d{2}/
    if (datePattern.test(dateStr)) {
      return dateStr.substring(0, 10)
    }
  }

  // 2. 備用方案：使用原生 Date 物件轉化
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr // 若無法解析則返回原字串

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
// 透過 AJAX 抓取最新公告
const fetchNews = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 提示：正式開發建議搭配 Vite Proxy，將 URL 改為相對路徑 '/api/news'
    const response = await fetch('/newklms/api/news', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      throw new Error(`伺服器回應錯誤 (HTTP ${response.status})`)
    }

    const data = await response.json()
    // 根據 API 格式賦值（若 API 返回陣列直接賦值，若包含 data 欄位則取 data）
    newsList.value = Array.isArray(data) ? data : (data.data || [])
  } catch (err) {
    console.error('Fetch News Error:', err)
    error.value = '無法載入最新公告，請稍後再試。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNews()
})
</script>

<template>
  <a name="announce"></a>
  <div class="custom-card p-4 h-100">
    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <h5 class="fw-bold m-0 d-flex align-items-center gap-2">
        <a name="announce"></a>
        <span class="material-symbols-outlined fs-3" style="color: var(--brand-primary);">campaign</span>
        最新公告
      </h5>
      <small class="text-muted">各項簡章、報名相關通知及考場資訊將於此即時更新</small>
    </div>

    <!-- 1. 載入中狀態 -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="text-muted mt-2 fs-7">正在獲取最新公告...</p>
    </div>

    <!-- 2. 錯誤狀態 -->
    <div v-else-if="error" class="alert alert-warning my-3" role="alert">
      {{ error }}
      <button @click="fetchNews" class="btn btn-sm btn-outline-secondary ms-2">重新整理</button>
    </div>

    <!-- 3. 公告列表渲染 -->
    <div v-else class="list-group list-group-flush" id="main-news-list">
      <div 
        v-for="item in newsList" 
        :key="item.newid || item.subject"
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 px-0 border-0 border-bottom"
      >
        <div class="d-flex align-items-center gap-2">
          <span class="material-symbols-outlined text-success">news</span>
          <!-- 使用 router-link 進行無刷新頁面跳轉 -->
          <router-link :to="`/viewnews/${item.id || item.newid}`">
            <span class="text-dark text-truncate" style="max-width: 450px;">
              {{ item.title || item.subject }}
            </span>
          </router-link>
        </div>
        <small class="text-muted ms-2 text-nowrap">{{  formatDate(item.updated_at || item.created_at || item.date) }}</small>
      </div>

      <div v-if="newsList.length === 0" class="text-center text-muted py-4">
        目前尚無最新公告
      </div>
    </div>
  </div>
</template>