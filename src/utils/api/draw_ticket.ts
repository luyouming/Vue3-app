import { createApi } from "./createApi";

const drawTicketAPI: any = {};
createApi(
  [
    // 查询车次列表页
    {
      name: "getTrains",
      actionType: "post",
      url: "hix:" + "issueTicket/trains",
    },
    // 查询识别结果汇总信息
    {
      name: "getSummary",
      actionType: "post",
      url: "hix:" + "issueTicket/commit/results/summary",
    },
    // 查询提交出票结果
    {
      name: "getBackFillFailedPassengers",
      actionType: "post",
      url: "hix:" + "issueTicket/commit/results",
    },
    // 获取车次列表下载token
    {
      name: "getExportToken",
      actionType: "post",
      url: "hix:" + "issueTicket/trains/export/token",
    },
  ],
  drawTicketAPI
);
export default drawTicketAPI;
