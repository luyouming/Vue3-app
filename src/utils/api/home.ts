import { createApi } from "./createApi";

const homeAPI: any = {};
createApi(
  [
    // 查询出票批次列表
    {
      name: "getIssueTicketBatches",
      actionType: "post",
      url: "hix:" + "issueTicket/batches",
    },
    // 查询退票批次列表
    {
      name: "getRefundTicketBatches",
      actionType: "post",
      url: "hix:" + "issueTicket/batches",
    },
    // ** 测试转换接口
    {
      name: "getConvertInfo",
      actionType: "get",
      url: "hix:" + "appcontentbff/api/test/convert/",
    },
  ],
  homeAPI
);
export default homeAPI;
