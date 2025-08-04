function calculateOBV(data) {
  if (!Array.isArray(data) || data.length < 2) return 0;

  let obv = 0;
  for (let i = 1; i < data.length; i++) {
    const today = data[i];
    const yesterday = data[i - 1];
    if (today.close > yesterday.close) {
      obv += today.volume;
    } else if (today.close < yesterday.close) {
      obv -= today.volume;
    }
  }
  return obv;
}

module.exports = { calculateOBV };
