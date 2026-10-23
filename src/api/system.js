import http from './client'

/**
 * 系統參數與公告 API 模組
 */
export const systemApi = {
  /**
   * 取得系統全域參數設定
   */
  getSystemParams() {
    return http.get('/param')
  },

  /**
   * 取得日程與開放時間設定
   */
  getDateVars() {
    return http.get('/datevars')
  },

  /**
   * 取得最新公告列表
   */
  getNewsList() {
    return http.get('/news')
  },

  /**
   * 取得指定公告詳細內容
   * @param {string|number} id 公告 ID
   */
  getNewsDetail(id) {
    return http.get(`/viewnews/${id}`)
  }
}

export default systemApi
