<template>
  <div>
    <div v-if="dialogVisibleIncomeCall">
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
          <div>电话呼入</div>
          <div class="call-info">
            <div class="sf">线索</div>
            <div class="phone">17322300397</div>
            <div>王五</div>
          </div>
          <div class="before-coming" v-if="dialogVisible && alicc_code != 9">
            <!-- <div class="" @click="hangUp()">
              <img :src="require('@/assets/images/work/call-handup.png')" alt="">
            </div> -->
            <div class="" @click="answer()">
              <img :src="require('@/assets/images/work/call.png')" alt="">
            </div>
          </div>
          <div class="in-the-call" v-if="alicc_code == 9">
            <div style="color: #3bdaa4;">通话中 {{callTime}}</div>
            <div class="in-coming-btns">
              <el-button
                class="call-microphone"
                v-if="toggleMuteInCallStatus"
                type="success"
                icon="el-icon-microphone"
                circle
                @click="toggleMuteInCall"
              ></el-button>
              <el-button
                class="call-microphone"
                v-if="!toggleMuteInCallStatus"
                type="info"
                icon="el-icon-turn-off-microphone"
                circle
                @click="toggleMuteInCall"
              ></el-button>
              <div class="" @click="hangUp()">
                <img :src="require('@/assets/images/work/call-handup.png')" alt="">
              </div>
              <!-- <el-button type="danger" icon="el-icon-turn-off-microphone" circle size="small" @click="toggleMuteInCall()"></el-button> -->
              <!-- <el-button type="primary" icon="el-icon-more" circle size="small"></el-button> -->
              <!-- <el-button type="danger" icon="el-icon-phone" circle size="small"  @click="hangUp()"></el-button> -->
            </div>
            <el-button type="primary" size="medium" round @click="toCluesDeal()">通话建档</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogWidth: "210px",
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
      items: ["内饰", "外观", "舒适度"],

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
      dialogVisibleIncomeCall: false,
    };
  },
  created() {
    eventBus.$off("getCode"); // 关闭上一次的监听
    eventBus.$on("getCode", _code => {
      console.log(`获取code值：${_code}`);
      this.alicc_code = _code;
      console.log("获取_code值", this.alicc_code);
      if (_code == 6) {
        console.log("来电中、、、");
        this.dialogVisibleIncomeCall = true;
        // this.startTime();
      } else if (_code == 9) {
        //呼入通话
        console.log("已接通");
        this.dialogWidth = "300px";
        this.isCalling = true;
        this.int = setInterval(this.timer, 1000);
      } else if (_code == 5) {
        //通话结束后的话后处理  =》  话后处理时间之后是 3空闲
        console.log("结束通话时间", this.callTime);
        window.clearInterval(this.int);
        this.millisecond = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.callTime = "00时00分00秒";
        this.dialogWidth = "210px";
        this.isCalling = false;
        this.toggleMuteInCallStatus = true;
        // console.log('弹窗关闭')
        // this.handleClose();
        this.dialogVisibleIncomeCall = false;
      }else if(_code == 3){ //客户主动挂机
        this.dialogVisibleIncomeCall = false;
      }
    });

    eventBus.$off("caller"); // 关闭上一次的监听
    eventBus.$on("caller", _caller => {
      // this.caller = _caller
      console.log("来电号码:", _caller);
    });
  },
  methods: {
    hangUp() {
      window.workbench.hangUp();
      console.log("挂机");
    },
    answer() {
      this.alicc_code = 9;
      this.dialogWidth = "300px";
      this.isCalling = true;
      window.workbench.answer();
      console.log("接听电话，通过该方法可接听来电，建立通话连接。");
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
      this.$emit("IncomeCallCloseFn");
    },
    save() {},
    // 线索跟进
    toCluesDeal() {
      this.$router.push({
        path: "/work/cluesDeal",
        query: {}
      });
    }
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
  height: 280px;
  font-size: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .call-info {
    padding: 20px 0 50px;
    .sf {
      font-size: 18px;
    }
    .phone {
      padding: 20px 0 3px;
      font-size: 20px;
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
      justify-content: space-between;
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
</style>