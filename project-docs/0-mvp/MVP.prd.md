# Requirements

The FinCompass MVP is centered around manual finance tracking, asset analysis, and experimenting with modern web and AI technologies. Requirements are prioritized below:

### Must Have

- Manual entry of incomes, expenses, and investments with category tagging
- Secure account and card management with encrypted storage
- Asset tracking with configurable expense types (e.g., house tax, rent)
- Income configuration (salary, bonuses, variable pay)
- Recurring payment tracking (e.g., loans)
- Transaction mapping to accounts, assets, and categories
- Interactive dashboards with time-based views (monthly, weekly, etc.)
- Daily reminder for finance tracking
- Expenditure analysis with category-wise breakdowns
- Currency selection at signup (non-changeable later)
- Insurance policy tracking with file upload support
- Local-only bill reminder system (mobile, OTT, Wi-Fi, etc.)
- Asset closure functionality
- Basic PostgreSQL schema for all tracked entities
- React + Zustand frontend with Shadcn UI and Amcharts
- Express backend for auth and data APIs
- FastAPI-based chatbot using Agno and RAG logic
- Socket.IO integration for live dashboard updates

### Should Have

- Asset performance and insurance profitability analytics
- Home/car loan, FD, and share calculators
- Search/filter/sort functionality across transactions
- Role-based access control (minimal - for multi-user experimentation)

### Could Have

- Export/import of data to JSON or CSV
- Theme customizations
- Progressive Web App (PWA) support for offline usage

### Won't Have (for MVP)

- Automated bank syncing or scraping
- Cloud hosting and CI/CD pipelines
- Payment gateway or subscriptions
