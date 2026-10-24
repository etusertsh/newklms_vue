<script setup>
import {ref, inject, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import { memberApi } from '../api'
import { showError, showSuccess } from '../utils/swal'

const memberData = inject('memberData',ref({}))
const { sysParams } = storeToRefs(useAppStore())

const createInitialForm2 = () => ({
  id: memberData.value?.id || '',
  memberid: memberData.value?.memberid || '',
  parentfname: memberData.value?.parentfname || '',
  parentfjob: memberData.value?.parentfjob || '',
  email: memberData.value?.email || '',
  stzip: memberData.value?.stzip || '',
  staddr: memberData.value?.staddr || '',
  comzip: memberData.value?.comzip || '',
  comaddr: memberData.value?.comaddr || '',
  ps: memberData.value?.ps || ''
})

const form2 = ref(createInitialForm2())
const errors = ref({})
const loading = ref(false)
const syncCheck = ref(false)

const validateField = (field) => {
    switch(field){
        case 'parentfname':
            if(!form2.value.parentfname.trim()) errors.value.parentfname = '請填寫家長姓名'
            else delete errors.value.parentfname
            break
        case 'parentfjob':
            if(!form2.value.parentfjob) errors.value.parentfjob = '請選擇與考生關係'
            else delete errors.value.parentfjob
            break
        case 'email':
            if (!form2.value.email.trim()){
                errors.value.email = '請填寫電子郵件'
            }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form2.value.email.trim())) {
                errors.value.email = '電子郵件格式不正確！'
            } else {
                delete errors.value.email
            }
            break
        case 'stzip':
            if(!form2.value.stzip.trim()) errors.value.stzip = '請填寫戶籍郵政區號'
            else delete errors.value.stzip
            break
        case 'staddr':
            if(!form2.value.staddr.trim()) errors.value.staddr = '請填寫戶籍地址'
            else delete errors.value.staddr
            break
        case 'comzip':
            if(!form2.value.comzip.trim()) errors.value.comzip = '請填寫通訊郵遞區號'
            else delete errors.value.comzip
            break
        case 'comaddr':
            if(!form2.value.comaddr.trim()) errors.value.comaddr = '請填寫通訊地址'
            else delete errors.value.comaddr
            break
    }
}

const vaildateAll = () => {
    ['parentfname','parentfjob','email','stzip','staddr','comzip','comaddr'].forEach(validateField)
    return Object.keys(errors.value).length === 0
}

// UX 友善：驗證失敗自動平滑捲動至第一個錯處並聚焦
const scrollToFirstError = async () => {
  await nextTick()
  const firstErrorEl = document.querySelector('.is-invalid, .border-danger')
  if (firstErrorEl) {
    firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const focusable = firstErrorEl.querySelector('input, select, textarea') || firstErrorEl
    if (typeof focusable.focus === 'function') focusable.focus({ preventScroll: true })
  }
}

// 表單提交與重置處理

const resetForm = () => {
  form2.value = createInitialForm2()
  errors.value = {}
}

const relations = ['父', '母', '監護人', '其他']

const handleMemberUpdate2 = async () =>{
    if(!vaildateAll()){
        scrollToFirstError()
        return
    }

    loading.value = true

    const payload = {
        id: form2.value.id,
        parentfname: form2.value.parentfname.trim(),
        parentfjob: form2.value.parentfjob,
        email: form2.value.email.trim(),
        stzip: form2.value.stzip.trim(),
        staddr: form2.value.staddr.trim(),
        comzip: form2.value.comzip.trim(),
        comaddr: form2.value.comaddr.trim(),
        ps: form2.value.ps
    }
    try {
        const result = await memberApi.updateStep2(form2.value.memberid, payload)
        if (result && result.success) {
            showSuccess(result.message)
            memberData.value = result.data
        } else {
            showError(result?.message || '更新失敗')
        }
    } catch (err) {
        console.error('Update Step2 Error:', err)
        showError(err.message || '伺服器連線失敗，請稍後再試。')
    } finally {
        loading.value = false
    }
}

const syncFunction = (e) => {    
    syncCheck.value = e.target.checked
    form2.value.comzip = form2.value.stzip
    form2.value.comaddr = form2.value.staddr
}

const syncZip = () => {
    if(syncCheck.value){
        form2.value.comzip = form2.value.stzip
    }
}

