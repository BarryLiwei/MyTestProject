<template>
    <div class="activity-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col  :info="search.list[search.area]" :leftCol="8" filterable></search-col>
                <search-col :info="search.list[search.type]"></search-col>
                <search-col  :info="search.list[search.createDate]"  :leftCol="8"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col  :info="search.list[search.validDate]"  :leftCol="8"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" icon="el-icon-plus" round size="small" @click="HandleFn('add', {})">新增活动</el-button>
                    <el-button plain size="small" round class="w-90" @click="batchDelete">删除</el-button>
                </div>   
                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="viewFn(props.obj.row)">查看</el-button>
                    <el-button class="blue_font_white_bg" v-if="props.obj.row.activityType != 1" plain round size="mini" @click="HandleFn('edit', props.obj.row)">编辑</el-button>
                    <el-button class="red_font_white_bg" v-if="props.obj.row.activityType != 1" plain round size="mini" @click="deleteFn(props.obj.row)">删除</el-button>
                </template> 
                <template slot-scope="props" slot="startDate">
                    <div>
                        {{props.obj.row.startDate}} 至 {{props.obj.row.endDate}}
                    </div>
                </template>
            </data-table>
        </div>

        <!-- 新建/编辑活动 -->
        <add-activity v-if="showAdd"  :rowInfo="currentRow" @close="closeShowAdd" ></add-activity>

        <!-- 查看活动 -->
        <view-activity v-if="showView" :id="currentRow.id" @cancel="showView=false"></view-activity>
    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import SearchMixins from '@/pages/mixins/SearchMixins'
import AddActivity from './AddActivity'
import ViewActivity from './ViewActivity'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        AddActivity,
        ViewActivity
    },
    mixins: [SearchMixins],
    data(){
        return{
            showAdd: false, // 新建开口任务
            showView: false, // 查看开口任务
            currentRow: {},
        }
    },
    created(){
        // 找不到的方法在searchMixins.vue 组件里面
        this.initData();
        this.queryData();
    },
    methods: {
        initData(){
            this.initSearch(); // 初始化搜索列
            this.initTable();
            this.getAreaOptions();  // 门店
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
                        prop: 'area',
                        type: 'select', 
                        label: '归属门店', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'type',
                        type: 'select', 
                        label: '活动类型', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[{"id":1,"title":"门店活动"},{"id":2,"title":"集团活动"},{"id":3,"title":"品牌活动"},{"id":4,"title":"其他活动"}], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'createDate',
                        type: 'datePicker', 
                        label: '创建时间', 
                        currentVal: '', 
                    },{
                        prop: 'validDate',
                        type: 'datePicker', 
                        label: '有效期', 
                        currentVal: '', 
                    },
                ],
                area: 0, // 门店
                type: 1, // 活动类型
                createDate: 2,  // 创建时间
                validDate: 3,  // 有效期
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '任务ID',
                      prop: 'longId',
                      tooltip:true
                    },{
                      id: '2',
                      label: '适用门店',
                      prop: 'areaOverview',
                      tooltip:true,
                      minWidth: '150'
                    },{
                      id: '3',
                      label: '活动类型',
                      prop: 'activityTypeTitle',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '4',
                      label: '活动标题',
                      prop: 'title',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '5',
                      label: '有效期',
                      prop: 'startDate',
                      show:'template',
                      tooltip:true,
                      minWidth: '185'
                    },{
                      id: '6',
                      label: '创建时间',
                      prop: 'createdDate',
                      tooltip:true,
                      minWidth: '150'
                    },{
                      id: '7',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      width: '250'
                    }
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                border: true, // 是否带边框
                hasSelect: true, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: true, //是否有第一条分页条
                showScrollBar: true, // 是否显示scrollWithBar 组件
                search: {
                    value:'',
                    show: true,
                    url: "callCenter.activityList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "请输入活动ID/活动标题", //快捷搜索输入框提示文字
                    displayCol: ["longId","title"], //弹出需要显示的列
                    params: {
                      id: ""
                    },
                    keyword: 'kwd'
                },
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { area, type, createDate, validDate, list } = this.search;

            let params = {
                area: list[area].currentVal,      // 门店
                type: list[type].currentVal,     // 活动类型
                createDateStart: list[createDate].currentVal && list[createDate].currentVal[0], // 创建时间
                createDateEnd: list[createDate].currentVal && list[createDate].currentVal[1], // 创建时间
                validDateStart: list[validDate].currentVal && list[validDate].currentVal[0],  // 有效期
                validDateEnd: list[validDate].currentVal && list[validDate].currentVal[1],  // 有效期
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.callCenter.activityList(params, true).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        batchDelete(){
            console.log(this.selectData)
            if(!this.$hasArrContent(this.selectData)){
                this.$message.warning('您还没选择活动')
                return
            }
            this.$confirm("您确定要删除选中的活动吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                let ids=[];
                this.selectData.forEach((item)=>{
                    ids.push(item.id)
                })
                this.$fetch.callCenter.activityDelete({'id': ids}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功');
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        deleteFn(row){
            this.$confirm("删除后不可恢复，是否确定删除?", "提示", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning",
             customClass: "needCenterStyle",
             cancelButtonClass: "big cancel",
             confirmButtonClass: "big",
             roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.activityDelete({'id': [row.id]}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功');
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        viewFn(row){
            this.currentRow = row;
            this.showView=true;
        },
        HandleFn(type, row){
            this.currentRow = row;
            this.showAdd = true;
        },
        closeShowAdd(){
            this.showAdd=false;
            this.queryData();
        }
    }
}
</script>

<style lang="scss" scoped>

</style>