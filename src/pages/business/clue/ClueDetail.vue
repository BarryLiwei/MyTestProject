<template>
    <div class="clue-detail-page m-20">
        <bread-crumb></bread-crumb>

        <div class="common-box detail-wrap m-t-20">
            <div class="text-right m-b-20">
                <!--  1：跟进中  2：无效  3: 已建档  4: 无效审核中 -->
                <el-button type="primary" class="w-60" round size="small"  @click="distributeFn()" v-if="info && [1,2,3].indexOf(info.status)>-1" :disabled="['dcc_supervisor','dcc_group_leader','administrator'].indexOf(roleKey)==-1">分配</el-button>
                <!-- <el-button type="primary" class="w-60" round size="small"  @click="handleActive()" v-if="info && info.status == 2" :disabled="['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1">激活</el-button> -->
                <el-button type="primary" class="w-60" round size="small"  @click="handleClue" v-if="info && info.status == 1" :disabled="roleKey!='dcc_inviter'">处理</el-button>
                <el-button class="blue_font_white_bg" plain round size="small" v-if="info && info.intentionId"  @click="seeArchive">查看档案</el-button>
            </div>
            <div class="flex">
                <div class="flex-1 detail-left">
                <step-title :step="{'title': '线索信息'}"></step-title>

                <el-form ref="form" label-position="right" label-width="150px" class="m-t-20">
                    <el-form-item label="线索状态"> {{ info.statusName | filterBlank}} </el-form-item>
                    <el-form-item label="线索类型"> {{ info.clueTypeName | filterBlank}} </el-form-item>
                    <el-form-item label="处理坐席组"> {{ info.dccGroupName | filterBlank}} </el-form-item>
                    <el-form-item label="处理DCC"> {{ info.dccName | filterBlank}} </el-form-item>
                    <el-form-item label="客户姓名"> {{ info.nickname | filterBlank}} </el-form-item>
                    <el-form-item label="手机号码"> {{ info.tel | filterBlank}} </el-form-item>
                    <el-form-item label="线索评分"> {{ info.grade!=11?info.grade:'--' | filterBlank}} <span v-if="info.grade!=11">分</span></el-form-item>
                    <el-form-item label="归属门店"> {{ info.areaName | filterBlank}} </el-form-item>
                    <el-form-item label="意向车型"> {{ info.model | filterBlank}} </el-form-item>
                    <el-form-item label="客户来源"> {{ customeFrom | filterBlank}}</el-form-item>
                    <el-form-item label="购车区域"> {{ buyPlace | filterBlank }}</el-form-item>
                    <el-form-item label="购车指标"> {{ buyQuotaText | filterBlank}} </el-form-item>
                    <!-- 后端说没有购车类型和贷款，跟产品说去掉 -->
                    <!-- <el-form-item label="购车类型"> {{ info.areaName | filterBlank}} </el-form-item>
                    <el-form-item label="是否贷款"> {{ info.areaName | filterBlank}} </el-form-item> -->
                </el-form>
                </div>
                <div class="w-100"></div>
                <div class="flex-1 detail-right">
                    <step-title :step="{'title': '跟进记录'}"></step-title>

                    <follow-record 
                        class="m-t-20 p-20 clue-follow-record reset-scrollbar" 
                        :record-list="recordList" 
                        :scrollEvent="true" 
                        @event-scroll="handleFollowScroll"
                    ></follow-record>
                </div>
            </div>
        </div>

         <!-- 分配 -->
        <distribute v-if="showDistribute" :config="disConfig" @close="closeDistribute" :loading="dialogLoading"></distribute>

        <!-- 激活 -->
        <actived v-if="showActived" :config="actConfig" @close="closeActived" :loading="dialogLoading"></actived>
    </div>
</template>

