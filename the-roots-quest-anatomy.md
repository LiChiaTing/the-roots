# The Roots — Quest Anatomy 模板

> **狀態**：v1　|　**日期**：2026-05-20　|　**前置文件**：[the-roots-module-boundaries.md](the-roots-module-boundaries.md)
> **目的**：定義所有 Quest 詳情頁的標準內容架構，作為設計與工程實作的單一事實來源。

---

## 核心哲學：Trust > Engagement Mechanic

這個 app 的目標用戶是焦慮的移民。在未知道路上看不見前方比看見更可怕，因此**絕不採用「鎖住下一關」的遊戲化機制**。

| 反模式（避免） | 正確做法 |
|---|---|
| 🔒 Locked / Unlock 概念 | 全部 quest **永遠可讀、可預覽**，瀏覽不需要任何前置條件 |
| 二分狀態：Locked vs Available | **四種狀態**：✅ Done · 🔵 In Progress · ⚪ Available · ⭐ Recommended Next |
| "Next Quest Unlocked" 文案 | "Recommended next" 推薦但不限制 |
| 階段地圖只顯示已解鎖階段 | **全程地圖可瀏覽**，每階段顯示進度條 X/Y |

**信任產生留存，限制產生焦慮。**

---

## Quest 類型

不是所有 quest 結構一樣，分四種：

| 類型 | 例子 | 用哪些欄位 |
|---|---|---|
| 🧠 **Knowledge**（學習） | "Understand SNAP eligibility" | 1, 2, 4, 10, 11 |
| 🤔 **Decision**（選擇） | "Choose a health plan" | 1, 2, 3, 4, 6, 10, 11 |
| 🎯 **Action**（執行） | "Open checking account" | **全部 11 個** |
| 🔁 **Habit**（養成） | "Pay credit card in full ×3" | 1, 2, 7, 10, 11 + 進度追蹤 |

---

## 11 欄位模板

順序鎖死，不可調整（可預測性 = 信任）。

| # | 欄位 | 性質 | 內容歸屬 |
|---|---|---|---|
| 1 | **Header**（標題、階段、狀態、預估時間、社會認同） | 🔴 必要 | Journey |
| 2 | **Why this matters**（為什麼重要 + 不做的代價） | 🔴 必要 | Journey 靜態 |
| 3 | **Cost & Effort**（錢 / 時間 / 心力） | 🟡 條件 | Journey 靜態 |
| 4 | **What you need to know**（可展開的核心概念） | 🟡 條件 | Journey 靜態 |
| 5 | **Red Flags**（陷阱、詐騙、銷售話術） | 🟡 條件 | Journey 靜態 |
| 6 | **Your options**（選項清單） | 🟡 條件 | Journey 內嵌 Guide（**動態 — Apify**） |
| 7 | **What you'll need**（文件 checklist） | 🟡 條件 | Journey 靜態 |
| 8 | **How to do it**（步驟） | 🟡 條件 | Journey 靜態 |
| 9 | **Conversation Rehearsal**（對話預習 — 3 layer：流程 / Q&A / phrases） | 🟡 條件 | Journey 內嵌 Kit |
| 10 | **What others are asking**（社群問答） | 🟡 條件 | Journey 內嵌 Circles |
| 11 | **Done + Recommended Next**（完成 + 推薦下一關） | 🔴 必要 | Journey |

---

## Worked Example：Open a Checking Account

### 1. Header
- 標題：Open a checking account
- 階段標籤：Stage 1 — Land Safely
- 進度條：2/5（5 階段並列、無 lock）
- 狀態：In progress
- 預估：1–2 hr visit
- 社會認同：「94% of new arrivals do this in week 1–2」

### 2. Why this matters
> 你的銀行帳戶是其他一切的地基：領薪水、付房租、建立信用。沒有它，你永遠累積不出在美國買房買車需要的信用記錄。

### 3. Cost & Effort
- 💸 Cost: $0–100 (opening deposit)
- 😊 Effort: Low (walk-in friendly)
- ⏱ Time: 1–2 hr 親臨 + 1–3 天啟用

