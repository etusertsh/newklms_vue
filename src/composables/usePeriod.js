import { computed } from 'vue'

export function usePeriod(dateVars) {
    /**
     * 檢查指定功能當前的狀態
     * @param {string} openStr 開始時間
     * @param {string} endStr 結束時間
     * @returns {'UPCOMING' | 'ACTIVE' | 'ENDED'}
     */
    const getStatus = (openStr, endStr) => {
        if (!openStr || !endStr) return 'UPCOMING'

        // 取得當前時間 (優先以伺服器校正時間為準，無校正則用本機時間)
        const now = new Date()
        const openTime = new Date(openStr.replace(' ', 'T'))
        const endTime = new Date(endStr.replace(' ', 'T'))

        if (now < openTime) {
            return 'UPCOMING' // 未開放
        } else if (now >= openTime && now <= endTime) {
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

    return {
        registerStatus,
        scoreStatus
    }
}