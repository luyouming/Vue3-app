import ajax from "tcfe-helper/util/ajax";
import * as storage from "tcfe-helper/util/storage";
// !! vue2 的写法依旧是兼容的，反而vue3 因为没有this ，以及部分写法不同容易造成困扰，这里倒建议用老的写法

// 页面容器下拉和上拉判断并做逻辑
// ** 给需要监听的对象加 ref = pullContainer 可加 pullDownOrUp_refName  覆盖名字
// ** 请在被混入页面 写pullDownOrUp_afterPullUp   pullDownOrUp_afterPullDown  覆盖默认的上下拉后处理事件，
// ** 如果下拉距离是需要自定义的 那就加一个 pullDistance  覆盖默认值 150
export const pullDownOrUp = {
  data() {
    return {
      touchStartPointY: 0,
      touchEndPointY: 0,
      pullDistance: 150,
      theThingAfterPullIsDoing: false, // pull up 或 down 之后的事情正在做，还没结束
      pullDownOrUp_refName: "pullContainer",
    };
  },
  methods: {
    // 下拉触发加载更多
    touchStart(event) {
      // 获得起点X坐标，初始化distance为0
      this.touchStartPointY = event.targetTouches[0].pageY;
    },
    touchMove(event) {
      // 在当前页面写该方法，因为调用了内部方法
      // 只监听单指划动，多指划动不作响应
      if (event.targetTouches.length > 1) {
        return;
      } else {
        // console.log(event.targetTouches[0].pageX);
        // 实时计算distance
        this.touchEndPointY = event.targetTouches[0].pageY;
        const distance = this.touchEndPointY - this.touchStartPointY;
        // 负的是下拉该做的事情
        if (
          distance < 0 - this.pullDistance &&
          !this.theThingAfterPullIsDoing
        ) {
          this.theThingAfterPullIsDoing = true;
          this.afterPullUp();
        } else if (
          distance > this.pullDistance &&
          !this.theThingAfterPullIsDoing
        ) {
          this.theThingAfterPullIsDoing = true;
          this.afterPullDown();
        }
        // 根据distance在页面上做出反馈。这里演示通过返回按钮的背景变化作出反馈
      }
    },
    touchEnd() {
      this.touchEndPointY = 0;
      this.touchStartPointY = 0;
    },
    // 在混入的页面，上下拉默认做的事。正常比如需要下拉做事，或者都需要，就在被混入页写一下，覆盖掉对应的默认方法
    pullDownOrUp_afterPullDown() {
      // console.log("下拉该做的事");
      this.theThingAfterPullIsDoing = false;
    },
    pullDownOrUp_afterPullUp() {
      // console.log("上拉该做的事");
      this.theThingAfterPullIsDoing = false;
    },
  },
  created() {
    this.$nextTick(() => {
      // $el  组件绑定事件时，需要再,点出$el
      let targetDom =
        this.$refs[this.pullDownOrUp_refName].$el ||
        this.$refs[this.pullDownOrUp_refName];
      // 原先是直接找到对应的容器加 @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
      targetDom.addEventListener("touchstart", (e) => {
        this.touchStart(e);
      });
      targetDom.addEventListener("touchmove", (e) => {
        this.touchMove(e);
      });
      targetDom.addEventListener("touchend", () => {
        this.touchEnd();
      });
    });
  },
};

