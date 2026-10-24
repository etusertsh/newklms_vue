<script setup>
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import { authApi } from '../api'
import { showSuccess } from '../utils/swal'

// 表單綁定變數
const adminUser = ref('')
const adminPass = ref('')
const loading = ref(false)
const errorMessage = ref('')

const { setAuth } = useAppStore()

// 處理登入表單送出
const handleLogin = async (e) => {
  if(e?.target && !e.target.checkValidity()){
    e.target.reportValidity()
    return
  }
  const username = adminUser.value.trim()
  const password = adminPass.value.trim()

  if(!username || !password){
    errorMessage.value = '請填寫帳號與密碼！'
    return 
  }

  if(username.length < 4){
    errorMessage.value = '帳號長度至少需要 4 個字元！'
    return
  }
  
  if(password.length < 4){
    errorMessage.value = '密碼長度至少需要 4 個字元！'
    return 
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authApi.adminLogin(username, password)

    if (result && result.success) {
      // 1. 更新前端 Auth 狀態
      if (setAuth) {
        setAuth(result.data)
        showSuccess('管理權限成功登入')
      }
      // 2. 登入成功：跳轉至 CI4 後端管理主頁 (/newklms/admin)
      window.location.href = '/newklms/admin'
    } else {
      errorMessage.value = result?.message || '帳號或密碼錯誤，請重新輸入'
    }
  } catch (err) {
    console.error('Login Error:', err)
    errorMessage.value = err.message || '連線伺服器失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section id="page-login" class="page-view active">
    <div id="admin-login-box" class="row justify-content-center my-4">
      <div class="col-md-5">
        <div class="custom-card p-4">
          <!-- 圖示與標題 -->
          <div class="text-center mb-4">
            <div class="bg-primary text-white p-3 rounded-circle d-inline-flex mb-2">
              <span class="material-symbols-outlined fs-2">admin_panel_settings</span>
            </div>
            <h4 class="fw-bold">甄試管理後台登入</h4>
            <p class="text-muted fs-7">學校審核人員與管理者專用入口</p>
          </div>

          <!-- 錯誤提示區塊 -->
          <div v-if="errorMessage" class="alert alert-danger py-2 fs-7" role="alert">
            {{ errorMessage }}
          </div>

          <!-- 登入表單 -->
          <form @submit.prevent="handleLogin" novalidate>
            <div class="mb-3">
              <label class="form-label fs-7 fw-semibold" for="admin-user">帳號</label>
              <input 
                type="text" 
                id="admin-user" 
                v-model.trim="adminUser"
                class="form-control" 
                autocomplete="off" 
                placeholder="管理帳號" 
                minlength="4" 
                required
              >
            </div>

            <div class="mb-3">
              <label class="form-label fs-7 fw-semibold" for="admin-pass">密碼</label>
              <input 
                type="password" 
                id="admin-pass" 
                v-model.trim="adminPass"
                class="form-control" 
                minlength="4" 
                autocomplete="off" 
                placeholder="管理密碼" 
                required
              >
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-100 fw-bold py-2 mb-2 d-flex align-items-center justify-content-center gap-2"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
              <span>{{ loading ? '驗證中...' : '登入管理後台' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>