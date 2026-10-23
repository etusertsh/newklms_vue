<script setup>
import { ref, computed, inject } from 'vue'

const dateVars = inject('dateVars', ref({}))
const sysParams = inject('sysParams', ref({}))
const actionYear = computed(() => sysParams.value?.actionyear || '115')

// 日期解析 Helper：將 "2026-03-06 12:00:00" 轉換為 "03/06"
const formatShortDate = (str) => {
  if (!str) return ''
  const match = str.match(/\d{4}-(\d{2})-(\d{2})/)
  return match ? `${match[1]}/${match[2]}` : ''
}

// 動態生成甄試日程列表
const scheduleList = computed(() => {
  const v = dateVars.value || {}

  const sysOpen = formatShortDate(v.system_open)
  const sysEnd = formatShortDate(v.system_end)
  const schOpen = formatShortDate(v.school_open)
  const schEnd = formatShortDate(v.school_end)
  const examDate = formatShortDate(v.exam_date)
  const scoreOpen = formatShortDate(v.score_open)
  const scoreEnd = formatShortDate(v.score_end)

  return [
    {
      dateText: (sysOpen && sysEnd) ? `${sysOpen} - ${sysEnd}` : '03/06 - 03/13',
      title: '線上報名',
      note: '截止日 14:00 關閉系統',
      isPrimary: true
    },
    {
      dateText: (schOpen && schEnd) ? `${schOpen} - ${schEnd}` : '03/09 - 03/13',
      title: '學校現場報名',
      note: '繳交報名資料與查驗',
      isPrimary: false
    },
    {
      dateText: examDate || '03/21',
      title: '甄試測驗',
      note: '地點：本校及各甄試場地',
      isPrimary: false
    },
    {
      dateText: (scoreOpen && scoreEnd) ? `${scoreOpen} - ${scoreEnd}` : '04/07 - 04/30',
      title: '榜單公告及成績查詢',
      note: '08:00 線上查詢開放',
      isPrimary: false
    }
  ]
})
</script>
<template>
  <div class="custom-card p-4 h-100">
    <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
      <span class="material-symbols-outlined text-primary">event_note</span>{{ actionYear }}學年度甄試日程表
    </h5>
    <ul class="list-unstyled position-relative border-start border-2 border-teal ms-2 ps-3 my-2">
      <li 
        v-for="(item, index) in scheduleList" 
        :key="index" 
        class="mb-3 position-relative"
      >
        <span 
          class="position-absolute top-0 start-0 translate-middle p-1 border border-light rounded-circle"
          :class="item.isPrimary ? 'bg-teal' : 'bg-secondary'"
          style="left:-1rem!important; background-color: var(--brand-primary);"
        ></span>
        
        <div class="fw-bold fs-7" :class="item.isPrimary ? 'text-primary' : 'text-muted'">
          {{ item.dateText }}
        </div>
        <div class="fw-semibold">{{ item.title }}</div>
        <small class="text-muted">{{ item.note }}</small>
      </li>
    </ul>
  </div>
</template>