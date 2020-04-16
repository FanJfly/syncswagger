#### 同步swagger api

#### 本地启动mock服务

```

// 本地启动生成mock数据服务，需要自己写一个服务，如果是使用express代码如下：

var express = require('express')
var app = express()
var join = require('path').join
var fs = require('fs')
var bodyParser = require("body-parser");
var { synchronizeSwagger } = require('./synchronizeSwagger')

// post解析body,默认是application/x-www-form-urlencoded需要解析成json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.all('*', function (req, res, next) {
  //设置允许跨域访问该服务.
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("X-Powered-By", ' 3.2.1')
  // post请求需要加入Content-Type
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

function scan(path, app) {
  const files = fs.readdirSync(path);

  for (let i = 0; i < files.length; i++) {
    const fpath = join(path, files[i]);
    const stats = fs.statSync(fpath);
    if (stats.isDirectory()) {
      scan(fpath, app);
    }
    if (stats.isFile() && stats.size > 0) {
      require(fpath)(app);
    }
  }
}

app.post('/swagger', function (req, res) {
  if (req.body) {
    synchronizeSwagger.init(req.body).then(item => {
      if (item.state === 'success') {
        console.log('success',item)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  res.send(req.body)
})
app.get('/test', function (req, res) {
  res.json({ message: 'success' })
})



app.listen(10013, function () {
  console.log('');
  scan(join(__dirname, './mock'), app);
});




```



> 说明

需要在本地文件根目录下添加swagger.config.js
```
module.exports = {
  url: ' http://swagger/api-docs',// 默认swagger api地址
  outputPath: './mock', //默认目录
  blacklist: [],  // 黑名单 默认是模块 例如：['report'] 默认不更新report下的所有接口
  dataLength: '1-8', // mock 为数组时数组长度
  fileName: 'mock.js'
}
```
