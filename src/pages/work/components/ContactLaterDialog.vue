<template>
  <div>
    <el-dialog
      class="contact-later-dialog"
      :visible.sync="dialogVisible"
      width="480px"
      title="稍后联系"
      :before-close="handleClose"
    >
      <div class="dialog-center">
        <el-row :gutter="22">
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  联系时间
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-date-picker
                      v-model="filters.followDate"
                      type="datetime"
                      placeholder="选择下次跟进时间"
                      style="width:100%"
                      class="my-date-picker"
                      value-format="yyyy-MM-dd HH:mm"
                      format="yyyy-MM-dd HH:mm"
                      :default-time="defaultTime"
                      time-arrow-control
                      :picker-options="{
                        disabledDate: time => {
                          return time < new Date(this.minTime).getTime() || time > new Date(this.maxTime).getTime();
                        },
                        selectableRange: startTimeRange
                      }"
                  ></el-date-picker>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  备注
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-input
                    v-model="filters.remark"
                    placeholder="请输入"
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
import * as Http from "@/apis/work";
import moment from 'moment'
export default {
  data() {
    return {
      dialogVisible: true,
      filters: {
        id: this.$route.query.id
      },
      pickerOptions: {},
      maxTime: '',
      minTime:moment(new Date()).subtract(1, 'day'),
      defaultTime: new Date().getHours() + ':' + new Date().getMinutes() + ':00',
      // startTimeRange: '00:00:00 - 23:59:59'
    };
  },
  created(){
    this.getLaterFollowMaxTime();
  },
  methods: {
    //弹窗 关闭
    handleClose() {
      this.dialogVisible = false;
      this.$emit("contactLaterCloseFn");
    },
    save() {
      let params = this.filters;
      if (!params.followDate) {
          this.$message.error("请选择联系时间");
          return;
      }
      if (!params.remark) {
          this.$message.error("请填写备注");
          return;
      }
      if (params.followDate > this.maxTime) {
          this.$message.error("稍后联系时间不得超过" + this.maxTime);
          return;
      }
      console.log(params)
      Http.clueLater(params)
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            console.log(res)
            if(this.$route.query.back){
              if(this.$route.query.total && this.$route.query.total > 0){
                this.$emit("contactLaterCloseFn", 'next');
              }else{
                this.$emit("contactLaterCloseFn");
              }
            }else{
              //回线索详情
                this.$router.push({'path':'/business/clue/detail', query: {'id': this.$route.query.id}});
            }
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    getLaterFollowMaxTime(){
      this.$fetch.common.laterFollowMaxTime({})
        .then(res => {
          this.$handleResponse(res, res => {
            this.maxTime = res.laterMaxTime;
            // 线索的稍后最大可稍后联系时间
            // this.pickerOptions = {
            //   disabledDate(time) {
            //     return time > new Date(res).getTime();
            //   },
            //   selectableRange: this.startTimeRange //'00:00:00 - 23:59:59'
            // }
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    }
  },
  computed: {
      startTimeRange: function() {
          let newValue = this.filters.followDate;
          if(newValue){
            let nowDate = this.maxTime;
            let dt = nowDate.split(" ");
            let et = '';

            if(newValue.split(" ")[0] == dt[0]){
            // 选择的时间日期为限定的最大日期，时分秒限制et
              et = dt[1] + ':00';
            }else{
            // 其他可选日期
              et = '23:59:59';
            }
            console.log('00:00:00 - ', et)
            //例如：如果最大选择时间为当天23:51:00 则选择时间范围为： 00:00:00 - 23:51:00
            //否则为：00:00:00- 23:59:59
            return '00:00:00 - ' + et;
          } 
      }
  },
  // watch: {
  //   'filters.followDate':{
  //     handler(newValue, oldValue) {
  //       if(newValue){
  //           console.log(newValue, this.maxTime)
  //           let nowDate = this.maxTime;
  //           let dt = nowDate.split(" ");
  //           let et = '';

  //           if(newValue.split(" ")[0] == dt[0]){
  //           // 是今天,选择 的时间开始为此刻的时分秒
  //             et = dt[1] + ':00';
  //           }else{
  //           // 明天及以后从0时开始
  //             et = '23:59:59';
  //           }
  //           this.startTimeRange =  '00:00:00 - ' + et; 
  //           console.log(this.startTimeRange)
  //           this.$forceUpdate();
  //           //例如：如果今天此刻时间为10:41:40 则选择时间范围为： 10:41:40 - 23:59:59  
  //           //否则为：00:00:00- 23:59:59
  //         } 
  //     }
  //   } 
  // },
};
</script>

<style lang="scss" scoped>
.red {
  color: #ea5a54;
}
.contact-later-dialog {
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