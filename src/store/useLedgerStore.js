import { create } from "zustand";
import { decryptExport } from "../utils/encryptExport.js";

const STORAGE_KEY = "cashflow-runway-ledger";

const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    description: "Salary Deposit",
    type: "income",
    category: "Salary",
    amount: 10000,
    date: "2026-06-01",
    status: "completed"
  },
  {
    id: "tx-2",
    description: "Office Rent",
    type: "expense",
    category: "Housing",
    amount: 3000,
    date: "2026-06-02",
    status: "completed"
  },
  {
    id: "tx-3",
    description: "SaaS Subscriptions",
    type: "expense",
    category: "SaaS",
    amount: 500,
    date: "2026-06-05",
    status: "completed"
  },
  {
    id: "tx-4",
    description: "Consulting Client A",
    type: "income",
    category: "Consulting",
    amount: 3500,
    date: "2026-06-10",
    status: "completed"
  },
  {
    id: "tx-5",
    description: "Internet & Utilities",
    type: "expense",
    category: "Utilities",
    amount: 150,
    date: "2026-06-12",
    status: "completed"
  },
  {
    id: "tx-6",
    description: "Salary Deposit",
    type: "income",
    category: "Salary",
    amount: 10000,
    date: "2026-05-01",
    status: "completed"
  },
  {
    id: "tx-7",
    description: "Office Rent",
    type: "expense",
    category: "Housing",
    amount: 3000,
    date: "2026-05-02",
    status: "completed"
  },
  {
    id: "tx-8",
    description: "Consulting Client A",
    type: "income",
    category: "Consulting",
    amount: 7000,
    date: "2026-05-15",
    status: "completed"
  },
  {
    id: "tx-9",
    description: "Google Ads Marketing",
    type: "expense",
    category: "Marketing",
    amount: 1000,
    date: "2026-05-20",
    status: "completed"
  },
  {
    id: "tx-10",
    description: "Salary Deposit",
    type: "income",
    category: "Salary",
    amount: 10000,
    date: "2026-04-01",
    status: "completed"
  },
  {
    id: "tx-11",
    description: "Office Rent",
    type: "expense",
    category: "Housing",
    amount: 3000,
    date: "2026-04-02",
    status: "completed"
  },
  {
    id: "tx-12",
    description: "Consulting Client B",
    type: "income",
    category: "Consulting",
    amount: 5500,
    date: "2026-04-12",
    status: "completed"
  },
  {
    id: "tx-13",
    description: "New Laptop Equipment",
    type: "expense",
    category: "Equipment",
    amount: 1500,
    date: "2026-04-18",
    status: "completed"
  },
  {
    id: "tx-14",
    description: "Salary Deposit",
    type: "income",
    category: "Salary",
    amount: 10000,
    date: "2026-03-01",
    status: "completed"
  },
  {
    id: "tx-15",
    description: "Office Rent",
    type: "expense",
    category: "Housing",
    amount: 3000,
    date: "2026-03-02",
    status: "completed"
  },
  {
    id: "tx-16",
    description: "Consulting Client A",
    type: "income",
    category: "Consulting",
    amount: 6000,
    date: "2026-03-10",
    status: "completed"
  },
  {
    id: "tx-17",
    description: "Exhibitor Booth",
    type: "expense",
    category: "Marketing",
    amount: 2000,
    date: "2026-03-15",
    status: "completed"
  },
  {
    id: "tx-18",
    description: "Stock Dividend Deposit",
    type: "income",
    category: "Investment",
    amount: 1500,
    date: "2026-03-25",
    status: "completed"
  },
  {
    id: "tx-19",
    description: "Salary Deposit",
    type: "income",
    category: "Salary",
    amount: 10000,
    date: "2026-02-01",
    status: "completed"
  },
  {
    id: "tx-20",
    description: "Office Rent",
    type: "expense",
    category: "Housing",
    amount: 3000,
    date: "2026-02-02",
    status: "completed"
  },
  {
    id: "tx-21",
    description: "Annual Server Hosting",
    type: "expense",
    category: "SaaS",
    amount: 1200,
    date: "2026-02-10",
    status: "completed"
  },
  {
    id: "tx-22",
    description: "Consulting Client A",
    type: "income",
    category: "Consulting",
    amount: 4000,
    date: "2026-02-15",
    status: "completed"
  },
  {
    id: "tx-23",
    description: "Salary Deposit",
    type: "income",
    category: "Salary",
    amount: 10000,
    date: "2026-01-01",
    status: "completed"
  },
  {
    id: "tx-24",
    description: "Office Rent",
    type: "expense",
    category: "Housing",
    amount: 3000,
    date: "2026-01-02",
    status: "completed"
  },
  {
    id: "tx-25",
    description: "SaaS Subscriptions",
    type: "expense",
    category: "SaaS",
    amount: 500,
    date: "2026-01-05",
    status: "completed"
  },
  {
    id: "tx-26",
    description: "Consulting Client B",
    type: "income",
    category: "Consulting",
    amount: 5000,
    date: "2026-01-12",
    status: "completed"
  }
];

