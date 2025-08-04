const { fetchFloatSharesFromEM } = require("./utils/fetchFloatShares");
const { getStockKline } = require("./utils/getStockKline");
const { calculateMultiPeriodIndicators } = require("./indicators/multiPeriodIndicators");
const { generateInterpretation } = require("./interpretation/indicatorInterpreter");
const { calculateFinalScore } = require('./analyze/scoreStock');

async function main() {
  const code = process.argv[2];
  if (!code) {
    console.error("请提供股票代码，例如: node singleStockQuery.js 002152");
    process.exit(1);
  }

  console.log(`\n开始查询股票 ${code} ...\n`);

  // 获取流通股本
  const { floatSharesWan, name } = await fetchFloatSharesFromEM(code);
  console.log(`${name}:流通股本:`, floatSharesWan ? `${floatSharesWan} 股` : "未获取");
  if (!floatSharesWan) {
    console.warn("⚠️ 未获取到流通股本，换手率计算可能不准确。\n");
  }

  // 获取各周期K线
  const periods = ["daily", "weekly", "monthly"];
  const periodKlines = {};
  for (const period of periods) {
    const kline = await getStockKline(code, period);
    if (!kline || kline.length === 0) {
      console.warn(`未获取到 ${period} K线数据`);
    }
    periodKlines[period] = kline;
  }

  // 指标计算
  const indicatorResults = calculateMultiPeriodIndicators(periodKlines, floatSharesWan);

  // 输出结果
  for (const period of periods) {
    const indicators = indicatorResults[period];
    if (!indicators) {
      console.log(`=== ${label} 指标 ===\n无数据\n`);
      continue;
    }

    console.log(`=== ${period === "daily" ? "日线" : period === "weekly" ? "周线" : "月线"} 指标 ===`);
    console.log(`均线交叉: ${indicators.maCross}`);
    console.log(`MACD: ${indicators.macd.macd.toFixed(2)}, 信号线: ${indicators.macd.signal.toFixed(2)}, 柱状图: ${indicators.macd.histogram.toFixed(2)}`);
    console.log(`RSI(14): ${indicators.rsi.toFixed(2)}`);
    console.log(`KDJ: K=${indicators.kdj.K.toFixed(2)}, D=${indicators.kdj.D.toFixed(2)}, J=${indicators.kdj.J.toFixed(2)}`);
    console.log(`布林带上轨: ${indicators.boll.upperBand.toFixed(2)}, 中轨: ${indicators.boll.middleBand.toFixed(2)}, 下轨: ${indicators.boll.lowerBand.toFixed(2)}`);
    console.log(`OBV: ${indicators.obv}`);
    console.log(`成交量趋势: ${indicators.volumeTrend}`);
    console.log(`振幅(近5日均值): ${indicators.amplitude !== null ? indicators.amplitude + "%" : "无数据"}`);
    console.log(`换手率(最新日): ${indicators.turnoverRate !== null ? indicators.turnoverRate + "%" : "无数据"}`);

    const interpretation = generateInterpretation(indicators, period);
    console.log(`=== ${period === "daily" ? "日线" : period === "weekly" ? "周线" : "月线"} 技术指标解读 ===`);
    console.log(interpretation + "\n");
 
  }

  const finalResult = calculateFinalScore(indicatorResults);

  console.log("=== 评分和推荐 ===");
  console.log(`综合评分: ${finalResult.finalScore}`);
  console.log(`星级评分: ${finalResult.finalStar} 星`);
  console.log(`推荐等级: ${finalResult.finalRecommendation}`);

  console.log("=== 各周期详细评分 ===");
  console.log(finalResult.details);

  // 显示最近交易日的基本信息（从日线中提取）
  const dailyK = periodKlines.daily?.at(-1);
  if (dailyK) {
    console.log("=== 股票基本信息（最新日） ===");
    console.log(`收盘价: ${dailyK.close}`);
    console.log(`开盘价: ${dailyK.open}`);
    console.log(`最高价: ${dailyK.high}`);
    console.log(`最低价: ${dailyK.low}`);
    console.log(`成交量: ${dailyK.volume}`);
  }
}

main();
