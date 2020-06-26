<template>
    <div class="group-manage-todo-component">
        <div class="card-box">
            <div class="head-wrap">
                <span>待办事项</span>
            </div>
            <div class="todo-num" :class="'cook' + currentTodo">
                <div
                    v-for="(tab, index) in todoTabs"
                    :key="index"
                    class="piece"
                    :class="{'current': currentTodo == index}"
                    @click="handleTodoTabs(index)"
                >
                    <span>{{tab.count}}</span>
                    <p>{{tab.title}}</p>
                </div>
            </div>

            <div v-if="todoList.length == 0" class="no-data">
              暂无数据
            </div>

            <div v-if="(currentTodo == 0 || currentTodo == 1) && todoList.length > 0" class="audio-handle">
                <el-checkbox v-model="checkAll" @change="checkAllAudit">全选</el-checkbox>
                <el-button size="small" type="primary" @click="handleBatch">批量审核</el-button>
            </div>

            <div v-show="todoList.length > 0" class="audit-list">
              <!-- 战败审核 -->
              <div v-if="currentTodo == 0">
                  <div v-for="(item, index) in todoList" :key="index" class="audio-item">
                      <el-checkbox v-model="checkArr[index]"></el-checkbox>
                      <div class="user-info" @click="handleAudioDetais('defeat', item)">
                          <p class="date">
                              <i class="el-icon-time"></i>
                              {{item.createdAt}}
                          </p>
                          <p v-if="loginType == 'manage'">坐席组: {{item.dccGroupName | filterBlank}}</p>
                          <p>DCC邀约员: {{item.dccName | filterBlank}}</p>
                          <p>
                              客户名称: {{item.nickname | filterBlank}}
                              <span
                                  class="tag H"
                                  v-if="item.level"
                              >{{item.level}}级</span>
                              <span v-if="item.grade" class="tag score">{{(item.grade !=0 && item.grade != 11) ? (item.grade + '分') : '--'}}</span>
                          </p>
                          <p>战败原因: {{item.reasonDefeat | filterBlank}}</p>
                      </div>
                  </div>
              </div>
              <!-- 无效审核 -->
              <div v-if="currentTodo == 1">
                  <div v-for="(item, index) in todoList" :key="index" class="audio-item">
                      <el-checkbox v-model="checkArr[index]"></el-checkbox>
                      <div class="user-info" @click="handleAudioDetais('invalid', item)">
                          <p class="date">
                              <i class="el-icon-time"></i>
                              {{item.createdAt}}
                          </p>
                          <p v-if="loginType == 'manage'">坐席组: {{item.dccGroupName | filterBlank}}</p>
                          <p>DCC邀约员: {{item.dccName | filterBlank}}</p>
                          <p>
                              客户名称: {{item.nickname | filterBlank}}
                              <span
                                  class="tag H"
                                  v-if="item.level"
                              >{{item.level}}级</span>
                              <span v-if="item.grade" class="tag score">{{(item.grade !=0 && item.grade != 11) ? (item.grade + '分') : '--'}}</span>
                          </p>
                          <p>无效原因: {{item.reasonInvalid | filterBlank}}</p>
                      </div>
                  </div>
              </div>
              <!-- 降级监控 -->
              <div v-if="currentTodo == 2">
                  <div
                      v-for="(item, index) in todoList"
                      :key="index"
                      class="audio-item"
                      @click="handleAudioDetais('level', item)"
                  >
                      <div class="user-info">
                          <p class="date">
                              <i class="el-icon-time"></i>
                              {{item.createdAt}}
                          </p>
                          <p v-if="loginType == 'manage'">坐席组: {{item.dccGroupName | filterBlank}}</p>
                          <p>DCC邀约员: {{item.dccName | filterBlank}}</p>
                          <p>
                              客户名称: {{item.nickname | filterBlank}}
                              <span v-if="item.grade" class="tag score">{{(item.grade !=0 && item.grade != 11) ? (item.grade + '分') : '--'}}</span>
                          </p>
                          <p>
                              <span class="tag" :class="item.oldLevel">{{item.oldLevel}}级</span>
                              <i class="el-icon-right"></i>
                              <span class="tag" :class="item.oldLevel">{{item.newLevel}}级</span>
                          </p>
                      </div>
                  </div>
              </div>
              <!-- 跟进点评 -->
              <div v-if="currentTodo == 3">
                  <div
                      v-for="(item, index) in todoList"
                      :key="index"
                      class="audio-item"
                      @click="handleAudioDetais('follow', item)"
                  >
                      
                      <div class="user-info">
                          <p class="date">
                              <i class="el-icon-time"></i>
                              {{item.createdAt}}
                          </p>
                          <p v-if="loginType == 'manage'">坐席组: {{item.dccGroupName | filterBlank}}</p>
                          <p>DCC邀约员: {{item.followUserName | filterBlank}}</p>
                          <follow-action :item="item"></follow-action>
                          
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <audit-follow-dialog
            v-if="dialog.auditFollow"
            :auditType="auditType"
            :dataType="dataType"
            :auditTotal="auditTotal"
            :auditId="dialog.auditId"
            :followId="dialog.followId"
            :currentId="dialog.currentId"
            @success="successAuditFollow"
            @cancel="cancelAuditFollow"
        ></audit-follow-dialog>
        <batch-audit-dialog
            v-if="dialog.batchAudit"
            :selectData="dialog.selectAuditData"
            :selectAll="dialog.allAuditCount"
            :auditType="auditType"
            @successBatch="handleSuccessBatch"
            @cancelBatch="handleCancelBatch"
        ></batch-audit-dialog>
    </div>
