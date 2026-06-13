import { create } from "zustand";

// Seed data from Jan 2026 to Jun 2026 to make charts look highly professional and populated
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
  // May 2026
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
  // April 2026
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
  // March 2026
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
  // February 2026
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
  // January 2026
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

export const useFinancialStore = create((set) => ({
  startingBalance: 1200000,
  transactions: INITIAL_TRANSACTIONS,
  targetRunway: 12, // target runway in months
  currency: "$",

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [
        {
          id: `tx-${Date.now()}`,
          ...tx,
          amount: Number(tx.amount)
        },
        ...state.transactions
      ]
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    })),

  updateTransaction: (id, updatedTx) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTx, amount: Number(updatedTx.amount || t.amount) } : t
      )
    })),

  setStartingBalance: (balance) =>
    set({ startingBalance: Number(balance) }),

  setTargetRunway: (months) => set({ targetRunway: Number(months) }),
  setCurrency: (symbol) => set({ currency: symbol })
}));
