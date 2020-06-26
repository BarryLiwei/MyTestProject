<template>
    <div class="call-record-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- 用search-bar包裹的话，需要clearfix清除里面的浮动，-->
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.dccId]" filterable></search-col>
                <search-col :info="search.list[search.type]"></search-col>
                <search-col :info="search.list[search.result]"></search-col>
                <search-col :info="search.list[search.time]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :info="search.list[search.dccGroup]" filterable></search-col>
            </div>
        </search-bar>

        <div class="p-20">
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange"> 
                <div slot="buttons">              
                    <!--导出-->
                    <!-- <common-export :config="exportConfig" plain></common-export> -->

                    <!-- 导出日志 -->
                    <!-- <export-log class="m-l-10"></export-log> -->
                </div>   
                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg"  plain round size="mini" @click="seeFollow(props.obj.row)" :disabled="props.obj.row.dataId==0">查看跟进</el-button>
                    <el-button class="blue_font_white_bg"  plain round size="mini" :disabled="props.obj.row.voiceFile?false:true" @click="showAudioFn(props.obj.row)">录音</el-button>
                </template> 
            </data-table>
        </div>

        <!-- 查看跟进 -->
        <call-follow v-if="showFollow" :row="row" @cancel="showFollow=false"></call-follow>

        <!-- 查看录音 -->
        <audio-player v-if="showAudio" :url="voiceFile" @cancel="showAudio=false"></audio-player>
    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import CallFollow from './CallFollow';
import AudioPlayer from "@/components/AudioPlayer";
import ExportLog from '@/components/export/ExportLog';
import CommonExport from '@/components/export/CommonExport'
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        CallFollow,
        AudioPlayer,
        ExportLog,
        CommonExport
    },
    mixins: [SearchMixins],
    data(){
        return{
            search: {}, // 搜索列表的数据
            dataTable: {}, // 表格数据
            showFollow: false,
            showAudio: false,
            voiceFile: '',
        }
    },
    created(){
        this.initData();
        this.queryData();
    },
    methods: {
        initData(){
            this.row={};
            this.initExport();
            this.initSearch(); // 初始化搜索列
            this.initTable();

            this.getDccList();
        },
        initExport(){
            this.exportConfig = {
                fileName: "通话记录导出",  // 导出文件名
                ext: "csv",    // 导出文件格式
                idName: "id",  // 取对象的那个字段的值
                select: [],    // 多选的时候导出
                taskType: "",  // 任务的类型
                url: "business.exportClueExcel",       // 接口路径
                other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
            }
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
                        type: 'select', 
                        label: 'DCC邀约员', 
                        currentVal: '', 
                        isAll: true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'dccName', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '通话方式', 
                        currentVal: '', 
                        isAll: true,
                        isAllTitle: '全部',
                        selectOptions:[{'title': '呼出', 'id': 1},{'title': '呼入', 'id': 2}], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '通话结果', 
                        currentVal: '', 
                        isAll: true,
                        isAllTitle: '全部',
                        selectOptions:[{'title': '成功', 'id': 1},{'title': '失败', 'id': 2},{'title': '未接通', 'id': 3}], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'datePicker', 
                        label: '通话时间', 
                        currentVal: '',  
                    },{
                        type: 'select', 
                        label: '坐席组', 
                        currentVal: '',
                        isAll: true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'dccGroupName', 
                        optionValue:"id", 
                    }
                ],
                dccId: 0, // dcc邀约员( 不用dcc字段可以clearSearch的时候不需要联动删除)
                type: 1, // 通话方式
                result: 2, // 通话结果
                time: 3,  // 通话时间
                dccGroup: 4, // 坐席组
            }
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '操作',
                      prop: 'caozuo',
                      show:'template',
                      width: '170',
                    },{
                      id: '2',
                      label: 'DCC邀约员',
                      prop: 'dccName',
                      tooltip:true,
                    },{
                      id: '3',
                      label: '坐席组',
                      prop: 'dccGroupName',
                      tooltip:true,
                    },{
                      id: '4',
                      label: '通话时间',
                      prop: 'createDate',
                      tooltip:true,
                    },{
                      id: '5',
                      label: '客户姓名',
                      prop: 'customerName',
                      tooltip:true,
                    },{
                      id: '6',
                      label: '客户手机号',
                      prop: 'customerTel',
                      tooltip:true,
                    },{
                      id: '7',
                      label: '通话方式',
                      prop: 'callTypeTitle',
                      tooltip:true,
                    },{
                      id: '8',
                      label: '通过结果',
                      prop: 'callResultTitle',
                      tooltip:true,
                    },{
                      id: '9',
                      label: '通话时长',
                      prop: 'duration',
                      tooltip:true,
                    },
                ],
                data: [],
                page: {
                    totalCount: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                border: false, // 是否带边框
                hasSelect: true, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: true, //是否有第一条分页条
                search: {
                    value:'',
                    show: true,
                    keyword: 'kwd', // 搜索的关注子
                    url: "callCenter.dccCallList", //快捷搜索的方法名称:  模块.方法名
                    width: "300", //快捷搜索输入框宽度  
                    placeholder: "客户名称、客户手机号", //快捷搜索输入框提示文字
                    displayCol: ["customerName","customerTel"], //弹出需要显示的列
                    parma: {
                      id: ""
                    }
                },
            }
        },
        getDccList(){ // DCC/组列表
            this.$fetch.common.commonDccList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.dccGroup].selectOptions = this.$hasArrContent(res)?res:[];
                    let arr =[];
                    if(this.$hasArrContent(res)){
                        res.forEach((item)=>{
                            if(this.$hasArrContent(item.dccList)){
                                arr = arr.concat(item.dccList);
                            }
                        })
                        this.search.list[this.search.dccId].selectOptions = arr;
                    }
                }, false);
            })
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { dccId, type, result,time, dccGroup, list } = this.search;
            let params = {
                dccId: list[dccId].currentVal,       // dcc邀约员
                callType: list[type].currentVal,     // 通话方式
                callResult: list[result].currentVal, // 通话结果
                dateStart: list[time].currentVal && list[time].currentVal[0], // 通话时间
                dateEnd: list[time].currentVal && list[time].currentVal[1],   // 通话时间
                dccGroupId: list[dccGroup].currentVal,       // 坐席组
                pageSize: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.exportConfig.other = Object.assign({},params);  // 导出配置参数
            this.$fetch.callCenter.dccCallList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        seeFollow(row){
            this.showFollow=true;
            this.row = row;
        },
        showAudioFn(row){
            this.showAudio=true;
            this.voiceFile = row.voiceFile;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

<style>


</style>

