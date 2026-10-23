import http from './client'

/**
 * 認證相關 API 模組
 */
export const authApi = {
  /**
   * 檢查當前使用者的登入 Session
   */
  checkAuthMe() {
    return http.get('/auth/me')
  },

  /**
   * 後台管理員登入
   * @param {string} username 
   * @param {string} password 
   */
  adminLogin(username, password) {
    return http.post('/auth/login', {
      admin_user: username,
      admin_pass: password
    })
  },

  /**
   * 考生會員登入 (姓名 + 身分證字號)
   * @param {string} year 學年度
   * @param {string} stname 學生姓名
   * @param {string} stdid 身分證字號 / 居留證號
   */
  memberLogin(year, stname, stdid) {
    return http.post('/member/auth/login', {
      year,
      stname,
      stdid
    })
  }
}

export default authApi
