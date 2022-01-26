import { createApi } from "./createApi";

const scanResultAPI: any = {};
createApi(
  [
    // 查询识别结果
    {
      name: "getList",
      actionType: "post",
      url: "hix:" + "issueTicket/ocr/passengers",
    },
    // 查询识别结果汇总信息
    {
      name: "getSummary",
      actionType: "post",
      url: "hix:" + "issueTicket/ocr/summary",
    },
    // 取消识别
    {
      name: "cancelSummary",
      actionType: "post",
      url: "hix:" + "issueTicket/ocr/cancel",
    },
  ],
  scanResultAPI
);
export default scanResultAPI;
