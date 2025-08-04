function calculateBollingerBands(closes, period = 20) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const avg = slice.reduce((a, b) => a + b, 0) / period;
  const std = Math.sqrt(slice.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / period);

  return {
    middle: avg,
    upper: avg + 2 * std,
    lower: avg - 2 * std
  };
}

module.exports = { calculateBollingerBands };
