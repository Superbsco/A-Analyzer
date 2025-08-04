const { getStockList } = require("./tools/fetchStockList");
const { multiFactorFilter } = require("./analyze/multiFactorFilter");
const { exportToExcel } = require("./export/exportToExcel");

async function main() {
  try {
    console.log("开始获取股票列表...");
    const stocks = await getStockList();
    console.log(`获取到${stocks.length}只股票`);

    console.log("开始多因子筛选...");
    const filteredStocks = await multiFactorFilter(stocks);

    console.log(`筛选出${filteredStocks.length}只符合条件的股票，准备导出...`);

    // 👉 打印前5名
    const top5 = filteredStocks.slice(0, 5);
    console.log(`\n📈 Top 5 推荐股票：\n`);
    top5.forEach((stock, idx) => {
      console.log(`${idx + 1}. ${stock.name} (${stock.code}) - ${stock.recommendation} | 评分: ${stock.score.toFixed(2)}`);
    });

    await exportToExcel(filteredStocks);
  } catch (error) {
    console.error("程序异常:", error);
  }
}

main();
