const Spin = require("./spinner");
// const { ajax } = require('rimjs/ajax')
const axios = require("axios");
// import axios from "axios";
// console.log(axios);
// const conf = require('../../serve/config.json')
// const appUK = conf.appUK
const appUK = "cvg.shopping.mall";
const deployStatusTypes = {
  deploying: "⬆ 部署中...",
  success: "✔ 部署成功!",
  failed: "❌ 部署失败!",
};

module.exports = function (buildVersion) {
  if (!appUK) {
    throw "appUK 为空，请配置";
  }
  let spin;
  let startTime = new Date().getTime();

  function getStatus() {
    axios
      .get("http://furt.corp.elong.com/serviceapi/api/deploy/record/last", {
        params: {
          serviceName: appUK,
          deployment: "stage",
        },
      })
      .then((res) => {
        let code = res.data.data.status || "";
        let version = res.data.data.version || "";
        // console.log('code', version)
        if (version.indexOf(buildVersion) < 0) {
          code = "deploying";
        }
        if (!spin) {
          spin = new Spin().start();
        }
        // console.log("JEAN部署状态:"+ deployStatusTypes[code])
        if (code === "deploying") {
          spin.update(
            "[" +
              Math.ceil((new Date().getTime() - startTime) / 1000) +
              "s]JEAN部署状态:" +
              version +
              "::" +
              deployStatusTypes[code]
          );
          setTimeout(() => {
            getStatus();
          }, 1000);
          return;
        }
        let icon = code === "success" ? "\x1B[32m✔" : "\x1B[31m✖";
        spin.stop(
          `${icon} \x1B[0m[${Math.ceil(
            (new Date().getTime() - startTime) / 1000
          )}s]JEAN部署状态:${deployStatusTypes[code]}\n`
        );
      });
    // ajax.load(
    //     '<get>http://furt.corp.elong.com/serviceapi/api/deploy/record/last',
    //     function ({ res }) {
    //         let code = res.getData('data.status') || ''
    //         let version = res.getData('data.version') || ''
    //         // console.log('code', version)
    //         if (version.indexOf(buildVersion) < 0) {
    //             code = 'deploying'
    //         }
    //         if (!spin) {
    //             spin = new Spin().start()
    //         }
    //         // console.log("JEAN部署状态:"+ deployStatusTypes[code])
    //         if (code === 'deploying') {
    //             spin.update('[' + Math.ceil((new Date().getTime() - startTime) / 1000) + 's]JEAN部署状态:' + version + '::' + deployStatusTypes[code])
    //             setTimeout(() => {
    //                 getStatus()
    //             }, 1000)
    //             return
    //         }
    //         let icon = code === 'success' ? '\x1B[32m✔' : '\x1B[31m✖'
    //         spin.stop(`${icon} \x1B[0m[${Math.ceil((new Date().getTime() - startTime) / 1000)}s]JEAN部署状态:${deployStatusTypes[code]}\n`)
    //     },
    //     {
    //         serviceName: appUK,
    //         deployment: 'stage'
    //     }
    // )
  }

  getStatus();
};
