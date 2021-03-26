import http from "./http";

function httpGet({ data = {}, url } = {}) {
  return http({ method: "get", url, params: data });
}

function httpPost({ data = {}, url } = {}) {
  return http({ method: "post", url, data });
}

//用户登录
export function login({ data = {} } = {}) {
  return httpPost({ url: "/login", data });
}

//用户注册
export function register({ data = {} } = {}) {
  return httpPost({ url: "/register", data });
}

//发送用户注册验证码
export function registerCode({ data = {} } = {}) {
  return httpPost({ data, url: "/code" });
}

//发送重置密码验证码
export function resetCode({ data = {} } = {}) {
  return httpPost({ url: "/reset_code", data });
}

//重置密码
export function reset({ data = {} } = {}) {
  return httpPost({ url: "/reset", data });
}

//判断钱包地址是否注册过
export function check({ data = {} } = {}) {
  return httpPost({ url: "/check", data });
}

//获取钱包的数据
export function balance({ data = {} } = {}) {
  return httpGet({ url: "/wallets", data });
}

//交易的兑换价格
export function exchangePrice({ data = {} } = {}) {
  return httpGet({ url: "/wallets/price", data });
}

//铸造DIBI
export function mint({ data = {} } = {}) {
  return httpPost({ url: "/mint", data });
}

//borrow的markets借贷信息列表
export function borrowList({ data = {} } = {}) {
  return httpGet({ url: "/markets/borrow", data });
}

//supply的markets借贷信息列表
export function supplyList({ data = {} } = {}) {
  return httpGet({ url: "/markets/supply", data });
}

//borrow和supply的借贷详细信息
export function borrowingInfo({ data = {}, id = "" } = {}) {
  return httpGet({ url: "/markets/" + id, data });
}

//用户存款，supply
export function supply_markets({ data = {} } = {}) {
  return httpPost({ url: "/supply_markets ", data });
}

//用户借款，borrow
export function borrow_markets({ data = {} } = {}) {
  return httpPost({ url: "/borrow_markets ", data });
}

//用户的存款历史信息
export function supplyHistorys({ data = {} } = {}) {
  return httpGet({ url: "/supply_markets", data });
}

//用户的借款历史信息
export function borrowHistorys({ data = {} } = {}) {
  return httpGet({ url: "/borrow_markets", data });
}

//用户我的页面信息
export function userPage({ data = {} } = {}) {
  return httpGet({ url: "/members", data });
}

//用户提现
export function withdraw({ data = {} } = {}) {
  return httpPost({ url: "/withdraw ", data });
}

//添加质押率
export function borrowAdd({ data = {}, id } = {}) {
  return httpPost({ url: `/borrow_markets/${id}/add`, data });
}

//利息池的数据
export function mintPool({ data = {} } = {}) {
  return httpGet({ url: `/mint`, data });
}

//获取通知的数量
export function notification({ data = {} } = {}) {
  return httpGet({ url: `/notification`, data });
}

//获取铸币历史
export function mintHistory({ data = {} } = {}) {
  return httpGet({ url: `/mint/history`, data });
}

//获取用户的借币利息数据
export function getInterest({ data = {} } = {}) {
  return httpPost({ url: `/borrow_markets/meta_data`, data });
}

//获取用户的转账历史 /transfer/history
export function transferHistory({ data = {} } = {}) {
  return httpGet({ url: `/transfer/history`, data });
}

//存款前的资格检查
export function supplyMarketsCheck({ data = {} } = {}) {
  return httpPost({ url: `/supply_markets/check`, data });
}

//借币前的资格检查
export function borrowMarketsCheck({ data = {} } = {}) {
  return httpPost({ url: `/borrow_markets/check`, data });
}

//用户转账进入到公司账号通知
export function setDeposit({ data = {} } = {}) {
  return httpPost({ url: `/deposit`, data });
}

//获取转账手续费
export function getPoundage({ data = {} } = {}) {
  return httpPost({
    url: "http://8.135.101.174:5908/v1/openapi/minnerfee",
    data,
  });
}
