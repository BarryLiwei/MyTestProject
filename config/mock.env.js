'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"mocking"',
  API: '"https://yapi.test-chexiu.cn/mock/344/"'
  // API: '"http://guangqi.local"',
})
