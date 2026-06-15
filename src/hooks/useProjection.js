import { useMemo } from "react";
import { useLedgerStore } from "../store/useLedgerStore.js";
import { projectCashflow, computeCurrentBalance } from "../utils/projectCashflow.js";
import { calcRunway } from "../utils/calcRunway.js";

/**
 * Memoized cashflow projection hook.
 * Returns baseline and stressed projections with runway metrics.
 *
 * @param {Object} [options]
 * @param {number} [options.historicalMonths=6]
 * @param {number} [options.projectionMonths=12]
 * @param {number} [options.horizonYears=3] - For multi-year runway chart
 */
export function useProjection({
  historicalMonths = 6,
  projectionMonths = 12,
  horizonYears = 3
} = {}) {
  const startingBalance = useLedgerStore((s) => s.startingBalance);
  const transactions = useLedgerStore((s) => s.transactions);
  const loans = useLedgerStore((s) => s.loans);
  const recurringItems = useLedgerStore((s) => s.recurringItems);
  const scenario = useLedgerStore((s) => s.scenario);
  const currency = useLedgerStore((s) => s.currency);
  const targetRunway = useLedgerStore((s) => s.targetRunway);

  return useMemo(() => {
    const anchorMonth =
      transactions
        .map((t) => t.date.slice(0, 7))
        .sort()
        .pop() || "2026-06";

    const baseParams = {
      startingBalance,
      transactions,
      historicalMonths,
      projectionMonths,
      anchorMonth,
      loans,
      recurringItems
    };

    const baseline = projectCashflow({ ...baseParams, scenario: null });
    const stressed = projectCashflow({ ...baseParams, scenario });

    const longHorizon = projectCashflow({
      ...baseParams,
      historicalMonths: 0,
      projectionMonths: horizonYears * 12,
      scenario: null
    });

    const currentBalance = computeCurrentBalance(startingBalance, transactions);
    const baselineRunway = calcRunway({
      projection: baseline.months,
      startMonthKey: anchorMonth
    });
    const stressedRunway = calcRunway({
      projection: stressed.months,
      startMonthKey: anchorMonth
    });

    const formatCurrency = (val, opts = {}) =>
      `${currency}${Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: opts.decimals ?? 0,
        maximumFractionDigits: opts.decimals ?? 0
      })}`;

    const runwayImpact =
      Number.isFinite(baselineRunway.runwayMonths) &&
      Number.isFinite(stressedRunway.runwayMonths)
        ? stressedRunway.runwayMonths - baselineRunway.runwayMonths
        : 0;

    const maxDrawdown = stressed.summary.maxDrawdown;

    const interestLoss = stressed.summary.totalInterestPaid - baseline.summary.totalInterestPaid;

    return {
      baseline,
      stressed,
      longHorizon,
      baselineRunway,
      stressedRunway,
      currentBalance,
      targetRunway,
      currency,
      formatCurrency,
      runwayImpact,
      maxDrawdown,
      interestLoss,
      anchorMonth
    };
  }, [
    startingBalance,
    transactions,
    loans,
    recurringItems,
    scenario,
    currency,
    targetRunway,
    historicalMonths,
    projectionMonths,
    horizonYears
  ]);
}

export default useProjection;
