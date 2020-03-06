module.exports = {
  url: ' http://swagger/api-docs',// 默认swagger api地址
  outputPath: './mock', //默认目录
  blacklist: [],  // 黑名单 默认是模块 例如：['report'] 默认不更新report下的所有接口
  dataLength: '1-8', // mock 为数组时数组长度
  fileName: 'mock.js',
  prefix:'/' //自定义mock前缀，默认为/，若有api可修改为/api
}
