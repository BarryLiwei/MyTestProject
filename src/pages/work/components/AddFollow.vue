<template>
  <div class="add-follow-page">
    <el-row :gutter="22" class="customer-form">
      <el-col :span="24" class="m-b-10">
        <el-row class="rowmbottom10">
          <el-col class="width-75">
            <div class="grid-content-left">
              客户级别
              <span class="red">*</span>
            </div>
          </el-col>
          <el-col class="width-right-cont">
            <div class="grid-content">
              <el-radio-group
                class="radio-button-level"
                :class="{'radio-button-level-follow': type == 'customerFollow'}"
                :gutter="24"
                style="width:100%;"
                v-model="followFilters.level"
                size="mini"
                @change="getNextFollowDate()"
              >
                <el-radio-button :label="item" v-for="item in levelOptions" :key="item"></el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <div v-if="followFilters.level == 'F'">
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                战败类型
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-select
                    style="width:100%;"
                    v-model="followFilters.defeatTypeId"
                    filterable
                    placeholder="请选择"
                    size="mini"
                    @change="defeatReasonList()"
                >
                    <el-option
                        v-for="item in defeatTypeOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                战败原因
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-select
                    style="width:100%;"
                    v-model="followFilters.defeatReasonId"
                    filterable
                    placeholder="请选择"
                    size="mini"
                >
                    <el-option
                        v-for="item in defeatReasonOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </div>
      <div v-if="followFilters.level != 'O' && followFilters.level != 'F'">
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                跟进类型
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-radio-group
                  class="radio-button-level"
                  :gutter="24"
                  style="width:100%;"
                  v-model="followFilters.followType"
                  size="mini"
                >
                  <el-radio-button
                      :label="item.id"
                      v-for="item in followTypeOptions"
                      :key="item.id"
                  >{{item.title}}</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                跟进结果
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-radio-group
                  class="radio-button-level"
                  :gutter="24"
                  style="width:100%;"
                  v-model="followFilters.followResult"
                  size="mini"
                  @change="getNextFollowDate()"
                >
                  <el-radio-button
                      :label="item.id"
                      v-for="item in followResultOptions"
                      :key="item.id"
                  >{{item.title}}</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-if="followFilters.followResult == 1" :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                下次跟进
                <span class="red" v-if="followFilters.level != 'O' && followFilters.level != 'F'">*</span>
                <span v-else class="mini-width5"></span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-date-picker
                  v-model="nextFollowDate"
                  type="date"
                  placeholder="选择日期"
                  style="width:100%"
                  class="my-date-picker"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  size="mini"
                ></el-date-picker>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-if="followFilters.followResult == 2" :span="24" class="m-b-10 store-and-car" :class="{'store-and-car-oth': index!=0}" v-for="(items, index) in inviteInfo" :key="index">
          <div class="close-icon" @click="clearCar(index)" v-if="index!=0">
            <img class="" :src="require('@/assets/images/work/close-black.png')">
          </div>
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                邀约门店
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-select
                    style="width:100%;"
                    v-model="items.areaId"
                    filterable
                    placeholder="请选择"
                    size="mini"
                    @change="handleAreaIdHasSelect()"
                >
                    <el-option
                        v-for="item in competeModels"
                        :key="item.areaId"
                        :label="item.areaName"
                        :value="item.areaId"
                        :disabled="areaIdHasSelect.indexOf(item.areaId) > -1"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowmbottom10" style="margin-top: 10px;">
            <el-col class="width-75">
              <div class="grid-content-left">
                到店时间
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-date-picker
                  v-model="items.date"
                  type="datetime"
                  placeholder="选择到店时间"
                  style="width:100%"
                  class="my-date-picker"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerOptions1"
                  size="mini"
                ></el-date-picker>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10 store-and-car-btn" v-if="followFilters.followResult == 2 && competeModels && competeModels.length > 1">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left" style="width: 88.5px;height: 1px;"></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <div style="">
                  <el-button
                    :gutter="24"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addInvite"
                  >新增邀约计划</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-if="followFilters.followResult == 2" :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                下次跟进
                <span class="mini-width5"></span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-date-picker
                  v-model="nextFollowDate2"
                  type="date"
                  placeholder="选择日期"
                  style="width:100%"
                  class="my-date-picker"
                  value-format="yyyy-MM-dd"
                  size="mini"
                ></el-date-picker>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </div>
      <el-col :span="24" class="m-b-10">
        <el-row class="rowmbottom10">
          <el-col class="width-75">
            <div class="grid-content-left">
              {{remarkText}}
              <span class="red">*</span>
            </div>
          </el-col>
          <el-col class="width-right-cont">
            <div>
              <el-input
                style="float:right;"
                v-model="followFilters.remark"
                placeholder="请输入"
                type="textarea"
                maxlength="120"
                :autosize="{ minRows: 3}"
              ></el-input>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as Http from '@/apis/work'
