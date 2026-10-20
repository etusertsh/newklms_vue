<script setup>
import {inject, ref} from 'vue'
defineProps({
  prospectusUrl: {
    type: String,
    default: '#'
  }
})
const auth = inject('auth', ref({ isLoggedIn: false, user: null }))
</script>
<template>
  <div class="row g-3 mb-4">
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">assignment_add</span>
        </div>
        <router-link to="/register">
          <h6 class="fw-bold mb-1">填寫報名表</h6>
        </router-link>
        <small class="text-muted">上傳資料與報考項目</small>
      </div>
    </div>
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-success-subtle text-success p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">badge</span>
        </div>
        <a v-if="auth.isLoggedIn && auth.user?.usertype=='student'" :href="'/newklms/member/data/' + auth.user?.memberid">
          <h6 class="fw-bold mb-1">報名表列印</h6>
        </a>
        <router-link v-else to="/member/auth">
          <h6 class="fw-bold mb-1">報名表列印</h6>
        </router-link>
        <small class="text-muted">相關資料填寫完成即可下載</small>
      </div>
    </div>
    <div class="col-md-3 col-6">
      <div class="custom-card p-3 text-center hover-lift h-100">
        <div class="bg-warning-subtle text-warning-emphasis p-3 rounded-circle d-inline-flex mb-2">
          <span class="material-symbols-outlined fs-2">download_for_offline</span>
        </div>
        <a :href="prospectusUrl" download="甄試簡章.pdf" target="_blank">
          <h6 class="fw-bold mb-1">簡章下載</h6>
        </a>
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