# newklms_vue

基於 Vue 3 與 Vite 建置的體育班甄試線上報名前端，與既有後端 API 整合，提供甄試公告、線上報名、考生資料維護、報名文件下載及成績查詢。

## 目前功能

- **首頁與公告**：顯示學校與甄試資訊、報名簡章連結、最新公告及依後端日期設定產生的甄試日程；可查看公告詳情。
- **線上報名**：依系統設定的報名開放期間提供報名表，驗證考生基本資料並建立報名資料。
- **考生專區**：考生以姓名及身分證字號／居留證號登入，可編輯基本與聯絡資料、管理獲獎及其他測驗紀錄，並下載甄試報名表、家長同意書及相關附件。
- **管理員登入**：提供管理員登入入口；登入成功後前往後端管理頁面。
- **成績查詢**：依開放期間提供甄試成績與錄取結果查詢，使用准考證號碼及身分證字號末四碼驗證，並可列印結果。
- **系統資訊**：從後端載入學年度、學校資訊、報名設定與日期；首頁與報名相關功能依這些設定呈現。

## 頁面路徑

| 路徑 | 功能 |
| --- | --- |
| `/` | 首頁、公告與甄試日程 |
| `/viewnews/:id` | 公告詳情 |
| `/register` | 線上報名 |
| `/memberlogin`、`/member/auth` | 考生登入與報名資料查詢入口 |
| `/memberarea/:memberid`、`/member/data/:memberid` | 考生資料、報名進度及文件下載 |
| `/score` | 甄試成績與錄取結果查詢 |
| `/auth` | 管理員登入 |
| `/about` | 系統說明（內容取自本 README） |

## 技術與需求

- Vue 3（Composition API）、Vue Router 與 Pinia
- Vite
- Bootstrap 5、SweetAlert2
- Node.js `^22.18.0` 或 `>=24.12.0`
- 可連線的甄試系統後端 API

跨頁共用的登入狀態、系統參數與日期設定由 Pinia 的 `useAppStore` 管理；元件可透過 `useAppStore()` 讀取狀態與呼叫更新資料的 actions，響應式狀態解構時使用 Pinia 的 `storeToRefs()`。

## 開發

安裝相依套件：

```sh
npm install
```

啟動本機開發伺服器：

```sh
npm run dev
```

產生正式建置檔：

```sh
npm run build
```

在本機預覽正式建置檔：

```sh
npm run preview
```

## 後端與部署

- API 請求由 `src/api/client.js` 統一處理，預設 API 前綴為 `/newklms/api`。
- Vite 開發伺服器將 `/newklms/api` 代理至 `vite.config.js` 設定的後端主機；連接其他環境時，請更新該代理目標。
- 前端建置的 base path 設為 `/vue/`。部署時請將靜態檔案放在此路徑，並設定網站伺服器將前端頁面路徑回退至 `index.html`，讓 Vue Router 的 history 路由可直接載入。
- 報名、登入、考生資料、公告、系統參數與成績等資料均由後端提供；後端需提供對應 API 與報名文件下載路徑。
- 正式環境 CSP 請由網站伺服器設定 HTTP response header；建議政策與上線檢查請參閱 [CSP 部署指引](./docs/csp.md)。
