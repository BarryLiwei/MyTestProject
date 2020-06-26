<template>
    <div class="media-manage-page m-20 common-box">
        <search-bar size="medium" class="m-t-10 p-20" @clear="clear" @find="find">
            <div class="search-flex">
                <!-- search-col通过search.key来判断是哪个选项；search-col用for循环，需要自定义的可以通过 search.key == index 来确定自定义的那一列，如<search-col><div slot="custom" v-if="search.key==index"></div></search-col>-->
                <search-col :info="search.list[search.shop]" filterable></search-col>
                <search-col :info="search.list[search.media]" filterable></search-col>
                <search-col :info="search.list[search.state]"></search-col>
                <search-col :info="search.list[search.time]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></search-col>
            </div>
        </search-bar>

        <div class="p-20">
            <el-button type="primary" icon="el-icon-plus" round size="small" @click="addFn" class="m-b-20">新增垂媒账号</el-button>
            <data-table ref="DataTableRef" :table="dataTable" @searchTable='searchTable' @onHandleSelectionChange="handleSelectionChange"> 
                <template slot-scope="props" slot="account">
                    <div class="media-wrap" v-for="(item, index) in props.obj.row.account" :key="index">
                        <span class="dot" :class="[item.status ==1?'green':'red']"></span>
                        {{ item.type_text | filterBlank }}
                    </div>
                </template> 

                <template slot-scope="props" slot="caozuo">
                    <el-button class="blue_font_white_bg" plain round size="mini" @click="view(props.obj.row)">查看详情</el-button>
                    <el-button class="red_font_white_bg"  plain round size="mini" @click="deleteMedia(props.obj.row)">删除</el-button>
                </template> 
            </data-table>
        </div>

        <add-media 
            v-if="showMedia" 
            :info="mediaInfo" 
            :type="showType" 
            :shopList="search.list[search.shop].selectOptions" 
            :mediaOptions="search.list[search.media].selectOptions"
            @close="closeMedieFn">
        </add-media>
    </div>
</template>

<script>
import SearchBar from '@/components/SearchBar';
import SearchCol from '@/components/form/SearchCol';
import DataTable from "@/components/dataTable/table";
import AddMedia  from './AddMedia'
import SearchMixins from '@/pages/mixins/SearchMixins'
export default {
    components: {
        SearchBar,
        SearchCol,
        DataTable,
        AddMedia
    },
    mixins: [SearchMixins],
    data(){
        return{
            showMedia: false, // 新增弹窗
            showType: 'add',
            mediaInfo: {},
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
            this.initMediaOptions();
        },
        initSearch(){
            // 使用key防止在数组中间插入一列后，只要改变key的下标值就可以
            this.search = { 
                list: [
                    {
                        type: 'select', 
                        label: '门店', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'title', 
                        optionValue:"id", 
                    },{
                        type: 'select', 
                        label: '垂媒', 
                        currentVal: '', 
                        isAll:true,
                        isAllTitle: '全部',
                        selectOptions:[], 
                        optionLabel:'text', 
                        optionValue:"val", 
                    },{
                        type: 'select', 
                        label: '状态', 
                        currentVal: '',
                        isAll:true,
                        isAllTitle: '全部', 
                        selectOptions:[], 
                        optionLabel:'text', 
                        optionValue:"val", 
                    },{
                        type: 'datePicker', 
                        label: '更新时间', 
                        currentVal: '', 
                    }
                ],
                shop: 0, // 任务名称
                media: 1, // 任务内容
                state: 2, // 状态
                time: 3, // 任务技术时间
            }
        },
        initMediaOptions(){
            this.$fetch.callCenter.mediaAccountOptions({}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.media].selectOptions = this.$hasArrContent(res.type)?res.type:[];
                    this.search.list[this.search.state].selectOptions = this.$hasArrContent(res.status)?res.status:[];
                }, false);
            })

            this.$fetch.common.commonAreaList({},false).then((res)=>{
                this.$handleResponse(res, res=>{
                    if(this.$hasArrContent(res)){
                        res.forEach((item)=>{ item.id = parseInt(item.id?item.id:0)}); // 把字符串改为数字
                        this.search.list[this.search.shop].selectOptions =res;
                    }
                }, false);
            })
        },
        initTable(){
            this.dataTable = {
                tr: [{
                      id: '1',
                      label: '门店',
                      prop: 'short_name',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '2',
                      label: '垂媒',
                      prop: 'account',
                      show:'template',
                      tooltip:true,
                      align: 'center'
                    },{
                      id: '3',
                      label: '更新时间',
                      prop: 'last_update',
                      tooltip: true,
                      align: 'center'
                    },{
                      id: '4',
                      label: '操作',
                      prop: 'caozuo',
                      show:'template',
                      minWidth: '130',
                      align: 'center'
                    },
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
                search: {
                    value:'',
                    show: false,
                    width: "300", //快捷搜索输入框宽度
                    placeholder: "请输入手机号、客户微信", //快捷搜索输入框提示文字
                    displayCol: ["name","tel"], //弹出需要显示的列
                    parma: {
                      id: ""
                    }
                }
            }
        },
        getParams(){
            const { currentPage, pageSize } = this.dataTable.page;
            const { shop, media, state, time,  list } = this.search;
            let params = {
                area_id: list[shop].currentVal,      // 门店id
                type: list[media].currentVal,        // 垂媒账号类型 1懂车帝 2太平洋 3易车 4汽车之家'
                status: list[state].currentVal,      // 账号状态 0异常，1正常
                update_date_start: list[time].currentVal && list[time].currentVal[0], // 线索获取开始时间
                update_date_end: list[time].currentVal && list[time].currentVal[1],  // 线索获取结束时间
                pre_page: pageSize,     // 每页数量
                page: currentPage,          // 当前页
            }
            return params;
        },
        queryData(){
            let that = this;
            let params = this.getParams();
            this.$fetch.callCenter.mediaAccountList(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    that.dataTable.data = res.list?res.list:[]; //表格所需数据
                    that.dataTable.page = res.page?res.page:that.dataTable.page; //表格所需页面
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        deleteMedia(item){
            let that = this;
            this.$confirm("删除账号后，垂媒的线索无法同步至系统,是否确定要删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle mediaDeleteWidth",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.mediaAccountDel({'id': item.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功');
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        addFn(){
            this.showType = 'add';
            this.mediaInfo = {};
            this.showMedia = true;
        },
        view(item){
            this.showType = 'view';
            this.mediaInfo = Object.assign({},item);
            this.showMedia = true;
        },
        closeMedieFn(type){
            this.showMedia = false;
            if(type == 'success'){
                this.queryData();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.media-wrap {
    display:inline-block;
    margin-right: 15px;
}
.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
}
.red {
    background-color: #ea5a54;
}
.green {
    background-color: #34b572;
}


</style>
<style>
.mediaDeleteWidth.needCenterStyle .el-message-box__status+.el-message-box__message {
    width: 260px;
    margin: 0 auto;
}
</style>

