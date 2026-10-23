<script setup>
import { ref, onMounted, inject, computed, provide} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { memberApi } from '../api'
import RegisterTopNav from '../components/RegisterTopNav.vue'
import MemberForm1 from '../components/MemberForm1.vue'
import MemberForm2 from '../components/MemberForm2.vue'
import MemberForm3 from '../components/MemberForm3.vue'
import MemberForm4 from '../components/MemberForm4.vue'

const route = useRoute()
const router = useRouter()

const memberData = ref({})
const loading = ref(true)
const error = ref(null)
const memberId = ref(route.params.memberid || null)

const registerStep = computed(() => {
    return Number(memberData.value?.step || 0) + 1
})

const sysParams = inject('sysParams', ref({}))
const auth = inject('auth', ref({ isLoggedIn: false, user: null, isReady: false }))
const checkAuth = inject('checkAuth', null)

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

    // 4. 讀取考生會員資料
    await fetchMemberdata(memberId.value)
}

provide('memberData', memberData)
provide('fetchMemberdata', fetchMemberdata)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ path: '/', hash: '#announce' })
  }
}

onMounted(() => {
    verifyAuthAndLoad()
})
</script>

<template>
    <section class="page-view active">
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">載入中...</span>
            </div>
            <p class="text-muted mt-2 fs-7">正在讀取考生報名資料...</p>
        </div>

        <!-- 2. 錯誤訊息 -->
        <div v-else-if="error" class="alert alert-warning my-4" role="alert">
            {{ error }}
            <button @click="goBack" class="btn btn-outline-secondary btn-sm ms-2">返回</button>
        </div>
        <div v-else-if="memberData" class="custom-card p-4 max-w-3xl mx-auto">
            <h4 class="fw-bold text-center mb-1">{{ sysParams.actionyear}} 學年度{{ sysParams.sitename}}報名</h4>
            <RegisterTopNav :register-step="registerStep" />
            <p class="mb-0 opacity-75 fs-6">請切換下方頁籤完成各階段報名資料填寫</p>
            <!-- 頁籤導覽按鈕 (Tabs Navigation) -->
            <ul class="nav nav-pills nav-justified" id="registrationTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link py-3" :class="{ 'active': registerStep == 1 }" id="basic-tab" data-bs-toggle="tab"
                        data-bs-target="#basic-pane" type="button" role="tab" aria-controls="basic-pane"
                        :aria-selected="{'true':registerStep == 1 }">
                        1. 基本資料
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link py-3" :class="{ 'active': registerStep == 2 }" id="parent-tab" data-bs-toggle="tab"
                        data-bs-target="#parent-pane" type="button" role="tab" aria-controls="parent-pane"
                        :aria-selected="{ 'true':registerStep == 2 }">
                        2. 其他連絡資料
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link py-3" id="proof-tab" data-bs-toggle="tab" data-bs-target="#proof-pane" type="button"
                        role="tab" aria-controls="proof-pane" aria-selected="false">
                        3. 獲獎與測驗紀錄
                    </button>
                </li>
                <li v-if="registerStep >= 3" class="nav-item" role="presentation">
                    <button class="nav-link active py-3" id="document-tab" data-bs-toggle="tab" data-bs-target="#document-pane"
                        type="button" role="tab" aria-controls="document-pane" aria-selected="true">
                        文件下載
                    </button>
                </li>
            </ul>
            <div class="tab-content" id="registrationTabsContent">
                <div class="tab-pane fade tab-pane-card shadow-sm" :class="{'show active': registerStep == 1}" id="basic-pane"
        role="tabpanel" aria-labelledby="basic-tab">
                    <MemberForm1 />
                </div>
                <div class="tab-pane fade tab-pane-card shadow-sm" :class="{'active show': registerStep == 2}" id="parent-pane"
        role="tabpanel" aria-labelledby="parent-tab">
                    <MemberForm2 />
                </div>
                <div class="tab-pane fade tab-pane-card shadow-sm" id="proof-pane" role="tabpanel" aria-labelledby="proof-tab">
                    <MemberForm3 />
                </div>
                <div v-if="registerStep >= 3" class="tab-pane fade show active tab-pane-card shadow-sm" id="document-pane" role="tabpanel"
            aria-labelledby="document-tab">                
                    <MemberForm4 />
                </div>
            </div>
        </div>
    </section>
</template>