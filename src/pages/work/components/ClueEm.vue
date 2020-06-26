<template>
  <div class="clue-em">
    <div class="lt-content">
      <div class="cp-models xs-left-title">
        <div class="title-left">
          <i class="title-left-style"></i>
          竞争车型
        </div>
        <div class="models xs-right" v-if="extendData">
          <div v-for="(item, index) in extendData['competeModel']" :key="index">{{item.modelName || item}}</div>
        </div>
      </div>
      <div class="purchase-focus xs-left-title">
        <div class="title-left">
          <i class="title-left-style"></i>
          购车关注点
        </div>
        <div class="tag-group xs-right" v-if="extendData">
          <!-- <el-tag>{{extendData.focus}}</el-tag> -->
          <el-tag
            v-if="extendData.focus.length > 0"
            v-for="item in extendData.focus"
            :key="item"
            size="small"
            type="info"
            effect="plain"
          >{{ item }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "extendDataIdx"],
  data() {
    return {
      radio4: "1",
      percentage: 80,
      items: ["内饰", "外观", "舒适度"],
      // extendData:{}
    };
  },
  created(){
    console.log(this.data, this.extendDataIdx)
    // this.extendData = this.data[this.extendDataIdx]
  },
  computed: {
    extendData:function(){
      return this.data[this.extendDataIdx];
    }
  }
  
};
</script>
<style lang="scss" scoped>
.clue-em .lt-content {
  padding:  0px 15px 15px;
  .has-left-title {
    padding: 15px 20px 10px;
  }
  .title-left-style {
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #3d7eff;
    opacity: 0.2;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -2px;
  }
  .xs-left-title {
    // padding: 15px;
    // display: flex;
    // flex-direction: column;
    // align-items: baseline;
    .title-left {
      color: #7e8794;
      padding-bottom: 10px;
      font-size: 14px;
    }
    .xs-right {
      flex: 1;
    }
  }
  .el-radio-group {
    width: 100%;
  }
  .el-radio {
    display: flex;
    margin-right: 0px;
    padding: 7px 15px;
    margin-bottom: 10px;
    .label-radio {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .el-radio.is-checked {
    background-color: #f1f5ff;
  }
  .el-radio >>> .el-radio__label {
    flex: 1;
  }

  .clues-score {
    .progress-num {
      margin-left: 10px;
      font-size: 14px;
      color: #4a4ee7;
      i {
        font-size: 14px;
        font-style: normal;
      }
    }
    .score-cont {
      width: 100%;
      display: flex;
      align-items: baseline;
    }
  }
  .clues-score >>> .el-progress-bar__inner {
    background-color: unset;
    background-image: linear-gradient(
      to right,
      #d5eaff 0%,
      #3d7eff 50%,
      #4466f3 75%,
      #4a4ee7 100%
    );
  }
  .distance >>> .el-progress-bar__inner {
    background-color: unset;
    background-image: linear-gradient(
      to right,
      #7be9a2 0%,
      #ccec88 50%,
      #ff8964 100%
    );
  }
  .distance-cont {
    width: 100%;
  }
  .distance-cont-tips{
    width: 100%;
    position: relative;
    height: 1px;
    .el-tooltip__popper{
      transform-origin: center bottom;
      z-index: 2013;
      display: block;
      top:-32px;
      left: calc(80% - 16px);
      background: #ff8964;
      color: #fff;
      padding: 3px 7px;
      .popper__arrow{
        border-color: #ff8964;
        top: calc(50% - -6px);
        left: calc(50% - 4px);
        border-width: 4px;
        transform: rotate(45deg);
      }
    }
  }
  .cp-models .models {
    font-size: 14px;
    color: #26252e;
    padding-bottom: 20px;
    div{
      padding-bottom: 5px;
    }
  }
  .purchase-focus .el-tag {
    padding: 0 15px;
    margin: 0 10px 0 3px;
    border-radius: 14px;
    height: 29px;
    line-height: 28px;
  }
}
</style>

