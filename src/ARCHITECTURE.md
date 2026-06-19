# Frontend Architecture — Workflow & Data Flow

## 1. Entry Point & Routing

```
main.jsx
  │
  └──> <App />
         │
         └──> <AppRoutes />         (src/routes/AppRoutes.jsx)
                │
                └── <BrowserRouter>
                      └── <Routes>
                            └── <MainLayout>          (src/layouts/MainLayout.jsx)
                                  ├── <Sidebar />
                                  ├── <Header />
                                  └── <Outlet />
                                        ├── /          → Dashboard
                                        ├── /ledger    → Ledger
                                        ├── /forecast  → Forecast
                                        ├── /sandbox   → Sandbox
                                        └── /settings  → Settings
```

---

## 2. Store (Global State)

```
 ┌──────────────────────────────────────────────────────────────────┐
 │                   useLedgerStore (Zustand)                       │
 │                  src/store/useLedgerStore.js                     │
 │                                                                  │
 │   STATE:                                                         │
 │   ┌──────────────────────────────────────────────────────────┐   │
 │   │  startingBalance: number          targetRunway: number   │   │
 │   │  transactions:  Transaction[]     currency: string       │   │
 │   │  loans:         Loan[]            scenario: Scenario     │   │
 │   │  recurringItems: RecurringItem[]                         │   │
 │   └──────────────────────────────────────────────────────────┘   │
 │                                                                  │
 │   ACTIONS:                                                       │
 │   ┌──────────────────────────────────────────────────────────┐   │
 │   │  addTransaction     deleteTransaction     updateTx       │   │
 │   │  setStartingBalance setTargetRunway       setCurrency    │   │
 │   │  setScenario        addLoan               addRecurring   │   │
 │   │  exportLedger       importLedger    importEncryptedLedger│   │
 │   │  resetLedger                                             │   │
 │   └──────────────────────────────────────────────────────────┘   │
 │                                                                  │
 │   PERSISTENCE:                                                   │
 │   ┌──────────────────────────────────────────────────────────┐   │
 │   │  localStorage key: "cashflow-runway-ledger"              │   │
 │   │  loadPersistedState() at init                            │   │
 │   │  persistState() after every mutation                     │   │
 │   └──────────────────────────────────────────────────────────┘   │
 └──────────────────────────────────────────────────────────────────┘

    ●──────────●──────────●──────────●──────────●
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
  Pages    Components   Hooks    Settings   Export/Import
             (direct)           (via useProjection)
```

---

## 3. Hooks (Computation Layer)

### useProjection — The Primary Computation Hub
```
src/hooks/useProjection.js
                        ┌─────────────────────────────────────┐
                        │  useProjection({                    │
                        │    historicalMonths: 6,             │
                        │    projectionMonths: 12,            │
                        │    horizonYears: 3                  │
                        │  })                                 │
                        │                                     │
                        │  SELECTS 6 STORE SLICES:            │
                        │  ├─ startingBalance                 │
                        │  ├─ transactions                    │
                        │  ├─ loans                           │
                        │  ├─ recurringItems                  │
                        │  ├─ scenario                        │
                        │  ├─ currency                        │
                        │  └─ targetRunway                    │
                        │                                     │
                        │  RETURNS (memoized via useMemo):    │
                        │  ├─ baseline        → projectCashflow(without scenario)
                        │  ├─ stressed        → projectCashflow(with scenario)
                        │  ├─ longHorizon     → multi-year projection
                        │  ├─ baselineRunway  → calcRunway(baseline)
                        │  ├─ stressedRunway  → calcRunway(stressed)
                        │  ├─ currentBalance  → computeCurrentBalance()
                        │  ├─ formatCurrency(val)
                        │  ├─ runwayImpact    → stressed - baseline
                        │  ├─ maxDrawdown     → from projection
                        │  ├─ interestLoss    → from loans
                        │  └─ anchorMonth     → latest transaction month
                        └─────────────────────────────────────┘
```

### useLocalStorage — Generic Storage Sync
```
src/hooks/useLocalStorage.js
  Returns: [value, setValue, removeValue]
  Auto-syncs to localStorage with JSON serialization
  Listens to window "storage" events for cross-tab sync
  (Used as utility; store handles its own persistence)
```

---

