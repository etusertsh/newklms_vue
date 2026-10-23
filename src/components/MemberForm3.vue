<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { memberApi } from '../api'

const memberData = inject('memberData', ref({}))
const sysParams = inject('sysParams', ref({}))

// 獲獎紀錄清單與載入狀態
const rewards = ref([])
const loadingRewards = ref(false)

// 其他測驗成績清單與載入狀態
const extraScores = ref([])
const loadingScores = ref(false)

// 獲獎紀錄表單狀態
const selectedCategory = ref('')
const showRewardForm = ref(false)
const rewardForm = ref({
  category: '',
  rewardname: '',
  rewardrank: ''
})
const submittingReward = ref(false)

// 其他測驗表單狀態
const selectedTestName = ref('')
const showScoreForm = ref(false)
const scoreForm = ref({
  testname: '',
  grade: ''
})
const submittingScore = ref(false)

// 讀取獲獎紀錄
const loadRewards = async () => {
  const studentId = memberData.value?.id
  if (!studentId) return

  loadingRewards.value = true
  try {
    const data = await memberApi.getRewards(studentId)
    // 後端可能回傳物件或陣列
    rewards.value = data ? (Array.isArray(data) ? data : Object.values(data)) : []
  } catch (err) {
    console.error('Load Rewards Error:', err)
  } finally {
    loadingRewards.value = false
  }
}

// 讀取其他測驗成績
const loadScores = async () => {
  const studentId = memberData.value?.id
  if (!studentId) return

  loadingScores.value = true
  try {
    const data = await memberApi.getScores(studentId)
    extraScores.value = data ? (Array.isArray(data) ? data : Object.values(data)) : []
  } catch (err) {
    console.error('Load Scores Error:', err)
  } finally {
    loadingScores.value = false
  }
}

// 監聽考生資料載入
watch(
  () => memberData.value?.id,
  (newId) => {
    if (newId) {
      loadRewards()
      loadScores()
    }
  },
  { immediate: true }
)

// 開啟獲獎紀錄表單
const openRewardForm = () => {
  if (!selectedCategory.value) return
  rewardForm.value = {
    category: selectedCategory.value,
    rewardname: '',
    rewardrank: ''
  }
  showRewardForm.value = true
}

// 關閉獲獎紀錄表單
const closeRewardForm = () => {
  showRewardForm.value = false
  rewardForm.value = { category: '', rewardname: '', rewardrank: '' }
}

// 送出新增獲獎紀錄
const handleAddReward = async () => {
  if (!rewardForm.value.rewardname.trim() || !rewardForm.value.rewardrank.trim()) {
    alert('請填寫競賽名稱與獎項成績！')
    return
  }

  const studentId = memberData.value?.id
  if (!studentId) return

  submittingReward.value = true
  try {
    await memberApi.addReward(studentId, {
      category: rewardForm.value.category,
      rewardname: rewardForm.value.rewardname.trim(),
      rewardrank: rewardForm.value.rewardrank.trim()
    })
    alert(`競賽成績：「${rewardForm.value.rewardname}」儲存成功！`)
    closeRewardForm()
    selectedCategory.value = ''
    await loadRewards()
  } catch (err) {
    console.error('Add Reward Error:', err)
    alert(err.message || '新增競賽成績失敗，請稍後再試！')
  } finally {
    submittingReward.value = false
  }
}

// 刪除獲獎紀錄
const handleDeleteReward = async (item) => {
  const rewardId = item.rewardid || item.id
  if (!rewardId) return

  const confirmed = confirm(`確定要刪除獲獎紀錄「${item.rewardname || ''}」嗎？`)
  if (!confirmed) return

  try {
    await memberApi.deleteReward(rewardId)
    await loadRewards()
  } catch (err) {
    console.error('Delete Reward Error:', err)
    alert(err.message || '刪除失敗，請稍後再試！')
  }
}

// 開啟其他測驗表單
const openScoreForm = () => {
  if (!selectedTestName.value) return
  scoreForm.value = {
    testname: selectedTestName.value,
    grade: ''
  }
  showScoreForm.value = true
}

// 關閉其他測驗表單
const closeScoreForm = () => {
  showScoreForm.value = false
  scoreForm.value = { testname: '', grade: '' }
}

