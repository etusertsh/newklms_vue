# Content Security Policy (CSP)

## 部署方式

正式環境請由網站伺服器對 HTML 文件回應設定 CSP HTTP header。不要只在 `index.html` 加入 `<meta http-equiv>`：meta 方式無法設定 `frame-ancestors`，也不適合正式環境的報告與部署管理。此專案沒有包含正式環境 Web Server 設定檔，請將下方 header 加到實際提供 `/vue/` 的伺服器設定。

先以 `Content-Security-Policy-Report-Only` 觀察實際頁面並檢查瀏覽器 Console 的違規訊息；確認必要資源均已列入後，再將 header 名稱改為 `Content-Security-Policy`。目前沒有設定 CSP 報告收集端點。

## 建議起始策略

以下值以專案目前的 HTML 外部資源、API 路徑和 Vue 樣式使用方式為基礎：

```http
Content-Security-Policy-Report-Only: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src-attr 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; img-src 'self' data: https://etuser2.hopto.org; connect-src 'self'
```

確認沒有非預期違規後，將 header 名稱改為 `Content-Security-Policy`，並在正式站測試所有頁面及功能。

## 來源說明與注意事項

- `script-src`：允許同源 Vite 建置檔及目前由 jsDelivr 載入的 Bootstrap Bundle。
- `style-src`：允許同源樣式、jsDelivr Bootstrap CSS 及 Google Fonts CSS。
- `style-src-attr 'unsafe-inline'`：目前 Vue 範本有靜態及動態 `style` 屬性，需暫時允許 inline style attributes。這不會允許 inline `<script>`；日後可將範本樣式移至 class，進一步收緊政策。
- `font-src`：允許 Google Fonts 的 `fonts.gstatic.com` 字型檔、jsDelivr 字型資源，以及可能使用的 data URI。
- `img-src`：允許同源與 data URI 圖片；公告本文由後端 HTML 渲染，已知後端主機 `etuser2.hopto.org` 暫列為圖片來源。若公告圖片使用其他主機，請先確認該主機可信，再精確加入來源，不建議直接放寬為任意 `https:`。
- `connect-src 'self'`：API 呼叫使用相對路徑 `/newklms/api`，正式環境需由同源提供或反向代理。若實際部署改為跨來源 API，請只加入該 API 的確切 HTTPS origin。
- `base-uri`、`object-src`、`frame-ancestors`、`form-action`：限制基底 URL、外掛物件、誰能嵌入本站及表單送出位置。

## 上線前檢查

1. 確認正式站使用 HTTPS；確認後可視需要加入 `upgrade-insecure-requests`。
2. 用 Report-Only 測試首頁、公告詳情（含公告圖片）、報名、登入、成績查詢與文件下載，並檢查 Console 的 CSP 違規。
3. 如果公告內含 iframe、影片或其他外部媒體，依實際可信來源增補 `frame-src` 或 `media-src`，不要以 `default-src *` 放寬。
4. `v-html="news.body"` 的內容應由後端清理不可信 HTML；CSP 是縱深防禦，不能取代 HTML sanitization。
5. 驗證完成後啟用強制政策，再監控登入、API 與文件下載等流程。

`vite-plugin-vue-devtools` 及 Vite 開發伺服器可能使用與正式建置不同的連線或資源；此政策是正式環境的起始設定，不應直接套用到開發伺服器。