## 4. Utils — Pure Computation (Stateless Functions)

```
src/utils/
  │
  ├── projectCashflow.js
  │     ┌────────────────────────────────────────────┐
  │     │  projectCashflow(params)                   │
  │     │    Loops through historical months (actuals)│
  │     │    then forecast months (projected) with:   │
  │     │      - Monthly averages from transactions   │
  │     │      - Inflation multiplier (from scenario) │
  │     │      - Emergency expense (from scenario)    │
  │     │      - Job loss adjustment (from scenario)  │
  │     │      - Burn reduction (from scenario)       │
  │     │      - Recurring items                      │
  │     │      - Loan amortization schedules          │
  │     │    Returns: { months[], summary{} }         │
  │     │                                             │
  │     │  computeCurrentBalance(transactions,        │
  │     │    startingBalance) → number                │
  │     └────────────────────────────────────────────┘
  │            │ depends on
  │            ▼
  ├── calcRunway.js
  │     ┌────────────────────────────────────────────┐
  │     │  calcRunway({ projection[] })              │
  │     │    or                                       │
  │     │  calcRunway({ currentBalance, monthlyBurn })│
  │     │                                             │
  │     │  Finds first month where balance <= 0       │
  │     │  Returns: {                                 │
  │     │    runwayMonths, monthsRemaining,           │
  │     │    exhaustionDate, exhaustionMonth,         │
  │     │    exhaustionYear, burnRate,                │
  │     │    isFullyFunded, label                     │
  │     │  }                                         │
  │     └────────────────────────────────────────────┘
  │
  ├── amortize.js
  │     ┌────────────────────────────────────────────┐
  │     │  amortize({principal, annualRate,          │
  │     │    termMonths, startMonth})                │
  │     │  Returns: { monthlyPayment, schedule[],     │
  │     │             totalInterest }                 │
  │     │                                             │
  │     │  getLoanPaymentForMonth(loans, monthKey)    │
  │     │  → total payment for that month             │
  │     └────────────────────────────────────────────┘
  │
  ├── resolveFrequency.js
  │     ┌────────────────────────────────────────────┐
  │     │  resolveFrequency(amount, frequency)       │
  │     │  Maps: weekly→52/12, biweekly→26/12,       │
  │     │        monthly→1, quarterly→1/3,           │
  │     │        annual/yearly→1/12, one-time→0      │
  │     │  Returns: monthly equivalent amount        │
  │     └────────────────────────────────────────────┘
  │
  └── encryptExport.js
        ┌────────────────────────────────────────────┐
        │  encryptExport(data, passphrase)           │
        │    → "CFR1:" + AES-encrypted string        │
        │                                             │
        │  decryptExport(encryptedStr, passphrase)    │
        │    → parsed JSON object                     │
        │                                             │
        │  downloadEncryptedExport(data, passphrase,  │
        │    filename) → triggers .cfr file download  │
        └────────────────────────────────────────────┘
```

**Dependency Chain within Utils:**
```
resolveFrequency.js  ←  projectCashflow.js  ←  useProjection hook
amortize.js          ↖                     ↖         │
encryptExport.js     ←  store actions (export/import) │
calcRunway.js        ←  useProjection hook ───────────┘
```

---

## 5. Complete Data Flow (End to End)

```
                        ┌─────────────────────┐
                        │    localStorage      │
                        │ "cashflow-runway-    │
                        │    ledger"           │
                        └──────┬──────────────┘
                               │ read/write
                               ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                     useLedgerStore                              │
  │                     (Single Source of Truth)                    │
  │  ┌─────────────────────────────────────────────────────────┐    │
  │  │  State + Actions                                         │   │
  │  └─────────────────────────────────────────────────────────┘    │
  └────┬──────────────┬──────────────────┬─────────────────────────┘
       │              │                  │
       │ direct       │ via              │ via utility imports
       │ subscription │ useProjection    │ (encryptExport.js)
       ▼              ▼                  ▼
  ┌──────────┐ ┌──────────────┐ ┌─────────────────┐
  │ COMPONENTS│ │   HOOK      │ │   STORE         │
  │ (direct)  │ │useProjection│ │   ACTIONS        │
  │           │ │             │ │   (exportLedger, │
  │ IncomeForm│ │   Calls:    │ │    importLedger) │
  │ ExpenseForm││ ─ projectCf │ │                  │
  │ TxHistory │ │ ─ calcRunway│ │   encryptExport  │
  │ MetricsGrid││ ─ compute.. │ │   decryptExport  │
  │ Charts    │ │             │ │                  │
  │ Scenario  │ │   Returns:  │ └─────────────────┘
  │ Controls  │ │ baseline,   │
  │ Settings  │ │ stressed,   │
  └──────────┘ │ runway, etc. │
               └──────────────┘
```

