<template>
    <div class="clue-list-page m-20 common-box">
        <search-bar size="small" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col  :info="search.list[search.dccGroup]" :leftCol="8" filterable @change="changeDccGroup" v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col  :info="search.list[search.dcc]" :leftCol="8" filterable v-if="['dcc_supervisor','dcc_group_leader','dcc_inviter'].indexOf(roleKey)>-1"></search-col>
                <search-col  :info="search.list[search.grade]" :leftCol="8"></search-col>
                <search-col  :info="search.list[search.customer]" :leftCol="8" @fristChange="changeFrom" size="small"></search-col>
                <search-col  :info="search.list[search.brand]" :leftCol="8" @change="changeBrand"></search-col>
                <search-col  :info="search.list[search.series]" :leftCol="8" @change="changeSeries"></search-col>
                <search-col  :info="search.list[search.model]" :leftCol="8"></search-col>
                <search-col  :info="search.list[search.area]" :leftCol="8" filterable></search-col>
                <search-col  :info="search.list[search.type]" :leftCol="8"></search-col>
                <search-col  :info="search.list[search.state]" :leftCol="8"></search-col>
                <search-col  :info="search.list[search.time]"  :leftCol="8"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" class="w-60" round size="small" @click="addClue" :disabled="['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1">新增</el-button>
                    <el-button type="primary" class="w-60" round size="small" @click="distributeFn('batch',{})" :disabled="['dcc_supervisor','dcc_group_leader','administrator'].indexOf(roleKey)==-1">分配</el-button>
                    <!-- <el-button type="primary" class="w-60" round size="small" @click="handleActive('batch',{})" :disabled="['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1">激活</el-button> -->
                    <!-- <el-button plain size="small" round>导入</el-button> -->

                    <!--导出 二进制文件流-->
                    <!-- <common-export class="m-l-10" :config="exportConfig" plain :isLoad="false"></common-export> -->

                    <!-- 导出日志 -->
                    <!-- <export-log class="m-l-10" :config="logConfig"></export-log> -->
                </div>  
                 
                <template slot-scope="props" slot="caozuo">
                    <!-- 根据statue来判断是否已建档  1：跟进中  2：无效  3: 已建档  4: 无效审核中 -->
                    <div class="table-opertor">
                        <el-button class="blue_font_white_bg " plain round size="mini" @click="seeDetail(props.obj.row)">查看</el-button>
                        <el-button class="blue_font_white_bg"  plain round size="mini" @click="handleClue(props.obj.row)"  :disabled="props.obj.row.status!=1 || roleKey!='dcc_inviter'">处理</el-button>
                        <el-button class="blue_font_white_bg"  plain round size="mini" @click="distributeFn('one',props.obj.row)" :disabled="props.obj.row.status==4 || (['dcc_supervisor','dcc_group_leader','administrator'].indexOf(roleKey)==-1)">分配</el-button>
                        <!-- <el-button class="blue_font_white_bg"  plain round size="mini" @click="handleActive('one',props.obj.row)" :disabled="props.obj.row.status!=2 || (['dcc_supervisor','dcc_group_leader','dcc_inviter','administrator'].indexOf(roleKey)==-1)">激活</el-button> -->
                    </div>
                </template> 

                <template slot-scope="props" slot="grade">
                    <span v-if="props.obj.row.grade!=11"> {{ props.obj.row.grade | filterBlank }}分</span>
                    <span v-if="props.obj.row.grade==11">--</span>
                </template> 

                <template slot-scope="props" slot="from">
                    <span v-if="props.obj.row.fromTopName">{{ props.obj.row.fromTopName}} </span>
                    <span v-if="props.obj.row.fromTopName && props.obj.row.fromSecondName">--</span>
                    <span v-if="props.obj.row.fromSecondName">{{ props.obj.row.fromSecondName}} </span>
                    <span v-if="!props.obj.row.fromTopName && !props.obj.row.fromSecondName">--</span>
                </template> 
            </data-table>
        </div>

        <!-- 新增线索 -->
        <add-clues-dialog v-if="showAddClues"  @cluesSuccessFn="addClueSuccess" @cluesCloseFn="showAddClues=false" :dccConfig="dccConfig"></add-clues-dialog>

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
import { getStorageLoginType } from '@/utils/getUserInfo'
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import ExportLog from '@/components/export/ExportLog';
import CommonExport from '@/components/export/CommonExport';
import CascaderScrm from '@/components/CascaderScrm';
import AddCluesDialog from '@/pages/work/components/AddCluesDialog'
import SearchMixins from '@/pages/mixins/SearchMixins'
import Distribute from '@/pages/business/components/Distribute'
import Actived from '@/pages/business/components/Actived'
import ShowResult from '@/pages/business/components/ShowResult'

export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        ExportLog,
        CommonExport,
        CascaderScrm,
        AddCluesDialog,
        Distribute,
        Actived,
        ShowResult
    },
    mixins: [SearchMixins],
    data(){
        return{
            showAddClues: false, // 新增弹窗
            showDistribute: false, // 分配弹窗
            showActived: false, // 激活弹窗
            showResultTip: false, // 线索结果
            dialogLoading: false, // 分配，激活弹窗点击保存的时候
        }
    },
    created(){
        // 找不到的方法在searchMixins.vue 组件里面
        this.initData();
        this.queryData();
    },
    computed: {
        ...mapGetters(['roleKey',])
    },
    methods: {
        initData(){
            this.resultConfig={};
            this.getBrandList(); // 在searchMixins.vue 组件里面
            this.getClueFrom();  // 在searchMixins.vue 组件里面
            this.getDccList();  //  DCC组 在searchMixins.vue 组件里面
            this.getClueStatusList(); // 线索状态
            this.getClueTypeList(); // 线索类型
            this.getAreaOptions('area');  // 门店

            this.initSearch(); // 初始化搜索列
            this.initTable();
            this.initExport();            
        },
        initExport(){
            this.exportConfig = {
                fileName: "线索导出",  // 导出文件名
                ext: "csv",    // 导出文件格式
                idName: "id",  // 取对象的那个字段的值
                select: [],    // 多选的时候导出
                taskType: "",  // 任务的类型
                url: "business.exportClueExcel",       // 接口路径
                other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
            }

            this.logConfig = {
                listUrl: 'business.exportClueLog',   // 模块.方法明， 默认用公共的导出，下载方法
                downUrl: 'business.exportClueExcel',   // 模块.方法明， 默认用公共的导出，下载方法 
            }
        },
        initSearch(){
            let route = this.$route && this.$route.query;

            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
                        prop: 'dccGroup',
                        type: 'select', 
                        label: '处理坐席组', 
                        currentVal: '', 
                        selectOptions:[], 
                        optionLabel:'dccGroupName', 
                        optionValue:"id", 
                    },{
                        prop: 'dcc',
                        type: 'select', 
                        label: '处理DCC', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'dccName', 
                        optionValue:"id", 
                    },{   
                        prop: 'grade', // 增加prop 方便看对应的关系
                        type: 'select', 
                        label: '线索评分', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[{'title': '1分', 'value': 1},{'title': '2分', 'value': 2},{'title': '3分', 'value': 3},{'title': '4分', 'value': 4},{'title': '5分', 'value': 5}], 
                        optionLabel:'title', 
                        optionValue:"value", 
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
                        prop: 'state',
                        type: 'select', 
                        label: '线索类型', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'state',
                        type: 'select', 
                        label: '线索状态', 
                        currentVal: parseInt(route.state) || '', // 1: 跟进中
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        prop: 'time',
                        type: 'datePicker', 
                        label: '线索获取时间', 
                        currentVal: '', 
                    },
                ],
                dccGroup: 0, // 处理坐席组
                dcc: 1, // 处理DCC邀约员
                grade: 2, // 线索评分
                customer: 3, // 客户来源
                brand: 4, // 意向品牌
                series: 5, // 意向车系
                model: 6, // 意向车型
                area: 7, // 来源门店
                type: 8, // 线索类型
                state: 9, // 线索状态
                time: 10, // 获取线索时间
            }

            // 从详情页面跳转回来取缓存数据
            if(this.$store.state.business.clue && this.$store.state.business.clue.search){
                this.search.list = this.$store.state.business.clue.search;
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: "260"
                    },{
                      id: '2',
                      label: '线索姓名',
                      prop: 'nickname',
                      tooltip:true,
                      minWidth: "100"
                    },{
                      id: '3',
                      label: '手机号码',
                      prop: 'tel',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '4',
                      label: '处理坐席组',
                      prop: 'dccGroupName',
                      minWidth: "120"
                    },{
                      id: '5',
                      label: '处理DCC',
                      prop: 'dccName',
                      minWidth: "120"
                    },{
                      id: '6',
                      label: '线索评分',
                      prop: 'grade',
                      show:'template',
                      minWidth: "100"
                    },{
                      id: '7',
                      label: '客户来源',
                      prop: 'from',
                      show:'template',
                      tooltip:true,
                      minWidth: "150"
                    },{
                      id: '8',
                      label: '意向品牌',
                      prop: 'brand',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '9',
                      label: '意向车系',
                      prop: 'carSeries',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '10',
                      label: '意向车型',
                      prop: 'model',
                      tooltip:true,
                      minWidth: "250"
                    },{
                      id: '11',
                      label: '归属门店',
                      prop: 'areaName',
                      tooltip:true,
                      minWidth: "120"
                    },{
                      id: '12',
                      label: '线索类型',
                      prop: 'clueTypeName',
                      tooltip:true,
                      minWidth: "100"
                    },{
                      id: '13',
                      label: '线索状态',
                      prop: 'statusName',
                      tooltip:true,
                      minWidth: "110"
                    },{
                      id: '14',
                      label: '线索获取时间',
                      prop: 'createdAt',
                      tooltip:true,
                      minWidth: "170"
                    },{
                      id: '15',
                      label: '处理时长',
                      prop: 'handleTime',
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
                    url: "business.queryClueList", //快捷搜索的方法名称:  模块.方法名
                    width: "220", //快捷搜索输入框宽度
                    placeholder: "线索姓名/手机号码", //快捷搜索输入框提示文字
                    displayCol: ["nickname","tel"], //弹出需要显示的列
                    params: {
                      id: ""
                    }
                },
            }

            // 从详情页面跳转回来取缓存数据
            if(this.$store.state.business.clue && this.$store.state.business.clue.page){
                this.dataTable.page = this.$store.state.business.clue.page;
                this.$nextTick(()=>{
                    this.$refs.DataTableRef.currentPage = this.dataTable.page.currentPage;
                })
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { grade, customer, brand,series,model, area, state,type, time,dcc,dccGroup, list } = this.search;
            let params = {
                dccGroupId: list[dccGroup].currentVal,       // 处理坐席组
                dccId: list[dcc].currentVal,             // 处理DCC
                grade: list[grade].currentVal,       // 线索评分
                fromTopId: list[customer].oneVal,   // 客户来源一级级
                fromSecondId: list[customer].secondVal, // 客户来源二级
                brandId: list[brand].currentVal,     // 意向品牌
                carSeriesId: list[series].currentVal, // 意向车系
                modelId: list[model].currentVal,     // 意向车型
                areaId: list[area].currentVal,       // 来源门店
                clueType:  list[type].currentVal,       // 线索类型
                status:  list[state].currentVal,       // 线索状态
                createdAtStartTime: list[time].currentVal && list[time].currentVal[0] + " 00:00:00", // 线索获取开始时间
                createdAtEndTime: list[time].currentVal && list[time].currentVal[1]+ " 23:59:59",  // 线索获取结束时间
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.exportConfig.other = Object.assign({},params);  // 导出配置参数
            this.$fetch.business.queryClueList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        seeDetail(row){
            let store = {
                'type': 'clue',
                'search': this.search.list,
                'page': this.dataTable.page
            }
            this.$store.commit('setBusinessStore', store); // 进入详情页，缓存页面数据
            this.$router.push({'path':'/business/clue/detail', query: {'id': row.id}});
        },
        handleClue(row){
            this.$router.push({'path': '/work/cluesDeal', query:{'id': row.id, 'userId': row.userId}})
        },
        addClue(){ // 新增线索
            this.showAddClues = true;
            this.dccConfig = {
                show: true,
                groupOptions: this.$deepCopyContent(this.search.list[this.search.dccGroup].selectOptions),
                groupObj: this.dccGroupObj,
            }
            if(this.dccConfig.groupOptions && this.dccConfig.groupOptions[0].id === 0){
                this.dccConfig.groupOptions.shift();
            }
        },
        addClueSuccess(){ // 新增线索关闭
            this.showAddClues = false;
            this.queryData();
        },
        distributeFn(total, row){ // 分配弹窗
            this.disConfig = {
                title: '分配',
                groupLabel: '处理坐席组',
                groupOptions: [],  // 坐席组下拉列表
                groupObj: {}, // 坐席组对象
                dccLabel: '处理DCC',
                selectId: [row.id], // 选择的列表id
                tip: '',
            }
            if(total == 'batch'){ // 批量处理
                if(!this.selectData || !this.selectData.length){ // 在mixins组件中
                    this.$message.error("请选择线索")
                    return;
                }
                let ids = []
                for(let i=0, length=this.selectData.length; i<length; i++){
                    ids.push(this.selectData[i].id)
                    if(this.selectData[i].status == 4){ // 1：跟进中  2：无效  3: 已建档  4: 无效审核中
                        this.$message.error(`线索姓名为：${this.selectData[i].nickname} 的线索状态为${this.selectData[i].statusName}, 不能分配(无效、跟进中、已建档的线索才能分配)`)
                        return;
                    }
                }
                this.disConfig.title = '批量分配';
                this.disConfig.selectId = ids; 
            }

            this.$fetch.business.assignDCCList({'ids':this.disConfig.selectId,'operate': 'assign'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.disConfig.listTotal = res.listTotal;
                    if(res.listTotal ==1){
                        this.disConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showDistribute = true;
                        this.dialogLoading=false;
                    }else if(res.listTotal > 1){
                        this.$message.error("所选线索分别归属多个组，不能被分配")
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前线索不符合要求'
                        })
                    }
                },false);
                this.$store.commit('closeLoading');
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
            let params = Object.assign({'ids':this.disConfig.selectId},val);
            this.dialogLoading=true;
            this.$fetch.business.clueAssign(params).then((res)=>{
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
                },false)
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
                selectId: [row.id], // 选择的列表id
                tip: '线索激活状态变为“待处理”由所选坐席组及对应人员进行跟进处理',
            }
            if(total == 'batch'){ // 批量处理
                if(!this.selectData || !this.selectData.length){ // 在mixins组件中
                    this.$message.error("请选择线索")
                    return;
                }
                let ids = []
                for(let i=0, length=this.selectData.length; i<length; i++){
                    ids.push(this.selectData[i].id)
                    if(this.selectData[i].status != 2){ // 线索状态：1：跟进中  2：无效  3: 已建档  4: 无效审核中
                        this.$message.error(`线索姓名为：${this.selectData[i].nickname} 的线索状态为${this.selectData[i].statusName}, 不能激活(无效的线索才能激活,您可通过线索状态进行线索筛选)`)
                        return;
                    }
                }
                this.actConfig.title = '批量激活';
                this.actConfig.selectId = ids; 
            }

            this.$fetch.business.assignDCCList({'ids':this.actConfig.selectId,'operate': 'invalidActive'}).then((res)=>{ //'operate':  assign分配，invalidActive 无效激活
                this.$handleResponse(res, res=>{
                    this.actConfig.listTotal = res.listTotal; // listTotal 取值大于等于1，如果没有组，报非200，单条的激活有且只有一个组
                    if(res.listTotal ==1){
                        this.actConfig.groupOptions = this.$hasArrContent(res.list)?res.list:[];
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.tip = '线索激活状态变为“待处理”由所选坐席组及对应人员进行跟进处理';
                    }else if(res.listTotal > 1){
                        this.showActived = true;
                        this.dialogLoading=false;
                        this.actConfig.groupOptions = [];
                        this.actConfig.tip = '您所选中的线索分别归属多个组，批量激活后由原处理的DCC继续处理';
                    }else {
                        this.$notify.error({
                            title: '错误提示',
                            message: '当前线索不符合要求'
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
            this.$fetch.business.InvalidActive(params).then((res)=>{
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
        setShowResult(totalNum=0, data){ // 批量激活和分配后的状态显示
            this.resultConfig = {
                total: totalNum,
                success: data && data.success && data.success.length,
                fail: data && data.fail && data.fail.length,
                tip: ''
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
