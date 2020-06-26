<template>
  <div class="call-out-component">
    <div class="" v-if="PhoneState == 6" @click="answer()">
      <img :src="require('@/assets/images/work/call.png')" alt="" width="30px" height="30px">
    </div>
    <div class="call-out waiting-for-answer" v-if="PhoneState == 8">
      <div class="temp-rl-style waiting-style">等待对方接听...</div>
      <div class="call-btns">
        <div class="" @click="hangUp()">
          <img :src="require('@/assets/images/work/call-handup.png')" alt="" width="30px" height="30px">
        </div>
      </div>
    </div>
    <div class="call-out in-the-call" v-if="PhoneState == 10">
      <div class="temp-rl-style calling-style">通话中 <span v-if="!use">{{callTime}}</span><span v-if="use">{{callTimer2}}</span></div>
      <div class="call-btns">
        <!-- <el-button
          v-if="toggleMuteInCallStatus"
          type="success"
          icon="el-icon-microphone"
          circle
          @click="toggleMuteInCall"
        ></el-button>
        <el-button
          v-if="!toggleMuteInCallStatus"
          type="info"
          icon="el-icon-turn-off-microphone"
          circle
          @click="toggleMuteInCall"
        ></el-button> -->
        <div class="" @click="hangUp()">
          <img :src="require('@/assets/images/work/call-handup.png')" alt="" width="30px" height="30px">
        </div>
      </div>
    </div>
    <div class="call-out end-calls" v-if="PhoneState == 5">
      <div>结束 {{endTime}}</div>
      <div class="call-btns">
        <div class="" @click="answer()">
          <img :src="require('@/assets/images/work/call.png')" alt="" width="30px" height="30px">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  props: ["tel","dccGroupId", "use"],
  data(){
    return {
      PhoneState: 6,
      callTime: "00:00:00",
      lastCallTime: "00:00:00",
      hour: 0,
      minute: 0,
      second: 0, //时 分 秒
      millisecond: 0, //毫秒
      int2: "",
      toggleMuteInCallStatus: true,   //标志是否静音
      showEndTime: false,
      endTime: '00:00:00',  //最终的通话时间
    }
  },
  created() {
    console.log(this.$store.state.callTimer, window.localStorage.getItem('objectDeclareFunc'))
     if(window.localStorage.getItem('objectDeclareFunc') == 'EvtConnected'){
        this.PhoneState = 10;
        if(!this.use){
          let callTime = this.$store.state.callTimer;
          this.hour = callTime && callTime.hour || 0;
          this.minute = callTime && callTime.minute || 0;
          this.second = callTime && callTime.second || 0;
          this.int2 = setInterval(this.timer, 1000);
          window.eventBus.$emit('clearTimer',''); //如果是建档弹窗的话就不关闭了，时间直接过去vuex里面的
        }
     }

    eventBus.$off("objectDeclareFunc"); // 关闭上一次的监听
    eventBus.$on("objectDeclareFunc", _code => {
      console.log("获取通话类型", _code);
      if (_code == 'onDialing') {
        console.log("拨号中、、、");
        this.showEndTime = false;
        this.PhoneState = 8;
        this.endTime = '00:00:00';
      } else if (_code == 'EvtConnected') {
        //呼入通话
        console.log("已接通");
        this.PhoneState = 10;
        if(!this.callTimer){
          this.int2 = setInterval(this.timer, 1000);
        }
      } else if (_code == 'onHangup') {
        //通话结束后的话后处理  =》  话后处理时间之后是 3空闲f
        console.log(this.callTimer2, this.callTimer)
        this.endTime = this.use ? this.callTimer2 : this.callTime;
        this.setTimer('');  //置空
        this.showEndTime = true;
        this.PhoneState = 5;
        // this.lastCallTime = this.callTime; //结束后计算通话时长
        window.clearInterval(this.int2);
        window.localStorage.setItem('objectDeclareFunc', 'onHangup');
        this.millisecond = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.callTime = "00时00分00秒";
      }
    });
  },
  computed: {
      ...mapState(["agentInfo"]),
      'callTimer2'(){
        let callTime = this.$store.state.callTimer;
        this.hour = callTime && callTime.hour || 0;
        this.minute = callTime && callTime.minute || 0;
        this.second = callTime && callTime.second || 0;
        return this.formatZero(this.hour) +"时" +this.formatZero(this.minute) +"分" +this.formatZero(this.second) +"秒";
      }
  },
  methods:{
    ...mapMutations(["setTimer"]),
    answer(){
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
      const { thirdSeat } = this.agentInfo;
      if(thirdSeat && (!thirdSeat.tel && !thirdSeat.plane)){
        this.$message({
          message: '您还未设置坐席号，无法使用电话拨打功能，请联系管理员配置。',
          type: 'warning',
          showClose: true
        });
        return;
      }
      //去触发外呼方法。
      let data = {
        tel: this.tel,
        dccGroupId: this.dccGroupId,  //组id 线索或潜客拨打电话的时候需要
      }
      window.eventBus.$emit('diaLoutBus', data);
    },
    hangUp(){
      window.clearInterval(this.int2);
      window.localStorage.setItem('objectDeclareFunc', 'onHangup');
      //去触发挂断方法。
      window.eventBus.$emit('hangupBus','');
    },
    toggleMuteInCall() {
      window.workbench.toggleMuteInCall();
      this.toggleMuteInCallStatus = !this.toggleMuteInCallStatus
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
    },
    formatZero(num, len = 2) {
      if (String(num).length > len) return num;
      return (Array(len).join(0) + num).slice(-len);
    },
  },
  beforeDestroy () {
    window.clearInterval(this.int2);
    // window.eventBus.$off('stateAction') // 销毁时，事件stateAction监听取消
    console.log('listener was closed')
  }
}
</script>
<style lang="scss" scoped>
.call-out-component {
  .call-out{
    display: flex;
    align-items: center;
    // margin: 0 30px;
    .call-btns{
        margin-left: 10px;
    }
  }

  img {
    cursor: pointer;
  }
} 
.temp-rl-style.calling-style{
  color: #34b572;
}
.temp-rl-style.waiting-style{
  color: #f7a356;
}
</style>
