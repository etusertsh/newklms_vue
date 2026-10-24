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

const loadRewards = async () => {
    if(!stuId) return
    try {
        const response = await memberApi.getRewards(stuId)
        rewards.value = response ? (Array.isArray(response) ? response : []) : []
    } catch (error) {
        console.error('Error loading rewards:', error)
    }
}


onMounted(() => {
    loadRewards()
})
</script>
<template>
    <div class="card shadow-sm border-0 bg-white p-4 p-md-5">
        <div class="text-center mb-3">
            <h2 class="fw-bold mb-2">{{ sysParams.actionyear}}學年度{{ sysParams.sitename}}</h2>
            <p class="text-muted mb-0">考生獲獎紀錄表</p>
        </div>
        
        <!-- 學生資訊抬頭 -->
        <div class="info-header-box p-3 mb-3 text-start fs-5 fw-bold">
            報名序號：<span class="text-primary font-monospace">
                {{memberData.serialnum}}
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
            報名學生：<span>
                {{memberData.stname}}
            </span>
        </div>
        <p class="fw-bold">※獲獎紀錄須附證明文件，請備妥正本，報名時核驗後發還。</p>
        <table class="table table-bordered table-striped">
            <thead class="table-light">
                <tr>
                    <th scope="col" class="text-center">競賽類型</th>
                    <th scope="col" class="text-center">競賽名稱</th>
                    <th scope="col" class="text-center">獎項成績</th>
                    <th scope="col" class="text-center">備註 <small>(證明文件)</small></th>
                </tr>
                </thead>
            <tbody>
                <tr v-if="rewards.length === 0">
                    <td colspan="4" class="text-center text-muted">未登錄競賽資料</td>
                </tr>
                <tr v-for="(reward, index) in rewards" :key="index">
                    <td class="fw-semibold">{{ reward.category}}</td>
                    <td>{{ reward.rewardname }}</td>
                    <td>{{ reward.rewardrank }}</td>
                    <td><span class="check-box"></span></td>  
                </tr>          
            </tbody>
        </table>
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
