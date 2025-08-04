# A-Analyzer 股票多因子分析工具

在AI时代，量化分析已成为股票投资的重要手段。A-Analyzer助您在股海中把握先机，发现潜在投资机会。

## 项目简介
A-Analyzer是一个A股股票多因子分析工具，通过多种技术指标和权重算法，对股票进行综合评分和筛选。主要特点：

- **核心功能**：提供多因子权重分析、技术指标计算、股票筛选和结果导出等完整流程
- **基础模型**：所有结果打印在控制台上，便于理解和扩展（可自行开发网页版界面）
- **高度可定制**：支持添加新的分析因子，打造专属选股策略
- **灵活配置**：可调整权重参数和筛选条件，适应不同市场环境

> 本工具仅提供最基础的分析能力。有心者可自行调整属于自己的策略。

> 提示：本工具仅供学习和研究使用，不构成任何投资建议，因使用本工具造成的任何亏损与作者无关。

> 感谢支持：如果本工具对您有帮助，欢迎给予Star或请作者喝杯奶茶（详见底部）

## 功能特点
### 1、多股票批量分析与导出功能
- 多因子权重分析：基于成交量比率、换手率、成交金额和振幅等指标进行加权评分
- 技术指标分析：包括RSI、MACD、布林带、均线交叉等多种技术指标
- 股票筛选：根据综合评分筛选出符合条件的股票
- 结果导出：将分析结果导出为Excel文件，便于进一步分析
- 可视化推荐：展示Top N推荐股票列表，直观呈现分析结果

### 2、单只股票查询功能
- 针对特定股票进行深入技术分析
- 展示详细的技术指标数据和图表
- 提供股票评分和投资建议
- 历史数据查询和趋势分析

## 项目结构
```
├── .env                 # 环境变量配置
├── .gitignore            # Git忽略文件
├── README.md             # 项目说明文档
├── data/                 # 数据存储目录（导出的Excel文件存放在此）
├── package.json          # 项目依赖配置
├── pnpm-lock.yaml        # 依赖版本锁定文件
├── scripts/             # 脚本目录
│   ├── autoTune.log      # 自动调优日志
│   └── autoTuneWeights.js  # 权重自动调优脚本
└── src/                  # 源代码目录
    ├── analyze/            # 分析模块
    │   ├── analyzeStock.js  # 单只股票分析核心逻辑
    │   ├── multiFactorFilter.js  # 多因子筛选算法
    │   ├── scoreStock.js    # 股票评分系统
    │   └── scoring.js       # 评分计算函数
    ├── config/            # 配置模块
    │   └── activeWeights.js  # 活跃度权重配置文件
    ├── export/            # 导出模块
    │   └── exportToExcel.js  # Excel导出功能实现
    ├── index.js           # 主入口文件（多股票批量分析与导出）
    ├── indicators/        # 技术指标计算模块
    │   ├── bollinger.js    # 布林带指标计算
    │   ├── extraIndicators.js  # 额外指标计算
    │   ├── maCross.js      # 均线交叉检测
    │   ├── macd.js         # MACD指标计算
    │   ├── multiPeriodIndicators.js  # 多周期指标计算
    │   ├── obv.js          # OBV能量潮计算
    │   ├── rsi.js          # RSI相对强弱指数计算
    │   └── singleCalculate.js  # 单指标计算工具
    ├── interpretation/    # 指标解释模块
    │   └── indicatorInterpreter.js  # 指标结果解释器
    ├── singleStockQuery.js  # 单只股票查询入口文件
    ├── tools/             # 工具模块
    │   └── fetchStockList.js  # 获取股票列表工具
    └── utils/             # 通用工具函数模块
        ├── fetchFloatShares.js  # 获取流通股数据
        ├── getStockKline.js     # 获取股票K线图数据
        └── scoreUtils.js        # 评分工具函数
```

## 快速开始
1. 确保已安装Node.js 16.0.0或更高版本
2. 克隆或下载本项目
3. 安装依赖

## 安装依赖
```bash
# 使用pnpm安装依赖
pnpm install

# 或者使用
npm install

# 或者使用
yarn install
```

## 使用方法
### 1、多股票批量分析与导出
```bash
# 运行主程序，进行多股票批量分析并导出Excel
npm start
```
运行后，程序会自动获取股票列表，进行多因子筛选和技术指标分析，最后将结果导出到`./data/`目录下的Excel文件中。

### 2、单只股票查询
```bash
# 运行单只股票查询功能
# 例如查询股票代码为300750的股票
npm run single 300750
```
运行后，程序会提示您输入股票代码，然后进行详细的技术分析并展示结果。

