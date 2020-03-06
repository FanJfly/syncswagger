#### 同步swagger api

#### 本地启动mock服务

```

// 本地启动生成mock数据服务，默认mock地址为localhost:10013
node bin/syncSwagger.js 

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
