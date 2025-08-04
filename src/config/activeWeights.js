// src/config/activeWeights.js
// 权重说明：
// - volRatio(成交量比率): 0.1 - 反映成交量变化情况
// - turnover(换手率): 0.1 - 反映股票流通性
// - turnoverVal(成交金额): 0.1 - 反映资金参与程度
// - amplitude(振幅): 0.7 - 反映股票价格波动强度(最重要指标)
module.exports = {
  volRatio: 0.1,
  turnover: 0.1,
  turnoverVal: 0.1,
  amplitude: 0.7,
};
