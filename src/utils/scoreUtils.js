function calculateScoreAndRecommendation({
  rsi6,
  rsi14,
  dif,
  dea,
  macd,
  momentum5,
  pct3,
  pct1,
  priceTrend,
  volumeTrend,
  volatility,
  closes
}) {
  let score = 50;

  // RSI
  if (rsi6 < 30) score += 15;
  else if (rsi6 > 80) score -= 10;

  if (rsi14 < 35) score += 10;
  else if (rsi14 > 75) score -= 8;

  // MACD
  if (dif > dea && macd > 0) score += 15;
  else if (dif < dea && macd < 0) score -= 10;

  // 动量与涨幅
  if (momentum5 > 0) score += 8;
  if (pct3 > 0.02) score += 8;
  else if (pct3 < -0.02) score -= 8;

  if (pct1 > 0.01) score += 5;
  else if (pct1 < -0.01) score -= 5;

  // 趋势
  if (priceTrend > 0.05) score += 8;
  else if (priceTrend < -0.05) score -= 8;

  if (volumeTrend === "increasing") score += 5;

  // 波动率（过高扣分）
  if (volatility > 0.2) score -= 5;

  // 近期高低点位置
  if (closes?.length >= 5) {
    const last = closes.at(-1);
    const max5 = Math.max(...closes.slice(-5));
    const min5 = Math.min(...closes.slice(-5));
    if (last >= max5) score += 3;
    if (last <= min5) score -= 3;
  }

  score = Math.max(0, Math.min(100, score));

  let star = 0;
  if (score >= 90) star = 5;
  else if (score >= 80) star = 4;
  else if (score >= 70) star = 3;
  else if (score >= 60) star = 2;
  else if (score >= 50) star = 1;

  const recommendation =
    star === 5 ? "五星强烈推荐" :
    star === 4 ? "四星推荐" :
    star === 3 ? "三星推荐" :
    star === 2 ? "一星观望" :
    star === 1 ? "仅供参考" :
    "不推荐";

  return { score, star, recommendation };
}

module.exports = { calculateScoreAndRecommendation };
