import Vue from "vue";

//创建了全局对象 Web3Provider，usdtContract，web3 。用于区块链的交易
import "./utils/blockchain.js";

//导入适配rem配置
import "amfe-flexible";
// import 'lib-flexible'

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./style/base.css";

//导入所有的vant样式和vant组件
import { Popup, Toast } from "vant";
import "vant/lib/index.css";
Vue.use(Toast);
Vue.use(Popup);

//用于计算币的转换
Vue.prototype.$toWei = (val, type) => {
  let res = 0;
  switch (res == 0) {
    case type == "ether":
      res = val * 1e18;
      break;
    case type == "Gwei":
      res = val * 1e8;
      break;
    case type == "usdt":
      res = val * 1e6;
      break;
    default:
      res = 0;
  }
  return res;
};
//用于计算币的转换
Vue.prototype.$fromWei = (val, type) => {
  let res = 0;
  switch (res == 0) {
    case type == "ether":
      res = val / 1e18;
      break;
    case type == "Gwei":
      res = val / 1e8;
      break;
    case type == "usdt":
      res = val / 1e6;
      break;
    default:
      res = 0;
  }
  return res;
};
//用于拼接吧字符串转换成16进制数据
Vue.prototype.$stringToHex = (str) => {
  return Web3Provider.utils.toHex(str);
  // let val = "";
  // for (var i = 0; i < str.length; i++) {
  //   val += str.charCodeAt(i).toString(16);
  // }
  // return val;
};

//导入修改科学计数法的转换数据
import bigDecimal from "js-big-decimal";

Vue.prototype.$bigDecimal = bigDecimal;

Vue.prototype.$toFixedNumber = ({ num, lengths = 2, transition = true }) => {
  lengths != 0 ? (lengths += 1) : (lengths = 0);

  num = String(new bigDecimal(num).value);

  let len = num.indexOf(".");
  if (len !== -1) {
    num = num.slice(0, len + lengths);
  }
  if (transition) {
    num = Number(num);
  }
  return num;
};

//用于判断传入的对象是否于规则匹配
Vue.prototype.$judgeRules = ({ rules = "", value = "" }) => {
  let data = false;
  try {
    if (!rules) {
      return data;
    }
    if (rules.test(value)) {
      return (data = true);
    }
    return data;
  } catch (error) {
    // throw new Error(error);
    return false;
  }
};

// 语言包
import i18n from "./vuelang/vuelang";

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
