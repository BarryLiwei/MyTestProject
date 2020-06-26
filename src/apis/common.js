import http from './axios';

// 线索管理--导出日志弹窗上的列表（查询日志的列表）
export function exportLog(params) {
  return http.getAjax('/common/export-log', params, {},true, false); // 第一个true 为过滤，第二个false为不显示全局loading
}

// 导出日志弹窗列表的导出(导出表格) // 导出get请求
export function exporExcelBlob(params) {
  return http.getAjax('/common/export/download-log', params, { responseType: "blob"}, true, false);
}

export function exporExcelBuffer(params) {
  return http.getAjax('/common/export/download-log', params, { responseType:"arraybuffer"}, true, false);
}

//  导出post请求  /common/export/download
export function exportPostBuffer(params) {
  return http.postAjax('/common/export/download', params, { responseType: "arraybuffer"}, false, true, false)
}

// 开始
// 导出任务 
export function newtask(params) {
  return http.postAjax('/common/group-export/new-task', params, {}, false, true, false);
}
// 导出任务进度条
export function progress(params) {
  return http.postAjax('/common/group-export/progress', params, {}, false, true, false);
}
// 导出任务	执行
export function handle(params) {
  return http.postAjax('/common/group-export/handle', params, {}, false, true, false);
}
// 结束

// 门店经营品牌(所有品牌)	
export function carBrandAll(params, showLoading = false) {
  return http.getAjax('/business/car/brand-all', params, {}, true, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

// 门店经营品牌 传参数  areaId (门店id)	
export function carBrand(params, showLoading=false) {
  return http.getAjax('/business/car/brand', params, {}, true, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

// 车系列表	 传参数  brandId (品牌id)
export function carSeries(params, showLoading = false) {
  return http.getAjax('/business/car/series', params, {}, true, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

// 车型列表	 传参数  seriesId (车系id)
export function carModel(params, showLoading = false) {
  return http.getAjax('/business/car/model', params, {}, true, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

// 全部行政区划列表树  省，区 
export function commonRegion(params, showLoading = false) {
  return http.getAjax('/business/common/region', params, {}, true, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

// 获取搜索项下拉门店列表
export function commonAreaList(params, showLoading = false) {
  return http.getAjax('/business/common/area-list', params, {}, true, showLoading);
}

// DCC/组列表
export function commonDccList(params, showLoading = false) {
  return http.getAjax('/business/common/dcc-list', params, {}, true, showLoading);
}

// 线索状态
export function commonClueStatusList(params, showLoading=false) {
  return http.getAjax('/business/common/clue-status-list', params, {}, true, showLoading);
}

// 线索类型
export function commonClueTypeList(params, showLoading = false) {
  return http.getAjax('/business/common/clue-type-list', params, {}, true, showLoading);
}

// 意向等级
export function commonClueLevelList(params, showLoading = false) {
  return http.getAjax('/business/common/clue-level-list', params, {}, true, showLoading);
}

// 线索评分
export function commonClueGradeList(params, showLoading = false) {
  return http.getAjax('/business/common/clue-grade-list', params, {}, true, showLoading);
}

// 到店类型
export function commonArrivalList(params, showLoading = false) {
  return http.getAjax('/business/common/invite-arrival-list', params, {}, true, showLoading);
}

// 战败状态
export function commonDefeatStatusList(params, showLoading = false) {
  return http.getAjax('/business/common/defeat-status-list', params, {}, true, showLoading);
}

// // 战败类型
// export function commonDefeatReasonList(params, showLoading = false) {
//   return http.getAjax('/business/common/defeat-reason-list', params, {}, true, showLoading);
// }

// 保险/贷款选项
export function commonStatusList(params, showLoading = false) {
  return http.getAjax('/business/common/common-status-list', params, {}, true, showLoading);
}

// 客户来源
export function commonFromList(params, showLoading = false) {
  return http.getAjax('/business/common/from-list', params, {}, true, showLoading);
}

// 线索无效原因
export function clueInvalidReasonList(params, showLoading = false) {
  return http.getAjax('/business/common/clue-invalid-reason-list', params, {}, true, showLoading);
}

// 获取线索的稍后最大可稍后跟进时间
export function laterFollowMaxTime(params, showLoading = false) {
  return http.getAjax('/business/common/later-follow-max-time', params, {}, true, showLoading);
}

// 跟进点评列表
export function followReviewList(params, showLoading = true) {
  return http.getAjax('/business/follow/follow-review-list', params, {}, true, showLoading);
}

// 战败类型
export function defeatReasonTypeList(params, showLoading = false) {
  return http.getAjax('/business/common/defeat-reason-type-list', params, {}, true, showLoading);
}

// 战败原因
export function defeatReasonList(params, showLoading = false) {
  return http.getAjax('/business/common/defeat-reason-list', params, {}, true, showLoading);
}

// 潜客跟进状态
export function ArchiveStatusList(params, showLoading = false) {
  return http.getAjax('/business/common/archive-status-list', params, {}, true, showLoading);
}


/**
 * 线索or潜客跟进记录
 * @param {*} params typeId: 类型：1潜客，2线索, id:潜客ID 或者 线索ID
 * @param {*} showLoading 是否显示加载层
 */
export function followListByType(params, showLoading = true) {
  return http.getAjax('/business/follow/follow-list', params, {}, true, showLoading);
}
// const FOLLOW_ACTION_NORMAL = 1; //普通跟进
// const FOLLOW_ACTION_CREATE_ARCHVIE = 2; //建档
// const FOLLOW_ACTION_INVITE = 3; //邀约
// const FOLLOW_ACTION_ARCHIVE_RECOVERY = 4; //档案回收
// const FOLLOW_ACTION_DEFEAT = 5; //战败
// const FOLLOW_ACTION_SHARE = 6; //潜客共享
// const FOLLOW_ACTION_LEVEL_DOWN = 7; //降级
// const FOLLOW_ACTION_LEVEL_DOWN_INTERVENE = 8; //降级干预
// const FOLLOW_ACTION_ADD_INTETION = 9; //手动新增意向
// const FOLLOW_ACTION_DEFEAT_PASS = 10; //战败通过
// const FOLLOW_ACTION_DEFEAT_REJECT = 11; //战败审核不通过
// const FOLLOW_ACTION_DISTRIBUTION = 21; //线索下发
// const FOLLOW_ACTION_DEFER = 22; //稍后联系
// const FOLLOW_ACTION_INVALID = 23; //无效
// const FOLLOW_ACTION_CLUE_TRANS = 24; //线索转移[共享]
// const FOLLOW_ACTION_INVALID_PASS = 25; //线索审核通过
// const FOLLOW_ACTION_INVALID_REJECT = 26; //线索无效不通过
// const FOLLOW_ACTION_ADD_CLUE = 27; //手动新增线索
// const FOLLOW_ACTION_ORDER = 28; //下订


// 门店档案状态
export function AreaArchiveStatusList(params, showLoading = false) {
  return http.getAjax('/business/common/area-archive-status-list', params, {}, true, showLoading);
}

// 坐席状态
export function agentState() {
  return http.getAjax('/business/common/agent-state-list', {}, {}, true, false)
}

// 通话状态
export function callState() {
  return http.getAjax('/business/common/call-state-list', {}, {}, true, false)
}