// 送出新增其他測驗成績
const handleAddScore = async () => {
  if (scoreForm.value.grade === '' || isNaN(scoreForm.value.grade)) {
    alert('請填寫正確的鑑定成績！')
    return
  }

  const studentId = memberData.value?.id
  if (!studentId) return

  submittingScore.value = true
  try {
    await memberApi.addScore(studentId, {
      testname: scoreForm.value.testname,
      grade: scoreForm.value.grade
    })
    alert(`鑑定成績：「${scoreForm.value.testname}」儲存成功！`)
    closeScoreForm()
    selectedTestName.value = ''
    await loadScores()
  } catch (err) {
    console.error('Add Score Error:', err)
    alert(err.message || '新增鑑定成績失敗，請稍後再試！')
  } finally {
    submittingScore.value = false
  }
}

// 刪除其他測驗成績
const handleDeleteScore = async (item) => {
  const scoreId = item.scoreid || item.id
  if (!scoreId) return

  const confirmed = confirm(`確定要刪除鑑定成績「${item.testname || ''}」嗎？`)
  if (!confirmed) return

  try {
    await memberApi.deleteScore(scoreId)
    await loadScores()
  } catch (err) {
    console.error('Delete Score Error:', err)
    alert(err.message || '刪除失敗，請稍後再試！')
  }
}

onMounted(() => {
  if (memberData.value?.id) {
    loadRewards()
    loadScores()
  }
})
</script>

