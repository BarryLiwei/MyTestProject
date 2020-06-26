import http from './axios';

// 登录接口
export function login(params, showLoading = true) {
  return http.postAjax('/site/login', params, {}, false, true, showLoading);
}

export function setRole(params, showLoading=true) {
  return http.postAjax('/site/set-role', params, {}, false, true, showLoading);
}

export function currentInfo(params, showLoading=true) {
  return http.getAjax('/site/current-info', params, {}, true, showLoading);
}

// 获取登录用户当前信息(切换角色的时候调用)
// export function adminInof(params, filterParam = true, showLoading = true) {
//   return http.getAjax('/site/admin-info', params, {}, filterParam, showLoading);
// }

export function logout(params,showLoading=true) {
  return http.postAjax('/site/logout', params, {}, true, showLoading);
}


export function acciToken(params) {
  return http.postAjax('https://open-internal.byai.com/oauth/token', params);
}
export function acci(params) {
  return http.getAjax('https://open.byai.com/api/oauth/byai.openapi.callinstance.detail/1.0.0/get', params);
}