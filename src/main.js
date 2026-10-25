import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { showError } from './utils/swal'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

app.config.errorHandler = (err, instance, info) => {
  //console.error('Uncaught Exception:', err, info)
  showError('發生未捕捉的錯誤，請聯絡系統管理員。', err)
  // 可在此觸發 SweetAlert2 提示或發送 Log 至後端
}