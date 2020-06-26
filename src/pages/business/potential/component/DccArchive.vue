<template>
    <div class="dcc-archive-component">
        <div class="detail-wrap flex">
            <div class="flex-1 detail-left">
                <step-title :step="{'title': '客户档案'}"></step-title>

                <el-form ref="form" label-position="right" label-width="150px" class="m-t-20">
                    <el-form-item label="跟进状态"> {{ info.statusName | filterBlank}} </el-form-item>
                    <el-form-item label="跟进坐席组"> {{ info.dccGroupName | filterBlank}} </el-form-item>
                    <el-form-item label="跟进DCC"> {{ info.dccName | filterBlank}} </el-form-item>
                    <el-form-item label="客户ID"> {{ info.userId | filterBlank}} </el-form-item>
                    <el-form-item label="客户姓名"> {{ info.nickname | filterBlank}} </el-form-item>
                    <el-form-item label="手机号码"> {{ info.tel | filterBlank}} </el-form-item>
                    <el-form-item label="意向等级"> {{ info.level | filterBlank}} <span v-if="info.level">级</span></el-form-item>
                    <el-form-item label="建档时间"> {{ info.createdAt | filterBlank}} </el-form-item>
                    <el-form-item label="最后跟进时间"> {{ info.lastFollowDate | filterBlank}} </el-form-item>
                    <el-form-item label="下次跟进时间"> {{ info.nextFollowDate | filterBlank}} </el-form-item>
                    <div v-for="(item,index) in intentionInfo" :key="'inten'+index">
                        <el-form-item :label="`归属门店${index+1}`"> {{ item.areaName | filterBlank}} </el-form-item>
                        <el-form-item :label="`意向车型${index+1}`"> {{ item.model | filterBlank}} </el-form-item>
                        <el-form-item :label="`客户来源${index+1}`"> {{ item.formText | filterBlank}} </el-form-item>
                    </div>
                    <el-form-item label="销售顾问"> {{ info.advisorName | filterBlank}} </el-form-item>
                    <el-form-item label="购车区域"> {{ buyPlace | filterBlank}} </el-form-item>
                    <el-form-item label="购车指标"> {{ buyQuotaText | filterBlank}} </el-form-item>
                    <el-form-item label="购车类型"> {{ buyTypeText | filterBlank}} </el-form-item>
                    <el-form-item label="是否贷款"> {{ isMortgageText | filterBlank}} </el-form-item>
                </el-form>
            </div>
            <div class="w-100"></div>
            <div class="flex-1 detail-right">
                <step-title :step="{'title': '跟进记录'}"></step-title>

                <follow-record 
                    class="m-t-20 p-20 potential-follow-record reset-scrollbar" 
                    :record-list="recordList" 
                    :scrollEvent="true" 
                    @event-scroll="handleFollowScroll"></follow-record>
            </div>
        </div>
    </div>
</template>

<script>
import StepTitle from '@/components/step/StepTitle';
import FollowRecord from '@/components/follow-record/FollowRecord'
export default {
    components:{
        StepTitle,
        FollowRecord,
    },
    props: {
        info: {
            type: Object,
            default: ()=>{ return{}}
        }
    },
    data(){
        return{
            recordList:[], // 跟进记录
            followPage: {
                totalCount: 0,
                page: 1,
                pageSize: 10,
                totalPage: 1
            },
        }
    },
    created(){
        this.potentialId = this.$route.query.id; // 潜客id
        this.getFollowList('init');
    },
    computed:{
        buyPlace(){
            let arr=[];
            if(this.info.provinceName){
                arr.push(this.info.provinceName)
            }
            if(this.info.cityName){
                arr.push(this.info.cityName)
            }
            if(this.info.regionName){
                arr.push(this.info.regionName)
            }
            return arr.join('--')
        },
        buyQuotaText(){
            let text = '';
            switch(this.info.buyQuota){
                case 0: text="未知";break;
                case 1: text="有"; break;
                case 2: text="无"; break;
            }
            return text;
        },
        isMortgageText(){
            return this.info.isMortgage == 1? '是':this.info.isMortgage == 2?"否":'未知';
        },
        buyTypeText(){
            let text = '';
            switch(this.info.buyType){
                case 1: text="首次购车";break;
                case 2: text="增购"; break;
                case 3: text="置换"; break;
                case 4: text="其他";break;
                default: text="未知";
            }
            return text;
        },
        intentionInfo(){
            let intention=[]; 
            if(this.info.intentionInfo && this.info.intentionInfo.length){
                this.info.intentionInfo.forEach((item)=>{
                    let arr=[];
                    if(item.fromTopName){
                        arr.push(item.fromTopName)
                    }
                    if(item.fromSecondName){
                        arr.push(item.fromSecondName)
                    }
                    item['formText']=arr.join('-');
                    intention.push(item)
                })
            }else {
                intention.push({'areaName':'', 'model':'', 'fromText':''})
            }
            return intention
        },
    },
    methods:{
        getFollowList(reset){
            if(reset == 'init') {
                this.recordList = [];
                this.followPage.page = 1;
            }
            const { page, pageSize } = this.followPage;
            
            let params = {
                typeId: 1, // 类型：1潜客，2线索
                id: this.potentialId,
                page,
                pageSize
            }
            this.$fetch.common.followListByType(params,false).then((res)=>{
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
    }
}
</script>

<style lang="scss" scoped>
.dcc-archive-component {
    padding: 12px 20px 20px;
}
.el-form-item {
    margin-bottom: 4px;
}
.potential-follow-record {
    max-height: 780px;
    overflow-y: auto;
}
</style>


