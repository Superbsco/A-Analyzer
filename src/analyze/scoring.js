// src/analyze/scoring.js
function calculateCompositeScoreWithWeights(stock, weights) {
  const volRatio = stock.f62 || 0;      // 量比
  const turnover = stock.f7 || 0;       // 换手率
  const turnoverVal = stock.f8 || 0;    // 换手金额（示例字段）
  const amplitude = stock.f9 || 0;      // 振幅（示例字段）

  const score =
    (volRatio * (weights.volRatio || 0)) +
    (turnover * (weights.turnover || 0)) +
    (turnoverVal * (weights.turnoverVal || 0)) +
    (amplitude * (weights.amplitude || 0));

  return score;
}

module.exports = { calculateCompositeScoreWithWeights };
