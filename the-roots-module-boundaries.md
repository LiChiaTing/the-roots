# The Roots — 模組邊界釐清 (Module Boundaries Design Doc)

> **狀態**：v1 草稿　|　**日期**：2026-05-20　|　**目的**：解決 v.1 IA 中「模組職責曖昧 + Quest 內部黑盒」兩大設計張力，作為後續 Quest anatomy 設計與 Apify 整合的基礎。

---

## 核心心法：Journey 是脊椎，其他模組是它的器官

原 IA 把 Journey / Guide / Kit / Circles 設計為**並列五個 tab**，視覺對稱漂亮，但並列暗示「四個是平等的目的地」，造成功能邊界曖昧。

新心智模型：
- **Journey 是學習產品的主動脈**，所有結構化內容都在這裡
- **Guide / Kit / Circles 是服務層**，存在的目的是讓 Quest 走得通
- **導航上保留 5 tab**（讓有急用的人可以直達），但**內容邏輯上 Journey 是主，其他是僕**

```
🧭 Home  →  「我現在站在哪？」（儀表板）
🗺️ Journey  →  「我該往哪走？」（脊椎，所有內容的容器）
        ├── 內嵌 🏥 Guide 服務   (找誰幫忙)
        ├── 內嵌 🆘 Kit 工具     (當下用得到的東西)
        └── 內嵌 💬 Circles 智慧 (別人怎麼做)

(同時保留三個獨立入口，給「我現在就有急用」的場景)
```

---

## 每個模組的「唯一職責」

### 🧭 Home — 「我現在站在哪？」
- **唯一職責**：在 0 秒內告訴用戶「下一步該做什麼」
- **擁有什麼**：什麼都不擁有 — 它是 Journey + Profile + Circles 的策展視圖
- **絕不擁有**：任何詳細內容、任何長文、任何決策樹
- **設計原則**：Home 永遠只顯示「3 件事 + 1 個進度環」，多了就違反職責

### 🗺️ Journey — 「我該往哪走？」（脊椎）
- **唯一職責**：提供結構化的學習進度 + **每個 quest 的完整內容**
- **擁有什麼**：5 階段地圖、所有 quest 詳情頁（Why / What / How / Done 全在這）
- **可以內嵌**：Guide 的醫師清單、Kit 的對話卡、Circles 的相關問答
- **絕不擁有**：商家目錄本身、緊急工具的原始資料庫（這些屬於 Guide/Kit）
- **設計原則**：Journey 是「路線圖 + 路書」，不是只有路線圖

### 🏥 Guide — 「我該找誰？」
- **唯一職責**：人/機構的目錄與媒合（醫生、律師、財務顧問、社區組織）
- **擁有什麼**：可搜尋目錄、語言篩選、距離排序、保險解碼器
- **兩種被使用方式**：
  - **內嵌**（最常見）：從 Journey 某 quest 點「找附近的人」拉出 Guide 結果
  - **獨立入口**：用戶當下就有需求（「我現在生病了」），直接從 tab 進入
- **絕不擁有**：學習內容、任務進度、「該不該找醫生」的決策邏輯（那是 Journey）

### 💬 Circles — 「別人怎麼做？」
- **唯一職責**：社群智慧層 — Q&A + 信任徽章
- **擁有什麼**：問題、答案、投票、語言篩選、州別標籤、來源徽章（Official / Community / Verified）
- **兩種被使用方式**：
  - **內嵌**：每個 quest 詳情頁底部顯示「Top 3 questions on this」
  - **獨立入口**：用戶想閒逛、想看別人怎麼想
- **絕不擁有**：官方說明、step-by-step 教學（那是 Journey 的事）

### 🆘 Kit — 「我現在馬上要用」
- **唯一職責**：高壓力場景下零學習門檻的即時工具
- **擁有什麼**：緊急卡（含語音播放）、症狀選擇器、Phrase Cards、文件保險庫
- **兩種被使用方式**：
  - **內嵌**：相關 quest 自動帶出對應 Phrase Card（例如「開戶」quest 自動掛上「銀行 phrase card」）
  - **獨立入口**：永遠最顯眼，絕對不可以藏起來——因為它是救命的
