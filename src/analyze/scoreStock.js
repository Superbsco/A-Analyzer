// 评分函数，保持你已有的版本不变
function scoreStock({ maCross, macd, rsi, boll, obv, volumeTrend, kdj, amplitude, turnoverRate }) {
  let score = 0;

  if (maCross === "金叉") score += 30;
  else if (maCross === "死叉") score -= 20;
  
  if (macd.histogram > 0) score += 20;

  if (rsi > 50 && rsi < 70) score += 20;
  else if (rsi >= 70) score += 10;

  if (obv > 0) score += 10;

  if (volumeTrend === "递增" || volumeTrend === "增加") score += 10;
  else if (volumeTrend === "递减" || volumeTrend === "减少") score -= 10;

  if (boll && boll.middleBand) {
    score += 10;
  }

  if (kdj) {
    const K = parseFloat(kdj.K);
    const D = parseFloat(kdj.D);
    const J = parseFloat(kdj.J);

    if (K > D && J < 100) {
      score += 15;
    } else if (K < D && J > 0) {
      score -= 15;
    }
    if (J > 100) score -= 10;
    if (J < 0) score += 10;
  }

  // 根据振幅调节分数 (假设振幅适中加分，过大减分)
  if (amplitude !== undefined && amplitude !== null) {
    if (amplitude < 5) score += 5;
    else if (amplitude > 15) score -= 5;
  }
  // 根据换手率调节分数 (适度换手率加分，极低或极高减分)
  if (turnoverRate !== undefined && turnoverRate !== null) {
    if (turnoverRate > 1 && turnoverRate < 10) score += 5;
    else if (turnoverRate <= 1) score -= 5;
    else if (turnoverRate > 20) score -= 5;
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  const star = Math.ceil(score / 20) || 1;

  let recommendation = "不推荐";
  if (score >= 80) recommendation = "五星推荐";
  else if (score >= 60) recommendation = "四星推荐";
  else if (score >= 40) recommendation = "三星推荐";
  else if (score >= 20) recommendation = "二星推荐";

  return { score, star, recommendation };
}

// 假设 indicatorResults 是多周期指标对象，结构形如你给出的示例
function calculateFinalScore(indicatorResults) {
  const dailyScore = scoreStock(indicatorResults.daily);
  const weeklyScore = scoreStock(indicatorResults.weekly);
  const monthlyScore = scoreStock(indicatorResults.monthly);

  // 加权综合评分示例（你可以根据需求调整权重）
  const finalScore = Math.round(
    dailyScore.score * 0.5 +
    weeklyScore.score * 0.3 +
    monthlyScore.score * 0.2
  );

  const finalStar = Math.ceil(finalScore / 20);
  let finalRecommendation = "不推荐";
  if (finalScore >= 80) finalRecommendation = "五星推荐";
  else if (finalScore >= 60) finalRecommendation = "四星推荐";
  else if (finalScore >= 40) finalRecommendation = "三星推荐";
  else if (finalScore >= 20) finalRecommendation = "二星推荐";

  return {
    finalScore,
    finalStar,
    finalRecommendation,
    details: {
      daily: dailyScore,
      weekly: weeklyScore,
      monthly: monthlyScore,
    }
  };
}

module.exports = { scoreStock, calculateFinalScore };
