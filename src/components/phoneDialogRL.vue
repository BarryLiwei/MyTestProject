<template>
  <div>
    <div v-if="dialogVisibleIncomeCallRL">
      <el-dialog
        class="call-coming-dialog"
        :visible.sync="dialogVisible"
        :width="dialogWidth"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div slot="title" class="dialog-title"></div>
        <div
          class="dialog-center call-coming-dialog-center"
          :class="{'call-coming-time' : isCalling}"
        >
          <div class="call-phone-title">{{title}}
            <img v-if="callFuncRLType != 'onDialing' && callFuncRLType != 'EvtConnected' && callFuncRLType != 'm7Ring'" @click="handleClose()" class="call-phone-close-icon" :src="require('@/assets/images/work/close-icon.png')" alt="">
          </div>
          <div class="call-info">
            <div class="sf">{{detectTelInfo.userTypeName}}</div>
            <div class="phone">{{detectTelInfo.tel}}</div>
            <div>{{detectTelInfo.nickname}} {{detectTelInfo.role}}
              <el-tag v-if="detectTelInfo.userType == 2 && detectTelInfo.statusName" class="call-info-tag" size="mini" type="info">{{detectTelInfo.statusName}}</el-tag>
              <el-tag v-if="detectTelInfo.userType == 1 && detectTelInfo.level" class="call-info-tag" size="mini" type="info">{{detectTelInfo.level}}</el-tag>
            </div>
            <div class="dcc" v-if="detectTelInfo.dccName">归属DCC：{{detectTelInfo.dccName}}</div>
          </div>
          
          <!-- 弹窗 -->
          <div class="in-the-call">
            <div class="waiting-style" v-if="callFuncRLType == 'onDialing'">等待对方接听...</div>
            <div class="calling-style" v-if="callFuncRLType == 'EvtConnected'">通话中 {{callTime}}</div>
            <div class="waiting-style" v-if="callFuncRLType == 'onHangup' || showEndTime">通话结束 {{endTime}}</div>
            <div class="in-coming-btns" v-if="callFuncRLType == '' || callFuncRLType == 'onHangup' || showEndTime">
              <div class="" @click="diaLoutVue()">
                <img :src="require('@/assets/images/work/call.png')" alt="">
              </div>
            </div>
            <div class="in-coming-btns" v-if="callFuncRLType == 'EvtConnected' || callFuncRLType == 'onDialing'">
              <div class="" @click="hangupVue()">
                <img :src="require('@/assets/images/work/call-handup.png')" alt="">
              </div>
            </div>
            <div v-if="loginType != 'group' && (callFuncRLType == 'EvtConnected' || callFuncRLType == 'onHangup' || showEndTime)">
              <el-button v-if="detectTelInfo.userType == 1 && detectTelInfo.dccId != this.agentInfo.admin.id" class="show-add-clues-dialog" type="text" size="medium" round @click="showAddCluesDialog()">转移线索</el-button>
              <el-button v-if="detectTelInfo.userType == 2 && detectTelInfo.dccId != this.agentInfo.admin.id" class="show-add-clues-dialog" type="text" size="medium" round @click="showAddCluesDialog()">转移线索</el-button>
              <el-button v-if="detectTelInfo.userType == 3" class="show-add-clues-dialog" type="text" size="medium" round @click="showAddCluesDialog()">新增/转移线索</el-button>
            </div>
            <div v-if="callFuncRLType == 'm7Ring'" class="calling-style">提示：请在插件中接听</div>
          </div>
          
        </div>
      </el-dialog>
    </div>

    <!-- 新增线索 -->
    <add-clues-dialog v-if="showAddClues"  @cluesSuccessFn="addClueSuccess" @cluesCloseFn="showAddClues=false" :callConfig="callConfig"></add-clues-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import AddCluesDialog from '@/pages/work/components/AddCluesDialog'
