<template>
    <div class="defeat-list-page m-20 common-box">
        <search-bar size="small" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col  :info="search.list[search.dccGroup]"  filterable @change="changeDccGroup" v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col  :info="search.list[search.dcc]" filterable v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col :info="search.list[search.customer]"  @fristChange="changeFrom" size="small"></search-col>
                <search-col :info="search.list[search.brand]"  @change="changeBrand"></search-col>
                <search-col :info="search.list[search.series]" @change="changeSeries"></search-col>
                <search-col :info="search.list[search.model]"></search-col>
                <search-col :info="search.list[search.level]"></search-col>
                <search-col :info="search.list[search.area]" filterable></search-col>
                <search-col :info="search.list[search.type]"></search-col>
                <search-col :info="search.list[search.apply]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.handle]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.status]"></search-col>
                <search-col :info="search.list[search.archive]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
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
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="seeArchive(props.obj.row)">档案</el-button>
                </template> 

                <template slot-scope="props" slot="from">
                    <span v-if="props.obj.row.fromTopName">{{ props.obj.row.fromTopName}} </span>
                    <span v-if="props.obj.row.fromTopName && props.obj.row.fromSecondName">--</span>
                    <span v-if="props.obj.row.fromSecondName">{{ props.obj.row.fromSecondName}} </span>
                    <span v-if="!props.obj.row.fromTopName && !props.obj.row.fromSecondName">--</span>
                </template> 
            </data-table>
        </div>
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
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        ExportLog,
        CommonExport,
    },
     mixins: [SearchMixins],
    data(){
        return{}
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
            this.getBrandList(); // 在searchMixins.vue 组件里面
            this.getClueFrom();  // 在searchMixins.vue 组件里面
            this.getDccList();  //  DCC组 在searchMixins.vue 组件里面
            this.getClueLevelList(); // 意向等级
            this.getAreaOptions();  // 门店
            this.getDefeatStatusOptions(); // 战败状态
            this.getDefeatReasonOptions(); // 战败类型

            this.initSearch(); // 初始化搜索列
            this.initTable();
            this.initExport();
        },
        initExport(){
            this.exportConfig = {
                fileName: "战败导出",  // 导出文件名
                ext: "csv",    // 导出文件格式
                idName: "id",  // 取对象的那个字段的值
                select: [],    // 多选的时候导出
                taskType: "",  // 任务的类型
                url: "business.exportDefeatExcel",       // 接口路径
                other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
            }
            this.logConfig = {
                listUrl: 'business.exportDefeatLog',   // 模块.方法明， 默认用公共的导出，下载方法
                downUrl: 'business.exportDefeatExcel',   // 模块.方法明， 默认用公共的导出，下载方法 
            }
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
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
                        isAll: true,
                    },{
                        prop: 'brand',
                        type: 'select', 
                        label: '意向品牌', 
                        currentVal: '', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'series',
                        type: 'select', 
                        label: '意向车系', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'model',
                        type: 'select', 
                        label: '意向车型', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '意向等级', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '归属门店', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '战败类型', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'datePicker', 
                        label: '战败申请时间', 
                        currentVal: '', 
                    },{
                        type: 'datePicker', 
                        label: '战败处理时间', 
                        currentVal: '', 
                    },{
                        type: 'select', 
                        label: '战败状态', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'datePicker', 
                        label: '建档时间', 
                        currentVal: '', 
                    }
                ],
                dccGroup: 0, // 跟进坐席组
                dcc: 1,      // 跟进DCC
                customer: 2,    // 客户来源
                brand: 3,       // 意向品牌
                series: 4,     //  意向车系
                model: 5,        //  意向车型
                level: 6,       // 意向等级
                area: 7,       // 归属门店
                type:8,         // 战败类型
                apply:9,         // 战败申请时间
                handle: 10,       // 战败处理时间
                status: 11,       // 战败状态
                archive: 12,       // 建档时间
            }

        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: '100'
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
                      label: '跟进坐席组',
                      prop: 'dccGroupName',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '6',
                      label: '跟进DCC',
                      prop: 'dccName',
                      tooltip:true,
                      minWidth: '120'
                    },{
                      id: '7',
                      label: '跟进次数',
                      prop: 'followTimes',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '8',
                      label: '战败状态',
                      prop: 'reviewStatusName',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '9',
                      label: '战败类型',
                      prop: 'reasonType',
                      tooltip:true,
                      minWidth: '100'
                    },{
                      id: '10',
                      label: '建档时间',
                      prop: 'archiveCreatedAt',
                      tooltip:true,
                      minWidth: '170'
                    },{
                      id: '11',
                      label: '战败申请时间',
                      prop: 'createdAt',
                      tooltip:true,
                      minWidth: '170'
                    },{
                      id: '12',
                      label: '战败处理时间',
                      prop: 'reviewAt',
                      tooltip:true,
                      minWidth: '170'
                    },{
                      id: '13',
                      label: '归属门店',
                      prop: 'areaName',
                      tooltip:true,
                      minWidth: '130'
                    },{
                      id: '14',
                      label: '意向车型',
                      prop: 'model',
                      tooltip:true,
                      minWidth: '200'
                    },{
                      id: '15',
                      label: '客户来源',
                      prop: 'from',
                      show: 'template',
                      tooltip:true,
                      minWidth: '150'
                    },{
                      id: '16',
                      label: '销售顾问',
                      prop: 'advisorName',
                      tooltip:true,
                      minWidth: '120'
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
                    url: "business.queryDefeatlList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "客户ID/客户姓名/手机号码", //快捷搜索输入框提示文字
                    displayCol: ["nickname","tel"], //弹出需要显示的列
                    params: {
                      id: ""
                    }
                },
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { dccGroup,dcc,customer,brand,series,model,level,area,type,apply,handle,status,archive, list } = this.search;

            let params = {
                dccGroupId: list[dccGroup].currentVal,
                dccId: list[dcc].currentVal, 
                fromTopId: list[customer].oneVal,         // 客户来源一级级
                fromSecondId: list[customer].secondVal,   // 客户来源二级  
                brandId: list[brand].currentVal,          // 意向品牌ID
                carSeriesId: list[series].currentVal,     // 意向车系ID
                modelId: list[model].currentVal,          // 意向车型ID
                level: list[level].currentVal,            // 意向等级.默认所有.H,A,B,C
                areaId: list[area].currentVal,            // 来源门店ID
                reasonTypeId: list[type].currentVal,       // 战败类型
                reviewStatus: list[status].currentVal,       // 战败状态
                applyStartTime: list[apply].currentVal && list[apply].currentVal[0] + ' 00:00:00',
                applyEndTime: list[apply].currentVal && list[apply].currentVal[1]+ ' 23:59:59',
                reviewStartTime: list[handle].currentVal && list[handle].currentVal[0] + ' 00:00:00',  
                reviewEndTime: list[handle].currentVal && list[handle].currentVal[1]+ ' 23:59:59',    
                archiveCreatedStartTime: list[archive].currentVal && list[archive].currentVal[0] + ' 00:00:00',  
                archiveCreatedEndTime: list[archive].currentVal && list[archive].currentVal[1]+ ' 23:59:59',        
                pageSize: pageSize,     // 每页数量
                page: currentPage,              // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.exportConfig.other = Object.assign({},params);  // 导出配置参数
            this.$fetch.business.queryDefeatlList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        seeArchive(row){
            this.$router.push({'path':'/business/potential/detail', query: {'id': row.intentionId}});
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
