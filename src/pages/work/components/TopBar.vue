<template>
    <div class="top-bar">
        <el-row type="flex" class="work-top-bar-component">
            <el-col :span="7" class="top-bar-left">
                <!-- <el-dropdown v-if="groupOptions.length > 1" @command="changeGroup">
                    <span class="group-name">
                        {{groupName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in groupOptions" :key="index"
                            :command="item">
                            {{item.title}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <span>{{groupName}}</span>
            </el-col>
            <el-col :span="17" class="text-right top-bar-right">
                <ul>
                    
                    <!-- 容联测试 start -->
                    <!-- <li class="li-item pointer">
                        <span @click="initSDK()">百应sdk初始化</span>
                    </li>
                    <li class="li-item pointer">
                        <div id="phone-slot"></div>
                        <div id="contact-sdk"></div>
                    </li> -->
                    <!-- 容联测试 end -->


                    <!-- 百应测试 start -->
                    <!-- <li class="li-item pointer">
                        <i class="el-icon-folder-add" @click="loginFn">23</i>
                    </li> -->
                    <!-- <li class="li-item pointer">
                        <i class="el-icon-folder-add" @click="createAicc">创建任务api</i>
                    </li> -->
                    <!-- 百应测试 end -->


                    <!-- 新增线索 -->
                    <li class="li-item pointer" v-if="loginType!='group'">
                        <div @click="addClues">
                            <i class="img-icon icon-add-clue"></i>
                        </div>
                    </li>
                    <!-- 新增档案 -->
                    <li class="li-item pointer" v-if="loginType!='group'">
                        <div @click="addArchive">
                            <i class="img-icon icon-add-archives"></i>
                        </div>
                    </li>
                    <li v-if="agentInfo.thirdSeat && (agentInfo.thirdSeat.tel || agentInfo.thirdSeat.plane)" class="li-item pointer">
                        <el-popover
                            placement="bottom"
                            v-model="visible"
                            trigger="click"
                            popper-class="li-item-phone-popover"
                            @show="showVisible()">
                            <div class="li-item-phone">
                                <div class="li-item-phone__header">
                                    <span class="el-dialog__title">呼叫号码</span>
                                    <button type="button" aria-label="Close" class="el-dialog__headerbtn" style="top: 15px;"><i @click="visible = false" class="el-dialog__close el-icon el-icon-close"></i></button>
                                </div>
                                <div class="li-item-phone__body">
                                    <el-input
                                        placeholder="请输入号码"
                                        v-model="phone"
                                        size="medium"
                                        >
                                        <el-button slot="suffix" type="primary" @click="callPhone()" round size="mini">确定</el-button>
                                    </el-input>
                                </div>
                            </div>
                            <div slot="reference">
                                <i class="img-icon icon-tel"></i>
                            </div>
                        </el-popover>
                    </li>
                    <!-- 通话记录 -->
                    <li class="li-item pointer">
                        <router-link v-if="authCall" tag="a" target="_blank" :to="{path: '/call/call-record', query: {'state': 1}}">
                            <i class="img-icon icon-record"></i>
                        </router-link>
                        <a v-else href="javascript:;" @click="authTips">
                            <i class="img-icon icon-record"></i>
                        </a>
                    </li>
                    

                    
                    <!-- <li class="li-item work-tel">{{lineTel}}
                        <i class="img-icon icon-switch" @click="transferTel()"></i>
                    </li> -->
                    <el-dropdown v-if="showTel && agentInfo.thirdSeat && (agentInfo.thirdSeat.tel || agentInfo.thirdSeat.plane)" 
                        trigger="click" @visible-change="transferVisibleChange">
                        <div class="avatar-wrapper pointer li-item">
                            <span class="user-role">{{lineTel}}</span> 
                            <!-- <i class="el-icon-arrow-down"></i> -->
                            <i v-if="currentTrans.way == 'sip'" class="img-icon call-local"></i>
                            <i v-if="currentTrans.way == 'gateway'" class="img-icon call-gateway"></i>
                            <i v-if="currentTrans.way == 'Local'" class="img-icon call-sip"></i>
                        </div>
                        <el-dropdown-menu v-if="codeStatusText != '离线'" slot="dropdown" class="transfer-tel-dropdown li-item">
                            <div v-for="(item, index) in transferList" :key="'log'+index" @click="handletransferTel(item)" >
                                <el-dropdown-item :class="{'is-active': roleId == item.id}">
                                    <div class="call-item" v-if="item.id == '3' && agentInfo.thirdSeat.tel">
                                        <span class="item-tel">{{agentInfo.thirdSeat.tel}}</span>
                                        <span><i class="img-icon call-local"></i> {{item.name}}</span>
                                    </div>
                                    <div class="call-item" v-if="item.id == '2' && agentInfo.thirdSeat.tel">
                                        <span class="item-tel">{{agentInfo.thirdSeat.tel}}</span>
                                        <span><i class="img-icon call-gateway"></i> {{item.name}}</span>
                                    </div>
                                    <div class="call-item" v-if="item.id == '1' && agentInfo.thirdSeat.tel">
                                        <span class="item-tel">{{agentInfo.thirdSeat.tel}}({{agentInfo.admin.tel}})</span>
                                        <span><i class="img-icon call-sip"></i> {{item.name}}</span>
                                    </div>
                                    <div class="call-item" v-if="item.id == '6' && agentInfo.thirdSeat.plane">
                                        <span class="item-tel">{{agentInfo.thirdSeat.plane}}</span>
                                        <span><i class="img-icon call-local"></i> {{item.name}}</span>
                                    </div>
                                    <div class="call-item" v-if="item.id == '5' && agentInfo.thirdSeat.plane">
                                        <span class="item-tel">{{agentInfo.thirdSeat.plane}}</span>
                                        <span><i class="img-icon call-gateway"></i> {{item.name}}</span>
                                    </div>
                                    <div class="call-item" v-if="item.id == '4' && agentInfo.thirdSeat.plane">
                                        <span class="item-tel">{{agentInfo.thirdSeat.plane}}({{agentInfo.admin.tel}})</span>
                                        <span><i class="img-icon call-sip"></i> {{item.name}}</span>
                                    </div>
                                </el-dropdown-item>
                            </div>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <li v-if="agentInfo.thirdSeat && (agentInfo.thirdSeat.tel || agentInfo.thirdSeat.plane)" class="li-item work-des">
                        <el-popover
                            placement="bottom"
                            width="200"
                            v-model="visibleStatus"
                            popper-class="work-des-popover"
                            >
                            <div class="work-des-pop">
                                <div class="pop-items" @click="ready()">
                                    <div class="status status-online"><i class="status-icon i-online"></i> 坐席在线</div>
                                    <div class="desc">
                                        <div>可拨打、可接听</div>
                                    </div>
                                </div>
                                <div class="pop-items" @click="applyForBreak()">
                                    <div class="status status-busy"><i class="status-icon i-busy"></i> 坐席忙碌</div>
                                    <div class="desc">
                                        <div>可拨打电话、但不可接听电话</div>
                                    </div>
                                </div>
                                <div class="pop-items" @click="handleLogOut()">
                                    <div class="status status-off"><i class="status-icon i-off"></i> 坐席离线</div>
                                    <div class="desc">
                                        <div>不可拨打，可切换离线接听</div>
                                    </div>
                                </div>

                            </div>
                            <div slot="reference" @click="statusVisible = !statusVisible">
                                <span :class="codeStatusText == '在线' ? 'status-online' : codeStatusText == '忙碌' ? 'status-busy' : 'status-off'">
                                    <i class="status-icon"></i>
                                坐席{{codeStatusText}}<span id="rlZt"></span></span>
                                <i style="font-size: 14px;" class="el-icon-arrow-down"></i>
                            </div>
                        </el-popover>
                    </li>
                </ul>
            </el-col>
        </el-row>
    

        <!-- 新增线索弹框 -->
        <AddCluesDialog v-if="dialogVisibleClues" @cluesCloseFn="cluesCloseFn" @cluesSuccessFn="cluesSuccessFn"></AddCluesDialog>

        <!-- 新增档案弹框 -->
        <AddArchivesDialog v-if="dialogVisibleArchive" @archiveCloseFn="archiveCloseFn"></AddArchivesDialog>


        <!-- 跟进弹框 -->
        <CallDialog v-if="isCallDialog" @callCloseFn="callCloseFn"></CallDialog>

       
        <!-- 外呼弹窗-百应 -->
        <CallPhoneTemp v-if="dialogVisibleCallPhone && callType == 'byaicc'" :callType="callType" :phone="phone"></CallPhoneTemp>
        <!-- 外呼弹窗-阿里 -->
        <CallPhoneTempAli v-if="callType == 'alicc'" @callPhoneCloseFn="callPhoneCloseFn" :callType="callType" :phone="phone" :dialogVisible="dialogVisibleCallPhone"></CallPhoneTempAli>
        <!-- 外呼弹窗-容联 -->
        <!-- <CallPhoneTempRL v-if="callType == 'RL'" @callPhoneCloseFn="callPhoneCloseFn" :callType="callType" :phone="phone" :dialogVisible="dialogVisibleCallPhone" :detectTelInfo="detectTelInfo" :key="time"></CallPhoneTempRL> -->
        <!-- 天润外呼 -->
        <CallPhoneTempTR v-if="callType == 'cticloud'" @callPhoneCloseFn="callPhoneCloseFn" :phone="phone" :dialogVisible="dialogVisibleCallPhone"></CallPhoneTempTR>
       
        <el-dialog
            title="切换离线接听"
            :visible.sync="showOutDialogVisible"
            :close-on-click-modal="false"
            width="471px"
            :before-close="handleClose"
        >
            <div class="dialog-center" style="text-align: center;">
                切换到“坐席离线”后，使用个人手机 <b> {{agentInfo.admin && agentInfo.admin.tel}} </b> 接听呼入电话
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="" class="w-90 plain-btn-style" @click="handleClose" round>取消</el-button>
                <el-button size="medium" type="primary" class="w-90"  @click="handleOut" round>确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import AddCluesDialog from "./AddCluesDialog";
import AddArchivesDialog from "./AddArchivesDialog";
import CallDialog from "./CallDialog";
import CallPhoneTemp from "./CallPhoneTemp";
import CallPhoneTempAli from "./CallPhoneTempAli";
import CallPhoneTempRL from "./CallPhoneTempRL";
import CallPhoneTempTR from "./CallPhoneTempTR";



import { mapState } from 'vuex'
export default {
    components:{
        AddCluesDialog,
        AddArchivesDialog,
        CallDialog,
        CallPhoneTemp,
        CallPhoneTempAli,
        CallPhoneTempRL,
        CallPhoneTempTR
    },
    computed: {
        ...mapState(["loginType", "agentInfo", 'menuObj']),
        roleId(){ // 显示角色名
            return this.currentTrans && this.currentTrans['id']
        },
    },
  data() {
    return {
      isCallDialog: false,    //跟进弹框
      dialogVisible: false,
      dialogVisibleClues: false,    //新增线索弹框
      dialogVisibleArchive: false,    //新增档案弹框
      dialogVisibleCallPhone: false,
      codeStatusText: '', //坐席状态
      statusVisible: false,
      time: '',
      groupName: '',
      groupOptions: [],
      val: "",
      options: [
            {
            value: "1",
            label: "是"
            },
            {
            value: "0",
            label: "否"
            }
      ],
      phone: '', //拨打的电话号码
      visible: false,
      callType: '', //（sdkType） byaicc 百应，   alicc 阿里，   RL 容联，   cticloud 天润
      stateAction: '',  //当前坐席状态
      visibleStatus: false,
      lineTel: '',   //线路使用的号码
      smallTel: '',  // 线路小号
      detectTelInfo: '', //该号码信息
      authCall: false,  // 是否有权限跳转到通话记录
      transferList: [
        {'id':'3','name': '网页接听', 'way': 'sip'},
        {'id':'2','name': 'SIP接听', 'way': 'gateway'},
        {'id':'1','name': '手机接听', 'way': 'Local'},
        {'id':'6','name': '网页接听', 'way': 'sip'},
        {'id':'5','name': 'SIP接听', 'way': 'gateway'},
        {'id':'4','name': '手机接听', 'way': 'Local'},
      ],
      timerBusy: null, 
      currentTrans: {'id':'3','name': '网页接听', 'way': 'sip'}, // 当前线路
      showOutDialogVisible: false,  //切换到离线的时候提示
      showTel: false
    };
  },
  created(){
    this.checkAuthCall();
    const { thirdSeat } = this.agentInfo;
    if(thirdSeat && thirdSeat.platformType == '1'){ //平台类型：1容联，2百应，3天润
        this.callType = 'RL';
    }
    else if(thirdSeat && thirdSeat.platformType == '3'){ //平台类型：1容联，2百应，3天润
        this.callType = 'cticloud';
    }
    // this.callType = window.localStorage.getItem('c_callSDKTools') || this.agentInfo.thirdSeat;
    // if(this.callType == 'cticloud' && !this.stateAction){
    //     this.stateAction = window.localStorage.getItem('stateAction')
    //     this.handleStatusText(this.stateAction);
    // }
    // else if(this.callType == 'RL'){
    //     let code = window.sessionStorage.getItem('c_RLtransferStatus')
    //     this.handleRLStatusText(code);
    // }
    let code = window.sessionStorage.getItem('c_RLtransferStatus')
    this.handleRLStatusText(code);
    
    //   eventBus.$off("stateAction"); // 关闭上一次的监听
    eventBus.$on("stateAction", _code => {
      console.log(`获取stateAction值：${_code}`);
      this.stateAction = _code;
      this.handleStatusText(_code);
    });

    
    // 阿里==========
    if(!this.codeStatusText){
        let watchStorage = sessionStorage.getItem('watchStorage');
        if(!watchStorage || watchStorage == '-1' || watchStorage == '0' || watchStorage == '1'){
            this.codeStatusText = "离线";
        }else if(watchStorage == '4'){
            this.codeStatusText = "忙碌";
        }else{
            this.codeStatusText = "在线";
        }
    }

    this.initGroup();
  },
  mounted(){
      this.$nextTick(()=>{
        let c_use_tel = window.localStorage.getItem('c_use_tel')
        const { admin, thirdSeat } = this.agentInfo;

        this.lineTel = thirdSeat && (thirdSeat.tel || thirdSeat.plane) || '';
        this.smallTel = thirdSeat && (thirdSeat.telNo || thirdSeat.planeNo) || '';

        if(c_use_tel == '3') {
            this.currentTrans = {'id':'3','name': '网页接听', 'way': 'sip'}
        }else if(c_use_tel == '2'){
            this.currentTrans = {'id':'2','name': 'SIP接听', 'way': 'gateway'};
        }
        else if(c_use_tel == '1'){
            this.currentTrans = {'id':'1','name': '手机接听', 'way': 'Local'};
        }
        
        window.localStorage.setItem('smallTel', this.smallTel);
    })

    window.eventBus.$on('c_RLtransferStatus', (data)=>{
        this.handleRLStatusText(data);
    })
  },
  methods: {
    initGroup() {
        this.groupName = this.agentInfo.group[0] && this.agentInfo.group[0].title
        this.groupOptions = this.agentInfo.group;
    },
    //  切换坐席组
    changeGroup(command) {
        console.log(command)
        this.groupName = command.title;
    },
    handleStatusText(_code){
        if (_code == 'idle') {
            console.log("在线");
            this.codeStatusText = "在线";
        } else if (_code == 'pause') {
            //呼入通话
            console.log("忙碌");
            this.codeStatusText = "忙碌";
        } else if (_code == 'offline') {
            console.log("离线");
            this.codeStatusText = "离线";

        }
    },
    handleRLStatusText(_code){
        console.log('c_RLtransferStatus',_code)
        if (_code == '1') {
            console.log("在线");
            this.codeStatusText = "在线";
            this.showTel = true;
        } else if (_code == '2') {
            //呼入通话
            console.log("忙碌");
            this.codeStatusText = "忙碌";
            this.showTel = true;
            this.timerBusy = setInterval(() => {
                if (phone) {
                    clearInterval(this.timerBusy);
                    console.log('置忙碌，不可接听电话')
                    phone.destroy()
                    window.sessionStorage.setItem('c_show_RL', false);
                    window.eventBus.$emit("destroyRLBus",'');
                }
            }, 1000)
        } else if (_code == '3') {
            console.log("离线");
            this.codeStatusText = "离线";
            this.showTel = false;
        }
    },
    // 是否有权限跳转到通话记录页面
    checkAuthCall() {
        this.authCall = Object.keys(this.menuObj).indexOf('/call/call-record') > -1 ? true : false;
    },
    // 权限提示
    authTips() {
        this.$notify.warning({
          title: '操作提示',
          message: '无此功能权限(无此菜单)'
        })
    },
    showVisible(){
        if (window.sessionStorage.getItem('c_RLtransferStatus') == '2') {
            window.eventBus.$emit("initRLSDKBus", 'Local')
        }

        const { thirdSeat, admin } = this.agentInfo;
        if(window.sessionStorage.getItem('rlZt') == '-1'){
            this.visible = false;
            this.$message({
                message: '请先在插件（企话宝）登录',
                type: 'warning',
                showClose: true
            });
        }else if(window.sessionStorage.getItem('c_RLtransferStatus') == '3'){
            this.visible = false;
            this.$message({
                message: '当前坐席为离线状态，暂不支持拨打电话',
                type: 'warning',
                showClose: true
            });
        }else if(thirdSeat && (!thirdSeat.tel && !thirdSeat.plane)){
            this.visible = false;
            this.$message({
                message: '您还未设置坐席号，无法使用电话拨打功能，请联系管理员配置。',
                type: 'warning',
                showClose: true
            });
        }else{
            this.visible = true;
        }
        
    },
    callPhone(){
        console.log(this.phone)
        this.getDetectTel();
    },
     
    //新增线索
    addClues(){
        this.dialogVisibleClues = true;
    },
    cluesCloseFn(){
        this.dialogVisibleClues = false;
    },
    // 新增线索成功
    cluesSuccessFn() {
        this.cluesCloseFn();
        this.$eventHub.$emit('work-invite')
    },

    //表格 顶部按钮 新增
    addArchive() {
      this.addressDefaultData = {};
      this.dialogVisibleArchive = true;
      // this.$fetch.cusService
      //     .importUserConf()
      //     .then(res => {
      //     this.closeLoading(); //关闭加载中
      //     this.addData = res.data;
      //     this.addData.u_sex.val = String(this.addData.u_sex.val);
      //     })
      //     .catch(err => {
      //     this.closeLoading();
      //     });
    },
    //新增 弹窗 关闭
    archiveCloseFn() {
      this.dialogVisibleArchive = false;
    },
    save() {},
    // 跟进弹框
    callFn(){
        this.isCallDialog = true;
    },
    callCloseFn(){
        this.isCallDialog = false;
    },
    // 通话记录
    toCallRecord(){
        this.$router.push({
            path: "/call/call-record",
            query: {}
        });
    },
    callPhoneCloseFn(){
        this.dialogVisibleCallPhone = false;
    },
    getDetectTel(){
      this.$fetch.dccSeat.detectTel({tel: this.phone},true).then(res => {
            this.$handleResponse(res, res=>{
                console.log(res)
                this.detectTelInfo = res;
                if(this.detectTelInfo.userType == 1 && this.detectTelInfo.dccId == this.agentInfo.admin.id){    //"userType": 1,//号码类型：0集团，1潜客，2线索，3未知
                    this.toCustomerFollow({id: res.intentionId ,userId: res.userId})
                }else if(this.detectTelInfo.userType == 2 && this.detectTelInfo.dccId == this.agentInfo.admin.id){
                    this.toCluesDeal({id: res.clueId ,userId: res.userId})
                }else{
                    console.log('弹窗', this.detectTelInfo)
                    this.$eventHub.$emit('showDialogRL', this.detectTelInfo)
                }
            },true);
            this.loading = false;
        }).catch(err => {
            this.loading = false;
            this.$store.commit('closeLoading');
        })
    },
    // 线索处理
    toCluesDeal(item) {
        this.$router.push({
            path: "/work/cluesDeal",
            query: {
                id: item.id,
                userId: item.userId
            }
        });
    },
    // 潜客跟进
    toCustomerFollow(item) {
        this.$router.push({
            path: "/work/customerFollow",
            query: {
                id: item.id,
                type: this.followType,
                userId: item.userId
            }
        });
    },


    // 阿里状态切换 ---- start
    //签入（处于签出状态可调用），调用该方法实现在线操作
    logIn(){
        workbench.logIn();
    },
    //签出 下线操作
    handleLogOut(){ //离线弹窗
        this.showOutDialogVisible = true;
    },
    // 离线状态
    logOut(){
        this.callAgentState(3);
       if(this.callType == 'cticloud'){
            this.doLogout();
        }else if(this.callType == 'alicc'){
            console.log('当前状态', window.workbench.getStatus())
            workbench.logOut();
        }else if(this.callType == 'RL'){
            if(phone){
                phone.destroy()
                window.sessionStorage.setItem('c_show_RL', false);
                window.eventBus.$emit("destroyRLBus",'');
            }
        }
        this.codeStatusText = "离线";
        window.sessionStorage.setItem('c_RLtransferStatus', '3')
        this.visibleStatus =false;             
    },
    // 置空闲、通过该方法可变为空闲状态，空闲状态后可接听、拨打电话。
    ready(){
        this.callAgentState(1);
        if(this.callType == 'cticloud'){
            if(this.stateAction == 'offline'){
                this.doLogin();
            }else{
                this.doUnpause();
            }
        }else if(this.callType == 'alicc'){
            console.log('当前状态', window.workbench.getStatus())
            if(window.workbench.getStatus() == 'off'){
                workbench.register();
                this.logIn();
            }else{
                workbench.ready();
            }
        }else if(this.callType == 'RL'){
            // 离线状态下切换需要先登录，否则直接置闲
            if(phone && window.sessionStorage.getItem('c_RLtransferStatus')== '2'){
                console.log('直接置闲')
                phone.m7SetBusy(false,'0')
            }else if(!phone || window.sessionStorage.getItem('c_RLtransferStatus')== '3'){
                console.log('初始化')
                window.eventBus.$emit("initRLSDKBus", 'sip')
                window.eventBus.$emit("destroyRLBus",'');
                window.sessionStorage.setItem('c_show_RL', true);
            }
            
            // window.eventBus.$emit("initRLSDKBus", 'sip')
            // let param = {
            //     p1: false,
            //     p2: '0'
            // }
            // window.eventBus.$emit('m7SetBusyBus',param);
        }

        this.codeStatusText = "在线";
        window.sessionStorage.setItem('c_RLtransferStatus', '1')
        this.showTel = true;
        this.visibleStatus =false;
    },
    //置忙碌
    applyForBreak(){
        this.callAgentState(2);
        if(this.callType == 'cticloud'){
            this.doPause();
        }else if(this.callType == 'alicc'){
            console.log('当前状态', window.workbench.getStatus())
            workbench.applyForBreak(1, '临时有事')
        }else if(this.callType == 'RL'){
            if(phone) {
                console.log('置忙碌，不可接听电话')
                phone.destroy()
                window.sessionStorage.setItem('c_show_RL', false);
                window.eventBus.$emit("destroyRLBus",'');
            }
        }
        this.codeStatusText = "忙碌";
        window.sessionStorage.setItem('c_RLtransferStatus', '2')
        this.showTel = true;
        this.visibleStatus =false;
    },

    //  天润状态切换接口 start ---------
    //退出
    doLogout() {
        var params = {};
        params.logoutMode = 1;
        params.removeBinding = 0;
        CTILink.Agent.logout(params, function (result) {
            if (result.code == 0) {
                //退出成功
            }
        });
    },

    //置忙
    doPause() {
        var params = {};
        params.pauseType = 1;
        params.pauseDescription = "置忙";
        CTILink.Agent.pause(params);
    },

    //置闲
    doUnpause() {
        CTILink.Agent.unpause();
    },
    transferVisibleChange(item){
        // if(item && this.currentTrans.id == '1' && this.codeStatusText == '离线'){
        //     this.$message({
        //         message: '请先切换到上线状态',
        //         type: 'warning',
        //         showClose: true
        //     });
        // }
        
    },
    handletransferTel(item){
        this.showTel = true;
        if(item.id == this.currentTrans.id){ // 自己点击自己
            return;
        }
        this.currentTrans = item;
        this.transferTelFn(item);
    },
    transferTelFn(item){
        // 容联
        if(item.id == '1' || item.id == '4'){
            window.localStorage.setItem('c_use_tel', 1);

            if (this.codeStatusText != '忙碌') {
                window.eventBus.$emit("initRLSDKBus", 'Local')
            } 
            console.log('Local ---    私人号码-手机')
        }else if(item.id == '2' || item.id == '5'){
            window.localStorage.setItem('c_use_tel', 2);

            if (this.codeStatusText != '忙碌') {
                window.eventBus.$emit("initRLSDKBus", 'gateway')
            }
            console.log('gateway ---    sip电话')
        } else if(item.id == '3' || item.id == '6'){
            window.localStorage.setItem('c_use_tel', 3);

            if (this.codeStatusText != '忙碌') {
                window.eventBus.$emit("initRLSDKBus", 'sip')
            }
            console.log('sip ---    软电话-网页')
        }

        if(phone){
            phone.destroy();
        }
        window.sessionStorage.setItem('c_show_RL', false);
        window.eventBus.$emit("destroyRLBus",'');

        const { thirdSeat } = this.agentInfo;
        if (item.id > 3) {
            this.lineTel = thirdSeat && thirdSeat.plane;
            this.smallTel = thirdSeat && thirdSeat.planeNo;
        } else {
            this.lineTel = thirdSeat && thirdSeat.tel;
            this.smallTel = thirdSeat && thirdSeat.telNo;

        }
        window.localStorage.setItem('smallTel', this.smallTel);
    },
    //切换到私人号的离线模式
    handleOut(){
        // 不为在线，设置为在线
        if (window.localStorage.getItem('c_RLtransferStatus') != '1') {
            this.callAgentState(1);
            window.localStorage.setItem('c_use_tel', 1);
            window.sessionStorage.setItem('c_RLtransferStatus', '1')

            if(phone){
                phone.destroy();
            }
            window.eventBus.$emit("initRLSDKBus", 'Local')
            window.eventBus.$emit("destroyRLBus",'');
        }

        const { thirdSeat } = this.agentInfo;

        this.lineTel =  thirdSeat && (thirdSeat.tel || thirdSeat.plane) || '';
        this.smallTel = thirdSeat && (thirdSeat.telNo || thirdSeat.planeNo) || '';

        this.showOutDialogVisible = false;
        
        this.currentTrans = {'id':'1','name': '手机接听', 'way': 'Local'}; // 当前线路
        this.codeStatusText = "离线";
        window.localStorage.setItem('smallTel', this.smallTel);

        this.showTel = true;
        this.visibleStatus =false;
    },
    handleClose(){
        this.showOutDialogVisible = false;
        this.showTel = false;
        this.logOut();
    },

    //登录
    doLogin(bindTel='100002', bindType=3) {
      //调用座席登录权限验证接口获取sessionKey, qids和webSocketUrl等参数

      var departmentId = 'BM3000527';
      var crmId = '0001';
      var timestamp = parseInt((new Date()).getTime() / 1000);
      var token = 'acfd80b3a36bec1acd79da0710684687';
      var sign = md5(departmentId + timestamp + token);

      var url = 'https://api-test-2.cticloud.cn/interface/v10/agentLogin/authenticateJsonp';
      url += '?validateType=1&departmentId=' + departmentId + '&crmId=' + crmId + '&timestamp=' + timestamp + '&sign=' + sign
      $.ajax({
          type: 'GET',
          dataType: 'jsonp',
          jsonp: 'callback',
          url: url,
          success: function (r) {
              var data = eval("(" + r + ")");
              if (data != undefined && data.result == "0") {
                  var params = {};
                  params.sessionKey = data.sessionKey;
                  params.enterpriseId = data.enterpriseId;  //
                  params.cno = data.cno;
                  params.bindTel = bindTel; //'100002' 自己的手机号或者分机号，请查看 bindType 
                  params.bindType = bindType; //1普通电话，2分机，3软电话
                  params.loginStatus = 1;
                  params.webSocketUrl = data.agentGateWayUrl;
                  params.qids = data.qids;    //班长席时返回

                  CTILink.Agent.login(params, function (result) {
                      if (result.code == 0) {
                          //座席登录成功
                          console.log('登录成功')
                          console.log(result)
                      } else {
                          //座席登录失败，失败原因： + result.msg
                          console.log(result)
                      }
                  });
              }
          },
          error: function (r) {
              //登录失败，接口请求错误
          }
      });
    },
    //  天润状态切换接口 end ---------

    
    callAgentState(state){
        this.$fetch.dccSeat.callAgentState({state: state},false).then(res => {
            this.$handleResponse(res, res=>{

            },false);
        }).catch(err => {
            this.$store.commit('closeLoading');
        })
    }
    
    
  },
  beforeDestroy () {
    // window.eventBus.$off('stateAction') // 销毁时，事件stateAction监听取消
    // window.eventBus.$off('c_RLtransferStatus') 
    console.log('listener was closed')
  }
};
</script>

<style lang="scss" scoped>
.transfer-tel-dropdown .is-active,
.top-bar-left .is-active{
    color: #3d7eff;
}
.work-top-bar-component {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 30px;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, .05);
    position:fixed;
    top: 70px;
    left: 0;
    right: 0;
    z-index: 9;

    .group-name {
        font-size: 16px;
        color: #26252e;
        cursor: pointer;
    }


    @media (max-width: 1485px) {
        height: 46px;
        line-height: 46px;
    }
}
.top-bar-left {
  font-size: 16px;
  color: #26252e;
}
.transfer-tel-dropdown{
    .item-tel{
        font-size: 16px;
    }
    color: #212417!important;
    font-size: 14px;
    .img-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-left: 33px;
        margin-right: 14px;
        vertical-align: middle;
        background-size: contain;
        background-repeat: no-repeat;
        &.call-local {
            background-image: url('~@/assets/images/icons/call-local.png')
        }
        &.call-gateway {
            background-image: url('~@/assets/images/icons/call-gateway.png');
            margin-right: 18px;
        }
        &.call-sip {
            background-image: url('~@/assets/images/icons/call-sip.png')
        }

        @media (max-width: 1485px) {
            font-size: 14px;
            width: 22px;
            height: 22px;
            margin-left: 22px;
            margin-right: 8px;

            &.call-gateway {
                margin-right: 12px;
            }
        }
    }
}
.call-item {
    display: flex;
    justify-content: space-between;
}
.top-bar-right{
    .li-item{
        padding: 0 20px;
        display: inline-block;
        position: relative;
        cursor: pointer;
        &::before{
            content: '';
            border-left: 1px solid #eaebf0;
            width: 1px;
            height: 18px;
            display: inline-block;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
        }
        .img-icon {
            display: inline-block;
            width: 28px;
            height: 28px;
            vertical-align: middle;
            background-size: contain;
            background-repeat: no-repeat;

            &.icon-add-clue {
                background-image: url('~@/assets/images/icons/icon-add-clue.png')
            }
            &.icon-record {
                background-image: url('~@/assets/images/icons/icon-record.png')
            }
            &.icon-add-archives {
                background-image: url('~@/assets/images/icons/icon-add-archives.png')
            }
            &.icon-tel {
                background-image: url('~@/assets/images/icons/icon-tel.png')
            }
            &.icon-switch {
                width: 24px;
                height: 24px;
                background-image: url('~@/assets/images/icons/icon-switch.png')
            }

            &.call-local {
                width: 24px;
                height: 24px;
                background-image: url('~@/assets/images/icons/call-local.png')
            }
            &.call-gateway {
                width: 24px;
                height: 24px;
                background-image: url('~@/assets/images/icons/call-gateway.png')
            }
            &.call-sip {
                width: 24px;
                height: 24px;
                background-image: url('~@/assets/images/icons/call-sip.png')
            }
            

            @media (max-width: 1485px) {
                width: 22px;
                height: 22px;

                &.icon-switch {
                    width: 22px;
                    height: 22px;
                }
                &.call-local, &.call-gateway, &.call-sip {
                    width: 22px;
                    height: 22px;
                }
            }
        }
        &.work-des {
            font-weight: 600;
            font-size: 15px;
            color: #7a8189;
        }
    }
}
.work-state-list {
  font-weight: 600;
  font-size: 16px;
  color: #7a8189;
  margin-left: 5px;
}
.grid-content-left {
  text-align: right;
  margin-right: 6px;
  line-height: 40px;
  font-size: 13px;
  color: #454545;
}
.red {
  color: #ea5a54;
}
.radio-button-level .el-radio-button{
    width: 25%;
}
.radio-button-level >>> .el-radio-button__inner{
    width: 100%;
}

.work-des, .work-des-pop{
    .status-online{
        color: #67c23a;
        i.status-icon{
            background-color: #67c23a;
        }
    }
    .status-busy{
        color: #f56c6c;
        i.status-icon{
            background-color: #f56c6c;
        }
    }
    .status-off{
        color: #909399;
        i.status-icon{
            background-color: #909399;
        }
        
    }
    .i-online{
        background-color: #67c23a;
    }
    .i-busy{
        background-color: #f56c6c;
    }
    .i-off{
        background-color: #909399;
    }
    .status-icon{
        width: 10px;
        height: 10px;
        display: inline-block;
        border-radius: 50%;
    } 
}
.work-des-pop{
        .pop-items{
            padding: 15px;
            cursor: pointer;
        }
        .pop-items:not(:last-child) {
            border-bottom: solid 1px #eaebf0;
        }
        background-color: #373d41;
        color: #fff;
    }
.li-item-phone{
    .li-item-phone__header{
        padding: 10px;
        background-color: #fbfcff;
        border-bottom: 1px solid #eaebf0;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .li-item-phone__body{
        display: flex;
        padding: 30px 30px;
    }
}
</style>
<style lang="scss">
.li-item-phone-popover{
    padding: 0;
    width: 400px;
}
.li-item-phone-popover /deep/ .el-input--suffix .el-input__inner {
    border-radius: 36px;
    // height: 60px;
    // font-size: 18px;
}
.li-item-phone-popover /deep/ .el-input--suffix .el-input__suffix{ 
    top: 4px;
    right: 5px;
}
.work-des-popover.el-popover{
    background-color: #373d41;
}
.work-des-popover.el-popper .popper__arrow::after{
    border-bottom-color: #373d41;
}
</style>

