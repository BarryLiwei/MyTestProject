import http from './axios';


//  * 开口任务
export function openTaskList(params, filterParam = true, showLoading = true) {
  return http.getAjax('/business/open-task/list', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function openTaskListOptions(params, filterParam=false, showLoading=false) { // 列表搜索项
  return http.getAjax('/business/open-task/list-options', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function openTaskInitOptions(params, filterParam=false, showLoading=false) { // 添加/修改 初始化下拉列表数据
  return http.getAjax('/business/open-task/init-form', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function openTaskCreate(params, filterParam = true, showLoading=false) { // 创建
  return http.postAjax('/business/open-task/create', params, {}, filterParam, showLoading);
}


export function openTaskUpdate(params, filterParam = true, showLoading=false) { // 编辑
  return http.postAjax('/business/open-task/update', params, {}, filterParam, showLoading);
}

export function openTaskView(params, filterParam = false, showLoading=false) { // 详情
  return http.getAjax('/business/open-task/view', params, {}, filterParam, showLoading);
}

export function openTaskDelete(params) { // 删除
  return http.postAjax('/business/open-task/delete', params);
}

export function openTaskToggle(params) { // 上下架
  return http.postAjax('/business/open-task/toggle', params);
}

// **** 垂媒管理 *** 
export function mediaAccountList(params, filterParam = true, showLoading = true) {  // 获取列表
  return http.getAjax('/media-account/account/list', params, {}, filterParam, showLoading);
}

export function mediaAccountOptions(params, filterParam = false, showLoading = false) { // 获取筛选项
  return http.getAjax('/media-account/account/options', params, {}, filterParam, showLoading);
}

export function mediaAccountDel(params) { // 删除媒体
  return http.postAjax('/media-account/account/del', params)
}

export function mediaAccountEdit(params) { // 编辑媒体
  return http.postAjax('/media-account/account/edit', params)
}

export function getAccountByArea(params, filterParam = false, showLoading = false) { // 根据门店id获取垂媒账号
  return http.getAjax('/media-account/account/get-account-by-area', params, {}, filterParam, showLoading);
}


// *** 设置参数 ***  
export function dccSettingFollowRule(params, filterParam = true, showLoading = true) { // 获取dcc
  return http.getAjax('/business/dcc-setting/follow-rule', params, {}, filterParam, showLoading);
}

export function dccSettingSaveFollowRule(params) { // 保存dcc
  return http.postAjax('/business/dcc-setting/save-follow-rule', params)
}

export function defeatReason(params, filterParam = true, showLoading = true) { // 获取战败
  return http.getAjax('/business/dcc-setting/defeat-reason', params, {}, filterParam, showLoading);
} 

export function createDefeatReason(params) { // 新增战败   
  return http.postAjax('/business/dcc-setting/create-defeat-reason', params)
}

export function updateDefeatReason(params) { // 战败开关
  return http.postAjax('/business/dcc-setting/update-defeat-reason', params)
}

export function deleteDefeatReason(params) { // 战败原因删除
  return http.postAjax('/business/dcc-setting/delete-defeat-reason', params)
}

export function invalidReason(params, filterParam = true, showLoading = true) { // 无效原因列表
  return http.getAjax('/business/dcc-setting/clue-invalid-reason', params, {}, filterParam, showLoading);
}

export function createInvalidReason(params) { // 新增无效   
  return http.postAjax('/business/dcc-setting/create-clue-invalid-reason', params)
}

export function updateInvalieReason(params) { // 无效原因开关
  return http.postAjax('/business/dcc-setting/update-clue-invalid-reason', params)
}

export function deleteInvalidReason(params) { // 无效原因山西
  return http.postAjax('/business/dcc-setting/delete-clue-invalid-reason', params)
}
 
export function clueFrom(params,filterParam=false, showLoading=false) { // 线索来源  
  return http.getAjax('/business/dcc-setting/clue-from', params, {}, filterParam, showLoading); // 第一个true 为过滤，第二个false为不显示全局loading
}

export function createClueFrom(params) { // 新增线索来源  
  return http.postAjax('/business/dcc-setting/create-clue-from', params)
}

export function updateClueFrom(params) { // 更新线索来源 
  return http.postAjax('/business/dcc-setting/update-clue-from', params)
}

export function toggleClueFrom(params) { // 线索开关
  return http.postAjax('/business/dcc-setting/toggle-clue-from', params)
}

export function deleteClueFrom(params) { // 线索开关
  return http.postAjax('/business/dcc-setting/delete-clue-from', params)
}

export function getClueSettingList(params) { // 获取线索设置
  return http.getAjax('/business/dcc-setting/clue', params);
}

export function saveClueSetting(params) { // 保存线索设置 
  return http.postAjax('/business/dcc-setting/save-clue', params)
}


export function optionalFunction(params) { // 可选功能
  return http.getAjax('/business/dcc-setting/optional-function', params);
}

export function saveOptionalFunction(params) { // 保存可选功能设置 
  return http.postAjax('/business/dcc-setting/save-optional-function', params)
}


// *** 坐席管理 ***
export function seatList(params) { // 获取坐席列表 
  return http.getAjax('/business/dcc-seat/seat-list', params);
}

export function seatListOption(params, filterParam = false, showLoading = false) { // 坐席列表搜索选项 
  return http.getAjax('/business/dcc-seat/seat-list-option', params, {}, filterParam, showLoading);
}

export function initFormSeat(params) {  // 初始化添加坐席数据 
  return http.getAjax('/business/dcc-seat/init-form-seat', params);
}

export function dccSelectList(params, showLoading=false) { // 新增，编辑坐席组(可选dcc邀约员列表)
  return http.getAjax('/business/dcc-seat/dcc-select-list', params, {}, false, showLoading);
}


export function seatDccSelectList(params, showLoading = false) { // 添加坐席 可选用户列表
  return http.getAjax('/business/dcc-seat/seat-dcc-select-list', params, {}, false, showLoading);
}

export function createSeat(params) {  // 新增坐席 
  return http.postAjax('/business/dcc-seat/create-seat', params)
}

export function updateSeat(params) { // 修改坐席 
  return http.postAjax('/business/dcc-seat/update-seat', params)
}

export function checkDccUnbind(params, showLoading=false) { // 检测dcc是否可以移出所在坐席组
  return http.getAjax('/business/dcc-seat/check-dcc-unbind', params, {}, true, showLoading);
}

export function areaSelectList(params, showLoading = true) { // 新增坐席组获取门店列表
  return http.getAjax('/business/dcc-seat/area-select-list', params, {}, true, showLoading);
}

// 检查坐席组是否有线索或者潜客
export function checkDeleteGroup(params) { // 检测坐席是否可以移出所在坐席组
  return http.getAjax('/business/dcc-seat/check-delete-group', params);
}


export function seatGroupList(params) { // 坐席组列表
  return http.getAjax('/business/dcc-seat/group-list', params);
}

export function viewGroup(params) { // 坐席组详情
  return http.getAjax('/business/dcc-seat/view-group', params);
}

export function updateGroupDcc(params) { // 坐席组列表上(添加坐席)
  return http.postAjax('/business/dcc-seat/update-group-dcc', params)
}


export function deleteGroupSeat(params) { // 删除坐席组
  return http.postAjax('/business/dcc-seat/delete-group', params)
}

export function createGroupSeat(params) { // 新增坐席组
  return http.postAjax('/business/dcc-seat/create-group', params)
}

export function updateSeatGroup(params) { // 编辑坐席组
  return http.postAjax('/business/dcc-seat/update-group', params)
}

// *** 通话中心 ***
export function dccCallList(params, filterParam = true, showLoading = true) {
  return http.getAjax('/business/dcc-call/list', params, {}, filterParam, showLoading);
}


// *** 知识库管理 ***
export function competitionList(params) { // 攻防话术列表  
  return http.getAjax('/business/speechcraft/competition-list', params);
}

export function competitionToggle(params) { // 攻防话术开关 
  return http.postAjax('/business/speechcraft/competition-toggle', params)
}

export function competitionDelete(params) { // 攻防话术删除 
  return http.postAjax('/business/speechcraft/competition-delete', params)
}

export function competitionCreate(params) { // 攻防话术新建
  return http.postAjax('/business/speechcraft/competition-create', params)
}

export function competitionUpdate(params) { // 攻防话术编辑
  return http.postAjax('/business/speechcraft/competition-update', params)
}

export function normalCreate(params) { // 常用话术新建
  return http.postAjax('/business/speechcraft/normal-create', params)
}

export function normalUpdate(params) { // 常用话术编辑
  return http.postAjax('/business/speechcraft/normal-update', params)
}

export function normalList(params,filterParam = true, showLoading=false) { // 常用话术 - 列表  
  return http.getAjax('/business/speechcraft/normal-list', params, {},filterParam, showLoading );
}


export function normalToggle(params) { // 常用话术 - 开关 
  return http.postAjax('/business/speechcraft/normal-toggle', params);
}

export function normalDelete(params) { // 常用话术 - 删除 
  return http.postAjax('/business/speechcraft/normal-delete', params);
}


export function activityList(params, filterParam = true, showLoading = true) { // 活动管理 - 列表 
  return http.getAjax('/business/group-activity/list', params, {}, filterParam, showLoading);
}

export function activityView(params) { // 活动管理 - 单个活动详情 
  return http.getAjax('/business/group-activity/view', params);
}

export function activityCreate(params) { // 活动管理 - 新建
  return http.postAjax('/business/group-activity/create', params)
}

export function activityUpdate(params) { // 活动管理 - 更新 
  return http.postAjax('/business/group-activity/update', params);
}

export function activityDelete(params) { // 活动管理 - 删除
  return http.postAjax('/business/group-activity/delete', params);
}





