<template>
    <div class="setting-role-page m-20 common-box">
        <div class="top-title">角色管理</div>

        <div class="search-flex p-l-r-20 m-t-30 line">
            <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
            <search-col  :info="search.list[search.keyword]" placeholder="请输入"></search-col>
            <search-col  :info="search.list[search.status]"></search-col>
            <search-col :leftCol="0" :rightCol="24" class="export-log-btn">
                <div slot="custom">
                    <el-button round icon="el-icon-search" @click="find"  size="small" type="primary" class="m-l-20 w-110">查询</el-button>
                    <el-button round icon="el-icon-delete" @click="clear" size="small" plain >清空查询条件</el-button>
                </div>
            </search-col>
        </div>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" round size="small" @click="handleFn('add', {})">新增角色</el-button>
                    <el-button plain size="small" round class="w-90" @click="batchDel('batch', [])">删除</el-button>
                </div>   

                
                <template slot-scope="props" slot="name">
                    <el-button type="text" class="pointer" @click="viewFn(props.obj.row)">{{ props.obj.row.name }}</el-button>
                </template>
                 
                <template slot-scope="props" slot="type">
                    {{ props.obj.row.type == 0 ? '系统角色': '自定义角色' }}
                </template>

                <template slot-scope="props" slot="userCount">
                    {{ props.obj.row.userCount | filterBlank }} 个
                </template>

                <template slot-scope="props" slot="caozuo">
                    <div class="text-left p-l-50">
                        <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFn('edit',props.obj.row)">编辑</el-button>
                        <el-button class="red_font_white_bg" plain round size="mini"  @click="batchDel('one', [props.obj.row])" v-if="props.obj.row.type">删除</el-button>
                    </div>
                </template>
            </data-table>
        </div>

        <view-role v-if="showView" :info="viewInfo" @close="showView=false"></view-role>
    </div>
</template>

<script>
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import ViewRole from './ViewRole'
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchCol,
        DataTable,
        ViewRole
    },
    mixins: [SearchMixins],
    data(){
        return{
            showView: false, // 查看弹窗
        }
    },
    created(){
        this.initData();
        this.queryData();
    },
    methods: {
        initData(){
            this.initSearch(); // 初始化搜索列
            this.initTable();
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {   
                        prop: 'keyword', // 增加prop 方便看对应的关系
                        type: 'input', 
                        label: '角色名称', 
                        currentVal: '', 
                    },{
                        prop: 'status',
                        type: 'select', 
                        label: '角色类型', 
                        currentVal: '',
                        isAll: true, 
                        isAllTitle: '全部', 
                        selectOptions:[{name: '系统角色', id: 0},{name: '自定义角色', id: 1}],
                        optionLabel:'name', 
                        optionValue:"id", 
                    }
                ],
                keyword: 0, // 角色名称
                status: 1,  // 角色类型
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '角色名称',
                      prop: 'name',
                      tooltip:true,
                      show: 'template',
                      align: 'center'
                    },{
                      id: '2',
                      label: '角色描述',
                      prop: 'desc',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '用户数',
                      prop: 'userCount',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '4',
                      label: '角色类型',
                      prop: 'type',
                      show:'template',
                      align: 'center'
                    },{
                      id: '5',
                      label: '操作',
                      prop: 'caozuo',
                      show:'template',
                      width: 230,
                      align: 'center'
                    }
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                border: true,    // 有边框
                hasSelect: true, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: true, //是否有第一条分页条
                showScrollBar: true, // 是否显示scrollWithBar 组件
                checkboxInit: function(row, index){ return row.type }, // 初始化checkbox是否可选，0不可选, 1 可选
                search: {
                    value:'',
                    show: false,  // 不需要显示搜索
                    url: "setting.queryRoleList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "线索号码、微信号", //快捷搜索输入框提示文字
                    displayCol: ["nickname","tel"], //弹出需要显示的列
                    params: {
                      id: ""
                    }
                },
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { keyword, status, list } = this.search;
            let params = {
                expand: 'userCount',
                name: list[keyword].currentVal,    
                type: list[status].currentVal,     
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.setting.queryRoleList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFn(type, row){
            this.$router.push({path: type == 'add'?'/setting/role-power/add':'/setting/role-power/edit', query: { roleId: row.id}})
        },
        viewFn(row){ // 查看
            this.showView = true; // 查看弹窗
            this.viewInfo = row;
        },
        batchDel(type, arr){
            if(type == 'batch' && !this.$hasArrContent(this.selectData)){
                this.$message.warning('您还没选择角色')
                return
            }
            let tip = type=="batch"? '您确定要删除选中的角色吗?':'您确定要删除该角色吗';
            this.$confirm(tip, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.deleteRole(type=='batch'?this.selectData:arr);
            })
        },
        deleteRole(data){
            let ids = [];
            data.forEach((item)=>{
                ids.push(item.id)
            })
            this.$fetch.setting.roleDelete(ids.join(',')).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success("删除成功")
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.top-title {
    color: #444;
    font-size: 20px;
    padding-left: 20px;
    font-weight: 600;
    height: 60px;
    line-height: 60px;
    background-color: #fafcff;
    border-bottom: solid 1px #eaebf0;
}

.setting-role-page /deep/ .top-pagination {
    display: none;
}

/deep/ .export-log-btn.el-col-6 {
    width: 290px;
}
</style>
