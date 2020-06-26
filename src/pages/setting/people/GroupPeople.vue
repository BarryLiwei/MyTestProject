<template>
    <div class="group-people-page m-20 common-box">
        <div class="group-title">集团人员列表</div>

        <search-bar size="small" class="p-20 m-t-10" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col  :info="search.list[search.keyword]" placeholder="请输入"></search-col>
                <search-col  :info="search.list[search.status]"></search-col>
                <search-col  :info="search.list[search.role]"></search-col>
                <search-col  :info="search.list[search.org]"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" round size="small" @click="addFn(1)">业财增入</el-button>
                    <el-button type="primary" round size="small" @click="addFn(0)">自定义增入</el-button>
                    <el-button plain size="small" round class="w-90" @click="batchDelete">删除</el-button>
                </div>   
                 
                <template slot-scope="props" slot="nickname">
                    <el-button type="text" class="pointer" @click="editFn('view', props.obj.row)">{{ props.obj.row.nickname }}</el-button>
                </template>

                <template slot-scope="props" slot="status">
                    {{ props.obj.row.status==0?'启用': '禁用'}}
                </template>

                <template slot-scope="props" slot="roles">
                    <span v-if="props.obj.row.roles && props.obj.row.roles.length">
                        {{ props.obj.row.roles[0].name }}
                        <span v-if="props.obj.row.roles.length>1">等{{ props.obj.row.roles.length }}个角色</span>
                    </span>
                    <span v-else> --</span>
                </template>

                <template slot-scope="props" slot="org">
                    <span v-if="props.obj.row.roles && props.obj.row.roles.length && props.obj.row.roles[0].orgs && props.obj.row.roles[0].orgs.length">
                        {{ props.obj.row.roles[0].orgs[0].name }}
                        <span v-if="props.obj.row.roles[0].orgs.length>1">等{{ props.obj.row.roles[0].orgs.length }}个组织</span>
                    </span>
                    <span v-else> --</span>
                </template>

                <template slot-scope="props" slot="type">
                    <!-- 0 自定义  1业务曾入 -->
                    {{ props.obj.row.type == 0? '自定义增入': '业财增入' }}
                </template>

                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="updateFn(props.obj.row)">{{ props.obj.row.status == 0? '禁用': '启用'}}</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="editFn('edit', props.obj.row)">编辑</el-button>
                    <el-button class="red_font_white_bg" plain round size="mini" @click="deleteFn(props.obj.row)">删除</el-button>
                </template>
            </data-table>
        </div>

        <!-- 由于新增有业财和自定义，编辑有查看，所有分开写，不然逻辑混在一块 -->
        <add-people v-if="addDialog.show"  :info="addDialog"  @close="closeAdd"></add-people>

        <edit-and-view v-if="editDialog.show" :info="editDialog" @close="closeView"></edit-and-view>
    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import AddPeople from './components/AddPeople';
