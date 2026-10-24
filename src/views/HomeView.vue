<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import HeroBanner from '../components/HeroBanner.vue'
import QuickLinks from '../components/QuickLinks.vue'
import NewsList from '../components/NewsList.vue'
import Schedule from '../components/Schedule.vue'

const { sysParams } = storeToRefs(useAppStore())
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