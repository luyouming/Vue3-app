import axios from "axios";
import md5 from "tcfe-helper/util/md5";
import * as QS from "tcfe-helper/util/querystring";
import { Toast } from "vant";
import store from "../../store/index";
import currentEnv from "../env.js"; // 环境

declare module 'axios' {
    interface AxiosRequestConfig {
        // axios config 中加入两个自定属性，要不然报错
        useOwnErrPop?: boolean
        loading?:boolean
    }
}

let loadingNum = 0

// const CURRENT_ENV = import.meta.env.VUE_APP_ENV

// console.log(import.meta.env);

const service = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 21001, // request timeout 后端最长的接口 20s，识别接口有时需要长达20秒，如果失败返回识别失败，这里多给1秒确保返回
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // 'Content-Type': 'application/json;charset=UTF-8'
  },
});

// 请求拦截器中支持 简短路径配置
// local:/api/share/ajax/cors   => //127.0.0.1:3001/api/share/ajax/cors
const urlPathsReg = /^(\w+):\/*/;

// 短链现在不需要多个端，多环境在对应的.env 里修改即可
// @ts-ignore
const urlPaths = { hix: import.meta.env.VITE_APP_HIX_URL };


// 发起请求之前的拦截器
service.interceptors.request.use(
  function(config) {
    // console.log(arguments)
    config.url = config.url.replace(urlPathsReg, function (s0, s1) {
      return urlPaths[s1] || s0;
    });
    // 通用信息
    if (!config.headers) {
      config.headers = {};
    }
    let headers = config.headers;
    let tcInfo: any = {
      platId: currentEnv.platId,
      refId: currentEnv.refId,
    };
    if (currentEnv.platId == 501) {
      headers["we-user"] = currentEnv.token || '';
      tcInfo.openId = currentEnv.openId;
      tcInfo.unionId = currentEnv.unionId;
    } else {
      headers["te-user"] = currentEnv.token || '';
    }
    // 开发环境默认身份填上，避免报错
    if (currentEnv.isDev) {
      tcInfo.unionId = "ohmdTtyu39B1eoKtHkxrkhim6N88";
      tcInfo.openId = "o498X0VsWerGEfPtan0zJ5W5-HJA";
    }
    headers["tc-info"] = QS.stringify(tcInfo);
    
    if (config.method == "post" || config.method == "put") {
      config.data = QS.stringify(config.data)
    } else {
      config.data = ''
    }

    let query = ''
    if(config.params) {
    //   console.log('----', config.params, QS.stringify(config.params))
      query = QS.stringify(config.params)
      let index = config.url.indexOf("?")
      if(index >= 0) {
        config.url += "&" + query;
        query = config.url.slice(index + 1)
      }
      else {
        config.url += "?" + query;
      }
      
      config.params = ''
    }

    let tKey = new Date().getTime().toString(36)
    // console.log((headers["we-user"] || headers["te-user"] || '') , headers["tc-info"] , query , (config.data || '') , '$kesmjYUpPf8i!krTKN7!2Ane$UdeO%AqnA@g3OGgLIoT3dvMFn5%YIKJS@iww==' , tKey)
    // 数字签名
    headers["tc-key"] = md5((headers["we-user"] || headers["te-user"] || '') + headers["tc-info"] + query + (config.data || '') + ['$', 'k', 'e', 's', 'm', 'j', 'Y', 'U', 'p', 'P', 'f', '8', 'i', '!', 'k', 'r', 'T', 'K', 'N', '7', '!', '2', 'A', 'n', 'e', '$', 'U', 'd', 'e', 'O', '%', 'A', 'q', 'n', 'A', '@', 'g', '3', 'O', 'G', 'g', 'L', 'I', 'o', 'T', '3', 'd', 'v', 'M', 'F', 'n', '5', '%', 'Y', 'I', 'K', 'J', 'S', '@', 'i', 'w', 'w', '=', '='].join('') + tKey) + tKey

    if (config.loading) {
        loadingNum += 1
        // console.log("----------", loadingNum)
        if(loadingNum == 1) {
            store.dispatch("global/toggleApiLoading", true);
        }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// 响应拦截器
service.interceptors.response.use(
  function({data: res, config}) {
    // console.log(arguments)
    if (config.loading) {
        loadingNum -= 1
        if(loadingNum == 0) {
            store.dispatch("global/toggleApiLoading", false);
        }
    }

    const { code, msg } = res.data || {};
    if (res.code == "ok") {
      return res.data;
    } else {
      // 有报错统一的报错提示
      if (!config.useOwnErrPop) {
        Toast(msg || res.error || res.msg || '异常报错');
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
export default function (method: string, url: string, data = null, option:{loading?:boolean;useOwnErrPop?:boolean} = {}) {
  method = method.toLowerCase();
  // useOwnErrPop 不传那就统一弹，传true就自己弹对应的文案
  let conf = {loading:option.loading !== false, useOwnErrPop: !!option.useOwnErrPop}
  if (method == "post") {
    return service.post(url, data, conf);
  } else if (method == "get") {
    return service.get(url, { params: data, ...conf });
  } else if (method == "delete") {
    return service.delete(url, { params: data, ...conf });
  } else if (method == "put") {
    return service.put(url, data, conf);
  } else {
    console.error("未知的method" + method);
    return false;
  }
}
