<template>
  <div class="open-task">
    <!-- <div class="lt-title">开口任务</div> -->
    <div class="lt-content">
      <el-checkbox-group v-model="checkboxGroup" size="small">
        <el-checkbox-button :label="item.id" v-for="(item,index) in data" :key="index" :disabled="cacheCheckBox.indexOf(item.id) > -1">
          <i class="item-num">{{index+1}}</i>
          <span class="text">{{item.content}}</span>
          <span class="icon-border">
            <i class="el-icon-check"></i>
          </span>
        </el-checkbox-button>
      </el-checkbox-group>
      <!-- <div v-for="(item,index) in data" :key="index">
        <div class="item" :class="{'is_active': item.status == 1}">
          <i class="item-num">{{index + 1}}</i>
          <span class="text">{{item.content}}</span>
          <span class="icon-border">
            <i class="el-icon-check"></i>
          </span>
        </div>
        
      </div> -->
    </div>
  </div>
</template>
<script>
import * as Http from '@/apis/work'
export default {
  props: ["data"],
  data(){
    return{
      cacheCheckBox: [],
      checkboxGroup: [],  //存储已完成的任务id
    }
  },
  created(){
    this.checkboxGroup = [];
    console.log(this.data)
    this.data.forEach(element => {
      if(element.status == 1){
        this.checkboxGroup.push(element.id);
        this.cacheCheckBox.push(element.id);
      }
    });
  },
  methods: {
    saveOpenTask(){
      let contentId = this.checkboxGroup;
      if(!contentId || contentId.length == 0){
        return;
      }
      let params = {
        contentId: contentId,  //开口任务项id
      }
      
      Http.openTaskComplete(params)
      .then(res => {
        this.$handleResponse(res, res => {
          // 数据处理
          this.$message.success('保存成功');
          this.cacheCheckBox.push(contentId[0]);
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
  }
}
</script>
<style lang="scss" scoped>

.open-task .lt-content {
  max-height: 230px;
  padding: 10px 10px 0;
  .item,
  .el-checkbox-button >>> .el-checkbox-button__inner {
    background-color: #fbfcff;
    border-radius: 2px;
    border: solid 1px #dce1e7;
    padding: 5px 8px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    white-space: normal;
    .item-num {
      font-size: 14px;
      color: #212427;
      padding-right: 10px;
    }
    .text {
      flex: 1;
      text-align: left;
      line-height: 1.3;
      word-break: break-all;
    }
    .icon-border {
      border: 1px solid #eaebf0;
      border-radius: 100%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        opacity: 0;
        color: #dce1e7;
      }
    }
  }
  .item.is_active,
  .el-checkbox-button.is-checked >>> .el-checkbox-button__inner {
    background-color: #3d7eff;
    border: solid 1px #3d7eff;
    color: #fff;
    .item-num {
      color: #fff;
    }
    .icon-border {
      background-color: #66b1ff30;
      i {
        opacity: 1;
      }
    }
  }
  .item, .el-checkbox-button >>> .el-checkbox-button__inner {
    width: 100%;
  }
  .el-checkbox-button {
    margin-bottom: 10px;
    border-radius: 3px;
  }
  .el-checkbox-button,
  .el-checkbox-button__inner {
    display: block;
    background-color: #3d7eff;
    color: #fff;
    width: 100%;
  }
}
</style>

