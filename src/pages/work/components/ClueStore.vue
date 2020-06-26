<template>
  <div class="clue-store">
    <div class="lt-content">
      <div class="store-list">
        <div class="store-item" v-for="(item, index) in data" :key="index" :class="{'is-active': index == activeIdx}" @click="setActiveIdx(index)">
          <div class="distance-tips" v-if="item.extend.distance">{{item.extend.distance}}</div>
          <div class="item-top">
            <div class="top-left-title">{{item.areaName}}</div>
            <div class="top-left-time">{{item.createData}}</div>
          </div>
          <div class="item-bottom">
            <div class="item-center">{{item.modelName}}</div>
            <div class="item-record" v-if="item.extend.grade != 0 && item.extend.grade != 11"><span>{{item.extend.grade}}</span>分</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      activeIdx: 0,
    };
  },
  methods:{
    setActiveIdx(index){
      this.activeIdx = index;
      this.$emit('setExtendDataIdx', index);
    }
  }
};
</script>
<style lang="scss" scoped>
.clue-store .lt-content {
  padding: 8px 8px 0;
  font-size: 14px;
  max-height: 300px;
  .store-item{
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #3d7eff;
    color: #3d7eff;
    padding: 10px 10px 10px 15px;
    position: relative;
    margin-bottom: 8px;
    .distance-tips{
      font-size: 12px;
      padding: 0 2px;
      position: absolute;
      top: -1px;
      left: -1px;
      width: 22px;
      height: 22px;
      border-radius: 0 0 90px 0;
      color: #fff;
      background: #f56c6c;
    }
    &:nth-child(1) .distance-tips{
      background: #3bdaa4;
    }
    &:nth-child(2) .distance-tips{
      background: #e6a23c;
    }
    &:nth-child(3) .distance-tips{
      background: #f56c6c;
    }
    .tips{
      position: absolute;
      top: -1px;
      right: -1px;
      padding: 3px 7px;
      background-color: #3bdaa4;
      color: #fff;
      font-size: 14px;
      
    }
    .item-top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .top-left-title{
        font-size: 15px;
        flex: 1;
        padding-right: 10px;
      }
      .top-left-time{
        font-size: 14px;
        padding-right: 0px;
      }
    }
    .item-bottom{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 5px;
      .item-center{
        padding-right: 10px;
        font-size: 14px;
        flex: 1;
      }
      .item-record span{
        font-size: 18px
      }
    }
    
  }
  .store-item.is-active{
    background-color: #3d7eff;
    border: 1px solid #3d7eff;
    color: #fff;

  }
}
</style>

