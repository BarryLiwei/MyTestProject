<template>
    <div class="potential-manage-page m-20 common-box">
        <search-bar size="small" class="m-t-10 p-20"  @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.dccGroup]" filterable @change="changeDccGroup" v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col :info="search.list[search.dcc]" filterable v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col :info="search.list[search.brand]" @change="changeBrand"></search-col>
                <search-col :info="search.list[search.series]" @change="changeSeries"></search-col>
                <search-col :info="search.list[search.model]"></search-col>
                <search-col :info="search.list[search.arrival]"></search-col>
                <search-col :info="search.list[search.area]" filterable></search-col>
                <search-col :info="search.list[search.advisor]"  clearable filterable  remote :selectPlaceholder="'请输入名字,手机号进行搜索'" :remote-method="remoteMethod" :loading="loading" @clear="remoteMethod"></search-col>
                <search-col :info="search.list[search.sendTime]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.areaStatus]"></search-col>
                <search-col :info="search.list[search.appoint]"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col> 
                <search-col :info="search.list[search.visited]"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col> 
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
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFollow(props.obj.row)" :disabled="['dcc_inviter'].indexOf(roleKey)==-1">跟进</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="seeDetail(props.obj.row)">查看</el-button>
                </template> 
            </data-table>
        </div>

        <invite-detail :showDialog="showDialog" :row="rowInfo" @cancel="showDialog=false"></invite-detail>
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
import InviteDetail from './InviteDetail'
import moment from 'moment'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        ExportLog,
        CommonExport,
        InviteDetail
    },
    mixins: [SearchMixins],
    data(){
        return{
            showDialog: false,
            rowInfo: {},
            loading: false
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

            this.getBrandList();
            this.getDccList();  //  DCC组 在searchMixins.vue 组件里面
            this.getArrivalOptions("arrival"); // 到店类型
            this.getAreaOptions();  // 门店
            this.getInviteAdvisorOptions(); // 销售顾问
            this.getAreaArchiveStatueOptions(); // 门店档案状态
        },
        initExport(){
            this.exportConfig = {
                fileName: "邀约导出",  // 导出文件名
                ext: "csv",    // 导出文件格式
                idName: "id",  // 取对象的那个字段的值
                select: [],    // 多选的时候导出
                taskType: "",  // 任务的类型
                url: "business.exportInviteExcel",       // 接口路径
                other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
            }

            this.logConfig = {
                listUrl: 'business.exportInviteLog',   // 模块.方法明， 默认用公共的导出，下载方法
                downUrl: 'business.exportInviteExcel',   // 模块.方法明， 默认用公共的导出，下载方法 
            }
        },
        initSearch(){
            let route = this.$route && this.$route.query;
            let appointDate = '';  // 预计到店时间
            let visitedDate = '';  // 实际到店时间
            // 状态：未到店0 - 预计到店时间，已到店1 - 实际到店时间
            if(route.state) {
                let date = moment(new Date()).format('YYYY-MM-DD');
                switch (route.state) {
                    case '0':
                        appointDate = [date, date];
                        break;
                    case '1':
                        visitedDate = [date, date];
                        break;
                    default:
                        break;
                }
            }

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
                        prop: 'arrival',
                        type: 'select', 
                        label: '到店类别', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'area',
                        type: 'select', 
                        label: '邀约门店', 
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
                        optionValue:"advisorTel",  // advisorId  advisorName advisorTel,后端由于advisorId不准确，name现实中有重名，所以用手机号查询
                    },{
                        prop: 'sendTime',
                        type: 'datePicker', 
                        label: '下发时间', 
                        currentVal: '', 
                    },{
                        prop: 'areaStatus',
                        type: 'select', 
                        label: '档案状态', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'appoint',
                        type: 'datePicker', 
                        label: '预计到店时间', 
                        currentVal: appointDate, 
                    },{
                        prop: 'visited',
                        type: 'datePicker', 
                        label: '实际到店时间', 
                        currentVal: visitedDate, 
                    }
                ],
                dccGroup: 0, // DCC坐席组
                dcc: 1,      // DCC邀约员
                brand: 2,   // 意向品牌
                series: 3,  // 意向车系
                model: 4,   // 意向车型
                arrival: 5, // 到店类别
                area: 6,     // 到店门店
                advisor: 7,  // 销售顾问
                sendTime: 8, // 下发时间
                areaStatus: 9,   // 档案状态
                appoint: 10,  // 登记到店时间
                visited: 11,   // 实际到店时间
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: '160'
                    },{
                      id: '2',
                      label: '客户ID',
                      prop: 'userId',
                      tooltip:true,
                      minWidth: "100"
                    },{
                      id: '3',
                      label: '客户姓名',
                      prop: 'nickname',
                      tooltip:true,
                      minWidth: "100"
                    },{
                      id: '4',
                      label: '手机号码',
                      prop: 'tel',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '5',
                      label: '跟进坐席组',
                      prop: 'dccGroupName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '6',
                      label: '跟进DCC',
                      prop: 'dccName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '7',
                      label: '邀约门店',
                      prop: 'areaName',
                      tooltip:true,
                      minWidth: "140"
                    },{
                      id: '8',
                      label: '意向车型',
                      prop: 'model',
                      tooltip:true,
                      minWidth: "200"
                    },{
                      id: '9',
                      label: '下发时间',
                      prop: 'createdAt',
                      tooltip:true,
                      minWidth: "140"
                    },{
                      id: '10',
                      label: '档案状态',
                      prop: 'areaArchiveStatusName',
                      tooltip:true,
                      minWidth: "110"
                    },{
                      id: '11',
                      label: '预计到店时间',
                      prop: 'appointmentDate',
                      tooltip:true,
                      minWidth: "170"
                    },{
                      id: '12',
                      label: '实际到店时间',
                      prop: 'visitDate',
                      tooltip:true,
                      minWidth: "170"
                    },{
                      id: '13',
                      label: '到店类别',
                      prop: 'statusName',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '14',
                      label: '销售顾问',
                      prop: 'advisorName',
                      tooltip:true,
                      minWidth: "110"
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
            const { brand,series,model,arrival,area,advisor,sendTime, areaStatus,appoint,visited,dccGroup, dcc, list } = this.search;
            let params = {
                dccGroupId: list[dccGroup].currentVal,   // 坐席组
                dccId: list[dcc].currentVal,             // 邀约员
                brandId: list[brand].currentVal,      // 意向品牌ID
                carSeriesId: list[series].currentVal,  // 意向车系ID
                modelId: list[model].currentVal,       // 意向车型ID
                status: list[arrival].currentVal,        // 到店类别
                areaId: list[area].currentVal,           // 到店门店
                advisorKeyword: list[advisor].currentVal,       // 销售顾问
                issueStartTime: list[sendTime].currentVal && list[sendTime].currentVal[0] + ' 00:00:00',   // 下发时间
                issueEndTime: list[sendTime].currentVal && list[sendTime].currentVal[0] + ' 23:59:59',     // 下发时间
                areaArchiveStatus: list[areaStatus].currentVal,       // 档案状态
                appointmentDateStartTime: list[appoint].currentVal && list[appoint].currentVal[0] + ' 00:00:00',   // 预约到店时间
                appointmentDateEndTime: list[appoint].currentVal && list[appoint].currentVal[0] + ' 23:59:59',     // 预约到店时间
                visitDateStartTime: list[visited].currentVal && list[visited].currentVal[0] + ' 00:00:00',         // 实际到店时间
                visitDateEndTime: list[visited].currentVal && list[visited].currentVal[0] + ' 23:59:59', 
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.exportConfig.other = Object.assign({},params);  // 导出配置参数
            this.$fetch.business.queryInvitelList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true)            
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        seeDetail(row){
            this.showDialog=true;
            this.rowInfo = row;
        },
        handleFollow(row){
            this.$router.push({'path': '/work/customerFollow', query:{'id': row.intentionId, 'userId': row.userId}})
        },
        getAreaArchiveStatueOptions(){
            // 门店档案状态，只有邀约管理有，所以放在这里
            this.$fetch.common.AreaArchiveStatusList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.areaStatus].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        remoteMethod(query){
            this.loading = true;
            this.getInviteAdvisorOptions(query);
        },
        getInviteAdvisorOptions(query){
            // 销售顾问
            this.$fetch.business.inviteAdvisorList({'advisorKeyword': query},false, false).then((res)=>{
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