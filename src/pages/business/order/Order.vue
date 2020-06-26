<template>
    <div class="deal-list-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.dccGroup]" filterable @change="changeDccGroup" v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col :info="search.list[search.dcc]" filterable v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col :info="search.list[search.level]"></search-col>
                <search-col :info="search.list[search.customer]"  @fristChange="changeFrom" size="small"></search-col>
                <search-col :info="search.list[search.brand]"  @change="changeBrand"></search-col>
                <search-col :info="search.list[search.series]" @change="changeSeries"></search-col>
                <search-col :info="search.list[search.model]"></search-col>
                <search-col :info="search.list[search.area]" filterable></search-col>
                <search-col :info="search.list[search.advisor]" clearable filterable  remote :selectPlaceholder="'请输入名字,手机号进行搜索'" :remote-method="remoteMethod" :loading="loading" @clear="remoteMethod"></search-col>
                <search-col :info="search.list[search.insurance]"></search-col>
                <search-col :info="search.list[search.loan]"></search-col>
                <search-col :info="search.list[search.order]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <!--导出 二进制文件流-->
                    <!-- <common-export class="m-l-5" :config="exportConfig" plain :isLoad="false"></common-export> -->

                    <!-- 导出日志 -->
                    <!-- <export-log class="m-l-5" :config="logConfig"></export-log> -->
                </div>   
                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" v-if="props.obj.row.intentionId" plain round size="mini" @click="seeDetail(props.obj.row)">查看</el-button>
                    <span v-else>--</span>
                </template> 

                <template slot-scope="props" slot="from">
                    <span v-if="props.obj.row.orderFromTopName">{{ props.obj.row.orderFromTopName}} </span>
                    <span v-if="props.obj.row.orderFromTopName && props.obj.row.orderFromSecondName">--</span>
                    <span v-if="props.obj.row.orderFromSecondName">{{ props.obj.row.orderFromSecondName}} </span>
                    <span v-if="!props.obj.row.orderFromTopName && !props.obj.row.orderFromSecondName">--</span>
                </template> 
            </data-table>
        </div>

        <order-detail v-if="showDialog" :row="rowInfo" @cancel="showDialog=false"></order-detail>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'; 
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import ExportLog from '@/components/export/ExportLog';
import CommonExport from '@/components/export/CommonExport';
import SearchMixins from '@/pages/mixins/SearchMixins'
import OrderDetail from './OrderDetail'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        ExportLog,
        CommonExport,
        OrderDetail
    },
    mixins: [SearchMixins],
    data(){
        return{
            showDialog: false,
            rowInfo: {},
            loading: false,
        }
    },
    created(){
        this.initData();
        this.queryData();
    },
    computed: {
        ...mapGetters([ 'roleKey',])
    },
    methods: {
        initData(){
            this.initSearch(); // 初始化搜索列
            this.initTable();
            this.initExport();
             
            this.getDccList();  //  DCC组 在searchMixins.vue 组件里面
            this.getBrandList(); // 在searchMixins.vue 组件里面
            this.getClueFrom();  // 在searchMixins.vue 组件里面
            this.getAreaOptions();  // 门店
            this.getOrderAdvisorOptions(); // 销售顾问
            this.getClueLevelList(); // 意向等级
        },
        initExport(){
            this.exportConfig = {
                fileName: "订单导出",  // 导出文件名
                ext: "csv",    // 导出文件格式
                idName: "id",  // 取对象的那个字段的值
                select: [],    // 多选的时候导出
                taskType: "",  // 任务的类型
                url: "business.exportOrderExcel",       // 接口路径
                other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
            }
            this.logConfig = {
                listUrl: 'business.exportOrderLog',   // 模块.方法明， 默认用公共的导出，下载方法
                downUrl: 'business.exportOrderExcel',   // 模块.方法明， 默认用公共的导出，下载方法 
            }
        },
        initSearch(){
            this.search = {  // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
                list: [
                    {
                        prop: 'dccGroup',
                        type: 'select', 
                        label: '跟进坐席组', 
                        currentVal: '', 
                        selectOptions:[], 
                        optionLabel:'dccGroupName', 
                        optionValue:"id", 
                    },{
                        prop: 'dcc',
                        type: 'select', 
                        label: '跟进DCC', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'dccName', 
                        optionValue:"id",
                    },{
                        prop: 'customer',
                        type: 'cascader', 
                        label: '客户来源', 
                        currentVal: '', 
                        oneVal: '',
                        oneOptions:[],
                        oneOptionLabel: 'title',
                        oneOptionValue: 'id',
                        secondVal:'',
                        isAll:true,
                        isAllTitle: '全部',
                        secondOptions: [],
                        secondOptionLabel: 'title',
                        secondOptionValue: 'id', 
                    },{
                        prop: 'brand',
                        type: 'select', 
                        label: '订单品牌', 
                        currentVal: '', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'series',
                        type: 'select', 
                        label: '订单车系', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'model',
                        type: 'select', 
                        label: '订单车型', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'area',
                        type: 'select', 
                        label: '订单门店', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'advisor',
                        type: 'select', 
                        label: '销售顾问', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'advisorName', 
                        optionValue:"advisorTel",  // advisorId  advisorName advisorTel,后端由于advisorId不准确，name现实中有重名，所以用手机号查询, 
                    },{
                        prop: 'insurance',
                        type: 'select', 
                        label: '购买保险', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[{'title':'是','id':1},{'title':'否','id':2}], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'loan',
                        type: 'select', 
                        label: '是否贷款', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[{'title':'是','id':1},{'title':'否','id':2}], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'order',
                        type: 'datePicker', 
                        label: '下订时间', 
                        currentVal: '', 
                    },{
                        prop: 'level',
                        type: 'select', 
                        label: '意向等级', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id",
                    },
                ],
                dccGroup: 0, // 跟进坐席组
                dcc: 1,      // 跟进DCC
                customer:2,  // 客户来源
                brand: 3,    // 订单品牌
                series: 4,   // 订单车系
                model: 5,    // 订单车型
                area: 6,     // 订单门店
                advisor:7,   // 销售顾问
                insurance:8, // 购买保险
                loan:9,      // 是否贷款
                order:10,     // 下订时间
                level: 11,    // 意向等级
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: '80'
                    },{
                      id: '2',
                      label: '客户ID',
                      prop: 'userId',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '3',
                      label: '客户姓名',
                      prop: 'nickname',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '4',
                      label: '手机号码',
                      prop: 'tel',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '5',
                      label: '意向等级',
                      prop: 'level',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '6',
                      label: '跟进坐席组',
                      prop: 'dccGroupName',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '7',
                      label: '跟进DCC',
                      prop: 'dccName',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '8',
                      label: '订单编号',
                      prop: 'orderId',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '9',
                      label: '订单门店',
                      prop: 'orderAreaName',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '10',
                      label: '销售顾问',
                      prop: 'orderAdvisorName',
                      tooltip:true,
                      minWidth: '120'
                    },
                    // {
                    //   id: '11',
                    //   label: '订单姓名',
                    //   prop: 'orderNickname',
                    //   tooltip:true,
                    //   minWidth: '100'
                    // },{
                    //   id: '12',
                    //   label: '订单电话',
                    //   prop: 'orderTel',
                    //   tooltip:true,
                    //   minWidth: '120'
                    // },
                    {
                      id: '13',
                      label: '订单品牌',
                      prop: 'orderBrand',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '14',
                      label: '订单车系',
                      prop: 'orderCarSeries',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '15',
                      label: '订单车型',
                      prop: 'orderModel',
                      tooltip:true,
                      minWidth: '200'
                    },{
                      id: '16',
                      label: '购买保险',
                      prop: 'orderIsInsuranceName',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '17',
                      label: '是否贷款',
                      prop: 'orderIsMortgageName',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '18',
                      label: '车牌号',
                      prop: 'orderLicensePlate',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '19',
                      label: 'VIN',
                      prop: 'orderVin',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '20',
                      label: '客户来源',
                      prop: 'from',
                      show: 'template',
                      tooltip:true,
                      minWidth: '130'
                    },{
                      id: '21',
                      label: '订单状态',
                      prop: 'orderStatus',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '22',
                      label: '下订时间',
                      prop: 'orderTime',
                      tooltip:true,
                      minWidth: '170'
                    },{
                      id: '23',
                      label: '交车时间',
                      prop: 'orderDeliveryTime',
                      tooltip:true,
                      minWidth: '170'
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
                    show: true,
                    url: "business.queryInvitelList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "请输入手机号码、客户姓名", //快捷搜索输入框提示文字
                    displayCol: ["nickname","tel"], //弹出需要显示的列
                    params: {
                      id: ""
                    }
                },
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { dccGroup,dcc,level, customer,brand,series,model,area,advisor,insurance,loan,order, list } = this.search;
            let params = {
                dccGroupId: list[dccGroup].currentVal,
                dccId:list[dcc].currentVal,
                level: list[level].currentVal,
                fromTopId: list[customer].oneVal,         // 客户来源一级级
                fromSecondId: list[customer].secondVal,   // 客户来源二级  
                orderBrandId: list[brand].currentVal,     // 订单品牌ID
                orderCarSeriesId: list[series].currentVal,     // 意向车系ID
                orderModelId: list[model].currentVal,          // 意向车型ID
                orderAreaId: list[area].currentVal,            // 下单门店ID
                orderAdvisorKeyword:  list[advisor].currentVal,       // 销售顾问ID
                orderIsInsurance:  list[insurance].currentVal,   // 是否购买了保险。默认所有。0未知，1是，2否
                orderIsMortgage: list[loan].currentVal,          // 是否有贷款。默认所有。0未知，1是，2否
                orderStartTime: list[order].currentVal && list[order].currentVal[0]+ ' 00:00:00',  //  下订时间
                orderEndTime: list[order].currentVal && list[order].currentVal[1]+ ' 23:59:59',    //  下订时间
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.exportConfig.other = Object.assign({},params);  // 导出配置参数
            this.$fetch.business.queryOrderlList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        seeDetail(row){
            this.rowInfo = row;
            this.showDialog=true;
        },
        remoteMethod(query){
            this.loading = true;
            this.getOrderAdvisorOptions(query);
        },
        getOrderAdvisorOptions(query){
            // 销售顾问
            this.$fetch.business.orderAdvisorList({'orderAdvisorKeyword': query},false, false).then((res)=>{
                this.loading = false;
                this.$handleResponse(res, data=>{
                    this.search.list[this.search.advisor].selectOptions = this.$hasArrContent(data.list)?data.list:[]; 
                }, false);
            }).catch((err)=>{
                this.loading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
