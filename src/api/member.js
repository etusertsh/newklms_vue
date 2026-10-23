import http from './client'

/**
 * 會員報名與資料維護 API 模組
 */
export const memberApi = {
  /**
   * 取得指定會員資料
   * @param {string} memberId 
   */
  getMemberData(memberId) {
    return http.get(`/member/data/${memberId}`)
  },

  /**
   * 更新或初次填寫第一階段資料 (個人基本資料)
   * @param {object} payload 
   */
  updateStep1(payload) {
    return http.post('/register/updatestep1', { payload })
  },

  /**
   * 更新第二階段資料 (家長與通訊資料)
   * @param {string} memberId 
   * @param {object} payload 
   */
  updateStep2(memberId, payload) {
    return http.post(`/register/updatestep2/${memberId}`, { payload })
  },

  /**
   * 取得學生獲獎紀錄列表
   * @param {number|string} studentId 
   */
  getRewards(studentId) {
    return http.get(`/streward/${studentId}`)
  },

  /**
   * 新增學生獲獎紀錄
   * @param {number|string} studentId 
   * @param {{ category: string, rewardname: string, rewardrank: string }} payload 
   */
  addReward(studentId, payload) {
    return http.post(`/add/streward/${studentId}`, payload)
  },

  /**
   * 刪除學生獲獎紀錄
   * @param {number|string} rewardId 
   */
  deleteReward(rewardId) {
    return http.get(`/delete/streward/${rewardId}`)
  },

  /**
   * 取得學生其他測驗鑑定成績列表
   * @param {number|string} studentId 
   */
  getScores(studentId) {
    return http.get(`/stscore/${studentId}`)
  },

  /**
   * 新增學生其他測驗鑑定成績
   * @param {number|string} studentId 
   * @param {{ testname: string, grade: number|string }} payload 
   */
  addScore(studentId, payload) {
    return http.post(`/add/stscore/${studentId}`, payload)
  },

  /**
   * 刪除學生其他測驗鑑定成績
   * @param {number|string} scoreId 
   */
  deleteScore(scoreId) {
    return http.get(`/delete/stscore/${scoreId}`)
  }
}

export default memberApi
