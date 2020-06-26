import http from './axios';

// *** 线索管理 ***
// 获取线索列表
export function queryClueList(params, filterParam = true, showLoading = true) {
  return http.getAjax('/business/clue/list', params,{}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function exportClueExcel(params) { // 导出线索日志
  return http.getAjax('/business/clue/export', params,{}, true, false);
}

export function exportClueLog(params) { // 导出线索日志列表
  return http.getAjax('/business/clue/export-log', params, {responseType:"arraybuffer"}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function clueDetail(params,filterParam = true, showLoading = true) {  // 线索详情
  return http.getAjax('/business/clue/detail', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function assignDCCList(params, filterParam = true, showLoading = true) { // 线索分配&激活获取DCC组&DCC
  return http.getAjax('/business/clue/assign-dcc-list', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function clueAssign(params, filterParam = false, showLoading = false) { // 线索分配
  return http.postAjax('/business/clue/assign', params, {},false, filterParam, showLoading);
}

export function InvalidActive(params, filterParam = false, showLoading = false) { // 线索激活
  return http.postAjax('/business/invalid/invalid-active', params, {}, filterParam, showLoading);
}

// *** 潜客管理 ***
// 获取潜客列表
export function queryPotentialList(params, filterParam = true, showLoading = true) {
  return http.getAjax('/business/archive/list', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}
// 导出潜客日志
export function exportPotentialExcel(params) {
  return http.getAjax('/business/intension/export', params, {responseType:"arraybuffer"}, true, false);
}
// 导出潜客日志列表
export function exportPotentialLog(params) {
  return http.getAjax('/business/intension/export-log', params, {}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function archiveAssignDCCList(params, filterParam = true, showLoading = true) { // 潜客分配&激活获取DCC组&DCC
  return http.getAjax('/business/archive/assign-dcc-list', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function ArchiveAssign(params, filterParam = false, showLoading = false) { // 潜客分配
  return http.postAjax('/business/archive/assign', params, {}, false, filterParam, showLoading);
}

export function defeatActive(params, filterParam = false, showLoading = false) { // 潜客激活
  return http.postAjax('/business/defeat/defeat-active', params, {},false, filterParam, showLoading);
}


// 潜客详情--dcc详情口
export function archiveDccDetail(params) {
  return http.getAjax('/business/archive/detail', params);
}
// 潜客详情--门店详情
export function archiveAreaDetail(params) {
  return http.getAjax('/business/archive/area', params);
}
// 跟进记录 - 跟进点评
export function followComment(params, showLoading=true) { 
  return http.postAjax('/business/follow/comment', params,{}, false, true, showLoading);
}

// *** 邀约管理 ***
export function queryInvitelList(params, filterParam = true, showLoading = true) { // 获取邀约列表
  return http.getAjax('/business/invite/list', params,{}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function exportInviteExcel(params) { // 导出邀约日志 
  return http.getAjax('/business/invite/export', params, {responseType:"arraybuffer"}, true, false);
}

export function exportInviteLog(params) { // 导出邀约日志列表
  return http.getAjax('/business/invite/export-log', params,{}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function inviteAdvisorList(params) {  // 邀约管理销售顾问接口
  return http.getAjax('/business/invite/advisor-list', params, {}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}


// *** 订单管理
export function queryOrderlList(params, filterParam = true, showLoading = true) {  
  return http.getAjax('/business/order/list', params, {}, filterParam, showLoading);
}

export function exportOrderExcel(params) { // 导出邀约日志 
  return http.getAjax('/business/order/export', params, { responseType: "arraybuffer"}, true, false);
}

export function exportOrderLog(params) { // 导出邀约日志列表
  return http.getAjax('/business/order/export-log', params, {}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function orderDetail(params, filterParam = true, showLoading = true) { // 导出邀约日志列表
  return http.getAjax('/business/order/detail', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function orderAdvisorList(params) { // 订单管理销售顾问接口
  return http.getAjax('/business/order/advisor-list', params, {}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}


// ***战败管理***
export function queryDefeatlList(params, filterParam = true, showLoading = true) {  
  return http.getAjax('/business/defeat/list', params, {}, filterParam, showLoading);
}

export function exportDefeatExcel(params) { // 导出邀约日志 
  return http.getAjax('/business/intension/defeat-export', params, { responseType: "arraybuffer"}, true, false);
}

export function exportDefeatLog(params) { // 导出邀约日志列表
  return http.getAjax('/business/intension/defeat-export-log', params, {}, true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}