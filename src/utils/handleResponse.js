
import store from '../store/index'
import { Notification } from 'element-ui';
// 接口返回来处理的方法
export function handleResponse(res, callback, closeLoaing=false, isHandleError = false){
  let {code, msg, data} = res.data ? res.data : {};
  if (code !== 200){
    Notification.error({
      title: '错误提示',
      message: msg
    })
    store.commit('closeLoading'); 
    if(typeof callback === 'function' && isHandleError){
      callback([]);
    }
  }else {
    if(typeof callback === 'function'){
      callback(data);
    }
    if(closeLoaing){ 
      store.commit('closeLoading');
    }
  }
}

// 判断数组有内容，有长度
export function hasArrContent(content){
  return content && content.length? true: false
}

export function deepCopyContent(content){
  return JSON.parse(JSON.stringify(content))
}

export function isObj(o) { //是否对象
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
}