</template>

<script>
import AuditFollowDialog from "./AuditFollowDialog";
import BatchAuditDialog from "./BatchAuditDialog";
import FollowAction from './FollowAction'
import * as Http from "@/apis/work";
import { mapState } from 'vuex'
export default {
  components: {
    AuditFollowDialog,
    BatchAuditDialog,
    FollowAction
  },
  data() {
    return {
      currentTodo: 0,
      checkAll: false,
      dataType: null,  // 跟进记录类型，1潜客跟进，2线索跟进
      todoTabs: [
        {
          id: 1,
          title: "战败审核",
          count: 0
        },
        {
          id: 2,
          title: "无效审核",
          count: 0
        },
        {
          id: 3,
          title: "降级监控",
          count: 0
        },
        {
          id: 4,
          title: "跟进点评",
          count: 0
        }
      ],
      dialog: {
        auditFollow: false,
        auditId: null, // 审核id
        followId: null,  // 跟进id
        currentId: null, // 档案id
        batchAudit: false,
        selectAuditData: [], // 所批量选择的审核数据
      },
      checkArr: [], // 是否全选
      auditType: 'defeat', // 默认战败审核类型
      auditTotal: 0, // 审核总数
      todoList: [], // 待办事项列表
      allAuditCount: 0, // 所有审核数量
      todoDom: null,
      todoPage: {
        totalCount: 0,
        page: 1,
        pageSize: 20,
        totalPage: 1
      },
    };
  },
  computed: {
      ...mapState(["loginType"])
  },
  created() {
    this.initData();
  },
  mounted() {
    // window.addEventListener('beforeunload', e => {
    //    var e = window.event || e;
    //    e.returnValue=("确定离开当前页面吗？");
    // })
    this.todoDom = document.querySelector(".audit-list");
    if(this.todoDom) {
      this.todoDom.addEventListener("scroll", this.onTodoDomScroll, true);
    }
  },
  methods: {
    initData() {
      // 获取待办事项列表
      this.getTodoDataStat();
      this.getTodoDataList("init");
    },
    handleTodoTabs(index) {
      this.currentTodo = index;
      switch (index) {
        case 1:
          this.auditType = 'invalid';
          break;
        case 2:
          this.auditType = 'level';
          break;
        case 3:
          this.auditType = 'follow';
          break;
        default:
          this.auditType = 'defeat';
          break;
      }
      this.getTodoDataList("init");
    },
    // 待办实现tab切换统计数量
    getTodoDataStat() {
      Http.getReviewTodoStat().then((res) => {
          this.$handleResponse(res, data =>{
              if (data) {
                  // 战败审核
                  this.todoTabs[0].count = data.defeatReviewTotal;
                  // 无效审核
                  this.todoTabs[1].count = data.clueInvalidReviewTotal;
                  // 降级监控
                  this.todoTabs[2].count = data.levelDownReviewTotal;
                  // 跟进点评
                  this.todoTabs[3].count = data.followReviewTotal;
              }
          }, false);
      }).catch(res => {
          console.log(res);
      })
    },
    // 获取战败审核列表
    getTodoDataList(reset) {
      let queryName = "";
      switch (this.currentTodo) {
        // 无效审核
        case 1:
          queryName = "clueInvalidList";
          break;
        // 降级监控
        case 2:
          queryName = "levelDownList";
          break;
        // 跟进点评
        case 3:
          queryName = "followReviewList";
          break;
        // 战败审核
        default:
          queryName = "getDefeatList";
          break;
      }
      if (reset == "init") {
        this.todoList = [];
        this.todoPage.page = 1;
      }

      const { page, pageSize } = this.todoPage;

      let params = {
        page,
        pageSize
      };
      Http[queryName](params, true).then(res => {
        this.$handleResponse(res, data => {
          const { list, page } = data;

          if (list) {
            this.todoList = [...this.todoList, ...list];
          }
          this.todoPage.totalCount = page.totalCount;
          this.todoPage.totalPage = page.totalPage;

          this.todoTabs[this.currentTodo].count = page.totalCount;
        }, true);
      }).catch(res => {
        this.$store.commit('closeLoading');
      });
    },
    // 执行批量审核操作
    handleBatch() {
      let newArr = this.checkArr.filter(item => item == true)

      // 如果未选择审核项
      if(!this.checkAll && newArr.length == 0) {
        this.$alert('请勾选审核项', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
        });
        return;
      }
      if(this.checkAll) {
        this.dialog.allAuditCount = this.todoPage.totalCount;
      } else {
        if(newArr.length > 0) {
          this.checkArr.forEach((item, index) => {
            if (item) {
              let id = this.todoList[index].id;
              this.dialog.selectAuditData.push(id);
            }
          });
        }
      }
      this.dialog.batchAudit = true;

    },
    // 操作审核详情
    handleAudioDetais(type, data) {
      this.auditTotal = this.todoPage.totalCount;
      this.auditType = type;
      // 审核记录id

      // 传值数据类型  线索&潜客
      switch (type) {
        case 'defeat':  // 战败为潜客
          this.dataType = 1;
          this.dialog.auditId = data.id;
          this.dialog.followId = data.intentionId;
          this.dialog.currentId = data.id;
          break;
        case 'invalid': // 无效为线索
          this.dataType = 2;
          this.dialog.auditId = data.id;
          this.dialog.followId = data.clueId;
          this.dialog.currentId = data.id;
          break;
        case 'level': // 降级为潜客
          this.dataType = 1;
          this.dialog.auditId = data.id;
          this.dialog.followId = data.intentionId;
          this.dialog.currentId = data.id;
          break;
        case 'follow': // 跟进点评动态取类型
          this.dataType = data.dataType;
          this.dialog.auditId = data.objectId;
          this.dialog.followId = data.objectId;
          this.dialog.currentId = data.id;
          break;
        default:
          break;
      }
      this.dialog.auditFollow = true;
    },
    // 操作批量成功
    handleSuccessBatch() {
      this.dialog.batchAudit = false;
     this.initData();
      this.checkReset();
    },
    handleCancelBatch() {
      this.dialog.batchAudit = false;
      this.checkReset();
    },
    // 操作审核跟进成功
    successAuditFollow() {
      this.initData();
    },
    cancelAuditFollow() {
      this.dialog.auditFollow = false;
    },
    checkAllAudit() {
      this.todoList.forEach((item, index) => {
        this.checkArr[index] = this.checkAll;
      });
    },
    onTodoDomScroll() {
      let scrollTop = this.todoDom.scrollTop;
      let clientHeight = this.todoDom.clientHeight;
      let scrollHeight = this.todoDom.scrollHeight;
      if (scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
        // 请求加载更多
        if (this.todoPage.page >= this.todoPage.totalPage) {
          return;
        }
        this.todoPage.page++;
        this.getTodoDataList();
      }
    },
    checkReset() {
      this.checkAll = false;
      this.dialog.selectAuditData = [];
      this.dialog.allAuditCount = 0;
      this.checkArr.forEach((item, index) => {
        this.checkArr[index] = false;
      })
    }
  },
  beforeDestroy() {
    if(this.todoDom) {
      this.todoDom.removeEventListener("scroll", this.onTodoDomScroll, true);
    }
  }
};
</script>


