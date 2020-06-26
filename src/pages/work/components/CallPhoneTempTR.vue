<template>
  <div>
    <div>
      <el-dialog
        class="call-phone-dialog"
        :visible.sync="dialogVisible"
        :width="dialogWidth"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div slot="title" class="dialog-title"></div>
        <div
          class="dialog-center call-phone-dialog-center"
          :class="{'call-coming-time' : isCalling}"
        >
          <div class="call-phone-title">外呼电话
            <img v-if="PhoneState != 8 && PhoneState != 9" @click="handleClose()" class="call-phone-close-icon" :src="require('@/assets/images/work/close-icon.png')" alt="">
          </div>
          <div class="call-info">
            <div class="sf">线索</div>
            <div class="phone">{{phone}}</div>
            <div v-if="!isCalling">张松 华南项目组 销售总监</div>
          </div>
          <div class="call-event">
            <!-- 可拨号 -->
            <div class="before-coming" v-if="PhoneState != 8 && PhoneState != 9 && !showEndTime">
              <div class="temp-rl-style"></div>
              <div class="" @click="answer()">
                <img :src="require('@/assets/images/work/call.png')" alt="">
              </div>
            </div>
            <!-- 等待对方接听 -->
            <div class="dialing-call" v-if="PhoneState == 8">
              <div class="temp-rl-style waiting-style">等待对方接听...</div>
              <div class="" @click="hangUp()">
                  <img :src="require('@/assets/images/work/call-handup.png')" alt="">
                </div>
            </div>
            <!-- 通话中 -->
            <div class="in-the-call" v-if="PhoneState == 9">
              <div class="temp-rl-style calling-style">通话中 {{callTime}}</div>
              <div class="in-coming-btns">
                <div class="" @click="hangUp()">
                  <img :src="require('@/assets/images/work/call-handup.png')" alt="">
                </div>
              </div>
            </div>
            <!-- 通话结束 -->
            <div class="end-call" v-if="showEndTime">
              <div class="temp-rl-style waiting-style">通话结束 {{endTime}}</div>
              <div class="" @click="answer()">
                <img :src="require('@/assets/images/work/call.png')" alt="">
              </div>
            </div>

            <div class="set-clue-btn" v-if="isCalling">
              <el-button size="medium" class="plain-btn-style" round @click="toCluesDeal()">建档</el-button>
            </div>
          </div>

        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: ["callType", "phone","dialogVisible"],
  data() {
    return {
      // dialogWidth: "210px",
      dialogWidth: "270px",
      isCalling: false,
      // dialogVisible: false,
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
      items: ["内饰", "外观", "舒适度"],

      activeName: "first",
      input1: "",
      PhoneState: 6,
      callTime: "00:00:00",
      hour: 0,
      minute: 0,
      second: 0, //时 分 秒
      millisecond: 0, //毫秒
      int: "",
      toggleMuteInCallStatus: true, //标志是否静音
      dialogVisibleIncomeCall: false,
      m7CallStateDescriptionStatus: 'stInvalid', //默认为空闲状态
      showEndTime: false,
      endTime: '00:00:00',  //最终的通话时间
    };
  },
  created() {

    eventBus.$off("clearTimer"); // 关闭上一次的监听
    eventBus.$on("clearTimer", _code => {
      window.clearInterval(this.int);
    })
    if(true){  //为陌生号码
      this.isCalling = true;
    }
    this.showEndTime  = false;
    // eventBus.$off("stateAction"); // 关闭上一次的监听
    eventBus.$on("stateAction", _code => {
      console.log('stateAction:',_code)
      if(_code == 'busyAgentOb'){
        console.log('正在呼叫中...')
        this.showEndTime = false;
        this.PhoneState = 8;
        this.endTime = '00:00:00';
      }
      else if(_code == 'busyOb') {
        //呼入通话
        console.log("已接通");
        this.PhoneState = 9;
        this.int = setInterval(this.timer, 1000);
      }else if(_code == 'ACW'){
        console.log("结束通话时间", this.callTime);
        this.setTimer('');  //置空
        this.showEndTime = true;
        this.endTime = this.callTime;
        this.PhoneState = 6;
        window.clearInterval(this.int);
        this.millisecond = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.callTime = "00时00分00秒";
        // this.$emit("callPhoneCloseFn");
      }

    })
  },
  mounted(){

    
  },
  methods: {
    ...mapMutations(["setTimer"]),
    answer(){
      //去触发天润的外呼方法。
      var params = {};
      params.tel = this.phone || '17322300397';
      CTILink.Agent.previewOutcall(params);
    },
    hangUp(){
      //去触发天润的挂断方法。
      if (CTILink.Session.isSessionAlive()) {
          CTILink.Session.unlink();
      }
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
      // this.setTimer({
      //   hour: this.hour,
      //   minute: this.minute,
      //   second: this.second,
      // });
      // this.setTimer(this.callTime)
    },
    formatZero(num, len = 2) {
      if (String(num).length > len) return num;
      return (Array(len).join(0) + num).slice(-len);
    },
    //弹窗 关闭
    handleClose() {
      // this.dialogVisible = false;
      this.$emit("callPhoneCloseFn");
    },
    // 线索跟进
    toCluesDeal() {
      this.$router.push({
        path: "/work/cluesDeal",
        query: {}
      });
    }
  },
  beforeDestroy () {
    window.clearInterval(this.int);
    // window.eventBus.$off('stateAction') // 销毁时，事件stateAction监听取消
    console.log('listener was closed')
  }
};
</script>

