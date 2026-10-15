# 🚢 Shipping Corporation of India (SCI) - KPI & Fleet Analytics Portal

A modern, executive-grade maritime financial dashboard built for **The Shipping Corporation of India Ltd. (A Navratna Govt. of India Enterprise)**. 

Engineered with **Next.js 14**, **React**, **Tailwind CSS**, and **Recharts**, this platform enables fleet managers and directors to monitor vessel voyage performance, direct operating expenses (DOE), indirect operating expenses (IOE), gross operating profit (GOP), and pre-tax earnings (PBT) across international maritime routes.

---

## ⚡ What’s New & Improvements Over the Legacy Streamlit App

| Feature | Legacy Streamlit App | Modern Next.js Vercel App |
| :--- | :--- | :--- |
| **Vercel Deployment** | ❌ Incompatible (Serverless timeout / WebSockets break) | ✅ **100% Native Vercel deployment** with zero-config |
| **User Interface** | Basic Streamlit widgets, static styling | 🌟 **Maritime Glassmorphism**, custom navy aesthetic, responsive mobile & desktop layout |
| **Performance** | Python rerun on every interaction | ⚡ **Instant client-side interactions**, zero lag, optimized SVG/Canvas rendering |
| **Data Cleaning** | Required local Python runtime | 🔄 **In-browser automated cleaner** supporting SAP ERP double-headers & fiscal periods |
| **Visualizations** | Basic Plotly charts | 📊 **Interactive Recharts**: Multi-metric yearly comparison, monthly stack/group, sector pie share, vessel benchmarking |
| **Data Explorer** | Static dataframe | 📋 **Live Search, Column Sort, Pagination & 1-Click CSV Export** |
| **Sign Convention** | Hardcoded signs | 🔄 **One-click toggle** between positive financial display and raw SAP Debit/Credit accounting |
| **Fleet Dataset** | Empty until uploaded | 🛳️ **Pre-loaded with realistic SCI fleet data** (Tankers, Bulk Carriers, Offshore, Liners) |

---

## 🚀 How to Deploy to Vercel

### Method 1: Direct Deployment via Vercel CLI (Recommended)

1. Open your terminal and navigate to the project directory:
   ```bash
   cd /Users/rivanshu/.gemini/antigravity/scratch/sci-kpi-dashboard
   ```

2. Run the Vercel CLI:
   ```bash
   npx vercel
   ```
   - Follow the prompt to log in to your Vercel account.
   - Accept the default project settings (Framework: **Next.js**).

3. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

Your live website URL (e.g. `https://sci-kpi-dashboard-xyz.vercel.app`) will be generated immediately!

---

### Method 2: Deploying via GitHub & Vercel Dashboard

1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: modernized SCI KPI dashboard for Vercel"
   ```

2. Create a new repository on [GitHub](https://github.com/new) and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sci-kpi-dashboard.git
   git branch -M main
   git push -u origin main
   ```

3. Go to [Vercel Dashboard](https://vercel.com/new):
   - Click **"Add New..."** → **"Project"**.
   - Select your `sci-kpi-dashboard` repository.
   - Click **Deploy**. Vercel will automatically detect Next.js and build the application.

---

## 🛠️ Local Development

### 1. Prerequisites
- Node.js 18.x or 20.x installed
- npm or yarn

### 2. Run Locally
```bash
# Navigate to the project directory
cd /Users/rivanshu/.gemini/antigravity/scratch/sci-kpi-dashboard

# Start the development server
npm run dev
```

Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📊 Core Features & Views

1. **📅 Yearly Analysis**: Multi-year comparative trends across fleet revenue, fuel/port expenses (DOE), administrative overheads (IOE), and profit before tax (PBT).
2. **📆 Monthly Analysis**: Month-on-month revenue tracking with customizable stacked or grouped bar charts.
3. **🔄 Quarterly Analysis**: Fiscal quarter evaluation (Q1 to Q4) capturing seasonality and monsoon/winter charter rate shifts.
4. **🌐 Sector-Wise Analysis**: Sector comparison and revenue distribution across Crude Tankers, Product Tankers, Bulk Carriers, Offshore Supply, and Container Liners.
5. **🚢 Vessel-Wise Analysis**: Fleet ranking by revenue contribution, voyage costs, or operating margins.
6. **📋 Granular Data Explorer**: Full searchable ledger with multi-column sorting, pagination, and direct CSV export.
7. **📤 Smart CSV Upload**: Upload weekly or monthly CSV files. Includes a downloadable sample CSV template for testing.

---

## 🔐 Default Access Credentials

- **Admin Login**: `admin` / `admin123`
- **Analyst Login**: `manager1` / `manager456`
- **User Login**: `user1` / `pass123`

---

## 🚢 Developer

- **Developer**: Rivanshu Gaur
- **Organization**: Shipping Corporation of India Ltd.
- **Repository**: [sci-kpi-dashboard](https://github.com/your-username/sci-kpi-dashboard)
