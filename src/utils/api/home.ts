import { createApi } from "./createApi";

const homeAPI: any = {};
createApi(
  [
    // ** 测试转换接口
    {
      name: "getConvertInfo", 
      actionType: "get",
      url: "hix:" + "cvgmallbff/api/test/recommendList",
    },
  ],
  homeAPI
);
export default homeAPI;
