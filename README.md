# newklms

這是一個以 CodeIgniter 4 為基礎開發的學校招生／報名管理系統，主要用於處理招生簡章公告、線上報名、考生資料維護、成績查詢與後台管理等流程。

整體專案採用 PHP + Smarty 模板引擎，並以 MVC 架構分離控制器、模型、設定與視圖，適合用於年度招生作業與學生資料管理。

## 專案定位

根據目前專案內容，系統主要涵蓋以下功能：

- 首頁公告與招生資訊展示
- 線上報名流程（報名資料填寫、查詢、資料更新）
- 學生/考生資料管理
- 獲獎紀錄與術科／成績資料維護
- 成績查詢與榜單查閱
- 管理後台：公告、參數設定、學生資料、成績匯入與報表
- 列印相關文件：甄試報名表及附件、自我檢核表、獲獎紀錄表

## 技術棧

- PHP 7.4 / 8.x
- CodeIgniter 4
- Smarty Template Engine
- MySQL / 資料庫驅動
- Google API Client（可能用於外部登入或 API 整合）
- Bootstrap 5 + 自訂 CSS

## 系統架構

```
newklms/
├─ app/
│  ├─ Config/              # 系統設定、路由、資料庫、環境設定
│  ├─ Controllers/         # 控制器：首頁、報名、管理後台、成績查詢
│  ├─ Models/              # 資料模型：參數、公告、學生、成績、獎勵紀錄
│  ├─ Views/               # Smarty 模板檔案
│  ├─ Smarty/              # Smarty 整合與設定
│  ├─ Libraries/           # 擴充函式庫
│  ├─ Helpers/             # 輔助函式
│  ├─ Language/            # 國際化語系檔
│  └─ Oauth2/              # OAuth 整合
├─ public/                  # Web 入口（若部署時指向此目錄）
├─ tests/                   # 測試相關檔案
├─ composer.json            # Composer 設定
├─ composer.lock
├─ env                      # 環境設定範本
├─ LICENSE
├─ README.md
└─ .gitignore
```

## 核心功能模組

### 1. 首頁與公告系統

- `Home` 控制器負責處理首頁與公告內容
- 路由包含：
  - `/`：首頁
  - `/viewnews/:id`：查看公告內容
- 主要功能：
  - 招生期間倒數
  - 公告列表
  - 重要日期提醒
  - 簡章下載入口

### 2. 報名系統

- `app/Controllers/Register/Register.php`
- 路由包含：
  - `/register`：報名入口
  - `/member/auth`：考生查詢/登入
  - `/member/data/:memberid`：考生資料管理
  - `/api/stscore/:stid`、`/api/streward/:stid`：取得資料
- 處理流程包括：
  - 第一步：基本資料驗證與報名建立
  - 第二步：詳細資料更新
  - 成績資料與獲獎紀錄新增／刪除

### 3. 管理後台

- `app/Controllers/Admin/`
- 路由包含：
  - `/admin`：後台儀表板
  - `/admin/news/list`：公告管理
  - `/admin/member/list`：考生名單
  - `/admin/score`：成績管理
  - `/admin/datevars/list`：日期設定
  - `/admin/apps/list`：系統參數設定
- 管理者可進行：
  - 公告新增／編輯／刪除
  - 系統參數調整
  - 招生日期設定
  - 考生資料查詢與匯出
  - 成績資料匯入與管理

### 4. 成績查詢

- `app/Controllers/Score.php`
- 提供考生或管理者查詢成績與榜單
- 對應路由：
  - `/score`
  - `/score/toquery`
  - `/admin/score/query/:id`

### 5. 列印功能

- `app/Views/print/`
- 支援列印項目：
  - 甄試報名表及附件
  - 自我檢核表
  - 獲獎紀錄表
  - 報名資料摘要

## 路由重點

主要路由定義位於：

- `app/Config/Routes.php`

常見路由摘要：

- `/`：首頁
- `/register`：線上報名
- `/member/auth`：報名資料查詢
- `/auth`：後台登入
- `/admin`：管理員入口
- `/score`：成績查詢

## 權限與角色設計

系統的使用者角色主要可分為：

- `guest`：未登入訪客
- `student`：考生
- `admin`：管理者

在 `Home`、`Register`、`Admin` 等控制器中，會依據 `session->usertype` 判斷是否有權限訪問特定功能。

## 典型使用流程

### 旅客／考生流程

1. 進入首頁查看公告與重要日期
2. 透過「線上報名」進入報名系統
3. 填寫考生基本資料與報名資料
4. 取得專屬資料頁面並更新相關資料
5. 查詢報名狀態或列印報名表、檢核表

### 管理者流程

1. 從 `/auth` 登入後台
2. 檢視招生儀表板
3. 管理公告、設定、學生與成績資料
4. 匯出或列印相關報表

## 安裝與啟動

### 1. 安裝依賴

```bash
composer install
```

### 2. 設定環境變數

建立 `.env`，可由 `env` 複製而來：

```bash
cp env .env
```

請確認以下設定：

- `app.baseURL`
- `database.default.hostname`
- `database.default.database`
- `database.default.username`
- `database.default.password`
- `database.default.DBDriver`

### 3. 啟動伺服器

以 CodeIgniter 4 標準方式啟動：

```bash
php spark serve
```

若部署到 Web Server，請將文件根設定到專案的 `public` 目錄（依 CodeIgniter 4 設計）。

## 開發注意事項

- 模板使用 `Smarty`，頁面主要位於 `app/Views/`
- 控制器與資料模型依路由拆分，維護時請遵守 MVC 原則
- 若新增功能，建議同步更新 `app/Config/Routes.php`
- 管理後台具備權限檢查，避免未授權存取

## 版本與維護

目前專案是以 CodeIgniter 4 應用程式骨架為基礎，再依照招生系統需求擴充而成。

若有進一步擴充，建議保留下列原則：

- 保持路由清楚
- 獨立管理各模組資料
- 對報名與成績資料加強驗證
- 定期整理公告、日期條件與權限邏輯

## 授權

本專案使用 MIT License。詳情請見 `LICENSE`。

## 補充說明

這個專案的核心價值在於：

- 將招生流程數位化
- 減少人工資料處理與錯誤
- 提升學校報名與查詢效率
- 提供標準化管理介面與列印功能

如果你需要，我也可以再依據這個專案的實際內容，幫你產出更精緻的「專案簡介版 README」或「部署說明版 README」。
