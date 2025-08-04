function simpleMA(data, n) {
  if (data.length < n) return null;
  const slice = data.slice(-n);
  return slice.reduce((a, b) => a + b, 0) / n;
}

function detectMACross(closes) {
  const ma5 = simpleMA(closes, 5);
  const ma10 = simpleMA(closes, 10);
  if (!ma5 || !ma10) return "无";

  if (ma5 > ma10) return "金叉";
  if (ma5 < ma10) return "死叉";
  return "无";
}

module.exports = { detectMACross };
