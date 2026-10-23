<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: 'create', // 'create' | 'edit'
    validator: (val) => ['create', 'edit'].includes(val)
  },
  skillNotice: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'validate'])

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const onBlur = (field) => {
  emit('validate', field)
}

const onChange = (field) => {
  emit('validate', field)
}

const onStdidInput = (e) => {
  form.value.stdid = e.target.value.toUpperCase()
}
</script>

<template>
  <div>
    <!-- 區塊一：基本個人資料 -->
    <h5 class="form-section-title text-success">基本個人資料</h5>
    <div class="row g-3 mb-4">
      
      <!-- [建立模式] 姓名與性別橫排，身分證字號全寬 -->
      <template v-if="mode === 'create'">
        <!-- 學生姓名 -->
        <div class="col-md-6">
          <label class="form-label fw-semibold" for="stname">學生姓名 <span class="text-danger">*</span></label>
          <input
            type="text"
            id="stname"
            v-model.trim="form.stname"
            @blur="onBlur('stname')"
            class="form-control"
            :class="{ 'is-invalid': errors.stname }"
            placeholder="請輸入學生姓名"
            autocomplete="name"
          >
          <div class="invalid-feedback">{{ errors.stname }}</div>
        </div>

        <!-- 生理性別 -->
        <div class="col-md-6">
          <label class="form-label fw-semibold" for="sex">生理性別 <span class="text-danger">*</span></label>
          <select
            class="form-select"
            id="sex"
            v-model="form.sex"
            @change="onChange('sex')"
            :class="{ 'is-invalid': errors.sex }"
          >
            <option value="" selected disabled>請選擇性別...</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <div class="invalid-feedback">{{ errors.sex }}</div>
        </div>

        <!-- 身分證字號 / 居留證號 -->
        <div class="col-md-12">
          <label class="form-label fw-semibold" for="stdid">身分證字號 / 居留證號 <span class="text-danger">*</span></label>
          <input
            type="text"
            class="form-control text-uppercase font-monospace"
            id="stdid"
            v-model.trim="form.stdid"
            @input="onStdidInput"
            @blur="onBlur('stdid')"
            :class="{ 'is-invalid': errors.stdid }"
            placeholder="例如：A123456789"
            maxlength="10"
            autocomplete="off"
          >
          <div class="form-text">支援本國身分證字號、新式及舊式居留證號。</div>
          <div class="invalid-feedback">{{ errors.stdid }}</div>
        </div>
      </template>

      <!-- [編輯模式] 姓名、身分證唯讀呈現 -->
      <template v-else>
        <!-- 學生姓名 -->
        <div class="col-md-4 col-sm-12">
          <label class="form-label fw-semibold">學生姓名 <span class="text-danger">*</span></label>
          <h5 class="text-secondary">{{ form.stname }}</h5>
        </div>

        <!-- 身分證字號 / 居留證號 -->
        <div class="col-md-4 col-sm-12">
          <label class="form-label fw-semibold">身分證字號 / 居留證號 <span class="text-danger">*</span></label>
          <h5 class="text-primary">{{ form.stdid ? form.stdid.slice(0, 6) : '' }}****</h5>
        </div>

        <!-- 生理性別 -->
        <div class="col-md-4 col-sm-12">
          <label class="form-label fw-semibold" for="sex">生理性別 <span class="text-danger">*</span></label>
          <select
            class="form-select"
            id="sex"
            v-model="form.sex"
            @change="onChange('sex')"
            :class="{ 'is-invalid': errors.sex }"
          >
            <option value="" selected disabled>請選擇性別...</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <div class="invalid-feedback">{{ errors.sex }}</div>
        </div>
      </template>

      <!-- 出生年月日 (數字年 + 下拉月日) -->
      <div class="col-12">
        <label class="form-label fw-semibold">出生年月日 (民國) <span class="text-danger">*</span></label>
        <div class="row g-2">
          <!-- 出生年 (數字欄位) -->
          <div class="col-md-4">
            <div class="input-group" :class="{ 'is-invalid': errors.birth }">
              <span class="input-group-text bg-light text-muted">民國</span>
              <input
                type="number"
                v-model.number="form.birth_yy"
                @blur="onBlur('birth')"
                class="form-control"
                :class="{ 'is-invalid': errors.birth }"
                min="80"
                max="130"
                placeholder="例如：98"
                inputmode="numeric"
              >
              <span class="input-group-text bg-light text-muted">年</span>
            </div>
          </div>
          <!-- 出生月 -->
          <div class="col-6 col-md-4">
            <select
              v-model="form.birth_mm"
              @change="onChange('birth')"
              class="form-select"
              :class="{ 'is-invalid': errors.birth }"
            >
              <option value="" selected disabled>-- 月份 --</option>
              <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ m }} 月</option>
            </select>
          </div>
          <!-- 出生日 -->
          <div class="col-6 col-md-4">
            <select
              v-model="form.birth_dd"
              @change="onChange('birth')"
              class="form-select"
              :class="{ 'is-invalid': errors.birth }"
            >
              <option value="" selected disabled>-- 日期 --</option>
              <option v-for="d in 31" :key="d" :value="String(d).padStart(2, '0')">{{ d }} 日</option>
            </select>
          </div>
          <div v-if="errors.birth" class="text-danger mt-1">{{ errors.birth }}</div>
        </div>
      </div>
    </div>

    <!-- 區塊二：學校與聯絡方式 -->
    <h5 class="form-section-title text-success">學校與聯絡資訊</h5>
    <div class="row g-3 mb-4">
      <!-- 就讀學校 -->
      <div class="col-md-6">
        <label class="form-label fw-semibold" for="primcod">就讀學校 <span class="text-danger">*</span></label>
        <input
          v-model.trim="form.primcod"
          @blur="onBlur('primcod')"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.primcod }"
          id="primcod"
          placeholder="例如：市立OO國民小學"
          autocomplete="off"
        >
        <div class="invalid-feedback">{{ errors.primcod }}</div>
      </div>
      
      <!-- 聯絡電話 -->
      <div class="col-md-6">
        <label class="form-label fw-semibold" for="hometel">聯絡電話 <span class="text-danger">*</span></label>
        <input
          v-model.trim="form.hometel"
          @blur="onBlur('hometel')"
          type="tel"
          class="form-control"
          :class="{ 'is-invalid': errors.hometel }"
          id="hometel"
          placeholder="例如：0912345678 或 02-23456789"
          inputmode="tel"
          autocomplete="tel"
        >
        <div class="invalid-feedback">{{ errors.hometel }}</div>
      </div>
    </div>

    <!-- 區塊三：體能數據 -->
    <h5 class="form-section-title text-success">體能數據</h5>
    <div class="row g-3 mb-4">
      <!-- 身高 -->
      <div class="col-md-6">
        <label class="form-label fw-semibold" for="hh">身高 (cm) <span class="text-danger">*</span></label>
        <div class="input-group">
          <input
            v-model.number="form.hh"
            @blur="onBlur('hh')"    
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.hh }"
            id="hh"
            placeholder="例如：165"
            min="50"
            max="220"
            inputmode="numeric"
          >
          <span class="input-group-text">公分</span>                    
        </div>
        <small class="text-muted">僅可輸入整數</small>
        <div v-if="errors.hh" class="text-danger mt-1">{{ errors.hh }}</div>
      </div>

      <!-- 體重 -->
      <div class="col-md-6">
        <label class="form-label fw-semibold" for="ww">體重 (kg) <span class="text-danger">*</span></label>
        <div class="input-group">
          <input
            v-model.number="form.ww"
            @blur="onBlur('ww')"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.ww }"
            id="ww"
            min="20"
            max="200"
            placeholder="例如：55"
            inputmode="numeric"
          >
          <span class="input-group-text">公斤</span>
        </div>                
        <small class="text-muted">僅可輸入整數</small>
        <div v-if="errors.ww" class="text-danger mt-1">{{ errors.ww }}</div>                
      </div>
    </div>

    <!-- 區塊四：甄試項目 -->
    <h5 class="form-section-title">甄試類別</h5>
    <div class="mb-4">
      <label class="form-label fw-semibold d-block">甄試種類 <span class="text-danger">*</span></label>
      <div class="p-3 border rounded bg-white">
        <div class="form-check mb-0">
          <input
            class="form-check-input"
            :class="{ 'is-invalid': errors.skill }"
            type="radio"
            id="skill"
            :value="form.skill"
            v-model="form.skill"
            @change="onChange('skill')"
            checked
          >
          <label class="form-check-label fw-semibold" for="skill">
            1、民俗體育
          </label>
          <div v-if="errors.skill" class="text-danger mt-1">{{ errors.skill }}</div>
        </div>
      </div>
      <small v-if="skillNotice" class="text-muted">{{ skillNotice }}</small>
    </div>
  </div>
</template>
