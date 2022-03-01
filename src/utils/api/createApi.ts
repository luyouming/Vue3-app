import request from "./request";
export const createApi = (
  apiBaseInfo: any[],
  // eslint-disable-next-line no-unused-vars
  API: { [x: string]: (params: any, option?:{loading?:boolean;useOwnErrPop?:boolean}) => any }
) => {
  apiBaseInfo.forEach((item) => {
    API[item.name] = (params, option) => {
      return request(item.actionType, item.url, params, option);
    };
  });
};
