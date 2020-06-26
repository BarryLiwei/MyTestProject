<template>
  <div class="follow-record-page follow-record">
    <div v-if="type == 'customerFollow'">
      <el-tabs class="todo-tabs" :class="'cook' + currentTodo" v-model="currentTodo" type="card" @tab-click="handleTodoTabs">
        <el-tab-pane
          v-for="(tab, index) in todoTabs"
          :key="tab._id"
          :name="tab._id"
          >
          <div slot="label" :class="{'current': currentTodo == index}">
            <div class="tab-label-style">
              <p>{{tab.areaName}}</p>
            </div>
            
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="lt-title">跟进记录
      <router-link v-if="type == 'cluesDeal'" tag="a" class="to-view" target="_blank" :to="{path: '/business/clue/detail', query: {'id': this.$route.query.id}}">查看全部</router-link>
      <router-link v-if="type == 'customerFollow'" tag="a" class="to-view" target="_blank" :to="{path: '/business/potential/detail', query: {'id': this.$route.query.id}}">查看全部</router-link>
    </div>
    <div class="follow-record-search" v-show="currentTodo=='0'">
      <el-select v-model="search" placeholder="按事件标签筛选" style="width: 100%" size="mini" @change="getFollowList('init')" clearable>
        <el-option
          v-for="item in followAction"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <div class="follow-record-list">
      <div v-if="false">
        <el-steps direction="vertical" :active="-1" class="follow-record-item">
          <el-step v-for="(item, index) in recordList" :key="index">
            <div slot="icon">
              <i class="record-item-icon"></i>
            </div>
            <div slot="title">{{item.followData}}</div>
            <div slot="description" class="record-item-des">
              <!-- "followObject": 1,  //跟进对象，1线索跟进，2潜客跟进 -->
              <div class="">
                <!-- <el-tag
                  style="margin-right: 10px;"
                  v-for="(iitem, iindex) in item.tags"
                  :key="iindex"
                  type="warning"
                  size="small"
                >{{iitem}}</el-tag> -->
                

                <!-- grade 评分 -->
                <el-tag v-if="item.grade" >{{item.grade}}分</el-tag>
                <!-- 跟进动作分 -->
                <!-- <el-tag v-if="item.actionTitle">{{item.actionTitle}}</el-tag> -->

                <!-- level 级别 -->
                <el-tag v-if="item.level">{{item.level}}</el-tag>

                <!-- followType 跟进类型，1电话跟进，2微信跟进 -->
                <el-tag v-if="item.followTypeTitle">{{item.followTypeTitle}}</el-tag>

                <!-- followResult 跟进结果, 1继续跟进，2下发邀约 -->
                <el-tag v-if="item.followResultTitle">{{item.followResultTitle}}</el-tag>
                
                <!-- action 跟进动作，1普通跟进，2建档，3邀约，4档案回收，5战败，6共享 -->
                <el-tag v-if="item.actionTitle">{{item.actionTitle}}</el-tag>

                <!-- "distributionRule": "轮流分配", //分配规则描述 -->
                <!-- <el-tag>{{item.distributionRule}}</el-tag> -->
                
                <!-- <div v-if="item.followObject == 1 && item.action == 1">
                  <div>{{item.actionTitle}}【{{item.distributionRule}}】给DCC：</div>
                  <div>{{item.dccName}} {{item.dccTel}}</div>
                </div>
                <div v-if="item.followObject == 1 && item.action == 2">
                  <div>经手给DCC：{{item.dccName}} {{item.dccTel}}</div>
                </div>
                <div v-if="item.followObject == 1 && item.action == 3">
                  通过
                </div> -->
                
              </div>

              <!-- 线索下发 -->
              <div v-if="item.followObject == 1 && item.action == 1">
                <div>
                  <div>{{item.actionTitle}}【{{item.distributionRule}}】给DCC：</div>
                  <div>{{item.dccName}} {{item.dccTel}}</div>
                </div>
                <div class="record-item-cont">
                  <div class="record-item-title">基本信息</div>
                  <div>归属门店：{{item.areaName}}</div>
                  <div>意向车型：{{item.modelName}}</div>
                  <div>客户来源：{{item.areaName}}</div>
                  <div class="record-item-title">线索增强</div>
                  <div>线索评分：{{item.areaName}}</div>
                  <div>距 离：{{item.areaName}}</div>
                  <div>竞争车型：{{item.areaName}}</div>
                  <div>购车关注：{{item.areaName}}</div>
                </div>
              </div>
              <!-- 稍后联系 -->
              <div v-if="item.followObject == 1 && item.action == 2">
                <div>
                  <div>经手给DCC：{{item.dccName}} {{item.dccTel}}</div>
                </div>
                <div class="record-item-cont">
                  <div>稍后联系时间：{{item.nextFollowData}}</div>
                  <div>备注：{{item.remark}}</div>
                </div>
              </div>
              <!-- 线索无效 -->
              <div v-if="item.followObject == 1 && item.action == 3">
                <div>
                  通过
                </div>
                <div class="record-item-cont">
                  <div>审批人：{{item.dccName}} {{item.dccTel}}</div>
                </div>
              </div>
              <!-- 组长审核 -->
              <div v-if="item.followObject == 1 && item.action == 4">
                <div>
                  无效待审核
                </div>
                <div class="record-item-cont">
                  <div>无效原因：{{item.dccName}}</div>
                  <div>原因描述：{{item.dccName}}</div>
                </div>
              </div>

              <!-- 潜客跟进 - 电话跟进 -->
              <div v-if="item.followObject == 2 && item.followType == 1">
                <div>
                  <div>经手给DCC：{{item.dccName}} {{item.dccTel}}</div>
                </div>
                <div class="record-item-cont">
                  <div>邀约门店：{{item.nextFollowData}}</div>
                  <div>到店时间：{{item.remark}}</div>
                  <div>客户描述：{{item.remark}}</div>
                </div>
                
              </div>


              <div class="record-item-cont" v-if="false">
                <!-- 线索无效 -->
                <div v-if="item.followObject == 1 && item.action == 3">
                  <div>审批人：{{item.dccName}} {{item.dccTel}}</div>
                </div>
                <!-- 线索转移 -->
                <div v-if="item.followObject == 1 && item.action == 4">
                  <div>DCC：{{item.dccName}} {{item.dccTel}}</div>
                  <div>移交门店：{{item.transferAreaName}}</div>
                  <div>移交车型：{{item.transferModelName}}</div>
                  <div>转移原因：{{item.remark}}</div>
                </div>

                <!-- 潜客跟进 - 电话跟进 -->
                <div v-if="item.followObject == 2 && item.followType == 1">
                  <div>DCC：{{item.dccName}} {{item.dccTel}}</div>
                  <div>下次跟进：{{item.nextFollowData}}</div>
                  <div>客户描述：{{item.remark}}</div>
                </div>
                <!-- 下次邀约 -->
                <div v-if="item.followObject == 2 && item.action == 3">
                  <div>DCC：{{item.dccName}} {{item.dccTel}}</div>
                  <div>到店时间：{{item.inviteVisitDate}}</div>
                  <div>邀约门店：{{item.inviteAreaName}}</div>
                </div>

                <div class="follow-icon-audio" v-if="item.soundRecordFile">
                  <img :src="require('@/assets/images/icons/icon-audio.png')" alt="">
                </div>



              </div>
            </div>
          </el-step>
        </el-steps>
      </div>
      <follow-record v-show="currentTodo=='0'" class="p-10" :record-list="recordList"></follow-record>
      <area-follow-record v-show="currentTodo!='0'" class="p-10" :list="areaRecordList"></area-follow-record>
    </div>
  </div>
