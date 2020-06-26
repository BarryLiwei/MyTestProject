<template>
    <div class="attack-skill-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.kwd]" :placeholder="'请输入'"></search-col>
                <search-col :info="search.list[search.mainCar]" :colWidth="7" :rightCol="23" :brandOptions="brandOptions" @carSelect="getMainCarData"></search-col>
                <search-col :info="search.list[search.compareCar]" :colWidth="7" :rightCol="23" @fristChange="getCompareCarData" :onePlaceholder="'请选择'" filterable :secondPlaceholder="'请选择'" size="small" :oneRemote="true" :remote-method="remoteMethod"></search-col>
                <search-col :info="search.list[search.state]" :colWidth="4"></search-col>
                <search-col :info="search.list[search.createTime]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.updateTime]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
            </div>
        </search-bar>

        <div class="p-l-r-20 p-b-20">
            <data-table ref="DataTableRef" class='table-cyan' :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange">
                <div slot="buttons">              
                    <el-button type="primary" icon="el-icon-plus" round size="small" @click="handleFn('add', {})">新建话术</el-button>
                    <el-button plain size="small" round class="w-90" @click="batchDelete">删除</el-button>
                </div>   
          
                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFn('view', props.obj.row)">查看</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleState(props.obj.row)">{{ props.obj.row.displayStatus == 1 ? "隐藏" : "显示"}}</el-button>
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="handleFn('edit', props.obj.row)">编辑</el-button>
                    <el-button class="red_font_white_bg" plain round  size="mini" @click="handleDelete(props.obj.row)">删除</el-button>
                </template> 
            </data-table>
        </div>

        <attack-form v-if="showDialog" :dialogType="dialogType" :rowData="rowData" @cancel="handleCancelDialog" @success="handleSuccessDialog"></attack-form>
    </div>
</template>

