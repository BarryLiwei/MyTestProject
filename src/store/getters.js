export default {
    loginType: state => state.loginType,  // 登陆的角色
    userInfo: state =>  state.userInf,    // 登陆的用户信息
    taskObject: state => state.taskObject, //导出任务存储
    callTimer: state => state.callTimer, //通话时长
    brandObject: state => state.brandObject,  // 品牌数据
    agentInfo: state => state.agentInfo,  // 坐席信息
    menuObj: state => state.menuObj, // 菜单的路径
    roleKey: state => state.roleKey, // 角色标识
};