// 自动吸顶 完美兼容IOS 和 安卓
// 筛选Tab 滚动到一定位置吸顶功能实现，且点击置顶按钮回到吸顶状态
// ** 给需要监听的对象加 ref = topNavBar 可加 toTopTabBarContainer_refName  覆盖名字
// ** showFixedTopNav 展示与否的判断，用来给fixed 的头部加样式自定义
// ** 如果下拉距离是需要的自定义的 那就加一个 showGoTopBtnDistance  覆盖默认值
// ** goToTop 如果想要置顶顶部，那配置 goToTopBtnIsNeeded 和 showGoTopBtnDistance  覆盖默认(默认是到吸顶的tabBar的位置)
export const topTabBarFixed = {
  data() {
    return {
      showGoTopBtnDistance: 800, // 默认800
      showFixedTopNav: false, // 展示置顶的顶部
      showGoTopBtn: false, // 初始化置顶按钮不展示
      goToTopBtnIsNeeded: true, // 需要置顶功能，默认需要
      toTopTabBarContainer_refName: "topNavBar",
    };
  },
  methods: {
    appScroll(e) {
      this.topTabBarFixed_doThingWhenScroll(e);
      // console.log("在监听滚动")
      let scrollTop =
        document.documentElement.scrollTop + document.body.scrollTop;
      if (!this.$refs[this.toTopTabBarContainer_refName]) {
        // console.log("您还未给吸顶tabBar对象加ref,如不需要tabBar 请忽略")
        this.showGoTopBtn =
          this.goToTopBtnIsNeeded && scrollTop > this.showGoTopBtnDistance;
        return;
      }
      if (this.$refs[this.toTopTabBarContainer_refName].offsetTop > 0) {
        storage.setItem(
          "topNavToTop",
          this.$refs[this.toTopTabBarContainer_refName].offsetTop,
          -1
        );
      }
      const parentToTop = storage.getItem("topNavToTop");
      if (
        !parentToTop &&
        this.$refs[this.toTopTabBarContainer_refName].offsetTop == 0
      ) {
        // 一进来没有存过，距离顶部就是0
        // 那就直接置顶
        this.showFixedTopNav = true;
      } else {
        // 如果超过了距离顶部的距离，那就要吸顶，否则不吸顶
        this.showFixedTopNav = scrollTop > parentToTop;
      }
      // 超过滚动设置出现置顶按钮的距离且开启置顶按钮
      this.showGoTopBtn =
        this.goToTopBtnIsNeeded && scrollTop > this.showGoTopBtnDistance;
      // }
      // if (this.$env.isIOS) {
      //   let parentToTop = storage.getItem("topNavToTop");
      //   this.showFixedTopNav = scrollTop > parentToTop;
      //   this.showGoTopBtn =
      //     this.goToTopBtnIsNeeded && scrollTop > this.showGoTopBtnDistance;
      // } else {
      //   let parentToTop = storage.getItem("topNavToTop");
      //   this.showFixedTopNav = scrollTop > parentToTop;
      //   this.showGoTopBtn =
      //     this.goToTopBtnIsNeeded && scrollTop > this.showGoTopBtnDistance;
      // }
    },
    goScroll() {
      let parentToTop = storage.getItem("topNavToTop");
      let scrollTop =
        document.documentElement.scrollTop + document.body.scrollTop;
      if (scrollTop > parentToTop) {
        document.documentElement.scrollTop = parentToTop;
        document.body.scrollTop = parentToTop;
      }
    },
    //    置顶的方法，可以选择不要吸顶，那就不调用
    goToTop() {
      let parentToTop = storage.getItem("topNavToTop");
      document.documentElement.scrollTop = parentToTop;
      document.body.scrollTop = parentToTop;
    },
    topTabBarFixed_doThingWhenScroll(e) {
      // console.log('如果想要在下滑距离底部一定距离时触发，在这里加');
    },
  },
  created() {
    // 监听滚动，当到一定位置的时候tab出现和切换
    storage.removeItem("topNavToTop");
    window.addEventListener("scroll", this.appScroll);
  },
  destroyed() {
    // 离开时移除监听滚动
    window.removeEventListener("scroll", this.appScroll);
  },
};

// ** 使用
//  <div class="topNavBarBox" ref="topNavBar" :class="{topNavBarBox_Fixed: showFixedTopNav}"></div>
// .topNavBarBox {} // 本身样式
// .topNavBarBox_Fixed {position: fixed;top: 0;left;z-index: 999;} // 吸顶样式
// <div class="toTopBtn" @click="goToTop" v-show="showGoTopBtn">  // 置顶按钮
// topTabBarFixed_doThingWhenScroll(e) {
//    let scrollBottom = 10000
//    let scrollDom = e.target.scrollingElement
//    if (scrollDom) {
//       scrollBottom = scrollDom.scrollHeight - scrollDom.scrollTop - scrollDom.clientHeight
//     }
//     if (scrollBottom < 1200 && !this.scrollToBottomDoingSomething) {
//        滚动到底部一定距离时比如触发加载下一页功能等
//     }
//     }

