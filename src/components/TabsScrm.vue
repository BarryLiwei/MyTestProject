<template>
  <div class="tabs__scrm">
    <el-tabs v-model="currentTab" type="card" @tab-click="handleClick">
      <el-tab-pane
        :key="item.name"
        v-for="item in tabs"
        :name="item.name">
          <!-- title-cls 为控制红点class -->
        <span slot="label" :class="item.dot ? 'title-cls' : ''">
          {{item.title}}
          <span v-if="item.count" class="tab-count" :style="{color: tabStyle.customColor}">({{item.count}}) </span>
          <span class="line" :class="{'bottom': tabStyle.line == 'bottom'}" :style="{height: tabStyle.height}"><slot name="customer" :item="item"></slot></span>
        </span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    tabs: { // 传入进来是数组， 对象属性 title: 显示title, name: 为 id之类
      type: Array,
      default: []
    },
    selectTabs:{ // 初始化的时候并非数组第一个值选中
      type:String,
      default:''
    },
    isSendOther: { // 是否发送到别的组件，有些组件点击需要右侧的弹窗同时关闭类似的需求
      type: Boolean,
      default: false
    },
    tabStyle: {  // tab 样式
      type: Object,
      default(){
        return {
          customColor: '',  // 是否自定义颜色
          height: '4px',  // 横条默认高度
          line: 'top' // 选中横条默认在上 top或bottom
        }
      }
    },
  },
  data(){
    return{
      currentTab: '0',
    }
  },
  mounted(){
    this.initTab()
  },
  methods: {
    handleClick(val){
      this.$emit('change', val.name, val.index); // 发送到父组件

      if(this.isSendOther){
        this.$eventHub.$emit("tab-change", val.name, val.index, this.tabs); // 事件广播给其它组件,到其它组件再取需要的值
      }
    },
    initTab(){ // 如果有延迟显示，可以手动在父元素触发
      this.currentTab = this.selectTabs || this.tabs[0] && this.tabs[0].name;
    }
  }
  
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/mixin.scss";
$height: 48px;
.title-cls {
  position: relative;
  ::after {
    content: 'new';
    z-index: 9999;
    color: #fff;
    line-height: 14px;
    display: inline-block;
    width: 28px;
    height: 14px;
    font-size: 12px;
    text-align: center;
    border-radius: 6px;
    background: #EA5A54;
    position: absolute;
    right: -25px;
    top: -6px;
  }
}

.tabs__scrm /deep/ .el-tabs--card>.el-tabs__header {
  height: $height;
  background: #fafcff;
}
.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item{
  // border: none;
  height: $height;
  line-height: $height;
  position: relative;
}
.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  // border-top: 4px solid $baseBlue;
  color: $baseBlue;
  height: $height;
  background-color: #fff;
  // border-left: 1px solid #e4e7ed;
  // border-right: 1px solid #e4e7ed;
  border-bottom: 0;

  span.line {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    background-color: $baseBlue;
    z-index: 1;

    &.bottom {
      bottom: 0;
    }
  }
}
.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item:first-child.is-active {
  border-left: none;
}

.tabs__scrm  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border: 0px solid #e4e7ed;
}
.tabs__scrm .tab-count{
  color: #f56c6c;
}

.tabs__scrm /deep/ .el-tabs__item:focus,
.tabs__scrm /deep/ .el-tabs__item.is-active.is-focus{
  -webkit-box-shadow: none!important;
  box-shadow: none!important;
}

</style> 