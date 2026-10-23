<script setup>
import { ref, computed, inject } from 'vue'
import { usePeriod } from '../composables/usePeriod'
import { scoreApi } from '../api'

// 1. 注入全域系統與日期參數
const sysParams = inject('sysParams', ref({}))
const dateVars = inject('dateVars', ref({}))
const { scoreStatus } = usePeriod(dateVars)
const siteName = sysParams.value?.sitename || '體育班甄試線上報名'

// 2. 表單狀態與驗證變數
const actionYear = computed(() => sysParams.value?.actionyear || '115')
const idnumber = ref('') // 准考證號碼 (6 位數字)
const uid = ref('')      // 身分證字號後 4 碼

const id1Type = ref('password') // 准考證號碼密碼顯示切換
const id2Type = ref('password') // 身分證後4碼密碼顯示切換

const loading = ref(false)
const errorMessage = ref('')
const isQueried = ref(false)   // 是否已成功查詢並顯示結果
const scoreData = ref(null)     // 儲存 API 回傳之成績資料
const printTime = ref('')       // 列印/查詢時間戳記

// 密碼可見度切換
const toggleVisibility = (field) => {
  if (field === 'id1') {
    id1Type.value = id1Type.value === 'password' ? 'text' : 'password'
  } else if (field === 'id2') {
    id2Type.value = id2Type.value === 'password' ? 'text' : 'password'
  }
}

// 重設表單
const resetForm = () => {
  idnumber.value = ''
  uid.value = ''
  errorMessage.value = ''
}

// 返回查詢頁面
const backToQuery = () => {
  isQueried.value = false
  scoreData.value = null
  errorMessage.value = ''
  resetForm()
}

// 發送成績查詢 API (對接 CI4 postToquery 邏輯)
const handleQuery = async () => {
  // 前端表單驗證
  if (!idnumber.value || !/^\d{6}$/.test(idnumber.value)) {
    errorMessage.value = '請輸入正確的 6 位數字准考證號碼！'
    return
  }
  if (!uid.value || !/^\d{4}$/.test(uid.value)) {
    errorMessage.value = '請輸入正確的身分證字號後 4 碼！'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await scoreApi.queryScore(actionYear.value, idnumber.value.trim(), uid.value.trim())

    if (result && (result.success || result.id > 0 || result.data)) {
      scoreData.value = result.data || result
      isQueried.value = true
      
      // 產生當前列印時間格式 (YYYY-MM-DD HH:mm:ss)
      const now = new Date()
      printTime.value = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0')
    } else {
      errorMessage.value = result?.message || '查無資料：輸入的資料缺失或有誤，無法查詢！'
    }
  } catch (err) {
    console.error('Score Query Error:', err)
    errorMessage.value = err.message || '連線伺服器失敗，請檢查網路連線或稍後再試！'
  } finally {
    loading.value = false
  }
}

// 觸發瀏覽器列印
const triggerPrint = () => {
  window.print()
}
</script>

