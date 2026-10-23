/**
 * 統一 HTTP 請求客戶端
 * 封裝 fetch、預設 Headers、401 攔截與 JSON 解析
 */

let onUnauthorizedCallback = null

/**
 * 註冊 401 未授權攔截回呼 (供 App.vue 或 Auth 模組呼叫)
 * @param {Function} callback 
 */
export function setUnauthorizedHandler(callback) {
  onUnauthorizedCallback = callback
}

const BASE_PREFIX = '/newklms/api'

/**
 * 核心請求函式
 * @param {string} endpoint 請求路徑 (例如 '/param' 或完整路徑 '/newklms/api/param')
 * @param {RequestInit} options fetch 選項
 * @returns {Promise<any>}
 */
export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') || endpoint.startsWith('/newklms/api')
    ? endpoint
    : `${BASE_PREFIX}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers
  }

  // 若有 body 且非 FormData，預設加上 Content-Type: application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(url, {
      ...options,
      headers
    })
  } catch (networkErr) {
    console.error(`[API Network Error] ${options.method || 'GET'} ${url}:`, networkErr)
    throw new Error('伺服器連線失敗，請檢查網路連線或稍後再試。')
  }

  // 401 未授權處理
  if (response.status === 401) {
    if (typeof onUnauthorizedCallback === 'function') {
      onUnauthorizedCallback()
    }
  }

  // 嘗試解析 JSON
  let data
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch (e) {
      data = null
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || `伺服器回應錯誤 (HTTP ${response.status})`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data !== undefined ? data : response
}

export const http = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' })
  },
  post(endpoint, body = {}, options = {}) {
    const requestBody = body instanceof FormData ? body : JSON.stringify(body)
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: requestBody
    })
  }
}

export default http
