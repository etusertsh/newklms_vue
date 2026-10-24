import { ref, computed, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'

// 全域共用當前時間（模組級單例，避免多個元件重複啟動 Timer）
const now = ref(new Date())
let timer = null
let subscriberCount = 0

function startTicker() {
    if (!timer) {
        now.value = new Date()
        timer = setInterval(() => {
            now.value = new Date()
        }, 1000)
    }
    subscriberCount++
}

function stopTicker() {
    subscriberCount--
    if (subscriberCount <= 0 && timer) {
        clearInterval(timer)
        timer = null
        subscriberCount = 0
    }
}

export function usePeriod() {
    /**
     * 檢查指定功能當前的狀態
     * @param {string} openStr 開始時間
     * @param {string} endStr 結束時間
     * @returns {'UPCOMING' | 'ACTIVE' | 'ENDED'}
     */
    const appStore = useAppStore()
    const { dateVars } = storeToRefs(appStore)

    if (getCurrentInstance()) {
        onMounted(() => {
            startTicker()
        })
        onUnmounted(() => {
            stopTicker()
        })
    } else {
        startTicker()
    }

    const getStatus = (openStr, endStr) => {
        if (!openStr || !endStr) return 'UPCOMING'

        // 格式化 ISO 時間字串
        const openTime = new Date(openStr.replace(' ', 'T'))
        const endTime = new Date(endStr.replace(' ', 'T'))

        if (now.value < openTime) {
            return 'UPCOMING' // 未開放
        } else if (now.value >= openTime && now.value <= endTime) {
            return 'ACTIVE'   // 開放中
        } else {
            return 'ENDED'    // 已截止
        }
    }

    // 報名狀態
    const registerStatus = computed(() =>
        getStatus(dateVars.value?.system_open, dateVars.value?.system_end)
    )

    // 成績查詢狀態
    const scoreStatus = computed(() =>
        getStatus(dateVars.value?.score_open, dateVars.value?.score_end)
    )

    // 監聽狀態切換臨界點：當狀態從 UPCOMING 變成 ACTIVE 時，向伺服器雙重確認
    watch(registerStatus, (newStatus, oldStatus) => {
        if (oldStatus === 'UPCOMING' && newStatus === 'ACTIVE') {
            appStore.fetchDateVars() // 校正伺服器最新資料
        }
    })

    return {
        now,
        registerStatus,
        scoreStatus,
        getStatus
    }
}