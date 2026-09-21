# 💸 ExpenseFlow — Frontend Web Application

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-expenseflow.dev-6366F1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.expenseflow.dev/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**The modern, high-performance React frontend for ExpenseFlow — a personal finance management SaaS.**

[Explore Live Application](https://www.expenseflow.dev/)

</div>

---

## 🌟 Overview

The **ExpenseFlow Frontend** delivers a dark, modern fintech interface engineered with **React 19**, **Vite 8**, and **Vanilla CSS**. It provides responsive layouts across desktop, tablet, and mobile with micro-animations, glassmorphism, dynamic color badges, and interactive data visualization.

---

## ✨ Features

- 📱 **100% Responsive Design**: Clean mobile navigation drawer, adaptive grid layouts, and tablet optimizations.
- 🎨 **Fintech Dark Theme**: Glassmorphic card surfaces, deep navy backgrounds (`#080B16`), and subtle purple/indigo gradients.
- 🏷️ **Dynamic Category Badge System**: Context-aware, accessible category color badges across expenses, budgets, and reports.
- 📊 **Interactive Analytics**: Monthly breakdown charts, category share visualizer, and live budgeting progress bars with warning states.
- ⚡ **Snappy State Management**: Instant UI updates, responsive modals, toast notifications, and client-side pagination.
- 🛡️ **Route Protection**: JWT token verification guards protecting authenticated dashboard routes with redirect handling.

---

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Routing**: React Router v7 (`react-router-dom`)
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Styling**: Modern CSS3 (Custom design system with tokens, variables, and media queries)

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static public assets (favicon.svg, icons)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Top navigation & user profile
│   │   ├── Sidebar.jsx     # Side navigation menu with mobile drawer
│   │   ├── Modal.jsx       # Reusable accessible dialog modal
│   │   ├── Toast.jsx       # Alert toast notifications
│   │   ├── Pagination.jsx  # Table pagination controls
│   │   └── ...
│   ├── pages/              # Application views / routes
│   │   ├── Landing.jsx     # Modern public marketing landing page
│   │   ├── Login.jsx       # Authentication login view
│   │   ├── Register.jsx    # User sign-up view
│   │   ├── Dashboard.jsx   # Financial summary & KPIs
│   │   ├── Expenses.jsx    # Expense list, filter, and CRUD
│   │   ├── Income.jsx      # Income streams tracker
│   │   ├── Budgets.jsx     # Monthly budget caps & progress
│   │   ├── Categories.jsx  # Category manager
│   │   ├── Reports.jsx     # Visual analytics & trends
│   │   └── AIInsights.jsx  # AI spending advisor view
│   ├── utils/              # Utilities & helpers
│   │   ├── api.js          # Axios instance & token headers
│   │   └── categoryColors.js # Category color mapping logic
│   ├── App.jsx             # Main router configuration
│   ├── index.css           # Global fintech design system & tokens
│   └── main.jsx            # React root entry point
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
The compiled output will be generated inside the `dist/` directory.

---

## 🌐 Production Deployment

The production build is served via Nginx on AWS EC2 at [https://www.expenseflow.dev/](https://www.expenseflow.dev/).

```bash
# Build locally
npm run build

# Commit and push to the frontend branch
git add dist/
git commit -m "feat: update production dist build"
git push origin frontend
```

---

<div align="center">
  <sub>Part of <a href="https://github.com/akkiiop/expenseflow">ExpenseFlow</a> • Built by <a href="https://github.com/akkiiop">Akshay Kawade</a></sub>
</div>
