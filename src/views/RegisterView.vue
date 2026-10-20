<script setup>
import { inject, ref } from 'vue'
import { usePeriod } from '../composables/usePeriod'

const dateVars = inject('dateVars', ref({}))
const { registerStatus } = usePeriod(dateVars)
</script>

<template>
  <main class="container my-4 flex-grow-1">
    <section class="page-view active">
      <div class="custom-card p-4 max-w-3xl mx-auto">
        <h4 class="fw-bold text-center mb-1">115學年度體育班甄試線上報名</h4>
        {{ registerStatus }}
        <!-- 情境 A / C：未開放或已截止 -->
        <div v-if="registerStatus !== 'ACTIVE'" class="my-4">
          <div class="alert alert-warning d-flex align-items-center fs-6" role="alert">
            <span class="material-symbols-outlined me-2 fs-3">warning</span>
            <div>
              <strong v-if="registerStatus === 'UPCOMING'">
                線上報名系統尚未開放！開放時間為：{{ dateVars.system_open }}
              </strong>
              <strong v-else>
                抱歉，目前非線上報名系統開放時間（報名已於 {{ dateVars.system_end }} 截止）。
              </strong>
            </div>
          </div>
        </div>

        <!-- 情境 B：開放報名中 (ACTIVE) 才渲染填表區域與步驟條 -->
        <template v-else>
          <p class="text-center text-muted fs-7 mb-4">請仔細填寫以下步驟資料，星號 (*) 為必填欄位</p>
          
          <!-- 步驟指示條 -->
          <!-- 報名表單內容 (基本資料、生理性別、身分證字號、生日...) -->
        </template>

      </div>
    </section>
  </main>
</template>