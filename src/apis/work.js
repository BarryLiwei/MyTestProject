import http from './axios';

// 新增线索
export function addClue(params) {
  return http.postAjax('/business/clue/create', params);
}

// 线索跟进 - 线索详情接口
export function getFollowClue(params) {
  return http.getAjax('/business/follow/clue', params);
}

// 潜客跟进 - 潜客详情
export function getFollowArchive(params) {
  return http.getAjax('/business/follow/dcc-archive', params);
}

// 潜客跟进 - 获取页面初始数据
export function getFollowForm(params) {
  return http.getAjax('/business/follow/form', params);
}

//潜客跟进 - 获取跟进记录
export function getFollowList(params) {
  return http.getAjax('business/follow/list', params);
}

//潜客跟进 - 获取知识库内容 - 车型信息
export function getKBModelParams(params) {
  return http.getAjax('/business/knowledge-base/model-params', params);
}

//潜客跟进 - 获取知识库内容 - 话术
export function getKBSpeechcraft(params) {
  return http.getAjax('/business/knowledge-base/speechcraft', params);
}

//潜客跟进 - 获取知识库内容 - 当前活动
export function getKBGroupActivity(params) {
  return http.getAjax('/business/knowledge-base/group-activity', params);
}

//潜客跟进 - 知识库添加(修改)车型
export function setBKeditModel(params) {
  return http.postAjax('/business/knowledge-base/edit-model', params);
}

//潜客跟进 - 知识库获取自加车型
export function getKBModel(params) {
  return http.getAjax('/business/knowledge-base/model', params);
}

//潜客跟进 - 知识库删除自加车型
export function deleteKBModel(params) {
  return http.postAjax('/business/knowledge-base/delete-model', params);
}

//工作台 - 新建档案（同线索保存跟进）
export function clueAdd2(params) {
  return http.postAjax('/business/follow/clue-add', params);
}

//潜客跟进 - 完成开口任务
export function openTaskComplete(params) {
  return http.postAjax('/business/open-task/complete', params);
}

//潜客跟进 - 获取默认下次跟进时间
export function nextFollowDate(params) {
  return http.getAjax('/business/follow/next-follow-date', params);
}

// 潜客跟进 - 修改档案
export function editProfile(params) {
  return http.postAjax('/business/intention/edit-profile', params);
}

// 潜客跟进 - 新增门店车型
export function addIntentionInfo(params) {
  return http.postAjax('/business/intention/add-intention-info', params);
}

// 潜客跟进 - 保存跟进
export function followIntentionAdd(params) {
  return http.postAjax('/business/follow/intention-add', params);
}

// 待处理线索--申请无效--DCC邀约员
export function invalidApply(params) {
  return http.postAjax('/business/invalid/invalid-apply', params);
}

// 待处理线索--申请转移--DCC邀约员
export function clueTransfer(params) {
  return http.postAjax('/business/clue/transfer', params);
}

// 待处理线索--稍后联系--DCC邀约员
export function clueLater(params) {
  return http.postAjax('/business/clue/later', params);
}

// 省市区接口
export function getRegin(params) {
  return http.getAjax('/business/common/region', params);
}

// 工作台-统计数据-待办事项
export function getStatTodo() {
    return http.getAjax('/business/statistics/todo', {}, {}, true, false)
}

// 工作台-统计数据-跟进数据
export function getStatFollow(params) {
    return http.getAjax('/business/statistics/follow', params, {}, true, false)
}

// 工作台-统计数据-通话数据
export function getStatCall(params) {
    return http.getAjax('/business/statistics/call', params, {}, true, false)
}

// 工作台-待处理线索-DCC邀约员
export function getCluePending(params, showLoading = false) {
    return http.getAjax('/business/clue/pending', params, {}, true, showLoading)
}

// 工作台-潜客跟进--状态及其数量统计--DCC邀请员
export function getIntentionStat() {
    return http.getAjax('/business/archive/follow-statistics', {}, {}, false, false)
}

// 工作台-潜客跟进--DCC邀约员
export function getIntentionList(params, showLoading = false) {
    return http.getAjax('/business/archive/follow-list', params, {}, true, showLoading)
}

