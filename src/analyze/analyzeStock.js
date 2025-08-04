const axios = require("axios");
const { calculateRSI } = require("../indicators/rsi");
const { calculateMACD } = require("../indicators/macd");
const { calculateBollingerBands } = require("../indicators/bollinger");
const { detectMACross } = require("../indicators/maCross");
const { calculateOBV } = require("../indicators/obv");
const { calculateScoreAndRecommendation } = require("../utils/scoreUtils");

// 获取单只股票的技术分析评分
async function analyzeStock(stock) {
  try {
    const code = stock.f12;
    const name = stock.f14;
    const currentPrice = stock.f2;
    const changePercent = stock.f3;

    // 确定 secid
    const secid = code.startsWith("6") ? `1.${code}` : `0.${code}`;
    const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58&klt=101&fqt=1&end=20500101&lmt=60`;

    const response = await axios.get(url, { timeout: 5000 });
    const klines = response?.data?.data?.klines;

    if (!Array.isArray(klines) || klines.length < 20) {
      return null;
    }

    const data = klines.map(item => {
      const [date, open, close, high, low, volume] = item.split(",");
      return {
        date,
        open: +open,
        close: +close,
        high: +high,
        low: +low,
        volume: parseInt(volume, 10)
      };
    });

    const recent = data.slice(-20);
    const closes = recent.map(d => d.close);

    // === 技术指标 ===
    const rsi6 = calculateRSI(closes, 6);
    const rsi14 = calculateRSI(closes, 14);
    const { dif, dea, macd } = calculateMACD(closes);

    const momentum5 = closes.length >= 5 ? closes.at(-1) - closes.at(-5) : 0;
    const pct3 = closes.length >= 3 ? (closes.at(-1) - closes.at(-3)) / closes.at(-3) : 0;
    const pct1 = closes.length >= 2 ? (closes.at(-1) - closes.at(-2)) / closes.at(-2) : 0;

    const priceTrend = (closes.at(-1) - closes[0]) / closes[0];
    const volumeTrend = data.at(-1).volume > data[0].volume ? "increasing" : "decreasing";
    const volatility = (Math.max(...closes) - Math.min(...closes)) / closes[0];

    // === 新指标 ===
    const boll = calculateBollingerBands(closes);
    const maCross = detectMACross(closes);
    const obv = calculateOBV(data);

    // 衍生判断字段
    const bollStatus = (() => {
      if (!boll) return "无数据";
      const last = closes.at(-1);
      if (last > boll.upper) return "上轨";
      if (last < boll.lower) return "下轨";
      return "中轨";
    })();

    const obvTrend = obv > 0 ? "多头" : obv < 0 ? "空头" : "震荡";

    // === 综合评分 ===
    const { score, star, recommendation } = calculateScoreAndRecommendation({
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
      closes,
      data
    });

    // === 返回结构 ===
    return {
      code,
      name,
      currentPrice,
      changePercent,
      rsi6: typeof rsi6 === "number" ? rsi6 : 0,
      rsi14: typeof rsi14 === "number" ? rsi14 : 0,
      macd: typeof macd === "number" ? macd.toFixed(2) : "0.00",
      trend: priceTrend > 0 ? "upward" : "downward",
      volumeTrend,
      priceChange: typeof priceTrend === "number" ? (priceTrend * 100).toFixed(2) + "%" : "0.00%",
      score,
      star,
      recommendation,
      bollStatus,
      maCross,
      obvTrend
    };
  } catch (err) {
    return null;
  }
}

module.exports = { analyzeStock };
