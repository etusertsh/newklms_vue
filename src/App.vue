<script setup>
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import Navbar from './components/Navbar.vue'
import FooterBar from './components/FooterBar.vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()
const { sysParams } = storeToRefs(appStore)
appStore.registerUnauthorizedHandler()

// 3. 頁面切換/聚焦時自動檢核 (VisibilityChange)
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    appStore.checkAuth()
  }
}
let pollInterval = null

let heartBeatInterval = null

onMounted(() => {
  appStore.checkAuth()
  appStore.fetchSystemParams()
  appStore.fetchDateVars()
  // 高頻率探針：每 3 分鐘檢查一次 Datevars 
  pollInterval = setInterval(() => {
    appStore.fetchDateVars()
  }, 3 * 60 * 1000)

  // 事件監聽：切換 Tab 時同步檢核
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 低頻率探針：每 10 分鐘檢查一次 Session 是否仍有效，以及系統參數是否有更新
  heartBeatInterval = setInterval(() => {
    appStore.checkAuth()
    appStore.fetchSystemParams()
  }, 10 * 60 * 1000)
})

onUnmounted(() =>{
  if(pollInterval) clearInterval(pollInterval)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (heartBeatInterval) clearInterval(heartBeatInterval)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar 
      :school-name="sysParams.schoolname" 
      :site-name="sysParams.sitename" 
    />

    <!-- 主區域：根據當前網址切換顯示 HomeView 或 NewsDetail -->
    <main class="container my-4 flex-grow-1">
      <router-view />
    </main>

    <FooterBar 
      :school-name="sysParams.schoolname" 
      :site-name="sysParams.sitename"
      :dep="sysParams.dep"
      :deptel="sysParams.deptel"
    />
  </div>
</template>