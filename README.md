#### 同步swagger api

#### 使用方法

```
// 安装管理npm源工具nrm
yarn global add nrm
// 添加wyny内网仓库
nrm add wyny http://172.16.11.82:4873
// 添加成功后设置为内网源
nrm use wyny
// 添加synchronizeSwagger包
yarn add synchronizeSwagger --dev
// 本地添加swagger.config.js

// package.json 添加启动命令
"syncSwagger": "syncSwagger",
// 生成mock数据
npm run syncSwagger
```

> 说明

需要在本地文件根目录下添加swagger.config.js
```
module.exports = {
  //url: 'http://172.16.11.28/api/v1/app-utilize-elec/v2/api-docs' // 用电app
  url: 'http://172.16.11.28/api/v1/utilize-electricity/v2/api-docs',// 用电
  //url: 'http://172.16.11.85:36908/v1/energy-ecosystem/v2/api-docs', // 大生态
  outputPath: './mock', // 默认目录，最终会自动生成文件 outputPath/mock.js
  blacklist: [],  // 黑名单 默认是模块 例如：['report'] 默认不更新report下的所有接口
  dataLength: '1-8', // mock 为数组时数组长度
  fileName: 'mock.js' 
}
```
