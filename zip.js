const adm_zip = require('adm-zip')
const rm = require('rimraf')
const fs = require('fs')
const argv = process.argv

fs.exists('./dist', (s) => {
    if (s) {
        handle()
        delDir()
    } else {
        console.log('dist目录不存在')
    }
})

// dist目录zip压缩
function handle () {
    let ver = argv.length > 2 && argv.slice(-1)[0] || '01'
    let t = new Date()
    let month = t.getMonth() + 1
    let day = t.getDate()
    let date = '' + t.getFullYear() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day)
    let filename = `dist-${date}-${ver}.zip`
    const zip = new adm_zip()
    zip.addLocalFolder('./dist')
    zip.writeZip(`./${filename}`)
    console.log('dist 压缩完成')
}

// 删除 dist 目录
function delDir() {
    if (!argv.includes('del')) return
    rm('./dist', () => {
        console.log('dist deleted')
    })
}

