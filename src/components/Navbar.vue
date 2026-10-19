<script setup>
defineProps({
  schoolName: String,
  siteName: String
})
const baseUrl = import.meta.env.BASE_URL
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
              <router-link class="nav-link" id="nav-news" to="/#announce">
                <span class="material-symbols-outlined">campaign</span> 最新公告
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" id="nav-about" to="/about">
                <span class="material-symbols-outlined">info</span> 關於
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="nav-register" href="https://etuser2.hopto.org/newklms/register">
                <span class="material-symbols-outlined">edit_square</span> 線上報名
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="nav-signon" href="https://etuser2.hopto.org/newklms/member/auth">
                <span class="material-symbols-outlined">search</span> 報名查詢
              </a>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-primary ms-lg-2" id="nav-login" to="/auth">
                <span class="material-symbols-outlined">admin_panel_settings</span> 管理登入
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>