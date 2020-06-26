<template>
  <div class="step-title-component step__order por">
    <el-row>
      <el-col :span="12">
        <span class="step_left">{{step.title}}</span>
        <span :class="colorStyle">{{step.content}}</span>
      </el-col>
      <el-col :span="12">
        <slot></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      default(){
        return {
          title: '第一步',
          content: '海报内容'
        }
      }
    },
    colorStyle: {
      type: String,
      default: ''
    }
  },
  data(){
    return{}
  }
}
</script>

<style lang="scss" scoped>
.step__order{
  height: 36px;
  line-height: 36px;
  background: #edf3f9;
  font-size: 15px;
  color: #3d7eff;
  padding-left: 17px;
  font-weight: 700;
  &:before {
    content: '';
    width: 4px;
    height: 36px;
    border-left: 4px solid #3d7eff;
    position: absolute;
    left: 0;
  }
  .step_left{
    margin-right: 22px;
  }
  .red_style {
    color: #ea5a54;
    font-weight: 100;
  }
}
</style>

