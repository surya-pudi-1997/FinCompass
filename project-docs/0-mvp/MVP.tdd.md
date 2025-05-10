## Technical design document

### Architecture Overview

FinTracker is implemented as a full-stack monorepo application using a modular architecture. It consists of:

- A **React frontend** (Vite, TypeScript, Zustand, Shadcn UI) for a fast and modular UI
- A **Node.js + Express backend** for API handling, authentication, data persistence, and websockets
- A **PostgreSQL database** for structured, relational financial data storage
- A **FastAPI + Python service** for RAG-based chatbot functionality powered by Agno
- **Socket.IO** for pushing live updates to dashboards
- **Amcharts** for financial visualizations

The diagram below outlines key components and their interactions:

```
@startuml
package "Frontend (React)" {
  [Dashboard] --> [Transaction Entry]
  [Dashboard] --> [Insights Chatbot]
  [Transaction Entry] --> [API Client]
}

package "Backend (Node.js + Express)" {
  [API Server] --> [PostgreSQL]
  [API Server] --> [Auth Service]
  [API Server] --> [WebSocket Gateway]
}

package "RAG Service (FastAPI + Python)" {
  [Agno Engine] --> [Vector Store]
  [Agno Engine] --> [Finance Data Reader]
}

[Frontend (React)] --> [API Server]
[Frontend (React)] --> [WebSocket Gateway]
[Frontend (React)] --> [Agno Engine]

[API Server] --> [Agno Engine] : Optional data push
@enduml
```

### Core Data Models

Below are the core tables required to support the MVP features.

**Users**

| Column           | Type        | Notes                           |
| --------------- | ----------- | ------------------------------- |
| id              | UUID (PK)   | Primary key                     |
| email           | TEXT        | Unique email for login          |
| password_hash    | TEXT        | Argon2 hashed password          |
| full_name       | TEXT        | User's full name                |
| preferred_currency | TEXT      | e.g., USD, EUR (set at signup)  |
| created_at      | TIMESTAMPTZ | Account creation timestamp      |
| updated_at      | TIMESTAMPTZ | Last profile update timestamp   |
| is_active       | BOOLEAN     | Account status                  |
| last_login      | TIMESTAMPTZ | Last successful login timestamp |

**Accounts**

| Column         | Type        | Notes                      |
| -------------- | ----------- | -------------------------- |
| id             | UUID (PK)   | Primary key                |
| user_id        | UUID        | Foreign key to Users       |
| name           | TEXT        | Bank name or account alias |
| type           | TEXT        | e.g., Savings, Credit Card |
| balance        | DECIMAL     | Optional manual tracking   |
| encrypted_data | BYTEA       | Encrypted raw details      |
| created_at     | TIMESTAMPTZ |                            |

**Assets**

