#!/usr/bin/env node
'use strict'
const program = require('commander');
const { join } = require('path')

const path = process.cwd()
const config = join(path, 'swagger.config.js')
const data = require(config)

program
  .action(function (env, option) {
    require('../command/synchronizeSwagger.js')(data)
  })

program.parse(process.argv);
