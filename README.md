# FinTech 金融走勢智慧分析平台

> 東吳大學 2025 金融走勢智慧分析專題

一個現代化的金融市場分析平台，運用 AI 技術與大數據分析，提供股票、加密貨幣等多種市場的智能分析、技術指標、基本面分析與投資組合管理功能。

## ✨ 主要功能

### 🎯 核心功能

- **📊 市場分析**：即時市場數據、技術分析、全球市場總覽
- **🤖 AI 智能預測**：運用機器學習模型分析市場走勢，提供投資建議
- **💼 投資組合管理**：智能資產配置、績效追蹤、風險評估
- **📰 金融新聞**：AI 精選全球金融新聞與市場洞察
- **💬 社群討論**：投資者社群交流平台
- **🎓 投資教育**：金融知識學習與技術分析教學
- **MVC 架構**：採用 Model-View-Controller 設計模式

## 🛠️ 技術棧

### 前端框架

- **React 19**
- **Next.js 15**
- **TypeScript**

### UI/UX 設計

- **Tailwind CSS 4.x**
- **Headless UI**
- **Heroicons**
- **Ant Design**

### 數據視覺化

- **Chart.js**
- **react-chartjs-2**
- **Lightweight Charts**
- **React Sparklines**

### 動畫與互動

- **Framer Motion** - 生產就緒的動畫庫
- **GSAP** - 高效能動畫引擎

### 後端整合

- **Axios**
- **Express.js**
- **MS SQL Server**

## 📁 專案結構

```
financial-analysis-web/
├── 📁 public/                  # 靜態資源
│   ├── 📁 kline-patterns/      # K線型態圖片
│   └── 📁 python-app/          # Python 程式
├── 📁 src/
│   ├── 📁 components/          # React 組件
│   ├── 📁 controllers/         # MVC 控制器
│   ├── 📁 models/              # 資料模型
│   ├── 📁 services/            # 服務層
│   ├── 📁 hooks/               # React Hooks
│   ├── 📁 pages/               # Next.js 頁面
│   ├── 📁 data/                # 模擬資料
│   ├── 📁 types/               # TypeScript 型別定義
│   ├── 📁 constants/           # 常數定義
│   ├── 📁 utils/               # 工具函數
│   └── 📁 styles/              # 全域樣式
├── 📁 .github/workflows/       # GitHub Actions CI/CD
├── 📄 .env                     # 環境變數配置
├── 📄 next.config.js           # Next.js 配置
├── 📄 tailwind.config.js       # Tailwind CSS 配置
├── 📄 tsconfig.json            # TypeScript 配置
└── 📄 package.json             # 專案依賴與腳本
```

## 🚀 快速開始

### 環境需求

- Node.js 22.x 或更高版本
- npm 或 yarn 套件管理器

### 安裝與啟動

1. **clone 專案**

   ```bash
   git clone https://github.com/HaoXun97/financial-analysis.git
   cd financial-analysis
   ```

2. **安裝依賴**

   ```bash
   npm install
   ```
3. **根目錄環境變數.env**
   ```
   DB_SERVER='your_server_name'
   DB_PORT='1433'
   DB_WEBUSER='your_server_name'
   DB_WEBUSER_PASSWORD='your_password'
   ```
4. **啟動開發伺服器**

   ```bash
   npm run dev
   ```

   開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 🔧 可用腳本

```bash
# 開發模式（使用 Turbopack）
npm run dev

# 建置專案
npm run build

# 啟動生產伺服器
npm start

# 程式碼審查
npm run lint

# TypeScript 型別檢查
npm run tsc
```

## 🌐 部署

### GitHub Pages 自動部署

本專案已配置 GitHub Actions，當推送到 `main` 分支時會自動部署到 GitHub Pages。

部署流程：

1. 推送程式碼到 `main` 分支
2. GitHub Actions 自動執行建置
3. 部署到 `gh-pages` 分支
4. 網站自動更新

---

**⚠️ 免責聲明**

本專案僅供學術研究與展示用途，實際投資請諮詢專業金融顧問。

---

<div align="center">
  <strong>🎓 東吳大學 2025 金融走勢智慧分析專題</strong>
</div>