### 4. What you need to know（3 個可展開）
- Checking vs Savings
- 為什麼要帶兩個 ID
- 「沒 SSN 不能開戶」是迷思

### 5. Red Flags
- 不要在 ATM 街頭推銷處開戶
- "Free account" 注意隱藏條件
- 銀行員拒絕 ITIN 開戶 → 違法，換家
- "Premium account" 多半你不需要

### 6. Your options（Dynamic — Apify 介入點）
- 篩選器：用戶州 + 語言 + 簽證身份（從 Profile 帶入）
- 卡片資訊：銀行名、ITIN/SSN 政策、最低存款、月費、距離、所需文件
- 推薦排序：依用戶條件匹配度
- **必含 Live 徽章 + 更新時間 + 來源**

### 7. What you'll need
- ☐ 護照 + 美國簽證頁
- ☐ 第二個 ID
- ☐ 美國地址證明
- ☐ SSN 或 ITIN（依銀行）
- ☐ 開戶金
- ☐ 美國電話號碼

### 8. How to do it
1. 從上方選一家銀行
2. 打電話確認 walk-in 或預約
3. 帶齊文件 + 開戶金親臨分行
4. 開通網銀 + 訂 debit card

### 9. Conversation Rehearsal（升級設計）

> **設計原則：預習 > 即時翻譯**。焦慮不是來自語言能力，而是來自不知道接下來會發生什麼。即使英文流利，「等下會被問什麼」「該回答什麼」才是焦慮的根源。

**Part A：流程預覽（The Walkthrough）— 預設展開**
8 步以內的對話流程腳本，把整個過程透明化：
1. 行員問你今天想辦什麼
2. 你說想開 checking account
3. 行員問 SSN（沒有也可，"I have ITIN"）
4. 行員檢查文件
5. 填表格（姓名、地址、職業）
6. 選擇 debit card / paper statement
7. 交開戶金
8. 拿臨時卡或等寄送

**Part B：可能被問的問題（They might ask you...）— 可展開卡片**
每張卡：
- 英文原句 + 🎤
- 母語翻譯
- 1-3 個建議回答（每個都有 🎤）

**Part C：你可以主動說的話（You can say...）— 分類選擇**
- 🚀 Opening
- 🤷 聽不懂時
- 🆘 求救
- ✋ 請對方等
- 👋 結束

每張 phrase card 支援：英文 + 母語 + 🎤 + 📱 全螢幕「給對方看」模式

### 10. What others are asking
- "我沒 SSN 該選哪家？" (Verified, 124 ✓)
- "配偶有 SSN 我沒有可開聯名嗎？" (Community)
- "開多家銀行會傷信用嗎？" (Community)

### 11. Done + Recommended Next
- [✓ Mark this quest done] 主按鈕
- Recommended next: Set up autopay → Apply for secured credit card
- 註記：「其他所有 quest 都可隨時瀏覽，不會被鎖」

---

## 設計鐵則（7 條）

**🔒 鐵則 1：欄位順序鎖死**
所有 quest 一律 1→11，不可調整。可預測性 = 信任。

**🔒 鐵則 2：每個欄位可摺疊，但預設都展開**
Persona 2 跳過已知，Persona 1 看到全貌。

**🔒 鐵則 3：靜態 vs 動態視覺分明**
動態欄位（#6）一律加 `🔄 Last updated X ago + Source + Refresh 按鈕`。靜態欄位不加。**這條規則直接讓 Apify 的價值被看見。**

> 文案規範：使用「Last updated」而非「Live」——「Live」會誤導用戶以為資料正在串流，但實際是上次抓取的快照。明確標示時間更能建立信任。

**🔒 鐵則 4：Done 按鈕永遠 sticky 在底部**
滾到哪都看得到。

**🔒 鐵則 5：絕不外連到原始銀行/政府網站**
所有資訊在 app 內呈現完整。外連 = 破壞流程 + 流失用戶 + 用戶失去信任感（怕點進外站被釣魚）。

