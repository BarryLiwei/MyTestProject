import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import api from './apis/index'
import { handleResponse,hasArrContent,deepCopyContent,isObj } from './utils/handleResponse'; // 接口返回来的方法
import './filters';  // 全局过滤器

// 样式
import 'element-ui/lib/theme-chalk/index.css';
import './assets/scss/base.scss';
import './assets/scss/element-reset.scss';

Vue.use(Element)
Vue.use(api)

Vue.prototype.$handleResponse = handleResponse;
Vue.prototype.$hasArrContent = hasArrContent;
Vue.prototype.$deepCopyContent = deepCopyContent;
Vue.prototype.$isObj = isObj;
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
window.eventBus = new Vue();

Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'watchStorage') {

      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent');
      const storage = {
          setItem: function (k, val) {
              sessionStorage.setItem(k, val);

              // 初始化创建的事件
              newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

              // 派发对象
              window.dispatchEvent(newStorageEvent)
          }
      }
      return storage.setItem(key, newVal);
  }
}

Vue.config.productionTip = false
import $ from 'jquery'
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
