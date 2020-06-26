<template>
    <div class="potential-manage-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col  :info="search.list[search.dccGroup]" filterable :leftCol="8" @change="changeDccGroup" v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col  :info="search.list[search.dcc]" filterable :leftCol="8" v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col :info="search.list[search.customer]" :leftCol="8" @fristChange="changeFrom" size="small"></search-col>
                <search-col :info="search.list[search.brand]" :leftCol="8" @change="changeBrand"></search-col>
                <search-col :info="search.list[search.series]" :leftCol="8" @change="changeSeries"></search-col>
                <search-col :info="search.list[search.model]" :leftCol="8"></search-col>
                <search-col :info="search.list[search.level]" :leftCol="8"></search-col>
                <search-col :info="search.list[search.area]" :leftCol="8" filterable></search-col>
                <search-col :info="search.list[search.archive]" :leftCol="8" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.last]"  :leftCol="8" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.next]"  :leftCol="8" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.status]" :leftCol="8"></search-col>
                <search-col :info="search.list[search.overTime]" :leftCol="8"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" tableId="firstTable" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" class="w-60" round size="small" @click="addArchiveFn" :disabled="['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1">新增</el-button>
                    <el-button type="primary" class="w-60" round size="small" @click="distributeFn('batch',{})" :disabled="['dcc_supervisor','dcc_group_leader','administrator'].indexOf(roleKey)==-1">分配</el-button>
                    <el-button type="primary" class="w-60" round size="small" @click="handleActive('batch',{})" :disabled="['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1">激活</el-button>
                    <!-- <el-button class="blue_font_white_bg" plain size="small" round >导入</el-button> -->

                    <!--导出 二进制文件流-->
                    <!-- <common-export class="m-l-5 blue_font_white_bg" :config="exportConfig" plain :isLoad="false"></common-export> -->

                    <!-- 导出日志 -->
                    <!-- <export-log class="m-l-5" :config="logConfig"></export-log> -->
                </div>   
                <template slot-scope="props" slot="caozuo">
                    <!-- 跟进状态： 0 跟进中，1已成交  2:战败  3 已下发  4：审核中(战败审核中) -->
                    <div class="table-opertor">
                        <el-button class="blue_font_white_bg" plain round size="mini"  @click="seeDetail(props.obj.row)">查看</el-button>
                        <el-button class="blue_font_white_bg" plain round size="mini"  @click="handleFollow(props.obj.row)" :disabled="props.obj.row.level == 'F' || roleKey!=='dcc_inviter'">跟进</el-button>
                        <el-button class="blue_font_white_bg" plain round size="mini"  @click="distributeFn('one',props.obj.row)" :disabled="props.obj.row.status == 4 ||(['dcc_supervisor','dcc_group_leader','administrator'].indexOf(roleKey)==-1)">分配</el-button>
                        <el-button class="blue_font_white_bg" plain round size="mini"  @click="handleActive('one',props.obj.row)"  :disabled="props.obj.row.level != 'F' ||(['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1)">激活</el-button>
                    </div>
                </template> 

                 <template slot-scope="props" slot="from">
                    <span v-if="props.obj.row.fromTopName">{{ props.obj.row.fromTopName}} </span>
                    <span v-if="props.obj.row.fromTopName && props.obj.row.fromSecondName">--</span>
                    <span v-if="props.obj.row.fromSecondName">{{ props.obj.row.fromSecondName}} </span>
                    <span v-if="!props.obj.row.fromTopName && !props.obj.row.fromSecondName">--</span>
                </template> 
            </data-table>
        </div>

        <!-- 新增弹窗 -->
        <add-archives-dialog v-if="showAddDialog" @archiveCloseFn="archiveCloseFn" :dccConfig="dccConfig"></add-archives-dialog>

        <!-- 分配 -->
        <distribute v-if="showDistribute" :config="disConfig" @close="closeDistribute" :loading="dialogLoading"></distribute>

        <!-- 激活 -->
        <actived v-if="showActived" :config="actConfig" @close="closeActived" :loading="dialogLoading"></actived>

         <!-- 激活和分配的结果 -->
        <show-result v-if="showResultTip" :config="resultConfig" @close="showResultTip=false"></show-result>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'; 
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import ExportLog from '@/components/export/ExportLog';
import CommonExport from '@/components/export/CommonExport'
import AddArchivesDialog from '@/pages/work/components/AddArchivesDialog'
import SearchMixins from '@/pages/mixins/SearchMixins'
import Distribute from '@/pages/business/components/Distribute'
import Actived from '@/pages/business/components/Actived'
import ShowResult from '@/pages/business/components/ShowResult'
import * as Util from '@/utils/util'



