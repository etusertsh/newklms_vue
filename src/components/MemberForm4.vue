<script setup>
import { computed, inject, ref } from 'vue'

const memberData = inject('memberData', ref({}))
const sysParams = inject('sysParams', ref({}))

const maskedStdid = computed(() => {
  const id = memberData.value?.stdid || ''
  return id.length >= 6 ? `${id.slice(0, 6)}****` : id
})

const uniqueNum = computed(() => memberData.value?.unique_num || '')
const prospectusUrl = computed(() => sysParams.value?.prospectus || '')
</script>

<template>
  <div class="member-form-4">
    <!-- 考生基本資訊列 -->
    <div class="row g-3 p-3 bg-light rounded-3 border mb-4">
      <!-- 學生姓名 -->
      <div class="col-md-4 col-sm-12">
        <label class="form-label text-muted fs-7 mb-1">學生姓名</label>
        <h5 class="fw-bold text-dark m-0">{{ memberData?.stname || '讀取中...' }}</h5>
      </div>
      <!-- 身分證字號 / 居留證號 -->
      <div class="col-md-4 col-sm-12">
        <label class="form-label text-muted fs-7 mb-1">身分證字號 / 居留證號</label>
        <h5 class="fw-bold text-primary font-monospace m-0">{{ maskedStdid }}</h5>
      </div>
      <!-- 報名編號 -->
      <div class="col-md-4 col-sm-12">
        <label class="form-label text-muted fs-7 mb-1">報名編號</label>
        <h5 class="fw-bold text-success font-monospace m-0">{{ memberData?.serialnum || '尚未核發' }}</h5>
      </div>
    </div>

    <!-- 狀態提醒 -->
    <div class="alert alert-info d-flex align-items-center mb-4" role="alert">
      <span class="material-symbols-outlined fs-3 me-2">task_alt</span>
      <div>
        <strong>您已完成線上資料填寫！</strong>
        <div class="fs-7 mt-1">請點選下方按鈕下載列印報名表單，並於規定期限內送交本校辦理現場查驗。</div>
      </div>
    </div>

    <div v-if="memberData?.step < 3 || memberData?.change_flag == '1'" class="alert alert-warning d-flex align-items-center mb-4" role="alert">
      <span class="material-symbols-outlined fs-3 me-2 text-warning">warning</span>
      <div class="fs-7">
        <strong v-if="memberData?.step < 3">尚未完成完整報名流程：</strong>
        <strong v-else>報名資料已變更：</strong>
        請務必重新點選下方<span class="fw-bold text-danger">「下載甄試報名表與家長同意書」</span>，以產出最新版報名文件。
      </div>
    </div>

    <!-- 文件下載專區 -->
    <div class="row g-4">
      <!-- 區塊一：核心報名表單 -->
      <div class="col-md-6">
        <div class="card h-100 border-primary shadow-sm">
          <div class="card-header bg-primary text-white py-3">
            <h6 class="m-0 fw-bold d-flex align-items-center gap-1">
              <span class="material-symbols-outlined">assignment</span>
              主要報名表件
            </h6>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-4">
            <div>
              <h5 class="fw-bold text-dark mb-2">甄試報名表與家長同意書</h5>
              <p class="text-muted fs-7 mb-4">
                包含個人基本資料、選考項目、體能數據及家長切結同意書。下載後請以 A4 單面列印並由家長親自簽名。
              </p>
            </div>
            <div>
              <a
                :href="`/newklms/files/registerform/${uniqueNum}`"
                target="_blank"
                class="btn btn-danger btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                :class="{ 'disabled': !uniqueNum }"
              >
                <span class="material-symbols-outlined">download</span>
                下載甄試報名表 (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 區塊二：其他附件 -->
      <div class="col-md-6">
        <div class="card h-100 border shadow-sm">
          <div class="card-header bg-light py-3">
            <h6 class="m-0 fw-bold text-dark d-flex align-items-center gap-1">
              <span class="material-symbols-outlined text-secondary">folder_open</span>
              報名附件與佐證清單
            </h6>
          </div>
          <div class="card-body p-4 d-flex flex-column gap-3">
            <!-- 獲獎紀錄表 -->
            <div class="p-3 border rounded bg-white d-flex align-items-center justify-content-between">
              <div>
                <div class="fw-semibold">獲獎與競賽紀錄表</div>
                <small class="text-muted">若有登記獎項請列印並檢附佐證正影本</small>
              </div>
              <a
                :href="`/newklms/files/rewardprint/${uniqueNum}`"
                target="_blank"
                class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                :class="{ 'disabled': !uniqueNum }"
              >
                <span class="material-symbols-outlined fs-6">download</span> 下載
              </a>
            </div>

            <!-- 報名檢核表 -->
            <div class="p-3 border rounded bg-white d-flex align-items-center justify-content-between">
              <div>
                <div class="fw-semibold">報名所需表件檢核表</div>
                <small class="text-muted">前往現場繳件前請逐項核對攜帶表件</small>
              </div>
              <a
                :href="`/newklms/files/checklist/${uniqueNum}`"
                target="_blank"
                class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                :class="{ 'disabled': !uniqueNum }"
              >
                <span class="material-symbols-outlined fs-6">download</span> 下載
              </a>
            </div>

            <!-- 甄試簡章 -->
            <div v-if="prospectusUrl" class="p-3 border rounded bg-white d-flex align-items-center justify-content-between">
              <div>
                <div class="fw-semibold">甄試實施計畫與簡章</div>
                <small class="text-muted">查閱測驗評分標準、日程與試場規範</small>
              </div>
              <a
                :href="prospectusUrl"
                target="_blank"
                download
                class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              >
                <span class="material-symbols-outlined fs-6">download</span> 下載
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 現場報名繳件提醒 (步驟四) -->
    <div class="mt-4 p-4 border rounded-3 bg-light">
      <h6 class="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
        <span class="material-symbols-outlined text-primary">pin_drop</span>
        下一步：現場報名查驗提醒
      </h6>
      <ul class="mb-2 ps-3 fs-7 text-secondary lh-lg">
        <li><strong>現場繳件時間：</strong>{{ sysParams.on_site_time || '依學校簡章公告時間' }}</li>
        <li><strong>現場繳件地點：</strong>{{ sysParams.on_site_place || '本校學務處體育組' }}</li>
        <li><strong>應備齊文件：</strong>
          <ol class="ps-3 mt-1">
            <li>經家長簽名之「甄試報名表與家長同意書」正本</li>
            <li>考生新式身分證（或戶籍謄本、居留證）正本及影本（正本核驗後發還）</li>
            <li>就讀國小在學證明或畢肄業證明書正本</li>
            <li>若有登記競賽成績，請檢附獲獎證明文件正本及影本</li>
            <li>報名表件檢核表</li>
          </ol>
        </li>
      </ul>
    </div>
  </div>
</template>
