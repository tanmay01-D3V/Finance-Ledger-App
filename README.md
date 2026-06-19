![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-cyan)
![Recharts](https://img.shields.io/badge/Recharts-Charts-orange)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)
![Status](https://img.shields.io/badge/Status-Live-success)

💰 Finance Ledger App

Personal Financial Cashflow Ledger & Runway Calculator

A modern financial planning and forecasting platform built with ReactJS, designed to help users track income, manage expenses, forecast cashflow, calculate financial runway, and simulate real-world financial stress scenarios.

🔗 Live Demo: https://finance-ledger-app.vercel.app

⸻

✨ Overview

Finance Ledger App transforms traditional budgeting into a powerful financial decision-making tool. Instead of simply recording transactions, users gain visibility into future cashflow, spending patterns, burn rates, and long-term financial sustainability.

The application combines financial tracking, forecasting, and scenario analysis into a single interactive dashboard while maintaining complete user privacy through a frontend-only architecture.

⸻

🚀 Key Features

📊 Executive Dashboard

Gain a complete snapshot of your financial health.

Includes:

* Total Savings Overview
* Monthly Income Tracking
* Monthly Expense Monitoring
* Runway Survival Horizon
* Cashflow Forecast Visualization
* Income vs Expense Analysis
* Recent Transaction History

⸻

💳 Financial Ledger

Track and organize all financial activity in a structured ledger system.

Features:

* Add Income Streams
* Add Expense Categories
* Manage Recurring Transactions
* Transaction History Table
* Financial Categorization
* Real-Time Updates

⸻

📈 Runway Forecasting Engine

Visualize future financial outcomes and identify potential risks before they happen.

Capabilities:

* Burn Rate Monitoring
* Projected Cash Exhaustion Analysis
* Multi-Year Cashflow Forecasting
* Growth Variance Monitoring
* Savings Trend Tracking
* Financial Health Assessment

⸻

🧪 Stress Testing Sandbox

Simulate unexpected financial events and evaluate resilience.

Scenario Simulations:

* Inflation Rate Adjustment
* Emergency Expense Injection
* Income Loss Simulation
* Comparative Runway Analysis
* Drawdown Impact Measurement
* Financial Risk Assessment

⸻

🎯 Problem Statement

Traditional budgeting applications focus primarily on recording transactions and reviewing historical data.

However, individuals often struggle to answer critical questions such as:

* How long will my savings last?
* What happens if my income stops?
* Can I afford a major expense next month?
* How does inflation impact my runway?
* What is my current financial burn rate?

Finance Ledger App addresses these challenges by combining financial tracking with predictive analytics and scenario-based planning.

⸻

🏗️ Application Modules

Dashboard

The dashboard acts as the command center of the application.

Components

* Dashboard Metrics
* Cashflow Forecast Chart
* Income vs Expense Visualization
* Recent Transactions Table

⸻

Ledger

The ledger module allows users to maintain complete control over their income and expenses.

Components

* Income Form
* Expense Form
* Transaction History Table
* Dynamic Financial Tracking

⸻

Forecast

Forecasting provides forward-looking financial visibility.

Components

* Forecast Metrics
* Runway Projection Chart
* Financial Summary Cards

⸻

Sandbox

The sandbox provides a safe environment for financial experimentation.

Components

* Scenario Controls
* Scenario Metrics
* Comparison Charts
* Projection Result Analysis

⸻

🧮 Financial Calculations

Cashflow Formula

Ending Balance =
Beginning Balance
+ Income
- Expenses

Runway Formula

Runway (Months) =
Available Savings
÷
Monthly Burn Rate

Forecast Engine

The forecasting engine processes:

* Recurring Income
* Fixed Expenses
* Variable Expenses
* Scenario Modifiers
* Inflation Adjustments

to generate multi-year financial projections.

⸻

🛠️ Tech Stack

Frontend

* ReactJS
* Vite
* JavaScript (ES6+)

Styling

* Tailwind CSS

Routing

* React Router DOM

Data Visualization

* Recharts

Icons

* React Icons

Storage

* Browser Local Storage (via `useLocalStorage` hook for UI state persistence)

Custom Hooks

* `useProjection` - Memoized cashflow projection with runway metrics
* `useLocalStorage` - Auto-sync state to localStorage with JSON serialization

⸻

📂 Project Structure

src
│
├── components
│
├── common
│   ├── Sidebar
│   ├── SearchBar
│   └── Layout Components
│
├── dashboard
│   ├── Metric Cards
│   ├── Forecast Charts
│   └── Transaction Tables
│
├── ledger
│   ├── Ledger Header
│   ├── Income Form
│   ├── Expense Form
│   └── Transaction History
│
├── forecast
│   ├── Forecast Metrics
│   ├── Runway Chart
│   └── Forecast Summary
│
├── sandbox
│   ├── Sandbox Header
│   ├── Scenario Controls
│   ├── Impact Metrics
│   ├── Comparison Charts
│   └── Result Cards
│
├── hooks
│   ├── useProjection.js
│   └── useLocalStorage.js
│
├── utils
│   ├── projectCashflow.js
│   ├── calcRunway.js
│   ├── amortize.js
│   ├── resolveFrequency.js
│   └── encryptExport.js
│
├── store
│   └── useLedgerStore.js
│
├── pages
├── routes
├── layouts
└── App.jsx

⸻

🔒 Privacy First Design

Unlike traditional finance applications, Finance Ledger App operates entirely within the browser.

Benefits

✅ No backend required

✅ No external database

✅ No personal financial data leaves the device

✅ Instant calculations

✅ Offline-capable architecture

⸻

📱 Responsive User Experience

The application is fully responsive and optimized for:

* Desktop Devices
* Tablets
* Mobile Devices
* Large Displays

⸻

🔧 UI Enhancements

* **Collapsible Sidebar** - Persistent sidebar state via `useLocalStorage` hook, remembers user preference across sessions
* **Keyboard Accessible** - ARIA labels and focus management for sidebar toggle
* **Smooth Transitions** - 300ms animated sidebar collapse/expand

⸻

🚀 Installation

Clone the repository:

git clone https://github.com/tanmay01-D3V/Finance-Ledger-App.git

Navigate into the project:

cd Finance-Ledger-App

Install dependencies:

npm install

Start development server:

npm run dev

Create production build:

npm run build

Preview production build:

npm run preview

⸻

🌐 Deployment

This project is deployed on Vercel.

Live Application

https://finance-ledger-app.vercel.app

⸻

🎓 Academic Context

Course: B.Tech Computer Science & Engineering

Semester: II

Technology: ReactJS

Project Type: Frontend Case Study Project

Institution: ITM Skills University

⸻

👨‍💻 Author

Tanmay Sherkar

Aspiring Software Engineer passionate about:

* Full Stack Development
* Financial Technology (FinTech)
* Data Structures & Algorithms
* Cloud & DevOps
* Artificial Intelligence

⸻

⭐ Future Enhancements

* Authentication System
* Multi-Currency Support
* Investment Tracking
* Goal-Based Budgeting
* PDF Report Generation
* AI-Powered Financial Insights
* Data Export & Import
* Encrypted Local Backups

⸻

📜 License

This project is developed for educational and academic purposes.

Feel free to fork, learn, and build upon the concepts demonstrated in this application.

