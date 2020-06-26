<template>
    <div class="web_login_gq">
        <!-- <div class="login-wrap por">
            <img class="login-title poa" src="../../assets/images/login/login-title.png" alt="登陆标题">

            <el-form :model="loginData" @keyup.enter.native='submitForm("loginForm")' :rules="rules" ref="loginForm" class="login-form">
                <el-form-item prop="account">
                  <el-input type="text" class="form-input" v-model.trim="loginData.account" placeholder="手机号/用户邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" class="form-input" v-model.trim="loginData.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="remenber">
                    <input type="checkbox" v-model="rememberme">记住用户名
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="form-btn" @click='submitForm("loginForm")' :loading="loading">登录</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="login-container" id="loginPage">
            <div class="logo">
                <a class="alike">
                    <img src="../../assets/images/login/gq-logo.png">
                </a>
            </div>
            <div class="login-panel-content">
                <div class="login-panel-left">
                    <img class="left-photo" src="../../assets/images/login/gq-bg.png">
                </div>
                <div class="por" :class="['login-panel',{'login-panel-lg':false}]">
                    <h2 class="text-center text-center—title">欢迎登录</h2>
                    <img class="banner-photo" src="../../assets/images/login/ji-banner.png">
                    <el-form
                        :model="loginData"
                        @keyup.enter.native='submitForm("loginForm")' 
                        :rules="rules"
                        ref="loginForm"
                        class="login-form">
                        <el-form-item prop="account">
                            <el-input
                                type="text"
                                v-model.trim="loginData.account"
                                placeholder="账号"
                                class="el-input-border"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model.trim="loginData.password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item class="remenber">
                            <input type="checkbox" v-model="rememberme">记住用户名
                        </el-form-item>
                        <el-form-item class="no-bottom">
                            <el-button
                                class="form-btn"
                                type="primary"
                                @click='submitForm("loginForm")'
                                :loading="loading"
                                :disabled="loading">
                                登录<i v-if="loading">中</i>
                           </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
         </div>

        <el-dialog
            :title="title"
            class="login-role-select"
            :visible.sync="roleDialog.show"
            :close-on-click-modal="false"
            width="420px"
            center>
            <div v-loading="loading">
                <el-radio-group v-model="roleDialog.radio">
                    <el-radio :label="index" v-for="(item, index) in roleDialog.role" :key="'role'+index">{{ item.name }}</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" class="w-100" :disabled="loading" @click="saveRole" round>确定</el-button>
                <el-button round size="medium" class="w-90" @click="cancelFn">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getAllMenu, getAllMenuPath } from '@/utils/getUserInfo';
