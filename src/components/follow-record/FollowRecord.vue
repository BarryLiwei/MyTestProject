<template>
    <div class="archive-follow" ref="followRecord">
        <el-timeline v-if="recordList.length">
            <el-timeline-item
                v-for="(record, index) in recordList"
                :key="index"
                :color="'#3d7eff'"
                :timestamp="record.createdAt" placement="top">
                <div v-if="!$slots.custom">
                    <!-- 1: 继续跟进（普通跟进） -->
                    <div v-if="record.followAction == 1">
                        <div class="title-right">
                            <span v-if="record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                        </div>
                        <div class="title-dcc" >经手DCC: {{record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 2: 建档管理 -->
                    <div v-if="record.followAction == 2">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action G">建档</span>
                        </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 3: 邀约下发 -->
                    <div v-if="record.followAction == 3 || record.followAction == '2,3'">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action G" v-if="record.followAction == '2,3'">建档</span>
                            <span class="action H">下发邀约</span>
                        </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 4: 档案回收 -->
                    <div v-if="record.followAction == 4">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action F">档案回收</span>
                        </div>
                        <!-- 24小时未处理档案回收 -->
                        <div class="title-dcc" v-if="record.metadata"> {{ record.metadata.remark | filterBlank }} </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 5: 战败 -->
                    <div v-if="record.followAction == 5">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action C">战败审核</span>
                        </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 6: 潜客共享(线索共享) -->
                    <div v-if="record.followAction == 6">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action B">线索共享</span>
                        </div>
                        <!-- 30天未成交档案线索共享 -->
                        <div class="title-dcc" v-if="record.metadata"> {{ record.metadata.remark | filterBlank }} </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 7: 降级 -->
                    <div v-if="record.followAction == 7">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level.newLevel">{{record.metadata.level.newLevel}}</span>
                            <span class="action B">客户降级</span>
                        </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 8: 降级干预 -->
                    <div v-if="record.followAction == 8">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level.newLevel">{{record.metadata.level.newLevel}}</span>
                            <span class="action D">降级干预</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 9: 手动新增意向 -->
                    <div v-if="record.followAction == 9">
                        <div class="title-dcc">添加意向门店与车型 </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 10: 战败通过 -->
                    <div v-if="record.followAction == 10">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action A">同意战败</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 11: 战败审核不通过 -->
                    <div v-if="record.followAction == 11">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action L">拒绝战败</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 12: 邀约已登记到店 -->
                    <div v-if="record.followAction == 12">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action M">已登记到店</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 13: 邀约未登记到店 -->
                    <div v-if="record.followAction == 13">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action N">未登记到店</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 21: 线索下发 -->
                    <div v-if="record.followAction == 21">
                        <div class="title-dcc">下发线索【{{ record.metadata.distributionRule}}】到DCC:  </div>
                        <div class="title-dcc">{{ record.metadata.dccName | filterBlank }} &nbsp;<span>{{ record.metadata.dccTel}}</span></div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 22: 稍后联系 -->
                    <div v-if="record.followAction == 22">
                        <div class="title-right">
                            <span class="action A">稍后联系</span>
                        </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 23: 无效审核 -->
                    <div v-if="record.followAction == 23">
                        <div class="title-right">
                            <span class="action C">线索审核</span>
                        </div>
                        <div class="title-dcc">无效待审核 </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 24: 线索转移【共享】 -->
                    <div v-if="record.followAction == 24">
                        <div class="title-dcc">转移线索到DCC: {{record.metadata&&record.metadata.targetDcc&&record.metadata.targetDcc.name | filterBlank}} </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 25: 线索审核通过 -->
                    <div v-if="record.followAction == 25">
                        <div class="title-right">
                            <span class="action E">线索无效</span>
                        </div>
                        <div class="title-dcc">通过</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 26: 线索无效不通过 -->
                    <div v-if="record.followAction == 26">
                        <div class="title-right">
                            <span class="action E">驳回无效</span>
                        </div>
                        <div class="title-dcc">驳回</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>
                    

                    <!-- 27: 手动新增线索(自建线索) -->
                    <div v-if="record.followAction == 27">
                        <div class="title-dcc">自建线索</div>
                        <div class="title-dcc" v-if="record.metadata && record.metadata.dcc">DCC: {{record.metadata.dcc.name | filterBlank}} </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 28: 客户下订 -->
                    <div v-if="record.followAction == 28">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action J">下订</span>
                        </div>
                        <div class="title-dcc">经手DCC: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 31: 线索无效激活 -->
                    <div v-if="record.followAction == 31">
                        <div class="title-right">
                            <span class="action I">线索激活</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 32: 线索分配 -->
                    <div v-if="record.followAction == 32">
                        <div class="title-right">
                            <span class="action K">线索分配</span>
                        </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 33: 潜客战败激活 -->
                    <div v-if="record.followAction == 33">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action I">战败激活</span>
                        </div>

                        <div class="title-dcc">激活经手: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>
                        
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 34: 潜客分配 -->
                    <div v-if="record.followAction == 34">
                        <div class="title-right">
                            <span v-if="record.metadata && record.metadata.level" class="record-tag" :class="record.metadata.level">{{record.metadata.level}}</span>
                            <span class="action K">潜客分配</span>
                        </div>

                        <div class="title-dcc">分配经手: {{ record.createdBy===0?'系统自动操作':record.followUserName | filterBlank}}</div>

                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 14: 删除档案dcc || 35: 删除线索dcc -->
                    <div v-if="record.followAction == 14 || record.followAction == 35">
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 36: 转移线索[被转移者] -->
                    <div v-if="record.followAction == 36">
                        <div class="title-dcc">【DCC：{{ record.metadata && record.metadata.dcc && record.metadata.dcc.name | filterBlank }}】转移线索给【DCC: <span>{{ record.metadata && record.metadata.targetDcc&&record.metadata.targetDcc.name | filterBlank }}</span>】</div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>

                    <!-- 37: 呼入线索 -->
                    <div v-if="record.followAction == 37">
                        <div class="title-dcc">呼入线索</div>
                        <div class="title-dcc" v-if="record.metadata && record.metadata.dcc">DCC: {{record.metadata.dcc.name | filterBlank}} </div>
                        <record-box :record="record" v-bind="$attrs" v-on="$listeners"></record-box>
                    </div>
                    
                </div>

                <!-- 不满足的时候可以自定义 -->
                <slot name="custom" :item="record"></slot>
            </el-timeline-item>
        </el-timeline>
        <div v-if="!recordList.length" class="not-data">暂无跟进记录</div>
    </div>
</template>

<script>
import RecordBox from './RecordBox'
export default {
    components:{
        RecordBox
    },
    props: {
        scrollEvent: false,  // 是否监听滚动条事件
        recordList: { // 记录列表
            type: Array,
            default: ()=>{return []}
        },
    },
    data(){
        return {
            followDom: null,
        }
    },
    mounted() {
        // 跟进记录滚动条监听
        if (this.scrollEvent) {
            this.followDom = this.$refs.followRecord;
            if(this.followDom) {
                this.followDom.addEventListener('scroll', this.onFollowDomScroll, true);
            }
        }
    },
    methods: {
        note(){
            // 对象中followAction值的情况
            // 1  //普通跟进
            // 2; //建档
            // 3; //邀约
            // 4; //档案回收
            // 5; //战败
            // 6;  //潜客共享
            // 7; //降级
            // 8; //降级干预
            // 9; //手动新增意向
            // 10; //战败通过
            // 11; //战败审核不通过
            // 14; //删除档案dcc
            // 21; //线索下发
            // 22; //稍后联系
            // 23; //无效
            // 24; //线索转移[共享]
            // 25; //线索审核通过
            // 26; //线索无效不通过
            // 27; //手动新增线索
            // 28; //下订
            // 31;//线索无效激活
            // 32;//线索分配
            // 33;//潜客战败激活
            // 34;//潜客分配
            // 35;// 删除线索dcc
            // 36: // 线索转移[被转移者]
            // 37: 呼入线索
        },
        onFollowDomScroll() {
            let scrollTop = this.followDom.scrollTop;
            let clientHeight = this.followDom.clientHeight;
            let scrollHeight = this.followDom.scrollHeight;

            // 已到达底部
            if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
                this.$emit('event-scroll')
            }
        },
    },
    beforeDestroy() {
        if(this.followDom) {
            this.followDom.removeEventListener('scroll', this.onFollowDomScroll, true);
        }
    },
}
</script>

<style lang="scss" scoped>
.archive-follow /deep/.el-timeline-item__timestamp.is-top {
    font-size: 16px;
    color: #444;
    padding-top: 2px;
}

.archive-follow /deep/ .el-timeline-item__content {
    margin-bottom: 10px;
}

.archive-follow /deep/ .el-timeline-item__tail {
    border-left: 1px dashed #dce1e7;
}

.el-tag {
    border-width: 0;
    font-size: 14px;
    line-height: 30px;
    height: 30px;
    margin:0 10px 8px 0;
}


.record-car {
    font-size: 14px;
    color: #838b96;
    display: inline-block;
}

.not-data {
    color: #909399;
}

.title-right {
    position: absolute;
    top: -9px;
    right: 0px;
}

.title-dcc {
   color: #838b96; 
   font-size: 14px;
   line-height: 26px;
}

.record-tag {
    display: inline-block;
    padding: 6px 12px;
    margin: 5px 5px 0 0;
    border-radius: 2px;
    color: #3d7eff;
    font-size: 14px;
    line-height: 1;
    &.H {
        background-color: rgba(255, 90, 22, .2);
        color: #ff5a16;
    }   
    &.A {
        background-color: rgba(214, 90, 168, .2);
        color: #d65aa8;
    }  
    &.B {
        background-color: rgba(171, 125, 246, .2);
        color: #ab7df6;
    } 
    &.C {
        background-color: rgba(20, 148, 235, .2);
        color: #1494eb;
    }
    &.O {
        background-color: rgba(65, 193, 40, .2);
        color: #41c128;
    }
    &.F {
        background-color: rgba(44, 192, 175, .2);
        color: #2cc0af;
    }
}

.action {
    display: inline-block;
    padding: 6px 12px;
    margin: 5px 5px 0 0;
    border-radius: 2px;
    color: #3d7eff;
    font-size: 14px;
    line-height: 1;
    &.A { // 稍后联系  同意战败
        background-color: rgba(20, 148, 235, .2);
        color: #1494eb
    }   
    &.B { // 客户降级  线索共享
        background-color: rgba(253, 190, 90, .2);
        color: #fdbe5a;
    }   
    &.C { // 线索审核  战败审核
        background-color: rgba(52, 181, 114, .2);
        color: #34b572;
    }
    &.D { // 降级干预
        background-color: rgba(237, 152, 54, .2);
        color: #ed9836;
    }
    &.E { // 线索无效
        background-color: rgba(179, 195, 215, .2);
        color: #b3c3d7;
    }   
    &.F { // 档案回收
        background-color: rgba(152, 164, 184, .2);
        color: #98a4b8;
    }   
    &.G { // 建档
        background-color: rgba(61, 126, 255, .2);
        color: #3d7eff;
    }
    &.H { // 下发邀约
        background-color: rgba(1, 163, 176, .2);
        color: #01a3b0;
    }   
    &.I { // 线索激活  战败激活
        background-color: rgba(65, 198, 115, .2);
        color: #41c673;
    }   
    &.J { // 下订
        background-color: rgba(137, 188, 65, .2);
        color: #89bc41;
    }
    &.K { // 潜客分配   线索分配
        background-color: rgba(51, 197, 230, .2);
        color: #33c5e6;
    } 
    &.L { // 拒绝战败
        background-color: rgba(244, 99, 103, .2);
        color: #f46367;
    }
    &.M { // 已登记到店
        background-color: rgba(141, 224, 223, .2);
        color: #8de0df;
    } 
    &.N { // 未登记到店
        background-color: rgba(247, 189, 143, .2);
        color: #f7bd8f;
    } 
}

@media screen and (max-width: 1485px){
    .archive-follow /deep/.el-timeline-item__timestamp.is-top {
        font-size: 14px;
    }
    .record-tag {
        padding: 4px 6px;
        font-size: 12px;
    }
    .action {
        padding: 4px 8px;
        font-size: 12px;
    }
    .title-dcc {
        font-size: 13px;
        line-height: 20px;
    }
}
</style>

