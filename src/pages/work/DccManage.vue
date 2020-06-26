<template>
    <div class="dcc-manage-component">
        <group-manage-stat></group-manage-stat>

        <el-row :gutter="10" type="flex">
            <el-col :span="7">
                <group-manage-todo></group-manage-todo>
            </el-col>
            <el-col :span="17" class="staff-monitor">
                <div class="card-box">
                    <div class="head-wrap">
                        <span>员工监控</span>
                        <div class="service-num">
                            <span>全部坐席：{{monitorStat.agentTotal}}</span>
                            <span>今日在线：{{monitorStat.agentOnline}}</span>
                        </div>
                    </div>
                </div>

                <div class="monitor-table m-t-10">
                    <div class="table-head">
                        <span>坐席监控</span>
                        <span>线索处理</span>
                        <span>潜客跟进</span>
                        <span>邀约计划</span>
                        <span>开口任务</span>
                    </div>
                    <div class="table-body">
                        <div v-if="monitorList.length > 0" v-for="(item, index) in monitorList" :key="index" class="row"
                            :class="item.agent.callState == 1 ? 'free' : item.agent.callState == 2 ? 'call' : 
                                    item.agent.callState == 3 ? 'leave' : ''">
                            <div class="service-info">
                                <div>{{item.agent && item.agent.dccGroupName | filterBlank}}</div>
                                <div>
                                    <p><label>通话时长: </label> <span>{{item.call && item.call.dialTime | filterBlank}}</span></p>
                                    <!-- <p><label>工作时长: </label> <span>02:50:36</span></p> -->
                                </div>
                                <div>
                                    <p><label>外呼数</label> <span>{{item.call && item.call.dialTotal | filterBlank}}</span></p>
                                    <p><label>已接通</label> <span>{{item.call && item.call.callAnswer | filterBlank}}</span></p>
                                    <!-- <p><label>未接通</label> <span>4</span></p> -->
                                </div>
                            </div>
                            <div>
                                <p><label>待处理</label> <span>{{item.clue && item.clue.wait | filterBlank}}</span></p>
                                <p><label>已处理</label> <span>{{item.clue && item.clue.have | filterBlank}}</span></p>
                                <p><label>超时</label> <span class="overtime">{{item.clue && item.clue.overtime | filterBlank}}</span></p>
                            </div>
                            <div>
                                <p><label>待跟进</label> <span>{{item.intention && item.intention.wait | filterBlank}}</span></p>
                                <p><label>已跟进</label> <span>{{item.intention && item.intention.have | filterBlank}}</span></p>
                                <p><label>逾期</label> <span class="pl20">{{item.intention && item.intention.overtime | filterBlank}}</span></p>
                            </div>
                            <div>
                                <p><label>邀约数</label> <span>{{item.invite && item.invite.total | filterBlank}}</span></p>
                                <p><label>到店数</label> <span>{{item.invite && item.invite.arrival | filterBlank}}</span></p>
                            </div>
                            <div>
                                <p><label>已完成</label> <span>{{item.openTask && item.openTask.completed | filterBlank}}</span></p>
                                <p><label>未完成</label> <span>{{item.openTask && item.openTask.undone | filterBlank}}</span></p>
                            </div>
                        </div>

                        <div v-if="monitorList.length == 0" class="no-data">
                            暂无数据
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import TopBar from './components/TopBar'
    import GroupManageStat from './components/GroupManageStat'
    import GroupManageTodo from './components/GroupManageTodo'
    import { groupMonitorList, getMonitorStat } from '@/apis/work'
    export default {
        components: {
            TopBar,
            GroupManageStat,
            GroupManageTodo
        },
        computed: {
            countLen() {
                return((data) => {
                    return String(data).length;
                })
            }
        },
        data() {
            return {
                monitorStat: {
                    agentOnline: 0, // 今日在线数
                    agentTotal: 0,  // 全部坐席数
                },
                monitorList: [] // 监控列表
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                // 员工监控
                this.queryMonitor();

                // 获取员工监控数量
                this.getMonitorNum();

            },
            // 获取员工监控列表
            queryMonitor() {
                groupMonitorList().then((res) => {
                    this.$handleResponse(res, data => {
                        if (data) {
                            this.monitorList = data;
                        }
                    },true)
                })
            },
            // 获取监控数量
            getMonitorNum() {
                let params = {
                    status: 0
                }
                getMonitorStat(params).then((res) => {
                    this.$handleResponse(res, data => {
                        if (data) {
                            this.monitorStat = data;
                        }
                        
                    },true)
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/assets/scss/work.scss";
    
</style>
