<template>
    <div class="export-log-wrap inline__block">
        <el-button type="text" @click="showDialog" class="btn-export">导出日志</el-button>

        <el-dialog
            v-if="dialogVisible"
            class="export-log-dialog"
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            append-to-body
            width="1100px"
            top="8vh"
            :close-on-click-modal="false"
            :before-close="handleClose">

            <div class="search-flex m-b-10">
                <search-col :info="search[0]" :leftCol="4" :rightCol="20" :placeholder="'请输入'" class="export-log"></search-col>
                <search-col :info="search[1]" :colWidth="8" class="export-log" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
                <search-col :leftCol="0" :rightCol="24" class="export-log-btn">
                    <div slot="custom">
                        <el-button round icon="el-icon-search" @click="find"  size="medium" type="primary" class="m-l-20 w-110">查询</el-button>
                        <el-button round icon="el-icon-delete" @click="clear" size="medium" plain >清空查询条件</el-button>
                    </div>
                </search-col>
            </div>

            <data-table ref="DataTableRef" :table="dataTable" @searchTable="searchTable" v-loading="loading">
                <template slot-scope="props" slot="caozuo">
                    <el-button class="table-bar-left-btn" plain size="medium" round  @click="download(props.obj.row)" ><span class="icon-out"><img src="@/assets/images/icons/in-blue.png" alt=""></span>导出</el-button>
                </template>
            </data-table>
        </el-dialog>
    </div>
</template>

<script>
// 此组件为导出日志弹窗组件
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import { downloadBlobFn } from '@/utils/download'
import moment from 'moment'
export default {
    components: {
        SearchCol,
        DataTable
    },
    props:{
        dialogTitle: {
            type:String,
            default: '导出日志'
        },
        config: {
            type:Object,
            default() {
                return {
                    listUrl: 'common.exportLog',   // 模块.方法明， 默认用公共的导出，下载方法
                    downUrl: 'common.exporGetExcel', // 模块.方法明， 默认用公共的导出，下载方法 
                };
            }
        },
        exportFileName: {  // 导出文件名字
            type: String,
            default: '导出日志'
        },
        exportExt: {   // 导出文件格式
            type: String,
            default: 'csv'
        }
    },
    data(){
        return{
            dialogVisible: false,
            dataTable: {}, // table表单
            search:[],     // 搜索表格
            filter: {},
            loading: false,
        }
    },
    methods: {
        initData(){
            this.initTable();
            this.initSearch();
        },
        initSearch(){
            this.search = [
                {
                    type: 'input', 
                    label: '关键字', 
                    currentVal:'',
                },{
                    type: 'datePicker', 
                    label: '导出时间', 
                    currentVal:'',
                }
            ]
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '导出人',
                      prop: 'clueName',
                      align: 'center'
                    },{
                      id: '2',
                      label: '导出手机号',
                      prop: 'clueName',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '导出时间',
                      prop: 'tellphone',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '4',
                      label: '导出内容',
                      prop: 'caozuo',
                      show:'template',
                      align: 'center'
                    },
                ],
                data: [],
                page: {
                    total_count: 100,
                    per_page: 20,
                    currentPage: 1
                },
                border: false, // 是否带边框
                hasSelect: false, //是否有复选框
                hasExpand: false, //是否有收缩功能
                hasFirstPagination: false, //是否有第一条分页条
                lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
                search: {},
                hasOperation: false, // 显示最后的operations
                operation: []
            }
        },
        showDialog(){
            // 弹窗显示的时候，初始化数据
            this.dialogVisible = true;
            this.initData();
            this.feacthdata({page: 1});
        },
        handleClose(){
            this.dialogVisible=false;
            this.$emit('cancel')
        },
        getParams(){ // 获取参数
            let time = this.search[1].currentVal;
            const { currentPage, per_page} = this.dataTable.page;
            return {
                page: currentPage,
                per_page: per_page,
                keywords: this.search[0].currentVal,
                start: time && time[0]? time[0] + ' 00:00:00': '',
                end: time && time[1]? time[1] + ' 23:59:59': ''
            }
        },
        searchTable(){
            this.feacthdata();
        },
        getModel(){
            if(this.config && this.config.listUrl && !this.requestMethod){ // 不存在的时候才进入函数，存在就不需要重复计算
                this.requestModel =  this.config.listUrl.split(".")[0];  // 获取日志列表调用的模块
                this.requestMethod = this.config.listUrl.split(".")[1];  // 获取日志列表调用的方法
            }
            if(this.config && this.config.downUrl && !this.downMethod){
                this.downModel = this.config.downUrl.split(".")[0];   // 下载调用的模块
                this.downMethod = this.config.downUrl.split(".")[1];  // 下载调用的方法
            }
        },
        feacthdata(item){
            let that = this;
            this.getModel(); // 获取请求的方法，已经存在就不会重复计算
            let params = Object.assign(this.getParams(),item); // item放最后，有参数传进来就覆盖
            this.loading = true;
            this.$fetch[this.requestModel][this.requestMethod](params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    that.dataTable.data = res.list.data; //表格所需数据
                    that.dataTable.page = res.list.page; //表格所需数据
                },false);
            }).catch(response => {
                this.loading = false;
            });
        },
        find(){
            this.feacthdata({page:1});
        },
        clear(){
            this.search[0].currentVal = '';
            this.search[1].currentVal = '';
            this.feacthdata({page:1});
        },
        download(row){
            let params = {
                id: row.downLoadid,
            };
            this.getModel(); // 获取请求的方法，已经存在就不会重复计算
            this.$fetch[this.downModel][this.downMethod](url,params).then((res) => {
                this.loading = false;
                const blob = new Blob([res.data], { type: 'application/ms-excel' });
                let fileName = `${this.exportFileName}-${moment().format('YYYYMMDDHHmmss')}.${this.exportExt || 'xlsx'}`;
                downloadBlobFn(blob, fileName);
            }).catch((res) => {
                this.loading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.btn-export {
    text-decoration: underline;
    color: #3d7eff;
}

.export-log-dialog /deep/.el-dialog__body {
    padding: 30px;
}

.export-log.el-col-6{
    width: 340px;
}
.export-log.el-col-8{
    width: 410px;
}
.export-log-btn.el-col-6 {
    width: 290px;
}

.export-log-dialog {
    /deep/ .el-table {
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
        .el-table__header .has-gutter tr th {
            background-color: #fff;
            color: #444;
            height: 36px;
            line-height: 36px;
            border-bottom: 1px solid #eee;
        }
    }
}

.icon-out{
  padding: 0px 5px;
}
</style>

