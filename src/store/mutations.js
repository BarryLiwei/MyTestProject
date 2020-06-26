import { Loading } from 'element-ui';
let brandFlag = 0;
export default {
    // lock 是否需要锁屏, leftSide 左边是否有菜单项，有菜单项则局部加载
    openLoading(state, params = { lock: false, leftSide: false }) {
      state.showLoading = Loading.service({
        lock: params.lock,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(55, 55, 55, 0)',
        customClass: params.leftSide ? 'm-l' : ''
      });
    },
    closeLoading(state) {
      if(state && state.showLoading && state.showLoading.close){
        state.showLoading.close();
      }
    },
    saveRoleInfo(state, value) {
      state.roleInfo = value;
    },
    setTask(state, taskObject) {
      state.taskObject = taskObject;
    },
    setTimer(state, callTimer){
      state.callTimer = callTimer;
    },
    setLoginType(state, value){ // 改变用户的状态
      state.loginType = value;
      localStorage.setItem('loginType', value);
    },
    setToken(state, value){ // 设置token
      state.token = value;
      localStorage.setItem('token', value);
    },
    setBrand(state, value) {
      state.brandObject = Object.assign({}, state.brandObject, value);
    },
    setAgentInfo(state, value){ // 改变坐席信息
      state.agentInfo = value;
      localStorage.setItem('agentInfo', JSON.stringify(value));
    },
    setMenuObj(state, value) { // 存储菜单路径
      state.menuObj = value;
      localStorage.setItem('menuObj', JSON.stringify(value));
    },
    setIsLoad(state, value) { // 判断页面是否刷新
      state.isLoad = value;
    },
    setRoleKey(state, value) { // 角色标识
      state.roleKey = value;
      localStorage.setItem('roleKey', value);
    },
    setBusinessStore(state, value){ // 业务管理缓存
      if(value.type == 'clue'){
        state.business.clue = value;
      }else if(value.type == 'potential'){
        state.business.potential = value;
      }
    }
};
