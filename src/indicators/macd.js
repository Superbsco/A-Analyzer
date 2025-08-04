function calcEMA(arr, n) {
  let ema = arr[0];
  const alpha = 2 / (n + 1);
  for (let i = 1; i < arr.length; i++) {
    ema = alpha * arr[i] + (1 - alpha) * ema;
  }
  return ema;
}

function calculateMACD(arr) {
  if (arr.length < 26) return { dif: 0, dea: 0, macd: 0 };
  const ema12 = calcEMA(arr.slice(-26), 12);
  const ema26 = calcEMA(arr.slice(-26), 26);
  const dif = ema12 - ema26;

  let dea = dif;
  for (let i = arr.length - 9; i < arr.length; i++) {
    if (i < 0) continue;
    dea = dea * 0.8 + dif * 0.2;
  }

  const macd = 2 * (dif - dea);
  return { dif, dea, macd };
}

module.exports = { calculateMACD };
