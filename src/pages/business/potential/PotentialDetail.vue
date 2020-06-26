<template>
    <div class="potential-detail-page m-20">
        <bread-crumb></bread-crumb>

        <div class="common-box  m-t-20 por">
            <tabs-scrm ref="tabs" :tabs="tabs" @change="changeTab" :tabStyle="{'height':'3px', 'line':'top'}"></tabs-scrm>

            <div class="detail-btn">
                <!-- 跟进状态： 0 跟进中，1已成交  2:战败  3 已下发  4：审核中(战败审核中) -->
                <el-button type="primary" class="w-60" round size="small"  @click="distributeFn" v-if="viewStatus != 4"  :disabled="(['dcc_supervisor','dcc_group_leader','administrator'].indexOf(roleKey)==-1)">分配</el-button>
                <el-button type="primary" class="w-60" round size="small"  @click="handleActive" v-if="viewLevel == 'F'" :disabled="(['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1)" >激活</el-button>
                <el-button type="primary" class="w-60" round size="small"  @click="handleFollow" v-if="viewLevel != 'F'" :disabled="roleKey!=='dcc_inviter'">跟进</el-button>
            </div>

            <!-- dcc详情 -->
            <dcc-archive ref="dccArchive"  v-if="activedTab == 'dcc'" :info="info"></dcc-archive>

            <!-- 门店详情 -->
            <area-archive v-if="activedTab == 'area'" :tags="areaArr"></area-archive>
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
import TabsScrm from '@/components/TabsScrm';
import BreadCrumb from '@/components/bread/BreadCrumb';
import Distribute from '@/pages/business/components/Distribute'
import Actived from '@/pages/business/components/Actived'
import AreaArchive from './component/AreaArchive'
import DccArchive from './component/DccArchive'
export default {
    components: {
        TabsScrm,
        BreadCrumb,
        Distribute,
        Actived,
        AreaArchive,
        DccArchive
    },
    data(){
        return {
            tabs: [{'title': 'DCC档案', "name": 'dcc', 'count': '1'}],
            activedTab: 'dcc',
            info: {},
            showDistribute: false, // 分配弹窗
            showActived: false, // 激活弹窗
            viewStatus: '', // 档案的状态
            viewLevel: '', // 档案的等级
            dialogLoading: false, // 分配，激活弹窗点击保存的时候
        }
    },
    created(){
        this.areaArr=[]; // 门店数据
        this.getLevelOption(); // 激活的弹窗用到
        this.potentialId = this.$route.query.id; // 潜客id

        // 就是dcc档案详情是通过潜客id 去获取，而且dcc档案只有一个
        this.getDccArchiveDetail(this.potentialId);
    },
    computed: {
        ...mapGetters([ 'roleKey',])
    },
    methods: {
        getReloadData(){
            // 分配，激活成功后需要获取新的数据
            this.activedTab='dcc';
            this.$refs.tabs.initTab();
            this.getDccArchiveDetail(this.potentialId);
            if(this.$refs.dccArchive){
                this.$refs.dccArchive.getFollowList('init')
            }
        },
        changeTab(item){
            this.activedTab = item;
            if(item == 'dcc'){
                this.getDccArchiveDetail(this.potentialId);
            }
        },
        
        getDccArchiveDetail(id){ // dcc 档案id
            this.$fetch.business.archiveDccDetail({'id': id}).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.info = data?data:{};
                    if(data.areaArchive && data.areaArchive.length && this.areaArr.length == 0){ // 第一次获取，后面不需要
                        this.areaArr = data.areaArchive;
                        if(this.tabs && this.tabs.length== 1){
                            this.tabs.push({'title': '门店档案', "name": 'area','count': '10'});
                        }
                        if(this.tabs[1]){
                            this.tabs[1].count = data.areaArchive.length;
                        }
                    }

                    this.viewStatus = this.info.status; // 潜客状态
                    this.viewLevel = this.info.level; // 潜客状态
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFollow(){
            this.$router.push({'path': '/work/customerFollow', query:{'id': this.info.id, 'userId': this.info.userId}})
        },
        distributeFn(){ // 分配弹窗
            this.disConfig = {
                title: '分配',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                dccRequired: true,
                selectId: [this.potentialId], // 选择的列表id
                tip: '',
            }
            this.$fetch.business.archiveAssignDCCList({'ids':this.disConfig.selectId,'operate': 'assign'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.disConfig.listTotal = res.listTotal;
                    if(res.listTotal ==1){
                        this.disConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showDistribute = true;
                        this.dialogLoading=false;
                    }else if(res.listTotal > 1){
                        this.$message.error("所选潜客分别归属多个组，不能被分配(分配功能只可选择归属坐席组一致且非战败审核中的潜客，您可通过归属门店和跟进状态进行潜客筛选)")
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前潜客不符合要求'
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
            if(!val.dccId){
                this.$message.error('请选择dcc人员')
                return
            }
            let params = Object.assign({'ids':this.disConfig.selectId},val);
            this.dialogLoading=true;
            this.$fetch.business.ArchiveAssign(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('分配成功');
                    this.showDistribute = false;
                    this.getReloadData();
                },true)
                this.dialogLoading=false;
            }).catch(()=>{
                this.dialogLoading=false;
                this.$store.commit('closeLoading');
            })
        },
        getLevelOption(){
            // 激活的弹窗用到
            this.$fetch.common.commonClueLevelList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    if(this.$hasArrContent(res)){
                        let arr = [];
                        res.forEach((item)=>{
                            arr.push({'title': item + '级', 'id': item})
                        })
                        this.levelOptions = arr;
                    }
                }, false);
            })
        },
        handleActive(){ // 激活弹窗
            this.actConfig = {
                title: '激活',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                dccRequired: true,
                showLevel: true, // 潜客和战败需要显示等级
                levelOptions: this.levelOptions?this.levelOptions:[],
                showTime: true,
                selectId: [this.potentialId], // 选择的列表id
                tip: '',
            }

            this.$fetch.business.archiveAssignDCCList({'ids':this.actConfig.selectId,'operate': 'defeatActive'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.actConfig.listTotal = res.listTotal; // listTotal 取值大于等于1，如果没有组，报非200，单条的激活有且只有一个组
                    if(res.listTotal ==1){
                        this.actConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.tip = '';
                    }else if(res.listTotal > 1){
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.groupOptions = [];
                        this.actConfig.tip = '您所选择的潜客档案归属坐席组不一致，批量激活后这些潜客并由原处理DCC继续处理';
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前潜客不符合要求'
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
            this.$fetch.business.defeatActive(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('激活成功');
                    this.showActived = false;
                    this.getReloadData();
                },true)
                this.dialogLoading=false;
            }).catch(()=>{
                this.dialogLoading=false;
                this.$store.commit('closeLoading');
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.detail-wrap {
    padding: 12px 20px 20px;
}
.el-form-item {
    margin-bottom: 4px;
}
.detail-btn {
    position: absolute;
    right: 20px;
    top: 6px
}


</style>


