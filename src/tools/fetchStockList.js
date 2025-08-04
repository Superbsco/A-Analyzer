// src/tools/fetchStockList.js
const axios = require("axios");
const activeWeights = require("../config/activeWeights");
const { calculateCompositeScoreWithWeights } = require("../analyze/scoring");

async function getStockList() {
  try {
    console.log("正在获取A股股票列表...");

    // 东方财富股票列表接口，按成交额f6降序，获取热度前600
    const url =
      "http://80.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=600&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f6&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23&fields=f12,f14,f2,f3,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f7,f8,f9";

    const response = await axios.get(url, { timeout: 15000 });
    const stocks = response.data.data.diff;

    if (!stocks || !Array.isArray(stocks)) {
      throw new Error("未获取到股票列表数据");
    }

    // 过滤条件：剔除北交所（8开头）、ST股、退市股、688科创板
    const filteredStocks = stocks.filter((stock) => {
      const code = stock.f12; // 股票代码
      const name = stock.f14; // 股票名称
      if (code.startsWith("8")) return false; // 北交所
      if (name.includes("ST") || name.includes("*ST")) return false; // ST股
      if (name.includes("退")) return false; // 退市股
      if (code.startsWith("688")) return false; // 科创板
      // 只保留沪深主板、创业板
      return code.startsWith("0") || code.startsWith("3") || code.startsWith("6");
    });

    // 计算活跃度综合分数，权重从配置文件读取
    filteredStocks.forEach((stock) => {
      stock.activeScore = calculateCompositeScoreWithWeights(stock, activeWeights);
    });

    // 设定活跃度分数阈值，筛选活跃股票
    const activeThreshold = 0.3;
    const activeFilteredStocks = filteredStocks.filter(
      (stock) => stock.activeScore >= activeThreshold
    );

    console.log(
      `过滤后符合条件的股票数: ${filteredStocks.length}，活跃度筛选后股票数: ${activeFilteredStocks.length}`
    );

    return activeFilteredStocks;
  } catch (error) {
    console.error("获取股票列表失败:", error.message);
    throw error;
  }
}

module.exports = { getStockList };
