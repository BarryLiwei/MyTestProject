'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"demo"',
  API: '"https://ccapi-zd.demo-chexiu.cn/"',
})
