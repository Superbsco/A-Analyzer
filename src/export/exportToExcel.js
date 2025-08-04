// src/export/exportToExcel.js
const ExcelJS = require("exceljs");
const dayjs = require("dayjs");
const path = require("path");

function formatNumber(value, digits = 2, defaultVal = "0.00") {
  if (typeof value === "number") {
    return value.toFixed(digits);
  }
  // 如果是字符串且本身是数字字符串也转为数字格式
  const num = Number(value);
  if (!isNaN(num)) return num.toFixed(digits);
  return defaultVal;
}

async function exportToExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("A股热度前600分析");

  sheet.columns = [
    { header: '序号', key: 'idx', width: 6 },
    { header: '股票名称', key: 'name', width: 16 },
    { header: '股票代码', key: 'code', width: 12 },
    { header: '当前价格', key: 'currentPrice', width: 12 },
    { header: '涨跌幅', key: 'changePercent', width: 10 },
    { header: '技术评分', key: 'score', width: 10 },
    { header: '星级', key: 'star', width: 8 },
    { header: '推荐等级', key: 'recommendation', width: 14 },
    { header: 'RSI14', key: 'rsi14', width: 10 },
    { header: '趋势', key: 'trend', width: 10 },
    { header: '区间涨幅', key: 'priceChange', width: 12 },
    { header: '成交量趋势', key: 'volumeTrend', width: 12 },
    { header: '布林带位置', key: 'bollStatus', width: 12 },
    { header: '均线交叉', key: 'maCross', width: 12 },
    { header: 'OBV趋势', key: 'obvTrend', width: 10 }
  ];

  data.forEach((stock, idx) => {
    sheet.addRow({
      idx: idx + 1,
      name: stock.name,
      code: stock.code,
      currentPrice: stock.currentPrice,
      changePercent: stock.changePercent,
      score: stock.score,
      star: '★'.repeat(stock.star) + '☆'.repeat(5 - stock.star),
      recommendation: stock.recommendation,
      rsi14: stock.rsi14.toFixed(2),
      trend: stock.trend,
      priceChange: stock.priceChange,
      volumeTrend: stock.volumeTrend,
      bollStatus: stock.bollStatus || "无",
      maCross: stock.maCross || "无",
      obvTrend: stock.obvTrend || "无"
    });
  });

  const fileName = path.join(__dirname, "../../data", `A股热度前600分析_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
  await workbook.xlsx.writeFile(fileName);
  console.log(`✅ 导出完成: ${fileName}`);
}


module.exports = { exportToExcel };
