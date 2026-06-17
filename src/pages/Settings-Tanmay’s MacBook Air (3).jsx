import { useState } from "react";
import { useLedgerStore } from "../store/useLedgerStore";
import { FiSettings, FiDollarSign, FiCalendar, FiShield } from "react-icons/fi";

const Settings = () => {
  const {
    startingBalance,
    targetRunway,
    currency,
    setStartingBalance,
    setTargetRunway,
    setCurrency
  } = useLedgerStore();

  const [localBalance, setLocalBalance] = useState(startingBalance);
  const [localRunway, setLocalRunway] = useState(targetRunway);
  const [localCurrency, setLocalCurrency] = useState(currency);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setStartingBalance(localBalance);
    setTargetRunway(localRunway);
    setCurrency(localCurrency);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-black text-white rounded-2xl">
          <FiSettings size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            System Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure default variables and global model parameters.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          {/* Cash Balance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-50 pb-6">
            <div className="space-y-1">
              <label className="font-semibold text-gray-800 flex items-center gap-2">
                <FiDollarSign className="text-gray-500" />
                Starting Capital
              </label>
              <p className="text-xs text-gray-500">
                Initial runway cash reserves before transaction adjustments.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">
                  {localCurrency}
                </span>
                <input
                  type="number"
                  value={localBalance}
                  onChange={(e) => setLocalBalance(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="1200000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Runway Target */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-gray-50 pb-6">
            <div className="space-y-1">
              <label className="font-semibold text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-gray-500" />
                Target Runway (Months)
              </label>
              <p className="text-xs text-gray-500">
                Minimum months of runway target. Alerts trigger below this limit.
              </p>
            </div>
            <div className="md:col-span-2">
              <input
                type="number"
                min="1"
                max="120"
                value={localRunway}
                onChange={(e) => setLocalRunway(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="12"
                required
              />
            </div>
          </div>

          {/* Currency Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <label className="font-semibold text-gray-800 flex items-center gap-2">
                <FiShield className="text-gray-500" />
                Preferred Currency Symbol
              </label>
              <p className="text-xs text-gray-500">
                Display currency formatting symbol across the application.
              </p>
            </div>
            <div className="md:col-span-2">
              <select
                value={localCurrency}
                onChange={(e) => setLocalCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="¥">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          {showSavedToast && (
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl animate-fade-in">
              Settings saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
