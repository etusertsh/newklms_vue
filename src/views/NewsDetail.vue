<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { systemApi } from '../api'

const route = useRoute()
const router = useRouter()

const news = ref(null)
const loading = ref(true)
const error = ref(null)

// 讀取特定公告內容
const fetchNewsDetail = async () => {
  loading.value = true
  error.value = null
  const newsId = route.params.id

  try {
    const data = await systemApi.getNewsDetail(newsId)
    news.value = data?.data || data
  } catch (err) {
    console.error('Fetch ViewNews Error:', err)
    error.value = err.message || '無法載入該筆公告內容，請稍後再試。'
  } finally {
    loading.value = false
  }
}

// 返回按鈕邏輯
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ path: '/', hash: '#announce' })
  }
}

onMounted(() => {
  fetchNewsDetail()
})
</script>

<template>
  <section class="page-view active">
    <!-- 1. 載入中 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="text-muted mt-2 fs-7">正在讀取公告詳情...</p>
    </div>

    <!-- 2. 錯誤訊息 -->
    <div v-else-if="error" class="alert alert-warning my-4" role="alert">
      {{ error }}
      <button @click="goBack" class="btn btn-outline-secondary btn-sm ms-2">返回</button>
    </div>

    <!-- 3. 公告內容卡片 (對應 viewnews.html 結構) -->
    <div v-else-if="news" class="custom-card p-4">
      <div class="d-md-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h5 class="fw-bold m-0 d-flex align-items-center gap-2 text-success">
            <span class="material-symbols-outlined fs-1" style="color:var(--brand-primary)">article</span>
            {{ news.subject }}
          </h5>
        </div>
        <div class="mt-3 mt-md-0 d-flex gap-2 fs-6 text-muted">
          <span class="material-symbols-outlined" style="color:var(--brand-primary)">schedule</span>
          {{ news.updated_at || news.created_at }}
        </div>
      </div>

      <!-- 返回首頁公告區按鈕 -->
      <div class="mt-3 mt-md-0 d-flex gap-2 justify-content-end mb-3">
        <button @click="goBack" class="btn btn-outline-success d-flex align-items-center gap-1">
          <span class="material-symbols-outlined">undo</span> 返回
        </button>
      </div>

      <!-- 富文本內容渲染 (使用 v-html) -->
      <div style="min-height: 40vh" class="news-body fs-6 lh-base text-secondary" v-html="news.body"></div>
    </div>
  </section>
</template>