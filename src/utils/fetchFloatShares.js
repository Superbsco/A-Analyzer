const axios = require("axios");
async function fetchFloatSharesFromEM(code) {
  try {
    const marketPrefix = code.startsWith("6") ? "1." : "0.";
    const url = `https://push2.eastmoney.com/api/qt/stock/get`;
    const params = {
      secid: marketPrefix + code,
      fields: "f58,f116,f84,f85"
    };

    const res = await axios.get(url, { params });
    const data = res.data?.data;

    if (!data || !data.f85) {
      console.warn("❌ 没有获取到流通股本字段 f85");
      return null;
    }

    const floatSharesWan = data.f85; // 单位：股
    console.log(`✅ 获取到流通股本: ${floatSharesWan} 股`);
    return { floatSharesWan, name: data.f58 };
  } catch (err) {
    console.error("❌ 获取流通股本失败:", err.message);
    return null;
  }
}



module.exports = { fetchFloatSharesFromEM };

