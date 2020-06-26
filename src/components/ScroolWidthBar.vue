<template>
    <div class="block scroolWidthBar" :style="'width:'+widthVal" v-show="max > 25">
        <el-slider
          style="width:100%"
          :max="max"
          :min="min"
          v-model="scrollLeftVal"
          :show-tooltip="false"
          @change="formatTooltip"
        ></el-slider>
    </div>
</template>
<script>
import { debouce } from "@/utils/util.js";
export default {
  name: "scroolWidthBar",
  props: {
    tableId: {
      type: String,
      default: 'tableId'
    }
  },
  data() {
    return {
      scrollLeftVal: 0,
      min: 0,
      max: 0,
      obj: {},
      widthVal: ""
    };
  },
  methods: {
    initData() {
      let that = this;
      this.$nextTick(function() {
        let tabelId = document.getElementById(this.tableId); // 为了解决一个v-show 时一个页面出现多个table的场景
        if(tabelId){
          that.obj = tabelId.getElementsByClassName("el-table__body-wrapper")[0];
        }else {
          that.obj = document.getElementsByClassName("el-table__body-wrapper")[0];
        }
        if(this.obj) {
          that.max = that.obj.scrollWidth - that.obj.clientWidth;
          that.widthVal = that.obj.scrollWidth / 10 + "px"; //保留最小20px宽度
        }
      });
    },
    formatTooltip() {
      this.obj.scrollLeft = this.scrollLeftVal;
    }
  },
  mounted() {
    this.initData();
    let that = this;
    // 防抖
    window.addEventListener(
      "resize",
      function() {
        that.initData();
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener("resize", function() {}, false);
  }
};
</script>
<style>
.scroolWidthBar {
  position: fixed;
  bottom: 44px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 400px;
  height: 60px;
  opacity: 0.4;
  z-index: 400;
}

.scroolWidthBar:hover {
  opacity: 0.8;
}

.scroolWidthBar .el-slider__button.dragging,
.scroolWidthBar .el-slider__button:hover,
.scroolWidthBar .el-slider__button:hover {
  transform: scale(1) !important;
}

.scroolWidthBar .el-slider__button-wrapper {
  width: 64px !important;
  height: 51px !important;
  z-index: 1001;
  top: -9px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  background-color: transparent;
  text-align: center;
  -ms-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  line-height: normal;
}

.scroolWidthBar .el-slider__bar {
  height: 18px;
  background-color: transparent;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  position: absolute;
}
.scroolWidthBar .el-slider__runway {
  width: 100%;
  height: 40px;
  margin: 16px 0;
  background-color: #e4e7ed;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
}

.scroolWidthBar .el-slider__button {
  position: relative;
  width: 100%;
  height: 51px;
  border: 2px solid #1494eb;

  background-color: #fff;
  border-radius: 0;
  -webkit-transition: 0.2s;
  transition: 0.2s;
  -ms-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.scroolWidthBar .el-slider__button::before {
  content: "当前区域";
  font-size: 14px;
  position: absolute;
  color: black;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
}

.scroolWidthBar .el-slider__button-wrapper {
  height: 40px;
  width: 36px;
  z-index: 1001;
  top: -6px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  background-color: transparent;
  text-align: center;
  -ms-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  line-height: normal;
}
</style>