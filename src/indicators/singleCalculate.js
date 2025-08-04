/**
 * 计算简单移动平均线 SMA
 * @param {Array} data 数字数组，如收盘价
 * @param {number} period 计算周期
 * @returns {Array} SMA 数组，前期不足返回 null
 */
function calculateSMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j];
    result.push(sum / period);
  }
  return result;
}

/**
 * 判断短期均线与长期均线是否发生“金叉”或“死叉”
 * @param {Array} shortSMA 短期均线数组
 * @param {Array} longSMA 长期均线数组
 * @returns {string} "金叉"、"死叉"或"无交叉"
 */
function detectMaCross(shortSMA, longSMA) {
  const len = shortSMA.length;
  if (len < 2) return "无交叉";

  const prevShort = shortSMA[len - 2];
  const prevLong = longSMA[len - 2];
  const currShort = shortSMA[len - 1];
  const currLong = longSMA[len - 1];

  if (prevShort === null || prevLong === null || currShort === null || currLong === null) return "无交叉";

  if (prevShort <= prevLong && currShort > currLong) return "金叉";
  if (prevShort >= prevLong && currShort < currLong) return "死叉";

  return "无交叉";
}

/**
 * 计算MACD指标
 * @param {Array} closePrices 收盘价数组
 * @param {number} shortPeriod 短期EMA周期，默认12
 * @param {number} longPeriod 长期EMA周期，默认26
 * @param {number} signalPeriod 信号线周期，默认9
 * @returns {Object} { macd: number, signal: number, histogram: number }
 */
function calculateMACD(closePrices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
  // 计算EMA的辅助函数
  function EMA(data, period) {
    const k = 2 / (period + 1);
    const emaArray = [];
    data.forEach((price, index) => {
      if (index === 0) {
        emaArray.push(price); // 第一个EMA等于第一个价格
      } else {
        emaArray.push(price * k + emaArray[index - 1] * (1 - k));
      }
    });
    return emaArray;
  }

  const shortEMA = EMA(closePrices, shortPeriod);
  const longEMA = EMA(closePrices, longPeriod);
  const diff = shortEMA.map((val, idx) => val - longEMA[idx]);
  const dea = EMA(diff, signalPeriod);
  const macdHist = diff.map((val, idx) => (val - dea[idx]) * 2); // MACD柱状图

  const len = closePrices.length - 1;
  return {
    macd: diff[len] ?? 0,
    signal: dea[len] ?? 0,
    histogram: macdHist[len] ?? 0,
  };
}

/**
 * 计算RSI指标
 * @param {Array} closePrices 收盘价数组
 * @param {number} period 计算周期，默认14
 * @returns {number} RSI值，0-100
 */
function calculateRSI(closePrices, period = 14) {
  if (closePrices.length < period + 1) return 0;

  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = closePrices[i] - closePrices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  if (avgLoss === 0) return 100;

  // 计算RSI
  let rs = avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);

  // 计算后续数据的平滑RSI
  for (let i = period + 1; i < closePrices.length; i++) {
    const change = closePrices[i] - closePrices[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
    rs = avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);
  }
  return rsi;
}

/**
 * 计算布林带指标
 * @param {Array} closePrices 收盘价数组
 * @param {number} period 计算周期，默认20
 * @param {number} k 标准差倍数，默认2
 * @returns {Object} { upperBand, middleBand, lowerBand }
 */
function calculateBollingerBands(closePrices, period = 20, k = 2) {
  if (closePrices.length < period) return { upperBand: 0, middleBand: 0, lowerBand: 0 };

  const slice = closePrices.slice(-period);
  const sum = slice.reduce((a, b) => a + b, 0);
  const mean = sum / period;

  const variance = slice.reduce((acc, val) => acc + (val - mean) ** 2, 0) / period;
  const stddev = Math.sqrt(variance);

  return {
    upperBand: mean + k * stddev,
    middleBand: mean,
    lowerBand: mean - k * stddev,
  };
}

/**
 * 计算OBV指标
 * @param {Array} klineData K线数据数组，包含close和volume字段
 * @returns {number} OBV值
 */
function calculateOBV(klineData) {
  let obv = 0;
  for (let i = 1; i < klineData.length; i++) {
    if (klineData[i].close > klineData[i - 1].close) obv += klineData[i].volume;
    else if (klineData[i].close < klineData[i - 1].close) obv -= klineData[i].volume;
  }
  return obv;
}