const syncAddress = () => {
    if(syncCheck.value){
        form2.value.comaddr = form2.value.staddr
    }
}
</script>
<template>
    <h5 class="form-section-title text-success mb-3">家長與聯絡資訊</h5>
    <form @submit.prevent="handleMemberUpdate2" novalidate>
        <div class="row g-3 mb-3">
            <!-- 家長/監護人姓名 -->
            <div class="col-md-6"> 
                <label class="form-label fw-semibold">家長 / 監護人姓名 <span class="text-danger">*</span></label>
                <input
                    v-model.trim="form2.parentfname"
                    type="text"
                    id="parentfname"
                    @blur="validateField('parentfname')"
                    class="form-control"
                    :class="{ 'is-invalid': errors.parentfname}"
                    placeholder="請輸入家長姓名"
                    autocomplete="off">
                <div class="invalid-feedback">{{ errors.parentfname }}</div>
            </div>
            <!-- 與學生關係 -->
            <div class="col-md-6">
                <label class="form-label fw-semibold">與學生關係 <span class="text-danger">*</span></label>
                <select
                    v-model="form2.parentfjob"
                    @change="validateField('parentfjob')"
                    id="parentfjob"
                    class="form-select"
                    :class="{ 'is-invalid': errors.parentfjob}">
                    <option value="" selected disabled>請選擇關係...</option>
                    <option v-for="aa in relations" :key="aa" :value="aa">{{ aa }}</option>
                </select>
                <div class="invalid-feedback">{{ errors.parentfjob }}</div>                    
            </div>
            <!-- 電子郵件 Email -->
            <div class="col-md-12">
                <label class="form-label fw-semibold">電子郵件 (Email) <span class="text-danger">*</span></label>
                <input
                    type="email"
                    v-model.trim="form2.email"
                    @blur="validateField('email')"
                    id="email"
                    class="form-control font-monospace"
                    :class="{'is-invalid': errors.email}"
                    placeholder="例如：name@example.com"
                    autocomplete="email">
                <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <!-- 戶籍地址標題與欄位 -->
            <div class="col-12 mt-4">
                <label class="form-label fw-semibold text-dark border-bottom pb-1 d-block">戶籍地址 <span class="text-danger">*</span></label>
            </div>
            <div class="col-md-3">
                <input
                    id="stzp"
                    type="text"
                    v-model.trim="form2.stzip"
                    @blur="validateField('stzip')"
                    @change="syncZip"
                    class="form-control font-monospace"
                    :class="{ 'is-invalid': errors.stzip}"
                    placeholder="郵遞區號 (例: 200)"
                    inputmode="numeric">
                <div class="invalid-feedback">{{ errors.stzip }}</div>
            </div>
            <div class="col-md-9">
                <input
                    id="staddr"
                    type="text"
                    v-model.trim="form2.staddr"
                    @blur="validateField('staddr')"
                    @change="syncAddress"
                    class="form-control"
                    :class="{'is-invalid': errors.staddr}"
                    placeholder="請輸入完整戶籍地址">
                <div class="invalid-feedback">{{ errors.staddr }}</div>
            </div>
            <!-- 通訊地址標題與「同戶籍地址」核取方塊 -->
            <div class="col-12 mt-4">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-1">
                    <label class="form-label fw-semibold text-dark mb-0">通訊地址 <span
                            class="text-danger">*</span></label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="same_as_household" @change="syncFunction">
                        <label class="form-check-label fw-semibold text-primary" for="same_as_household"
                            style="cursor: pointer;">
                            同戶籍地址
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <input
                    id="comzip"
                    type="text"
                    v-model.trim="form2.comzip"
                    @blur="validateField('comzip')"
                    class="form-control font-monospace"
                    :class="[errors.comzip ? 'is-invalid' : '', syncCheck ? 'bg-light': '']"                    
                    :readonly="syncCheck"
                    placeholder="郵遞區號 (例: 200)"
                    inputmode="numeric">
                <div class="invalid-feedback">{{ errors.comzip }}</div>
            </div>
            <div class="col-md-9">
                <input
                    id="comaddr"
                    type="text"
                    v-model.trim="form2.comaddr"
                    @blur="validateField('comaddr')"
                    class="form-control"
                    :class="[errors.comzip ? 'is-invalid' : '', syncCheck ? 'bg-light': '']"
                    :readonly="syncCheck"
                    placeholder="請輸入完整通訊地址">
                <div class="invalid-feedback">{{ errors.comaddr }}</div>
            </div>
            <!-- 備註欄位 -->
            <div class="col-12 mt-4">
                <label class="form-label fw-semibold">備註說明</label>
                <textarea 
                    v-model="form2.ps"
                    class="form-control"
                    id="ps"
                    rows="3"
                    placeholder="如有特殊的聯絡時間或照護需求事項，請在此註明"></textarea>
            </div>
        </div>
        <div class="text-end pt-3 border-top">
            <button type="submit" class="btn btn-lg btn-outline-primary px-4 fw-bold" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span><span>{{ loading ? '報名資料傳送中...' : '更新聯絡資料'  }}</span></button>
            <button type="button" class="btn btn-outline-secondary px-4" @click="resetform" :disabled="loading">重填</button>
            <input
                id="id"
                type="hidden"
                v-model="form2.id">
        </div>
    </form>    
</template>