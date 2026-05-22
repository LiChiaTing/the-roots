# The Roots — Stage 1 靜態 vs 動態資訊清單

> **狀態**：v1　|　**日期**：2026-05-20　|　**前置文件**：[Quest Anatomy](the-roots-quest-anatomy.md)
> **目的**：拆解 Stage 1（Land Safely）5 個 quest 的內容需求，標記靜態（寫一次）與動態（Apify 抓取）。輸出 Apify 學習路線圖。

---

## TL;DR — 一句話結論

**Stage 1 五個 quest 的所有動態資訊只需要 4 種 Apify 抓取模式，學會最前面兩種就 cover 80%。**

| 優先 | 模式 | Actor | Cover 哪幾個 quest |
|---|---|---|---|
| 🥇 第一個學 | 在地商家清單 | `apify/google-maps-scraper` | Q1.1, Q1.2, Q1.4, Q1.5 |
| 🥈 第二個學 | 機構網站抽內容 | `apify/website-content-crawler` | 全部 5 個 |
| 🥉 之後 | 房地產 listings | `apify/zillow-scraper` 等 | Q1.3 |
| 🥉 之後 | 社群論壇 Q&A | `apify/reddit-scraper` 等 | 全部 5 個 |

---

## 各 Quest 詳細清單

### Quest 1.1 — Get a local phone number

**Type:** Action（含對話）

**靜態：** Why · Cost · Prepaid/Postpaid/MVNO · Red flags · 文件 · How · Phone store 對話 rehearsal

**動態（Apify）：**

| 欄位 | 抓什麼 | 來源 | TTL |
|---|---|---|---|
| #6 Options | 附近電信門市 | Google Maps | 24 hr |
| #6 Plans | 各 carrier prepaid 方案價格 | Carrier 官網 | 7 days |
| #10 Circles | 移民選 plan 經驗 | Reddit | 24 hr |

---

### Quest 1.2 — Open a Checking Account

**Type:** Action

**靜態：** Why · Cost · Checking/Savings 差異 · SSN 迷思 · Red flags · 文件 · How · 銀行對話 rehearsal

**動態（Apify）：**

| 欄位 | 抓什麼 | 來源 | TTL |
|---|---|---|---|
| #6 Options | 用戶州內銀行 + ITIN 政策 + 條件 | 銀行官網 + Google Maps | 24 hr |
| #10 Circles | 移民開戶 Q&A | Reddit + 中文論壇 | 24 hr |

---

### Quest 1.3 — Secure Housing

**Type:** Action（範圍最大，未來可拆 sub-quest）

**靜態：** Why · Cost · Lease 條款 · Security deposit · 大量 Red flags · 文件 · How · 看屋 + 簽約對話 rehearsal

**動態（這 quest 最依賴 Apify）：**

| 欄位 | 抓什麼 | 來源 | TTL |
|---|---|---|---|
| #6 Listings | 城市/預算/房型過濾的房源 | Zillow / Apartments.com | **6 hr** |
| #4 Tenant rights | 各州租客權利條文 | 州 .gov 網站 | 30 days |
| #6 Sub | 附近學校/超市/治安 | Google Maps + 公開資料 | 7 days |
| #10 Circles | 該城市房屋詐騙警示 | Reddit 城市子版 | 24 hr |

---

### Quest 1.4 — Apply for SSN / ITIN

**Type:** Action

**靜態：** Why · 完全免費（**警惕付費代辦詐騙**）· SSN/ITIN 差異 · 文件 · How · SSA 訪問對話 rehearsal

**動態（Apify）：**

| 欄位 | 抓什麼 | 來源 | TTL |
|---|---|---|---|
| #6 Options | 用戶州 SSA 辦公室 + 預約連結 | ssa.gov + Google Maps | 7 days |
| #4 Processing times | 當前處理時間 | ssa.gov + irs.gov | 7 days |
| #10 Circles | 各分局等待經驗 | 移民論壇 | 24 hr |

---

### Quest 1.5 — Set up Emergency Card

**Type:** Action（多為 app 內設定）

**靜態：** Why · 免費 · 911/211/988/Poison Control 差別 · Red flags · 應填內容 · How · **911 call rehearsal** (關鍵)

**動態（Apify）：**

| 欄位 | 抓什麼 | 來源 | TTL |
|---|---|---|---|
| #6 Local hotlines | 各州/市 211 等地方號碼 | 211.org + 各州 .gov | 30 days |
| #6 Nearest ER/UC | 附近 ER + urgent care + 接受保險 | Google Maps | 24 hr |

---

## Apify 學習路線圖（直接連到 D）

### 🥇 第一週：master `apify/google-maps-scraper`
- **為什麼第一個學**：覆蓋 4 個 quest，學成 ROI 最高
- **可實作目標**：給定（用戶州 + 關鍵字）→ 抓出附近銀行/電信門市/SSA 辦公室
- **預期產出**：The Roots Stage 1 中所有「附近的 X」欄位都能即時跑

### 🥈 第二週：master `apify/website-content-crawler`
- **為什麼第二個學**：抓政府/銀行/carrier 官網的靜態說明頁
- **可實作目標**：給定 URL → 抓出乾淨 markdown → 餵 Claude 翻譯成用戶母語
- **預期產出**：Q1.4 USCIS 處理時間、Q1.3 各州租客權利、Q1.2 銀行 ITIN 政策

### 🥉 第三週起：依興趣選擇
- 對 Q1.3 housing 認真 → 學 Zillow Scraper
- 對 Circles 內容認真 → 學 Reddit/論壇 scraper
- 對多語言展示認真 → 學 Claude API streaming + i18n pipeline

---

## Next Step (D)

D 文件會包含：
1. 註冊 Apify 帳號的步驟
2. 取得 API token、安裝 SDK
3. 跑出第一個 Google Maps Scraper（抓 Seattle 附近 Chase Bank）
4. 把結果整合進 Astro + Vercel AI SDK 的 Quest detail page
5. The Roots 真正「活起來」的 demo moment
