const FREQUENCY_MULTIPLIERS = {
  weekly: 52 / 12,
  biweekly: 26 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  annual: 1 / 12,
  yearly: 1 / 12,
  "one-time": 0
};

/**
 * Maps weekly/quarterly/etc. amounts to an equivalent monthly amount.
 * @param {number} amount - Amount per frequency period
 * @param {string} frequency - weekly | biweekly | monthly | quarterly | annual | yearly | one-time
 * @returns {number} Normalized monthly amount
 */
export function resolveFrequency(amount, frequency = "monthly") {
  const normalized = String(frequency).toLowerCase().trim();
  const multiplier = FREQUENCY_MULTIPLIERS[normalized];

  if (multiplier === undefined) {
    throw new Error(`Unsupported frequency: ${frequency}`);
  }

  return Number(amount) * multiplier;
}

export default resolveFrequency;
