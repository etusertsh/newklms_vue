<script setup>
import { ref, onMounted, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { memberApi } from '../api'
const memberData = inject('memberData', ref({}))
const stuId = memberData.value?.id
const appStore = useAppStore()
const { sysParams } = storeToRefs(appStore)

const rewards = ref([])
const extraScores = ref([])

const loadRewards = async () => {
    if(!stuId) return
    try {
        const response = await memberApi.getRewards(stuId)
        rewards.value = response ? (Array.isArray(response) ? response : []) : []
    } catch (error) {
        console.error('Error loading rewards:', error)
    }
}

const loadScores = async () => {
    if(!stuId) return
    try {
        const response = await memberApi.getScores(stuId)
        extraScores.value = response ? (Array.isArray(response) ? response : []) : []
    } catch (error) {
        console.error('Error loading extra scores:', error)
    }
}

onMounted(() => {
    loadRewards()
    loadScores()
})
</script>

<template>

    <div class="card shadow-sm border-0 bg-white p-4 p-md-5">
        <div class="text-center mb-3">
            <h2 class="fw-bold mb-2">{{ sysParams.actionyear }}學年度{{ sysParams.sitename }}</h2>
            <p class="text-muted mb-0">現場報名自我檢核表</p>
        </div>
        <!-- 說明與現場報名時間地點 -->
        <div class="alert alert-info border-info-subtle mb-2" role="alert">
            <p class="mb-2 fw-semibold">
                📌 本檢核表可供甄試學生在現場報名前檢查所需證明、證件是否準備妥當，以免補件來往奔波。
            </p>
            <hr class="my-2">
            <div class="lh-base">
                <strong>本年度現場報名時間：</strong>{{ sysParams.on_site_time }}<br>
                <strong>報名地點：</strong>{{ sysParams.on_site_place }}<br>
                <small class="text-danger fw-bold">※ 請於上述時間內，由家長或監護人親自或委託申請將資料送達，通訊申請概不受理。</small>
            </div>
        </div>
        <!-- 學生資訊抬頭 -->
        <div class="info-header-box p-3 mb-3 text-start fs-5 fw-bold">
            報名序號：<span class="text-primary font-monospace">
                {{memberData.serialnum}}
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
            報名學生：<span>
                {{memberData.stname ?? ''}}
            </span>
        </div>
        <!-- 檢核項目主要區塊 -->
        <div class="check-section border border-2 border-dark rounded-3 p-4">
            <!-- 通用自備附件 -->
            <h4 class="fw-bold border-bottom pb-2 mb-3">一、報名所需自備附件</h4>
            <ul class="list-unstyled mb-4 lh-lg">
                <li><span class="check-box"></span> 甄試報名表 (附件 2)</li>
                <li><span class="check-box"></span> 家長同意書 (家長請簽章) (附件 3)</li>
                <li><span class="check-box"></span> 個資授權書 (附件 4)</li>
                <li><span class="check-box"></span> 戶口名簿或戶籍謄本</li>
                <li><span class="check-box"></span> 本人三個月內正面半身二吋脫帽相片一式兩張 <small class="text-muted">(一張貼於報名表，一張貼於准考證)</small>
                </li>
                <li><span class="check-box"></span> 國小應屆畢業生之相關正本證件 <small class="text-muted">(請提供六年級學期成績單，驗畢後正本發還)</small></li>
                <li><span class="check-box"></span> 受委託報名請攜帶委託申請書（附件 1）、家長私章</li>
                <li><span class="check-box"></span> 報名費 800 元 <small class="text-muted">(持有社政單位核發低收入戶證明正本及影本者免繳，正本驗畢發還)</small>
                </li>
            </ul>        
            <div v-if="rewards.length > 0">
                <h4 class="fw-bold border-bottom pb-2 mb-3">二、競賽或測驗紀錄 (具體事蹟) 證明文件</h4>
                <ul class="list-unstyled mb-4 lh-lg">
                    <li v-for="(item, index) in rewards" :key="index">
                        <span class="check-box"></span> 「<strong>{{ item.category }}</strong>  {{ item.rewardname }} - {{ item.rewardrank }}」證明文件正本
                    </li>
                </ul>
            </div>
            <div v-if="extraScores.length > 0">
                <h4 class="fw-bold border-bottom pb-2 mb-3">
                    <span v-if="rewards.length > 0">三</span>
                    <span v-else>二</span>
                    、其他測驗成績證明文件</h4>
                <ul class="list-unstyled mb-4 lh-lg">
                    <li v-for="(item, index) in extraScores" :key="index">
                        <span class="check-box"></span> 「<strong>{{ item.testname }}</strong>」證明文件正本
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
    /* 實體列印勾選盒樣式 */
    .check-box {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2px solid #212529;
        border-radius: 2px;
        margin-right: 8px;
        vertical-align: middle;
        background-color: #fff;
    }

    .info-header-box {
        background-color: #eef2f7;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
    }

    /* ===================================================
        列印專用媒體查詢 (@media print)
        =================================================== */
    @media print {

        /* 隱藏不需列印的 UI (按鈕、導覽列等) */
        .no-print {
            display: none !important;
        }

        body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-size: 11pt;
            padding: 0 !important;
            margin: 0 !important;
        }

        li {
            font-family: '標楷體', sans-serif;
        }

        table td {
            font-family: '標楷體', sans-serif;
        }

        .printable-container {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .alert-info {
            background-color: #ffffff !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            padding: 10px !important;
        }

        .info-header-box {
            background-color: #ffffff !important;
            border: 1px solid #000000 !important;
        }

        .check-section {
            border: 2px solid #000000 !important;
            border-radius: 0 !important;
            padding: 15px !important;
        }

        /* 強制設定列印頁面邊界與紙張 */
        @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
        }
    }
</style>