const Decimal = require('decimal.js');

function calculateAmplitude(klineData, days = 5) {
  if (klineData.length < days + 1) return null; 
  // 需要前一天收盘价做分母，所以数据至少要多一天

  const recent = klineData.slice(-days);

  const amplitudes = [];

  for (let i = 0; i < recent.length; i++) {
    const day = recent[i];
    const prevDay = klineData[klineData.length - days - 1 + i]; // 前一天收盘价
    if (!prevDay) continue;

    const amplitude = new Decimal(day.high)
      .minus(day.low)
      .dividedBy(prevDay.close)
      .times(100)
      .toNumber();

    amplitudes.push(amplitude);
  }

  if (amplitudes.length === 0) return null;

  const sum = amplitudes.reduce((a, b) => a + b, 0);
  const avg = sum / amplitudes.length;

  return parseFloat(avg.toFixed(2));
}

/**
 * 计算换手率（%）
 * 换手率 = (成交量（手） × 100) / 流通股本（股） × 100
 * @param {Array} klineData - K线数据数组
 * @param {number|null} floatShares - 流通股本，单位为“股”
 * @returns {number|null}
 */
function calculateTurnoverRate(klineData, floatShares) {
  if (!floatShares || klineData.length === 0) return null;

  const latest = klineData[klineData.length - 1];
  const volume = latest.volume;

  if (!volume || volume === 0) return 0;

  const volumeInShares = new Decimal(volume).times(100); // 成交量手转股
  const floatSharesInUnits = new Decimal(floatShares);   // 已是股，无需乘1e8

  const turnover = volumeInShares
    .dividedBy(floatSharesInUnits)
    .times(100) // 百分比
    .toNumber();
  return parseFloat(turnover.toFixed(2));
}

module.exports = {
  calculateAmplitude,
  calculateTurnoverRate,
};
