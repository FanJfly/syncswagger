const swaggerParserMock = require('swagger-parser-mock');
const fs = require('fs');
const mkdirp = require('mkdirp')

const synchronizeSwagger = {
  async init({ url, blacklist, outputPath, dataLength, fileName, whitelist, prefix="/", independentServer }) {
    this.url = url;
    this.blacklist = blacklist;
    this.whitelist = whitelist;
    this.outputPath = outputPath;
    this.dataLength = dataLength;
    this.fileName = fileName;
    this.content = '';
    this.prefix = prefix;
    this.independentServer = independentServer;
    await this.parse()
    if (this.content) {
      await writeToMockFile(this.outputPath, this.fileName, this.content, this.independentServer)
      return ({ state: 'success', content:this.content })
    } else {
      return ({ state: 'failed' })
    }
  },
  // 解析swagger-api-doc
  async parse() {
    const { paths } = await swaggerParserMock(this.url)
    this.checkFileExist().then(this.traverse(paths))
    if (!paths) return;

  },
  // 初始化目录 判断是否有该文件
  async checkFileExist() {
    return new Promise((resolve,reject) => {
      fs.exists(this.outputPath, (exists) => {
        if (!exists) {
          // 新建该文件夹
          mkdirp(this.outputPath, (err) => {
            throwErr(err)
            initTemp(this.outputPath, this.fileName)
          })
        } else {
          initTemp(this.outputPath, this.fileName)
        }
      });
      resolve()
    })
  },

  // 遍历paths
  traverse(paths) {
    let index = 0;
    this.content = ''
    for (let path in paths) {
      index++
      this.traverseMethod(paths, path)
      if (this.blacklist.length && !this.blacklist.includes(path.match(/[a-zA-z]+/g)[0])) {
         this.traverseMethod(paths, path)
      }
    }
  },

  // 遍历某模块下的所有方法
  traverseMethod(paths, path) {
    for (let method in paths[path]) {
      const summary = paths[path][method]['summary'];
      const response = paths[path][method]['responses']['200'];
      this.generate(summary, response['example'], method, path);
    }
  },
  // 生成指定格式的文件后写入到指定文件中
  async generate(summary, example, method, path) {
    try {
      const data = this.generateTemplate({ summary, example, method, path });
      this.content += data
    } catch (error) { }
  },
  
  // 生成mock api模版 
  generateTemplate({ summary, example, method, path }) {
    // api path中的{petId}形式改为:petId
    const data = formatResToMock(path, example, this.dataLength);
    let temp = !this.independentServer ? 
      `
      // ${summary}
      '${method.toUpperCase()} ${this.prefix}${path.replace(/\{([^}]*)\}/g, ':$1')}': (req, res) => {
        res.send(Mock.mock(${data.replace(/null/g, '') || `true`}));
      },
      `
    :
      `/**
        ${summary}
        **/
        app.${method}('${this.prefix}/api${path.replace(/\{([^}]*)\}/g, ":$1")}', (req, res) => {
          res.send(Mock.mock(${data.replace(/null/g, '') || `true`}));
        });`;
    return temp;
  },
};

// 格式化mock，如果是menu直接拿/mock/menu.json,其它如果是数组，自动添加多条数据
function formatResToMock(path, res, dataLength) {
  let data = '';

  if (path.includes('menu')) {
    data = `{ 
      code: 1001, 
      message: 'success' ,
      "data": require('./menu.json')
    }`;
  } else {
    let praseRes = JSON.parse(res);
    if (Array.isArray(praseRes)) {
      data = `{ 
      code: 1001, 
      message: 'success' ,
      "data|${dataLength}": ${res}
    }`;
    } else {
      Object.keys(praseRes).forEach(key => {
        if (Array.isArray(praseRes[key])) {
          praseRes[`${[key]}|${dataLength}`] = praseRes[key];
          delete praseRes[key];
        }
      });
      data = `{ 
      code: 1001, 
      message: 'success' ,
      "data": ${JSON.stringify(praseRes)}
    }`;
    }
  }
  return data;
}

// 将mock数据写入js文件
function writeToMockFile(outputPath, fileName, content, independentServer) {
  // 写入文件
  let template = !independentServer ? 
  `var Mock = require('mockjs')
  export default {
    ${content}
  }
    `
    :
    `const Mock = require('mockjs')
    module.exports = function(app) {
      ${content}
    }
  `;
  fs.writeFile(`${outputPath}/${fileName}`, template, err => throwErr)
}

// 初始模版
function initTemp(path, fileName) {
  fs.writeFile(`${path}/${fileName}`, '', err => throwErr(err))
}
function throwErr(err) {
  if (err) {
    console.error('同步失败', err)
    throw (err)
  }
}

module.exports = {
  synchronizeSwagger
}
