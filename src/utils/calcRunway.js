const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Runway exhaustion engine.
 * Accepts either a projection array or balance + burn rate.
 *
 * @param {Object} params
 * @param {number} [params.currentBalance]
 * @param {number} [params.monthlyBurn] - Positive = net cash outflow per month
 * @param {Array} [params.projection] - Output from projectCashflow().months
 * @param {string} [params.startMonthKey] - YYYY-MM anchor for exhaustion date
 * @returns {Object} Runway metrics
 */
export function calcRunway({
  projection = [],
  startMonthKey = null
}) {
  return calcRunwayFromProjection(projection, startMonthKey);
}

function calcRunwayFromProjection(projection, startMonthKey) {
  const forecastMonths = projection.filter((m) => !m.isActual);
  const lastActual = [...projection].reverse().find((m) => m.isActual);
  const currentBalance =
    lastActual?.balance ?? projection[0]?.balance ?? 0;

  const avgBurn =
    forecastMonths.length > 0
      ? forecastMonths.reduce((sum, m) => sum + Math.max(0, -m.net), 0) /
        forecastMonths.length
      : projection.reduce((sum, m) => sum + Math.max(0, -m.net), 0) /
        Math.max(projection.length, 1);

  const avgNet =
    forecastMonths.length > 0
      ? forecastMonths.reduce((sum, m) => sum + m.net, 0) / forecastMonths.length
      : 0;

  const exhaustedIndex = projection.findIndex((m) => m.balance <= 0);

  if (exhaustedIndex === -1) {
    if (avgNet >= 0) {
      return {
        runwayMonths: Infinity,
        monthsRemaining: Infinity,
        exhaustionDate: null,
        exhaustionMonth: null,
        exhaustionYear: null,
        burnRate: Math.max(0, -avgNet),
        isFullyFunded: true,
        label: "Fully Funded",
        currentBalance
      };
    }

    const remainingMonths = projection.filter((m) => !m.isActual).length;
    const runwayMonths = avgBurn > 0 ? currentBalance / avgBurn : remainingMonths;
    const anchor = startMonthKey || projection[0]?.monthKey;
    const exhaustion = anchor
      ? addMonthsToKey(anchor, Math.ceil(runwayMonths))
      : null;

    return {
      runwayMonths,
      monthsRemaining: runwayMonths,
      exhaustionDate: exhaustion?.date ?? null,
      exhaustionMonth: exhaustion?.month ?? null,
      exhaustionYear: exhaustion?.year ?? null,
      burnRate: avgBurn,
      isFullyFunded: false,
      label: formatRunwayLabel(runwayMonths),
      currentBalance
    };
  }

  const exhaustedMonth = projection[exhaustedIndex];
  const monthsRemaining = exhaustedIndex + 1;
  const parsed = parseMonthKey(exhaustedMonth.monthKey);

  return {
    runwayMonths: monthsRemaining,
    monthsRemaining,
    exhaustionDate: parsed?.date ?? null,
    exhaustionMonth: parsed?.month ?? null,
    exhaustionYear: parsed?.year ?? null,
    burnRate: avgBurn,
    isFullyFunded: false,
    label: formatRunwayLabel(monthsRemaining),
    currentBalance
  };
}

function formatRunwayLabel(months) {
  if (!Number.isFinite(months)) return "Fully Funded";
  if (months <= 0) return "Depleted";
  if (months < 1) return "< 1 Month";
  return `${Math.floor(months)} Months Remaining`;
}

function parseMonthKey(monthKey) {
  if (!monthKey) return null;
  const [year, month] = monthKey.split("-").map(Number);
  return {
    date: new Date(year, month - 1, 1),
    month: MONTH_NAMES[month - 1],
    year
  };
}

function addMonthsToKey(monthKey, monthsToAdd) {
  const [y, m] = monthKey.split("-").map(Number);
  const date = new Date(y, m - 1 + monthsToAdd, 1);
  return {
    date,
    month: MONTH_NAMES[date.getMonth()],
    year: date.getFullYear()
  };
}

export default calcRunway;
