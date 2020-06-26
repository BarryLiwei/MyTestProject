export default {
    loginType: localStorage.getItem('loginType'), // 登陆的类型：dcc邀约员(invite)，组长(group)，经理(manage) 
    token: localStorage.getItem('token'), // 获取token
    roleInfo: {}, // 当前登录角色信息
    showLoading:{}, // 全屏的loading展示
    taskObject: {}, // 导出任务存储
    callTimer: {}, // 通话时长
    brandObject: {
        list: []
    },
    menuObj: JSON.parse(localStorage.getItem('menuObj')?localStorage.getItem('menuObj'):'{}'), // 存储菜单信息
    agentInfo: JSON.parse(localStorage.getItem('agentInfo')), //坐席信息
    isLoad: true, // 判断页面是否是刷新(全局路由中用到)
    roleKey: localStorage.getItem('roleKey'), // 角色表示，之前没考虑权限按钮的判断，加了loginType，现再增加一个
    business: { // 业务设置线索和潜客的缓存
        clue: {},
        potential:{}
    }
};
