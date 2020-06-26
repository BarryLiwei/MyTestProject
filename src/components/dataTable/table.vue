<template :table="table" :currentsizess="currentsizes">  
  <div class="wrap-table" :style="table.height ? table.height : 'min-height: 600px'" >    
    <div :id="tableId" class="por">
        <el-row class="flex vcenter h80" v-if="table.hasCunstomLine">
          <!-- 由于下面的 slot = buttons 只有12 cols 宽，不够长,所有自定义头部 -->
            <el-col :span="24">
              <slot name="CunstomLine"></slot>
            </el-col>      
        </el-row>  

        <el-row class="flex vcenter h80" v-if="table.hasFirstPagination">
          <el-col :span="15">
            <slot name="buttons"></slot>
          </el-col>
          <el-col :span="9">
            <div class="flex vcenter h80 lright frist-right">
              <search :search='table.search' @getResult='getResult' @searchTable='handleCurrentChange' v-if="table.search.show"></search>
              <el-pagination 
                class="top-pagination"
                @size-change="handleSizeChange" 
                :class="table.sizesClass?table.sizesClass:''"
                @current-change="handleCurrentChange" 
                :current-page.sync="currentPage" 
                :page-sizes="table.pageSizes?table.pageSizes:[20, 50, 100]" 
                :page-size="this.table.page.pageSize" 
                layout="sizes, prev, pager, next" 
                :total="table.page.totalCount"
                v-if="!table.NoSizeChange">
              </el-pagination>
            </div>
          </el-col>
        </el-row>

        <!-- 表格主体 --> 
        <el-table :height="table.height" v-loading="table.loading" :show-summary="table.hasShowSummary" :summary-method="table.getSummaries" ref="TlRlTable" :data="table.data" tooltip-effect="light" :border="table.border" style="width: 100%" :row-class-name="rowClassName" :span-method="objectSpanMethod" header-row-class-name="thClassName" @current-change="handleSingleChange" @selection-change="handleSelectionChange" @row-click="rowClick" @sort-change="sortChange">
          <el-table-column v-if="table.hasSelect" type="selection" :selectable='table.checkboxInit' width="55" :align="table.selectAlign?table.selectAlign:'left'">
          </el-table-column>
          <el-table-column type="expand" v-if="table.hasExpand" :align="table.expandAlign?table.expandAlign:'left'">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="item.label" v-for="item in table.expands" :key="item.id">
                  <span>{{ props.row[item.prop] }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <template v-for="item in table.tr">
            <el-table-column :show-overflow-tooltip="item.tooltip ? item.tooltip : false"  :label="item.label" :class-name="item.className ? item.className : ''" :key="item.id" :width="item.width ? item.width : ''" :min-width="item.minWidth ? item.minWidth : ''" :prop="item.prop" :sortable="item.sortable" :align="item.align?item.align:'left'">
              <template slot="header" slot-scope="scope">
                <span>
                  <el-tooltip v-if="item.changeHeader === true && !item.tipsRight" class="item" effect="light" placement="top">
                    <div slot="content" v-html="item.headerTips"></div>
                    <i class="el-icon-question" ></i>
                  </el-tooltip>
                    {{item.label}}
                  <el-tooltip v-if="item.changeHeader === true && item.tipsRight" class="item" effect="light" placement="top">
                    <div slot="content" v-html="item.headerTips"></div>
                    <i class="el-icon-question" ></i>
                  </el-tooltip>
                </span>
              </template>
              <!-- 有没有template的区别 -->
              <template slot-scope="scope">
                <slot v-if="item.show === 'template'" :name="item.prop" :obj="scope" :assignMode="scope.row[item.prop]"></slot> 
                <span v-if="item.show !== 'template'">{{scope.row[item.prop] || scope.row[item.prop.split('.')[0]] && (scope.row[item.prop.split('.')[0]][item.prop.split('.')[1]] || '--')| filterBlank }}</span>      
              </template>
            </el-table-column>
          </template>

          <template v-for="item in table.operation">
            <el-table-column :key="item.id" :label="item.label" :width="item.width ? item.width : ''" :min-width="item.minWidth ? item.minWidth : ''" :class-name="item.className" v-if="table.hasOperation" :align="item.align?item.align:'left'">
              <template slot-scope="scope">
                <el-button v-for="item in item.data" v-if="scope.row[item.col]" :type="item.type" plain :class="item.classname ? item.classname : ''" :key="item.id" :size="item.size" @click.stop="handleOperation(item.Fun,scope.$index, scope.row, item.id)" :icon="item.icon" round>{{ item.label }}</el-button>
                <el-button v-for="item in item.data" v-if="item.col && !scope.row[item.col]" :type="item.type" plain :class="item.classname ? item.classname : ''" :key="item.id" :size="item.size"  :icon="item.icon" round disabled>{{ item.label }}</el-button>
                <el-button v-for="item in item.data" v-if="!item.col && !scope.row[item.col]" :type="item.type" plain :class="item.classname ? item.classname : ''" :key="item.id" :size="item.size" @click.stop="handleOperation(item.Fun,scope.$index, scope.row, item.id)"  :icon="item.icon" round>{{ item.label }}</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <!-- 表格底部 页码-->
        <el-row class="flex vcenter h66" id="table_foot">
          <el-col :span="12">
            <div class="grid-content bg-purple-dark font-style" v-if="table.page.totalCount > 0">
              (共{{table.page.totalCount}}条记录，{{currentPage}}/{{totlePage}}页)
            </div>
          </el-col>
          <el-col :span="12">
            <el-pagination 
              class="f-r bottom-pagination"
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page.sync="currentPage" 
              :page-size="this.table.page.pageSize" 
              :layout="table.lastPageLayout?table.lastPageLayout:'prev, pager, next'" 
              :total="table.page.totalCount">
            </el-pagination>
          </el-col>
        </el-row>

        <scroolWidthBar ref="myScrollBar" :class="{'table-scroll-bar':table.showScrollBarAbsolute}" v-if="table.showScrollBar" :tableId="tableId"></scroolWidthBar>
    </div>
  </div>
</template> 

<script>
  import search from "./search";
  import scroolWidthBar from "@/components/scroolWidthBar" //共组件table的自定义滚动轴
  export default {
    components: {
      search,
      scroolWidthBar
    },
    props: {    
      table: {
        type: Object,
        default () {
          return {
            height: '',
            hasMergeRowOrColumn: false, // 是否合并单元格
            loading: false,             // 加载中动画
            hasShowSummary: false,      // 是否显示表位合计行
            border: false, // 是否带有纵向边框，默认为false
            hasSelect: false, // 有无选中功能
            hasOperation: false, // 有无操作功能
            hasExpand: false, // 有无展开行功能
            hasFirstPagination:false,
            NoSizeChange:false, //是否没有改变分页数目功能
            showScrollBar: true, // 是否显示scrollWithBar 组件
            lastPageLayout: 'sizes, prev, pager, next', // 最后一行的分页是否显示sizes
            tr: [ // 表头数据 —— className:列的class名
              {
                id: '1',
                label: 'label',
                prop: 'prop',
                className: 'classname',
                minWidth: '80',
                show: true // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列

              }
            ],
            data: [], // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
            page: 1,
            pageSizes:[],
            search: {
              show: false,
              data: [],
              width: '150', //快捷搜索输入框宽度
              placeOrder: '', //快捷搜索输入框提示文字
              displayCol: [] //弹出需要显示的列
            },
            operation: { // 操作功能
              label: '操作', // 操作列的行首文字
              width: '200', // 操作列的宽度
              className: '', // 操作列的class名
              data: [ // 操作列数据
                {
                  label: '通过', // 按钮文字
                  Fun: 'handleSubmit', // 点击按钮后触发的父组件事件
                  size: 'mini', // 按钮大小
                  id: '1', // 按钮循环组件的key值
                  classname: 'show' // 按钮的类名
                }
              ]
            },
            expands: [ // 展开行数据
              {
                id: '1',
                label: 'label',
                prop: 'prop'
              }
            ],
            getSummaries(param) { // 自定义表位合计行数据
              // *** 此函数传入param参数             
              // *** 最后返回一个数组，合计行会显示数组中的内容
              return []
            }
          }
        }
      },
      tableId: {
        type: String,
        default: 'tableId'
      }
    },
    data() {
      return {
        currentPage: 1,
      }
    },
    computed:{
        totlePage:function(){
          //后台给的参数不一致，有时候是pageSize 或者page_count
          if(this.table.page.pageSize)
          {
              return Math.ceil(this.table.page.totalCount/this.table.page.pageSize);
          }else if(this.table.page.page_count)
          {
              return Math.ceil(this.table.page.totalCount/this.table.page.page_count);
          }

        }
    },

    methods: {
      initCurrentPage(){
        this.currentPage = 1;
      },
      //获取搜索返回的列表、
      /**
      *@param {res} OBJECT 快捷搜索选中事件
       */
      getResult(res){
        this.table.data = [res];
        // this.$emit('searchTable',{searchData:res}); // 不需要传给父组件
      },
      handleCurrentChange() {
        this.$emit('searchTable', { page: this.currentPage ,pageSize: this.table.page.pageSize});
      },
      handleSizeChange(val) {      
        this.table.page.pageSize = val;
        this.currentPage = 1;
        this.$emit('searchTable', { page: 1, pageSize: val });
      },
      //表格单选
      handleSingleChange(val){
        this.$emit('onHandleSingleChange', val);
      },
      //表格复选
      handleSelectionChange(val) {
        this.$emit('onHandleSelectionChange', val);
      },
      /*
      @param idx Number 表下标
      fun 回调的方法
      row Object 当前行数据
      id String 行ID
       */
      handleOperation(fun,idx, row, id) {
        this.$emit(fun,idx, row, id)     
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.hasMergeRowOrColumn) {
          return
        } else {
          this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex });
        }
      },
      // 点击某一行时触发的函数
      // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
      rowClick(Row, Event, Column) {      
        if (!Column || Column.type === 'selection' || Column.columnKey === 'operation' || Column.type === 'expand') {
          return
        }
        const data = {
          row: Row,
          event: Event,
          column: Column
        };
        this.$emit('onRowClick', data)
      },
      // 行类名的回调函数
      // 在表格数据中添加class字段即为表格行类名，配合css可对表格行中的自定义标签进行样式优化
      rowClassName(rowdata) {
        const data = this.table.data;
        let className = data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : '';
        if (className.length === 0) {
          return
        }
        className = className.join(' ');
        return className
      },
      //当表格的排序条件发生变化的时候会触发该事件	{ column, prop, order }
      sortChange(column, prop, order){
        console.log(column, prop, order)
        if(column.prop === 'stay_num'){
          //需要先清除默认排序 ！！! 
          // if (this.$refs.TlRlTable) this.$refs.TlRlTable.clearSort()
          // sort...
          console.log(column.id)
          this.$emit('onHandleSortChange', column);
        }else if(!column.column){
          this.$emit('onHandleSortChange', column);
        }
        
      }
    }
  };