- **絕不擁有**：教學內容、選擇邏輯、長文章

### 👤 Profile — 「我的脈絡」
- **唯一職責**：儲存讓整個 app 個人化的脈絡資料
- **擁有什麼**：簽證身份、語言、州別、抵美日期、已完成 quest 紀錄
- **被誰讀取**：所有其他模組 — 它是個人化的引擎
- **絕不擁有**：任何用戶看得到的內容（它是後端式的存在）

---

## 跨模組導航的 3 條規則

### 規則 1：Journey 對外是「拉」，不是「跳」
從 Journey 的 quest 詳情頁，你看到醫師清單、phrase card、相關問答，**用戶不離開 quest 頁**——這些都是內嵌呈現的。要「跳走」才到完整的 Guide / Kit / Circles tab。

👉 **設計實作**：用 Sheet / Drawer / Modal，而不是 page navigation。

### 規則 2：獨立入口永遠提供「回到 Journey」的捷徑
用戶從 Guide tab 找完醫生後，畫面要主動問「要不要把『找 PCP』這個 quest 標記為完成？」——把意外行為串回主動脈。

👉 **設計實作**：每個獨立入口的成功頁都有「✓ Mark related quest as done」按鈕。

### 規則 3：Kit 是唯一「全域常駐」的模組
其他 tab 可以在 quest 沉浸體驗時隱藏 nav，但 Kit 永遠一鍵可達（建議 floating action button 或永久底部欄按鈕）。因為它是緊急工具，緊急時你不想找它。

👉 **設計實作**：Kit 的緊急卡 + 症狀選擇器要從 home screen 一個動作內可達。

---

## 範例：「Find a Primary Care Doctor」quest 怎麼跑

```
[Journey Tab → Stage 2 → Quest: Find a Primary Care Doctor]
│
├── 📍 Why this matters          (靜態內容，Journey 自己擁有)
│   「在美國，沒有 PCP = 小病只能跑 ER = 帳單破千鎂」
│
├── 🧠 What you need to know     (靜態內容)
│   - 什麼是 PCP / In-network / Copay
│   - 為什麼要先有保險才找
│
├── 📋 Your options              (動態內容 — 內嵌 Guide)
│   [按州+語言過濾的 PCP 清單，由 Guide 提供]
│   👆 Apify 介入的關鍵節點
│
├── ✅ Documents you need        (靜態 checklist)
│
├── 💬 What others are asking    (內嵌 Circles)
│   - "How long does it take to get the first appt?"
│   - "Can I switch PCP later?"
│
├── 🆘 Phrase Card               (內嵌 Kit)
│   [Bank/Doctor/DMV phrase card 之 Doctor 版，含語音]
│
└── [✓ Mark this quest done]  →  下一個 quest 自動解鎖
```

**用戶體驗**：他完全不需要跳出 quest 頁就能完成「了解 → 選擇 → 預約 → 對話」全流程。Guide/Kit/Circles 像配菜，Quest 是主菜。

---

## 這套切法解了什麼

| 原本的問題 | 切完之後 |
|---|---|
| 模組邊界曖昧、重複內容歸誰不清 | 每個模組一句話職責，重複內容歸屬一目了然 |
| Quest 內部是黑盒、不知道要塞什麼 | 接下來只要設計 6 個欄位的 Quest anatomy 模板，套用到所有 quest |
| 新增 quest / 新增功能時容易迷路 | 有 spine vs services 的心智地圖可循 |

---

## Next Steps

- **B. 設計單一 Quest 的內部 anatomy**：把上面範例的 6 個欄位（Why / What / Options / Documents / Circles / Phrase）正式定義成模板
- **C. 列出 Stage 1+2 每個 quest 的「靜態 vs 動態」資訊清單**：為 Apify 整合鋪路
- **D. 動態資訊對應 Apify Actor + 學習路線圖**：把 The Roots 變成學 Apify 的 sandbox
