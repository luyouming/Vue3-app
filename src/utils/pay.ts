import axios from "axios";
import currentEnv from "./env";
declare const window: Window & { WeixinJSBridge: any; WVJBCallbacks: any };

export default function install(app: {
  config: { globalProperties: { $func: any } };
}) {
  let func: any = {};
  // let { env, ajax } = joint;
  let env = currentEnv;

  let payFlag = false;
  // 全部走微信js-sdk
  func.pay = function (
    {
      orderSerialId,
      // expireTime,
      orderAmount,
    },
    callback,
    apiUrl
  ) {
    if (payFlag) {
      // 防止提交多次
      return;
    }
    payFlag = true;

    let payProducts = 1108;

    let para = {
      orderSerialId,
      orderAmount,
      payProducts,
      fromPlat: 2, // env.isMiniProgram ? 1 : 2
    };

    axios
      .post(apiUrl || "hsrtmiddletest/payment/getPayLinkInfoToTravel", para)
      .then((res) => {
        let payData = res?.data?.data?.tenAppPay || {};
        // console.log(!payData.sign)
        if (!payData.sign) {
          payFlag = false;
          callback &&
            callback({
              code: 100,
              text: res?.data?.error || "获取支付数据失败",
            });
          return;
        }
        let payPara: any = {
          nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
          package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: payData.signType || "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: payData.sign, // 支付签名
        };
        // 内嵌h5 支付
        if (env.isMiniProgram) {
          // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          payPara.timeStamp = payData.timeStamp;
          payPara.appId = "wx3827070276e49e30"; // 公众号名称，由商户传入
          window.WeixinJSBridge.invoke(
            "getBrandWCPayRequest",
            payPara,
            (res) => {
              let err = res.err_msg;
              let isSucc = err == "get_brand_wcpay_request:ok";
              let isCancel = err == "get_brand_wcpay_request:cancel";
              // 作为通知
              isSucc &&
                axios.post("hix:order/payingOrder", {
                  orderSerialId: orderSerialId,
                });
              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              payFlag = false;
              callback &&
                callback({
                  code: isSucc ? 0 : isCancel ? -1 : 200,
                  text: err,
                });
            }
          );
          return;
        }

        // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        // payPara.timestamp = payData.timeStamp;
        // payPara.success = function (res) {
        //   let err = res.errMsg;
        //   let isSucc = err == "chooseWXPay:ok";
        //   let isCancel = err == "chooseWXPay:cancel";
        //   // 作为通知
        //   isSucc &&
        //     ajax.post("hix:order/payingOrder", () => {}, {
        //       orderSerialId: orderSerialId,
        //     });
        //   // 支付成功后的回调函数
        //   payFlag = false;
        //   callback &&
        //     callback({
        //       code: isSucc ? 0 : isCancel ? -1 : 200,
        //       text: err,
        //     });
        // };
        // payPara.cancel = function () {
        //   payFlag = false;
        //   callback &&
        //     callback({
        //       code: -1,
        //       text: "cancel",
        //     });
        // };

        //
        // window.wx.chooseWXPay(payPara);
      });
  };
  app.config.globalProperties.$func = func;
}
