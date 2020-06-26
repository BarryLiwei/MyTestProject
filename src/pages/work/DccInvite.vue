<template>
    <div class="dcc-invite-component">
        <top-bar></top-bar>

        <div class="dcc-invite-content">
            <el-row :gutter="10" class="card-stat">
                <el-col :span="12">
                    <div class="card-box">
                        <div class="head-wrap">
                            <span>待办事项</span>
                        </div>

                        <el-row type="flex" justify="space-between" align="middle" class="body-wrap">
                            <el-col class="cell"> 
                                <i class="icon-clue"></i>
                                <div>
                                    <span>{{countLen(todoStat.cluePendingTotal) > 4 ? '999+' : todoStat.cluePendingTotal}}</span>
                                    <p>待处理线索</p>
                                </div>
                            </el-col>
                            <el-col class="cell">
                                <i class="icon-overtime"></i>
                                <div>
                                    <span>{{countLen(todoStat.clueOvertimeTotal) > 4 ? '999+' : todoStat.clueOvertimeTotal}}</span>
                                    <p>超时线索</p>
                                </div>
                            </el-col>
                            <el-col class="cell">
                                <i class="icon-customer"></i>
                                <div>
                                    <span>{{countLen(todoStat.archivePendingTotal) > 4 ? '999+' : todoStat.archivePendingTotal}}</span>
                                    <p>待跟进潜客</p>
                                </div>
                            </el-col>
                            <el-col class="cell">
                                <i class="icon-overdue"></i>
                                <div>
                                    <span>{{countLen(todoStat.archiveOvertimeTotal) > 4 ? '999+' : todoStat.archiveOvertimeTotal}}</span>
                                    <p>逾期跟进潜客</p>
                                </div>
                            </el-col>
                         </el-row> 
                    </div>
                </el-col>
                <el-col :span="7">
                    <div class="card-box">
                        <div class="head-wrap">
                            <span>跟进数据</span>
                            <el-radio-group v-model="followDate" class="reset-radio" size="small" @change="getStatFollow">
                                <el-radio-button label="day">日</el-radio-button>
                                <el-radio-button label="month">月</el-radio-button>
                            </el-radio-group>
                        </div>

                        <el-row type="flex" justify="space-between" align="middle" class="body-wrap">
                            <el-col> 
                                <span>{{countLen(followStat.clueHandleTotal) > 4 ? '999+' : followStat.clueHandleTotal}}</span>
                                <p>线索数</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(followStat.clueArchiveTotal) > 4 ? '999+' : followStat.clueArchiveTotal}}</span>
                                <p>建档数</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(followStat.inviteTotal) > 4 ? '999+' : followStat.inviteTotal}}</span>
                                <p>邀约数</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(followStat.inviteArrivalTotal) > 4 ? '999+' : followStat.inviteArrivalTotal}}</span>
                                <p>到店数</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(followStat.archiveDefeatedTotal) > 4 ? '999+' : followStat.archiveDefeatedTotal}}</span>
                                <p>战败数</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="card-box">
                        <div class="head-wrap">
                            <span>通话数据</span>
                            <div class="duration">通话时长：<span>{{callStat.talkTime}}</span></div>
                        </div>

                        <el-row type="flex" justify="space-between" align="middle" class="body-wrap">
                            <el-col> 
                                <span>{{countLen(callStat.callIn) > 4 ? '999+' : callStat.callIn}}</span>
                                <p>呼入数</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(callStat.callOut) > 4 ? '999+' : callStat.callOut}}</span>
                                <p>呼出数</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(callStat.talk) > 4 ? '999+' : callStat.talk}}</span>
                                <p>已接通</p>
                            </el-col>
                            <el-col>
                                <span>{{countLen(callStat.notTalk) > 4 ? '999+' : callStat.notTalk}}</span>
                                <p>未接通</p>
                            </el-col>
                         </el-row>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="10" class="card-list" :style="{'height': listHeight}">
                <el-col :span="5" class="todo-clue">
                    <div class="card-box">
                        <div class="head-wrap">
                            <span>待处理线索({{cluePage.totalCount}})</span>
                            <router-link tag="a" target="_blank" :to="{path: '/business/clue', query: {'state': 1}}">查看全部</router-link>
                        </div>
                        <div class="clue-panel">
                            <div class="sort-box">
                                <a href="javascript:;" class="left-sort">
                                    <i class="el-icon-sort"></i>
                                </a>
                                <el-select v-model="clueSort" placeholder="请选择" @change="getCluePending('init')">
                                    <el-option
                                        v-for="item in clueOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>

                            <div class="clue-list">
                                <div v-if="clueList.length > 0" v-for="(item, index) in clueList" :key="index" class="clue-item" @click="toCluesDeal(item)">
                                    <div class="user-info">
                                        <span class="nickname" :title="item.nickname">{{item.nickname}}</span>
                                        <span>{{item.tel}}</span>
                                    </div>
                                    <div class="flex-center-between">
                                        <div>
                                            <span v-if="item.grade" class="tag score">{{(item.grade !=0 && item.grade != 11) ? (item.grade + '分') : '--'}}</span>
                                            <span v-if="item.fromSecondName || item.fromTopName" class="tag source">{{item.fromSecondName || item.fromTopName}}</span>
                                            <span v-if="item.clueTypeName" class="tag clue">{{item.clueTypeName}}</span>
                                            <span v-if="item.momentStatus == 3" class="tag follow">{{item.momentStatusName}}</span>
                                        </div>
                                        <div class="time">
                                            {{item.followDate}}
                                        </div>
                                    </div>
                                    
                                    <span v-if="item.momentStatus == 1 && item.clueType != 1" class="pos-state">
                                        即将超时
                                    </span>
                                    <span v-if="item.momentStatus == 2 && item.clueType != 1" class="pos-state err">
                                        超时
                                    </span>
                                </div>
                                <div v-if="clueList.length == 0" class="no-data">
                                    暂无数据
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="14" class="follow-task">
                    <div class="card-box">
                        <div class="pos-rel">
                            <tabs-scrm :tabs="followTabs" :tabStyle="followTabStyle" @change="handleFollowTabs"></tabs-scrm>
                            <router-link tag="a" target="_blank" :to="{path: '/business/potential', query: qiankeQuery}">查看全部</router-link>
                        </div>

                        <div class="follow-panel">
                            <el-row type="flex" v-if="followList.length > 0" :gutter="10" class="follow-list">
                                <el-col :span="6" v-for="(item, index) in followList" :key="index" class="m-t-5 m-b-5">
                                    <div class="follow-item" @click="toCustomerFollow(item)">
                                        <div class="user-info">
                                            <span class="nickname" :title="item.nickname">{{item.nickname}}</span>
                                            <i v-if="item.wechatAdded == 1" class="wechat" :data-wechat="item.wechatNumber"></i>
                                        </div>
                                        <p class="tel">{{item.tel}}</p>
                                        <div>
                                            <span v-if="item.level" class="tag score" :class="item.level">{{item.level}}级</span>
                                            <span v-if="item.grade" class="tag score">{{(item.grade !=0 && item.grade != 11) ? (item.grade + '分') : '--'}}</span>
                                            <span v-if="item.followTimes" class="tag follow">跟进{{item.followTimes}}次</span>
                                            <span v-if="item.momentTag" class="tag recycle">{{item.momentTag}}</span>
                                        </div>

                                    </div>
                                </el-col>
                            </el-row>
                            <div v-if="followList.length == 0" class="no-data">暂无数据</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="5" class="today-shop">
                    <div class="card-box">
                        <div class="head-wrap">
                            <span>今日预计到店({{shopTotal}})</span>
                            <router-link tag="a" target="_blank" :to="{path: '/business/invite', query: {'state': shopType}}">查看全部</router-link>
                        </div>
                        <tabs-scrm :tabs="shopTabs" :tabStyle="tabStyle" @change="handleShopTabs"></tabs-scrm>

                        <div class="shop-list">
                            <div v-if="shopList.length > 0" v-for="(item, index) in shopList" :key="index" class="shop-item">
                                <span v-if="shopType == '1' && item.status == 1" class="pos-state">已登记</span>
                                <span v-if="shopType == '1' && (item.status == 2 || item.status == 3)" class="pos-state win">未登记</span>

                                <div class="row">
                                    <div>
                                        <span class="nickname" :title="item.nickname">{{item.nickname | filterBlank}}</span>
                                        <label v-if="item.level" class="tag score" :class="item.level">{{item.level}}级</label>
                                    </div>
                                    <span>{{item.tel}}</span>
                                </div>
                                <div class="row">
                                    <span>{{shopType == '0' ? '预计到店时间' : '实际到店时间'}}</span>
                                    <span>{{shopType == '0' ? item.appointmentDate : item.visitDate | filterBlank}}</span>
                                </div>
                                <div class="row">
                                    <span>归属门店</span>
                                    <span>{{item.areaName || '--'}}</span>
                                </div>
                                <div class="row">
                                    <span>销售顾问</span>
                                    <span>{{item.advisorName || '--'}}</span>
                                </div>
                                <div class="row">
                                    <span>销售顾问手机号</span>
                                    <div>
                                        <span>{{item.advisorTel || '--'}}</span>
                                        <i v-if="item.advisorTel" class="icon-tel" @click="getDetectTel(item.advisorTel)"></i>
                                    </div>
                                </div>
                            </div>

                            <div v-if="shopList.length == 0" class="no-data">暂无数据</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

         <!-- 外呼弹窗-容联 -->
        <!-- <CallPhoneTempRL v-if="callType == 'RL'" @callPhoneCloseFn="callPhoneCloseFn" :callType="callType" :phone="phone" :dialogVisible="dialogVisibleCallPhone" :detectTelInfo="detectTelInfo" :key="time"></CallPhoneTempRL> -->
        <!-- 天润外呼 -->
        <!-- <CallPhoneTempTR v-if="callType == 'cticloud'" @callPhoneCloseFn="callPhoneCloseFn" :phone="phone" :dialogVisible="dialogVisibleCallPhone"></CallPhoneTempTR> -->
    </div>