<template>
  <section id="page-score" class="page-view active">

    <!-- ===================================================
         情境 1：成績查詢尚未開放 (UPCOMING)
         =================================================== -->
    <div v-if="scoreStatus === 'UPCOMING'" class="d-flex align-items-center justify-content-center p-3">
      <div class="card query-card shadow-lg w-100 bg-white" style="max-width: 480px; border-radius: 1rem;">
        <div class="card-header bg-light text-dark text-center p-4 rounded-top-3 border-0">
          <h5 class="mb-1">{{ actionYear }}學年度{{ siteName }}</h5>
          <h5 class="fw-semibold mb-1">甄試成績與錄取結果查詢</h5>
        </div>
        <div class="card-body p-4 p-md-5">
          <div class="text-center py-4">
            <div class="fs-1 mb-3">⏳</div>
            <h5 class="fw-bold text-dark mb-3">查詢功能尚未開放</h5>
            <div class="alert alert-warning border-warning-subtle text-start mb-0 fs-6" role="alert">
              📌 <strong>開放查詢時間：</strong><br>
              本年度甄試成績預計於 <strong class="text-danger">{{ dateVars.score_open || '2026-04-07 08:00' }}</strong> 正式開放查詢，屆時請再回本頁面進行檢索。
            </div>
          </div>
        </div>
        <div class="card-footer bg-light text-center py-3 rounded-bottom-3 border-0">
          <small class="text-muted">若您遺忘准考證號碼，請聯繫甄試承辦單位協助。</small>
        </div>
      </div>
    </div>

    <!-- ===================================================
         情境 2：開放查詢中，但尚未查詢 (顯示查詢表單)
         =================================================== -->
    <div v-else-if="!isQueried" class="d-flex align-items-center justify-content-center p-3">
      <div class="card query-card shadow-lg w-100 bg-white" style="max-width: 480px; border-radius: 1rem;">
        <div class="card-header bg-light text-dark text-center p-4 rounded-top-3 border-0">
          <h5 class="mb-1">{{ actionYear }}學年度{{ siteName }}</h5>
          <h5 class="fw-semibold mb-1">甄試成績與錄取結果查詢</h5>
        </div>

        <div class="card-body p-4 p-md-5">
          <p class="mb-3 text-primary fw-medium">請輸入您的准考證號碼與驗證資料</p>

          <!-- 錯誤訊息提示區塊 -->
          <div v-if="errorMessage" class="alert alert-danger py-2 fs-7 mb-3" role="alert">
            {{ errorMessage }}
          </div>

          <!-- 查詢表單 -->
          <form @submit.prevent="handleQuery" novalidate>
            <!-- 准考證號碼 -->
            <div class="mb-4">
              <label for="id1" class="form-label fw-semibold">准考證號碼 (6位數字) <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text bg-light text-muted">🎫</span>
                <input 
                  :type="id1Type" 
                  id="id1" 
                  v-model.trim="idnumber"
                  class="form-control text-center fs-5 tracking-wider" 
                  maxlength="6" 
                  required 
                  pattern="[0-9]{6}" 
                  inputmode="numeric" 
                  placeholder="請輸入 6 位號碼" 
                  autocomplete="off"
                >
                <button class="btn btn-outline-secondary" type="button" @click="toggleVisibility('id1')">
                  {{ id1Type === 'password' ? '👁️' : '🙈' }}
                </button>
              </div>
              <div class="form-text fs-8 text-muted">包含 6 位阿拉伯數字</div>
            </div>

            <!-- 身分證號碼後 4 碼 -->
            <div class="mb-4">
              <label for="id2" class="form-label fw-semibold">身分證字號後 4 碼 <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text bg-light text-muted">🪪</span>
                <input 
                  :type="id2Type" 
                  id="id2" 
                  v-model.trim="uid"
                  class="form-control text-center fs-5 tracking-wider" 
                  maxlength="4" 
                  required 
                  pattern="[0-9]{4}" 
                  inputmode="numeric" 
                  placeholder="請輸入 4 位數字" 
                  autocomplete="off"
                >
                <button class="btn btn-outline-secondary" type="button" @click="toggleVisibility('id2')">
                  {{ id2Type === 'password' ? '👁️' : '🙈' }}
                </button>
              </div>
              <div class="form-text fs-8 text-muted">學生本人身分證或居留證號後 4 碼</div>
            </div>

            <!-- 操作按鈕 -->
            <div class="d-grid gap-2 pt-2">
              <button type="submit" class="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center gap-2" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                <span>{{ loading ? '查詢中...' : '送出查詢' }}</span>
              </button>
              <button type="button" class="btn btn-light text-muted btn-sm" @click="resetForm">清除重填</button>
            </div>
          </form>
        </div>

        <div class="card-footer bg-light text-center py-3 rounded-bottom-3 border-0">
          <small class="text-muted">若您遺忘准考證號碼，請聯繫甄試承辦單位協助。</small>
        </div>
      </div>
    </div>

    <!-- ===================================================
         情境 3：查詢成功 (顯示成績結果與列印視圖)
         =================================================== -->
    <div v-else class="result-container mx-auto" style="max-width: 850px;">
      
      <!-- 頂部操作按鈕列 (列印時會被隱藏) -->
      <div class="d-flex justify-content-between align-items-center mb-4 no-print">
        <button @click="backToQuery" class="btn btn-outline-secondary d-flex align-items-center gap-1">
          ← 返回查詢頁面
        </button>
        <button @click="triggerPrint" class="btn btn-primary px-4 fw-bold d-flex align-items-center gap-1">
          🖨️ 列印成績單
        </button>
      </div>

      <!-- 成績單主體卡片 -->
      <div class="card shadow-sm border-0 bg-white p-4 p-md-5">
        
        <!-- 主標題與時間戳記 -->
        <div class="text-center mb-4 border-bottom pb-3">
          <h3 class="fw-bold mb-1">{{ actionYear }}學年度體育班甄試成績與錄取結果</h3>
          <p class="text-muted small mb-0">列印時間：{{ printTime }}</p>
        </div>

        <!-- 考生基本資料卡片 -->
        <div class="profile-card p-3 p-md-4 mb-4">
          <h6 class="fw-bold text-primary mb-3 border-bottom pb-2">
            👤 考生基本資料
          </h6>
          <div class="row g-3 align-items-center">
            <div class="col-4">
              <div class="text-muted small mb-1">學生姓名</div>
              <div class="fs-5 fw-bold text-dark">
                {{ scoreData?.stname || scoreData?.name || scoreData?.student_name || '—' }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-muted small mb-1">准考證號碼</div>
              <div class="fs-5 fw-bold text-primary font-monospace">
                {{ scoreData?.idnumber || scoreData?.stdid || idnumber }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-muted small mb-1">甄試類別</div>
              <div class="fs-5 fw-bold text-dark">
                {{ scoreData?.itemname || scoreData?.exam_type || scoreData?.sport_type || '未提供' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 錄取結果大 Banner -->
        <div v-if="scoreData?.remarks=='錄取'" class="result-banner p-4 mb-4 text-center border rounded-3 bg-success-subtle text-success-emphasis border-success-subtle">
          <div class="fs-6 fw-semibold text-uppercase tracking-wider mb-1">甄試結果 (Admission Status)</div>
          <div class="display-5 fw-bold my-2">
            {{ scoreData?.remarks }}
          </div>
        </div>
        <div v-else-if="scoreData?.remarks=='備取'" class="result-banner p-4 mb-4 text-center border rounded-3 bg-warning-subtle text-warning-emphasis border-warning-subtle">
          <div class="fs-6 fw-semibold text-uppercase tracking-wider mb-1">甄試結果 (Admission Status)</div>
          <div class="display-5 fw-bold my-2">
            {{ scoreData?.remarks }}
          </div>
        </div>
        <div v-else-if="scoreData?.remarks=='不錄取'" class="result-banner p-4 mb-4 text-center border rounded-3 bg-danger-subtle text-danger-emphasis border-danger-subtle">
          <div class="fs-6 fw-semibold text-uppercase tracking-wider mb-1">甄試結果 (Admission Status)</div>
          <div class="display-5 fw-bold my-2">
            {{ scoreData?.remarks }}
          </div>
        </div>
        <div v-else class="result-banner p-4 mb-4 text-center border rounded-3 bg-light text-dark">
          <div class="fs-6 fw-semibold text-uppercase tracking-wider mb-1">甄試結果 (Admission Status)</div>
          <div class="display-5 fw-bold my-2">
            無資料
          </div>
        </div>

        <!-- 成績明細表格 -->
        <h6 class="fw-bold text-primary mb-3">📊 成績明細表格</h6>
        <div class="table-responsive mb-4">
          <table class="table table-bordered align-middle text-center mb-0">
            <thead class="table-light">
              <tr>
                <th rowspan="2" class="align-middle bg-light" style="width: 15%;">項目</th>
                <th class="bg-light">體能測驗</th>
                <th colspan="3" class="bg-light">實作評量</th>
                <th rowspan="2" class="align-middle bg-primary text-white" style="width: 20%;">總分</th>
              </tr>
              <tr>
                <th>得分</th>
                <th>原始分數</th>
                <th>標準分數</th>
                <th>加權分數</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="table-light">分數</th>
                <td>{{ scoreData?.score2_o || scoreData?.fitness_score || '0.00' }}</td>
                <td>{{ scoreData?.score3_o || scoreData?.practical_raw || '0.00' }}</td>
                <td>{{ scoreData?.score3_s || scoreData?.practical_std || '0.00' }}</td>
                <td>{{ scoreData?.score4_o || scoreData?.practical_weighted || '0.00' }}</td>
                <td class="fs-4 fw-bold text-primary">
                  {{ scoreData?.score5 || scoreData?.score_total || '0.00' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 注意事項說明 -->
        <div class="bg-light p-3 rounded-3 text-muted small">
          <div class="fw-bold mb-1 text-dark">注意事項：</div>
          <ol class="mb-0 ps-3">
            <li>本成績單僅供參考，正式錄取名單以本校官網公告之正式榜單為準。</li>
            <li>成績若標示「缺考」，該科項不予計算分數。</li>
            <li>若對成績有疑慮，請於公告複查期限內依規定申請成績複查。</li>
          </ol>
        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
.tracking-wider {
  letter-spacing: 0.05em;
}

/* 考生資訊卡片基本樣式 */
.profile-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
}

/* ===================================================
   列印專用媒體查詢 (@media print)
   =================================================== */
@media print {
  /* 隱藏不需要列印的元素 (導覽列、頁尾、按鈕) */
  .no-print,
  header,
  footer,
  .navbar {
    display: none !important;
  }

  body, main {
    background-color: #fff !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .result-container {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .card {
    border: 1px solid #000 !important;
    box-shadow: none !important;
  }

  .profile-card {
    background-color: #fff !important;
    border: 1px solid #000 !important;
  }

  /* 【關鍵修正】強制考生基本資料在列印時保持橫向 3 欄併排 */
  .profile-card .row {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
  }

  .profile-card .row > [class*="col-"] {
    flex: 0 0 33.333333% !important;
    max-width: 33.333333% !important;
    width: 33.333333% !important;
    float: left !important;
  }

  .table-bordered th,
  .table-bordered td {
    border: 1px solid #000 !important;
    font-size: 14px;
  }

  @page {
    size: A4 portrait;
    margin: 10mm;
  }
}
</style>