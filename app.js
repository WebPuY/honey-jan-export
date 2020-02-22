/**
 * author: August
 *  参数：
 *    端口： port
 *    目录： dir， 默认在当前目录下
 *    需要的前缀: words=a|b|c|d
 */

const express = require('express')
const app = express()
const nodeExcel = require('excel-export')
const os = require('os');
const fs = require('fs')
const opn = require('open')
const path = require('path')
const textract = require('textract')

// const filePath = os.homedir() + '/Desktop/documents/docs'
const filePath = path.resolve(__dirname)
const params = getParams()

const resultArray = [] // 存储所有key,value的数组

function uniqe (array) {
  let temp = [] // 一个新的临时数组
  let result = []
  for (let i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i].key) === -1) {
      temp.push(array[i].key)
      result.push(array[i])
    }
  }
  return result
}

app.get('/', function (req, res) {
  let array = resultArray || []
  let conf = {}
  conf.cols = [{
    caption: 'words',
    type: 'string'
  }, {
    caption: params.lang || 'desc',
    type: 'string'
  }]
  conf.rows = []
  // 去重
  array = uniqe(array)
  // 排序
  array = array.sort((a, b) => {
    return a.key - b.key > -1
  })
  array.forEach((item) => {
    conf.rows.push([item.key, item.value])
  })
  const result = nodeExcel.execute(conf)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats') // application/vnd.openxmlformats
  if (params.fileName) {
    res.setHeader('Content-Disposition', 'attachment; filename=' + params.fileName + '.xlsx')
  } else {
    res.setHeader('Content-Disposition', 'attachment; filename=default.xlsx')
  }
  res.end(result, 'binary')
  console.log('successfully!')
  process.exit()
})


// 文件遍历方法
function fileDisplay (filePath) {
  console.log('start traversing directory....')
  // 根据文件路径读取文件，返回文件列表
  const readdir = fs.readdirSync(filePath) || []
  const words = params.words.split('|') || []

  readdir.forEach((filename) => {
    // 获取当前文件的绝对路径
    let filedir = path.join(filePath, filename)
    if (filedir.indexOf('node_modules') > -1) {
      return
    }
    if (/\.(?:scss|less|css|html|png|img|jpg)$/.test(filedir)) {
      return
    }
    // 读取文件内容
    textract.fromFileWithPath(filedir, {
      preserveLineBreaks: true
    }, (error, text ) => {
      if (error) {
        return
      }
      if (!words) {
        console.log('------输入搜索关键字-------')
      }

      // 先将text按空行分为几个内容块 paragraph
      // 然后将内容块分行，key是第一行line[0] value是剩余内容
      text.split('\n\n').forEach(paragraph => {
        words.forEach((word) => {
          let index = paragraph.indexOf(word)
          if (index > -1) {
            // console.log(word, '------', paragraph.slice(index + word.length))
            resultArray.push({
              key: word,
              value: paragraph.slice(index + word.length)
            })
          }
        })
      })
    })
  })
}

function getParams () {
  const argvs = process.argv || []
  if (argvs.length > 1) {
    let obj = {}
    let reg = /^(\S+)=(\S+)$/
    argvs.forEach((item, index) => {
      if (index > 1 && reg.test(item)) {
        item.replace(reg, (_, $1, $2) => {
          obj[$1] = $2
        })
      }
    })
    return obj
  } else {
    return {}
  }
}

function motor () {
  console.log('waiting a few seconds........')
  fileDisplay(filePath)
  let port = params.port || +('80' + Math.floor(Math.random() * 100))
  app.listen(port)
  setTimeout(_ => {
    opn(`http://localhost:${port}`)
  }, 3000)
}

exports.motor = motor
