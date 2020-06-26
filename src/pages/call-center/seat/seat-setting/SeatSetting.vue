<template>
    <div class="seat-setting-page m-20 common-box ">
        <div class="search-flex search-wrap">
            <search-col :info="search.list[search.keyword]" :placeholder="'DCC邀约员/手机号/坐席号'" class="seat-search"></search-col>
            <search-col :info="search.list[search.groupSeat]" :placeholder="'请选择'" class="seat-search"></search-col>
            <search-col :leftCol="0" :rightCol="24" class="seat-search-btn">
                <div slot="custom">
                    <el-button round icon="el-icon-search" @click="find"  size="small" type="primary" class="m-l-30 w-110">查询</el-button>
                    <el-button round icon="el-icon-delete" @click="clear" size="small" plain >清空查询条件</el-button>
                </div>
            </search-col>
        </div>

        <div class="separate-line w-100-percent"></div>

        <div class="p-l-r-20 m-b-20"> 
            <data-table ref="DataTableRef" class='table-cyan' :table="dataTable" @searchTable='searchTable'>
                <div slot="buttons">              
                    <el-button round icon="el-icon-plus" @click="handleFn('add', {})" size="small" type="primary" class="m-b-20">新增坐席</el-button>
                    <!-- <span class="text-right note m-l-15">注：只有审核通过的坐席号才能正常使用</span> -->
                </div>   

                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFn('edit', props.obj.row)">编辑</el-button>
                </template> 
            </data-table>
        </div>

        <add-seat v-if="seatInfo.show" :rowItem="seatInfo" @close="closeSeat" ></add-seat>
    </div>
</template>

<script>
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import AddSeat from './AddSeat'
import SearchMixins from '@/pages/mixins/SearchMixins';
export default {
    components: {
        SearchCol,
        DataTable,
        AddSeat
    },
    mixins: [SearchMixins],
    data(){
        return {
            seatInfo: {
                show: false,
                type: 'add',
                row: {}
            }
        }
    },
    created(){
        this.initData();
        this.queryData();
    },
    methods: {
        initData(){
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
                    },{
                        type: 'select', 
                        label: '坐席组', 
                        currentVal:'',
                        isAll: true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    }
                ],
                keyword: 0, // 任务名称
                groupSeat: 1, // 坐席组
            }

            this.$fetch.callCenter.seatListOption({}).then((res)=>{
                this.$handleResponse(res, (res)=>{
                    this.search.list[this.search.groupSeat].selectOptions = this.$hasArrContent(res.dccGroup)?res.dccGroup:[];
                }, false)
            })
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '坐席号',
                      prop: 'thirdSeatId',
                      align: 'center'
                    },{
                      id: '2',
                      label: '姓名',
                      prop: 'dccNickname',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '角色',
                      prop: 'roleName',
                      tooltip:true,
                    //   show:'template',
                      align: 'center'
                    },{
                      id: '4',
                      label: '手机号',
                      prop: 'dccTel',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '5',
                      label: '所属坐席组',
                      prop: 'dccGroupTitle',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '6',
                      label: '坐席电话',
                      prop: 'seatTel',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '7',
                      label: '操作',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: '120',
                      align: 'center'
                    },
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
                hasFirstPagination: true, //是否有第一条分页条
                lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
                search: {},
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { keyword,groupSeat, list} = this.search;
            let params = {
                kwd: list[keyword].currentVal,
                dccGroupId: list[groupSeat].currentVal,
                pageSize: pageSize,         // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.callCenter.seatList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFn(type, item){
            this.seatInfo.type = type;
            this.seatInfo.row = item;
            this.seatInfo.show = true;
        },
        closeSeat(type){
            if(type =='success'){
                this.queryData();
            }
            this.seatInfo.show = false;
        },
    }
}
</script>

<style lang="scss" scoped>
.search-wrap {
    padding: 30px 20px 5px;
}
.seat-search.el-col-6{
    width: 400px;
}
.seat-search-btn.el-col-6 {
    width: 310px;
}
.seat-search-add.el-col-6{
    width: calc(100% - 700px);
    text-align: right;
}

.seat-setting-page .note {
    color: #a8a8a8;
    font-size: 14px;
    margin-top: 9px;
    padding-right: 5px;
}
</style>