export default {
  components:{
    AddCluesDialog,
  },
  // props: ['dialogVisibleIncomeCallRL'],
  data() {
    return {
      title:'外呼电话',
      dialogWidth: "260px",
      isCalling: false,
      dialogVisible: true,
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
      checkboxGroup1: ["1", "2"],
      radio4: "1",
      percentage: 80,
      activeName: "first",
      input1: "",
      alicc_code: 6,
      callTime: "00:00:00",
      hour: 0,
      minute: 0,
      second: 0, //时 分 秒
      millisecond: 0, //毫秒
      int: "",
      toggleMuteInCallStatus: true, //标志是否静音
      dialogVisibleIncomeCallRL: false,
      m7CallStateDescriptionStatus: '', //默认为来电振铃
      showEndTime: false,
      endTime: '00:00:00',  //最终的通话时间
      detectTelInfo:'',
      callFuncRLType: '', //类型
      showAddClues: false, // 新增/转移线索弹窗
      callConfig: {},
      isCallIn: 0,
      phoneJson: {}
    };
  },
  computed: {
      ...mapState(["loginType", "agentInfo"]),
  },
  mounted() {
      
  },
  created() {
    eventBus.$off("clearTimer"); // 关闭上一次的监听
    eventBus.$on("clearTimer", _code => {
      console.log('clearTimer1', this.int)
      window.clearInterval(this.int);
    })
    // eventBus.$off('m7CallStateDescription_status'); // 关闭上一次的监听
    window.eventBus.$on('objectDeclareFunc2', phoneJson=>{
      this.getDetectTel(phoneJson);
      this.phoneJson = phoneJson
    });

    // 通话信息
    window.eventBus.$on('objectDeclareFuncRLBus', data => {
      console.log('通话信息', data.phoneJson);
      this.phoneJson = data.phoneJson
    })

    this.$eventHub.$on('showDialogRL', param=>{
      console.log('外呼弹窗显示')
      this.isCallIn = 0;
      this.dialogVisibleIncomeCallRL = true;
      this.dialogVisible = true;
      this.callFuncRLType = "";
      this.title = "外呼电话"
      this.detectTelInfo = param;
      this.showEndTime = false;
    })

    this.$eventHub.$on('objectDeclareFuncRLvueBus', param=>{
      console.log('弹窗接到了来自容联的信号，需要作出反应：', param.type)
      this.callFuncRLType = param.type; //状态
      switch(param.type){
        case 'm7Ring':  //来电弹屏的时候需要知道来电信息
          this.isCallIn = 1;
          this.title = '来电';
          this.getDetectTel(param.phoneJson); //获取来电信息
          this.alicc_code = 6;
          this.showEndTime = false;
          this.dialogVisibleIncomeCallRL = true;
          this.dialogVisible = true;
          break;
        case 'onDialing':
          this.title = '外呼电话';
          console.log('触发外呼振铃');
          this.PhoneState = 8;
          this.endTime = '00:00:00';
          this.showEndTime = false;
          break;
        case 'EvtConnected':  //容联无法在网页接听
          console.log('触发已接听')
          this.alicc_code = 9;
          // this.dialogWidth = "300px";
          this.isCalling = true;
          this.int && window.clearInterval(this.int);
          this.setTimer('');  //置空
          this.int = setInterval(this.timer, 1000);
          setTimeout(()=>{
            if(this.detectTelInfo.userType == 1 && this.detectTelInfo.dccId == this.agentInfo.admin.id){    //"userType": 1,//号码类型：0集团，1潜客，2线索，3未知
              this.toCustomerFollow({id: this.detectTelInfo.intentionId ,userId: this.detectTelInfo.userId})
              // 关闭弹窗
              this.dialogVisibleIncomeCallRL = false;
              this.dialogVisible = false;
            }else if(this.detectTelInfo.userType == 2 && this.detectTelInfo.dccId == this.agentInfo.admin.id){
                this.toCluesDeal2({id: this.detectTelInfo.clueId ,userId: this.detectTelInfo.userId})
                // 关闭弹窗
                this.dialogVisibleIncomeCallRL = false;
                this.dialogVisible = false;
            }
          }, 0)
          break;
        case 'onHangup':  //挂断
          this.int && window.clearInterval(this.int);
          this.setTimer('');  //置空
          console.log("结束通话时间", this.callTime);
          if(this.callTime == '00:00:00'){  //兼容用户呼叫在未接通的情况下又主动挂机了
            this.dialogVisibleIncomeCallRL = false;
            this.dialogVisible = false;
          }else if(this.title == '来电' && this.callTime == '00时00分00秒'){ //用户呼入显示弹窗、在未接通的情况下用户又主动挂机了
            this.dialogVisibleIncomeCallRL = false;
            this.dialogVisible = false;
          }
          this.showEndTime = true;
          this.endTime = this.callTime;
          this.alicc_code = 5;
          
          this.millisecond = 0;
          this.hour = 0;
          this.minute = 0;
          this.second = 0;
          this.callTime = "00时00分00秒";
          this.dialogWidth = "260px";
          this.isCalling = false;
        break;
        case 'onDialing':
          console.log('振铃中')
          this.alicc_code = 6;
          this.showEndTime = false;
          this.dialogVisibleIncomeCallRL = true;
          this.dialogVisible = true;
          break;
        default:
          break;
      }
    })

    // this.$eventHub.$on('m7RingRLBus', phoneJson=>{
    //   this.getDetectTel(phoneJson);
    //   this.alicc_code = 6;
    //   this.showEndTime = false;
    //   this.dialogVisibleIncomeCallRL = true;
    //   this.dialogVisible = true;
    // });
    // this.$eventHub.$on('EvtConnectedRLBus', phoneJson=>{
    //   this.alicc_code = 9;
    //   this.dialogWidth = "300px";
    //   this.isCalling = true;
    //   this.int = setInterval(this.timer, 1000);
    //   setTimeout(()=>{
    //     if(this.detectTelInfo.userType == 1){    //"userType": 1,//号码类型：0集团，1潜客，2线索，3未知
    //       this.toCustomerFollow({id: this.detectTelInfo.intentionId ,userId: this.detectTelInfo.userId})
    //       // 关闭弹窗
    //       this.dialogVisibleIncomeCallRL = false;
    //       this.dialogVisible = false;
    //     }else if(this.detectTelInfo.userType == 2){
    //         this.toCluesDeal2({id: this.detectTelInfo.clueId ,userId: this.detectTelInfo.userId})
    //         // 关闭弹窗
    //         this.dialogVisibleIncomeCallRL = false;
    //         this.dialogVisible = false;
    //     }
    //   }, 0)
    // });
    
    // eventBus.$on('m7CallStateDescription_status', (_code) => {
    //     console.log('容联_code:',_code)
    //     console.log('dialogVisibleIncomeCallRL', this.dialogVisibleIncomeCallRL)
    //     this.m7CallStateDescriptionStatus = _code;
    //     if(_code == 'stInvalid' || _code == 'onHangup'){
    //       console.log("结束通话时间", this.callTime);
    //       if(this.callTime == '00:00:00'){  //兼容用户呼叫在未接通的情况下又主动挂机了
    //         this.dialogVisibleIncomeCallRL = false;
    //         this.dialogVisible = false;
    //       }
    //       this.showEndTime = true;
    //       this.endTime = this.callTime;
    //       this.alicc_code = 5;
    //       window.clearInterval(this.int);
    //       this.millisecond = 0;
    //       this.hour = 0;
    //       this.minute = 0;
    //       this.second = 0;
    //       this.callTime = "00时00分00秒";
    //       this.dialogWidth = "260px";
    //       this.isCalling = false;
          
    //       // this.$emit("IncomeCallRLCloseFn");
    //     }else if(_code == 'stBelling' || _code == 'stInnerBelling'){
    //       // 响铃中
    //       console.log("来电中、、、");
          
    //       this.alicc_code = 6;
    //       this.showEndTime = false;
    //       this.dialogVisibleIncomeCallRL = true;
    //       this.dialogVisible = true;
    //     }else if(_code == 'stTalking'){
    //       //呼入通话
    //       console.log("已接通");
    //       this.alicc_code = 9;
    //       this.dialogWidth = "300px";
    //       this.isCalling = true;
    //       this.int = setInterval(this.timer, 1000);

    //       setTimeout(()=>{
    //         if(this.detectTelInfo.userType == 1){    //"userType": 1,//号码类型：0集团，1潜客，2线索，3未知
    //           this.toCustomerFollow({id: this.detectTelInfo.intentionId ,userId: this.detectTelInfo.userId})
    //           // 关闭弹窗
    //           this.dialogVisibleIncomeCallRL = false;
    //           this.dialogVisible = false;
    //         }else if(this.detectTelInfo.userType == 2){
    //             this.toCluesDeal2({id: this.detectTelInfo.clueId ,userId: this.detectTelInfo.userId})
    //             // 关闭弹窗
    //             this.dialogVisibleIncomeCallRL = false;
    //             this.dialogVisible = false;
    //         }
    //       }, 0)
          
    //     }
    // });
  },
  methods: {
    ...mapMutations(["setTimer"]),
    // 线索处理
    toCluesDeal2(item) {
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
                userId: item.userId
            }
        });
    },
    showAddCluesDialog(){ // 新增线索打开
      this.showAddClues = true;
      let sdkType = window.localStorage.getItem('c_callSDKTools');
      this.callConfig = {
        isCallIn: this.isCallIn, //是否呼入线索 0否， 1是
        userType: this.detectTelInfo.userType,
        tel: this.detectTelInfo.tel,
        nickname: this.detectTelInfo.nickname,
        dccGroupId: this.detectTelInfo.dccGroupId,
        callThirdId: this.phoneJson.CallsheetId
      }
    },
    addClueSuccess(){ // 新增线索关闭
      this.showAddClues = false;
      // this.queryData();
    },
    getDetectTel(phoneJson){
      // 获取来电类型
      this.$fetch.dccSeat.detectTel({tel: phoneJson.CallNo},true).then(res => {
            this.$handleResponse(res, res=>{
                console.log(res)
                this.detectTelInfo = res;
            },true);
            this.loading = false;
        }).catch(err => {
            this.loading = false;
            this.$store.commit('closeLoading');
        })
    },
   // 呼出
    diaLoutVue(){
      this.millisecond = 0;
      this.hour = 0;
      this.minute = 0;
      this.second = 0;
      this.callTime = "00时00分00秒";
      if(window.sessionStorage.getItem('rlZt') == '-1'){
        this.$message({
          message: '请先在插件（企话宝）登录',
          type: 'warning',
          showClose: true
        });
        return;
      }
      if(window.sessionStorage.getItem('c_RLtransferStatus') == '3'){
        this.$message({
          message: '当前坐席为离线状态，暂不支持拨打电话',
          type: 'warning',
          showClose: true
        });
        return;
      }
      this.isCallIn = 0;
      //去触发容联的外呼方法。
      let data = {
        tel: this.detectTelInfo.tel,
        dccGroupId: this.detectTelInfo.dccGroupId,  //组id 线索或潜客拨打电话的时候需要
      }
      console.log("去触发容联的外呼方法。")
      window.eventBus.$emit('diaLoutBus', data);
    },
    //挂机
    hangupVue(){
      this.int && window.clearInterval(this.int); //清除上一次的定时器，否则会无限开多个
      //模拟挂机
      // this.callFuncRLType = 'onHangup'
      // this.setTimer('');  //置空
      // return;
        console.log('挂机')
        this.setTimer('');  //置空
        // phone.hangup();
        //去触发容联的挂断方法。
      window.eventBus.$emit('hangupBus','');
    },
    toggleMuteInCall() {
      window.workbench.toggleMuteInCall();
      this.toggleMuteInCallStatus = !this.toggleMuteInCallStatus;
      console.log("静音");
    },
    timer() {
      this.second++;
      if (this.second >= 60) {
        this.second = 0;
        this.minute = this.minute + 1;
      }

      if (this.minute >= 60) {
        this.minute = 0;
        this.hour = this.hour + 1;
      }

      this.callTime =
        this.formatZero(this.hour) +
        "时" +
        this.formatZero(this.minute) +
        "分" +
        this.formatZero(this.second) +
        "秒";
      this.setTimer({
        hour: this.hour,
        minute: this.minute,
        second: this.second,
      });  //发送通话时长给到别的页面
    },
    formatZero(num, len = 2) {
      if (String(num).length > len) return num;
      return (Array(len).join(0) + num).slice(-len);
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    //弹窗 关闭
    handleClose() {
      this.dialogVisible = false;
      this.$emit("IncomeCallRLCloseFn");
    },
    save() {},
    // 线索跟进
    toCluesDeal() {
      this.$router.push({
        path: "/work/cluesDeal",
        query: {
          tel: this.detectTelInfo.tel
        }
      });
      // 关闭弹窗
      this.dialogVisibleIncomeCallRL = false;
      this.dialogVisible = false;
    }
  },
  beforeDestroy() {
    clearInterval(this.int);
    // this.$eventHub.$off("objectDeclareFuncRLvueBus"); // 销毁时，事件监听取消
    // this.$eventHub.$off("showDialogRL"); // 销毁时，事件监听取消
    // console.log("listener was closed");
  }
};
</script>