| Column     | Type        | Notes                       |
| ---------- | ----------- | --------------------------- |
| id         | UUID (PK)   |                             |
| user_id    | UUID        |                             |
| name       | TEXT        | Asset name (e.g., House #1) |
| type       | TEXT        | e.g., Real Estate, Vehicle  |
| value      | DECIMAL     | Current estimated value     |
| status     | TEXT        | Active / Sold               |
| created_at | TIMESTAMPTZ |                             |

**TransactionCategories**

| Column     | Type      | Notes                                |
| ---------- | --------- | ------------------------------------ |
| id         | UUID (PK) | Primary key                          |
| user_id    | UUID      | Foreign key to Users                 |
| name       | TEXT      | Category name (e.g., "Groceries")    |
| type       | TEXT      | Income / Expense / Investment        |
| icon       | TEXT      | Optional icon identifier             |
| created_at | TIMESTAMPTZ | Creation timestamp                 |
| is_system  | BOOLEAN   | True if system default category      |

**Transactions**

| Column      | Type        | Notes                         |
| ----------- | ----------- | ----------------------------- |
| id          | UUID (PK)   |                               |
| user_id     | UUID        |                               |
| account_id  | UUID        | FK to Accounts                |
| asset_id    | UUID        | Optional FK to Assets         |
| type        | TEXT        | Income / Expense / Investment |
| amount      | DECIMAL     |                               |
| category_id | UUID        | FK to TransactionCategories   |
| note        | TEXT        | Optional description          |
| timestamp   | TIMESTAMPTZ | When transaction occurred     |

**Insurance**

| Column          | Type        | Notes                     |
| --------------- | ----------- | ------------------------- |
| id              | UUID (PK)   |                           |
| user_id         | UUID        |                           |
| provider        | TEXT        | e.g., Aetna               |
| type            | TEXT        | Health / Auto / Life      |
| premium         | DECIMAL     | Annual or monthly premium |
| policy_doc_url  | TEXT        | Link to uploaded file     |
| payout_received | BOOLEAN     |                           |
| created_at      | TIMESTAMPTZ |                           |

**RecurringPayments**

| Column    | Type      | Notes                    |
| --------- | --------- | ------------------------ |
| id        | UUID (PK) |                          |
| user_id   | UUID      |                          |
| name      | TEXT      | e.g., Home Loan          |
| amount    | DECIMAL   |                          |
| frequency | TEXT      | Monthly / Quarterly etc. |
| due_date  | DATE      | Next due date            |

**Reminders**

| Column   | Type      | Notes                       |
| -------- | --------- | --------------------------- |
| id       | UUID (PK) |                             |
| user_id  | UUID      |                             |
| title    | TEXT      | e.g., "Pay Gas Bill"        |
| due_date | DATE      |                             |
| category | TEXT      | e.g., Utility, Subscription |

### Backend API Design

**NOTE:** All routes are prefixed with `/api` and protected via user authentication middleware.

#### Authentication

- `POST /auth/signup` – Register new user
- `POST /auth/login` – User login
- `GET /auth/me` – Fetch logged-in user profile

#### Accounts

- `GET /accounts` – List user accounts
- `POST /accounts` – Add a new account
- `PUT /accounts/:id` – Update account
- `DELETE /accounts/:id` – Delete account

#### Assets

- `GET /assets` – List all assets
- `POST /assets` – Add asset (e.g., house, car)
- `PUT /assets/:id` – Update asset
- `POST /assets/:id/close` – Mark as sold/closed

#### Transactions

- `GET /transactions?filter=...` – Filterable by date/category/type
- `POST /transactions` – Add transaction
- `DELETE /transactions/:id` – Remove transaction

#### Recurring Payments

- `GET /recurring` – List all recurring payments
- `POST /recurring` – Add new recurring entry

#### Insurance

- `GET /insurance` – List user insurance policies
- `POST /insurance` – Add new insurance
- `POST /insurance/upload` – Upload policy file

#### Reminders

- `GET /reminders` – Get all reminders
- `POST /reminders` – Add reminder

#### Analytics

- `GET /analytics/summary` – Monthly/weekly/yearly stats
- `GET /analytics/spending-breakdown` – Expense by category
- `GET /analytics/asset-performance` – ROI over time
- `GET /analytics/insurance-performance` – Compare insurance ROI vs FD

#### Socket Events

- `finance:update` – Push real-time update after transaction changes

### AI Assistant (Chatbot) Flow

This component powers contextual, data-aware financial questions like:

- "How much did I spend on OTT subscriptions last month?"
- "Is my insurance giving better returns than an FD?"

```

@startuml
actor User
User -> ReactApp : Sends financial question
ReactApp -> FastAPI (ChatAPI) : /ask?q=...
FastAPI -> Agno Engine : Embed + Search
Agno Engine -> Vector Store : Retrieve relevant chunks
Agno Engine -> LLM (OpenAI/Local) : Answer with context
LLM --> Agno Engine : Response
Agno Engine --> FastAPI : Answer
FastAPI --> ReactApp : Final Answer
@enduml
```

#### Chatbot API (FastAPI)

- `POST /ask` – Accepts user query
  - Runs embedding via Agno
  - Searches user's own financial data (JSON, table snapshots)
  - Returns a grounded, interpretable response

#### Data Pipeline

- Regular snapshot of `Transactions`, `Assets`, `Insurance`, etc.
- Preprocessed and embedded using Agno
- Indexed into FAISS or similar store
- Used in retrieval step of RAG

This makes the chatbot privacy-respecting (user-only scope) while enabling deep insight.