</template>

<script>
import TopBar from './components/TopBar'
import TabsScrm from '../../components/TabsScrm'
import * as Http from '@/apis/work'
import moment from 'moment'
import WorkMixins from '@/pages/mixins/WorkMixins'
import { uniqueByAttr } from "@/utils/util.js";
import CallPhoneTempRL from "./components/CallPhoneTempRL";
import CallPhoneTempTR from "./components/CallPhoneTempTR";
import { mapState } from 'vuex'
export default {
    mixins: [WorkMixins],
    components:{
       TopBar,
       TabsScrm,
       CallPhoneTempRL,
       CallPhoneTempTR
    },
    data(){
        return{
            // 跟进数据-日期
            followDate: 'day', 
            clueSort: '2',
            clueOptions: [
                {
                    label: '下发时间正序',
                    value: '2'
                }, {
                    label: '下发时间倒序',
                    value: '3'
                }, {
                    label: '高分线索优先',
                    value: '1'
                }
            ],
            clueList: [],
            followTabStyle: {
                customColor: 'inherit',
                height: '5px'
            },
            followTabs: [
                {
                    name: '0',
                    title: '逾期跟进',
                    count: 0
                }, {
                    name: '1',
                    title: '今日待跟进',
                    count: 0
                }, {
                    name: '2',
                    title: '明日待跟进',
                    count: 0
                }, {
                    name: '3',
                    title: '后日待跟进',
                    count: 0
                },
            ],
            followType: '0',
            followList: [],
            tabStyle: {
                customColor: 'inherit',
                line: 'bottom'
            }, 
            shopTabs: [
                {
                    name: '0',
                    title: '未到店',
                    count: 0
                }, {
                    name: '1',
                    title: '已到店',
                    count: 0
                }
            ],
            shopTotal: 0,
            shopList: [],
            shopType: '0',
            listHeight: '345px',
            cluePage: {
                totalCount: 0,
                page: 1,
                pageSize: 20,
                totalPage: 1
            },
            followPage: {
                totalCount: 0,
                page: 1,
                pageSize: 40,
                totalPage: 1
            },
            shopPage: {
                totalCount: 0,
                page: 1,
                pageSize: 20,
                totalPage: 1
            },
            clueDom: null,
            followDom: null,
            shopDom: null,
            initTimer: null,
            lockTimer: null,
            qiankeQuery:{overtime:1},
            dialogVisibleCallPhone: false,  //拨打电话弹窗
            phone: '',  //当前拨打的销售顾问号码
            callType: '', //（sdkType） byaicc 百应，   alicc 阿里，   RL 容联，   cticloud 天润
            detectTelInfo: '', //该号码信息
            time: '',
            flag: true
        }
    },
    computed: {
        ...mapState(["loginType", "agentInfo"]),
        countLen() {
            return((data) => {
                return String(data).length;
            })
        }
    },
    mounted() {
        window.addEventListener('resize', this.onWindowResize, true);

        // 待处理线索滚动条监听
        this.clueDom = document.querySelector('.clue-list');
        if (this.clueDom) {
            this.clueDom.addEventListener('scroll', this.onClueDomScroll, true);
        }

        // 潜客跟进滚动条监听
        this.followDom = document.querySelector('.follow-panel');
        if(this.followDom) {
            this.followDom.addEventListener('scroll', this.onFollowDomScroll, true);
        }

        // 今日预计滚动条监听
        this.shopDom = document.querySelector('.shop-list');
        if(this.shopDom) {
            this.shopDom.addEventListener('scroll', this.onShopDomScroll, true);
        }

        this.$eventHub.$on('work-invite', ()=> {
            this.initData('init');
        })
    },
    created(){
        this.onWindowResize();
        this.initData('init');
        this.intervalQuery();
        if(this.agentInfo.thirdSeat && this.agentInfo.thirdSeat.platformType == '1'){ //平台类型：1容联，2百应，3天润
            this.callType = 'RL';
        }
        else if(this.agentInfo.thirdSeat && this.agentInfo.thirdSeat.platformType == '3'){ //平台类型：1容联，2百应，3天润
            this.callType = 'cticloud';
        }
    },
    methods: {
        // 所有接口一并请求
        initData(init) {
            Promise.all([
                // 获取待办事项
                this.$fetch.work.getStatTodo(),
                // 获取跟进数据
                this.$fetch.work.getStatFollow(this.getParams('statFollow')),
                // 获取通话数据
                this.$fetch.work.getStatCall(),
                // 待处理线索
                this.$fetch.work.getCluePending(this.getParams('cluePending', 'init')),
                // 潜客跟进状态及其数量统计
                this.$fetch.work.getIntentionStat(),
                // 潜客跟进--DCC邀约员
                this.$fetch.work.getIntentionList(this.getParams('intentionList', 'init')),
                // 今日预计到店数量统计
                this.$fetch.work.getInviteStat(),
                // 今日预计到店
                this.$fetch.work.getTodayList(this.getParams('inviteList', 'init'))
            ]).then((res) => {
                if (res[0]) {
                    const { code, data } = res[0].data;
                    if (code == 200) {
                        // 待办事项
                        this.todoStat = data;
                    }
                } 
                if (res[1]) {
                    const { code, data } = res[1].data;
                    if (code == 200) {
                        // 跟进数据
                        this.followStat = data;
                    }   
                } 
                if (res[2]) {
                    const { code, data } = res[2].data;
                    if (code == 200) {
                        // 通话数据
                        this.callStat = data;
                    } 
                } 
                if (res[3]) {
                    const { code, data } = res[3].data;
                    if (code == 200) {
                        this.listDataMerge(data, 'clueList', 'cluePage', 'id');
                    }
                } 
                if (res[4]) {
                    const { code, data } = res[4].data;
                    if (code == 200) {
                        if (data) {
                            this.followTabs[0].count = data.overtimeTotal;
                            this.followTabs[1].count = data.dayTotal1;
                            this.followTabs[2].count = data.dayTotal2;
                            this.followTabs[3].count = data.dayTotal3;
                        }
                    }
                }
                if (res[5]) {
                    const { code, data } = res[5].data;
                    if (code == 200) {
                        this.listDataMerge(data, 'followList', 'followPage', 'id');
                    }
                } 
                if (res[6]) {
                    const { code, data } = res[6].data;
                    if (code == 200) {
                        if (data) {
                            // 今日预计到店
                            this.shopTotal = data.todayInviteExpectTotal;
                            // 未到店
                            this.shopTabs[0].count = data.todayInviteNoArrivalTotal;
                            // 已到店
                            this.shopTabs[1].count = data.todayInviteArriveTotal;
                        }
                    }
                } 
                if (res[7]) {
                    const { code, data } = res[7].data;
                    if (code == 200) {
                        this.listDataMerge(data, 'shopList', 'shopPage', 'id');
                    }
                }
                if(!init) {
                    this.intervalQuery();
                }
            })
        },
        // 实时刷新 
        intervalQuery() {
            console.log(this.flag)
            if (this.flag) {
                this.initTimer = setTimeout(this.initData, 5000);
            }
        },
        // 获取请求参数
        getParams(type, init) {
            if (type == 'statFollow') {
                return {
                    scope: this.followDate
                }
            } else if (type == 'cluePending') {
                const { page, pageSize } = this.cluePage;
                return {
                    sort: this.clueSort,
                    page: !init ? page : 1,
                    pageSize: pageSize
                }
            } else if (type == 'intentionList') {
                const { page, pageSize } = this.followPage;

                let params = {
                    page: !init ? page : 1,
                    pageSize
                };

                switch (this.followType) {
                    case '0':
                        params.sort = 1;
                        params.overtime = 'yes';
                        break;
                    case '1':
                        params.sort = 2;
                        params.nextFollowDateStartTime = moment(new Date()).format('YYYY-MM-DD 00:00:00');
                        params.nextFollowDateEndTime = moment(new Date()).format('YYYY-MM-DD 23:59:59');
                        break;
                    case '2':
                        params.sort = 2;
                        params.nextFollowDateStartTime = moment().add(1, 'days').format('YYYY-MM-DD 00:00:00');
                        params.nextFollowDateEndTime = moment().add(1, 'days').format('YYYY-MM-DD 23:59:59');
                        break;
                    case '3':
                        params.sort = 2;
                        params.nextFollowDateStartTime = moment().add(2, 'days').format('YYYY-MM-DD 00:00:00');
                        params.nextFollowDateEndTime = moment().add(2, 'days').format('YYYY-MM-DD 23:59:59');
                        break;
                
                    default:
                        break;
                }

                return params;
            } else if (type == 'inviteList') {
                const { page, pageSize } = this.shopPage;
                let date = moment(new Date()).format('YYYY-MM-DD');
                let params = {
                    page: !init ? page : 1,
                    pageSize
                };

                switch (this.shopType) {
                    case '0':
                        params.appointmentDateStartTime = date + ' 00:00:00';
                        params.appointmentDateEndTime = date + ' 23:59:59';
                        params.status = [0, 3];
                        params.sort = 1;
                        break;
                    case '1':
                        params.visitDateStartTime = date + ' 00:00:00';
                        params.visitDateEndTime = date + ' 23:59:59';
                        params.sort = 2;
                        params.status = [1, 2];
                        break;
                
                    default:
                        break;
                }

                return params;
            }
        },
        /**
         * 处理列表数据合并
         * data：接口返回的data数据
         * keyList: 合并到某个数组里
         * keyPage: 复制到某个分页数据里
         * byKey: 根据某key值去重数据，合并
         */
        listDataMerge(data, keyList, keyPage, byKey, merge) {
            const { list, page} = data;
            if(list.length > 0) {
                let arr = [...this[keyList], ...list]
                this[keyList] = uniqueByAttr(arr, byKey);
            }
            this[keyPage].totalCount = page.totalCount;
            this[keyPage].totalPage = page.totalPage;
        },
        // 获取跟进数据
        getStatFollow() {
            this.queryStatFollow(this.getParams('statFollow'))
        },
        // 待处理线索
        getCluePending(reset) {
            this.lockFlag();

            if(reset == 'init') {
                this.clueList = [];
                this.cluePage.page = 1;
            }
            Http.getCluePending(this.getParams('cluePending'), true).then((res) => {
                this.$handleResponse(res, data =>{
                    this.listDataMerge(data, 'clueList', 'cluePage', 'id');
                }, true);
            }).catch(res => {
                console.log(res);
            })
        },
        // 潜客跟进状态及其数量统计
        getFollowStat() {
            Http.getIntentionStat().then((res) => {
                this.$handleResponse(res, data =>{
                    if (data) {
                        this.followTabs[0].count = data.overtimeTotal;
                        this.followTabs[1].count = data.dayTotal1;
                        this.followTabs[2].count = data.dayTotal2;
                        this.followTabs[3].count = data.dayTotal3;
                    }
                }, false);
            }).catch(res => {
                console.log(res);
            })
        },
        // 潜客跟进--DCC邀约员
        getFollowList(reset) {
            this.lockFlag();
            if(reset == 'init') {
                this.followList = [];
                this.followPage.page = 1;
            }

            Http.getIntentionList(this.getParams('intentionList'), true).then((res) => {
                this.$handleResponse(res, data =>{
                    this.listDataMerge(data, 'followList', 'followPage', 'id');
                }, true);
            }).catch(res => {
                console.log(res);
            })
        },
        // 今日预计到店
        getToShopList(reset) {
            this.lockFlag();
            if(reset == 'init') {
                this.shopList = [];
                this.shopPage.page = 1;
            }

            Http.getTodayList(this.getParams('inviteList'), true).then((res) => {
                this.$handleResponse(res, data =>{
                    this.listDataMerge(data, 'shopList', 'shopPage', 'id');
                }, true);
            }).catch(res => {
                console.log(res);
            })
        },
        // 今日预计到店数量统计
        getToShopStat() {
            Http.getInviteStat().then((res) => {
                this.$handleResponse(res, data =>{
                    if (data) {
                        // 今日预计到店
                        this.shopTotal = data.todayInviteExpectTotal;
                        // 未到店
                        this.shopTabs[0].count = data.todayInviteNoArrivalTotal;
                        // 已到店
                        this.shopTabs[1].count = data.todayInviteArriveTotal;
                    }
                }, false);
            }).catch(res => {
                console.log(res);
            })
        },
        // 待处理线索下拉加载更多
        onClueDomScroll() {
            let scrollTop = this.clueDom.scrollTop;
            let clientHeight = this.clueDom.clientHeight;
            let scrollHeight = this.clueDom.scrollHeight;

            if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
                // 请求加载更多
                if (this.cluePage.page >= this.cluePage.totalPage) {
                    return;
                }
                this.cluePage.page++;
                this.getCluePending();
            }
        },
        // 跟进下拉加载更多
        onFollowDomScroll() {
            let scrollTop = this.followDom.scrollTop;
            let clientHeight = this.followDom.clientHeight;
            let scrollHeight = this.followDom.scrollHeight;
            if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
                // 请求加载更多
                if (this.followPage.page >= this.followPage.totalPage) {
                    return;
                }
                this.followPage.page++;
                this.getFollowList();
            }
        },
        // 今日到店下拉加载更多
        onShopDomScroll() {
            let scrollTop = this.shopDom.scrollTop;
            let clientHeight = this.shopDom.clientHeight;
            let scrollHeight = this.shopDom.scrollHeight;

            if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
                // 请求加载更多
                if (this.shopPage.page >= this.shopPage.totalPage) {
                    return;
                }
                this.shopPage.page++;
                this.getToShopList();
            }
        },
        // 线索处理
        toCluesDeal(item) {
            if(item.intentionId && item.intentionId > 0){
                this.$router.push({
                    path: "/work/customerFollow",
                    query: {
                        back: true,
                        id: item.intentionId,
                        userId: item.userId
                    }
                });
            }else{
                this.$router.push({
                    path: "/work/cluesDeal",
                    query: {
                        back: true,  //返回工作台
                        total: this.cluePage.totalCount, //工作台进去需要显示线索处理数量
                        id: item.id,
                        userId: item.userId,
                        sort: this.clueSort
                    }
                });
            }
        },
        // 潜客跟进
        toCustomerFollow(item) {
            this.$router.push({
                path: "/work/customerFollow",
                query: {
                    back: true,  //区分是从工作台进入还是业务管理进入
                    id: item.id,
                    total: this.followTabs[parseInt(this.followType)].count,
                    type: this.followType,
                    userId: item.userId
                }
            });
        },
        lockFlag() {
            this.flag = false;
            this.initTimer && clearTimeout(this.initTimer);
            this.lockTimer && clearTimeout(this.lockTimer)
            this.lockTimer = setTimeout(() => {
                this.flag = true;
                this.intervalQuery();
            }, 6000);
        },
        handleFollowTabs(e) {
            let that = this;
            switch(e){
                case '0':
                    that.qiankeQuery = {overtime:1};
                    break;
                case '1':
                     that.qiankeQuery = {follow_day:1};
                    break;
                case '2':
                     that.qiankeQuery = {follow_day:2};
                    break;
                case '3':
                    that.qiankeQuery = {follow_day:3};
                    break;
            }
            this.followType = e;
            this.followList = [];
            this.getFollowList('init')
        },
        handleShopTabs(e) {
            this.shopType = e;
            this.shopList = [];
            this.getToShopList('init')
        },
        onWindowResize() {
            let height = window.innerHeight;
            this.listHeight = (height - 310) + 'px';
        },
        // 打电话弹窗
        callPhoneCloseFn(){
            this.dialogVisibleCallPhone = false;
        },
        getDetectTel(tel){
            if(window.sessionStorage.getItem('rlZt') == '-1'){
                this.$message({
                    message: '请先在插件（企话宝）登录',
                    type: 'warning',
                    showClose: true
                });
                return;
            }
            if(window.sessionStorage.getItem('c_RLtransferStatus') == '3'){
                this.$message({
                    message: '当前坐席为离线状态，暂不支持拨打电话',
                    type: 'warning',
                    showClose: true
                });
                return;
            }
            const { thirdSeat } = this.agentInfo;
            if(thirdSeat && (!thirdSeat.tel && !thirdSeat.plane)){
                this.$message({
                    message: '您还未设置坐席号，无法使用电话拨打功能，请联系管理员配置。',
                    type: 'warning',
                    showClose: true
                });
                return;
            }
            this.phone = tel;
            this.$fetch.dccSeat.detectTel({tel: tel},true).then(res => {
                this.$handleResponse(res, res=>{
                    this.detectTelInfo = res;
                    if(this.detectTelInfo.userType == 1){    //"userType": 1,//号码类型：0集团，1潜客，2线索，3未知
                        this.toCustomerFollow({id: res.intentionId ,userId: res.userId})
                    }else if(this.detectTelInfo.userType == 2){
                        this.toCluesDeal({id: res.clueId ,userId: res.userId})
                    }else{
                        // this.dialogVisibleCallPhone = true;
                        // this.time = new Date().getTime();
                        console.log('弹窗', this.detectTelInfo)
                        this.$eventHub.$emit('showDialogRL', this.detectTelInfo)
                    }
                },true);
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$store.commit('closeLoading');
            })
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onWindowResize, true);
        if(this.clueDom) {
            this.clueDom.removeEventListener('scroll', this.onClueDomScroll, true);
        }
        if(this.followDom) {
            this.followDom.removeEventListener('scroll', this.onFollowDomScroll, true);
        }
        if(this.shopDom) {
            this.shopDom.removeEventListener('scroll', this.onShopDomScroll, true);
        }

        clearTimeout(this.initTimer);
        clearTimeout(this.lockTimer);

        this.$eventHub.$off('work-invite')
    },
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/work.scss";
.dcc-invite-content {
    padding-top: 40px;

    .card-stat {
        .card-box {
            height: 140px;

            .duration {
                color: #444;
                font-size: 14px;
                span {
                    font-size: 16px;
                    font-weight: bold;
                    vertical-align: middle;
                }
            }
        }
    }

    .card-list {
        margin-top: 10px;
        display: flex;
        align-items: stretch;
        min-height: 300px;

        .head-wrap { 
            color: #212427;
        }
        .card-box {
            height: 100%;
        }

        .pos-state {
            display: inline-block;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
            padding: 3px 10px;
            background-color: #f7a356;
            font-size: 12px;
            color: #fff;

            &.err {
                background-color: #ea5a54;
            }

            &.win {
                background-color: #34b572;
            }

            @media (max-width: 1485px) {
                padding: 2px 6px;
            }
        }
    }

    .todo-clue {
        .clue-panel {
            height: calc(100% - 75px);
            .sort-box {
                margin: 10px;
                height: 34px;
                line-height: 34px;
                display: flex;
                align-items: center;
                border: 1px solid #dcdfe6;
                border-radius: 2px;

                .left-sort {
                    width: 30px;
                    text-align: center;
                    color: #a7b2c0;
                    border-right: 1px solid #dcdfe6;

                    i {
                        font-size: 16px;
                        font-weight: bold;
                        vertical-align: middle;
                    }
                }

                /deep/ .el-select {
                    flex: 1;
                    .el-input__inner {
                        height: 32px;
                        border: none;
                    }
                   .el-input__inner, .el-input__icon {
                        line-height: 32px;
                    }
                } 
            }

            .clue-list {
                margin-top: 10px;
                height: calc(100% - 30px);
                overflow: auto;

                .clue-item {
                    padding: 15px;
                    border-top: 1px solid #eaebf0;
                    font-size: 16px;
                    color: #444;
                    position: relative;
                    cursor: pointer;

                    .user-info {
                        .nickname {
                            display: inline-block;
                            height: 20px;
                            line-height: 21px;
                            max-width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            vertical-align: text-bottom;
                        }
                    }

                    .time {
                        text-align: right;
                        font-size: 14px;
                        color: #a7b2c0;
                    }

                    &:hover {
                        background-color: #f2f8fc;
                    }
                }
            }

            @media (max-width: 1485px) {
                height: calc(100% - 50px);

                .sort-box {
                    height: 30px;
                    line-height: 30px;
                    .left-sort i {
                        font-size: 14px;
                    }
                    /deep/ .el-select {
                        .el-input__inner {
                            height: 28px;
                            border: none;
                        }
                    .el-input__inner, .el-input__icon {
                            line-height: 30px;
                        }
                    } 
                }

                .clue-list {
                    height: calc(100% - 35px);
                    .clue-item {
                        padding: 10px;
                    }
                } 
            }
        }
    }

    .follow-task {
        /deep/ .tabs__scrm .el-tabs--card>.el-tabs__header {
            height: 50px;
            margin-bottom: 10px;

            .el-tabs__item {
                font-size: 18px;
                height: 50px;
                line-height: 50px;

            }

            @media (max-width: 1485px) {
               height: 40px;
                margin-bottom: 10px;

                .el-tabs__item {
                    font-size: 15px;
                    height: 40px;
                    line-height: 40px;

                }
            }
        }

        .pos-rel a {
            position: absolute;
            right: 20px;
            bottom: 25px;
            z-index: 1;
        }

        .follow-panel {
            padding: 0 20px;
            height: calc(100% - 60px);
            overflow: auto;
        }

        .follow-list {
            flex-wrap: wrap;
            .follow-item {
                height: 100%;
                padding: 10px 12px;
                border-radius: 4px;
                border: solid 1px #eaebf0;
                cursor: pointer;
                color: #444;
                font-size: 15px;
                position: relative;

                &:hover {
                    box-shadow: 0px 1px 12px 0px 
                        rgba(0, 0, 0, 0.07);
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                }

                .nickname {
                    flex: 1;
                    font-size: 18px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: keep-all;
                    white-space: nowrap;
                }

                .wechat {
                    margin-left: 5px;
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    background: url('~@/assets/images/work/wechat.png') no-repeat;
                    background-size: contain;
                }
            }
        }

        @media (max-width: 1485px) {
            .pos-rel a {
                bottom: 20px;
            }
            .follow-panel {
                padding: 0 15px;
                height: calc(100% - 51px);
            }

            .follow-list {
                .follow-item {
                    padding: 8px 10px;

                    .nickname {
                        font-size: 16px;
                    }
                }
            }
        }
    }

    .today-shop {
        /deep/ .el-tabs__header {
            margin-bottom: 0;
        }

        .shop-list {
            height: calc(100% - 98px);
            overflow: auto;
            .shop-item {
                padding: 20px 15px;
                font-size: 15px;
                color: #212427;
                position: relative;

                .row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    line-height: 1;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    &>span:first-child {
                        color: #a7b2c0;
                    }

                    .nickname {
                        display: inline-block;
                        max-width: 100px;
                        height: 25px;
                        line-height: 25px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        vertical-align: middle;
                        font-size: 18px;
                        color: #212427;
                    }

                    .icon-tel {
                        display: inline-block;
                        width: 26px;
                        height: 26px;
                        margin-left: 5px;
                        background: url('~@/assets/images/icons/icon-tel-circle.png') no-repeat;
                        background-size: contain;
                        vertical-align: middle;
                        cursor: pointer;
                    }
                }
            }

            @media (max-width: 1485px) {
                height: calc(100% - 78px);

                .shop-item {
                    padding: 18px 12px;
                    font-size: 14px;

                    .row {
                        .icon-tel {
                            width: 24px;
                            height: 24px;
                            margin-left: 2px;
                        }

                        .nickname {
                            height: 20px;
                            line-height: 21px;
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }

    .todo-clue, .today-shop {
        /deep/ .tabs__scrm .el-tabs--card>.el-tabs__header {
            .el-tabs__nav {
                width: 100%;
                box-sizing: border-box;
                .el-tabs__item {
                    width: 50%;
                    font-size: 16px;
                    text-align: center;
                }
            }

            @media (max-width: 1485px) {
                height: 40px;
                .el-tabs__nav .el-tabs__item {
                    height: 40px;
                    font-size: 14px;
                    line-height: 40px;
                }
            }
        }
    }

    .follow-panel, .clue-list, .shop-list {
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
}
</style>