export default {
    data(){
        return {
            loginData:{
                account:'',
                password:''
            },
            rules:{
               account: [{required: true, message: '手机号/用户邮箱', trigger: ['blur', 'change']}],
               password: [{required: true, message: '请输入密码', trigger: ['blur', 'change']}],
            },
            loading: false,
            roleDialog: { // 如果有多个角色，先选角色
                show: false,
                nickname: '',
                role: [],
                radio: '',
            },
            rememberme: false,
        }
    },
    created(){
        this.clearStorage();
        this.initData()
    },
    computed:{
        title(){
            return `${this.roleDialog.nickname}您好，请选择您的登入角色`
        }
    },
    methods: {
        clearStorage(){ // 退出登陆清缓存
            localStorage.removeItem('token');
            localStorage.removeItem('roleInfo');
            // localStorage.removeItem('headerMenu');
        },
        initData(){
            if(localStorage.getItem("rememberme")){
                this.rememberme = true;
                this.loginData.account = localStorage.getItem("rememberme");
            }
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.loginFn();
                }
            });
        },
        loginFn(){
            // 登陆流程：登录 ->设置角色->获取用户当前信息
            // 由于后端需要存储当前角色，所以要调设置角色的接口
            this.loading = true
            const { account, password } = this.loginData;
            this.$fetch.login.login({account,password}).then(res => {
                this.$handleResponse(res, res=>{
                    const { nickname,roles,account} = res.admin
                    this.$store.commit('setToken', res.token);
                    this.roleDialog.nickname = nickname;
                    this.getRoleList(roles); // 获取有多少个角色
                    this.checkRemenberMe(account);
                }, false);
                this.loading = false;
            }).catch(res => {
                this.loading = false;
                this.$store.commit('closeLoading');
            })
        },
        checkRemenberMe(name){
            if(this.rememberme){
                localStorage.setItem('rememberme', name)
            }else {
                localStorage.removeItem('rememberme')
            }
        },
        getRoleList(roles){
            this.roleList = this.$hasArrContent(roles)? roles:[];

            if(this.roleList.length == 0){
                this.$message.error('抱歉，当前账号暂没绑定角色，请联系管理员');
                this.$store.commit('closeLoading');
            }else if(this.roleList.length == 1){
                if(this.roleList[0].role_key == 'administrator'){ // 超级管理员不需要设置set-role
                    this.getCurrentRole(this.roleList[0]);
                }else {
                    this.setRole(this.roleList[0]);
                }
            }else {
                this.roleDialog.role = this.roleList;
                this.roleDialog.radio = 0;
                this.roleDialog.show = true;
                this.$store.commit('closeLoading');
            }
        },
        saveRole(){
            const { role, radio } = this.roleDialog;
            this.setRole(role[radio]);
        },
        cancelFn(){
            this.roleDialog.show = false;
            this.$fetch.login.logout({}, false).then(res => {
                this.$store.commit('closeLoading');
            }).catch(res => {
                this.$store.commit('closeLoading');
            })
        },
        setRole(currentRole){
            this.loading = true;
            this.$fetch.login.setRole({'roleId': currentRole.id},true).then(res => {
                this.$handleResponse(res, res=>{
                    this.getCurrentRole();
                },false);
            }).catch(err => {
                this.loading = false;
                this.$store.commit('closeLoading');
                this.$notify.error({
                  title: '错误提示',
                  message: err.response.data.msg
                })
            })
        },
        getCurrentRole(){
            this.$fetch.login.currentInfo({},true).then(res => {
                this.$handleResponse(res, res=>{
                    let result = getAllMenu(res.admin.permissions); // 获取菜单和对应的权限
                    let menuObj=getAllMenuPath(result.menu); // 获取菜单的全部路径
                    
                    let roleInfo = Object.assign({ 'loginType': result.type, 'list': this.roleList},res.admin)
                    // delete roleInfo.permissions
                    localStorage.setItem('roleInfo', JSON.stringify(roleInfo)); // 需要的信息就存
                    localStorage.setItem('headerMenu', JSON.stringify(result.menu));  // 用到

                    this.$store.commit('saveRoleInfo', roleInfo);         // store存储
                    this.$store.commit('setLoginType', result.type);   // store存储 
                    this.$store.commit('setMenuObj', menuObj);   // store存储
                    this.$store.commit('setRoleKey', res.admin.currentRole && res.admin.currentRole.role_key);   // store存储
                    
                    
                    // this.$nextTick(function () {
                        // DOM 现在更新了
                        this.getAgentInfo(result.type);

                    // })

                    this.goToPage(result); // 执行跳转
                },true);
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$store.commit('closeLoading');
                this.$notify.error({
                  title: '错误提示',
                  message: err.response.data.msg
                })
            })
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
        },
        getAgentInfo(resultType){
            if(resultType == 'group' || resultType == 'invite'){
                window.localStorage.setItem('c_LoginStatus',true);    //登录后将LoginStatus设置为true，标志需要在工作台首页询问用户修改登录状态
            }
            window.sessionStorage.setItem('c_RLtransferStatus','3');    //坐席状态 （ 1 上线， 2 忙碌， 3离线）
            window.localStorage.setItem('c_use_tel',3);    //坐席电话  （1  普通号码， 3软电话/工作号）
            //获取坐席信息
            this.$fetch.dccSeat.agentInfo({},true).then(res => {
                this.$handleResponse(res, res=>{
                    console.log(JSON.stringify(res.admin))
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
    }
}
</script>

<style lang="scss" scoped>
// .web_login {
//     position: absolute;
//     top: 0;
//     left: 0;
//     bottom: 0;
//     right: 0;
//     min-height: 800px;
// }
// .login-wrap {
//     width: 480px;
//     height: 405px;
//     border-radius: 20px;
//     background: #fff;
//     box-shadow: 0 0 10px 2px rgba(0, 0, 0, .05); 
//     .login-title {
//         top: -52px;
//         left: 50px;
//     }
//     .login-form {
//         margin: 100px 65px 10px;
//     }
//     .form-btn {
//         width: 100%;
//         font-size: 17px;
//         height: 50px;
//         background: #3d7eff;
//     }
//     .form-input {
//         /deep/ .el-input__inner {
//             height: 50px;
//             line-height: 50px;
//         } 
//     }
//     .el-form-item {
//         margin-bottom: 25px;
//     }
// }



// 弹窗上样式
// .login-role-select /deep/.el-dialog {
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
.login-role-select /deep/ .el-icon-close {
    display: none;
}
.login-role-select /deep/ .el-dialog__body {
    padding: 22px 40px 30px;
    text-align: left;
}

.login-role-select /deep/ .el-dialog__footer {
    margin-bottom: 15px;
}
.el-radio {
    display: block;
    margin-top: 15px;
}

.banner-photo {
    position: absolute;
    right: 28px;
    top: 17px
}


// 新登陆样式
.logo {
    width: 100%;
    margin: 61px 0 0;
    width: 100%;
    height: 48px;
    float: left;
    padding-left: 81px;
}
.logo .alike{
    display: inline-block;
    cursor: pointer;
}

.login-container {
    width: 100%;
    height: 100%;
    min-width: 1200px;
    min-height: 900px;
    background: #fff;
}

.login-form {
    width: 410px;
    padding-left: 80px;
}


.login-panel-content {
    width: 100%;
    float: left;
    padding-top: 100px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}

.login-panel-left {
    width: 730px;
    height: 520px;
    padding-right: 80px;
    .left-photo {
        width: 90%;
    }
}

.login-panel {
    margin-top: 30px;
    width: 490px;
    height: 460px;
    background: url("../../assets/images/login/logo-plant.png");
    background-repeat: no-repeat;
    padding-top: 73px;
    background-size: 100% 100%;
    .text-center—title {
        height: 50px;
        line-height: 50px;
        font-size: 30px;
        font-weight: 500;
        text-align: left;
        margin-left: 80px;
        color: #444;  
        margin-bottom: 20px;
    }
}
.form-btn {
    width: 100%;
    box-shadow: 0px 10px 40px -10px #ea5a54;
    border-radius: 0;
    height: 46px;
    background-color: #ea5a54;
    border-color: #ea5a54;
    margin-top: 20px;
}

.form-btn.el-button--primary:visited,
.form-btn.el-button--primary:active,
.form-btn.el-button--primary:focus,
.form-btn.el-button--primary:hover,
.form-btn.el-button--primary {
    background-color: #ea5a54;
    border-color: #ea5a54;
}
.form-btn i {
    font: inherit;
}

.remenber {
    /deep/ .el-form-item__content {
        line-height: 15px;
    }
}

.el-form-item {
    margin-bottom: 22px;
    /deep/ .el-form-item__error {
        top: 40px;
        left: 10px;
    }
}

@media screen and (max-width: 1485px) {
    .login-panel-left {
        width: 660px;
        .left-photo {
            width: 85%;
        }
    }
    .login-container{
        min-height: 750px;
    }
}
</style>