import moment from 'moment'
export default {
  props: ["type", "followFormData","followArchiveData", "intentionInfo"],
  data() {
    return {
      followTypeOptions:[
        {
          id: 1, title: "电话跟进"
        },
        {
          id: 2, title: "微信跟进"
        }
      ],
      followResultOptions:[
        {
          id: 1, title: "继续跟进"
        },
        {
          id: 2, title: "下发邀约"
        }
      ],
      options: [
        {
          id: "1",
          title: "是"
        },
        {
          id: "0",
          title: "否"
        }
      ],
      levelOptions: ["H", "A", "B", "C"],// 客户级别
      defeatTypeOptions:[],  //战败类型
      defeatReasonOptions:[],  //战败原因
      followFilters: {
        level: 'H',
        followType: 1,
        followResult: 1,
        defeatReasonId: ''
      }, // 添加跟进信息
      pickerOptions: {},// 最大时间
      nextFollowDate: '',
      nextFollowDate2: '',
      inviteInfo:[  //邀约计划
        {
          areaId: '',
          date: '' //到店时间
        }
      ],
      remarkText: '客户描述', // 潜客跟进显示“跟进描述”
      competeModels: [],
      areaIdHasSelect: [],  //存储已选择的门店id
      minTime:moment(new Date()).subtract(1, 'day'),
    };
  },
  created(){
    
    if(this.type == 'customerFollow'){
      this.remarkText = '跟进描述';
      this.levelOptions = ["H", "A", "B", "C", "O", "F"];
    }
    if(this.followArchiveData && this.followArchiveData.followFormData){
      let formData = this.followArchiveData.followFormData;
      this.followTypeOptions = formData.followType;
      this.followResultOptions = formData.followResult;
      this.levelOptions = formData.level;
      this.nextFollowDate = formData.defaultNextFollowDate;
    }
    if(this.followArchiveData && this.followArchiveData.archiveInfo){
      this.competeModels = this.intentionInfo;  //邀约门店列表
      let archiveInfo = this.followArchiveData.archiveInfo;
      this.followFilters = {
        level: archiveInfo.level || 'H',
        followType: archiveInfo.followType || 1,
        followResult: archiveInfo.followResult ||  1,
        defeatReasonId: archiveInfo.defeatReasonId || ''
      }
    }
    this.getNextFollowDate();
    if(this.type == 'cluesDeal' && this.intentionInfo){
      this.competeModels = this.intentionInfo;  //邀约门店列表
    }
    this.handleAreaIdHasSelect();
    // this.defeatReasonTypeList();
    this.getInviteMaxTime();
  },
  methods: {
    addInvite() {
      this.inviteInfo.push({
          areaId: '',
          date: ''
        });
    },
    clearCar(index){
      this.inviteInfo.splice(index, 1)
      this.handleAreaIdHasSelect();
    },
    handleAreaIdHasSelect(){
      this.areaIdHasSelect = [];
      this.inviteInfo.forEach((element)=>{
        this.areaIdHasSelect.push(element.areaId);
      })
    },
    getNextFollowDate(){
      let that = this;
        if(this.followFilters.followResult == 1){
          if(this.followFilters.level!='O' && this.followFilters.level!='F'){
            Http.nextFollowDate({'level': this.followFilters.level})
            .then(res => {
                this.$store.commit("closeLoading");
                this.$handleResponse(res, res => {
                    this.pickerOptions = {
                      disabledDate(time) {
                        return time < new Date(that.minTime).getTime() || time > new Date(res.date).getTime();
                      }
                    }
                    if(this.followArchiveData && this.followArchiveData.followFormData && this.followArchiveData.followFormData.defaultNextFollowDate){
                      //使用defaultNextFollowDate
                      this.nextFollowDate = this.followArchiveData.followFormData.defaultNextFollowDate;
                    }else{
                      this.nextFollowDate = res.date;
                    }
                },true);
            })
            .catch(err => {
                this.$store.commit("closeLoading");
            });
          }else{
            // this.nextFollowDate = '';
            // this.pickerOptions = {
            //   disabledDate(time) {
            //     return false;
            //   }
            // }
          }
            
        }

        if(this.followFilters.level=='F' && this.defeatTypeOptions.length == 0){
          console.log('获取战败类型')
          this.defeatReasonTypeList();
        }
    },
    getInviteMaxTime(){
      let that = this;
      this.$fetch.callCenter.optionalFunction({name: 'inviteMaxTime'}).then((res)=>{
        this.$store.commit("closeLoading");
            this.$handleResponse(res, res => {
              this.pickerOptions1 = {
                disabledDate(time) {
                  if (res.inviteMaxTime) {
                    return time < new Date(that.minTime).getTime() || time > new Date(moment(new Date()).add(res.inviteMaxTime, 'day')).getTime();
                  }
                  return false;
                }
              }
          },true);
        })
        .catch(err => {
            this.$store.commit("closeLoading");
        });
    },
    defeatReasonTypeList(){
      this.$fetch.common.defeatReasonTypeList()
        .then(res => {
            this.$handleResponse(res, res => {
              this.defeatTypeOptions = res;
            },true);
        })
        .catch(err => {
            this.$store.commit("closeLoading");
        });
    },
    defeatReasonList(){
      this.defeatReasonOptions = [];
      this.followFilters.defeatReasonId = '';
      let params = {
        reasonType: this.followFilters.defeatTypeId
      }
      this.$fetch.common.defeatReasonList(params)
        .then(res => {
            this.$handleResponse(res, res => {
              this.defeatReasonOptions = res;
            },true);
        })
        .catch(err => {
            this.$store.commit("closeLoading");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.mini-width5, .red{
    width: 5px;
    // height: 1px;
    display: inline-block;
}
.red {
  color: #ea5a54;
}
.add-follow-page {
  padding: 8px 15px 15px 8px;
  .rowmbottom10{
    display: flex;
  }
  .width-75 {
    width: 75px;
  }
  .width-right-cont{
    flex: 1;
  }
  .store-and-car.store-and-car-oth{
    border-top: 1px solid #eaebf0;
    position: relative;
    padding-top: 10px;
    .close-icon{
      position: absolute;
      right: -4px;
      top: -1px;
    }
  }
  .store-and-car-btn{
    border-top: 1px solid #eaebf0;
    padding-top: 10px;
  }
  .grid-content-left {
    text-align: right;
    // margin-right: 6px;
    line-height: 32px;
    font-size: 13px;
    color: #454545;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.add-follow-page >>> .el-radio-button__inner{
  // padding: 10px 12px;
}
.radio-button-level-follow{
  display: flex;
  .el-radio-button{
    flex: 1;
  }
  /deep/ .el-radio-button__inner{
    padding: 10px 0px;
    width: 100%;
  }
}
</style>