<style lang="scss" scoped>
@import "src/assets/scss/work.scss";

.group-manage-todo-component {
  height: 100%;
  .todo-num {
    display: flex;
    height: 120px;

    .piece {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      p {
        font-size: 16px;
      }

      span {
        font-size: 32px;
      }

      &.current {
        p {
          color: $baseBlue;
        }

        span {
          color: $baseBlue;
        }
      }

      &:not(.current) {
        background-color: #3d7eff;

        p {
          color: #fff;
        }

        span {
          color: #fff;
        }

        &:nth-child(3) {
          opacity: 0.7;
        }

        &:nth-child(4) {
          opacity: 0.5;
        }
      }
    }

    &.cook2 {
      .piece:nth-child(2) {
        opacity: 0.7;
      }
    }

    &.cook3 {
      .piece:nth-child(2) {
        opacity: 0.7;
      }

      .piece:nth-child(3) {
        opacity: 0.5;
      }
    }
  }

  .card-box {
    height: 100%;
  }

  .audio-handle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 25px 15px;
    border-bottom: 1px solid #eaebf0;

    button {
      border-radius: 25px;
      border-color: $baseBlue;
      background-color: #fff;
      color: $baseBlue;
    }
  }

  .audit-list {
    max-height: 630px;
    overflow: auto;

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


    .audio-item {
      padding: 20px 25px;
      border-bottom: 1px solid #eaebf0;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #f2f8fc;
      }

      &:last-child {
        border-bottom: none;
      }

      & > label {
        margin-right: 30px;
      }

      .user-info {
        flex: 1;

        p {
          color: #9ba6b6;
          font-size: 15px;
          margin-bottom: 5px;
          .tag {
            margin-top: 0;
          }
          .tag:first-child {
            margin-left: 5px;
          }
        }

        .date {
          font-size: 18px;
          color: #212427;

          i {
            color: #c3cad6;
          }
        }
      }
    }
  }

  .audio-handle ~ .audit-list {
    max-height: 560px;
  }

  @media (max-width: 1485px) {
    .todo-num {
      height: 80px;

      .piece {
        p {
          font-size: 14px;
        }

        span {
          font-size: 20px;
        }
      }
    }

    .audio-handle {
      padding: 15px 15px 10px;
    }

    .audit-list {
      .audio-item {
        padding: 10px 15px;

        & > label {
          margin-right: 15px;
        }

        .user-info {
          p {
            font-size: 14px;
          }

          .date {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