/**
 * 判断成交量趋势
 * @param {Array} klineData K线数据数组，包含volume字段
 * @returns {string} "递增" | "递减" | "震荡" | "数据不足"
 */
// function getVolumeTrend(klineData) {
//   if (klineData.length < 4) return "数据不足";
//   const last4 = klineData.slice(-4);
//   if (last4[3].volume > last4[2].volume && last4[2].volume > last4[1].volume && last4[1].volume > last4[0].volume)
//     return "递增";
//   if (last4[3].volume < last4[2].volume && last4[2].volume < last4[1].volume && last4[1].volume < last4[0].volume)
//     return "递减";
//   return "震荡";
// }

// function getVolumeTrend(klineData) {
//   if (klineData.length < 30) return "数据不足";

//   const last30 = klineData.slice(-30);
//   let upCount = 0, downCount = 0;

//   for (let i = 1; i < last30.length; i++) {
//     const change = (last30[i].volume - last30[i - 1].volume) / last30[i - 1].volume;
//     if (change > 0.05) upCount++;
//     else if (change < -0.05) downCount++;
//   }

//   if (upCount >= 15) return "递增";
//   if (downCount >= 15) return "递减";
//   return "震荡";
// }

// 计算线性回归斜率
function linearRegressionSlope(values) {
  const n = values.length;
  const xSum = (n * (n - 1)) / 2; // 0+1+2+...+n-1
  const ySum = values.reduce((a, b) => a + b, 0);
  const xySum = values.reduce((sum, y, i) => sum + i * y, 0);
  const xSqSum = (n * (n - 1) * (2 * n - 1)) / 6; // sum of squares 0^2+1^2+...+ (n-1)^2

  const numerator = n * xySum - xSum * ySum;
  const denominator = n * xSqSum - xSum * xSum;

  if (denominator === 0) return 0;
  return numerator / denominator;
}

// 基于线性回归斜率判断趋势
function getVolumeTrendBySlope(klineData) {
  if (klineData.length < 30) return "数据不足";
  const volumes = klineData.slice(-30).map(k => k.volume);
  const slope = linearRegressionSlope(volumes);

  if (slope > 0.1) return "递增";
  if (slope < -0.1) return "递减";
  return "震荡";
}

// 基于均值对比判断趋势
function getVolumeTrendByMovingAverage(klineData) {
  if (klineData.length < 30) return "数据不足";

  const last30 = klineData.slice(-30);
  const first20 = last30.slice(0, 20);
  const last10 = last30.slice(20);

  const avg20 = first20.reduce((sum, k) => sum + k.volume, 0) / 20;
  const avg10 = last10.reduce((sum, k) => sum + k.volume, 0) / 10;

  const diffRatio = (avg10 - avg20) / avg20;

  if (diffRatio > 0.1) return "递增";
  if (diffRatio < -0.1) return "递减";
  return "震荡";
}

// 综合判定成交量趋势
function getVolumeTrend(klineData) {
  if (klineData.length < 30) return "数据不足";

  const slopeTrend = getVolumeTrendBySlope(klineData);
  const maTrend = getVolumeTrendByMovingAverage(klineData);

  if (slopeTrend === "递增" && maTrend === "递增") return "强烈递增";
  if (slopeTrend === "递减" && maTrend === "递减") return "强烈递减";
  if (slopeTrend === "递增" || maTrend === "递增") return "递增";
  if (slopeTrend === "递减" || maTrend === "递减") return "递减";
  return "震荡";
}

function calculateKDJ(klineData, period = 9) {
  if (!klineData || klineData.length < period) return { K: 50, D: 50, J: 50 };

  const rsvList = [];

  for (let i = period - 1; i < klineData.length; i++) {
    const slice = klineData.slice(i - period + 1, i + 1);
    const highMax = Math.max(...slice.map(k => k.high));
    const lowMin = Math.min(...slice.map(k => k.low));
    const close = klineData[i].close;

    const rsv = (close - lowMin) / (highMax - lowMin) * 100;
    rsvList.push(rsv);
  }

  let K = 50, D = 50, J = 50;
  for (const rsv of rsvList) {
    K = 2 / 3 * K + 1 / 3 * rsv;
    D = 2 / 3 * D + 1 / 3 * K;
    J = 3 * K - 2 * D;
  }

  return {
    K,
    D,
    J,
  };
}



module.exports = {
  calculateSMA,
  detectMaCross,
  calculateMACD,
  calculateRSI,
  calculateBollingerBands,
  calculateOBV,
  calculateKDJ,
  getVolumeTrend
};
