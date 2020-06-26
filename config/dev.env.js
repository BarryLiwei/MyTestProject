'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"',
  API: '"https://ccapi-zd.dev-chexiu.cn/"',
})