<template>
  <div class="member-form-3">
    <!-- ==============================================
         區塊一：競賽項目與成績佐證
         ============================================== -->
    <h5 class="form-section-title text-success mb-3">競賽項目與成績佐證</h5>
    <p class="text-muted fs-7 mb-3">
      <span class="material-symbols-outlined text-info align-middle me-1">info</span>
      參加測驗、比賽的成績（如演講、朗讀、寫作、科展、全民英檢、AMC...或其他學校辦理的測驗等），報名時若來不及提出，測驗期間提出亦可。
    </p>

    <!-- 選擇類別與新增按鈕 -->
    <div v-if="!showRewardForm" class="row g-2 align-items-center mb-3">
      <div class="col-auto">
        <select v-model="selectedCategory" class="form-select">
          <option value="" disabled>選擇競賽類型...</option>
          <option
            v-for="cat in (sysParams.reward_category || [])"
            :key="cat"
            :value="cat"
          >
            {{ cat }}
          </option>
        </select>
      </div>
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-outline-primary"
          :disabled="!selectedCategory"
          @click="openRewardForm"
        >
          <span class="material-symbols-outlined align-middle fs-6">add</span> 新增競賽與檢定
        </button>
      </div>
    </div>

    <!-- 新增獲獎紀錄表單 -->
    <div v-else class="card p-3 mb-3 bg-light border">
      <h6 class="fw-bold mb-3">新增獲獎紀錄</h6>
      <form @submit.prevent="handleAddReward">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label fw-semibold fs-7">競賽類型</label>
            <input type="text" class="form-control" :value="rewardForm.category" readonly>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold fs-7">競賽名稱 <span class="text-danger">*</span></label>
            <input
              type="text"
              v-model.trim="rewardForm.rewardname"
              class="form-control"
              placeholder="例如：全市國小國語文競賽"
              required
            >
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold fs-7">獎項成績 <span class="text-danger">*</span></label>
            <input
              type="text"
              v-model.trim="rewardForm.rewardrank"
              class="form-control"
              placeholder="例如：個人組第一名"
              required
            >
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button type="submit" class="btn btn-success" :disabled="submittingReward">
              <span v-if="submittingReward" class="spinner-border spinner-border-sm me-1"></span>
              儲存
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="closeRewardForm">
              取消
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- 獲獎列表表格 -->
    <div class="table-responsive mb-4">
      <table class="table table-hover align-middle border">
        <thead class="table-light">
          <tr>
            <th>競賽類型</th>
            <th>競賽名稱</th>
            <th>獎項成績</th>
            <th class="text-end" style="width: 100px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingRewards">
            <td colspan="4" class="text-center py-3 text-muted">
              <span class="spinner-border spinner-border-sm me-1"></span> 讀取獲獎紀錄中...
            </td>
          </tr>
          <tr v-else-if="rewards.length === 0">
            <td colspan="4" class="text-center py-3 text-muted fs-7">
              尚無登記獲獎紀錄（可選填）
            </td>
          </tr>
          <tr v-for="(item, idx) in rewards" :key="item.rewardid || idx">
            <td><span class="badge bg-secondary-subtle text-secondary">{{ item.category }}</span></td>
            <td class="fw-semibold">{{ item.rewardname }}</td>
            <td>{{ item.rewardrank }}</td>
            <td class="text-end">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="handleDeleteReward(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <small class="text-muted fs-8">如要修改該項獲獎紀錄，請先刪除該項記錄後再重新新增。</small>
    </div>

    <hr class="my-4">

    <!-- ==============================================
         區塊二：其他測驗
         ============================================== -->
    <h5 class="form-section-title text-success mb-3">其他測驗鑑定成績</h5>
    <p class="text-muted fs-7 mb-3">
      <span class="material-symbols-outlined text-info align-middle me-1">info</span>
      如學生有參加其他學校所舉辦的鑑定測試，請將該學校與鑑定項目，以及成績填於下表；無者免填（證明文件請備妥正本及影本，正本於現場報名時核驗後發還）。
    </p>

    <!-- 選擇鑑定項目與新增按鈕 -->
    <div v-if="!showScoreForm" class="row g-2 align-items-center mb-3">
      <div class="col-auto">
        <select v-model="selectedTestName" class="form-select">
          <option value="" disabled>選擇鑑定項目...</option>
          <option
            v-for="test in (sysParams.extra_test || [])"
            :key="test"
            :value="test"
          >
            {{ test }}
          </option>
        </select>
      </div>
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-outline-primary"
          :disabled="!selectedTestName"
          @click="openScoreForm"
        >
          <span class="material-symbols-outlined align-middle fs-6">add</span> 新增鑑定成績
        </button>
      </div>
    </div>

    <!-- 新增鑑定成績表單 -->
    <div v-else class="card p-3 mb-3 bg-light border">
      <h6 class="fw-bold mb-3">新增其他測驗鑑定成績</h6>
      <form @submit.prevent="handleAddScore">
        <div class="row g-3 align-items-end">
          <div class="col-md-6">
            <label class="form-label fw-semibold fs-7">學校與鑑定項目</label>
            <input type="text" class="form-control" :value="scoreForm.testname" readonly>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold fs-7">鑑定成績 (小數點後 1 位) <span class="text-danger">*</span></label>
            <input
              type="number"
              step="0.1"
              v-model.number="scoreForm.grade"
              class="form-control font-monospace"
              placeholder="例如：85.5"
              required
            >
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button type="submit" class="btn btn-success" :disabled="submittingScore">
              <span v-if="submittingScore" class="spinner-border spinner-border-sm me-1"></span>
              儲存
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="closeScoreForm">
              取消
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- 其他測驗表格 -->
    <div class="table-responsive">
      <table class="table table-hover align-middle border">
        <thead class="table-light">
          <tr>
            <th>學校與鑑定項目</th>
            <th>鑑定成績</th>
            <th class="text-end" style="width: 100px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingScores">
            <td colspan="3" class="text-center py-3 text-muted">
              <span class="spinner-border spinner-border-sm me-1"></span> 讀取鑑定成績中...
            </td>
          </tr>
          <tr v-else-if="extraScores.length === 0">
            <td colspan="3" class="text-center py-3 text-muted fs-7">
              尚無登記其他測驗成績（可選填）
            </td>
          </tr>
          <tr v-for="(item, idx) in extraScores" :key="item.scoreid || idx">
            <td class="fw-semibold">{{ item.testname }}</td>
            <td><span class="badge bg-primary-subtle text-primary fs-7">{{ item.grade }} 分</span></td>
            <td class="text-end">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="handleDeleteScore(item)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <small class="text-muted fs-8">請依學校鑑定項目分別輸入，如要修改請先刪除該項記錄後再重新新增。</small>
    </div>
  </div>
</template>
