<template>
    <div class="talk-task-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.name]" :placeholder="'请输入'"></search-col>
                <search-col :info="search.list[search.content]" :placeholder="'请输入'"></search-col>
                <search-col :info="search.list[search.group]" filterable></search-col>
                <search-col :info="search.list[search.state]"></search-col>
                <search-col :info="search.list[search.time]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable'>
                <div slot="buttons">              
                    <el-button type="primary" icon="el-icon-plus" round size="small" @click="HandleFn('add', {})">新建开口任务</el-button>
                </div>   
                <template slot-scope="props" slot="caozuo">
                    <el-button type="text" @click="HandleFn('edit', props.obj.row)">编辑</el-button>
                    <el-button type="text" class="btn-split" @click="taskToggle(props.obj.row)">{{ props.obj.row.status==1?"下架":"上架"}}</el-button>
                    <el-button type="text" class="btn-split red_font" @click="deleteTask(props.obj.row)">删除</el-button>
                    <el-button type="text" class="btn-split" @click="viewFn(props.obj.row)">查看详情</el-button>
                </template> 

                <template slot-scope="props" slot="contentOverview">
                    <div class="blue pointer" @click="viewFn(props.obj.row)">{{ props.obj.row.contentOverview}}</div>
                </template> 

                <template slot-scope="props" slot="dccGroup">
                    <span v-if="props.obj.row.dccGroup && props.obj.row.dccGroup.length">
                        {{ props.obj.row.dccGroup[0].title }}
                        <span v-if="props.obj.row.dccGroup[1]">、{{ props.obj.row.dccGroup[1].title }}</span>
                        <span v-if="props.obj.row.dccGroup.length > 2">等{{ props.obj.row.dccGroup.length }}组</span>
                    </span>
                    <span v-else> --</span>
                </template>
            </data-table>
        </div>

        <!-- 新建/编辑开口任务 -->
        <add-talk-task v-if="showAdd"  :rowInfo="currentRow" @close="closeAddFn" ></add-talk-task>

        <!-- 查看开口任务 -->
        <view-talk-task v-if="showView" :id="currentRow.id" @close="showView=false"></view-talk-task>
    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import AddTalkTask from './AddTalkTask'
import ViewTalkTask from './ViewTalkTask'
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        AddTalkTask,
        ViewTalkTask
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
            this.openTaskOption();
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
                        type: 'input', 
                        label: '任务名称', 
                        currentVal: '',
                    },{
                        type: 'input', 
                        label: '任务内容', 
                        currentVal: '', 
                    },{
                        type: 'select', 
                        label: '适用坐席组', 
                        currentVal: '', 
                        isAll: true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '状态', 
                        currentVal: '',
                        isAll: true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'datePicker', 
                        label: '任务结束时间', 
                        currentVal: '', 
                    }
                ],
                name: 0, // 任务名称
                content: 1, // 任务内容
                group: 2,  // 分配坐席组
                state: 3,  // 状态
                time: 4,  // 任务结束时间
            }
        },
        openTaskOption(){
            this.$fetch.callCenter.openTaskListOptions({}).then((res)=>{
                const {dccGroup, status} = res.data.data; 
                this.search.list[this.search.group].selectOptions = this.$hasArrContent(dccGroup)?dccGroup:[]; 
                this.search.list[this.search.state].selectOptions = this.$hasArrContent(status)?status:[]; 
            })
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      width: '220'
                    },{
                      id: '2',
                      label: '任务ID',
                      prop: 'id',
                      tooltip:true
                    },{
                      id: '3',
                      label: '任务名称',
                      prop: 'title',
                      tooltip:true
                    },{
                      id: '4',
                      label: '任务内容',
                      prop: 'contentOverview',
                      show:'template',
                      tooltip:true,
                      minWidth: '150'
                    },{
                      id: '5',
                      label: '适用坐席组',
                      prop: 'dccGroup',
                      show:'template',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '6',
                      label: '适用场景',
                      prop: 'scenarioTitle',
                      tooltip:true
                    },{
                      id: '7',
                      label: '任务开始时间',
                      prop: 'startDate',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '8',
                      label: '任务结束时间',
                      prop: 'endDate',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '9',
                      label: '状态',
                      prop: 'statusTitle',
                      tooltip:true
                    },{
                      id: '10',
                      label: '更新时间',
                      prop: 'updateDate',
                      tooltip:true,
                      minWidth: '110'
                    }
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                hasSelect: false, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: true, //是否有第一条分页条
                showScrollBar: true, // 是否显示scrollWithBar 组件
                search: {
                    value:'',
                    show: false,
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "请输入任务名称", //快捷搜索输入框提示文字
                    displayCol: ["name","tel"], //弹出需要显示的列
                    parma: {
                      id: ""
                    }
                },
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { name, content, group, state, time, list } = this.search;

            let params = {
                title: list[name].currentVal,      // 任务名称
                content: list[content].currentVal,     // 任务内容
                dccGroup: list[group].currentVal,    // 分配坐席组
                status: list[state].currentVal,     // 状态
                startDate: list[time].currentVal && list[time].currentVal[0]+ ' 00:00:00', // 任务结束时间
                endDate: list[time].currentVal && list[time].currentVal[1]+ ' 23:59:59',  // 任务结束时间
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.callCenter.openTaskList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        taskToggle(row){
            this.$confirm(`您确定要${row.status ==1?'下':'上'}架此开口任务吗`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.openTaskToggle({'id': row.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success(`${row.status ==1?'下':'上'}架成功`);
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        deleteTask(row){
            this.$confirm("您确定要删除此开口任务吗?", "提示", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning",
             customClass: "needCenterStyle",
             cancelButtonClass: "big cancel",
             confirmButtonClass: "big",
             roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.openTaskDelete({'id': row.id}).then((res)=>{
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
        closeAddFn(type){
            this.$store.commit('closeLoading');
            this.showAdd=false;
            if(type == 'success'){
                this.queryData();
            }
        },
    }
}
</script>

<style lang="scss" scoped>

</style>