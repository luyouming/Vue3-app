import axios from "axios";
import md5 from "tcfe-helper/util/md5";
import * as QS from "tcfe-helper/util/querystring";
import { Loading, Toast } from "vant";
import store from "../../store";
import currentEnv from "../env.js"; // 环境
import signs from "./sign.js";
// 参数的简单扩展
// function extra(...arg: any[]) {
//   if (arg.length < 2) {
//     return;
//   }
//   let opt = arg.shift();
//   while (arg.length) {
//     let x = arg.shift();
//     if (typeof x == "string") {
//       x = QS.parse(x);
//     }
//     for (let n in x) {
//       if (x.hasOwnProperty(n)) {
//         opt[n] = x[n];
//       }
//     }
//   }
// }
// 加密验证
const sign: any[] = [];
function pushSign(keys: string) {
  const num = [];
  for (let i = 0; i < keys.length; i += 1) {
    num.push(keys.charCodeAt(i) - 97);
  }
  return String.fromCharCode(parseInt(num.join("")));
}
const theSign = signs;
theSign.forEach(function (ks: any[]) {
  let val = "";
  ks.forEach(function (k: any) {
    val += pushSign(k);
  });
  sign.push(val);
});

let useOwnErrPop = false;
let loadingInstance: any;

// const CURRENT_ENV = import.meta.env.VUE_APP_ENV

// console.log(import.meta.env);

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 21000, // request timeout 后端最长的接口 20s，识别接口有时需要长达20秒，如果失败返回识别失败，这里多给1秒确保返回
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // 'Content-Type': 'application/json;charset=UTF-8'
  },
});

// 请求拦截器中支持 简短路径配置
// local:/api/share/ajax/cors   => //127.0.0.1:3001/api/share/ajax/cors
const urlPathsReg = /^(\w+):\/*/;

// 短链现在不需要多个端，多环境在对应的.env 里修改即可
const urlPaths = { hix: import.meta.env.VITE_APP_HIX_URL };

// // 正式环境短链匹配
// let urlPaths = {
//   // webapi: "/uniontrain/trainapi/",
//   // grabapi: "/uniontrain/grabtrainapi/",
//   // /hsrtmiddle/  先在预发布打包联调测试改成/hsrtmiddletest，此时不需要中间这一段
//   hix: import.meta.env.VITE_APP_HIX_URL,
//   // fro: "/frontstage/",
// }

// // 预发环境及开发环境短链  走预发接口
// if (CURRENT_ENV === 'development') {
//   urlPaths = {
//     // webapi: "/uniontraintest/trainapi/",
//     // grabapi: "/uniontraintest/grabtrainapi/",
//     // /hsrtmiddletest/  先在本地联调，此时不需要中间这一段
//     hix: import.meta.env.VITE_APP_HIX_URL,
//     // fro: "/frontstagetest/"
//   }
// }

// 发起请求之前的拦截器
service.interceptors.request.use(
  (config) => {
    // 如果有token 就携带tokon
    // const token = window.localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.common.Authorization = token;
    // }

    config.url = config.url.replace(urlPathsReg, function (s0, s1) {
      return urlPaths[s1] || s0;
    });
    const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    if (config.baseURL && !new RegExp(Expression).test(config.url)) {
      // 非全路径，将 baseURL 加到前面
      config.url = config.baseURL + config.url;
    }
    let para = {
      memberId: currentEnv.userId || "",
      headct: "0",
      platId: currentEnv.platId,
      headver: "2.14.0.2",
      headtime: new Date().getTime(),
      callback: "",
      tag: "",
      unionid: currentEnv.unionId || "",
      openId: currentEnv.openId || "",
      token: currentEnv.token,
    };

    const { loading = true } = (config.data = config.data || {});
    if (config.method == "post" || config.method == "put") {
      para = { ...para, ...config.data };
      // shouldLoading = config.data.loading || true // 不传是undefind，默认都是要loading, 部分接口是不需要可配置
      useOwnErrPop = config.data.useOwnErrPop || false; // 不传那就统一弹，传true就自己弹对应的文案
    } else {
      para = { ...para, ...config.params };
      // shouldLoading = !!config.params.loading || true // 不传是undefind，默认都是要loading, 部分接口是不需要可配置
      useOwnErrPop = config.params.useOwnErrPop || false; // 不传那就统一弹，传true就自己弹对应的文案
    }
    if (currentEnv.isDev || currentEnv.isTest) {
      delete para.token;
    }
    // // 以便后面可以使用
    const paraStr = JSON.stringify(para);
    let signature = "";
    // 使用签名
    if (sign[0]) {
      if (config.url.indexOf("/grabtrainapi/") > 0 && sign[2]) {
        signature = md5(paraStr + sign[2]);
      } else if (sign[1]) {
        signature = md5(paraStr + sign[1]);
      }
    }
    const finalResult = {
      para: paraStr,
      sign: signature,
    };

    config.data = QS.stringify(finalResult);
    if (config.method == "get") {
      config.url += "?" + QS.stringify(finalResult);
    }

    if (loading) {
      loadingInstance = Loading;
      store.commit("showLoading");
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (loadingInstance) {
      store.commit("hideLoading");
    }

    const res = response.data;

    const { code, message } = res.data || {};
    if (code == 200 || code == 100 || res.code == "ok") {
      return res.data;
    } else {
      // 有报错统一的报错提示
      if (!useOwnErrPop) {
        Toast(message || res.error);
      }
      return Promise.reject(res.data || res.error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
/**
 * 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
 * 函数的参数及返回值如下：
 * @param {String} method  请求的方法：get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} data    请求的参数
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 */
export default function (method: string, url: string, data = null) {
  method = method.toLowerCase();
  if (method == "post") {
    return service.post(url, data);
  } else if (method == "get") {
    return service.get(url, { params: data });
  } else if (method == "delete") {
    return service.delete(url, { params: data });
  } else if (method == "put") {
    return service.put(url, data);
  } else {
    console.error("未知的method" + method);
    return false;
  }
}
