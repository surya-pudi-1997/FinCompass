# FinCompass

A finance management application designed to help you track your incomes, expenditures, and investments without requiring connections to your banking applications abd a RAG based AI tool integrated.

## Key Features

- **Account and Card Management:** Securely add details for your various bank accounts and credit cards. All details are saved in an encrypted format for your privacy and can be viewed by you.
- **Asset Tracking:** Configure and manage your assets, such as houses, with comprehensive details. Each asset supports trackers for expenses like House Tax, rent, Electricity Bills, house help, and more.
- **Income Management:** Easily configure your regular salary, including options to add bonuses and variable pay.
- **Recurring Payments:** Keep track of your recurring financial obligations, such as loans.
- **Manual Finance Entry:** A user-friendly interface allows you to manually add your daily financial transactions. Categorize these entries using provided defaults or create your own custom categories.
- **Transaction Mapping:** Link each income, expenditure, or investment entry to a specific bank account, category, and optionally, an asset you own.
- **Financial Calculators:** Access a suite of helpful calculators for:
  - Home Loans
  - Car Loans
  - Fixed Deposits (FD)
  - Shares
- **Bill Payment Reminders:** Set up reminders for various bill payments, including:
  - Water bills
  - OTT subscriptions
  - Mobile recharges
  - Wi-Fi bills
  - Gas bills
  - Cable bills
- **Daily Finance Tracking Reminder:** Receive a daily prompt to ensure you stay on top of your finances.
- **Interactive Dashboards:** Visualize your financial data with interactive dashboards that provide insights for different timeframes:
  - Monthly
  - Weekly
  - Quarterly
  - Yearly
- **Expenditure Analysis:** Understand where your money is going with clear breakdowns of expenditures across different categories.
- **Asset Performance Tracking:** Monitor the financial performance of each of your assets.
- **Insurance Management:** Add details of your insurance policies and upload relevant policy documents for easy access.
- **Insurance and Asset Performance Analysis:** Track gains from insurance payouts and analyze whether your insurance policies have been profitable compared to alternatives like Fixed Deposits. The same analysis extends to your assets.
- **AI-Powered Financial Insights:** Leverage a RAG-based LLM chatbot to gain deeper insights and understanding of your financial data.
- **Currency Configuration:** Choose your preferred currency during signup, which will be consistently applied throughout the application. Currency changes are not supported post-signup.
- **Asset Closure:** Easily mark assets as closed or sold when they are no longer part of your portfolio.

## Tech Stack

- **Monorepo:** Turbo
- **Frontend:** React + TypeScript + Vite
- **Component Library:** MUI
- **State Management:** Zustand
- **Charting:** Amcharts
- **Database:** PostgreSQL
- **Backend (Auth & Tracking):** Node.js + Express + TypeScript
- **Chatbot + RAG:** Python + FastAPI + Agno
- **Web Sockets:** Socket.IO (client and server)
