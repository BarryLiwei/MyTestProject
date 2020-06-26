<template>
    <div class="manage-people-componnet">
        <div class="search-flex">
            <search-col :info="search.list[search.keyword]" :leftCol="6" :rightCol="18" :placeholder="'请输入'" class="export-log"></search-col>
            <search-col :leftCol="0" :rightCol="24" class="export-log-btn">
                <div slot="custom">
                    <el-button round icon="el-icon-search" @click="find"  size="small" type="primary" class="m-l-20 w-110">查询</el-button>
                    <el-button round icon="el-icon-delete" @click="clear" size="small" plain >清空查询条件</el-button>
                </div>
            </search-col>
        </div>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :tableId="'managePeople'" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" round size="small" @click="handleFn('add', {})">新增管理人员</el-button>
                    <el-button plain size="small" round class="w-90" @click="deleteFn('batch', {})">删除</el-button>
                </div>   
                 
                <template slot-scope="props" slot="orgRole">
                    {{ props.obj.row.orgRole.name | filterBlank }}
                </template>

                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFn('edit', props.obj.row)">编辑</el-button>
                    <el-button class="red_font_white_bg" plain round size="mini" @click="deleteFn('one', props.obj.row)">删除</el-button>
                </template>
            </data-table>
        </div>

        <add-manage-people v-if="showAdd" :config="rowConfig" @close="closeDialog"></add-manage-people>
    </div>
</template>

<script>
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import AddManagePeople from './AddManagePeople'
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchCol,
        DataTable,
        AddManagePeople
    },
    props: {
        currentOrg: {
            type: Object,
            default:()=>{return{}}
        },
    },
    mixins: [SearchMixins],
    data(){
        return{
            showAdd: false,
            rowConfig: {},
        }
    },
    created(){
        this.initData();
    },
    methods: {
        initData(){
            this.initSearch(); // 初始化搜索列
            this.initTable();
        },
        initSearch(){
            this.search = {
                list: [
                    {
                        type: 'input', 
                        label: '姓名/账号', 
                        currentVal:'',
                    }
                ],
                keyword: 0
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '姓名',
                      prop: 'nickname',
                      align: 'center'
                    },{
                      id: '2',
                      label: '账号',
                      prop: 'account',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '角色',
                      prop: 'orgRole',
                      show: 'template',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '4',
                      label: '操作',
                      prop: 'caozuo',
                      show: 'template',
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
                lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
                search: {},
                hasOperation: false, // 显示最后的operations
                operation: []
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { keyword, list } = this.search;
            let params = {
                expand: 'orgRole', //（currentRole：用户当前角色，permissions：用户权限，orgs：所属组织，areas：所属4S店，roles：用户所有角色，orgRole：指定组织绑定的角色）
                keyword: list[keyword].currentVal,
                orgId: this.currentOrg.id, // 组织id       
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
                    that.$emit('total', that.dataTable.page.totalCount)
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        deleteFn(type, row){
            // 批量删除
            if(!this.$hasArrContent(this.selectData) && type=='batch'){
                this.$message.warning('您还没有选中要删除的管理人员')
                return false
            }
            let tip = type=='batch'?"您确定要删除选中的管理人员吗?":"是否确定删除此管理人员?";
            this.$confirm(tip, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                let ids=[];
                if(type == 'batch'){
                    this.selectData.forEach((item)=>{
                        ids.push(item.id)
                    })
                }else {
                    ids.push(row.id);
                }
                this.orgAdminDelete(ids);
            })
        },
        orgAdminDelete(ids){
            this.$fetch.setting.adminDelete(this.currentOrg.id,ids.join(',')).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('删除成功!')
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFn(type, data){
            this.rowConfig['type']=type;
            this.rowConfig['data'] = data;
            this.rowConfig.org = this.currentOrg;
            this.showAdd = true;
        },
        closeDialog(type){
            this.showAdd=false;
            if(type=='success'){
                this.queryData();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.search-flex {
    border-bottom: 1px solid #ddd;
    margin-top: 6px;
}
/deep/ .export-log.el-col-6{
    width: 370px;
}
/deep/ .export-log-btn.el-col-6 {
    width: 290px;
}

.manage-people-componnet /deep/ .top-pagination {
    display: none;
}
</style>
