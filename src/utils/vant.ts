// import {
//   Button,
// } from "vant";
// import errImg from '@/assets/img/404.png';
import Vant from "vant";
import "vant/lib/index.css";
export default function install(app: any) {
  // 2021 按需引入vant 部分组件，方便开发，提高效率
  app
    // vue3 中不再天然支持，需要安装vue3-lazy
    .use(Vant);
  // .use(lazyPlugin, {
  //   // loading: require("@/assets/img/404.png"), // 加载时默认图片
  //   error: errImg, // 图片失败时默认图片
  // });
  // .use(DropdownItem)
  // .use(Calendar)
  // .use(Slider)
}
