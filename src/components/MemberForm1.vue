<script setup>
import { ref, inject, watch } from 'vue'
import StudentBasicFields from './StudentBasicFields.vue'
import { useStudentForm } from '../composables/useStudentForm'
import { memberApi } from '../api'

const memberData = inject('memberData', ref({}))
const sysParams = inject('sysParams', ref({}))

const {
  createInitialForm,
  parseIsoToRoc,
  validateField,
  validateAll,
  scrollToFirstError,
  toStep1Payload
} = useStudentForm()

const form = ref(createInitialForm(memberData.value, memberData.value?.year || sysParams.value?.actionyear))
const errors = ref({})
const loading = ref(false)

// 監聽 memberData 變化，隨時同步最新後端考生資料與生日
watch(
  memberData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      form.value = createInitialForm(newData, newData.year || sysParams.value?.actionyear)
      parseIsoToRoc(newData.stbirth, form.value)
    }
  },
  { immediate: true, deep: true }
)

const onValidate = (field) => {
  validateField(field, form.value, errors.value, false)
}

const resetForm = () => {
  form.value = createInitialForm(memberData.value, memberData.value?.year || sysParams.value?.actionyear)
  parseIsoToRoc(memberData.value?.stbirth, form.value)
  errors.value = {}
}

const handleMemberUpdate1 = async () => {
  if (!validateAll(form.value, errors.value, false)) {
    scrollToFirstError()
    return
  }

  loading.value = true
  const payload = toStep1Payload(form.value)

  try {
    const result = await memberApi.updateStep1(payload)
    if (result && result.success) {
      alert(result.message || '更新基本資料成功')
      memberData.value = result.data
    } else {
      alert(result?.message || '更新失敗')
    }
  } catch (err) {
    console.error('Update Step1 Error:', err)
    alert(err.message || '伺服器連線失敗，請稍後再試。')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleMemberUpdate1" novalidate>
    <StudentBasicFields
      v-model="form"
      :errors="errors"
      mode="edit"
      :skill-notice="sysParams?.register_skill_notice"
      @validate="onValidate"
    />

    <!-- 送出按鈕 -->
    <div class="text-end pt-3 border-top">
      <button type="submit" class="btn btn-outline-primary btn-lg fw-bold px-4" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
        <span>{{ loading ? '報名資料傳送中...' : '更新基本資料' }}</span>
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary px-4 ms-2"
        @click="resetForm"
        :disabled="loading"
      >
        重填
      </button>
      <input type="hidden" id="year" v-model="form.year">
      <input type="hidden" id="unique_num" v-model="form.unique_num">
    </div>
  </form>
</template>
