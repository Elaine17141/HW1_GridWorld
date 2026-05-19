# 🤖 Reinforcement Learning Grid Map (HW1)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> [!TIP]
> **🚀 Live Demo**: [https://elaine17141.github.io/HW1_GridWorld/](https://elaine17141.github.io/HW1_GridWorld/)

本專案是一個基於 **強化學習 (Reinforcement Learning)** 理論開發的互動式網格地圖模擬器。使用者可自定義 $n \times n$ 的地圖配置，並透過視覺化介面即時觀察 **隨機策略評估 (Policy Evaluation)** 與 **價值迭代 (Value Iteration)** 的運算過程，完整對應課程 HW1 之各項要求。

---

## 📑 目錄
- [🎯 作業要求達成度 (Requirements)](#-作業要求達成度-requirements)
- [✨ 功能亮點 (Features)](#-功能亮點-features)
- [🧩 專案架構 (Architecture)](#-專案架構-architecture)
- [🧠 演算法原理 (Algorithms)](#-演算法原理-algorithms)
- [🚀 快速開始 (Quick Start)](#-快速開始-quick-start)
- [📖 使用說明 (Usage)](#-使用說明-usage)

---

## 🎯 作業要求達成度 (Requirements)

本專案嚴格遵循作業 HW1 的三項核心階段進行開發：

### ✅ HW1-1: 網格地圖開發 (Grid Map Development)
- **自定義維度**：允許用戶透過直觀介面輸入 `n`（支援範圍 5 到 9）來動態生成 $n \times n$ 的網格地圖。
- **互動式配置**：
  - **起點設定**：首次點擊網格即可指定起始點（以**綠色**顯示）。
  - **終點設定**：第二次點擊指定目標終點（以**紅色**顯示）。
  - **障礙物設置**：後續點擊可自由設定障礙物單元格（以**灰色**顯示），構成迷宮牆壁（依照要求可設置 $n-2$ 個）。

### ✅ HW1-2: 策略顯示與價值評估 (Policy Display & Value Evaluation)
- **隨機策略生成**：系統會為每一個非牆壁、非終點的狀態，隨機分配一個「固定的初始動作」（↑、↓、←、→ 箭頭）作為初始策略 (Random Policy)。
- **策略評估 (Policy Evaluation)**：透過演算法計算，推導出每個狀態在該隨機策略下的價值函數 $V(s)$。
- **視覺化呈現**：將算出的價值 $V(s)$ 與隨機生成的動作箭頭同步顯示在介面上，讓使用者清楚看見「隨機策略」與其帶來的狀態價值。

### ✅ HW1-3: 使用價值迭代推導最佳政策 (Value Iteration for Optimal Policy)
- **價值迭代演算法 (Value Iteration)**：實作 Value Iteration 演算法來計算最佳政策。藉由不斷更新價值矩陣，找出每個格子的最佳行動。
- **最佳政策顯示**：顯示推導出的最佳政策（Optimal Policy）。在完成計算後，會使用指向最高價值鄰居的箭頭，**取代**掉 HW1-2 階段顯示的隨機行動。
- **顯示最佳價值函數**：在執行價值迭代後，同步更新格子以顯示最佳狀態價值 $V^*(s)$，代表在最佳政策下該狀態的期望回報。

---

## ✨ 功能亮點 (Features)

- **🖥️ 全端互動式應用**：採用 Flask 作為穩定後端架構，搭配 HTML/CSS/JavaScript 打造流暢且響應式 (Responsive) 的前端操作體驗。
- **📊 雙重矩陣對比視圖 (Dual Matrix View)**：
  - **Value Matrix**：顯示每個狀態精確的價值函數數值。
  - **Policy Matrix**：顯示網格中每個狀態對應的行動決策（動作箭頭）。
- **⚡ 即時運算與非同步更新**：點擊計算後，無須重新載入頁面即可即時渲染收斂後的價值與策略。
- **🎨 現代化 UI 設計**：導入玻璃擬物化 (Glassmorphism) 風格與柔和色彩，大大提升了「使用者界面友好性」的評分標準。

---

## 🧩 專案架構 (Architecture)

```text
.
├── app.py              # Flask 後端主程式 (提供演算法運算 API)
├── templates/
│   └── index.html      # 主頁面結構與 HTML 介面
├── static/
│   ├── style.css       # 現代化 UI 樣式 (負責前端美化與呈現)
│   └── script.js       # 前端邏輯、網格渲染與用戶交互處理
├── requirements.txt    # 專案依賴套件
└── README.md           # 專案說明文件
```

---

## 🧠 演算法原理 (Algorithms)

### 1. 策略評估 (Policy Evaluation - HW1-2)
針對初始分配的固定隨機策略 $\pi$，透過 Bellman Expectation Equation 進行迭代更新，評估該策略的表現：
$$V_{k+1}(s) = \sum_{a \in A} \pi(a|s) \sum_{s', r} p(s', r | s, a) [r + \gamma V_k(s')]$$

### 2. 價值迭代 (Value Iteration - HW1-3)
為了尋找最佳策略，我們使用 Bellman Optimality Equation 進行迭代，每次更新都選取能產生最大期望回報的動作：
$$V_{k+1}(s) = \max_{a \in A} \sum_{s', r} p(s', r | s, a) [r + \gamma V_k(s')]$$
當 $V(s)$ 收斂後，再對每個狀態取 $\arg\max$ 來決定最終的最佳動作（最佳政策）。

### ⚙️ 參數設定 (Hyperparameters)
- **折扣因子 ($\gamma$)**：$0.9$ (注重未來獎勵的衰減係數)。
- **獎勵函數 (Reward Function)**：
  - 進入終點 (Goal)：$+10$
  - 一般移動 (Living/Step penalty)：$-1$ (生存懲罰，促使 Agent 尋找最短路徑)。
  - 撞牆 (Hit Wall)：停留在原地並獲得 $-1$ 懲罰。

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

## 📖 使用說明 (Usage)

1. **設定網格大小**：在介面上輸入地圖大小 $n$ (範圍 5~9)，並點擊 `Generate Grid`。
2. **初始化配置**：
   - 第一下點擊網格：設定 **起點 (Start, 綠色)**。
   - 第二下點擊網格：設定 **終點 (Goal, 紅色)**。
   - 第三下起：隨意點擊格子以設置 $n-2$ 個 **障礙物 (Wall, 灰色)**。
3. **執行演算法**：
   - 點擊 `Calculate` 按鈕，系統將依照作業需求，計算並展示隨機政策價值與最佳政策路徑。
4. **觀察結果**：透過左側的 Value Matrix 與右側的 Policy Matrix，清楚檢視強化學習如何從隨機探索收斂至最佳決策！

---
> *Developed for Deep Reinforcement Learning Course - Assignment 1*
