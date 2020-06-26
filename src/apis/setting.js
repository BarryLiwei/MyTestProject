import http from './axios';

// *** 集团人员 ***
// 用户列表
export function queryAccountList(params, filterParam = true, showLoading = true) { // expand参数值有：（currentRole：用户当前角色，permissions：用户权限，orgs：所属组织，areas：所属4S店，roles：用户所有角色，orgRole：指定组织绑定的角色）
  return http.getAjax('/setting/accounts', params, {}, filterParam, showLoading); 
}
// 获取集团人员列表：{host}/setting/accounts?expand=roles,orgs&keyword=&status=&permissionId=&orgId=
// 获取组织架构-管理人员列表：{host}/setting/accounts?expand=orgRole&keyword=&orgId=
// 获取指定角色下人员列表：{host}/setting/accounts?expand=roles&roleId=

export function accountCreate(params) { // 新增账号
  return http.postAjax('/setting/accounts', params);
}

export function accountUpdate(id,params) { // 更新账号
  return http.updateAjax('/setting/accounts/'+id, params);
}

export function accountDelete(id,params) { // 删除
  return http.deleteAjax('/setting/accounts/'+id, params);
}

export function accountInfo(id,params) { // 查询
  return http.getAjax('/setting/accounts/'+id, params);
}

export function accountEnable(id,params) { // 启用账号
  return http.patchAjax(`/setting/accounts/${id}/enablement`, params);
}

export function accountDisable(id, params) { // 禁用账号
  return http.patchAjax(`/setting/accounts/${id}/disablement`, params);
}


// *** 角色管理 *** 
export function queryRoleList(params, filterParam = true, showLoading = true) { // expand 参数值 （userCount：角色下用户总数，permissions：角色权限）
  return http.getAjax('/setting/roles', params, {}, filterParam, showLoading);
}

export function roleDelete(id, params) { // 删除角色
  return http.deleteAjax('/setting/roles/' + id, params);
}

export function roleInfo(id,params) { // 获取角色详情
  return http.getAjax('/setting/roles/'+id, params);
}

export function yecaiAccounts(params, filterParam=false, showLoading=false) { // 业财用户列表
  return http.getAjax('/setting/yecai/accounts', params, {}, filterParam, showLoading);
}

export function roleCreate(params) { // 新增角色
  return http.postAjax('/setting/roles', params);
}

export function roleUpdate(id,params) { // 更新角色
  return http.updateAjax('/setting/roles/' + id, params);
}

export function rolePermissions(params) { // 获取总权限列表
  return http.getAjax('/setting/roles/permission-tree', params);
}
// 后端的接口数据
// const ROLE_DCC_INVITER = 'dcc_inviter'; //DCC邀约员
// const ROLE_DCC_GROUP_LEADER = 'dcc_group_leader'; //DCC组长
// const ROLE_DCC_SUPERVISOR = 'dcc_supervisor'; //DCC主管

// *** 集团门店 *** 
export function queryAreasList(params, showLoading=true) { // expand参数值（brands：店所属品牌，orgs：店所属组织）
  return http.getAjax('/setting/areas', params, {}, true, showLoading);
}
// 获取集团门店列表：{host}/setting/areas?expand=brands, orgs&name=
// 获取组织下门店列表：{host}/setting/areas?expand=brands&name=&orgId=1

export function queryAreasInfo(id, params, showLoading = true) { // 门店详情  获取门店详情：{host}/setting/areas/{id}?expand=brands,orgs
  return http.getAjax('/setting/areas/'+id, params, {}, true, showLoading);
}


// *** 组织架构 *** 
export function queryOrgList(params, filterParam = true, showLoading = true) { // 获取组织列表
  return http.getAjax('/setting/orgs', params, {}, filterParam, showLoading);
}

export function orgCreate(params) { // 新增组织
  return http.postAjax('/setting/orgs', params);
}

export function orgUpdate(id, params) { // 编辑组织
  return http.updateAjax('/setting/orgs/' + id, params);
}

export function orgDelete(id) { // 删除组织
  return http.deleteAjax('/setting/orgs/' + id, {});
}

export function orgInfo(id) { // 获取组织详情
  return http.getAjax('/setting/orgs/'+id, {});
}

export function queryOrgShopList(id, params) { // 获取管理组织下的门店(新增组织里面用到))
  return http.getAjax('/setting/orgs/' + id + '/unselected-areas', params);
}

// 获取组织下的管理人员 请求集团人员列表接口，加入expand参数
export function adminCreate(orgId, params) { // 新增管理人员 
  return http.postAjax(`/setting/orgs/${orgId}/admins`, params);
}

export function adminUpdate(orgId, adminId, params) { // 更新管理人员  
  return http.updateAjax(`/setting/orgs/${orgId}/admins/${adminId}`, params);
}

export function adminDelete(orgId, adminId) { // 删除管理人员 
  return http.deleteAjax(`/setting/orgs/${orgId}/admins/${adminId}`, {});
}