export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        ExportLog,
        CommonExport,
        AddArchivesDialog,
        Distribute,
        Actived,
        ShowResult
    },
    mixins: [SearchMixins],
    data(){
        return{
            showAddDialog: false,
            showDistribute: false,
            showActived: false, // 激活弹窗
            showResultTip: false, // 线索结果
            dialogLoading: false, // 分配，激活弹窗点击保存的时候
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
            this.getDccList();  //  DCC组   
            this.getBrandList(); // 品牌     
            this.getClueFrom();  // 客户来源        
            this.getClueLevelList(); // 意向等级
            this.getAreaOptions();  // 门店
            this.getArchiveStatusOptions("status"); // 潜客跟进状态


            this.initSearch(); // 初始化搜索列
            this.initTable();
            this.initExport();
        },
        initSearch(){
            console.log('initSearch 一次');
            let route = this.$route && this.$route.query;

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
                        prop: 'level',
                        type: 'select', 
                        label: '意向等级', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'area',
                        type: 'select', 
                        label: '归属门店', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'archive',
                        type: 'datePicker', 
                        label: '建档时间', 
                        currentVal: '', 
                    },{
                        prop: 'last',
                        type: 'datePicker', 
                        label: '最后跟进时间', 
                        currentVal: '', 
                    },{
                        prop: 'next',
                        type: 'datePicker', 
                        label: '下次跟进时间', 
                        currentVal: '', 
                    },{
                        type: 'select', 
                        label: '跟进状态', 
                        currentVal: '',   // 0：跟进中
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '逾期跟进', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[{'name': '是', 'id': 'yes'},{'name': '否', 'id': 'no'}], 
                        optionLabel:'name', 
                        optionValue:"id", 
                    }
                ],
                dccGroup: 0, // 所属DCC坐席组
                dcc: 1,     // 所属DCC邀约
                customer: 2, // 客户来源
                brand: 3,    // 意向品牌
                series: 4,   // 意向车系
                model: 5,    // 意向车型
                level: 6,    // 意向等级
                area: 7,    // 归属门店
                archive: 8,  // 建档时间
                last: 9,   // 最后跟进时间
                next: 10,     // 下次跟进时间
                status: 11,   // 跟进状态
                overTime: 12,  // 逾期跟进
            }
          
            let that = this;
            if(route.follow_day == 1)
            {
                //今日待跟进
                // this.search.list[that.search.status].currentVal = 0; // 后端说去掉这个，因为现在有多个状态
                this.search.list[that.search.next].currentVal = [Util.dateFormat(),Util.dateFormat()];
            }else if(route.follow_day == 2){
                let tomorrow = new Date(new Date().getTime()+86400*1000);
                // this.search.list[that.search.status].currentVal = 0;
                this.search.list[that.search.next].currentVal = [Util.dateFormat(tomorrow),Util.dateFormat(tomorrow)];               
            }else if(route.follow_day == 3)
            {
                let houtian = new Date(new Date().getTime()+86400*1000*2);
                // this.search.list[that.search.status].currentVal = 0;
                this.search.list[that.search.next].currentVal = [Util.dateFormat(houtian),Util.dateFormat(houtian)];    
            }
    
            if(route.overtime == 1)
            {
               this.search.list[that.search.overTime].currentVal = 'yes';
            }

            // 从详情页面跳转回来取缓存数据
            if(this.$store.state.business.potential && this.$store.state.business.potential.search){
                this.search.list = this.$deepCopyContent(this.$store.state.business.potential.search);
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: "263"
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
                      label: '意向等级',
                      prop: 'level',
                      tooltip:true,
                      minWidth: "100"
                    },{
                      id: '6',
                      label: '跟进坐席组',
                      prop: 'dccGroupName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '7',
                      label: '跟进DCC',
                      prop: 'dccName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '8',
                      label: '跟进状态',
                      prop: 'statusName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '9',
                      label: '建档时间',
                      prop: 'createdAt',
                      tooltip:true,
                      minWidth: "160"
                    },{
                      id: '10',
                      label: '最后跟进时间',
                      prop: 'lastFollowDate',
                      tooltip:true,
                      minWidth: "160"
                    },{
                      id: '11',
                      label: '下次跟进时间',
                      prop: 'nextFollowDate',
                      tooltip:true,
                      minWidth: "160"
                    },{
                      id: '12',
                      label: '归属门店',
                      prop: 'areaName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '13',
                      label: '意向品牌',
                      prop: 'brand',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '14',
                      label: '意向车系',
                      prop: 'carSeries',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '15',
                      label: '意向车型',
                      prop: 'model',
                      tooltip:true,
                      minWidth: "200"
                    },{
                      id: '16',
                      label: '客户来源',
                      prop: 'from',
                      show:'template',
                      tooltip:true,
                      minWidth: "130"
                    },{
                      id: '17',
                      label: '销售顾问',
                      prop: 'advisorName',
                      tooltip:true,
                      minWidth: "120"
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
                    url: "business.queryPotentialList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "客户ID/客户姓名/手机号码", //快捷搜索输入框提示文字
                    displayCol: ["nickname","tel"], //弹出需要显示的列
                    params: {
                      id: ""
                    }
                },
            }

            // 从详情页面跳转回来取缓存数据
            if(this.$store.state.business.potential && this.$store.state.business.potential.page){
                this.dataTable.page = this.$deepCopyContent(this.$store.state.business.potential.page);
                this.$nextTick(()=>{
                    this.$refs.DataTableRef.currentPage = this.dataTable.page.currentPage;
                })
            }
        },
        initExport(){
            this.exportConfig = {
                fileName: "潜客导出",  // 导出文件名
                ext: "csv",    // 导出文件格式
                idName: "id",  // 取对象的那个字段的值
                select: [],    // 多选的时候导出
                taskType: "",  // 任务的类型
                url: "business.exportPotentialExcel",       // 接口路径
                other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
            }

            this.logConfig = {
                listUrl: 'business.exportPotentialLog',   // 模块.方法明， 默认用公共的导出，下载方法
                downUrl: 'business.exportPotentialExcel',   // 模块.方法明， 默认用公共的导出，下载方法 
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { customer,brand,series,model,level,area,archive,last,next,status,dccGroup,dcc,overTime,list } = this.search;
            let params = {
                dccGroupId: list[dccGroup].currentVal,   // 跟进坐席组
                dccId: list[dcc].currentVal,             // 跟进DCC
                fromTopId:  list[customer].oneVal,       // 客户来源
                fromSecondId: list[customer].secondVal,  // 客户来源
                brandId: list[brand].currentVal,         // 意向品牌
                carSeriesId: list[series].currentVal,    // 意向车系
                modelId: list[model].currentVal,         // 意向车型
                level:  list[level].currentVal,          // 意向等级
                areaId: list[area].currentVal,           // 归属门店
                archiveStartTime:list[archive].currentVal && list[archive].currentVal[0]+ " 00:00:00", // 建档时间
                archiveEndTime:list[archive].currentVal && list[archive].currentVal[1]+ " 23:59:59",
                lastFollowDateStartTime: list[last].currentVal && list[last].currentVal[0] + " 00:00:00", // 最后跟进时间
                lastFollowDateEndTime: list[last].currentVal && list[last].currentVal[1]+ " 23:59:59",
                nextFollowDateStartTime: list[next].currentVal && list[next].currentVal[0] + " 00:00:00", // 下次跟进时间
                nextFollowDateEndTime:list[next].currentVal && list[next].currentVal[1]+ " 23:59:59", 
                status: list[status].currentVal,           // 跟进状态
                overtime: list[overTime].currentVal,     // 逾期跟进
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.exportConfig.other = Object.assign({},params);  // 导出配置参数
            this.$fetch.business.queryPotentialList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        addArchiveFn(){ // 新增档案
            this.showAddDialog=true;
            this.dccConfig = {
                show: true,
                groupOptions: this.$deepCopyContent(this.search.list[this.search.dccGroup].selectOptions),
                groupObj: this.dccGroupObj,
            }

            if(this.dccConfig.groupOptions && this.dccConfig.groupOptions[0].id === 0){
                this.dccConfig.groupOptions.shift();
            }
        },
        archiveCloseFn(type){ // 档案窗口关闭
            this.showAddDialog = false;
            if(type == 'success'){
                this.queryData();
            }
        },
        seeDetail(row){
            let store = {
                'type': 'potential',
                'search': this.search.list,
                'page': this.dataTable.page
            }
            this.$store.commit('setBusinessStore', store); // 进入详情页，缓存页面数据
            this.$router.push({'path':'/business/potential/detail', query: {'id': row.id}});
        },
        handleFollow(row){
            this.$router.push({'path': '/work/customerFollow', query:{'id': row.id, 'userId': row.userId}})
        },
        distributeFn(total, row){ // 分配弹窗
            this.disConfig = {
                title: '分配',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                dccRequired: true,
                selectId: [row.id], // 选择的列表id
                tip: '',
            }
            if(total == 'batch'){ // 批量处理
                if(!this.selectData || !this.selectData.length){ // 在mixins组件中
                    this.$message.error("请选择潜客")
                    return;
                }
                let ids = []
                for(let i=0, length=this.selectData.length; i<length; i++){
                    ids.push(this.selectData[i].id)
                    if([4].indexOf(this.selectData[i].status) > -1){ // 跟进状态： 0 跟进中，1已成交  2:战败  3 已下发  4：审核中(战败审核中)
                        this.$message.error(`客户姓名为：${this.selectData[i].nickname} 的潜客状态为${this.selectData[i].statusName}, 不能分配(批量分配功能只可选择归属坐席组一致且非战败审核中的潜客，您可通过归属门店和跟进状态进行潜客筛选)`)
                        return;
                    }
                }
                this.disConfig.title = '批量分配';
                this.disConfig.selectId = ids; 
            }

            this.$fetch.business.archiveAssignDCCList({'ids':this.disConfig.selectId,'operate': 'assign'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.disConfig.listTotal = res.listTotal;
                    if(res.listTotal ==1){
                        this.disConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showDistribute = true;
                        this.dialogLoading=false;
                    }else if(res.listTotal > 1){
                        this.$message.error("所选潜客分别归属多个组，不能被分配(分配功能只可选择归属坐席组一致且非战败审核中的潜客，您可通过归属门店和跟进状态进行潜客筛选)")
                    }else {
                        this.$notify.error({
                          title: '错误提示',
                          message: '当前潜客不符合要求'
                        })
                    }
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        closeDistribute(type, val){ // 分配弹窗关闭
            if(type == 'cancel'){
                this.showDistribute = false;
                this.dialogLoading=false;
                return
            }
            if(!val.dccId){
                this.$message.error('请选择dcc人员')
                return
            }
            let params = Object.assign({'ids':this.disConfig.selectId},val);
            this.dialogLoading=true;
            this.$fetch.business.ArchiveAssign(params).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.showDistribute = false;
                    this.queryData();
                    if(this.disConfig.title == '批量分配'){
                        this.$nextTick(()=>{ // 此不可缺少
                            this.setShowResult(this.disConfig.selectId.length, data);
                        })
                    }else {
                       this.$message.success('分配成功');
                    }
                },true)
                this.dialogLoading=false;
            }).catch(()=>{
                this.dialogLoading=false;
                this.$store.commit('closeLoading');
            })
        },
        handleActive(total, row){ // 激活弹窗
            this.actConfig = {
                title: '激活',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                dccRequired: true,
                showLevel: true, // 潜客和战败需要显示等级
                levelOptions: this.search.list[this.search.level].selectOptions,
                showTime: true,
                selectId: [row.id], // 选择的列表id
                tip: '',
            }
            if(total == 'batch'){ // 批量处理
                if(!this.selectData || !this.selectData.length){ // 在mixins组件中
                    this.$message.error("请选择潜客")
                    return;
                }
                let ids = []
                for(let i=0, length=this.selectData.length; i<length; i++){
                    ids.push(this.selectData[i].id)
                    if(this.selectData[i].level != 'F'){
                        this.$message.error(`客户姓名为：${this.selectData[i].nickname} 的潜客意向等级为${this.selectData[i].statusName}, 不能激活(批量激活活动只可选择档案归属坐席组一致且意向等级为F的潜客，您可通过归属门店和意向等级进行潜客筛选)`)
                        return;
                    }
                }
                this.actConfig.title = '批量激活';
                this.actConfig.selectId = ids; 
            }

            this.$fetch.business.archiveAssignDCCList({'ids':this.actConfig.selectId,'operate': 'defeatActive'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.actConfig.listTotal = res.listTotal; // listTotal 取值大于等于1，如果没有组，报非200，单条的激活有且只有一个组
                    if(res.listTotal ==1){
                        this.actConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.tip = '';
                    }else if(res.listTotal > 1){
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.groupOptions = [];
                        this.actConfig.tip = '您所选择的潜客档案归属坐席组不一致，批量激活后这些潜客并由原处理DCC继续处理';
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前潜客不符合要求'
                        })
                    }
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        closeActived(type, val){ // 激活弹窗关闭
            if(type == 'cancel'){
                this.showActived = false;
                this.dialogLoading=false;
                return
            }
            let params = Object.assign({'ids':this.actConfig.selectId},val);
            this.dialogLoading=true;
            this.$fetch.business.defeatActive(params).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.showActived = false;
                    this.queryData();
                    if(this.actConfig.title == '批量激活'){
                        this.$nextTick(()=>{ // 此不可缺少
                            this.setShowResult(this.actConfig.selectId.length, data); 
                        })
                    }else {
                        this.$message.success('激活成功');
                    }
                    
                },true)
                this.dialogLoading=false;
            }).catch(()=>{
                this.dialogLoading=false;
                this.$store.commit('closeLoading');
            })
        },
        setShowResult(totalNum=0, data, tip=""){ // 批量激活和分配后的状态显示
            this.resultConfig = {
                'total': totalNum,
                'success': data && data.success && data.success.length,
                'fail': data && data.fail && data.fail.length,
                'tip': tip
            }
            this.showResultTip = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.table-opertor .el-button+.el-button {
    margin-left: 2px;
}
</style>



