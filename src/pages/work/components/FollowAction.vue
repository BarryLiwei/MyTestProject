<template>
  <div class="follow-action-component">
    <!-- 普通跟进 -->
    <div v-if="item.followAction == '1'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag H">{{item.metadata.level}}级</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 建档 -->
    <div v-if="item.followAction == '2'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag H">{{item.metadata.level}}级</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 邀约3， 档案回收4  -->
    <div v-if="item.followAction == '3' || item.followAction == '2,3' || item.followAction == '4'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag H">{{item.metadata.level}}级</span>
      </p>
      <p>邀约门店: {{item.metadata.areaName | filterBlank}}</p>
      <p>到店时间: {{(item.metadata.invaiteDate || item.metadata.inviteDate) | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 战败 -->
    <div v-if="item.followAction == '5'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag H">{{item.metadata.level}}级</span>
      </p>
      <p v-if="item.metadata.defeat">战败类型: {{item.metadata.defeat.reasonType | filterBlank}}</p>
      <p v-if="item.metadata.defeat">战败原因: {{item.metadata.defeat.reasonDefeat | filterBlank}}</p>
      <p v-if="item.metadata.defeat">原因描述: {{item.metadata.defeat.remark | filterBlank}}</p>
    </div>

    <!-- 潜客共享(线索共享) -->
    <div v-if="item.followAction == '6'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag H">{{item.metadata.level}}级</span>
      </p>
      <p>邀约门店: {{item.metadata.areaName | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 降级 7 -->
    <div v-if="item.followAction == '7'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p v-if="item.metadata.level">级别变更: 
          <span class="tag" :class="item.metadata.level.oldLevel">{{item.metadata.level.oldLevel}}级</span>
          <i class="el-icon-right"></i>
          <span class="tag" :class="item.metadata.level.newLevel">{{item.metadata.level.newLevel}}级</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 降级干预 -->
    <div v-if="item.followAction == '8'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p v-if="item.metadata.review">干预人：{{item.metadata.review.name}}</p>
      <p v-if="item.metadata.level">级别变更: 
          <span class="tag" :class="item.metadata.level.oldLevel">{{item.metadata.level.oldLevel}}级</span>
          <i class="el-icon-right"></i>
          <span class="tag" :class="item.metadata.level.newLevel">{{item.metadata.level.newLevel}}级</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 手动新增意向 -->
    <div v-if="item.followAction == '9'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p>邀约门店: {{item.metadata.areaName | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 战败通过 -->
    <div v-if="item.followAction == '10'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p v-if="item.metadata.review">审批人: {{item.metadata.review.name | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 战败审核不通过 || 邀约已登记到店 || 邀约未登记到店 -->
    <div v-if="item.followAction == '11' || item.followAction == '12' || item.followAction == '13'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
      </p>
      <p>邀约门店: {{item.metadata.areaName | filterBlank}}</p>
      <p>销售顾问: {{item.metadata.advisorName | filterBlank}}({{item.metadata.advisorTel | filterBlank}})</p>
      <p v-if="item.metadata.visitDate">到店时间: {{item.metadata.visitDate || item.metadata.appointmentDate}}</p>
    </div>

    <!-- 删除档案dcc || 删除线索dcc -->
    <div v-if="item.followAction == '14' || item.followAction == '35'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
      </p>
      <p v-if="item.remark">{{item.remark | filterBlank}}</p>
    </div>

    <!-- 线索下发 -->
    <div v-if="item.followAction == '21'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
          <span v-if="item.metadata.grade" class="tag score">{{(item.metadata.grade !=0 && item.metadata.grade != 11) ? (item.metadata.grade + '分') : '--'}}</span>
      </p>
      <p>邀约门店: {{item.metadata.areaName | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 稍后联系 -->
    <div v-if="item.followAction == '22'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
          <span v-if="item.metadata.grade" class="tag score">{{(item.metadata.grade !=0 && item.metadata.grade != 11) ? (item.metadata.grade + '分') : '--'}}</span>
      </p>
      <p>邀约门店: {{item.metadata.areaName | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 无效 23 -->
    <div v-if="item.followAction == '23'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p>无效原因: {{item.metadata.invalid.reasonInvalid | filterBlank}}</p>
    </div>

    <!-- 线索转移[共享] -->
    <div v-if="item.followAction == '24'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.grade" class="tag score">{{(item.metadata.grade !=0 && item.metadata.grade != 11) ? (item.metadata.grade + '分') : '--'}}</span>
      </p>
      <p>邀约门店: {{item.metadata.intention.areaName | filterBlank}}</p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 线索审核通过 -->
    <div v-if="item.followAction == '25'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 线索无效不通过 -->
    <div v-if="item.followAction == '26'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 手动新增线索 27 -->
    <div v-if="item.followAction == '27'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
          <span v-if="item.metadata.grade" class="tag score">{{(item.metadata.grade !=0 && item.metadata.grade != 11) ? (item.metadata.grade + '分') : '--'}}</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 下订 -->
    <div v-if="item.followAction == '28'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
          <span v-if="item.metadata.grade" class="tag score">{{(item.metadata.grade !=0 && item.metadata.grade != 11) ? (item.metadata.grade + '分') : '--'}}</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 线索无效激活 -->
    <div v-if="item.followAction == '31'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 线索分配 -->
    <div v-if="item.followAction == '32'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 潜客战败激活 -->
    <div v-if="item.followAction == '33'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 潜客分配 -->
    <div v-if="item.followAction == '34'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>

    <!-- 线索转移【被转移者】|| 呼入线索 -->
    <div v-if="item.followAction == '36' || item.followAction == '37'">
      <p v-if="item.metadata">
          客户名称: {{item.metadata.customer && item.metadata.customer.nickname | filterBlank}}
          <span v-if="item.metadata.level" class="tag" :class="item.metadata.level">{{item.metadata.level}}级</span>
          <span v-if="item.metadata.grade" class="tag score">{{(item.metadata.grade !=0 && item.metadata.grade != 11) ? (item.metadata.grade + '分') : '--'}}</span>
      </p>
      <p>继续跟进: {{item.remark | filterBlank}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
        item: {
            type: Object,
            default: {}
        }
    }
  }

</script>

<style lang="scss" scoped>
.follow-action-component{
  p {
    margin-bottom: 5px;
    color: #9ba6b6;
    font-size: 15px;
    .tag {
      margin-top: 0;
    }
    .tag:first-child {
      margin-left: 5px;
    }
  }

  @media screen and (max-width: 1485px){
    p {
      font-size: 14px;
    }
  }
}
</style>

