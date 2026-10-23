<script setup>
import { inject } from 'vue'
import HeroBanner from '../components/HeroBanner.vue'
import QuickLinks from '../components/QuickLinks.vue'
import NewsList from '../components/NewsList.vue'
import Schedule from '../components/Schedule.vue'

// 注入在 App.vue 全域 provide 的系統參數
const sysParams = inject('sysParams')
</script>

<template>
  <section id="page-main" class="page-view active">
    <!-- Hero 橫幅 -->
    <HeroBanner 
      :action-year="sysParams.actionyear"
      :school-name="sysParams.schoolname" 
      :site-name="sysParams.sitename"
      :site-slogan="sysParams.slogan"
    />

    <!-- 4 個快捷操作卡片 -->
    <QuickLinks :prospectus-url="sysParams.prospectus" />

    <!-- 最新公告與日程表 -->
    <div class="row g-4">
      <div class="col-lg-8">
        <NewsList />
      </div>
      <div class="col-lg-4">
        <Schedule />
      </div>
    </div>
  </section>
</template>