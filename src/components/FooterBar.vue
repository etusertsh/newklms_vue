<script setup>
defineProps({
  schoolName: String,
  siteName: String,
  dep: String,
  deptel: String
})
</script>
<template>
  <footer class="bg-white border-top mt-auto py-4">
    <div class="container text-center text-md-start">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="fw-bold text-dark">{{ schoolName }} / {{ siteName }}</div>
          <div class="text-muted fs-7">諮詢專線：{{ deptel }} | 服務時間：週一至週五 10:00 - 14:00</div>
          <div class="text-muted fs-7">系統維護單位：{{ dep }}</div>
        </div>
        <div class="col-md-6 text-md-end">
          <span class="badge bg-light text-dark border me-2">無障礙網頁 AA 規範等級</span>
          <small class="text-muted">&copy; 2026 CCJH Sports Class Entrance Exam System. All Rights Reserved.</small>
        </div>
      </div>
    </div>
  </footer>
</template>