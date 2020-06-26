<template>
    <div class="normal-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.status]" :placeholder="'请输入'"></search-col>
                <search-col :info="search.list[search.create_time]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.update_time]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>

            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef"  class='table-cyan' :table="dataTable" @searchTable='searchTable'  @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" icon="el-icon-plus" round size="small" @click="viewFn({},1)">新建话术</el-button>
                    <el-button plain size="small" round class="w-90" @click="batchDelete">删除</el-button>
                </div>   
                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="viewFn(props.obj.row,3)">查看</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="taskToggle(props.obj.row)">{{ props.obj.row.displayStatus==1?"隐藏":"显示"}}</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="viewFn(props.obj.row,2)">编辑</el-button>
                    <el-button class="red_font_white_bg" plain round size="mini" @click="deleteTask(props.obj.row)">删除</el-button>


                </template> 

            </data-table>
        </div>

        <NormalDialog  @closeDiolag="closeDiolag"  :dialogType="dialogType" :content="currentRow" :options="search.list[search.status].selectOptions" v-if="showView"></NormalDialog>

    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import SearchMixins from '@/pages/mixins/SearchMixins';
import NormalDialog from './NormalDialog';


export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        NormalDialog
    },
    mixins: [SearchMixins],
    data(){
        return{
            showView: false, // 查看
            currentRow: {},
            dialogType:'',
        }
    },
    created(){
        // 找不到的方法在searchMixins.vue 组件里面
        this.initData();
        this.queryData();
    },
    methods: {
        closeDiolag(){
            this.showView = false;
            this.queryData();
        },
        initData(){
            this.initSearch(); // 初始化搜索列
            this.initTable();
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
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
                        label: '创建时间', 
                        currentVal: '', 
                    },{
                        type: 'datePicker', 
                        label: '更新时间', 
                        currentVal: '', 
                    }
                ],
                status: 0, // 状态
                create_time: 1,  // 创建时间
                update_time: 2,  // 更新时间
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '2',
                      label: '话术ID',
                      prop: 'longId',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '常用话术标题',
                      prop: 'title',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '4',
                      label: '状态',
                      prop: 'displayStatusTitle',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '5',
                      label: '创建时间',
                      prop: 'createDate',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '6',
                      label: '更新时间',
                      prop: 'updateDate',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '11',
                      label: '操作',
                      prop: 'caozuo',
                      show:'template',
                      width: '300',
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
                hasSelect: true, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: true, //是否有第一条分页条
                showScrollBar: true, // 是否显示scrollWithBar 组件
                search: {
                    value:'',
                    show: true,
                    width: "300", //快捷搜索输入框宽度
                    keyword: 'kwd',
                    url: "callCenter.normalList", //快捷搜索的方法名称:  模块.方法名
                    placeholder: "请输入话术ID/常用话术标题", //快捷搜索输入框提示文字
                    displayCol: ["longId","title"], //弹出需要显示的列
                    parma: {
                      id: ""
                    }
                },
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { status, create_time,update_time, list } = this.search;

            let params = {
                displayStatus: list[status].currentVal,     // 状态
                createDateStart: list[create_time].currentVal && list[create_time].currentVal[0], // 创建时间
                createDateEnd: list[create_time].currentVal && list[create_time].currentVal[1],  // 更新时间
                updateDateStart: list[update_time].currentVal && list[update_time].currentVal[0], // 创建时间
                updateDateEnd: list[update_time].currentVal && list[update_time].currentVal[1], // 创建时间
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();

            this.$fetch.callCenter.normalList(params,true).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                    
                    const displayStatus = res.options.displayStatus;
                    this.search.list[this.search.status].selectOptions = this.$hasArrContent(displayStatus)?displayStatus:[]; 
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        //ready
        taskToggle(row){
            this.$confirm(`您确定要${row.displayStatus ==1?'隐藏':'显示'}该常用话术吗`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.normalToggle({'id': row.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success(`${row.displayStatus ==1?'隐藏':'显示'}成功`);
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        deleteTask(row){
            this.$confirm("您确定要删除此常用话术吗?", "提示", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning",
             customClass: "needCenterStyle",
             cancelButtonClass: "big cancel",
             confirmButtonClass: "big",
             roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.normalDelete({'id': [row.id]}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功');
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        viewFn(row,type){
            this.currentRow = row;
            this.dialogType = type;
            this.showView=true;
        },
        batchDelete(){

            console.log(this.selectData)

            if(!this.$hasArrContent(this.selectData)){
                this.$message.warning('您还没选择常用话术')
                return
            }
            this.$confirm("您确定要删除选中的常用话术吗?", "提示", {
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

                this.$fetch.callCenter.normalDelete({'id': ids}).then((res)=>{
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

</style>