<template>
  <div>
    <el-dialog
      class="invalid-clue-dialog"
      :visible.sync="dialogVisible"
      width="480px"
      title="线索无效"
      :before-close="handleClose"
    >
      <div class="dialog-center">
        <el-row :gutter="22">
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  无效原因
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-select
                    style="width:100%;"
                    v-model="filters.reasonInvalidId"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in reasonInvalidOptions"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  原因描述
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-input
                    v-model="filters.remark"
                    placeholder="请输入无效原因"
                    type="textarea"
                    maxlength="120"
                    :autosize="{ minRows: 4}"
                    show-word-limit
                  ></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" size="medium" class="w-90 plain-btn-style" @click="handleClose" round>取消</el-button>
        <el-button v-if="$route.query.total && $route.query.total > 1" type="primary" size="medium" class="" @click="save" round>保存并进入下一条</el-button>
        <el-button v-else type="primary" size="medium" class="w-90" @click="save" round>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Http from '@/apis/work'
export default {
  data() {
    return {
      dialogVisible: true,
      reasonInvalidOptions: [],
      filters: {
        id: this.$route.query.id
      }
    };
  },
  created(){
    this.getClueInvalidReasonList();
  },
  methods: {
    //弹窗 关闭
    handleClose() {
      this.dialogVisible = false;
      this.$emit("invalidClueCloseFn");
    },
    save() {
      let params = this.filters;
      if (!params.reasonInvalidId) {
          this.$message.error("请选择无效原因");
          return;
      }
      if (!params.remark) {
          this.$message.error("请填写原因描述");
          return;
      }
      console.log(params)
      Http.invalidApply(params)
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            console.log(res)
            if(false){
              // 如线索需要无效审核则进入上级的无效审核列表
            }else{
              if(this.$route.query.back){
                if(this.$route.query.total && this.$route.query.total > 0){
                  this.$emit("invalidClueCloseFn", 'next');
                }else{
                  this.$emit("invalidClueCloseFn");
                }
              }else if(true){
                //回线索详情
                this.$router.push({'path':'/business/clue/detail', query: {'id': this.$route.query.id}});
              }
              
            }
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });

    },
    getClueInvalidReasonList(){
      this.$fetch.common.clueInvalidReasonList({})
        .then(res => {
          this.$handleResponse(res, res => {
            this.reasonInvalidOptions = res;
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
  },
  
};
</script>

<style lang="scss" scoped>
.red {
  color: #ea5a54;
}
.invalid-clue-dialog {
  color: #444444;
  .grid-content-left {
    text-align: right;
    margin-right: 6px;
    line-height: 40px;
    font-size: 13px;
  }
}
.grid-content >>> .el-textarea .el-input__count {
    bottom: 4px;
    right: 8px;
}
</style>