</script>

<style scoped>
.el-pagination {
  margin-top: 0;
  padding: 0 5px;
  height: 28px;
  line-height: 28px;
}
.font-style{
  font-size: 14px;
  color: #444;
}
.el-pager li {
  color: #444;
  min-width: 25px;
  height: 25px !important;
  line-height: 25px !important;
}

.el-pager li.active {
    color: #409eff;
    cursor: default;
    color: white !important;
    background: #409eff !important;
    border-radius: 100px !important;
}

.wrap-table /deep/ .el-table__body {
  width: 100%;
  table-layout: fixed !important;
}

.el-table td {
  min-height: 47px
}

.table-scroll-bar.scroolWidthBar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 88;
}

</style>
<style>
.wrap-table .el-table td, .el-table th {
    padding: 12px 0 !important;
    position: relative;
    z-index: 50;
}

.wrap-table .el-pagination .btn-next .el-icon,.wrap-table .el-pagination .btn-prev .el-icon {
    border: 1px solid #eee;
    border-radius: 100px !important;
    width: 25px !important;
    height: 25px !important;
    line-height: 24px !important;
    color: #b0b8c5;
    font-weight: bold;
}
.wrap-table .el-pagination .btn-next, .wrap-table .el-pagination .btn-prev {
    position: relative;
    top: -2px;
}

.wrap-table .el-icon-question::before{
  color: #409eff;
  cursor: pointer;
} 

.wrap-table .el-table::after{
    content: "";
    height: 16px;
    position: absolute;
    width: 100%;
    bottom: 1px;
    background: white;
    z-index: 40;
    left: 0;
}
</style>

