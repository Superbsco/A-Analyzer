const axios = require("axios");

const PERIOD_MAP = {
  daily: 101,
  weekly: 102,
  monthly: 103,
};

/**
 * 获取 A 股股票的历史 K 线数据
 * @param {string} code - 股票代码（如 002152）
 * @param {"daily"|"weekly"|"monthly"} period - 周期类型
 * @param {number} limit - 获取的K线数量
 * @returns {Promise<Array>} - 返回格式化后的 K 线数组
 */
async function getStockKline(code, period = "daily", limit = 100) {
  try {
    const klt = PERIOD_MAP[period];
    if (!klt) throw new Error(`不支持的周期类型：${period}`);
    const marketPrefix = code.startsWith("6") ? "1." : "0.";
    const fullCode = marketPrefix + code;

    const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get";
    const params = {
      secid: fullCode,
      klt,
      fqt: 1,
      beg: "19900101",
      end: "20500101",
      lmt: limit,
      fields1: "f1,f2,f3,f4,f5,f6",
      fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
    };

    const res = await axios.get(url, { params });
    const klines = res?.data?.data?.klines;
    if (!klines) {
      console.warn(`⚠️ 无法获取 ${code} 的${period} K线数据`);
      return [];
    }

    return klines.map(str => {
      const [date, open, close, high, low, volume, amount] = str.split(",");
      return {
        date,
        open: parseFloat(open),
        close: parseFloat(close),
        high: parseFloat(high),
        low: parseFloat(low),
        volume: parseFloat(volume),
        amount: parseFloat(amount),
      };
    });
  } catch (error) {
    console.error(`❌ 获取 ${code} 的${period} K线失败:`, error.message);
    return [];
  }
}

module.exports = {
  getStockKline,
};
