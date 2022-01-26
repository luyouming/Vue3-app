import request from "./request";
export const createApi = (
  apiBaseInfo: any[],
  // eslint-disable-next-line no-unused-vars
  API: { [x: string]: (params: null | undefined) => any }
) => {
  apiBaseInfo.forEach((item) => {
    API[item.name] = (params: null | undefined) => {
      return request(item.actionType, item.url, params);
    };
  });
};