import EditAndView from './components/EditAndView'
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        AddPeople,
        EditAndView
    },
    mixins: [SearchMixins],
    data(){
        return{
            addDialog: {
                show: false,
                type: 0 , // 0自定义增加，1业财增加
                roleList:[],
            },
            editDialog: {
                show: false,
                type: 'view',
                data: {},
                roleList:[],
                orgList:[]
            }
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
            this.initPeopleOptions();
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {   
                        prop: 'keyword', // 增加prop 方便看对应的关系
                        type: 'input', 
                        label: '姓名/账号', 
                        currentVal: '', 
                    },{
                        prop: 'status',
                        type: 'select', 
                        label: '账号状态', 
                        currentVal: '',
                        isAll: true, 
                        isAllTitle:'全部',
                        selectOptions:[{label: '启用', val: 0},{label: '禁用', val: 1}], 
                        optionLabel:'label', 
                        optionValue:"val", 
                    },{
                        prop: 'role',
                        type: 'select', 
                        label: '角色权限', 
                        currentVal: '', 
                        isAll: true,
                        isAllTitle:'全部',
                        selectOptions:[], 
                        optionLabel:'name', 
                        optionValue:"id", 
                    },{
                        prop: 'org',
                        type: 'select', 
                        label: '管理范围', 
                        currentVal: '', 
                        selectOptions:[], 
                        isAll: true,
                        isAllTitle:'全部',
                        optionLabel:'name', 
                        optionValue:"id", 
                    }
                ],
                keyword: 0, // 姓名/账号
                status: 1,  // 账号状态
                role: 2,    // 角色权限
                org: 3,     // 管理范围
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '姓名',
                      prop: 'nickname',
                      tooltip:true,
                      show: 'template',
                      align: 'center'
                    },{
                      id: '2',
                      label: '账号',
                      prop: 'account',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '电话号码',
                      prop: 'tel',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '4',
                      label: '账号状态',
                      prop: 'status',
                      show:'template',
                      align: 'center'
                    },{
                      id: '5',
                      label: '角色',
                      prop: 'roles',
                      show:'template',
                      align: 'center'
                    },{
                      id: '6',
                      label: '管理范围',
                      prop: 'org',
                      show:'template',
                      align: 'center'
                    },{
                      id: '7',
                      label: '用户类型',
                      prop: 'type',
                      show: 'template',
                      align: 'center'
                    },{
                      id: '8',
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
                hasSelect: true, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: true, //是否有第一条分页条
                showScrollBar: true, // 是否显示scrollWithBar 组件
                search: {
                    value:'',
                    show: false,
                    url: "setting.queryAccountList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "线索号码、微信号", //快捷搜索输入框提示文字
                    displayCol: ["nickname","tel"], //弹出需要显示的列
                    params: {
                      id: ""
                    }
                },
            }
        },
        initPeopleOptions(){
            // 获取权限列表的下拉列表
            this.$fetch.setting.queryOrgList({}, true, false).then((res)=>{
                let org = res.data.data.orgStruct;  // 获取组织， 为了让loading不消失
                if(this.$hasArrContent(org)){
                    this.search.list[this.search.org].selectOptions=[]
                    this.getTreeSelect(org);
                }    
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })

            this.$fetch.setting.queryRoleList({'pagination':0}, true,false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.role].selectOptions = this.$hasArrContent(res.list)?res.list:[]
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        getTreeSelect(data){
            data.forEach((item)=>{
                this.search.list[this.search.org].selectOptions.push(item);
                if(this.$hasArrContent(item.child)){
                    this.getTreeSelect(item.child);
                }
            })
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { keyword, status, role, org , list } = this.search;
            let params = {
                keyword: list[keyword].currentVal,    
                status: list[status].currentVal,     
                roleId: list[role].currentVal, 
                orgId: list[org].currentVal,   
                expand: 'roles,orgs',
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.setting.queryAccountList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        addFn(type){ // 新增弹窗显示
            const {role,org, list } = this.search;
            this.addDialog.type = type;
            this.addDialog.show = true;
            this.addDialog.roleList = list[role].selectOptions;
        },
        closeAdd(type){ // 关闭新增弹窗
            this.addDialog.show=false;
            if(type == 'success'){
                this.queryData();
            }
        },
        editFn(type, row){ // 编辑弹窗显示
            const {role,org, list } = this.search;
            this.editDialog.type =  type;
            this.editDialog.data = row; 
            this.editDialog.show = true; 
            this.editDialog.roleList = list[role].selectOptions;
        },
        closeView(type){ // 关闭编辑弹窗
            this.editDialog.show = false;  
            if(type == 'success'){
                this.queryData();
            }
        },
        updateFn(row){
             this.$confirm(`您确认${row.status==0?'禁用':'启用'}该账号`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                let fn = row.status==0?'accountDisable':'accountEnable';
                this.$fetch.setting[fn](row.id).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success(`${row.status==0?'禁用':'启用'}成功`);
                        this.queryData();
                    },true)
                }).catch((err)=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        batchDelete(){
            if(!this.$hasArrContent(this.selectData)){
                this.$message.warning('您还没选择人员')
                return
            }
            this.$confirm("您确定要删除选中的人员吗?", "提示", {
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
                this.deleteAccount(ids)
            })
        },
        deleteFn(row){
            this.$confirm('是否确定删除此人员?', '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.deleteAccount([row.id])
            })
        },
        deleteAccount(ids){
            this.$fetch.setting.accountDelete(ids.join(','),{}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('删除成功!')
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
.group-title {
    color: #444;
    font-size: 20px;
    padding-left: 20px;
    font-weight: 600;
    height: 60px;
    line-height: 60px;
    background-color: #fafcff;
    border-bottom: solid 1px #eaebf0;
}

.group-people-page /deep/ .top-pagination {
    display: none;
}
</style>
