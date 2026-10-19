<script setup>
// 👈 直接將專案根目錄的 README.md 當作 Vue 元件載入 (打包時自動編譯成 HTML)
import ReadmeContent from '../../README.md'
</script>

<template>
  <section class="page-view active">
    <div class="custom-card p-4 p-md-5">
      <div class="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
        <span class="material-symbols-outlined fs-1 text-primary">info</span>
        <div>
          <h4 class="fw-bold m-0">關於本系統</h4>
          <small class="text-muted">體育班甄試線上報名系統發展與架構說明</small>
        </div>
      </div>

      <!-- 直接渲染靜態 Markdown 元件 -->
      <div class="about-markdown-body fs-6 lh-base text-secondary">
        <ReadmeContent />
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-markdown-body :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
}
.about-markdown-body :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--brand-primary, #0d6efd);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.about-markdown-body :deep(ul) {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}
.about-markdown-body :deep(hr) {
  margin: 1.5rem 0;
  border-top: 1px solid #dee2e6;
}
</style>