// 工作台-今日预计到店--DCC邀请员
export function getTodayList(params, showLoading = false) {
    return http.getAjax('/business/invite/today-list', params, {}, true, showLoading)
}

// 工作台-今日预计到店统计--DCC邀请员
export function getInviteStat() {
  return http.getAjax('/business/invite/today-statistics', {}, {}, false, false)
}

// 待办事项【组长等以上权限】列表tab切换统计
export function getReviewTodoStat() {
  return http.getAjax('/business/statistics/review-todo', {}, {}, false, false)
}

// 工作台-待办事项--战败审核--DCC组长
export function getDefeatList(params, showLoading = true) {
    return http.getAjax('/business/defeat/review-list', params, {}, true, showLoading)
}

// 工作台-待办事项--战败审核--拒绝战败--DCC组长
export function defeatRefuse(params) {
    return http.postAjax('/business/defeat/defeat-refuse', params)
}

// 工作台-待办事项--战败审核--同意战败--DCC组长
export function defeatAgree(params) {
    return http.postAjax('/business/defeat/defeat-agree', params)
}

// 工作台-待办事项--战败审核【批量操作】--DCC组长
export function defeatBatch(params) {
    return http.postAjax('/business/defeat/defeat-batch', params)
}

// 工作台-待办事项--无效审核--DCC组长
export function clueInvalidList(params, showLoading = true) {
    return http.getAjax('/business/invalid/review-list', params, {}, true, showLoading)
}

// 工作台-待办事项--无效审核--同意无效--DCC组长
export function clueInvalidAgree(params) {
    return http.postAjax('/business/invalid/invalid-agree', params)
}

// 工作台-待办事项--无效审核--拒绝无效--DCC组长
export function clueInvalidRefuse(params) {
    return http.postAjax('/business/invalid/invalid-refuse', params)
}

// 工作台-待办事项--无效审核【批量操作】--DCC组长
export function clueInvalidBatch(params) {
    return http.postAjax('/business/invalid/invalid-batch', params)
}

// 工作台-待办事项--降级监控--DCC组长
export function levelDownList(params, showLoading = true) {
    return http.getAjax('/business/level-down/list', params, {}, true, showLoading)
}

// 工作台-待办事项--降级监控--干预变更--DCC组长
export function changeLevel(params) {
    return http.postAjax('/business/level-down/change-level', params)
}

// 工作台-待办事项--跟进点评
export function followReviewList(params, showLoading = true) {
    return http.getAjax('/business/follow/follow-review-list', params, {}, true, showLoading)
}

// DCC主管-员工监控
export function groupMonitorList(params) {
    return http.getAjax('/business/agent-monitor/agent-group-list', params)
}

// DCC组长-员工监控
export function monitorEmployeesList(params) {
  return http.getAjax('/business/agent-monitor/agent-list', params, {}, true, false)
}

// 员工监控数量统计
export function getMonitorStat(params) {
  return http.getAjax('/business/agent-monitor/agent-statistics', params)
}

// 待办事项--战败审核--战败详情
export function defeatDetail(params) {
  return http.getAjax('/business/defeat/defeat-detail', params)
}

// 待办事项--无效审核--无效详情
export function invaildDetail(params) {
  return http.getAjax('/business/invalid/invalid-detail', params)
}

// 待办事项--降级监控详情
export function levelDownDetail(params) {
  return http.getAjax('/business/level-down/detail', params)
}

// 待办事项--跟进点评-线索详情
export function followClueDetail(params) {
  return http.getAjax('/business/clue/detail', params)
}

// 待办事项--跟进点评-潜客详情
export function followArchiveDetail(params) {
  return http.getAjax('/business/archive/detail', params)
}

/**
 * 获取当前用户10条未读信息
 * max_id: 标记id, 列表数组第一条与最后一条比较取最大
 *  */ 
export function noReadMsg(params) {
  return http.postAjax('/message/index/no-read-msg', params, {}, false, true, false)
}

/**
 * 将消息标为已读状态
 * id: 消息id
 */
export function readMsg(params) {
  return http.postAjax('/message/index/read', params)
}

/**
 * 获取所有消息
 * per_page: 页面容量
 * page: 页码
 */
export function messageList(params) {
  return http.getAjax('/message/index/list', params, {}, true, true)
}