// scripts/autoTuneWeights.js
const fs = require("fs");
const path = require("path");
const { getStockList } = require("../src/tools/fetchStockList");
const { analyzeStock } = require("../src/analyze/analyzeStock");
const { calculateCompositeScoreWithWeights } = require("../src/analyze/scoring");

const logFile = path.resolve(__dirname, "autoTune.log");

function log(message) {
  console.log(message);
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
}

async function autoTuneWeights() {
  log("=== 自动调参开始 ===");

  const stocks = await getStockList();

  const weightOptions = [0.1, 0.3, 0.5, 0.7, 0.9];
  let bestConfig = null;
  let bestScore = -Infinity;

  for (const wVolRatio of weightOptions) {
    for (const wTurnover of weightOptions) {
      for (const wTurnoverVal of weightOptions) {
        for (const wAmplitude of weightOptions) {
          const sum = wVolRatio + wTurnover + wTurnoverVal + wAmplitude;
          if (Math.abs(sum - 1) > 0.01) continue;

          log(`测试权重组合 volRatio=${wVolRatio.toFixed(2)}, turnover=${wTurnover.toFixed(2)}, turnoverVal=${wTurnoverVal.toFixed(2)}, amplitude=${wAmplitude.toFixed(2)}`);

          // 计算活跃度分数并筛选
          const scoredStocks = stocks.map(stock => ({
            ...stock,
            activityScore: calculateCompositeScoreWithWeights(stock, {
              volRatio: wVolRatio,
              turnover: wTurnover,
              turnoverVal: wTurnoverVal,
              amplitude: wAmplitude
            })
          }));

          const filtered = scoredStocks.filter(s => s.activityScore >= 0.4);

          let totalTechScore = 0;
          let count = 0;

          for (const stock of filtered) {
            try {
              const analysis = await analyzeStock(stock);
              if (analysis && analysis.score) {
                totalTechScore += analysis.score;
                count++;
              }
            } catch (err) {
              log(`分析股票失败 ${stock.f12}: ${err.message}`);
            }
          }

          if (count === 0) {
            log("无股票通过筛选，跳过该组合");
            continue;
          }

          const avgTechScore = totalTechScore / count;
          log(`平均技术评分: ${avgTechScore.toFixed(2)}, 筛选数量: ${count}`);

          if (avgTechScore > bestScore) {
            bestScore = avgTechScore;
            bestConfig = { wVolRatio, wTurnover, wTurnoverVal, wAmplitude };
            log(`新最佳配置，平均技术评分提升至 ${bestScore.toFixed(2)}`);
          }
        }
      }
    }
  }

  log("=== 自动调参结束 ===");
  log(`最佳权重配置：${JSON.stringify(bestConfig)}`);
  log(`对应平均技术评分：${bestScore.toFixed(2)}`);

  return bestConfig;
}

(async () => {
  await autoTuneWeights();
})();
