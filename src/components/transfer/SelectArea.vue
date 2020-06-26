<template>
  <el-dialog
    class="transfer-dialog"
    :title="title"
    :visible.sync="dialogShow"
    width="750px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    append-to-body
  >
    <el-transfer
      class="transfer-class"
      filterable
      filter-placeholder="4S店名称"
      v-model="relationAreas"
      :data="pRelationAreas"
      :titles="['选择：', '已选：']"
      @left-check-change="leftCheckChange"
      @change="handleChange"
      :props="transProps"
    ></el-transfer>

    <span slot="footer" class="dialog-footer">
      <el-button class="w-90" type="primary" @click="onSubmit('menuInfo')" size="small" round>确 定</el-button>
      <el-button class="w-90" @click="handleClose" size="small" round>取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 选择的区域
export default {
  props: {
    selectedOptions: Array, 
    unSelectOptions: Array,
    transProps: {
      default: () => ({
        key: 'area_id',
        label: 'name'
      })
    },
    title: {
      type: String,
      default: "选择4s店"
    }
  },
  data() {
    return {
      dialogShow: true,
      pRelationAreas: this.unSelectOptions, // 未选
      relationAreas: this.obj2Array(this.selectedOptions, this.transProps.key), // 已选
    };
  },
  methods: {
    onSubmit(formName) {
      this.$emit('areas-change',this.handleSelectData(this.relationAreas, this.pRelationAreas));
      this.handleClose();
    },
    handleClose() {
      this.$emit("cancel");
    },
    leftCheckChange() {},
    handleChange(value, direction, movedKeys) {},
    /* 根据id值返回完整的数据 */
    handleSelectData(arrId, obj) {
      let key = this.transProps.key
      let data = [];
      if(arrId && arrId.length){
        arrId.forEach(elementId => {
          obj.forEach(element => {
            if(elementId == element[key]){
              data.push(element);
            }
          });
        })
      }
      return data;
    },
    //* 提取对象中的某一项，例如id */
    obj2Array(obj, ele) {
      let array = [];
      if(obj && obj.length){
        obj.forEach(element => {
          if(element[ele]){
            array.push(element[ele])
          }
        });
      }
      return array;
    }
  }
};
</script>

<style lang="scss" scoped>
.transfer-dialog /deep/.transfer-class .el-transfer__button {
    display: block;
    margin: 0 auto 10px;
    padding: 10px;
    border-radius: 50%;
    color: #FFF;
    background-color: #409EFF;
    font-size: 0;
}

.transfer-dialog /deep/.transfer-class .el-transfer__button.is-disabled, 
.transfer-dialog /deep/.transfer-class .el-transfer__button.is-disabled:hover{
    border: 1px solid #DCDFE6;
    background-color: #F5F7FA;
    color: #C0C4CC;
}

.transfer-dialog /deep/.transfer-class .el-transfer-panel{
  width: 300px;
}
.transfer-dialog /deep/.transfer-class input.el-input__inner {
  width: 100%!important;
}

.transfer-dialog /deep/.transfer-class .el-transfer-panel__body{
  height: 286px;
}

.transfer-dialog .el-dialog__footer{
  padding:5px 20px 35px;
}

</style>





