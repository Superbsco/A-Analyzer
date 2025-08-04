const {
  calculateSMA,
  detectMaCross,
  calculateMACD,
  calculateRSI,
  calculateBollingerBands,
  calculateOBV,
  calculateKDJ,
  getVolumeTrend,
} = require("./singleCalculate.js");

const { calculateAmplitude, calculateTurnoverRate } = require("./extraIndicators.js");

/**
 * 计算指定周期K线数据的所有指标（增加振幅和换手率）
 * @param {Array} klineData
 * @param {number|null} floatShares 流通股本，单位股
 * @returns {Object}
 */
function calculateIndicatorsForPeriod(klineData, floatShares = null) {
  if (!klineData || klineData.length === 0) return null;

  const closePrices = klineData.map(k => k.close);
  const volumeData = klineData;

  const shortSMA = calculateSMA(closePrices, 5);
  const longSMA = calculateSMA(closePrices, 20);
  const maCross = detectMaCross(shortSMA, longSMA);

  const macd = calculateMACD(closePrices);
  const rsi = calculateRSI(closePrices);
  const boll = calculateBollingerBands(closePrices);
  const obv = calculateOBV(volumeData);
  const volumeTrend = getVolumeTrend(volumeData);
  const kdj = calculateKDJ(klineData);

  const amplitude = calculateAmplitude(klineData);
  const turnoverRate = calculateTurnoverRate(klineData, floatShares);

  return {
    maCross,
    macd,
    rsi,
    boll,
    obv,
    volumeTrend,
    kdj,
    amplitude,
    turnoverRate,
  };
}

/**
 * 多周期指标计算入口，支持传入流通股本
 * @param {Object} periodKlines { daily: [], weekly: [], monthly: [] }
 * @param {number|null} floatShares
 */
function calculateMultiPeriodIndicators(periodKlines, floatShares = null) {
  const results = {};
  for (const [period, klines] of Object.entries(periodKlines)) {
    const indicators = calculateIndicatorsForPeriod(klines, floatShares);
    results[period] = indicators;
  }
  return results;
}

module.exports = {
  calculateIndicatorsForPeriod,
  calculateMultiPeriodIndicators,
};
