<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
defineProps({
  prospectusUrl: {
    type: String,
    default: '#'
  }
})
const { auth } = storeToRefs(useAppStore())
</script>
<template>
  <div class="row g-3 mb-4">
    <div class="col-md-12">
    </div>
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">assignment_add</span>
        </div>
        <h6 class="fw-bold mb-1">
          <router-link to="/register">
            填寫報名表
          </router-link>
        </h6>
        <small class="text-muted">上傳資料與報考項目</small>
      </div>
    </div>
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-success-subtle text-success p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">badge</span>
        </div>
        <h6 class="fw-bold mb-1">
        <router-link v-if="auth.isLoggedIn && (auth.user?.usertype == 'student' || auth.user?.usertype == 'admin') && auth.user?.memberid !==''" :to="`/memberarea/${auth.user?.memberid}`">
          報名表列印
        </router-link>
        <router-link v-else to="/member/auth">
          報名表列印
        </router-link>
        </h6>
        <small class="text-muted">相關資料填寫完成即可下載</small>
      </div>
    </div>
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-warning-subtle text-warning-emphasis p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">download_for_offline</span>
        </div>
        <h6 class="fw-bold mb-1">
        <a :href="prospectusUrl" download="甄試簡章.pdf" target="_blank">
          簡章下載
        </a>
        </h6>
        <small class="text-muted">閱讀實施計畫與規定</small>
      </div>
    </div>
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-info-subtle text-info-emphasis p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">analytics</span>
        </div>
        <h6 class="fw-bold mb-1"><router-link to="/score">成績查詢</router-link></h6>
        <small class="text-muted">術科與榜單公告</small>
      </div>
    </div>
  </div>
</template>