### 权重自动调优
```bash
# 运行权重自动调优脚本
npm run tune
```
此功能会尝试自动优化多因子筛选的权重设置，以提高选股准确率。请将返回的权重结果手动于config/activeWeight.json文件进行修改。

## 核心功能说明
### 1. 多因子筛选
在`multiFactorFilter.js`中实现，通过以下权重计算股票活跃度评分：
- 成交量比率(volRatio): 0.1 - 反映成交量变化情况
- 换手率(turnover): 0.1 - 反映股票流通性
- 成交金额(turnoverVal): 0.1 - 反映资金参与程度
- 振幅(amplitude): 0.7 - 反映股票价格波动强度(最重要指标)

### 2. 单只股票评分权重
在`scoreStock.js`中实现，通过以下周期权重计算最终评分：
- 日线评分权重: 0.5 - 反映短期走势
- 周线评分权重: 0.3 - 反映中期走势
- 月线评分权重: 0.2 - 反映长期走势

这些权重用于综合不同时间周期的分析结果，更加全面地评估股票表现。

### 2. 技术指标分析
- **RSI**: 相对强弱指数，衡量股票超买超卖情况
- **MACD**: 移动平均线收敛发散指标，衡量股票趋势
- **布林带**: 衡量股票价格波动范围
- **均线交叉**: 检测短期和长期均线的交叉情况
- **OBV**: 能量潮指标，衡量成交量与价格的关系

### 3. 评分系统
通过`scoring.js`和`scoreUtils.js`实现，基于多种指标计算股票综合评分，并给出推荐评级。

## 配置说明
### 权重配置
项目中有两种权重配置，分别用于不同的分析场景：

#### 1. 多因子筛选权重
在`config/activeWeights.js`中可以调整多因子筛选的权重设置。默认权重如下：
```javascript
{
  volRatio: 0.1,  // 成交量比率权重
  turnover: 0.1,  // 换手率权重
  turnoverVal: 0.1,  // 成交金额权重
  amplitude: 0.7   // 振幅权重
}
```
这些权重用于计算股票活跃度评分，帮助筛选出市场上的活跃股票。

#### 2. 单只股票查询周期权重
在`scoreStock.js`中的`calculateFinalScore`函数中定义，用于综合不同周期的评分结果：
```javascript
// 加权综合评分示例
const finalScore = Math.round(
  dailyScore.score * 0.5 +  // 日线评分权重
  weeklyScore.score * 0.3 +  // 周线评分权重
  monthlyScore.score * 0.2   // 月线评分权重
);
```
这些权重用于平衡短期、中期和长期技术分析的影响，得出最终的股票评分和推荐级别。

## 技术栈
- Node.js: JavaScript运行时环境
- Axios: HTTP请求库
- ExcelJS: Excel文件处理库
- Decimal.js: 高精度数值计算
- Dayjs: 日期处理库

## 注意事项
1. 本工具仅供学习和研究使用，不构成任何投资建议
2. 股票数据来源于网络，可能存在延迟或不准确情况
3. 运行前请确保配置了正确的环境变量
4. 建议使用Node.js 16.0.0或更高版本运行本程序

## 示例输出
运行主程序后，会看到类似以下输出：
```
开始获取股票列表...
获取到3000只股票
开始多因子筛选...
第一层筛选：选出600只活跃股票
技术指标分析进度：600/600 - 600519 贵州茅台
筛选出52只符合条件的股票，准备导出...

📈 Top 5 推荐股票：

1. 贵州茅台 (600519) - 强烈推荐 | 评分: 92.50
2. 宁德时代 (300750) - 推荐 | 评分: 89.75
3. 比亚迪 (002594) - 推荐 | 评分: 87.20
4. 招商银行 (600036) - 谨慎推荐 | 评分: 85.10
5. 中国平安 (601318) - 谨慎推荐 | 评分: 82.35

导出完成：./data/推荐股票_20250804.xlsx
```

## 支持与捐赠
如果本工具对您有帮助，欢迎通过以下方式支持作者：

<div style="display: flex; justify-content: center; gap: 40px; margin: 20px 0;">
  <div style="text-align: center;">
    <h3>微信支付</h3>
    <img src="./photo/wx.jpg" alt="微信收款码" style="width: 200px; height: auto;">
  </div>
  <div style="text-align: center;">
    <h3>支付宝</h3>
    <img src="./photo/zfb.jpg" alt="支付宝收款码" style="width: 200px; height: auto;">
  </div>
</div>

您的支持是我持续开发和改进本工具的动力！

## 许可证

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