const DEFAULT_STATE = {
  startingBalance: 1200000,
  transactions: INITIAL_TRANSACTIONS,
  targetRunway: 12,
  currency: "$",
  loans: [],
  recurringItems: [],
  scenario: {
    inflationRate: 3.2,
    emergencyExpense: 15000,
    jobLoss: false,
    jobLossMonth: 3,
    burnReduction: 0
  }
};

function loadPersistedState() {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function persistState(state) {
  if (typeof window === "undefined") return;

  const payload = {
    startingBalance: state.startingBalance,
    transactions: state.transactions,
    targetRunway: state.targetRunway,
    currency: state.currency,
    loans: state.loans,
    recurringItems: state.recurringItems,
    scenario: state.scenario
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export const useLedgerStore = create((set, get) => ({
  ...loadPersistedState(),

  addTransaction: (tx) =>
    set((state) => {
      const next = {
        ...state,
        transactions: [
          {
            id: `tx-${Date.now()}`,
            status: "completed",
            ...tx,
            amount: Number(tx.amount)
          },
          ...state.transactions
        ]
      };
      persistState(next);
      return next;
    }),

  deleteTransaction: (id) =>
    set((state) => {
      const next = {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== id)
      };
      persistState(next);
      return next;
    }),

  updateTransaction: (id, updatedTx) =>
    set((state) => {
      const next = {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === id
            ? { ...t, ...updatedTx, amount: Number(updatedTx.amount ?? t.amount) }
            : t
        )
      };
      persistState(next);
      return next;
    }),

  setStartingBalance: (balance) =>
    set((state) => {
      const next = { ...state, startingBalance: Number(balance) };
      persistState(next);
      return next;
    }),

  setTargetRunway: (months) =>
    set((state) => {
      const next = { ...state, targetRunway: Number(months) };
      persistState(next);
      return next;
    }),

  setCurrency: (symbol) =>
    set((state) => {
      const next = { ...state, currency: symbol };
      persistState(next);
      return next;
    }),

  setScenario: (partial) =>
    set((state) => {
      const next = {
        ...state,
        scenario: { ...state.scenario, ...partial }
      };
      persistState(next);
      return next;
    }),

  addLoan: (loan) =>
    set((state) => {
      const next = {
        ...state,
        loans: [
          ...state.loans,
          {
            id: `loan-${Date.now()}`,
            ...loan,
            principal: Number(loan.principal),
            annualRate: Number(loan.annualRate),
            termMonths: Number(loan.termMonths)
          }
        ]
      };
      persistState(next);
      return next;
    }),

  addRecurringItem: (item) =>
    set((state) => {
      const next = {
        ...state,
        recurringItems: [
          ...state.recurringItems,
          {
            id: `rec-${Date.now()}`,
            ...item,
            amount: Number(item.amount)
          }
        ]
      };
      persistState(next);
      return next;
    }),

  exportLedger: () => {
    const state = get();
    return {
      startingBalance: state.startingBalance,
      transactions: state.transactions,
      targetRunway: state.targetRunway,
      currency: state.currency,
      loans: state.loans,
      recurringItems: state.recurringItems,
      scenario: state.scenario,
      exportedAt: new Date().toISOString()
    };
  },

  importLedger: (data) =>
    set((state) => {
      const next = {
        ...state,
        startingBalance: Number(data.startingBalance ?? state.startingBalance),
        transactions: data.transactions ?? state.transactions,
        targetRunway: Number(data.targetRunway ?? state.targetRunway),
        currency: data.currency ?? state.currency,
        loans: data.loans ?? state.loans,
        recurringItems: data.recurringItems ?? state.recurringItems,
        scenario: { ...state.scenario, ...(data.scenario ?? {}) }
      };
      persistState(next);
      return next;
    }),

  importEncryptedLedger: (encryptedStr, passphrase) => {
    const data = decryptExport(encryptedStr, passphrase);
    get().importLedger(data);
    return data;
  },

  resetLedger: () =>
    set(() => {
      persistState(DEFAULT_STATE);
      return { ...DEFAULT_STATE };
    })
}));

export default useLedgerStore;
