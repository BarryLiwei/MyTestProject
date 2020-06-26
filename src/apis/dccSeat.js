import http from './axios';

// 话务 外呼系统相关接口

//获取坐席信息
export function agentInfo(params, showLoading = true) {
  return http.getAjax('/business/dcc-seat/agent-info', params, {}, false, true, showLoading);
}

// 判断号码类型
export function detectTel(params, showLoading=true) {
  return http.getAjax('/business/call/detect-tel', params, {}, false, true, showLoading);
}

// 设置坐席状态 状态值：1在线，2忙碌，3离线，-1退出
export function callAgentState(params, showLoading=true) {
  return http.postAjax('/business/call/agent-state', params, {}, false, true, showLoading);
}

// 外呼
export function outCall(params) {
  return http.postAjax('/business/call/out-call', params, {}, false, true, false)
}