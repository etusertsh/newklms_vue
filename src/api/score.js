import http from './client'

/**
 * 成績查詢 API 模組
 */
export const scoreApi = {
  /**
   * 查詢甄試成績與錄取結果
   * @param {string} year 學年度
   * @param {string} idnumber 准考證號碼 (6 位數)
   * @param {string} uid 身分證字號後 4 碼
   */
  queryScore(year, idnumber, uid) {
    return http.post('/score/toquery', {
      year,
      idnumber,
      uid
    })
  }
}

export default scoreApi
