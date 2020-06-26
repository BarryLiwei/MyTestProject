import Vue from 'vue';
import Router from 'vue-router';
import common from './common'
import work from './work'
import business from './business'
import call from './call'
import setting from './setting'
import error from './error'
import { Message,Notification } from 'element-ui';
import store from "../store";
Vue.use(Router);

const router = new Router({
    // mode: 'history',
    routes: [...common, ...work, ...business, ...call, ...setting, ...error], // 注意error路由必须放到最后面
})



function goToPage(){
    let menuString = localStorage.getItem('headerMenu')
    let headerMenu = JSON.parse(menuString ? menuString : '[]');
    let path = '/login';
    if (headerMenu.length) { // 有菜单，跳到菜单的首页
      path = '/' + headerMenu[0].url;
      if (headerMenu[0].child && headerMenu[0].child.length) {
        path = '/' + headerMenu[0].child[0].url;
        let sub = headerMenu[0].child[0];
        if (sub.child && sub.child.length) {
          path = '/' + sub.child[0].url;
        }
      }
    }
    router.push(path); // 默认跳到登陆页
}

function toGoFun(next){
    next();
    // 页面切换成功，页面会滚到顶部
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function checkAuth(to, from, next) {
    let menuObj = store.state.menuObj || JSON.parse(localStorage.getItem('menuObj')?localStorage.getItem('menuObj'):'{}');

    if(to.path=='/' || to.path=='/login' || to.path=='/error' || menuObj[to.path] || menuObj[to.meta.authPath] || to.path=='/_empty'){
        // menuObj[to.path] 判断存在的三级菜单以内   
        // menuObj[to.meta.authPath] 三级以外的菜单匹配是否有这个权限
        // 根目录,  登陆，错误页，这些不在菜单内,所以要判断一下
        store.commit('setIsLoad', false);
        if(to.path=='/'){ 
            // 跳到首个菜单去,不在路由那里重定向到login
            goToPage();
            return;
        }else {
            toGoFun(next);
        }
    }else if(Object.keys(menuObj).length == 0){
        router.push('/login'); // menuObj没有菜单的时候跳到登陆页
    }else{
        if(store.state.isLoad){
            store.commit('setIsLoad', false); // 刷新的时候，没有对应的菜单都可以进去页面，并且出对应的提示
            toGoFun(next);
            // if(window.history.length <= 1) { // 从工作台跳到潜客详情，测试说可以让跳过去，若不可跳过去就展开注释的地方
            //   goToPage();
            // } else {
            //   router.go(-1);
            // }
        }
        Notification.warning({
          title: '操作提示',
          message: '无此功能权限(无此菜单)'
        })
    }
}

function setKeepAlive(to, from, next) { // 设置页面缓存
    // 由于页面keep-alive 不起所用，业务管理先用vuex缓存
    
    // 清空业务管理--线索列表的缓存
    if((to.path !== '/business/clue' && to.path != '/business/clue/detail' && store.state.business.clue.search )){
        store.commit('setBusinessStore', { type: 'clue'})
    }
    // 清空业务管理--潜客列表的缓存
    if((to.path !== '/business/potential' && to.path != '/business/potential/detail' && store.state.business.potential.search )){
        store.commit('setBusinessStore', { type: 'potential'})
    }
}

router.beforeEach((to, from, next) => {
    if((from.path == '/work/cluesDeal' || from.path == '/work/customerFollow') && (window.localStorage.getItem('objectDeclareFunc') == 'EvtConnected' || window.localStorage.getItem('stateActionRL') == 'EvtConnected')){
        Message({
            message: '当前正在通话，请不要离开',
            type: 'warning',
            showClose: true
        });
        return;
    }else{
    }

    // 设置页面缓存
    setKeepAlive(to, from, next);

    // 全局判断是否有权限跳转
    checkAuth(to, from, next);
})


export default router;