import axios from "axios";
import store from "../store/index";
import { Toast } from "vant";

let request = axios.create({
  //正式
  baseURL: "https://defiapi.dblend.club/api",
  // 测试地址
  // baseURL: "https://dblend-api.phpuser.net/api",
  // //测试地址 ,
  // baseURL: "https://dblend-api.coderoad.org/api"
});

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    if (store.state.token) {
      config.headers.Authorization = "Bearer " + store.state.token;
    }
    if (store.state.lang == "en") {
      config.headers["Accept-Language"] = "en-US";
    } else {
      config.headers["Accept-Language"] = "zh-CN";
    }

    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    let err = { ...error };
    if (err.config.url === "/deposit") {
      // 对响应错误做点什么
      return err.response;
    }

    // console.log(err)

    if (err.response.status == 400) {
      if (err.response.data.message) {
        Toast(err.response.data.message);
      }
    }
    // 对响应错误做点什么
    return err.response;
  }
  //2330311504@qq.com
);

export default request;
