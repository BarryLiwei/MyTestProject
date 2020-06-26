<template>
    <div class="manage-shop-component">
        <div class="search-flex m-t-15">
            <search-col :info="search.list[search.name]" :leftCol="6" :rightCol="18" :placeholder="'请输入'" class="export-log"></search-col>
            <search-col :leftCol="0" :rightCol="24" class="export-log-btn">
                <div slot="custom">
                    <el-button round icon="el-icon-search" @click="find"  size="small" type="primary" class="m-l-20 w-110">查询</el-button>
                    <el-button round icon="el-icon-delete" @click="clear" size="small" plain >清空查询条件</el-button>
                </div>
            </search-col>
        </div>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :tableId="'manageShop'" :table="dataTable" @searchTable="searchTable">
            </data-table>
        </div>
    </div>
</template>

<script>
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    props: {
        currentOrg: {
            type: Object,
            default:()=>{return{}}
        }
    },
    components: {
        SearchCol,
        DataTable
    },
    mixins: [SearchMixins],
    data(){
        return{}
    },
    created(){
        this.initData();
    },
    methods: {
        initData(){
            this.initTable();
            this.initSearch();
        },
        initSearch(){
            this.search = {
                list: [
                    {
                        type: 'input', 
                        label: '门店名称', 
                        currentVal:'',
                    }
                ],
                name: 0
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '门店名称',
                      prop: 'short_name',
                      align: 'center'
                    },{
                      id: '2',
                      label: '品牌',
                      prop: 'brandName',
                      tooltip:true,
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
                showScrollBar: true, // 是否显示scrollWithBar 组件
                lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
                search: {},
                hasOperation: false, // 显示最后的operations
                operation: []
            }
        },
        getParams(){ // 获取参数
            const { currentPage, pageSize} = this.dataTable.page;
            const { name, list } = this.search;
            return {
                page: currentPage,
                pageSize: pageSize,
                orgId: this.currentOrg.id,
                name: list[name].currentVal, // 店铺名称
                expand: 'brands'
            }
        },
        queryData(item){
            let that = this;
            let params = this.getParams();
            this.$fetch.setting.queryAreasList(params).then(res => {
                this.$handleResponse(res, res => {
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.data.forEach((item)=>{
                        if(this.$hasArrContent(item.brands)){
                            let arr=[];
                            item.brands.forEach((sub)=>{
                                arr.push(sub.name)
                            })
                            this.$set(item, 'brandName', arr.join('、'))
                        }
                    })
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                    that.$emit('total', that.dataTable.page.totalCount)
                },true);
            }).catch(response => {
                this.$store.commit('closeLoading');
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.search-flex {
    margin-top: 6px;
}
/deep/ .export-log.el-col-6{
    width: 370px;
}
/deep/ .export-log-btn.el-col-6 {
    width: 290px;
}
</style>
