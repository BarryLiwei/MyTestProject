<template>
    <!-- 头部菜单，固定在头部 -->
    <div class="web-header-componet" id="webHeader">
        <div class="flex por">
            <div class="menu-left">
                <img class="logo" src="../../assets/images/logo.png">
                <span class="company">广汽集团</span>
            </div>
            <!-- el-menu 的router 的缺点跳到有左侧菜单栏的时候，再重定向一次，此时点击浏览器的返回，需要点击两次 -->
            <el-menu mode="horizontal" class="header-menu flex-1" :default-active="activeIndex" @select="handleSelect">
              <el-menu-item v-for="(menu, key) in HeaderMenu" :key="showMenu+key" :index='"/" + menu.url'>
                <div>
                  {{menu.name}}
                </div>
              </el-menu-item>
            </el-menu>
            
            <div class="menu-right poa  flex">
                <div class="notice por" @click="handleMessage">
                   <i class="notice-icon"></i>
                   <span v-if="redPoint" class="red-point poa"></span>
                </div>
                <el-dropdown trigger="click" >
                    <div class="avatar-wrapper pointer">
                        <span class="user-name">{{ nickName | filterBlank }}</span>
                        <span class="user-role">{{ roleName | filterBlank}}</span>
                        <i class="el-icon-arrow-down"></i>
                     </div>
                    <el-dropdown-menu slot="dropdown" class="avatar-dropdown">
                        <div v-for="(item, index) in roleList" :key="'log'+index" @click="handleFn(item)">
                            <el-dropdown-item :class="{'is-active': roleName == item.name}">
                                {{ item.name }}
                            </el-dropdown-item>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

    </div>
</template>

