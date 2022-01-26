// cookie
import * as cookie from "tcfe-helper/util/cookie";
import * as dateFn from "tcfe-helper/util/date";
import * as ls from "tcfe-helper/util/storage";

// 配置信息
// import { platId, userKey, isTest } from "./config"
// wxmp 渠道
const isTest = window.location.pathname.indexOf("hsrtfronttest") > -1;
const platId = 501;
// cookie的位置
const userKey = "WxUser";

function getQuery(str, key, r) {
  return new RegExp("[&? ]" + key + "=([^&]*)&?", r || undefined).test(
    "&" + str
  )
    ? RegExp.$1
    : "";
}

// 获取cookie中的信息
function getCookParam(key, cKey = userKey, r = "i") {
  return getQuery(cookie.getItem(cKey) || "", key, r);
}

// refid
// search 中的  hash中路由的参数  cookie中的参数 都不区分大小写 refid
//let refId = decodeURIComponent(getQuery(window.location.search, 'refid', 'i') || getQuery(window.location.hash.split('?')[1] || '', 'refid', 'i') || '') || cookie.getItem('17uCNRefId')
let ug = navigator.userAgent + "";
let isIOS = !!ug.match(/\(i[^;]+;(:? U;)? CPU.+Mac OS X/);
let vIOS = 0;
if (isIOS) {
  let v = ug.match(/ OS (\d+_\d+)(:?_\d+)* like/i);
  if (v) {
    vIOS = parseFloat(v[1].replace(/_/, ".")) || 0;
  }
}
let isAndroid = false;
if (ug.indexOf("Android") > -1 || ug.indexOf("Linux") > -1) {
  isAndroid = true;
}
const CURRENT_ENV = process.env.VUE_APP_ENV;
const CURRENT_CHANNEL = process.env.VUE_APP_CHANNEL;
let isDev = CURRENT_ENV == "development";
let isWxmp = CURRENT_CHANNEL == "wxmp";
let isTravel = CURRENT_CHANNEL == "travel";

// document.addEventListener("plusready", function (a) {
//   //等待plus ready后再调用5+ API：
//   // 在这里调用5 + API uuid ，虽然一台电脑打包到不同的设备上是稳定的，但多人协作发现(同一账号)不同电脑打包出来uuid不一样
//   // plus.device.getInfo({
//   //   success: function (e) {
//   //     alert('getDeviceInfo success: ' + JSON.stringify(e));
//   //     window.uuid = e.uuid
//   //     env.uuid = e.uuid
//   //   },
//   //   fail: function (e) {
//   //     alert('getDeviceInfo failed: ' + JSON.stringify(e));
//   //   }
//   // });
//   //  android10+ 兼容
//   //  匿名设备标识符（OAID）最长为64位字符串，所有应用获取的值相同，可用于个性化推荐、广告等业务。 系统首次启动后生成，用户手动重置、恢复出厂设置、设备商重置、被刷机等操作会重置此标识。
//   //   ===>  https://service.dcloud.net.cn/build/download/ac223520-c349-11eb-990b-5f1251744393
//   plus.device.getOAID({
//     success: function (e) {
//       window.uuid = e.oaid;
//       env.uuid = e.oaid;
//     },
//     fail: function (e) {
//       alert("getOAID failed: " + JSON.stringify(e));
//     },
//   });
// });
// 为开发环境下模拟器下调试方便 mock数据为领导角色
if (isDev) {
  window.uuid = "28739d2a-ed91-44fe-a46e-55a51a18ddd7";
}

const uuid = window.uuid || "";
let env = {
  // 开发版本
  isDev,
  isTest,
  isTouch: CURRENT_CHANNEL == "touch",
  isWxmp,
  isTravel,
  // 是否为ios
  isIOS,
  vIOS,
  uuid, // 设备的uuid
  // 是否为安卓
  isAndroid,
  protocol: window.location.protocol.indexOf("http") == 0 ? "" : "https:",
};

// 学生票判断
let stuSeatText = "/硬座/硬卧/二等座/无座";
let stuDateMonth = "/6/7/8/9/12/1/2/3";
// if ((isTest || isDev) && window.location.search == "?stu") {
//     // 测试环境，当月不算学生购票月
//     stuDateMonth = "/6/8/9/12/1/2/3";
// }
env.stuCanBuyMonth = stuDateMonth;
env.isInStudent = function (date, seat) {
  date = date ? [].concat(date) : [];
  seat = seat ? [].concat(seat) : [];
  let flg = true;
  if (date.length) {
    for (let item of date) {
      let m = dateFn.create(item);
      // 从今天开始算往后45天，如果配置日期在45天范围内则走正常逻辑
      m = m.getMonth() + 1;
      flg = stuDateMonth.indexOf(m) > 0;
      if (!flg) {
        break;
      }
    }
  }
  if (flg && seat.length) {
    for (let item of seat) {
      flg = stuSeatText.indexOf(item) > 0;
      if (!flg) {
        break;
      }
    }
  }
  return flg;
};

// 获取userid
function getUserid() {
  return encodeURIComponent(
    getCookParam("userid") ||
      getCookParam("MemberId", "CooperateWxUser") ||
      getCookParam("MemberId", "CooperateTcWxUser")
  );
}

function getMobile() {
  return getCookParam("mobile");
}

let isForCar = false;
Object.defineProperty(env, "isForCar", {
  get() {
    return isForCar;
  },
  set(val) {
    isForCar = !!val;
  },
});

// refId window.__wxjs_environment === 'miniprogram'
Object.defineProperty(env, "isMiniProgram", {
  get() {
    if (!isWxmp) {
      return false;
    }
    if (window.__wxjs_environment == undefined) {
      // 尽量满足 检测需要
      return ug.indexOf("miniProgram") >= 0;
    }
    return window.__wxjs_environment === "miniprogram";
  },
});

let inPlatId;
Object.defineProperty(env, "platId", {
  get() {
    return inPlatId || platId;
  },
  set(id) {
    inPlatId = id;
  },
});

// refId window.__wxjs_environment === 'miniprogram'
Object.defineProperty(env, "refId", {
  get() {
    return (
      cookie.getItem("CNSEInfo").split("&")[0].substr(6) ||
      cookie.getItem("17uCNRefId").split("&")[0].substr(6)
    );
  },
});

// innerRefid
Object.defineProperty(env, "innerRefId", {
  get() {
    return ls.getItem("wxmp_train_inner_refid");
  },
});

// 用户 memberid
let userId;
Object.defineProperty(env, "userId", {
  set(id) {
    userId = id;
  },
  get() {
    if (userId !== undefined) {
      return userId || "";
    }
    return getUserid();
  },
});

// 绑定手机号码
Object.defineProperty(env, "mobile", {
  get() {
    return getMobile();
  },
});

// openid 微信，其他平台，可能取值不一样
let openId;
Object.defineProperty(env, "openId", {
  set(id) {
    openId = id;
  },
  get() {
    if (openId !== undefined) {
      return openId || "";
    }
    return getCookParam("openid") || "";
  },
});
// openid 微信，其他平台，可能取值不一样
let unionId;
Object.defineProperty(env, "unionId", {
  set(id) {
    unionId = id;
  },
  get() {
    if (unionId !== undefined) {
      return unionId || "";
    }
    return getCookParam("unionid") || "";
  },
});
// token
Object.defineProperty(env, "token", {
  get() {
    return getCookParam("token");
  },
});

// token
Object.defineProperty(env, "isLogin", {
  get() {
    return !!(getUserid() || getCookParam("openid") || false);
  },
});

// token
Object.defineProperty(env, "keyId", {
  get() {
    return env.userId || env.openId || "";
  },
});

// token
Object.defineProperty(env, "orgin", {
  get() {
    return {
      userId: getUserid(),
      openId: getCookParam("openid"),
      platId: platId,
    };
  },
});

export default env;
