<script setup>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  registerStep: {
    type: Number,
    default: 1
  }
})

const router = useRouter()
const sysParams = inject('sysParams', {})
const setAuth = inject('setAuth', null)

const progressWidth = computed(() => {
  const step = Number(props.registerStep) || 1
  return `${Math.min(Math.max(((step - 1) / 3) * 100, 0), 100)}%`
})

const handleLogout = () => {
  if (typeof setAuth === 'function') {
    setAuth(null)
  }
  router.push('/member/auth')
}
</script>

<template>
    <p class="text-center text-muted fs-7 mb-4">請仔細填寫以下步驟資料，星號 (*) 為必填欄位</p>
    <!-- Stepper Progress Bar -->
    <div class="stepper max-w-xl mx-auto px-3">
        <div class="stepper-progress" id="stepper-progress" :style="{ width: progressWidth }"></div>
        <div class="step-item" :class="{ 'active': registerStep === 1, 'completed': registerStep > 1 }" id="step-indicator-1">
            <div class="step-circle">1</div>
            <div class="step-label">基本資料</div>
        </div>
        <div class="step-item" :class="{ 'active': registerStep === 2, 'completed': registerStep > 2 }" id="step-indicator-2">
            <div class="step-circle">2</div>
            <div class="step-label">其他資料</div>
        </div>
        <div class="step-item" :class="{ 'active': registerStep === 3, 'completed': registerStep > 3 }" id="step-indicator-3">
            <div class="step-circle">3</div>
            <div class="step-label">列印報名表</div>
        </div>
        <div class="step-item" :class="{ 'active': registerStep === 4, 'completed': registerStep > 4 }" id="step-indicator-4">
            <div class="step-circle">4</div>
            <div class="step-label">現場報名</div>
        </div>
    </div>

    <div v-if="registerStep > 1" class="text-end mb-2">
        <button type="button" class="btn btn-outline-primary btn-sm" @click="handleLogout">
          <span class="material-symbols-outlined align-middle fs-6">logout</span> 登出
        </button>
    </div>

    <div v-if="registerStep === 1" class="border rounded rounded-lg p-3 mb-2">
    <p>歡迎進入<strong>{{ sysParams.actionyear}} 學年度{{ sysParams.sitename }}系統。</strong>甄試報名有<strong class="text-primary">四個步驟</strong>：
    </p>
    <ul>
        <li><strong class="text-success">步驟一</strong>、填寫基本資料：有<span
                class="text-danger">星號(*)</span>的欄位是必要的喔，<strong>身份證字號</strong>和<strong>學生姓名</strong>請一定要正確，因為填寫完畢確定之後就不能更改。
        </li>
        <li><strong class="text-success">步驟二</strong>、填寫其他資料：其他資料包含家長、連絡電話、電子郵件…等等。</li>
        <li><strong class="text-success">步驟三</strong>、列印：列印出報名表、准考證、報名檢核表等。</li>
        <li><strong class="text-success">步驟四</strong>、現場報名：攜帶報名表、准考證及獲獎資料並攜帶相關證明文件，至本校現場報名。</li>
    </ul>
    <p><strong class="text-danger"><span class="material-symbols-outlined fs-2">notifications</span> 提醒事項：</strong>填寫基本資料後即開始線上報名，後續需要再<span class="text-danger fw-semibold">完成其他資料的填寫</span>。<br />在報名期限內可以利用<router-link to="/member/auth"
            class="btn btn-sm btn-outline-secondary"><span class="material-symbols-outlined">search</span> 報名查詢</router-link>功能，用自己的<strong class="text-primary">身份證字號 / 居留證號</strong>和<strong
            class="text-primary">學生姓名</strong>登入報名系統編輯自己的資料，以及下載列印書面報名資料。</p>
    </div>

</template>