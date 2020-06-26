<template>
    <div class="setting-shop-page m-20 common-box">
        <div class="top-title">集团门店列表</div>

        <div class="search-flex p-l-r-20 m-t-30 m-b-10">
            <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
            <search-col  :info="search.list[search.keyword]" placeholder="请输入"></search-col>
            <search-col :leftCol="0" :rightCol="24" class="export-log-btn">
                <div slot="custom">
                    <el-button round icon="el-icon-search" @click="find"  size="small" type="primary" class="m-l-20 w-110">查询</el-button>
                    <el-button round icon="el-icon-delete" @click="clear" size="small" plain >清空查询条件</el-button>
                </div>
            </search-col>
        </div>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <template slot-scope="props" slot="short_name">
                    <el-button type='text' class="pointer" @click="viewDetail(props.obj.row)"> {{ props.obj.row.short_name | filterBlank}}</el-button>
                </template>
                
                <template slot-scope="props" slot="brands">
                    <span v-if="props.obj.row.brands && props.obj.row.brands.length">
                        {{ props.obj.row.brands[0].name }}
                        <span v-if="props.obj.row.brands.length>1">等{{ props.obj.row.brands.length }}个品牌</span>
                    </span>
                    <span v-else> --</span>
                </template>

                <template slot-scope="props" slot="orgs">
                    <span v-if="props.obj.row.orgs && props.obj.row.orgs.length">
                        {{ props.obj.row.orgs[0].name }}
                        <span v-if="props.obj.row.orgs.length>1">等{{ props.obj.row.orgs.length }}个组织</span>
                    </span>
                    <span v-else> --</span>
                </template>

            </data-table>
        </div>

        <shop-detail v-if="showDialog" :info="shopInfo" @cancel="showDialog=false"></shop-detail>
    </div>
</template>

<script>
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import ShopDetail from './ShopDetail';
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchCol,
        DataTable,
        ShopDetail
    },
    mixins: [SearchMixins],
    data(){
        return{
            showDialog: false,
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
            this.search = { 
                list: [
                    {   
                        prop: 'keyword', // 增加prop 方便看对应的关系
                        type: 'input', 
                        label: '门店名称', 
                        currentVal: '', 
                    }
                ],
                keyword: 0, // 角色名称
            }
        },
        initTable(){
            this.dataTable = {
                tr: [
                    // {
                    //   id: '1',
                    //   label: '门店名称(全称)',
                    //   prop: 'fullName',
                    //   show:'template',
                    //   tooltip:true,
                    //   align: 'center'
                    // },
                    {
                      id: '2',
                      label: '门店名称',
                      prop: 'short_name',
                      tooltip:true,
                      show:'template',
                      align: 'center'
                    },{
                      id: '3',
                      label: '品牌',
                      prop: 'brands',
                      tooltip:true,
                      show:'template',
                      align: 'center'
                    },{
                      id: '4',
                      label: '所属组织',
                      prop: 'orgs',
                      tooltip:true,
                      show:'template',
                      align: 'center'
                    },{
                      id: '5',
                      label: '门店地址',
                      prop: 'address',
                      align: 'center'
                    },{
                      id: '6',
                      label: '系统管理员',
                      prop: 'admin_name',
                      align: 'center'
                    }
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                border: true, 
                hasSelect: false, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: false, //是否有第一条分页条
                showScrollBar: true, // 是否显示scrollWithBar 组件
                search: {
                    value:'',
                    show: false,  // 不需要显示搜索
                    url: "setting.queryAreasList", //快捷搜索的方法名称:  模块.方法名
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
            const { keyword, list } = this.search;
            let params = {
                expand: 'brands,orgs',
                name: list[keyword].currentVal,    
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.setting.queryAreasList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        viewDetail(row){
            if(!row.hasOwnProperty('brandsName')){
                let brands = [];
                if(this.$hasArrContent(row.brands)){
                    row.brands.forEach((item)=>{
                        brands.push(item.name)
                    })
                    row['brandsName'] = brands.join('、');
                }
            }
            this.shopInfo = row;
            this.showDialog = true;
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

.setting-shop-page /deep/ .top-pagination {
    display: none;
}

/deep/ .export-log-btn.el-col-6 {
    width: 290px;
}
</style>
