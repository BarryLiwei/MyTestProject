<template>
  <div class="group-manage-stat-component">
    <el-row :gutter="10" class="card-stat">
      <el-col :span="3">
        <div class="card-item clue">
          <i></i>
          <span>{{todoStat.cluePendingTotal}}</span>
          <p>待跟进线索</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="card-item overtime">
          <i></i>
          <span>{{todoStat.clueOvertimeTotal}}</span>
          <p>超时线索</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="card-item customer">
          <i></i>
          <span>{{ todoStat.archivePendingTotal}}</span>
          <p>待跟进潜客</p>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="card-item overdue">
          <i></i>
          <span>{{todoStat.archiveOvertimeTotal}}</span>
          <p>逾期跟进潜客</p>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-box">
          <div class="head-wrap">
            <span>通话数据</span>
            <el-radio-group v-model="callDate" class="reset-radio" size="small" @change="getStatCall">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
          <el-row type="flex" justify="space-between" align="middle" class="body-wrap">
            <el-col class="cell">
              <div class="text-center">
                <span>{{callStat.callIn}}</span>
                <p>呼入数</p>
              </div>
            </el-col>
            <el-col class="cell">
              <div class="text-center">
                <span>{{callStat.callOut}}</span>
                <p>呼出数</p>
              </div>
            </el-col>
            <el-col class="cell">
              <div class="text-center">
                <span>{{callStat.talk}}</span>
                <p>已接通</p>
              </div>
            </el-col>
            <el-col class="cell">
              <div class="text-center">
                <span>{{callStat.notTalk}}</span>
                <p>未接通</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="follow-data card-stat">
      <div class="card-box">
        <div class="head-wrap">
          <span>跟进数据</span>
          <el-radio-group v-model="followDate" class="reset-radio" size="small" @change="getStatFollow">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
          </el-radio-group>
        </div>
        <el-row type="flex" justify="space-between" align="middle" class="body-wrap">
          <el-col class="cell">
            <i class="icon-xss"></i>
            <div>
              <span>{{followStat.clueHandleTotal}}</span>
              <p>线索数</p>
            </div>
          </el-col>
          <el-col class="cell">
            <i class="icon-jds"></i>
            <div>
              <span>{{followStat.clueArchiveTotal}}</span>
              <p>建档数</p>
            </div>
          </el-col>
          <el-col class="cell">
            <i class="icon-yys"></i>
            <div>
              <span>{{followStat.inviteTotal}}</span>
              <p>邀约数</p>
            </div>
          </el-col>
          <el-col class="cell">
            <i class="icon-dds"></i>
            <div>
              <span>{{followStat.inviteArrivalTotal}}</span>
              <p>到店数</p>
            </div>
          </el-col>
          <el-col class="cell">
            <i class="icon-cjs"></i>
            <div>
              <span>{{followStat.orderTotal}}</span>
              <p>成交数</p>
            </div>
          </el-col>
          <el-col class="cell">
            <i class="icon-zbs"></i>
            <div>
              <span>{{followStat.archiveDefeatedTotal}}</span>
              <p>战败数</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Http from '@/apis/work'
  import WorkMixins from '@/pages/mixins/WorkMixins'
  export default {
    mixins: [WorkMixins],
    data() {
      return {
        callDate: 'day',
        followDate: 'day',
      }
    },
    created() {
      /**
       * 找不到的方法在WorkMixins中
       */
      this.queryStatTodo();
      // 获取跟进数据
      this.getStatFollow();
      // 获取通话数据
      this.getStatCall();
    },
    methods: {
      // 调用父组件Work中的公用api
      getStatCall() {
        this.queryStatCall({
          scope: this.callDate
        })
      },
      getStatFollow() {
        this.queryStatFollow({
          scope: this.followDate
        })
      },
    },
  }

</script>


<style lang="scss" scoped>
  @import "src/assets/scss/work.scss";

  .group-manage-stat-component {
    .card-stat {

      .card-item,
      .card-box {
        height: 200px;

        @media (max-width: 1485px) {
            height: 130px;
        }
      }

      .card-item {
        border-radius: 4px;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        i {
          display: inline-block;
          width: 40px;
          height: 40px;
          margin-bottom: 15px;
          background-repeat: no-repeat;
          background-size: contain;

          @media (max-width: 1485px) {
              width: 30px;
              height: 30px;
              margin-bottom: 8px;
          }
        }

        p {
          color: #fff;
          font-size: 18px;

          @media (max-width: 1485px) {
             font-size: 14px;
          }
        }

        &.clue {
          background-image: linear-gradient(0deg, #6bc6ff 0%, #736df1 100%), linear-gradient(#ffffff, #ffffff);

          i {
            background-image: url('~@/assets/images/work/icon-dgjxs.png');
          }
        }

        &.overtime {
          background-image: linear-gradient(0deg, #fdb582 0%, #ed7c68 100%), linear-gradient(#ffffff, #ffffff);

          i {
            background-image: url('~@/assets/images/work/icon-csxs.png');
          }
        }

        &.customer {
          background-image: linear-gradient(0deg, #79c6fd 0%, #3d7eff 100%), linear-gradient(#ffffff, #ffffff);

          i {
            background-image: url('~@/assets/images/work/icon-dgjqk.png');
          }
        }

        &.overdue {
          background-image: linear-gradient(0deg, #8ca3fa 0%, #ab66ee 100%), linear-gradient(#ffffff, #ffffff);

          i {
            background-image: url('~@/assets/images/work/icon-yqgj.png');
          }
        }

      }

      .card-box .body-wrap .cell,
      .card-item {
        span {
          font-size: 36px;
        }

        @media (max-width: 1590px) {
          span {
            font-size: 24px;
          }
        }
      }

      .card-box .body-wrap .cell p {
        color: #838b96;
      }


    }


    .follow-data {
      margin: 10px 0;


      @media (min-width: 1590px) {
          [class^=icon-] {
          width: 50px !important;
          height: 50px !important;
        }
      }
      
      .icon-xss {
        background-image: url('~@/assets/images/work/icon-xss.png')
      }

      .icon-jds {
        background-image: url('~@/assets/images/work/icon-jds.png')
      }

      .icon-yys {
        background-image: url('~@/assets/images/work/icon-yys.png')
      }

      .icon-dds {
        background-image: url('~@/assets/images/work/icon-dds.png')
      }

      .icon-cjs {
        background-image: url('~@/assets/images/work/icon-cjs.png')
      }

      .icon-zbs {
        background-image: url('~@/assets/images/work/icon-zbs.png')
      }
    }
  }

</style>
