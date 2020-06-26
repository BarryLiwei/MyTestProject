<template>
    <el-dialog
        title="跟进记录"
        class="right-side-dialog call-follow-dialog"
        :visible.sync="dialogVisible"
        width="450px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">

        <follow-record 
            class="m-t-20 p-20 clue-follow-record reset-scrollbar" 
            :record-list="recordList" 
            :scrollEvent="true" 
            @event-scroll="handleFollowScroll"
        ></follow-record>
    </el-dialog>
</template>

<script>
import FollowRecord from '@/components/follow-record/FollowRecord'
export default {
    components:{
       FollowRecord 
    },
    props:{
        row: {
            type: Object,
            default: ()=>{ return {}}
        }
    },
    data(){
        return {
            dialogVisible:true,
            recordList: [], // 跟进列表
            followPage: {
                totalCount: 0,
                page: 1,
                pageSize: 10,
                totalPage: 1
            },
        }
    },
    created(){
        this.getFollowList('init'); 
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        getFollowList(reset){
            if(reset == 'init') {
                this.followList = [];
                this.followPage.page = 1;
            }
            const { page, pageSize } = this.followPage;
            let params = {
                typeId: this.row.dataType,
                id: this.row.dataId,
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
    }
}
</script>

<style lang="scss" scoped>
.right-side-dialog /deep/.el-dialog__body {
    padding: 5px 20px 20px;
}

.clue-follow-record {
    max-height: 780px;
    overflow-y: auto;
}
</style>


