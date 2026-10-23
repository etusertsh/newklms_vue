<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import RegisterTopNav from './RegisterTopNav.vue'
import StudentBasicFields from './StudentBasicFields.vue'
import { useStudentForm } from '../composables/useStudentForm'
import { memberApi } from '../api'

const sysParams = inject('sysParams', ref({}))
const router = useRouter()
const setAuth = inject('setAuth', null)
const checkAuth = inject('checkAuth', null)

const {
  createInitialForm,
  validateField,
  validateAll,
  scrollToFirstError,
  toStep1Payload
} = useStudentForm()

const form = ref(createInitialForm({}, sysParams.value?.actionyear))
const errors = ref({})
const loading = ref(false)

const onValidate = (field) => {
  validateField(field, form.value, errors.value, true)
}

const resetForm = () => {
  form.value = createInitialForm({}, sysParams.value?.actionyear)
  errors.value = {}
}

const handleStep1 = async () => {
  if (!validateAll(form.value, errors.value, true)) {
    scrollToFirstError()
    return
  }

  loading.value = true
  const payload = toStep1Payload(form.value)

  try {
    const result = await memberApi.updateStep1(payload)

    if (!result?.success) {
      alert(result?.message || '報名失敗，請確認資料')
      if (result?.status === 'duplicate') {
        router.push('/member/auth')
      }
    } else {
      if (typeof setAuth === 'function') {
        setAuth({
          memberid: result.memberid,
          realname: form.value.stname,
          usertype: 'student'
        })
      }
      if (typeof checkAuth === 'function') {
        await checkAuth()
      }
      const targetUrl = `/memberarea/${result.memberid}`
      router.push(targetUrl)
    }
  } catch (err) {
    console.error('Register Step1 Error:', err)
    alert(err.message || '伺服器連線失敗，請稍後再試。')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <RegisterTopNav :register-step="1" />

  <form @submit.prevent="handleStep1" novalidate>
    <StudentBasicFields
      v-model="form"
      :errors="errors"
      mode="create"
      :skill-notice="sysParams?.register_skill_notice"
      @validate="onValidate"
    />

    <!-- 送出按鈕 -->
    <div class="d-grid gap-2 pt-3">
      <button type="submit" class="btn btn-primary btn-lg fw-bold" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
        <span>{{ loading ? '報名資料傳送中...' : '確認，下一步：其他聯絡資料' }}</span>
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary px-4"
        @click="resetForm"
        :disabled="loading"
      >
        重填
      </button>
      <input type="hidden" id="year" v-model="form.year">
    </div>
  </form>
</template>

<style scoped>
/* 欄位微調與修飾 */
.custom-card {
  border: 1px solid #e9ecef;
}
</style>