<script>
// 此组件为业务管理中查看客户档案的公共页面，包括线索管理，潜客管理，邀约管理，订单管理，战败管理等客户档案
import { mapGetters } from 'vuex'; 
import BreadCrumb from '@/components/bread/BreadCrumb';
import StepTitle from '@/components/step/StepTitle';
import FollowRecord from '@/components/follow-record/FollowRecord'
import Distribute from '@/pages/business/components/Distribute'
import Actived from '@/pages/business/components/Actived'
export default {
    components: {
        BreadCrumb,
        StepTitle,
        FollowRecord,
        Distribute,
        Distribute,
        Actived
    },
    data(){
        return {
            info:{},
            showDistribute: false, // 分配弹窗
            showActived: false, // 激活弹窗
            recordList: [], // 跟进列表
            followPage: {
                totalCount: 0,
                page: 1,
                pageSize: 10,
                totalPage: 1
            },
            dialogLoading: false, // 分配，激活弹窗点击保存的时候
        }
    },
    created(){
        this.editId = this.$route.query.id;
        this.getDetail();
        this.getFollowList('init');
    },
    computed:{
        ...mapGetters(['roleKey']),
        customeFrom(){
            let arr=[];
            if(this.info && this.info.fromTopName){
                arr.push(this.info.fromTopName)
            }
            if(this.info && this.info.fromSecondName){
                arr.push(this.info.fromSecondName)
            }
            return arr.join('--')
        },
        buyPlace(){
            let arr=[];
            if(this.info && this.info.provinceName){
                arr.push(this.info.provinceName)
            }
            if(this.info && this.info.cityName){
                arr.push(this.info.cityName)
            }
            if(this.info && this.info.regionName){
                arr.push(this.info.regionName)
            }
            return arr.join('--')
        },
        buyQuotaText(){
            let text = '';
            if(this.info){
                switch(this.info.buyQuota){
                    case 0: text="未知";break;
                    case 1: text="有"; break;
                    case 2: text="无"; break;
                }
            }
            return text;
        }
    },
    methods: {
        getDetail(){
            this.$fetch.business.clueDetail({'id': this.editId}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.info = res;
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        getFollowList(reset){
            if(reset == 'init') {
                this.recordList = [];
                this.followPage.page = 1;
            }
            const { page, pageSize } = this.followPage;
            let params = {
                typeId: 2, // 类型：1潜客，2线索
                id: this.editId,
                page,
                pageSize
            }
            this.$fetch.common.followListByType(params).then((res)=>{
                this.$handleResponse(res, data=>{
                    const { list, page } = data;
                    if (list && list.length > 0) {
                        this.recordList = [...this.recordList, ...list];
                    }
                    this.followPage.totalCount = page.totalCount;
                    this.followPage.totalPage = page.totalPage;
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFollowScroll() {
            // 请求加载更多
            if (this.followPage.page >= this.followPage.totalPage) {
                return;
            }
            this.followPage.page++;
            this.getFollowList();
        },
        handleClue(){ // 处理
            this.$router.push({'path': '/work/cluesDeal', query:{'id': this.info.id, 'userId': this.info.userId}})
        },
        seeArchive(){
            this.$router.push({'path':'/business/potential/detail', query: {'id': this.info.intentionId}});
        },
        distributeFn(){ // 分配弹窗
            this.disConfig = {
                title: '分配',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                selectId: [this.editId], // 选择的列表id
                tip: '',
            }
            this.$fetch.business.assignDCCList({'ids':this.disConfig.selectId,'operate': 'assign'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.disConfig.listTotal = res.listTotal;
                    if(res.listTotal ==1){
                        this.disConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showDistribute = true;
                        this.dialogLoading=false;
                    }else if(res.listTotal > 1){
                        this.$message.error("所选线索分别归属多个组，不能被分配")
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前线索不符合要求'
                        })
                    }
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        closeDistribute(type, val){ // 分配弹窗关闭
            if(type == 'cancel'){
                this.showDistribute = false;
                this.dialogLoading=false;
                return
            }
            let params = Object.assign({'ids':this.disConfig.selectId},val);
            this.dialogLoading=true;
            this.$fetch.business.clueAssign(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('分配成功');
                    this.showDistribute = false;
                    this.getDetail();
                    this.getFollowList('init');
                },true)
                this.dialogLoading=false;
            }).catch(()=>{
                this.dialogLoading=false;
                this.$store.commit('closeLoading');
            })
        },
        handleActive(){ // 激活弹窗
            this.actConfig = {
                title: '激活',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                selectId: [this.editId], // 选择的列表id
                tip: '线索激活状态变为“待处理”由所选坐席组及对应人员进行跟进处理',
            }

            this.$fetch.business.assignDCCList({'ids':this.actConfig.selectId,'operate': 'invalidActive'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.actConfig.listTotal = res.listTotal; // listTotal 取值大于等于1，如果没有组，报非200，单条的激活有且只有一个组
                    if(res.listTotal ==1){
                        this.actConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showActived = true;
                        this.dialogLoading=false;
                    }else if(res.listTotal > 1){
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.groupOptions = [];
                        this.actConfig.tip = '您所选中的线索分别归属多个组，批量激活后由原处理的DCC继续处理';
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前线索不符合要求'
                        })
                    }
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        closeActived(type, val){ // 激活弹窗关闭
            if(type == 'cancel'){
                this.showActived = false;
                this.dialogLoading=false;
                return
            }
            let params = Object.assign({'ids':this.actConfig.selectId},val);
            this.dialogLoading=true;
            this.$fetch.business.InvalidActive(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('激活成功');
                    this.showActived = false;
                    this.getDetail();
                    this.getFollowList('init');
                },true)
                this.dialogLoading=false;
            }).catch(()=>{
                this.dialogLoading=false;
                this.$store.commit('closeLoading');
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.detail-wrap {
    padding: 30px 20px;
}
.el-form-item {
    margin-bottom: 4px;
}

.clue-follow-record {
    max-height: 780px;
    overflow-y: auto;
}
</style>


