<template>
    <div class="audit-follow-dialog">
        <el-dialog
            :visible.sync="dialogVisible"
            width="900px"
            :before-close="handleClose"
            v-loading="loading">

            <div slot="title">
                <div class="title">{{title}}<span>({{fromTotal}})</span></div>
                <div class="right-call-out" v-if="loginType != 'manage'">
                    <!-- <CallOutTempTR :tel="auditInfo.tel" :dccGroupId="auditInfo.dccGroupId" v-if="sdkType == 'cticloud'"></CallOutTempTR> -->
                    <CallOutTempRL :tel="auditInfo.tel" :dccGroupId="auditInfo.dccGroupId" v-if="sdkType == 'RL'"></CallOutTempRL>
                </div>
            </div>

            <el-row class="audit-follow" type="flex" :gutter="10">
                <el-col :span="12">
                    <div class="left-user">
                        <div class="user-head">
                            <div class="flex-a-center">
                                <span class="nickname" :title="auditInfo.nickname">{{auditInfo.nickname | filterBlank}}</span>
                                <span class="tel">{{auditInfo.tel}}</span>
                            </div>
                            <div class="m-t-10">
                                <label>{{(auditInfo.grade !=0 && auditInfo.grade != 11) ? (auditInfo.grade + '分') : '--'}}</label>
                                <label v-if="auditInfo.followTimes">跟进{{auditInfo.followTimes}}次</label>
                                <label v-if="auditInfo.level">{{auditInfo.level}}</label>

                                <span v-if="childAllotData.level">
                                    <label class="level">{{childAllotData.level}}级</label>
                                </span>
                                <span v-else>
                                    <label v-if="auditInfo.oldLevel">{{auditInfo.oldLevel}}级</label>
                                    <i v-if="auditInfo.oldLevel" class="m-r-5"> → </i>
                                    <label v-if="auditInfo.newLevel">{{auditInfo.newLevel}}级</label>
                                </span>
                            </div>
                            <router-link v-if="fromDataType == '1' && fromFollowId" class="all-archives" tag="a" target="_blank" 
                                :to="{path: '/business/potential/detail', query: {'id': fromFollowId}}">
                                全部档案
                            </router-link>
                        </div>

                        <ul class="user-details">
                            <li class="row-item">
                                <label>客户姓名</label>
                                <span>{{auditInfo.nickname | filterBlank}}</span>
                                <span>{{auditInfo.gender == 1 ? '男' : auditInfo.gender == 2 ? '女' : '未知'}}</span>
                            </li>
                            <li class="row-item">
                                <label>手机号码</label>
                                <span>{{auditInfo.tel | filterBlank}}</span>
                            </li>
                            <li class="row-item">
                                <label>微信号</label>
                                <span>
                                    {{auditInfo.wechatNumber | filterBlank}}
                                    <i v-if="auditInfo.wechatAdded">(已加微信)</i>
                                </span>
                            </li>
                            <!-- 战败审核 || 降级监控 -->
                            <ul v-if="auditInfo.intentionInfo && auditInfo.intentionInfo.length > 0"
                                v-for="(item, index) in auditInfo.intentionInfo" :key="index">
                                <li class="row-item">
                                    <label>归属门店{{index + 1}}</label>
                                    <span>{{item.areaName | filterBlank}}</span>
                                </li>
                                <li class="row-item">
                                    <label>意向车型{{index + 1}}</label>
                                    <span>{{item.model | filterBlank}}</span>
                                </li>
                                <li class="row-item">
                                    <label>客户来源{{index + 1}}</label>
                                    <span>{{item.fromTopName | filterBlank}}</span>
                                </li>
                            </ul>
                            <!-- 无效审核 -->
                            <ul v-if="auditType == 'invalid'">
                                <li class="row-item">
                                    <label>归属门店</label>
                                    <span>{{auditInfo.areaName | filterBlank}}</span>
                                </li>
                                <li class="row-item">
                                    <label>意向车型 </label>
                                    <span>{{auditInfo.model | filterBlank}}</span>
                                </li>
                                <li class="row-item">
                                    <label>客户来源1</label>
                                    <span>{{auditInfo.fromTopName | filterBlank}}</span>
                                </li>
                                <li class="row-item">
                                    <label>客户来源2</label>
                                    <span>{{auditInfo.fromSecondName | filterBlank}}</span>
                                </li>
                            </ul>
                            <li class="row-item">
                                <label>购车区域</label>
                                <span>{{auditInfo.provinceName}}-{{auditInfo.cityName}}-{{auditInfo.regionName}}</span>
                            </li>
                            <li class="row-item">
                                <label>购车指标</label>
                                <span>{{auditInfo.buyQuota == 1 ? '有' : auditInfo.buyQuota == 2 ? '无' : '未知'}}</span>
                            </li>
                            <li class="row-item">
                                <label>购车类型</label>
                                <span>{{auditInfo.buyType == 1 ? '首次购车' : auditInfo.buyType == 2 ? '增购' : auditInfo.buyType == 3 ? '置换' : '其他'}}</span>
                            </li>
                            <li class="row-item">
                                <label>是否贷款</label>
                                <span>{{auditInfo.isMortgage == 1 ? '是' : auditInfo.buyQuota == 2 ? '否' : '未知'}}</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="right-follow">
                        <i v-if="auditType == 'defeat'" class="audit-result" :class="auditInfo.reviewStatus == 1 ? 'defeat-agree' : auditInfo.reviewStatus == 2 ? 'defeat-reject' : ''"></i>
                        <i v-if="auditType == 'invalid'" class="audit-result" :class="auditInfo.reviewStatus == 1 ? 'invalid-agree' : auditInfo.reviewStatus == 2 ? 'invalid-reject' : ''"></i>
                        <div class="follow-head">跟进记录</div>
                        
                        <follow-record class="follow-form" 
                            :record-list="followList" 
                            :scrollEvent="true" 
                            @event-scroll="handleFollowScroll" 
                            :showCommentBtn="true"
                            @commentSuccess="commentSuccess"></follow-record>
                    </div>
                </el-col>
            </el-row>

            <!-- 审核类型按钮操作 -->
            <div v-if="auditType == 'defeat'" slot="footer" class="p-b-10">
                <el-button class="blue_font_white_bg" @click="handlePrev" round>上一条</el-button>
                <el-button :disabled="auditInfo.reviewStatus != 0" class="blue_font_white_bg" @click="handleReject" round>拒绝战败</el-button>
                <el-button :disabled="auditInfo.reviewStatus != 0" class="blue_font_white_bg" @click="handleAgree" round>同意战败</el-button>
                <el-button class="blue_font_white_bg" @click="handleNext" round>下一条</el-button>
            </div>
            <div v-if="auditType == 'invalid'" slot="footer" class="p-b-10">
                <el-button class="blue_font_white_bg" @click="handlePrev" round>上一条</el-button>
                <el-button :disabled="auditInfo.reviewStatus != 0" class="blue_font_white_bg" @click="handleReject" round>驳回无效</el-button>
                <el-button :disabled="auditInfo.reviewStatus != 0" class="blue_font_white_bg" @click="handleAgree" round>同意无效</el-button>
                <el-button class="blue_font_white_bg" @click="handleNext" round>下一条</el-button>
            </div>
            <div v-if="auditType == 'level'" slot="footer" class="p-b-10">
                <el-button class="blue_font_white_bg" @click="handlePrev" round>上一条</el-button>
                <el-button :disabled="childAllotData.level" class="blue_font_white_bg" @click="handleReject" round>干预变更</el-button>
                <el-button class="blue_font_white_bg" @click="handleNext" round>下一条</el-button>
            </div>
            <div v-if="auditType == 'follow'" slot="footer" class="p-b-10">
                <el-button class="blue_font_white_bg" @click="handlePrev" round>上一条</el-button>
                <el-button class="blue_font_white_bg" @click="handleNext" round>下一条</el-button>
            </div>
        </el-dialog>

        <audit-allot-dialog v-if="dialog.auditAllot" :auditId="dialog.allotById" :auditType="auditType" :dccGroupId="auditInfo.dccGroupId" @cancelAudit="cancelAudit" @successAudit="successAudit"></audit-allot-dialog>
    </div>