<style lang="scss" scoped>
.call-phone-dialog >>> .el-dialog__header {
  display: none;
}
.call-phone-dialog >>> .el-dialog__body {
  padding: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 7px;
}

.call-phone-dialog >>> .el-tabs--card > .el-tabs__header .el-tabs__nav {
  width: 100%;
}
.call-phone-dialog >>> .el-tabs--card > .el-tabs__header .el-tabs__item {
  width: 50%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 20px;
  color: #26252e;
  background-color: #fafcff;
  border-bottom: 1px solid #e4e7ed;
}
.call-phone-dialog
  >>> .el-tabs--card
  > .el-tabs__header
  .el-tabs__item.is-active {
  color: #3d7eff;
  background-color: #fff;
  border-bottom-color: #fff;
}

.call-phone-dialog >>> .el-tabs__content {
  // padding: 15px 30px;
}
.call-phone-dialog .tab-content >>> .el-input__suffix {
  line-height: 60px;
  right: 10px;
}
.call-phone-dialog .call-record-tab >>> .el-input__suffix {
  line-height: 30px;
  right: 5px;
}
.call-phone-dialog >>> .el-input--suffix .el-input__inner {
  border-radius: 36px;
  font-size: 20px;
}
.call-phone-dialog .tab-content >>> .el-input--suffix .el-input__inner {
  height: 60px;
}
.call-phone-dialog-center {
  padding: 15px 20px 20px;
  background: url("~@/assets/images/work/call-bg.png");
  background-size: cover;
  border-radius: 8px;
  text-align: center;
  height: 320px;
  font-size: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  .call-info {
    padding: 30px 0 10px;
    .sf {
      font-size: 18px;
    }
    .phone {
      padding: 20px 0 3px;
      font-size: 20px;
    }
  }
  .call-event{
    padding-top: 20px;
    .temp-rl-style{

    }
    .set-clue-btn{
      padding-top: 30px;
      .plain-btn-style{
        padding: 9px 18px;
        background-color: transparent;
      }
    }
  }
  .before-coming {
    // display: flex;
    // justify-content: center;
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
    }
  }
}
.call-phone-dialog-center.call-coming-time {
  height: 353px;
}
.call-phone-title{
  position: relative;
  .call-phone-close-icon{
    position: absolute;
    right: 5px;
    top: 5px;
  }
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
.temp-rl-style.calling-style{
  color: #34b572;
}
.temp-rl-style.waiting-style{
  color: #f7a356;
}
</style>

<style>
.component-page-header-list-state .phone-state-result {
  color: #fff;
}
.cc_sdk-popover {
  /* z-index: 9999; */
}
#phone-slot {
  opacity: 0;
}
#softphonebar{
  margin: 0!important;
  padding-bottom: 0!important;
  border-bottom: 0!important;
}
</style>
