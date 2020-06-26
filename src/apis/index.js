import * as login from './login'
import * as work from './work'
import * as common from './common'
import * as business from './business'
import * as setting from './setting'
import * as callCenter from './callCenter'
import * as dccSeat from './dccSeat'

let apiObj={
  login,
  work,
  common,
  business,
  setting,
  callCenter,
  dccSeat
};
const install = function (Vue) {
  if (install.installed) {
    return
  }
  install.installed = true;

  Object.defineProperties(Vue.prototype, {
    $fetch: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}