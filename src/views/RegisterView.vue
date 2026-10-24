<script setup>
import { storeToRefs } from 'pinia'
import { usePeriod } from '../composables/usePeriod'
import RegisterForm from '../components/RegisterForm.vue'
import { useAppStore } from '../stores/app'

const { dateVars, sysParams, auth } = storeToRefs(useAppStore())
const { registerStatus } = usePeriod()

</script>

<template>
    <section class="page-view active">
      <div class="custom-card p-4 max-w-3xl mx-auto">
        <h4 class="fw-bold text-center mb-1">{{ sysParams?.actionyear}} 學年度{{ sysParams?.sitename}}報名</h4>
        <template v-if="auth.user?.usertype === 'admin'">
          <RegisterForm />
        </template>
        <template v-else>
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
            <RegisterForm />
          </template>
        </template>

      </div>
    </section>
</template>