**🔒 鐵則 6：不使用 Lock / Unlock 語言**
全部 quest 永遠可讀，狀態用 Done / In Progress / Available / Recommended Next 四態描述。

**🔒 鐵則 7：內嵌服務（Guide/Kit/Circles）用色塊區隔**
讓用戶建立模組辨識：
- Kit 內嵌 → 紫色塊
- Circles 內嵌 → 粉色塊（或灰色塊配徽章）
- Guide 內嵌 → 藍色塊（或銀行 logo 留白）

---

## AI UX 狀態定義（動態欄位必備）

| 狀態 | UI 表現 |
|---|---|
| **Loading** | 3 張 skeleton 卡片 + 「正在抓取最新銀行資訊…」 |
| **Streaming** | 每抓到一家就 fade-in 一張，給「即時感」 |
| **Error / Timeout** | Fallback 到快取版本 + 醒目重新整理按鈕 + 「使用快取資料」標籤 |
| **Empty** | 「沒找到符合條件的銀行，要不要放寬條件？」+ 一鍵清除篩選 |

---

---

## 動態資料的 Refresh 機制

> **核心哲學：把資料控制權還給用戶**。沒有給用戶手動 refresh = 把控制權奪走 = 信任崩塌。

### Refresh 按鈕的 5 種狀態

| 狀態 | UI | 互動 |
|---|---|---|
| **Idle**（預設） | 🔄 `Last updated 4h ago` | 可點擊 |
| **Refreshing** | ⟳ `Refreshing...`（旋轉動畫） | 不可重複點 |
| **Just updated** | ✓ `Updated just now`（綠色 2 秒後自動回 Idle） | — |
| **Rate limited** | ✓ `Updated recently · Available again in ~25 min` | 點擊無作用 |
| **Error** | ⚠ `Couldn't refresh · using cached` | 可重試 |

### Refresh 規則（避免濫用 + 成本控制）

**規則 1：同查詢最小間隔 30 分鐘**
同 quest、同篩選條件、同用戶，30 分鐘內只能手動 refresh 一次。
理由：(a) 大部分資料 30 分鐘不會變化、(b) Apify 每次 call 都有成本、(c) 時間敏感的資料（DMV 預約等）會由 TTL 自動處理，不依賴用戶手動。
Rate limited 時 UI 文案：`✓ Updated recently · Available again in ~25 min`（不顯示秒數倒數，避免製造緊張感）。

**規則 2：每用戶每日 refresh 上限**
建議 20 次/天。超過顯示「今日 refresh 已用完」。免費 vs 付費版的差異點。

**規則 3：背景共享快取**
用戶 A 觸發的 refresh 結果，5 分鐘內提供給用戶 B（用戶 B 看到 5 分鐘前的時間戳）。**省 Apify 錢的關鍵**。

### 每類資料的自動過期 TTL

超過 TTL 時系統**自動 refresh**（不消耗用戶配額），時間戳自動更新。用戶看到的永遠不會比 TTL 老。

| 資料類型 | TTL | 例子 |
|---|---|---|
| 商家清單（銀行/醫生/SSA） | 24 hr | 變動慢 |
| 政府處理時間（USCIS/DMV） | 7 days | 通常每月更新 |
| 房屋租賃清單 | 6 hr | 變動快 |
| DMV 預約時段 | 30 min | 即時變化 |
| 即時新聞 / 政策警示 | 1 hr | 用戶需要最新 |

### 微互動建議

- 點擊：圖示旋轉 + 「Refreshing…」fade in
- 完成：✓ 綠色閃 150ms + 新時間戳 fade in
- 失敗：紅色 + haptic feedback 輕微震動

---

## Next Steps

- **C. Stage 1 靜態 vs 動態資訊清單**：把 5 個 quest 套用這個模板，逐欄位標記哪些是靜態文章、哪些需要 Apify。產出 Apify 需求清單。
- **D. Apify Actor 對應 + 學習路線圖**：拿 C 的動態清單對應到具體 Actor，排學習順序。
