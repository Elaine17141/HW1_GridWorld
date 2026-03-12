# 🤖 Reinforcement Learning Grid Map (HW1)

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> [!TIP]
> **🚀 Live Demo**: [https://elaine17141.github.io/HW1_GridWorld/](https://elaine17141.github.io/HW1_GridWorld/)

本專案是一個基於 **強化學習 (Reinforcement Learning)** 理論開發的互動式網格地圖模擬器。使用者可自定義 $n \times n$ 的地圖配置，並即時運算 **策略評估 (Policy Evaluation)** 以視覺化狀態價值矩陣與最佳策略。

---

## 📑 目錄
- [✨ 功能亮點](#-功能亮點)
- [🧩 專案架構](#-專案架構)
- [🧠 演算法原理](#-演算法原理)
- [🚀 快速開始](#-快速開始)
- [📖 使用說明](#-使用說明)

---

## ✨ 功能亮點

- **🛠️ 高度自定義**：支援 3x3 至 10x10 的動態網格生成。
- **🖱️ 直觀交互**：
  - **綠色單元格**：起點 (Start State)
  - **紅色單元格**：終點 (Terminal State)
  - **灰色單元格**：障礙物 (Walls/Blocked States)
- **📊 雙重矩陣視圖**：
  - **Value Matrix**：顯示每個狀態收斂後的精確價值 $V(s)$。
  - **Policy Matrix**：顯示最佳動作路徑（指向高價值鄰居的箭頭）。
- **⚡ 即時運算**：前端採用非同步計算（支援 JavaScript & Flask 後端邏輯）。

---

## 🧩 專案架構

```text
.
├── app.py              # Flask 後端主程式 (提供 Policy Evaluation API)
├── templates/
│   └── index.html      # 主頁面結構
├── static/
│   ├── style.css       # 現代化 UI 樣式 (Glassmorphism 風格)
│   └── script.js       # 前端邏輯與網格渲染
├── requirements.txt    # 專案依賴套件
└── README.md           # 專案說明文件
```

---

## 🧠 演算法原理

本專案的核心基於 **Bellman Expectation Equation** 的迭代求解：

### 1. 策略評估 (Policy Evaluation)
我們假設智慧體 (Agent) 採用 **均勻隨機策略 (Uniform Random Policy)**，即 $\pi(a|s) = 0.25$。
$$V_{k+1}(s) = \sum_{a \in A} \pi(a|s) \sum_{s', r} p(s', r | s, a) [r + \gamma V_k(s')]$$

### 2. 環境參數設定
- **折扣因子 ($\gamma$)**：$0.9$ (注重未來獎勵的程度)。
- **獎勵函數 (Reward Function)**：
  - 進入終點：$+10$
  - 一般移動或撞牆：$-1$ (生存懲罰，激勵 Agent 尋找最短路徑)。
- **收斂條件**：$\max |V_{k+1}(s) - V_k(s)| < 10^{-4}$。

---

## 🚀 快速開始

### 環境需求
- Python 3.8+
- 現代瀏覽器 (Chrome, Edge, Firefox)

### 步驟 1: 安裝依賴
```bash
pip install -r requirements.txt
```

### 步驟 2: 啟動專案
```bash
python app.py
```

### 步驟 3: 訪問網頁
開啟瀏覽器前往 [http://127.0.0.1:5000](http://127.0.0.1:5000)。

---

## 📖 使用說明

1. **設定規模**：輸入地圖大小 (n) 並點擊 `Generate Grid`。
2. **三步配置**：
   - 第一下：設定**起點**。
   - 第二下：設定**終點**。
   - 第三下及後續：點擊格子以新增/刪除**牆壁**。
3. **執行計算**：點擊 `Calculate` 獲取結果。
4. **查看結果**：系統會自動切換至結果分頁，顯示收斂後的價值與策略。

---
> *Developed for Deep Reinforcement Learning Course (HW1)*