</template>

<script>
import AuditAllotDialog from './AuditAllotDialog'
import CallOutTempTR from "./CallOutTempTR";
import CallOutTempRL from "./CallOutTempRL";
import * as Http from '@/apis/work'
import FollowRecord from '@/components/follow-record/FollowRecord'
import { mapState } from 'vuex'
export default {
    components: {
        AuditAllotDialog,
        CallOutTempTR,
        CallOutTempRL,
        FollowRecord
    },
    props: {
        // defeat: 战败审核  invalid: 无效审核  level：降级监控  follow：跟进点评
        auditType: {
            type: String,
            default: 'defeat'
        },
        // 审核跟进总数量
        auditTotal: {
            type: Number,
            default: 0
        },
        // 记录id-用于查询左边
        auditId: {
            type: Number,
            default: null
        },
        // 当前档案id-用于获取上一条，下一条档案
        currentId: {
            type: Number,
            default: null
        },
        // 跟进id-用于查询右边跟进记录 （战败审核、降级监控-intentionId，无效审核-clueId，跟进点评-objectId）
        followId: {
            type: Number,
            default: null
        },    
        // 跟进记录类型，1潜客跟进，2线索跟进
        dataType: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            title: '',
            loading: false,
            dialogVisible: true,
            dialog: {
                auditAllot: false,
                allotById: 0,  // 根据，战败审核、降级监控-intentionId，无效审核-clueId，跟进点评-objectId来分配
            },
            comments: '',
            auditInfo: {
                dccGroupId: '', // 组id
                nickname: '',  // 客户姓名
                tel: '', // 电话
                grade: 0,  // 分数
                level: '',  // 意向等级
                followTimes: 0, // 跟进次数
                gender: 0, // 性别:0未知，1男，2女
                wechatNumber: '', // 微信号
                wechatAdded: 0, // 是否添加微信号：1是，0否
                buyType: 1, // 购买类型：'购买类型，1首次购车，2增购，3置换，4其他
                buyQuota: 0, // 购车指标：购买指标，0未知，1有，2无
                isMortgage: 0, // 是否贷款，0未知，1是，2否
                provinceName: '',  // 省
                cityName: '',  // 市
                regionName: '',  // 区
                intentionInfo: [], // 来源信息
                reasonDefeatId: null, // 战败类型ID
                reasonDefeat: '', // 战败类型
                remark: '', // 备注
            },
            followList: [],  // 跟进记录列表
            followPage: {
                totalCount: 0,
                page: 1,
                pageSize: 10,
                totalPage: 1
            },
            fromTotal: 0,  // 审核表单总数量
            fromAuditId: null,  // 当前的记录id
            fromCurrentId: null,  // 当前的档案id
            fromFollowId: null, // 当前的跟进id
            fromDataType: null, // 当前跟进类型
            commentArr: [],  // 点评框数组
            commentData: {}, // 点评信息
            sdkType: '', // byaicc 百应，   alicc 阿里，   RL 容联，   cticloud 天润
            childAllotData: {}, // 分配或降级的回显数据
        }
    },
    created() {
        this.fromAuditId = this.auditId; 
        this.fromCurrentId = this.currentId;
        this.fromFollowId = this.followId;
        this.fromTotal = this.auditTotal;
        this.fromDataType = this.dataType;

        this.sdkType = window.localStorage.getItem('c_callSDKTools');
        this.initData();
    },
    computed: {
        ...mapState(["loginType"]),
    },
    methods: {
        initData() {
            switch (this.auditType) {
                case 'defeat':
                    this.title = '战败审核';
                    this.getAuditDetail('defeatDetail');
                    break;
                case 'invalid':
                    this.title = '无效审核';
                    this.getAuditDetail('invaildDetail');
                break;
                case 'level':
                    this.title = '降级监控';
                    this.getAuditDetail('levelDownDetail');
                    break;
                case 'follow':
                    this.title = '跟进点评';
                    if(this.fromDataType == 1) {
                        // 潜客跟进详情
                        this.getAuditDetail('followArchiveDetail');
                    } else if(this.fromDataType == 2) {
                        // 线索跟进详情
                        this.getAuditDetail('followClueDetail');
                    }
                    break;
                default:
                    break;
            }
            this.getFollowRecord('init');
        },
        // 获取审核详情
        getAuditDetail(queryName) {
            let params = {
                id: this.fromAuditId,
            }
            Http[queryName](params).then((res) => {
                this.$handleResponse(res, data => {
                    this.auditInfo = Object.assign(this.auditInfo, data);
                },true)
            })
        },
        // 获取跟进记录
        getFollowRecord(reset) {
            if(reset == 'init') {
                this.followList = [];
                this.followPage.page = 1;
            }

            const { page, pageSize } = this.followPage;

            let params = {
                id: this.fromFollowId,
                typeId: this.fromDataType,
                page,
                pageSize
            }
            this.$fetch.common.followListByType(params, false).then((res) => {
                this.$handleResponse(res, data => {
                    const { list, page } = data;
                    if (list && list.length > 0) {
                        this.followList = [...this.followList, ...list];
                    }
                    this.followPage.totalCount = page.totalCount;
                    this.followPage.totalPage = page.totalPage;
                }, false)
            }).catch(err => {
                console.log(err)
            })
        },
        handleFollowScroll() {
            // 请求加载更多
            if (this.followPage.page >= this.followPage.totalPage) {
                return;
            }
            this.followPage.page++;
            this.getFollowRecord();
        },
        handleReject() {
            this.dialog.allotById = this.fromAuditId
            this.dialog.auditAllot = true;
        },
        handleAgree() {
            let qureName = this.auditType == 'defeat' ? 'defeatAgree' : 'clueInvalidAgree';
            Http[qureName]({id: this.fromAuditId}).then((res)=> {
                this.$handleResponse(res, data => {
                    if(data) {
                        this.$message.success('操作成功');
                        this.fromTotal--;
                        this.initData();
                        this.$emit('success');
                    }
                },true)
            })
        },
        // 点评成功
        commentSuccess() {
            this.fromTotal--;
            this.initData();
            this.$emit('success');
        },
        // 下一条
        handleNext() {
            this.handleFrom('next');
        },
        // 上一条
        handlePrev() {
            this.handleFrom('prev');
        },
        // 操作上一条或下一条
        handleFrom(type) {
            if(window.localStorage.getItem('objectDeclareFunc') == 'EvtConnected' || window.localStorage.getItem('stateActionRL') == 'EvtConnected'){
                this.$message({
                message: '当前正在通话，请不要离开',
                type: 'warning',
                showClose: true
                });
                return;
            }
            this.childAllotData = {};
            // 待办事项列表
            let list = this.$parent.todoList;
            // 当前审核记录在待办事项列表的索引
            let currentIndex = list.findIndex(item => item.id == this.fromCurrentId);
            console.log(currentIndex, this.fromCurrentId)
            // 下一步
            if(type == 'next') {
                // 如果为最后一条
                if (currentIndex == (list.length - 1)) {
                    this.handleConfirm('下');
                    return;
                }
                this.handleSetId(list[currentIndex + 1]);
            } else {  // 上一步
                // 如果为第一条
                if (currentIndex == 0) {
                    this.handleConfirm('上')
                    return;
                }
                this.handleSetId(list[currentIndex - 1]);
            } 
            this.initData();

        },
        // 执行显示或取消点评框
        handleComment(index, type) {
            this.$set(this.commentArr, index, type)
        },
        // 设置id
        handleSetId(data) {
            console.log(data)
            const { id, intentionId, clueId, dataType, objectId } = data;
            this.fromCurrentId = id;
            // 传值数据类型  线索&潜客
            switch (this.auditType) {
                case 'defeat':  // 战败为潜客
                    this.fromDataType = 1;
                    this.fromFollowId = intentionId;
                    // 审核记录id
                     this.fromAuditId = id;
                    break;
                case 'invalid': // 无效为线索
                    this.fromDataType = 2;
                    this.fromFollowId = clueId;
                    // 审核记录id
                    this.fromAuditId = id;
                    break;
                case 'level': // 降级为潜客
                    this.fromDataType = 1;
                    this.fromFollowId = intentionId;
                    // 审核记录id
                    this.fromAuditId = id;
                    break;
                case 'follow': // 跟进点评动态取类型
                    this.fromDataType = dataType;
                    this.fromFollowId = objectId;
                    // 审核记录id
                    this.fromAuditId = objectId;
                    break;
                default:
                    break;
            }
        },
        // 执行弹出对话框
        handleConfirm(msg) {
            this.$confirm(`无${msg}一条数据，是否返回工作台？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('cancel')
            }).catch(() => {});
        },
        cancelAudit() {
            this.dialog.auditAllot = false;
        },
        successAudit(data) {
            this.dialog.auditAllot = false;
            this.fromTotal--;
            // 降级监控回显
            if(data.level) {
                this.childAllotData.level = data.level;
            }

            this.initData();
            this.$emit('success');
        },
        handleClose() {
            if(window.localStorage.getItem('objectDeclareFunc') == 'EvtConnected' || window.localStorage.getItem('stateActionRL') == 'EvtConnected'){
                this.$message({
                message: '当前正在通话，请不要离开',
                type: 'warning',
                showClose: true
                });
                return;
            }
            this.$emit('cancel')
        },
    }
}
</script>

<style lang="scss" scoped>
.audit-follow-dialog { 

    .el-dialog__header {
        position: relative;
        .title {
            font-size: 18px;
            color: #444;

            span {
                padding-left: 5px;
                color: #b2b2b2;
            }
        }

        .right-call-out{
            position: absolute;
            right: 60px;
            top: 12px;
        }
    }

    /deep/ .el-dialog__body {
        padding: 20px 20px 10px 20px;
    }

    .audit-follow {
        .left-user, .right-follow {
            border: 1px solid #eaebf0;
        }

        .align-t {
            margin-left: 5px;
            vertical-align: bottom;
            /deep/ .el-radio-button--medium .el-radio-button__inner {
                padding: 10px 15px;
            }
        }

        .user-head {
            height: 90px;
            background-color: #5684ff;
            color: #fff;
            padding: 15px 15px 20px;
            position: relative;

            .flex-a-center {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }

            .nickname {
                max-width: 275px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                font-size: 18px;
                margin-right: 10px;
            }

            .tel {
                padding-top: 3px;
                display: inline-block;
                font-size: 16px;
            }

            p {
                margin-top: 5px;
                color: #fff;
                font-size: 14px;
            }

            label {
                padding: 0 6px;
                height: 20px;
                line-height: 18px;
                font-size: 12px;
                display: inline-block;
                border: 1px solid #fff;
                margin-right: 5px;
                border-radius: 2px;

                &.level {
                    border: 1px solid #f7a356;
                    color: #f7a356;
                }
            }

            .all-archives {
                position: absolute;
                right: 15px;
                bottom: 15%;
                transform: translateY(-15%);
                z-index: 1;
                width: 80px;
                height: 30px;
                line-height: 30px;
                background-color: rgba($color: #fff, $alpha: 0.1);
                border-radius: 16px;
                color: #fff;
                text-align: center;
                cursor: pointer;
            }
        }

        .user-details {
            padding: 15px 15px 0;
            height: 430px;
            overflow-y: auto;
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

            .row-item {
                margin: 5px 0 10px;

                label {
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                }

                span {
                    margin-left: 20px;
                }

                i {
                    padding-left: 5px;
                    font-style: normal;
                    color: #3d7eff;
                }
            }
        }

        .follow-head {
            height: 40px;
            padding: 0 10px;
            line-height: 40px;
            font-size: 16px;
            background-color: #f4f7fb;
            color: #212427;
            font-weight: bold;
            border-bottom: 1px solid #eaebf0;

        }

        .right-follow{
            position: relative;
            .audit-result {
                position: absolute;
                right: 0;
                top: 0;
                z-index: 9;
                width: 104px;
                height: 81px;
                background-repeat: no-repeat;

                &.defeat-agree {
                    background-image: url('~@/assets/images/work/defeat-agree.png');
                }

                &.defeat-reject {
                    background-image: url('~@/assets/images/work/defeat-reject.png');
                }

                &.invalid-agree {
                    background-image: url('~@/assets/images/work/invalid-agree.png');
                }

                &.invalid-reject {
                    background-image: url('~@/assets/images/work/invalid-reject.png');
                }
            }
        }

        .follow-form {
            height: 480px;
            padding: 20px 15px 0;
            overflow-y: auto;
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

            .step-item {
                padding-bottom: 30px;
                padding-left: 20px;
                border-left: 1px dashed #dce1e7;
                position: relative;

                .follow-oper {
                    position: absolute;
                    top: -5px;
                    right: 0;
                    z-index: 1;

                    span {
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        background-size: contain;
                        margin-left: 10px;
                        cursor: pointer;
                    }

                    .icon-comments {
                        background-image: url('~@/assets/images/icons/icon-comments.png');
                    }

                    .icon-audio {
                        background-image: url('~@/assets/images/icons/icon-audio.png');
                    }
                }

                .date {
                    height: 30px;
                    font-size: 16px;
                    color: #444;
                    line-height: 1;
                }

                &:last-child {
                    padding-bottom: 0;
                }

                &::before {
                    content: "";
                    position: absolute;
                    left: -6px;
                    top: 0;
                    width: 12px;
                    height: 12px;
                    background-color: #3d7eff;
                    border-radius: 50%;
                    z-index: 2;
                }

                .comments-box {
                    margin-top: 6px;

                    /deep/ .el-textarea textarea {
                        background-color: #f1f5ff;
                        border-radius: 0;
                    }
                }
            }
        }
    }

    @media (max-width: 1485px) {
        .audit-follow {
            .follow-head {
                height: 36px;
                line-height: 36px;
                font-size: 14px;
            }

            .follow-form {
                height: calc(100% - 35px);
            }
        }

        .blue_font_white_bg.el-button {
            padding: 9px 15px;
        }
    }
}
</style>

