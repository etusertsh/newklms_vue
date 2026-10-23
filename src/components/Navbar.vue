<script setup>
import { inject, ref } from 'vue'
defineProps({
  schoolName: { type: String, default: '基隆市立中正國中' },
  siteName: { type: String, default: '體育班甄試線上報名' }
})
// 注入全域 Auth 狀態
const auth = inject('auth', ref({ isLoggedIn: false, user: null }))
</script>
<template>
  <header class="sticky-top navbar-custom">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
          <div class="bg-teal p-2 rounded-3 text-white d-flex align-items-center justify-content-center" style="background-color: var(--brand-primary);">
            <span class="material-symbols-outlined fs-4">sports_score</span>
          </div>
          <div>
            <div class="fw-bold lh-1 text-dark" style="font-size: 1.15rem;">{{ schoolName }}</div>
            <small class="text-muted fs-7">{{ siteName }}</small>
          </div>
        </router-link>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav ms-auto my-2 my-lg-0 gap-lg-1">
            <li class="nav-item">
              <router-link class="nav-link" id="nav-main" to="/">
                <span class="material-symbols-outlined">home</span> 首頁
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" id="nav-news" :to="{path: '/' , hash: '#announce'}">
                <span class="material-symbols-outlined">campaign</span> 最新公告
              </router-link>
            </li>            
            <li class="nav-item">
              <router-link class="nav-link" id="nav-register" to="/register">
                <span class="material-symbols-outlined">edit_square</span> 線上報名
              </router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="auth.isLoggedIn && (auth.user?.usertype == 'student' || auth.user?.usertype == 'admin') && auth.user?.memberid !==''" class="nav-link" id="nav-signon" :to="`/memberarea/${auth.user?.memberid}`">
                <span class="material-symbols-outlined">search</span> 報名查詢
              </router-link>
              <router-link v-else class="nav-link" id="nav-signon" to="/member/auth">
                <span class="material-symbols-outlined">search</span> 報名查詢
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" id="nav-about" to="/about">
                <span class="material-symbols-outlined">info</span> 關於
              </router-link>
            </li>
            <li class="nav-item">
              <!-- 已登入狀態：顯示 realname，點擊前往 /newklms/admin -->
              <a 
                v-if="auth.isLoggedIn && auth.user?.usertype=='admin'" 
                class="nav-link ms-lg-2 fw-bold d-flex align-items-center gap-1" 
                id="nav-login" 
                href="/newklms/admin"
              >
                <span class="material-symbols-outlined">shield_person</span>
                {{ auth.user?.realname || auth.user?.username || '管理員' }}
              </a>
              <!-- 未登入狀態：顯示「管理登入」，點擊進入 SPA 的 /auth 登入頁 -->
              <router-link 
                v-else 
                class="nav-link text-primary ms-lg-2 d-flex align-items-center gap-1" 
                id="nav-login" 
                to="/auth"
              >
                <span class="material-symbols-outlined">admin_panel_settings</span>
                管理登入
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>