<script>
//  攻防话术
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import SearchMixins from '@/pages/mixins/SearchMixins'
import CarSelect from '@/components/CarSelect'
import AttackForm from './AttackForm'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        CarSelect,
        AttackForm
    },
    mixins: [SearchMixins],
    data(){
        return{
            dialogType: 'add',  // 弹窗类型 add：新增 edit：编辑  view：查看
            showDialog: false, // 攻防话术新增/编辑/查看弹窗
            brandOptions: [],
            rowData: {}, 
        }
    },
    created(){
        // 找不到的方法在searchMixins.vue 组件里面
        this.initData();
        this.initBrandOptins(); // 主体车型  下拉选项
        this.queryCompareData(); // 竞争车型 下拉选项
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
                        type: 'input', 
                        label: '话术ID', 
                        currentVal: '',
                    },
                    {
                        type: 'selectCar', 
                        label: '主体车型', 
                        brand: true,  // type 为selectCar时 是否展示品牌
                        series: true,  // type 为selectCar时 是否展示车系
                        model: false,
                        brandId: null,
                        seriesId: null,
                    },{
                        prop: 'compareCar',
                        type: 'cascader', 
                        label: '对比车型',
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
                        type: 'select', 
                        label: '状态', 
                        currentVal: '', 
                        isAll: true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'datePicker', 
                        dateType: 'daterange',
                        label: '创建时间', 
                        currentVal: '', 
                    },{
                        type: 'datePicker', 
                        dateType: 'daterange',
                        label: '更新时间', 
                        currentVal: '', 
                    }
                ],
                kwd: 0, // 话术id
                mainCar: 1, // 主体车型
                compareCar: 2,  // 对比车型
                state: 3, // 状态
                createTime: 4, // 创建时间
                updateTime: 5, // 更新时间
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '话术ID',
                      prop: 'longId',
                      tooltip:true
                    },{
                      id: '2',
                      label: '主体车型',
                      prop: 'carSeriesName',
                      tooltip:true,
                      minWidth: '180'
                    },{
                      id: '3',
                      label: '对比车型',
                      prop: 'competitionCarSeriesName',
                      tooltip:true,
                      minWidth: '180'
                    },{
                      id: '4',
                      label: '状态',
                      prop: 'displayStatusTitle',
                      tooltip:true,
                      minWidth: '80'
                    },{
                      id: '5',
                      label: '创建时间',
                      prop: 'createDate',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '6',
                      label: '更新时间',
                      prop: 'updateDate',
                      tooltip:true,
                      minWidth: '110'
                    },{
                      id: '7',
                      label: '操作选项',
                      prop: 'caozuo',
                      show:'template',
                      width: '300'
                    },
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
                search: {
                    value:'',
                    show: false,
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "请输入任务名称", //快捷搜索输入框提示文字
                    displayCol: ["name","tel"], //弹出需要显示的列
                    parma: {
                      id: ""
                    },
                },
            }
        },
        initBrandOptins() {
            this.$fetch.common.carBrand({},false).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.brandOptions = data;
                }, false);
            })
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { kwd, mainCar, compareCar, state, createTime, updateTime, list } = this.search;

            let params = {
                kwd: list[kwd].currentVal,  // 话术ID
                carSeries: list[mainCar].currentVal,  // 主体车系
                competitionCarSeries: list[compareCar].secondVal,  // 对比车系
                displayStatus: list[state].currentVal,  // 显示状态
                createDateStart: list[createTime].currentVal && list[createTime].currentVal[0],
                createDateEnd: list[createTime].currentVal && list[createTime].currentVal[1],
                updateDateStart: list[updateTime].currentVal && list[updateTime].currentVal[0],
                updateDateEnd: list[updateTime].currentVal && list[updateTime].currentVal[1],
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.callCenter.competitionList(params).then((res)=>{
                this.$handleResponse(res, res=>{

                    const { list, page, options} = res;

                    that.dataTable.data = list?list:[]; //表格所需数据
                    that.dataTable.page = page?page:that.dataTable.page; //表格所需数据

                    // 筛选项
                    this.search.list[this.search.state].selectOptions = options.displayStatus?options.displayStatus:[];
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        clear(){
            // 不满足公共需求，所有重新覆盖
            this.clearSearch();
            this.dataTable.page.currentPage = 1; 
            this.$refs.DataTableRef.initCurrentPage();
            this.queryData(); // 先调接口，后清理筛选数据

            this.queryCompareData();
        },
        batchDelete(){
            if(!this.$hasArrContent(this.selectData)){
                this.$message.warning('您还没选择话术')
                return
            }
            this.$confirm("您确定要删除选中的话术吗?", "提示", {
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
                this.deleteCompetition(ids)
            })
        },
        handleState(row){
            this.$confirm(`您确定要${row.displayStatus ==1 ? '隐藏' : '显示'}此话术吗`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.competitionToggle({'id': row.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success(`${row.displayStatus ==1? '隐藏' : '显示'}成功`);
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        handleDelete(row){
            this.$confirm("删除后不可恢复，是否确定删除？", "提示", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning",
             customClass: "needCenterStyle",
             cancelButtonClass: "big cancel",
             confirmButtonClass: "big",
             roundButton: true,
            }).then(() => {
                this.deleteCompetition([row.id])
            })
        },
        deleteCompetition(ids) {
            this.$fetch.callCenter.competitionDelete({id: ids}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('删除成功');
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        handleFn(type, row){
            this.rowData = row;
            this.dialogType = type;
            this.showDialog = true;
        },
        handleCancelDialog() {
            this.showDialog = false;
        },
        handleSuccessDialog() {
            this.queryData();
            this.showDialog = false;
        },
        getMainCarData(value) {
            const { seriesId } = value;
            
            const { mainCar, list } = this.search;
            list[mainCar].currentVal = seriesId;
        },
        remoteMethod(query){
            console.log('haha')
            this.queryCompareData(query);
        },
        getCompareCarData(val, item) {
            this.search.list[this.search.compareCar].secondVal='';
            this.$fetch.common.carSeries({'brandId': val},false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.compareCar].secondOptions = this.$hasArrContent(res)?res:[];
                }, false);
            })
        },
        queryCompareData(keyword=""){
            this.$fetch.common.carBrandAll({'kwd': keyword},false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.compareCar].oneOptions = this.$hasArrContent(res)?res:[];
                }, false);
            })
        },
    }
}
</script>

<style lang="scss" scoped>

</style>