# 🤖 Reinforcement Learning Grid Map (HW1)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> [!TIP]
> **🚀 Live Demo**: [https://elaine17141.github.io/HW1_GridWorld/](https://elaine17141.github.io/HW1_GridWorld/)  
> *(注意：GitHub Pages 僅為純前端展示，實際的 Flask API 與完整演算法運算須在本地端運行 `python app.py` 來體驗。)*

本專案是一個基於 **強化學習 (Reinforcement Learning)** 理論開發的互動式網格地圖模擬器。採用 **前後端分離架構**（前端 HTML/JS 搭配 Fetch API，後端 Python Flask），完整且嚴格地對應了課程 HW1 之所有要求。

---

## 📑 目錄
- [🎯 作業要求達成度 (Requirements)](#-作業要求達成度-requirements)
- [✨ 功能亮點 (Features)](#-功能亮點-features)
- [🧩 專案架構 (Architecture)](#-專案架構-architecture)
- [🧠 演算法與數學原理解析 (Algorithms)](#-演算法與數學原理解析-algorithms)
- [🚀 快速開始 (Quick Start)](#-快速開始-quick-start)
- [🕹️ 測試流程指南 (Usage Flow)](#-測試流程指南-usage-flow)

---

## 🎯 作業要求達成度 (Requirements)

本專案嚴格遵循作業 HW1 的三項核心階段進行開發，並透過明確的 UI 引導助教檢驗成果：

### ✅ HW1-1: 網格地圖開發 (Grid Map Development)
- **自定義維度**：允許用戶透過直觀介面輸入 `n`（支援範圍 3 到 10）來動態生成 $n \times n$ 的網格地圖。
- **互動式配置**：
  - **起點設定**：首次點擊網格即可指定起始點（以**綠色**顯示）。
  - **終點設定**：第二次點擊指定目標終點（以**紅色**顯示，附帶 ★ 符號）。
  - **障礙物設置**：後續點擊可自由設定障礙物單元格（以**灰色**顯示），構成迷宮牆壁。

### ✅ HW1-2: 策略顯示與價值評估 (Policy Display & Value Evaluation)
- **隨機策略生成**：系統會為每一個非牆壁、非終點的狀態，隨機分配一個「固定的初始動作」（↑、↓、←、→ 箭頭）作為初始策略 (Random Policy)。
- **呼叫 Flask API**：前端點擊 **「Step 1: Evaluate Random Policy」**，會透過 Fetch API 將地圖資訊傳送給後端的 `/calculate` 端點。
- **狀態價值 $V(s)$ 數學驗證**：
  - 由於初始動作是完全隨機的，多數格子會形成「死迴圈 (Infinite Loops)」或不斷「撞牆」。
  - 每次移動扣 1 分 (Reward = -1)，在折扣因子 $\gamma = 0.9$ 的情況下，無窮迴圈的極限值精確收斂於 $\frac{-1}{1 - 0.9} = -10.00$。
  - 介面會以**低調的灰色箭頭**展示這混亂的隨機策略，並在 Value Matrix 顯示滿滿的 `-10.00`，完美展現未優化前的慘況！

### ✅ HW1-3: 使用價值迭代推導最佳政策 (Value Iteration for Optimal Policy)
- **價值迭代演算法 (Value Iteration)**：後端 `/optimize` API 實作了 Value Iteration，透過 Bellman Optimality Equation 不斷更新價值矩陣，直到收斂並找出每個格子的最佳行動。
- **最佳政策顯示**：
  - 當用戶點擊 **「Step 2: Run Value Iteration」** 時，前端會切換為最佳化視圖 (Mode)。
  - 原本灰色的隨機箭頭，會瞬間被**紅色、粗體且帶有光暈**的最佳路徑箭頭**取代**！
  - 所有的紅色箭頭都會完美繞過灰色障礙物，有條不紊地指向星星（終點），且 Value Matrix 會更新為收斂後的最大期望回報 $V^*(s)$。

---

## ✨ 功能亮點 (Features)

- **🖥️ 正統前後端分離架構**：採用 Python Flask 作為後端演算法引擎，前端透過 `async/await fetch` 進行非同步資料交換，無須重新載入頁面即可即時渲染。
- **📊 雙重矩陣對比視圖 (Dual Matrix View)**：
  - **Value Matrix**：顯示每個狀態精確的價值函數數值 (保留小數點後兩位)。
  - **Policy Matrix**：顯示網格中每個狀態對應的行動決策（動作箭頭）。
- **🎨 現代化狀態 UI 設計**：頂部具備「HW1-1 / HW1-2 / HW1-3」進度標籤 (Badges)，隨著使用者的操作進度動態亮起，並透過顏色與文字提示，讓助教一眼看出當前展示的作業階段。

---

## 🧩 專案架構 (Architecture)

```text
.
├── app.py              # Flask 後端主程式 (提供 /calculate 與 /optimize 兩支 API)
├── templates/
│   └── index.html      # 主頁面結構、UI 佈局與 Step 按鈕
├── static/
│   ├── style.css       # 現代化 UI 樣式 (包含動態切換的狀態 CSS)
│   └── script.js       # 前端邏輯、網格渲染與 Fetch API 呼叫處理
├── requirements.txt    # 專案依賴套件 (Flask, Numpy)
└── README.md           # 專案說明文件
```

---

## 🧠 演算法與數學原理解析 (Algorithms)

### ⚙️ 參數設定 (Hyperparameters)
- **折扣因子 ($\gamma$)**：$0.9$ (注重未來獎勵的衰減係數)。
- **獎勵函數 (Reward Function)**：
  - 進入終點 (Goal)：$+10$
  - 一般移動 (Living penalty)：$-1$ (生存懲罰，促使 Agent 尋找最短路徑)。
  - 撞牆或超出邊界：停留在原地，同樣獲得 $-1$ 懲罰。

### 1. 隨機策略評估 (Random Policy Evaluation - HW1-2)
針對初始分配的固定隨機策略 $\pi$，透過 Bellman Expectation Equation 進行迭代更新：
$$V_{k+1}(s) = \sum_{a \in A} \pi(a|s) \sum_{s', r} p(s', r | s, a) [r + \gamma V_k(s')]$$
由於動作機率 $\pi(a|s) = 1.0$ (固定某個方向)，若方向指向死胡同，數值會收斂至 $-10.00$。

### 2. 價值迭代最佳化 (Value Iteration - HW1-3)
為了尋找最佳策略，我們使用 Bellman Optimality Equation 進行迭代，每次更新都選取能產生**最大期望回報**的動作：
$$V_{k+1}(s) = \max_{a \in A} \sum_{s', r} p(s', r | s, a) [r + \gamma V_k(s')]$$
當 $V(s)$ 收斂後，再對每個狀態取 $\arg\max$ 來決定最終的最佳動作（即為 Greedy Policy）。

---

## 🚀 快速開始 (Quick Start)

### 環境需求
- Python 3.8+
- 現代瀏覽器 (Chrome, Edge, Firefox) 

### 步驟 1: 安裝依賴
```bash
pip install -r requirements.txt
```

### 步驟 2: 啟動 Flask 伺服器
```bash
python app.py
```

### 步驟 3: 訪問網頁
開啟瀏覽器前往 [http://127.0.0.1:5000](http://127.0.0.1:5000)。

---

## 🕹️ 測試流程指南 (Usage Flow)

為了確保您能完整體驗作業的所有功能，請按照以下流程操作：

1. **設定網格大小 (HW1-1)**：在介面上輸入地圖大小 $n$ (例如 5)，並點擊 `Generate Square`。
2. **初始化配置 (HW1-1)**：
   - 第一下點擊網格：設定 **起點 (Start, 綠色)**。
   - 第二下點擊網格：設定 **終點 (Goal, 紅色)**。
   - 第三下起：隨意點擊格子以設置 **障礙物 (Wall, 灰色)**。
3. **展示隨機策略 (HW1-2)**：
   - 點擊左下角的藍色按鈕 **「1. Run Random Policy Evaluation (HW1-2)」**。
   - 觀察結果：畫面會出現灰色箭頭，您可以檢驗這些箭頭是否為「隨機亂指」，並觀察 Value Matrix 是否合理地出現 `-10.00`。
4. **展示最佳策略 (HW1-3)**：
   - 點擊橘紅色按鈕 **「2. Run Value Iteration (HW1-3)」**。
   - 觀察結果：所有的隨機箭頭將被取代為**鮮紅色的最佳路徑箭頭**，完美避開障礙物並指向終點，Value Matrix 也將顯示最佳的收斂價值！

---
> *Developed for Deep Reinforcement Learning Course - Assignment 1*
