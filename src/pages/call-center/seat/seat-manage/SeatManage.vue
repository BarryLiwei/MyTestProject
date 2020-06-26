<template>
    <div class="seat-manage-page m-20 common-box ">
        <div class="search-flex search-wrap">
            <search-col :info="search.list[search.keyword]" :placeholder="'坐席组名称/服务门店'" class="seat-search"></search-col>
            <search-col :leftCol="0" :rightCol="24" class="seat-search-btn">
                <div slot="custom">
                    <el-button round icon="el-icon-search" @click="find"  size="small" type="primary" class="m-l-28 w-110">查询</el-button>
                    <el-button round icon="el-icon-delete" @click="clear" size="small" plain >清空查询条件</el-button>
                </div>
            </search-col>
        </div>

        <div class="separate-line w-100-percent"></div>

        <div class="p-20">
            <el-button round icon="el-icon-plus" @click="handleFn('add', {})" size="small" type="primary" class="m-b-20">新增坐席组</el-button>
            <data-table ref="DataTableRef" class='table-cyan' :table="dataTable" @searchTable='searchTable'>
                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="showAddDcc(props.obj.row)">添加DCC邀约员</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFn('edit',props.obj.row)">编辑</el-button>
                    <!-- 产品还没考虑好删除逻辑，暂时隐藏 -->
                    <!-- <el-button class="red_font_white_bg" plain round size="mini" @click="deleteFn(props.obj.row)">删除</el-button> -->
                </template> 
            </data-table>
        </div>

        <!-- 弹窗上的新增坐席 -->
        <add-seat-dailog v-if="showDcc" @close="closeAddDcc" :title="'添加DCC邀约员'" :isDccDialog="true" :config="dccConfig" multiple collapse-tags></add-seat-dailog>
    </div>
</template>

<script>
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import AddSeatDailog from './component/AddSeatDialog';
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchCol,
        DataTable,
        AddSeatDailog
    },
    mixins: [SearchMixins],
    data(){
        return {
            showDcc: false,
            dccConfig:{} , // 新增，编辑坐席弹窗
        }
    },
    created(){
        this.initData();
        this.queryData();
    },
    methods: {
        initData(){
            this.initDccConfig();
            this.initSearch();
            this.initTable();
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
                        type: 'input', 
                        label: '关键字', 
                        currentVal:'',
                    }
                ],
                keyword: 0, // 任务名称
            }
        },
        initDccConfig(){
            this.dccConfig = {
                label: 'DCC邀约员',
                selectOptions:[],
                optionLabel:'nickname',
                optionValue:'id',
                itemInfo: {'ids':[]},
                itemKey: 'ids',
                isCheckRemove: true,
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '坐席组名称',
                      prop: 'title',
                      align: 'center'
                    },{
                      id: '2',
                      label: '服务门店',
                      prop: 'areaOverview',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: 'DCC邀约员个数',
                      prop: 'dccCount',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '4',
                      label: 'DCC负责人',
                      prop: 'leaderName',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '5',
                      label: '更新时间',
                      prop: 'updateDate',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '6',
                      label: '操作',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: '150',
                      align: 'center'
                    }
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                border: true, // 是否带边框
                hasSelect: false, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: false, //是否有第一条分页条
                lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
                search: {},
                hasOperation: false, // 显示最后的operations
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            let params = {
                kwd: this.search.list[this.search.keyword].currentVal,
                pageSize: pageSize,         // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.callCenter.seatGroupList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFn(type, row){
            this.$router.push({path:type=='add'?'/call/seat/seat-manage/add':'/call/seat/seat-manage/edit', query:{ id: row.id}})
        },
        showAddDcc(row){
            let ids = [];
            let arr = [];
            if(this.$hasArrContent(row.dccs)){
                row.dccs.forEach((item)=>{
                    ids.push(item.dccId);
                    arr.push({'nickname': item.dccName, 'id': item.dccId})
                })
            }
            this.dccConfig.itemInfo = row;
            this.$set(this.dccConfig.itemInfo, 'ids', ids);
            this.dccConfig.selectOptions = arr;
            this.showDcc = true;
        },
        closeAddDcc(type){
            if(type == 'success'){
                const {id, ids} = this.dccConfig.itemInfo;
                this.$fetch.callCenter.updateGroupDcc({'id': id, 'dccId': ids }).then((res)=>{
                    this.$handleResponse(res, (res)=>{
                        this.showDcc = false;
                        this.$message.success('添加成功');
                        this.queryData();   
                    },true)
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            }else {
                this.showDcc = false;
            }
        },
        deleteFn(row){
            this.$fetch.callCenter.checkDeleteGroup({'groupId': row.id}).then((res)=>{
                this.$handleResponse(res, (res)=>{                                    
                    let tip = res.result == 0?'该坐席组名下有线索及潜客数据，一旦删除这些数据坐席处理人置为空，该您确定要删除该坐席组？':'您确定删除该坐席组?'
                    this.doDeleteFn(tip, row);
                },true)
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        doDeleteFn(tip, row){
            this.$confirm(tip, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.deleteGroupSeat({'id': row.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功');
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.search-wrap {
    padding: 30px 20px 5px;
}
.seat-search.el-col-6{
    width: 290px;
}
.seat-search-btn.el-col-6 {
    width: 290px;
}
.seat-search-add.el-col-6{
    width: calc(100% - 700px);
    text-align: right;
}
</style>

