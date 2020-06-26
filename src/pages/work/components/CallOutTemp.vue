<template>
  <div class="call-out-component">
    <div class="" v-if="PhoneState == 6" @click="call()">
      <img :src="require('@/assets/images/work/call.png')" alt="">
    </div>
    <div class="call-out waiting-for-answer" v-if="alicc_code == 8">
      <div class="temp-rl-style waiting-style">等待对方接听...</div>
      <div class="call-btns">
        <div class="" @click="hangUp()">
          <img :src="require('@/assets/images/work/call-handup.png')" alt="">
        </div>
      </div>
    </div>
    <div class="call-out in-the-call" v-if="alicc_code == 10">
      <div class="temp-rl-style calling-style">通话中 {{callTime}}</div>
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
          <img :src="require('@/assets/images/work/call-handup.png')" alt="">
        </div>
      </div>
    </div>
    <div class="call-out end-calls" v-if="PhoneState == 5">
      <div>结束 {{endTime}}</div>
      <div class="call-btns">
        <div class="" @click="call()">
          <img :src="require('@/assets/images/work/call.png')" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      alicc_code: 6,
      callTime: "00:00:00",
      lastCallTime: "00:00:00",
      hour: 0,
      minute: 0,
      second: 0, //时 分 秒
      millisecond: 0, //毫秒
      int: "",
      toggleMuteInCallStatus: true,   //标志是否静音
    }
  },
  created() {
    eventBus.$off("getCode"); // 关闭上一次的监听
    eventBus.$on("getCode", _code => {
      console.log(`获取code值：${_code}`);
      this.alicc_code = _code;
      console.log("获取_code值", this.alicc_code);
      if (_code == 8) {
        console.log("拨号中、、、");
      } else if (_code == 10) {
        //呼出通话
        console.log("已接通");
        this.int = setInterval(this.timer, 1000);
      } else if (_code == 5) {
        //通话结束后的话后处理  =》  话后处理时间之后是 3空闲
        console.log("结束通话时间", this.callTime);
        this.lastCallTime = this.callTime; //结束后计算通话时长
        window.clearInterval(this.int);
        this.millisecond = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.callTime = "00时00分00秒";
        this.toggleMuteInCallStatus = true;
        // console.log('弹窗关闭')
      }
    });
  },
  methods:{
    call() {
      window.workbench.call("17322300397");
    },
    hangUp() {
      window.workbench.hangUp();
      console.log("挂机");
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
</style>