<style lang="scss" scoped>
.call-coming-dialog >>> .el-dialog__header {
  display: none;
}
.call-coming-dialog >>> .el-dialog__body {
  padding: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 7px;
}

.call-coming-dialog >>> .el-tabs--card > .el-tabs__header .el-tabs__nav {
  width: 100%;
}
.call-coming-dialog >>> .el-tabs--card > .el-tabs__header .el-tabs__item {
  width: 50%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 20px;
  color: #26252e;
  background-color: #fafcff;
  border-bottom: 1px solid #e4e7ed;
}
.call-coming-dialog
  >>> .el-tabs--card
  > .el-tabs__header
  .el-tabs__item.is-active {
  color: #3d7eff;
  background-color: #fff;
  border-bottom-color: #fff;
}

.call-coming-dialog >>> .el-tabs__content {
  // padding: 15px 30px;
}
.call-coming-dialog .tab-content >>> .el-input__suffix {
  line-height: 60px;
  right: 10px;
}
.call-coming-dialog .call-record-tab >>> .el-input__suffix {
  line-height: 30px;
  right: 5px;
}
.call-coming-dialog >>> .el-input--suffix .el-input__inner {
  border-radius: 36px;
  font-size: 20px;
}
.call-coming-dialog .tab-content >>> .el-input--suffix .el-input__inner {
  height: 60px;
}
.call-coming-dialog-center {
  padding: 20px;
  background: url("~@/assets/images/work/call-bg.png");
  background-size: cover;
  border-radius: 8px;
  text-align: center;
  min-height: 360px;
  font-size: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .call-info {
    padding: 20px 0 50px;
    flex: 1;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    .call-info-tag{
      margin-left: 5px;
      background-color: #f4f4f5;
      border-color: #f4f4f5;
      color: #909399;
    }
    .sf {
      font-size: 18px;
    }
    .phone {
      padding: 20px 0 3px;
      font-size: 20px;
    }
    .dcc{
      margin-top: 10px;
    }
  }
  .before-coming {
    display: flex;
    justify-content: center;
    padding: 0 19px;
  }
  .in-the-call {
    .in-coming-btns {
      padding: 15px 40px;
      display: flex;
      justify-content: center;
      .call-microphone {
        padding: 0;
        width: 40px;
      }
      .call-microphone >>> i.el-icon-microphone {
        font-size: 22px;
      }

      img {
        cursor: pointer;
      }
    }
  }
}
.call-coming-dialog-center.call-coming-time {
  height: 364px;
}
.tab-content {
  padding: 15px 30px;
}
.call-number {
  margin-top: 20px;
  .call-number-items {
    margin-bottom: 20px;
  }
  .call-btn {
    width: 100px;
    height: 60px;
    background-color: #ffffff;
    border-radius: 30px;
    color: #7a8189;
    font-size: 30px;
    width: 30%;
  }
}
.call-record-tab {
  height: 430px;
  .call-input {
    padding: 15px 30px;
  }
  .record-list {
    padding-left: 30px;
    height: 355px;
    overflow-y: scroll;
    .record-item {
      padding: 15px;
    }
    .record-item:not(:last-child) {
      border-bottom: 1px solid #e7e7e7;
    }
    .phone {
      font-size: 18px;
    }
    .record-info {
      font-size: 14px;
      color: #7a8189;
    }
  }
}


.coming-flex-style{
  display: flex;
  
}
.coming-flex-style a{
  display: block;
  width: 40px;
  height: 40px;
}
.acc-style-hidden{
  opacity: 0;
  width: 0!important;
  height: 0!important;
  img{
    display: none;
  }
}
.temp-rl-style{
  padding: 15px 0;
  height: 49px;
}
.calling-style{
  color: #72b422;
}
.waiting-style{
  color: #f39935;
}

.call-phone-title{
  position: relative;
  .call-phone-close-icon{
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
.show-add-clues-dialog{
  color: #fff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
<style>
#softphonebar{
  margin: 0!important;
  padding-bottom: 0!important;
  border-bottom: 0!important;
}
</style>
