<template>
    <div class="dcc-group-component">
        <top-bar></top-bar>
        <div style="padding-top: 40px;">
            <group-manage-stat></group-manage-stat>

            <el-row :gutter="15" type="flex">
                <el-col :span="8">
                    <group-manage-todo></group-manage-todo>
                </el-col>
                <el-col :span="16" class="staff-monitor">
                    <div class="card-box">
                        <div class="head-wrap">
                            <span>员工监控</span>
                            <div class="service-num">
                                <span>全部坐席：{{monitorStat.agentTotal}}</span>
                                <span>今日在线：{{monitorStat.agentOnline}}</span>
                            </div>
                        </div>
                        <search-bar class="search-box search-flex" size="medium" :needSeparate="false" @find="queryMonitor" @clear="clearQuery">
                            <search-col :info="search.list[search.atState]" :colWidth="7"></search-col>
                            <search-col :info="search.list[search.callState]" :colWidth="7"></search-col>
                        </search-bar>
                    </div>

                    <div class="monitor-table">
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
                                    <div>
                                        <p>
                                            {{item.agent.dccName | filterBlank}}
                                            (分机: {{item.agent.tel | filterBlank}})
                                        </p>
                                        <p>
                                            <i v-if="item.agent.state == 1" class="icon-online">在线</i>
                                            <i v-if="item.agent.state == 2" class="icon-busy">忙碌</i>
                                            <i v-if="item.agent.state == 3" class="icon-offline">离线</i>

                                            <i v-if="item.agent.callState == 1" class="icon-free">空闲</i>
                                            <i v-if="item.agent.callState == 2" class="icon-call">通话中</i>
                                            <i v-if="item.agent.callState == 3" class="icon-leave">离开</i>
                                        </p>
                                    </div>
                                    <div>
                                        <p><label>通话时长: </label> <span>{{item.call.dialTime | filterBlank}}</span></p>
                                        <!-- <p><label>工作时长: </label> <span>02:50:36</span></p> -->
                                    </div>
                                    <div>
                                        <p><label>外呼数</label> <span>{{item.call.dialTotal | filterBlank}}</span></p>
                                        <p><label>已接通</label> <span>{{item.call.callAnswer | filterBlank}}</span></p>
                                        <!-- <p><label>未接通</label> <span>4</span></p> -->
                                    </div>
                                </div>
                                <div>
                                    <p><label>待处理</label> <span>{{item.clue.wait | filterBlank}}</span></p>
                                    <p><label>已处理</label> <span>{{item.clue.have | filterBlank}}</span></p>
                                    <p><label>超时</label> <span class="overtime">{{item.clue.overtime | filterBlank}}</span></p>
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
                                    <p><label>未完成</label> <span>{{item.openTask.undone | filterBlank}}</span></p>
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
    </div>
</template>

<script>
    import TopBar from './components/TopBar'
    import SearchBar from '@/components/SearchBar';
    import SearchCol from '@/components/form/SearchCol';
    import GroupManageStat from './components/GroupManageStat'
    import GroupManageTodo from './components/GroupManageTodo'
    import { monitorEmployeesList, getMonitorStat } from '@/apis/work'
    import { mapMutations } from 'vuex'
    export default {
        components: {
            TopBar,
            SearchBar,
            SearchCol,
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
                // 搜索配置
                search: {
                    list: [{
                        type: 'select',
                        label: '坐席状态',
                        currentVal: '',
                        selectOptions: [],
                        optionLabel: 'title',
                        optionValue: "id"
                    }, {
                        type: 'select',
                        label: '通话状态',
                        currentVal: '',
                        selectOptions: [],
                        optionLabel: 'title',
                        optionValue: "id"
                    }],
                    atState: 0, // 坐席状态
                    callState: 1 // 通话状态
                }, 
                monitorList: [] // 监控列表
            }
        },
        created() {
            this.initData();
        },
        methods: {
            ...mapMutations(['openLoading', 'closeLoading']),
            initData() {
                // 初始化下拉框
                this.initSearch()

                // 员工监控
                this.queryMonitor();

                // 获取员工监控数量
                this.getMonitorNum();
            },
            
            initSearch() {
                this.getAgentState();
                this.getCallState();
            },
            // 获取坐席状态
            getAgentState(){
                this.$fetch.common.agentState().then((res) => {
                    this.$handleResponse(res, data => {
                        const { atState } = this.search;
                        this.search.list[atState].selectOptions = data;
                        this.search.list[atState].selectOptions.unshift({
                            id: '',
                            title: '全部'
                        })
                    })
                })
            },
            // 获取通话状态
            getCallState(){
                this.$fetch.common.callState().then((res) => {
                    this.$handleResponse(res, data => {
                        const { callState } = this.search;
                        this.search.list[callState].selectOptions = data;
                        this.search.list[callState].selectOptions.unshift({
                            id: '',
                            title: '全部'
                        })
                    })
                })
            },
            // 获取员工监控列表
            queryMonitor() {
                const { list, atState, callState } = this.search
                let params = {
                    state: list[atState].currentVal,  // 坐席状态
                    callState: list[callState].currentVal,  // 坐席状态
                }
                monitorEmployeesList(params).then((res) => {
                    this.$handleResponse(res, data => {
                        if (data) {
                            this.monitorList = data;
                        }
                    })
                }).catch(res => {
                    this.closeLoading();
                });
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
                }).catch(res => {
                    this.$store.commit('closeLoading');
                });
            },
            clearQuery() {
                this.search && this.search.list.forEach((item) => {
                    item.currentVal = '';
                })
                this.queryMonitor();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/assets/scss/work.scss";
    .dcc-group-component {
        .staff-monitor {
            .monitor-table {
                height: calc(100% - 140px);
            }
        }
    }
</style>


