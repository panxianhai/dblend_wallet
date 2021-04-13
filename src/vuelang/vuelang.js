// 引入插件和语言包
import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "../assets/lang/en";
import tw from "../assets/lang/tw";
import zh from "../assets/lang/zh";

//挂到原型上
Vue.use(VueI18n);

let lang = localStorage.getItem("lang") ||  "zh";
//
document.title = "DBLend";

// 实例化vue-i18n
export default new VueI18n({
  // 从本地存储中取，如果没有默认为中文，
  // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
  locale: lang,
  messages: {
    zh: zh, // 中文语言包
    en: en, // 英文语言包
    tw: tw, //繁体中文包
  },
});

//  this.$i18n.locale = 'en' 中英文切换
