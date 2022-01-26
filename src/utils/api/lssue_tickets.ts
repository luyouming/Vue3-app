import { createApi } from "./createApi";

const lssueTicketsAPI: any = {};
createApi(
  [
    // 获取列表
    {
      name: "getList",
      actionType: "post",
      url: "hix:" + "issueTicket/issueTickets",
    },
    // 驳回
    {
      name: "rejectOrder",
      actionType: "post",
      url: "hix:" + "issueTicket/reject",
    },
    //修改乘客信息
    {
      name: "editPassenger",
      actionType: "post",
      url: "hix:" + "issueTicket/trains/passenger",
    },
    // 提交出票检查
    {
      name: "commitCheck",
      actionType: "post",
      url: "hix:" + "issueTicket/commit/check",
    },
    // 提交出票
    {
      name: "commitTickets",
      actionType: "post",
      url: "hix:" + "issueTicket/commit",
    },
    // 获取识别失败详情数据
    {
      name: "ticketsErrors",
      actionType: "post",
      url: "hix:" + "issueTicket/ocr/backfillFailed/list",
    },
    // 匹配ocr乘客和真实乘客
    {
      name: "backfilFailled",
      actionType: "post",
      url: "hix:" + "issueTicket/ocr/backfillFailed/match",
    },
    // 查询出票和回填结果汇总信息
    {
      name: "backfilFailledSummary",
      actionType: "post",
      url: "hix:" + "issueTicket/batch/backFill/summary",
    },
  ],
  lssueTicketsAPI
);
export default lssueTicketsAPI;
