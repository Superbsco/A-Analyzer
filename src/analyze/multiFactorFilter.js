const { calculateCompositeScoreWithWeights } = require("./scoring");
const { analyzeStock } = require("./analyzeStock");
// 引入统一的权重配置
const weights = require('../config/activeWeights');

// 多层筛选主流程
async function multiFactorFilter(stocks) {
  const scoredStocks = stocks.map(stock => ({
    ...stock,
    // 使用加权计算方法得出股票活跃度评分
    activityScore: calculateCompositeScoreWithWeights(stock, weights)
  }));

  const filteredByActivity = scoredStocks
    .filter(s => s.activityScore >= 0.4)
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 600);

  console.log(`第一层筛选：选出${filteredByActivity.length}只活跃股票`);

  const results = [];
  for (let i = 0; i < filteredByActivity.length; i++) {
    const stock = filteredByActivity[i];
    process.stdout.write(`\r技术指标分析进度：${i + 1}/${filteredByActivity.length} - ${stock.f12} ${stock.f14}`);
    const analysis = await analyzeStock(stock);
    if (analysis && analysis.score >= 60) {
      results.push(analysis);
    }
    await new Promise(r => setTimeout(r, 50));
  }
  console.log();

  return results.sort((a, b) => b.score - a.score);
}

module.exports = { multiFactorFilter };
