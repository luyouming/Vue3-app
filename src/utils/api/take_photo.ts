import { createApi } from "./createApi";

const takePhotoAPI: any = {};
createApi(
  [
    // 识别拍摄的票据接口
    {
      name: "getRecogniseResult",
      actionType: "post",
      url: "hix:" + "issueTicket/ocr",
    },
  ],
  takePhotoAPI
);
export default takePhotoAPI;