<script>
import { getFirstMenu, getAllMenu, getAllMenuPath } from '@/utils/getUserInfo';
import testMenu from './menu'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            HeaderMenu: [],
            activeIndex: '/work',
            roleInfo: {}, // 角色名称
            currentRole: {}, // 当前角色
            roleList:[],
            showMenu: "menu",  // 切换角色时，需要菜单重新渲染一遍
            isLoadingReload: true,
            redPoint: false,  // 是否有消息红点
            msgTimer: null,
            maxId: '',
            notifications: {}
        }
    },
    created(){
        this.getRoleInfo();
        // 设置坐席状态
        this.intervalQuery();
        
        // 实时获取消息
        this.getMsg();
    },
    mounted(){
        this.updataIndex();
        this.$eventHub.$on("editMySelf", (hasRole)=>{
            if(hasRole){
                this.getCurrentRole(true);
            }else {
                this.$message.error('该角色已被删除,请重新登录');
                this.$router.push('/login');
            }
        })
    },
    watch: {
        $route: function(){
            this.updataIndex(); // 其它地方的跳转链接, 需要触发更新
        }
    },
    computed: {
        ...mapState(["loginType"]),
        nickName(){
            return this.roleInfo && this.roleInfo['nickname'];
        },
        roleName(){ // 显示角色名
            return this.currentRole && this.currentRole['name']
        }
    },
    methods: {
        getRoleInfo(){
            let headerMenu = localStorage.getItem('headerMenu'); // 存储子菜单
            let role = localStorage.getItem('roleInfo'); //  获取角色信息
            if(!headerMenu || !role){ // 菜单或用户信息不存在跳到登陆页
                this.$router.push('/login');
                return;
            }
            this.roleInfo = JSON.parse(role); // 获取用户信息
            this.currentRole = this.roleInfo.currentRole;
            this.roleList = this.roleInfo.list?this.$deepCopyContent(this.roleInfo.list):[];
            this.roleList.push({'id':'logout','name': '退出登录'})
            this.HeaderMenu = JSON.parse(headerMenu);  // 获取头部菜单

            this.$store.commit('saveRoleInfo', this.roleInfo);  // 再存储一遍
            this.$store.commit('setLoginType', this.roleInfo.loginType);   // store存储
            this.$store.commit('setRoleKey', this.roleInfo.currentRole && this.roleInfo.currentRole.role_key);   // store存储


            this.$store.commit('setAgentInfo',JSON.parse(localStorage.getItem('agentInfo')));   // store存储 

            // 刷新的时候重新请求一下权限菜单，防止菜单更改了，只能切换角色或者登陆才替换
            this.getCurrentRole(true);
        },
        updataIndex(){
            this.activeIndex = '/' + getFirstMenu();
        },
        handleSelect(key) { 
            // 不用el-menu 上的router,是由于点击有二级菜单的时候，跳到二级菜单又重定向一回，此时点击浏览器的返回键，需要点击两次，故直接跳到有菜单的页面
            if(this.HeaderMenu && this.HeaderMenu.length) {
                for (let i = 0; i < this.HeaderMenu.length; i++) {
                    if(key == '/'+this.HeaderMenu[i].url) { 
                        if(this.HeaderMenu[i].child && this.HeaderMenu[i].child.length){
                            if(this.HeaderMenu[i].child[0].child && this.HeaderMenu[i].child[0].child.length){
                                // 三级菜单的跳转
                                this.$router.push('/'+this.HeaderMenu[i].child[0].child[0].url);
                                break;
                            }else {
                                // 二级菜单的跳转
                                this.$router.push('/'+ this.HeaderMenu[i].child[0].url);
                                break;
                            }
                        }else {
                            // 一级菜单的跳转
                            this.$router.push('/'+ this.HeaderMenu[i].url);
                            break;
                        }
                    }
                }
            }
        },
        handleMessage() {
            this.$router.push('/work/messageList')
        },
        messageClose() {
            this.dialog.message = false;
        },
        handleFn(item){
            if(item.name == this.currentRole.name){ // 自己点击自己
                return;
            }
            if(item.id == 'logout'){
                this.logout();
                return;
            }
            this.setRole(item); // 设置角色
        },
        logout(){
            this.$confirm('请确认是否退出登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: "needCenterStyle",
              cancelButtonClass: "big cancel",
              confirmButtonClass: "big",
              roundButton: true,
            }).then(() => {
              this.doLogout();
            })                
        },
        doLogout() { // 执行退出操作
            this.$fetch.login.logout().then(res => {
                this.$handleResponse(res, res => {
                   this.$router.push('/login');
                   //销毁所有的外呼信息，登录时重新设置
                //    if(window.localStorage.getItem('c_callSDKTools') == 'RL'){
                //     window.localStorage.removeItem('c_callSDKTools');
                //     window.localStorage.removeItem('c_RLtransferStatus');
                //     window.localStorage.removeItem('c_use_tel');
                //    }
                    window.localStorage.removeItem('c_callSDKTools');
                    window.sessionStorage.removeItem('c_RLtransferStatus');
                    window.localStorage.removeItem('c_use_tel');
                    if(window.localStorage.getItem('c_callSDKTools') == 'cticloud'){
                        window.localStorage.setIremoveItemtem('stateAction')
                    }
                    if(phone){  //退出容联外呼系统
                        phone.destroy()
                        window.sessionStorage.removeItem('c_show_RL');
                        window.eventBus.$emit("destroyRLBus",'');
                    }
                    this.callStatusTimer && clearTimeout(this.callStatusTimer); //清除定时器
                },true);
            }).catch(res => {
                this.$store.commit('closeLoading');
            })
        },
        setRole(roleItem){
            this.$fetch.login.setRole({'roleId': roleItem.id}, true).then(res => {
                this.$handleResponse(res, res=>{
                    this.getCurrentRole();
                    if(phone){  //退出容联外呼系统
                        phone.destroy()
                        window.sessionStorage.removeItem('c_show_RL');
                        window.eventBus.$emit("destroyRLBus",'');
                    }
                    window.sessionStorage.setItem('c_RLtransferStatus', '3')
                }, false);
            }).catch(res => {
                this.$store.commit('closeLoading');
            })
        },
        getCurrentRole(isReload=false){
            this.$fetch.login.currentInfo({}, false).then(res => {
                this.$handleResponse(res, resData=>{
                    let result = getAllMenu(resData.admin.permissions); // 获取菜单和对应的权限
                    let menuObj = getAllMenuPath(result.menu); // 获取菜单的全部路径

                    this.getNewRoleList(resData.admin.roles); // 从这个接口获取最新的角色
                    let roleList = this.$deepCopyContent(this.roleList);
                    let roleInfo = Object.assign({ 'loginType': result.type, 'list': roleList}, resData.admin)

                    localStorage.setItem('roleInfo', JSON.stringify(roleInfo)); // 需要的信息就存
                    localStorage.setItem('headerMenu', JSON.stringify(result.menu));  // 用到

                    this.roleList.push({'id':'logout','name': '退出登录'}); // 放登陆

                    this.$store.commit('saveRoleInfo', roleInfo);         // store存储
                    this.$store.commit('setLoginType', result.type);      // store存储 
                    this.$store.commit('setMenuObj', menuObj);   // store存储
                    this.$store.commit('setRoleKey', resData.admin.currentRole && resData.admin.currentRole.role_key);   // store存储
                    
                    this.roleInfo = roleInfo; // 获取用户信息
                    this.currentRole = resData.admin && resData.admin.currentRole;
                    this.HeaderMenu = result.menu;  // 获取头部菜单

                    this.$eventHub.$emit("headChangeRole", true); // 获取菜单以后执行此广播
                    if(!isReload){ // 切换角色执行，刷新不需要执行
                        this.goToPage(result); // 执行跳转
                    }
                    this.getAgentInfo(result.type, isReload);
                },false);

                if(this.isLoadingReload){ // 如果是刷新页面，让这个loading关闭慢点，让其他页面接口先关闭
                    this.isLoadingReload=false;
                    setTimeout(()=>{
                        this.$store.commit('closeLoading');
                    },3000)
                }else {
                    this.$store.commit('closeLoading');
                }
            }).catch(res => {
                this.$store.commit('closeLoading');
            })
        },
        getNewRoleList(roles){
            this.roleList = this.$hasArrContent(roles)?roles:[]; 
        },
        goToPage(result){
            let path = '/error'
            if(result.menu.length){ // 有菜单，跳到菜单的首页
                path = '/' + result.menu[0].url;
                if(result.menu[0].child && result.menu[0].child.length){
                    path = '/' + result.menu[0].child[0].url;
                    let sub = result.menu[0].child[0];
                    if(sub.child && sub.child.length){
                        path = '/' + sub.child[0].url;
                    }
                }
            }
            this.$router.push(path); // 默认跳到工作台
            this.showMenu = this.showMenu + 'a'; // 菜单需要重新渲染
        },
        callAgentState(){
            let params = {
                state: window.sessionStorage.getItem('c_RLtransferStatus') == "1" ? 1 : window.sessionStorage.getItem('c_RLtransferStatus') == "2" ? 2 : 3
            };
            this.$fetch.dccSeat.callAgentState(params,false).then(res => {
                this.$handleResponse(res, res=>{
                
                },false);
            }).catch(err => {
                this.$store.commit('closeLoading');
            })
            this.intervalQuery();
        },
        // 实时获取
        intervalQuery() {
            this.callStatusTimer && clearTimeout(this.callStatusTimer); //清除上一次的定时器，否则会无限开多个
            this.callStatusTimer = setTimeout(() => {
                if(this.loginType == 'group' || this.loginType == 'invite'){
                    this.callAgentState();
                }else{
                    this.intervalQuery();
                }
                
            }, 10000);//方法中调用定时器实现循环
        },
        // 获取未读消息
        getMsg() {
            let params = {
                max_id: this.maxId
            }
            let _this = this;
            this.$fetch.work.noReadMsg(params).then((res) => {
                this.$handleResponse(res, data => {
                    this.redPoint = false;
                    if (data.list && data.list.length > 0) {
                        let list = data.list;

                        this.maxId = Math.max(list[0].id, list[list.length - 1].id);

                        list.forEach(item => {
                            setTimeout(() => {
                                let notify = this.$notify({
                                    title: item.type_text,
                                    dangerouslyUseHTMLString: true,
                                    duration: 0,
                                    offset: 55,
                                    iconClass: 'icon-msg el-icon-message-solid',
                                    customClass: 'msg-tips',
                                    message: `<div class="message-body">
                                                <div class="content">
                                                    ${item.content}
                                                </div>
                                                <div class="text-right">
                                                    <a href="${item.extend}" target="_blank" class="see-btn">查看</a>
                                                </div>
                                            </div>`,
                                    onClick() {
                                        _this.handleRead(item.id);
                                    }
                                });

                                this.notifications[item.id] = notify;
                            }, 1000);
                            
                        });
                        this.redPoint = true;
                    }
                    this.intervalQueryMsg();
                })
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleRead(id) {
            this.$fetch.work.readMsg({id: id}).then((res) => {
                this.$handleResponse(res, data => {
                    console.log(data);
                }, true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
            this.notifications[id].close();
            delete this.notifications[id];
        },
        // 实时获取消息
        intervalQueryMsg() {
            this.msgTimer && clearTimeout(this.msgTimer);
            this.msgTimer = setTimeout(this.getMsg, 5000);
        },
        getAgentInfo(resultType, isReload){
            // if(resultType == 'group' || resultType == 'invite'){
            //     window.localStorage.setItem('c_LoginStatus',true);    //登录后将LoginStatus设置为true，标志需要在工作台首页询问用户修改登录状态
            // }
            if(!isReload){  //刷新时不执行
                window.sessionStorage.setItem('c_RLtransferStatus','3');    //坐席状态 （ 1 上线， 2 忙碌， 3离线）
                window.localStorage.setItem('c_use_tel',3);    //坐席电话  （1  普通号码， 3软电话/工作号）
            }
            
            //获取坐席信息
            this.$fetch.dccSeat.agentInfo({},true).then(res => {
                this.$handleResponse(res, res=>{
                    localStorage.setItem('agentInfo', JSON.stringify(JSON.stringify(res))); // 需要的信息就存
                    this.$store.commit('setAgentInfo',res);   // store存储 
                    // window.localStorage.setItem('LoginStatus',true)
                    // 选用第三方外呼sdk 通过接口判断， c_开头的均为外呼所用字段
                    if(res.thirdSeat && res.thirdSeat.platformType == '1'){ //平台类型：1容联，2百应，3天润
                        window.localStorage.setItem('c_callSDKTools','RL'); //设置第三方外呼sdk （RL 容联，cticloud 天润 ）
                    }
                    else if(res.thirdSeat && res.thirdSeat.platformType == '3'){ //平台类型：1容联，2百应，3天润
                        window.localStorage.setItem('c_callSDKTools','cticloud'); //设置第三方外呼sdk （RL 容联，cticloud 天润 ）
                    }
                },true);
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$store.commit('closeLoading');
            })
        }
    },
    beforeDestroy() {
        clearTimeout(this.callStatusTimer);
        clearTimeout(this.msgTimer);
    },
}
</script>

<style lang="scss" scoped>
.web-header-componet {
    background: #212427;
    height: 70px;
    line-height: 68px;
    width: 100%;
    position:fixed;
    top:0;
    left:0;
    right: 0;
    z-index: 999;
    min-width: 1100px;
    .menu-left {
        min-width: 80px;
        color: #fff;
        padding: 0 30px;
        font-size: 20px;
        .logo {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 5px;
        }
        .company {
            font-size: 16px;
        }
    }
    .menu-right {
        top: 0;
        right: 30px;
        color: #fff;
        .notice {
            padding: 0 20px;
            cursor: pointer;
        }
        .notice-icon {
            width: 16px;
            height: 16px;
            background: url('../../assets/images/icons/menu/notice.png');
            display: inline-block;
            vertical-align: middle;
            -webkit-font-smoothing: antialiased;
        }
        .red-point {
            position: absolute;
            top: 24px;
            right: 16px;
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #f06060;
        }
        .avatar-wrapper {
            outline: none;
            font-size: 15px;
            color: #fff;
        }
        .user-name {
            margin: 0 5px 0 13px;
        }
        .user-role {
            font-size: 14px;
        }
        .el-icon-arrow-down {
            color: #FFF;
        }
    }
}
.header-menu.el-menu{
    height: 100%;
    background: #212427;
    color: #7c838c;
    .el-menu-item {
        background-color:#212427!important;
        font-size: 16px;
        height: 70px;
        line-height: 68px;
        &:hover {
            color: #FFF;
            background-color: inherit!important;
        }
    }
    .is-active{
        color: #fff!important;
        background-color:#212427;
        border-bottom: 6px solid #3d7eff;
    }
}
.avatar-dropdown {
    top: 65px!important;
}
.el-menu-item:not(.is-disabled):focus {
    color: #909399;
}

.el-dropdown-menu .is-active {
    color: #3d7eff;
}

@media screen and (max-width: 1400px){
    .header-menu .el-menu-item {
        padding: 0 13px;
    }
}

@media screen and (max-width: 1300px){
    .header-menu .el-menu-item {
        padding: 0 12px;
    }
}
@media screen and (max-width: 1200px){
    .header-menu .el-menu-item {
        padding: 0 10px;
    }
}

</style>