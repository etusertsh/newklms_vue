import { nextTick } from 'vue'

/**
 * 考生第一階段基本資料表單管理 Composable
 */
export function useStudentForm() {
  /**
   * 建立空白或預設表單物件
   * @param {object} initialData 
   * @param {string} defaultYear 
   */
  const createInitialForm = (initialData = {}, defaultYear = '115') => ({
    stname: initialData.stname || '',
    stdid: initialData.stdid || '',
    serialnum: initialData.serialnum || '',
    unique_num: initialData.memberid || initialData.unique_num || '',
    sex: initialData.sex || '',
    birth_yy: '',
    birth_mm: '',
    birth_dd: '',
    primcod: initialData.primcod || '',
    hometel: initialData.hometel || '',
    hh: initialData.hh || '',
    ww: initialData.ww || '',
    skill: initialData.skill || '民俗體育',
    year: initialData.year || defaultYear
  })

  /**
   * 將 ISO 日期字串 (YYYY-MM-DD) 解析為民國年月日
   * @param {string} isoDateStr 
   * @param {object} formObj 
   */
  const parseIsoToRoc = (isoDateStr, formObj) => {
    if (!isoDateStr || !/^\d{4}-\d{2}-\d{2}/.test(isoDateStr)) return
    const [adYear, month, day] = isoDateStr.split('-')
    const rocYear = parseInt(adYear, 10) - 1911

    if (rocYear > 0 && formObj) {
      formObj.birth_yy = String(rocYear)
      formObj.birth_mm = String(month).padStart(2, '0')
      formObj.birth_dd = String(day).padStart(2, '0')
    }
  }

  /**
   * 將民國年月日組合為 ISO 格式 (YYYY-MM-DD)
   * @param {string|number} yy 
   * @param {string|number} mm 
   * @param {string|number} dd 
   */
  const rocToIso = (yy, mm, dd) => {
    const adYear = parseInt(yy, 10) + 1911
    const mmStr = String(mm).padStart(2, '0')
    const ddStr = String(dd).padStart(2, '0')
    return `${adYear}-${mmStr}-${ddStr}`
  }

  /**
   * 單一欄位驗證
   * @param {string} field 
   * @param {object} form 
   * @param {object} errors 
   * @param {boolean} isCreate 是否為初次報名建立模式 (需驗證姓名與身分證)
   */
  const validateField = (field, form, errors, isCreate = false) => {
    switch (field) {
      case 'stname':
        if (isCreate) {
          if (!form.stname || !form.stname.trim()) errors.stname = '請填寫學生姓名'
          else delete errors.stname
        }
        break
      case 'stdid':
        if (isCreate) {
          const id = form.stdid ? form.stdid.trim().toUpperCase() : ''
          if (!id) {
            errors.stdid = '請填寫身分證字號或居留證號！'
          } else if (!/^[A-Z][1289A-D]\d{8}$/.test(id)) {
            errors.stdid = '身分證或居留證格式不正確（例如：A123456789）！'
          } else {
            delete errors.stdid
          }
        }
        break
      case 'sex':
        if (!form.sex) errors.sex = '請選擇生理性別'
        else delete errors.sex
        break
      case 'birth':
        if (!form.birth_yy || !form.birth_mm || !form.birth_dd) {
          errors.birth = '請完整填寫出生年、月、日'
        } else {
          delete errors.birth
        }
        break
      case 'primcod':
        if (!form.primcod || !form.primcod.trim()) errors.primcod = '請填寫畢業國小'
        else delete errors.primcod
        break
      case 'hometel': {
        const phone = form.hometel ? form.hometel.trim() : ''
        if (!phone) {
          errors.hometel = '請填寫聯絡電話'
        } else if (!/^09\d{8}$|^0\d{1,2}-?\d{6,8}$/.test(phone)) {
          errors.hometel = '請輸入正確的手機號碼 (09xx...) 或市話'
        } else {
          delete errors.hometel
        }
        break
      }
      case 'hh':
        if (!form.hh || parseInt(form.hh, 10) <= 0) errors.hh = '請填寫身高 (cm)'
        else delete errors.hh
        break
      case 'ww':
        if (!form.ww || parseInt(form.ww, 10) <= 0) errors.ww = '請填寫體重 (kg)'
        else delete errors.ww
        break
      case 'skill':
        if (!form.skill) errors.skill = '請選擇甄試種類'
        else delete errors.skill
        break
    }
  }

  /**
   * 全部欄位驗證
   * @param {object} form 
   * @param {object} errors 
   * @param {boolean} isCreate 
   * @returns {boolean}
   */
  const validateAll = (form, errors, isCreate = false) => {
    const fields = isCreate
      ? ['stname', 'stdid', 'sex', 'birth', 'primcod', 'hometel', 'hh', 'ww', 'skill']
      : ['sex', 'birth', 'primcod', 'hometel', 'hh', 'ww', 'skill']

    fields.forEach((f) => validateField(f, form, errors, isCreate))
    return Object.keys(errors).length === 0
  }

  /**
   * UX 友善：驗證失敗自動平滑捲動至第一個錯誤欄位並聚焦
   */
  const scrollToFirstError = async () => {
    await nextTick()
    const firstErrorEl = document.querySelector('.is-invalid, .border-danger')
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusable = firstErrorEl.querySelector('input, select, textarea') || firstErrorEl
      if (typeof focusable?.focus === 'function') focusable.focus({ preventScroll: true })
    }
  }

  /**
   * 轉換為後端 Step1 API 格式 payload
   * @param {object} form 
   */
  const toStep1Payload = (form) => {
    const isoBirthdate = rocToIso(form.birth_yy, form.birth_mm, form.birth_dd)
    const payload = {
      unique_num: form.unique_num || undefined,
      sex: form.sex,
      birthdate: isoBirthdate,
      primcod: form.primcod?.trim(),
      hometel: form.hometel?.trim(),
      hh: String(form.hh),
      ww: String(form.ww),
      skill: form.skill,
      year: form.year
    }

    if (form.stname) {
      payload.stname = form.stname.trim()
    }
    if (form.stdid) {
      payload.stdid = form.stdid.trim().toUpperCase()
    }

    return payload
  }

  return {
    createInitialForm,
    parseIsoToRoc,
    rocToIso,
    validateField,
    validateAll,
    scrollToFirstError,
    toStep1Payload
  }
}

export default useStudentForm
