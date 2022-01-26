import { createApi } from "./createApi";

const commonAPI: any = {};
createApi(
  [
    // 校验身份证接口
    // {
    //   name: 'getVerify',
    //   actionType: 'get',
    //   url: "fro:" + '/multiple/checkIdentityElement'
    // },
    // // 测试用的获取高铁+ 订单详情接口
    // {
    //   name: 'getDetail',
    //   actionType: 'post',
    //   url: "hix:" + '/travel/order/findDetail'
    // },
    // // 识别拍摄的票据接口
    // {
    //   name: 'getRecogniseResult',
    //   actionType: 'post',
    //   url: '/ticketHelper/issueTickets/recognise'
    // }
  ],
  commonAPI
);
export default commonAPI;