### Page → Data Wiring

```
┌────────────┬──────────────────────┬──────────────────────────────────┐
│ Page       │ Components Used      │ Data Source                      │
├────────────┼──────────────────────┼──────────────────────────────────┤
│ Dashboard  │ DashboardHeader      │ useProjection()                  │
│            │ MetricsGrid          │ useProjection()                  │
│            │ CashflowForecastChart│ useProjection()                  │
│            │ IncomeExpenseChart   │ store (direct) + useProjection() │
│            │ RecentTransactions   │ store (direct)                   │
├────────────┼──────────────────────┼──────────────────────────────────┤
│ Ledger     │ LedgerHeader         │ Axios (quote API)                │
│            │ IncomeForm           │ store actions (addTransaction)   │
│            │ ExpenseForm          │ store actions (addTransaction)   │
│            │ TransactionHistory   │ store (direct) + exportLedger    │
├────────────┼──────────────────────┼──────────────────────────────────┤
│ Forecast   │ ForecastMetrics      │ useProjection()                  │
│            │ RunwayChart          │ useProjection()                  │
│            │ ForecastSummary      │ useProjection()                  │
├────────────┼──────────────────────┼──────────────────────────────────┤
│ Sandbox    │ SandboxHeader        │ store actions (setScenario)      │
│            │ ScenarioControls     │ store (direct)                   │
│            │ SandboxMetrics       │ useProjection()                  │
│            │ ScenarioComparison   │ useProjection()                  │
├────────────┼──────────────────────┼──────────────────────────────────┤
│ Settings   │ (inline forms)       │ store (direct)                   │
└────────────┴──────────────────────┴──────────────────────────────────┘
```

---

## 6. Connection Patterns (Summary)

### Pattern 1: Direct Store Subscription
```
Component ──selectors──> useLedgerStore ──mutations──> persistState()
                                                              │
                                                              ▼
                                                         localStorage
```
Used by: `IncomeForm`, `ExpenseForm`, `TransactionHistory`, `Settings`, `ScenarioControls`

### Pattern 2: Hook-Mediated (Computed Data)
```
Component ──> useProjection() ──selectors──> useLedgerStore
                              │
                              ├──> projectCashflow()
                              ├──> calcRunway()
                              └──> computeCurrentBalance()
```
Used by: `MetricsGrid`, `Charts`, `ForecastMetrics`, `RunwayChart`, `SandboxMetrics`

### Pattern 3: Store → Utils (Export/Import)
```
Store Action ──> encryptExport.js ──> download .cfr file
Store Action ──> decryptExport.js <── upload .cfr file
```

---

## 7. File Map (Excluding pages/ & components/)

```
src/
  ├── main.jsx                          # ReactDOM.createRoot entry
  ├── App.jsx                           # Root (<AppRoutes />)
  ├── index.css                         # Tailwind directives
  │
  ├── routes/
  │   └── AppRoutes.jsx                 # BrowserRouter + 5 routes
  │
  ├── layouts/
  │   └── MainLayout.jsx                # Sidebar + Header + Outlet
  │
  ├── store/
  │   ├── useLedgerStore.js             # Core Zustand store (442 lines)
  │   └── useFinancialStore.js          # Re-export alias
  │
  ├── hooks/
  │   ├── useProjection.js              # Memoized cashflow + runway
  │   └── useLocalStorage.js            # Generic localStorage sync
  │
  └── utils/
      ├── projectCashflow.js            # Core projection engine
      ├── calcRunway.js                 # Runway exhaustion logic
      ├── amortize.js                   # Loan amortization schedule
      ├── resolveFrequency.js           # Frequency → monthly multiplier
      └── encryptExport.js              # AES encrypt/decrypt + download
```
