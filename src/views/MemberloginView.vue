<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { usePeriod } from '../composables/usePeriod'
import { authApi } from '../api'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { setAuth, checkAuth } = appStore

const { sysParams, dateVars } = storeToRefs(appStore)

// 2. 引入 usePeriod 判斷報名開放狀態 (system_open ~ system_end)
const { registerStatus } = usePeriod()

const actionYear = computed(() => sysParams.value?.actionyear || '115')

// 表單雙向綁定變數
const stname = ref('')
const stdid = ref('')

const loading = ref(false)
const errorMessage = ref('')

// 身分證字號自動轉大寫
const handleStdidInput = (e) => {
  stdid.value = e.target.value.toUpperCase()
}

// 考生登入處理
const handleMemberLogin = async () => {
  const name = stname.value.trim()
  const id = stdid.value.trim().toUpperCase()

  // 1. 前端嚴格驗證
  if (!name) {
    errorMessage.value = '請輸入學生姓名！'
    return
  }

  if (!id) {
    errorMessage.value = '請輸入身分證字號或居留證號！'
    return
  }

  // 台灣身分證 / 新舊版居留證格式正規表示式
  const idRegex = /^[A-Za-z][1289A-Da-d]\d{8}$/
  if (!idRegex.test(id)) {
    errorMessage.value = '身分證字號或居留證號格式不正確，例如：A123456789'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authApi.memberLogin(actionYear.value, name, id)

    if (result && result.success) {
      if (typeof setAuth === 'function') {
        setAuth({
          memberid: result.memberid,
          realname: name,
          usertype: 'student'
        })
      }
      if (typeof checkAuth === 'function') {
        await checkAuth()
      }
      const targetUrl = `/memberarea/${result.memberid}`
      router.push(targetUrl)
    } else {
      errorMessage.value = result?.message || '查無報名資料，請確認輸入無誤或先完成報名程序！'
    }
  } catch (err) {
    console.error('Member Login Error:', err)
    errorMessage.value = err.message || '連線伺服器失敗，請稍後再試！'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section id="page-signon" class="page-view active">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="custom-card p-4 mt-4">
            
            <h4 class="fw-bold mb-2 text-center">{{ actionYear }}學年度報名資料查詢與報名表下載</h4>
            <p class="text-center text-muted fs-7 mb-4">
              輸入考生的「學生姓名」與「身分證字號 / 居留證號」即可進入考生專區
            </p>

            <!-- ===================================================
                 情境 A：非線上報名開放時間 (UPCOMING 或 ENDED)
                 =================================================== -->
            <div v-if="registerStatus !== 'ACTIVE'" class="my-4">
              <div class="alert alert-warning d-flex align-items-center fs-6" role="alert">
                <span class="material-symbols-outlined me-2 fs-3">warning</span>
                <div>
                  <strong v-if="registerStatus === 'UPCOMING'">
                    線上報名與資料查詢系統尚未開放！開放時間為：{{ dateVars.system_open || '尚未設定' }}
                  </strong>
                  <strong v-else>
                    抱歉，目前非線上報名與資料查詢系統開放時間（系統已於 {{ dateVars.system_end || '截止時間' }} 關閉）。
                  </strong>
                </div>
              </div>

              <!-- 關閉提示圖示區塊 -->
              <div class="text-center p-4 text-muted border border-dashed rounded-3 mt-4">
                <span class="material-symbols-outlined fs-1 text-secondary">lock</span>
                <p class="fw-bold fs-7 my-2 text-secondary">
                  本功能僅於線上報名開放期間開放使用，如有疑問請洽本校學務處體育組。
                </p>
              </div>
            </div>

            <!-- ===================================================
                 情境 B：開放時間內 (ACTIVE) -> 渲染查詢表單
                 =================================================== -->
            <template v-else>
              <!-- 錯誤提示訊息 -->
              <div v-if="errorMessage" class="alert alert-danger py-2 fs-7 mb-3" role="alert">
                {{ errorMessage }}
              </div>

              <!-- 登入表單 -->
              <form @submit.prevent="handleMemberLogin" novalidate>
                <div class="row g-2 justify-content-center mb-4">
                  
                  <!-- 學生姓名 -->
                  <div class="col-md-4 mb-2">
                    <label class="form-label fw-semibold" for="stname">
                      學生姓名 <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="stname" 
                      v-model.trim="stname"
                      placeholder="請輸入姓名" 
                      autocomplete="off"
                      required
                    >
                  </div>

                  <!-- 身分證字號 / 居留證號 -->
                  <div class="col-md-5 mb-2">
                    <label class="form-label fw-semibold" for="stdid">
                      身分證字號 / 居留證號 <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control text-uppercase" 
                      id="stdid" 
                      v-model="stdid"
                      @input="handleStdidInput"
                      placeholder="例如：A123456789" 
                      autocomplete="off"
                      maxlength="10"
                      required
                    >
                  </div>

                  <!-- 送出按鈕 -->
                  <div class="col-md-3 mb-2 d-flex align-items-end">
                    <button 
                      type="submit" 
                      class="btn btn-brand w-100 d-flex align-items-center justify-content-center gap-1 py-2 fw-semibold"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                      <span v-else class="material-symbols-outlined fs-5">search</span>
                      <span>{{ loading ? '驗證中...' : '查詢' }}</span>
                    </button>
                  </div>

                </div>

                <!-- 底部圖示與說明區塊 -->
                <div class="text-center p-4 text-muted border border-dashed rounded-3 mt-4">
                  <span class="material-symbols-outlined fs-1 text-secondary">manage_search</span>
                  <p class="mb-0 my-2">請於上方輸入資料並點擊查詢按鈕</p>
                  <p class="fw-bold fs-7 mb-0 text-secondary">
                    本功能提供給已報名參加甄試的學生，請利用“姓名”與“身份證字號”登入！
                  </p>
                </div>

              </form>
            </template>

          </div>
        </div>
      </div>
    </section>
</template>

<style scoped>
.btn-brand {
  background-color: var(--brand-primary, #0d6efd);
  color: #fff;
  border: none;
}
.btn-brand:hover {
  background-color: #0b5ed7;
  color: #fff;
}
.border-dashed {
  border-style: dashed !important;
}
</style>