// 开启定位 模拟器上和扫码可能无法准确获取定位，真机没问题
// ** locType 是定位的相关状态
export const getLocation = {
  data() {
    return {
      locType: 0, // 0是还没开始定位 1是定位中 2是定位成功 3定位失败
      reOpenLocateKeepGo: true, // 定位失败或者成功之后再点是否继续尝试定位
    };
  },
  methods: {
    // 开启定位
    getLocation_Open() {
      // 还是获取经纬度进行换算靠谱，其它比如腾讯，百度等的api 要么限制次数，并发，要么收费，外网网站访问还受限，都不OK!
      if (this.locType > 1) {
        this.getLocation_reOpen(); // 开启过了
      }
      if (!this.reOpenLocateKeepGo) {
        return;
      }
      this.locType = 1;
      let geo = window.navigator.geolocation;
      let hasGeo = !!geo;
      let getCurrentPosition = (callback) => {
        geo.getCurrentPosition(
          (position) => {
            callback(position);
          },
          (error) => {
            let userStopLocation = false;
            let _location = { tips: "获取位置失败，请重试" };
            switch (error.code) {
              case error.PERMISSION_DENIED:
                _location.tips = "用户拒绝获取地理位置";
                userStopLocation = true;
                break;
              case error.POSITION_UNAVAILABLE:
                _location.tips = "用户拒绝获取地理位置";
                break;
              case error.TIMEOUT:
                _location.tips = "获取用户位置请求超时";
                break;
              // @ts-ignore
              case error.UNKNOWN_ERROR: //出现位置错误
                _location.tips = "获取位置失败，请重试";
                break;
            }
            this.getLocation_Failed(_location.tips, userStopLocation);
          },
          {
            // 高精度
            enableHighAccuracy: true,
            // 响应对打时间 毫秒
            maximumAge: 30000,
            // 缓存最大时间 毫秒
            timeout: 30000,
          }
        );
      };
      let env = this.$env;
      if (!hasGeo) {
        // 无定位
        // this.$toast("浏览器不支持定位")
        this.getLocation_Failed();
        return;
      }
      getCurrentPosition((location) => {
        let coords = location.coords;
        let back = () => {
          if (location.city) {
            // 定位成功了
            //    console.log("定位成功:", location.city)
            this.getLocation_Succeed(location.city); // 定位成功
            return;
          }
          if (this.$env.isDev) {
            // 开发环境 先定位苏州，因为模拟器和扫到手机都无法正常获得定位
            coords = {
              latitude: "31.257563116042391",
              longitude: "120.7365051452685",
            };
          }
          if (coords && coords.latitude && coords.longitude) {
            this.getLocation_getCurCoords(coords); // 经纬度获取成功
            // 定位只有经纬度
            ajax.jsonp(
              env.protocol +
                "//passport.ly.com/member/mapservice.ashx?action=geocoding&coordtype=wgs84ll&output=json&pois=0&location=" +
                coords.latitude +
                "," +
                coords.longitude,
              (res) => {
                coords = null;
                location.city = (
                  (((res.result || {}).result || {}).addressComponent || {})
                    .city || ""
                ).replace(/市+$/, "");
                back();
              }
            );
            return;
          }
          this.getLocation_Failed();
        };
        back();
      });
    },
    // 存储是否开启过定位
    getLocation_Open_locState(flg) {
      if (flg == null) {
        return storage.getItem("koi-city-local");
      }
      flg = !!flg;
      storage.setItem("koi-city-local", flg, -1);
      return flg;
    },
    // 定位失败
    getLocation_Failed(tips, userStopLocation) {
      console.log(
        "定位失败,原因是::" + tips + "  ps:" + userStopLocation
          ? "用户关闭了定位"
          : "用户授权开启了定位"
      );
    },
    // 定位成功
    getLocation_Succeed(locateCity, coords) {
      // 可以获得经纬度
      console.log("恭喜定位成功，当前定位城市::" + locateCity + coords);
    },
    // 存储当前的经纬度
    getLocation_getCurCoords(coords) {
      console.log("当前经纬度::", coords);
    },
    getLocation_reOpen() {
      // 定位失败过啦，此时再点开启定位，正常的话就是再开一次，那就是不做啥处理，继续
      console.log("定位失败过喽");
    },
  },
};

// ** 使用
// 开启定位
// this.getLocation_Open();
// 定位成功
// getLocation_Succeed(locateCity) {
//     this.getCurrentCityInfo(locateCity)
// },
// 定位失败
//  locateFailed(tips) {
//     this.$loading.hide()
//      定位失败，提示
//     this.locType = 3 // 定位失败了，默认为上海，也算成功了
//     this.locCity = {name:"", code: ''}
//     this.$toast(tips ? tips + ",为您切为上海" : "获取位置失败,为您切为上海")
//     this.locCity = { name: "上海", code: "321" } // 默认取上海
//     取消保存的记录
//     this.locState(false)
//   }
// 存储当前的经纬度
//  getLocation_getCurCoords(coords) {
//   console.log("当前经纬度::", coords);
//  },
// 再次开启定位时不走开启定位 reOpenLocateKeepGo => false
//  reOpenLocate() {
//     定位成功或者失败的，再点不想开启定位，走别的逻辑
//     this.cityItemAction(this.locCity, 1)
//     this.reOpenLocateKeepGo = false // 别走了变成选择切换后的城市
//  },
// 已开启过定位
// getLocation_Open_locState;
