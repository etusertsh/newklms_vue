<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { memberApi } from '../api'
import { showError } from '../utils/swal'
import RegisterChecklist from '../components/RegisterChecklist.vue'
import MemberRewardScore from '../components/MemberRewardscore.vue'

const router = useRouter()
const route = useRoute()

const memberData = ref({})
const loading = ref(true)
const error = ref(null)
const docType = ref(route.params.doctype || null)
const memberId = ref(route.params.memberid || null)

const appStore = useAppStore()
const { auth } = storeToRefs(appStore)
const { checkAuth } = appStore

const fetchMemberdata = async (thememberid) => {
    loading.value = true
    error.value = null

    try {
        const data = await memberApi.getMemberData(thememberid)
        if (data && data.success) {
           memberData.value = data.data || null  
        } else {
            error.value = data?.message || '無法讀取資料'
            if (data?.message?.includes('無權限')) {
                router.push('/member/auth')
            }
        }      
    } catch (err) {
        console.error('Fetch Member Data Error:', err)
        error.value = err.message || '無法載入考生資料，請稍後再試。'
    } finally {
        loading.value = false
    }
}

// 權限檢核與資料讀取流程
const verifyAuthAndLoad = async () => {
    loading.value = true
    error.value = null

    // 1. 若尚未確認伺服器登入狀態，主動呼叫 checkAuth 等待驗證
    if (!auth.value?.isReady && typeof checkAuth === 'function') {
        await checkAuth()
    }

    const currentUser = auth.value?.user
    const userType = currentUser?.usertype

    // 2. 權限檢核：未登入或身分非 admin 也非 student，導回報名查詢登入頁
    if (!userType || (userType !== 'admin' && userType !== 'student')) {
        console.warn('[MemberareaView] 尚未登入或無權限，導向登入查詢頁面')
        router.push('/member/auth')
        return
    }

    // 3. 學生身分強制使用登入之 memberid，防止網址參數被竄改存取他人資料
    if (userType === 'student' && currentUser?.memberid) {
        memberId.value = currentUser.memberid
    }

    if (!memberId.value) {
        router.push('/member/auth')
        return
    }

    if(!docType.value || !['rewardsocre', 'checklist'].includes(docType.value)) {
        showError('無效的文件類型，請確認網址是否正確。')
        goBack()
        return  
    }

    // 4. 讀取考生會員資料
    await fetchMemberdata(memberId.value)
}
provide('memberData', memberData)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ path: '/', hash: '#announce' })
  }
}

const triggerPrint = () => {
  window.print()
}

onMounted(() => {
    verifyAuthAndLoad()
})
</script>

<template>
    <section class="printable-container py-4">
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">資料讀取中，請稍候...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <div v-else class="result-container mx-auto" style="max-width: 800px;">
            <!-- 頂部操作按鈕列 (列印時會被隱藏) -->
            <div class="d-flex justify-content-between align-items-center mb-4 no-print">
                <button @click="goBack" class="btn btn-outline-secondary d-flex align-items-center gap-1">
                ← 返回
                </button>
                <button @click="triggerPrint" class="btn btn-primary px-4 fw-bold d-flex align-items-center gap-1">
                🖨️ 列印
                </button>
            </div>
            <component :is="docType === 'checklist' ? RegisterChecklist : MemberRewardScore" />
        </div>
    </section>
</template>