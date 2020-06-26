<template>
  <div class="components-search m-r-20">
    <el-autocomplete
      round
      v-model.trim="search.value"
      :fetch-suggestions="querySearchAsync"
      :placeholder="search.placeholder"
      :trigger-on-focus="false"
      @select="handleSelect"
      v-bind:style="{ width:  + search.width+'px' }"
      clearable
      :size="searchBtnSize"
      @clear="clear"
      suffix-icon="el-icon-search"
    ></el-autocomplete>
  </div>
</template>  
<script>
export default {
  props: {
    search: {
      type: Object,
      default() {
        return {
          show: false,
          url: "",
          value: "",
          width: "150", //快捷搜索输入框宽度
          placeholder: "", //快捷搜索输入框提示文字
          displayCol: [], //弹出需要显示的列
          params: {}, // 父元素创建来的参数
        };
      }
    },
    searchBtnSize:{
      type: String,
      default: 'small'
    }
  },
  data() {
    return {};
  },
  mounted(){
    this.$set(this.search, 'value', this.search.value);
  },
  methods: {
    clear() {
      this.$emit("searchTable");
    },
    /**
     * @DateTime 
     * @param     {[STRING]}    queryString [搜索的keyword]
     * cd OBJECT 组件的回调函数
     */
    querySearchAsync(queryString, cb) {
      this.time = setTimeout(()=>{
        clearTimeout(this.time)
        queryString = String(queryString).replace(/(^\s*)|(\s*$)/g, "");
        this.qString=queryString;
     
        if(queryString == ''){
          let list = [];
          list[0] = {
            value:'没有匹配到数据',
            isSeach:false
          }
          cb(list);
          return;
        }
    
        let model = this.search.url.split(".")[0];
        let method = this.search.url.split(".")[1];
        let params;
        if(this.search.keyword){
          params = { page: 1, [this.search.keyword]: queryString};
        }else{
          params = { page: 1, keyword: queryString};
        }
        
        // 增加父元素传递的参数
        if(this.search.params && Object.keys(this.search.params).length){
          Object.assign(params,this.search.params);
        } 

        // web-tj.chexiu.cn 返回来的数据结构不一样，可以在返回来之后判断处理
        // 调接口获取数据  
        this.$fetch[model][method](params, true, false) // 第一个true 过滤字段，第二个为显示全局的loading
          .then(res => {
            let list = [];
            let dataList = res.data.data && res.data.data.list;
            if(dataList && dataList.data && dataList.data.length){  // 返回来的接口数据结构不一样的时候
              list = this.handCallBack(dataList.data);
            }else if(dataList && dataList.length){
              list = this.handCallBack(dataList);
            }else{
              list[0] = {
                value:'没有匹配到数据',
                isSeach:false
              }
            }
            if(this.qString==queryString){//处理输入过快产生的BUG
              cb(list);
            }
          })
          .catch(err => {
            cb([]);
          });
      },300)
    },
    handCallBack(dataList){
      var list = [];
      for (var name of dataList) {
        let tval = [];
        for (var i of this.search.displayCol) {
          if(i.includes('.')){
            tval.push(name[i.split('.')[0]][i.split('.')[1]]);
          }else{
            tval.push(name[i]);
          }
        }
        var t = tval.filter(d=>{return d && d!='--'});  // 去除数组中的空值/假值（undefined/null/false/0/""）
        name.value = t.join(',');
        list.push(name);
      }
      return list;
    },
    handleSelect(item) {
      // 新增判断是否进行数据请求
      if(item.isSeach || item.isSeach===false){
        this.search.value = '';//清空搜索框的值
        this.clear()//调用clear
        return false;
      }else{
        this.$emit("getResult", item);  
      }
    },
  },
};
</script>
<style scoped>
.wrap-table .el-autocomplete .el-input__inner {
  height: 36px;
  line-height: 36px;
  border-radius: 36px;
}
.wrap-table .el-input__inner,
.wrap-table .el-pagination__jump,
.wrap-table .el-input__icon {
  line-height: 36px !important;
}
.wrap-table .el-pagination__sizes,
.wrap-table .el-select--mini,
.wrap-table .el-pagination button,
.wrap-table .el-input--suffix,
.wrap-table .el-pager li,
.wrap-table .el-pagination .el-select .el-input .el-input__inner {
  height: 36px !important;
  line-height: 36px !important;
}

.components-search  /deep/ .el-input__inner {
  border-radius: 36px;
}
.components-search /deep/ .el-input--suffix .el-input__inner {
    padding-right: 55px !important;
}
</style>

