const getStatus = require('./deployStatus')
const execSync = require('child_process').execSync

function mkVersion() {
    var now = new Date()
    return ('' + now.getFullYear()).slice(-2) + ('00' + (now.getMonth() + 1)).slice(-2) + ('00' + now.getDate()).slice(-2) + ('00' + now.getHours()).slice(-2) + ('00' + now.getMinutes()).slice(-2) + ('00' + now.getSeconds()).slice(-2)
}

class Upload {
    constructor() {
        this.tag = 'stage_' + mkVersion()
    }
    buildTag() {
        // let results
        let errMsg = ''
        try {
            // eslint-disable-next-line
            console.log('没有发现冲突，开始 add...')
            execSync(`git add -A `, {
                encoding: 'utf-8'
            })
            // console.log(results)
            // eslint-disable-next-line
            console.log('add结束， 开始commit...')
            execSync(`git commit -m build_version_${this.tag}`, {
                encoding: 'utf-8'
            })
        } catch (e) {
            if (!e.stdout || (e.stdout.indexOf('无文件要提交') < 0 && e.stdout.indexOf('nothing to commit') < 0)) {
                errMsg = '\x1B[31m >>>>>>>>>>>>>>> ' + e + ' <<<<<<<<<<<<<<<<<< \x1B[0m'
            }
        }

        if (!errMsg) {
            try {
                // eslint-disable-next-line
                console.log('commit结束， 开始push...')
                execSync(`git push `, {
                    encoding: 'utf-8'
                })
                // console.log(results)
                // eslint-disable-next-line
                console.log('push结束， 开始打tag...')
                var tagVersion = `${this.tag}`
                execSync(`git tag -a ${tagVersion} -m ${tagVersion}`, {
                    encoding: 'utf-8'
                })
                // console.log(results)
                // eslint-disable-next-line
                console.log(`tag版本号 ${tagVersion}， 开始发布tag...`)
                execSync(`git push origin ${tagVersion}`, {
                    encoding: 'utf-8'
                })
                // console.log(results)
                // eslint-disable-next-line
                console.log(`tag发布成功，JEAN自动部署 ----- ${tagVersion}`)
                getStatus(tagVersion)
            } catch (e) {
                errMsg = '\x1B[31m >>>>>>>>>>>>>>> ' + e + ' <<<<<<<<<<<<<<<<<< \x1B[0m'
            }
        }

        if (errMsg) {
            // eslint-disable-next-line
            console.log(errMsg)
            // eslint-disable-next-line
            console.log('\x1B[31m >>>>>>>>>>>>>>>自动发布失败<<<<<<<<<<<<<<<<<< \x1B[0m')
        }
    }
}
new Upload().buildTag()
