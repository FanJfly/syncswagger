var axios = require('axios')

const synchronizeSwagger = {
  async init(argv) {
    axios({
      method: 'post',
      url: 'http://localhost:10013/swagger',
      data: argv
    }).then(function (response) {
      if(response.status===200){
        console.log('上传swagger配置成功')
      }
    })
      .catch(function (error) {
        console.log(error);
      });
  }
}

module.exports = argv => {
  synchronizeSwagger.init(argv);
}