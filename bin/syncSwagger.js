#!/usr/bin/env node
'use strict'
const program = require('commander');
const { join } = require('path')

const path = process.cwd()
const config = join(path, 'swagger.config.js')
const data = require(config)
const { synchronizeSwagger } = require('../command/synchronizeSwagger.js')

program
  .action(function (env, option) {
    console.log(synchronizeSwagger)
    new Promise(() => {
      synchronizeSwagger.init(data)
    }).then((item) => {
      if (item.state === 'success') {
        console.log('生成mock成功！')
      }
    }).catch(err => {
      console.log('生成mock失败！')
      console.log(err)
    })
    })

program.parse(process.argv);