</template>
<script>
import * as Http from '@/apis/work'
import TabsScrm from "@/components/TabsScrm";
import FollowRecord from '@/components/follow-record/FollowRecord'; // dcc档案
import AreaFollowRecord from '@/pages/business/potential/component/AreaFollowRecord'; // 门店档案
export default {
  components: { TabsScrm, FollowRecord,AreaFollowRecord},
  props: ["type", "areaArchive", "followFormData"],
  data() {
    return {
      currentTodo: '0',
      todoTabs: [],
      search: "", //跟进记录搜索
      recordList: [],
      recordPage: {
          totalCount: 0,
          page: 1,
          pageSize: 10,
          totalPage: 1
      },
      recordDom: null,
      followAction: [],  // 事件标签列表
      areaRecordList:[],  // 门店跟进记录
    };
  },
  
  created(){
    this.followAction = this.followFormData && this.followFormData.followAction;
    if(this.type == 'cluesDeal'){

    }else{
      this.todoTabs = [
        {
          "_id": "0",  //id
          "intentionId": this.$route.query.id,
          "areaName": "DCC档案"  //门店名称
        }
      ];
      if(this.areaArchive){
        this.areaArchive.forEach((element,index) => {
          element['_id'] = (index + 1).toString();
        });
        
        this.todoTabs = this.todoTabs.concat(this.areaArchive);
      }else{
        
      }
    }
    if(this.$route.query.id){
      this.getFollowList('init');
    }
    
  },
  mounted(){
    // 滚动条监听
    this.recordDom = document.querySelector('.follow-record-list');
    this.recordDom.addEventListener('scroll', this.onRecordDomScroll, true);
  },
  methods:{
    onRecordDomScroll() {
      let scrollTop = this.recordDom.scrollTop;
      let clientHeight = this.recordDom.clientHeight;
      let scrollHeight = this.recordDom.scrollHeight;

      if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
          // 请求加载更多
          if (this.recordPage.page >= this.recordPage.totalPage) {
              return;
          }
          if(this.recordPage.pageSize == 3){
            this.recordPage.page = 1;
          }else{
            this.recordPage.page++;
          }
          this.recordPage.pageSize = 10;
          this.getFollowList();
      }
    },
    handleTodoTabs(tab, event) {
      this.currentTodo = tab.index;
      if(this.currentTodo == '0'){
        this.getFollowList('init');
      }else if(this.currentTodo != '0') {
        let id = this.todoTabs[this.currentTodo] && this.todoTabs[this.currentTodo].id;
        this.getAreaFollowList(id);
      }
    },
    handleClick(val){
      console.log(val.name, val.index)
    },
    getFollowList(reset){
      if(reset == 'init') {
          this.recordList = [];
          this.recordPage.page = 1;
          this.recordPage.pageSize = 3;
      }
      const { page, pageSize } = this.recordPage
      let params ={
          typeId: this.type == 'cluesDeal' ? 2 : 1,  //类型：1潜客，2线索
          id: this.type == 'cluesDeal' ? this.$route.query.id : this.todoTabs[this.currentTodo].intentionId, //潜客ID 或者 线索ID
          page,
          pageSize,
          followAction: this.search, //事件标签
      }
      this.$fetch.common.followListByType(params)
        .then(res => {
          // this.$store.commit("closeLoading");
          this.$handleResponse(res, res => {
            // 数据处理
            if (res) {
                const { list, page} = res;
                if(this.recordPage.page == 1){
                  this.recordList = [];
                }
                if (list.length > 0) {
                    this.recordList = [...this.recordList, ...list];
                }
                this.recordPage.totalCount = page.totalCount;
                this.recordPage.totalPage = page.totalPage;
            }

        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    getAreaFollowList(id){
      this.$fetch.business.archiveAreaDetail({'id': id}).then((res)=>{
          this.$handleResponse(res, data=>{
              this.areaRecordList = data.follows?data.follows:[];
          },true);
      }).catch(()=>{
          this.$store.commit('closeLoading');
      })
    },
  },
  beforeDestroy() {
    this.recordDom.removeEventListener('scroll', this.onRecordDomScroll, true);
  },
};
</script>
<style lang="scss" scoped>
@import "src/assets/scss/mixin.scss"; 
.p-10{
  padding: 10px;
}
.red {
  color: #ea5a54;
}
.follow-record-page {
  overflow: hidden;
  height: 100%;
  padding-bottom: 15px;
  .grid-content-left {
    text-align: right;
    margin-right: 6px;
    line-height: 40px;
    font-size: 13px;
    color: #454545;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.follow-record >>> .el-input--suffix .el-input__inner {
  border-radius: 36px;
}
.follow-record-search {
  padding: 10px 8px;
}
.follow-record-list {
  // padding: 15px;
  position: relative;
  overflow: auto;
  height: calc(100% - 100px);
  &::-webkit-scrollbar {
      width: 6px;
      border-radius: 25px;
      opacity: 0;
      -webkit-transition: opacity .12s ease-out;
      transition: opacity .12s ease-out;
  }

  &::-webkit-scrollbar-thumb {
      border-radius: 25px;
      background-color: rgba(144, 147, 153, 0.3);
      -webkit-transition: background-color .3s;
      transition: background-color .3s;
  }
}
.follow-record-list >>> .el-step__head {
  width: 13px;
}
.follow-record-list >>> .el-step__line {
  left: 5px;
  width: 0px;
  background-color: #fff;
  // color: #dce1e7;
  border: 1px dashed #dce1e7;
  margin-top: 5px;
}
.follow-record-list >>> .el-step__icon {
  width: 13px;
  height: 13px;
  border: 0;
  margin-top: 5px;
}
.follow-record-list >>> .el-step__title {
  font-weight: 400;
}
.follow-record-btn{
  position: absolute;
  top: 10px;
  right: 3px;
}
.record-item-des{
  color: #838b96;
}
.record-item-cont {
  margin-top: 10px;
  padding: 10px;
  border-left: 3px solid #3d7eff80;
  background-color: #f2f8fc;
  margin-bottom: 15px;
  .follow-icon-audio{
    position: absolute;
    right: 10px;
    bottom: 15px;
  }
  .record-item-title{
    color: #444444;
  }
}
.record-item-icon {
  display: inline-block;
  width: 13px;
  height: 13px;
  background-color: #3d7eff;
  border-radius: 50%;
}

.follow-record-list >>> .is-wait {
  color: #444444;
  padding-right: 5px;
   .record-item-cont{
    color: #838b96;
  }
}

.todo-tabs{
  /deep/ .el-tabs__header{
    margin-bottom: 0;
  }
  /deep/ .el-tabs__nav{
    height: 40px;
    border-top: 0!important;
    border-left: 0!important;
  }
  /deep/ .el-tabs__nav-prev{
    width: 20px;
    background: #ecf5ff;
    .el-icon-arrow-left{
      padding-left: 5px;
    }
  }
  /deep/ .el-tabs__nav-next{
    width: 20px;
    background: #ecf5ff;
    .el-icon-arrow-right{
      padding-left: 5px;
    }
  }
  /deep/ .el-tabs__item {
      overflow: hidden;
      cursor: pointer;
      border-left: 0px;
      &.is-active {
          p {
              color: $baseBlue;
              font-size: 14px;
          }
          span {
              color: $baseBlue;
              font-size: 14px;
          }
          border-bottom: 1px solid #fff;
      }
      &:not(.is-active) {
          background-color: #3d7eff;
          p {
              color: #fff;
              font-size: 14px;
          }
          span {
              color: #fff;
              font-size: 14px;
          }

          &:nth-child(3) {
              opacity: 0.7;
          }
          &:nth-child(4) {
              opacity: 0.5;
          }
          &:nth-child(5) {
              opacity: 0.4;
          }
          &:nth-child(6) {
              opacity: 0.3;
          }
      }
  }

  &.cook2 >>> {
    .el-tabs__item:nth-child(2) {
        opacity: 0.7;
    }
  }

  &.cook3 >>> {
      .el-tabs__item:nth-child(2) {
          opacity: 0.7;
      }
      .el-tabs__item:nth-child(3) {
          opacity: 0.5;
      }
  }
  &.cook4 >>> {
      .el-tabs__item:nth-child(2) {
          opacity: 0.7;
      }
      .el-tabs__item:nth-child(3) {
          opacity: 0.5;
      }
      .el-tabs__item:nth-child(4) {
          opacity: 0.4;
      }
  }
  &.cook5 >>> {
      .el-tabs__item:nth-child(2) {
          opacity: 0.7;
      }
      .el-tabs__item:nth-child(3) {
          opacity: 0.5;
      }
      .el-tabs__item:nth-child(4) {
          opacity: 0.4;
      }
      .el-tabs__item:nth-child(5) {
          opacity: 0.3;
      }
  }
  
}

.lt-title {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #212427;
  border-bottom: 1px solid #eaebf0;
  padding-left: 20px;
  display: flex;
  justify-content: space-between;
  .to-view{
    cursor: pointer;
    font-size: 14px;
    color: #3d7eff;
    padding-right: 15px;
  }
}
.mr-10{
  margin-right: 10px;
}
</style>

