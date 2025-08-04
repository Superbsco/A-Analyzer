function generateInterpretation(indicators, label = "") {
  if (!indicators) return `${label}暂无足够数据，无法生成解读。`;

  const { maCross, macd, rsi, boll, obv, volumeTrend, kdj } = indicators;

  // 转换数字，避免字符串问题
  const K = kdj ? parseFloat(kdj.K) : null;
  const D = kdj ? parseFloat(kdj.D) : null;
  const J = kdj ? parseFloat(kdj.J) : null;

  let result = `${label} 技术指标解读：`;

  // MA交叉
  if (maCross === "金叉") result += " 均线金叉，短期看涨趋势明显。";
  else if (maCross === "死叉") result += " 均线死叉，短期走势偏弱。";
  else result += " 均线暂无明显交叉信号。";

  // MACD
  if (macd.histogram > 0) {
    result += ` MACD柱状图为正，买盘力量较强，当前MACD值为${macd.macd.toFixed(2)}。`;
  } else {
    result += ` MACD柱状图为负，卖盘力量占优，当前MACD值为${macd.macd.toFixed(2)}。`;
  }

  // RSI
  if (rsi > 70) result += " RSI指标超买，短期有回调风险。";
  else if (rsi < 30) result += " RSI指标超卖，短期可能反弹。";
  else result += ` RSI处于${rsi.toFixed(2)}，趋势相对健康。`;

  // Bollinger Bands
  if (boll) {
    const { upperBand, middleBand, lowerBand } = boll;
    result += ` 布林带上下轨分别为${upperBand.toFixed(2)}和${lowerBand.toFixed(2)}，当前价格靠近${middleBand.toFixed(2)}。`;
  }

  // OBV
  if (obv > 0) result += " OBV呈上升趋势，资金流入明显。";
  else result += " OBV表现疲软，资金流出风险存在。";

  // 成交量趋势
  if (volumeTrend === "上升") result += " 成交量持续放大，市场活跃度提升。";
  else if (volumeTrend === "下降") result += " 成交量减少，动能或将减弱。";
  else result += " 成交量无明显变化。";

  // KDJ
  if (K !== null && D !== null && J !== null) {
    if (J > 100) {
      result += " KDJ指标J值远超100，短线超买风险较大。";
    } else if (J < 0) {
      result += " KDJ指标J值低于0，存在超卖反弹机会。";
    } else {
      result += " KDJ指标处于正常波动区间。";
    }
    if (K > D && D > 20) {
      result += " 形成金叉，短线看涨信号。";
    } else if (K < D && D < 80) {
      result += " 形成死叉，短线需谨慎。";
    }
  }

  return result;
}

module.exports = { generateInterpretation };