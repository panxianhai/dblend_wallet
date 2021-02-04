import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    token: JSON.parse(localStorage.getItem("token")) || "",
    lang: JSON.parse(localStorage.getItem("lang")) || "zh",
    address: JSON.parse(localStorage.getItem("address")) || "",
    email: "", //用户账号
    password: "", //用户密码
    temporaryAddress: "", //用户临时地址
    //测试地址
    mintTO: "0x8b589de5b61CE27e14dc2543a52563a640352307",
    saveTO: "0x07adCdD6351109be1f5eA7F45DfcF9D5b97Feb3e",
    informationTO: "0x5ee0B2ad5430ED085ef6bbd6A2b7B09F074709D0",

    // //线上地址          
    //铸币的地址
    // mintTO: "0x9dbDBce67e08B663c2355EE16C34aAe0fc5a6Cdc",
    //存钱的地址
    // saveTO: "0x993057b55fe889062a1081c75948e678e204aa4F",
    //传递信息的地址
    // informationTO: "0x7A6A72f644D576C58BBC9E228Ce0759D61e2f81b",
    userData: JSON.parse(localStorage.getItem("userData")) || {},
  },
  mutations: {
    //删除或吧存储数据存储到本地同步
    amendData(state, { key, value = "" }) {
      if (!value) {
        localStorage.removeItem(key);
        state[key] = "";
        return;
      }

      localStorage.setItem(key, JSON.stringify(value));
      state[key] = value;
      return;
    },

    //获取本地数据
    getData(state, key) {
      state[key] = JSON.parse(localStorage.getItem(key));
    },

    //修改数据不保存到本地
    modifyData(state, { key, value = "" }) {
      state[key] = value;
      return;
    },
  },
  //从本地获取数据
  getters: {
    setLang(state) {
      return state.lang;
    },
  },
  actions: {},
  modules: {},
});

export default store;
