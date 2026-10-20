import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export function usePeriod(dateVars) {
    /**
     * 檢查指定功能當前的狀態
     * @param {string} openStr 開始時間
     * @param {string} endStr 結束時間
     * @returns {'UPCOMING' | 'ACTIVE' | 'ENDED'}
     */
    // 全域共用當前時間（避免多個元件重複開 Timer）
    const now = ref(new Date())
    let timer = null

    // 啟動全域計時器（每秒更新一次時間）
    function startTicker() {
        if (!timer) {
            timer = setInterval(() => {
                now.value = new Date()
            }, 1000)
        }
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

    // 監聽狀態切換臨界點：當狀態從 UPCOMING 變成 ACTIVE 時，可選擇性發送 API 向伺服器雙重確認
    watch(registerStatus, (newStatus, oldStatus) => {
        if (oldStatus === 'UPCOMING' && newStatus === 'ACTIVE') {
            if (typeof fetchDateVars === 'function') {
                fetchDateVars() // 校正伺服器最新資料
            }
        }
    })
    return {
        now,
        registerStatus,
        scoreStatus
    }
}