<template>
    
</template>

<script>
export default {
    data(){
        return {
            dataTable: {}, // 表单列表的数据
            search:{},
        }
    },
    methods: {
        clearSearch(){ // 清空search
            this.search.list.forEach((item)=>{
                item.currentVal = '';
                if(item.type == 'cascader'){ // 联动的需要清除
                    item.oneVal = '';
                    item.secondVal = '';
                    item.secondOptions = [];
                }
                if(item.prop == 'series' || item.prop == 'model' || item.prop == 'dcc'){ // 联动品牌的需要置空, 有些不需要联动的，就重新明个名字或者在组内内重写函数覆盖,或者在组件内不写prop属性
                    item.selectOptions = [];
                }
                // 联动车型品牌
                if(item.type == 'selectCar') {
                    this.$eventHub.$emit('clear-select-car');
                }
            })

            if(this.dataTable.search.show){ // 表格上的搜索
                this.dataTable.search.value = '';
            }
        },
        getDccList(){ // DCC/组列表
            this.$fetch.common.commonDccList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.dccGroup].selectOptions = this.$hasArrContent(res)?res:[];
                    this.search.list[this.search.dccGroup].selectOptions.unshift({'id': '0', 'dccGroupName':'--','dccList':[]}); // 后端反馈，一级为空，二级只能是空值
                    let arr=this.search.list[this.search.dccGroup].selectOptions
                    if(this.$hasArrContent(arr)){
                        this.dccGroupObj = {};
                        arr.forEach((item)=>{
                            this.dccGroupObj[item.id]=item;
                        })
                    }
                }, false);
            })
        },
        changeDccGroup(val){
            let dccList = this.dccGroupObj[val]['dccList'];
            this.search.list[this.search.dcc].currentVal='';
            this.search.list[this.search.dcc].selectOptions = this.$hasArrContent(dccList)?dccList:[];
            this.search.list[this.search.dcc].selectOptions.unshift({'id': '0', 'dccName':'--'})
        },
        getClueFrom(){ // 线索来源
            this.$fetch.callCenter.clueFrom({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.customer].oneOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getBrandList(){
            this.$fetch.common.carBrand({},false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.brand].selectOptions = this.$hasArrContent(res)?res:[];
                }, false);
                
            })
        },
        changeFrom(val, item){
            this.search.list[this.search.customer].secondVal='';
            this.search.list[this.search.customer].secondOptions = this.$hasArrContent(item.children)?item.children:[];
        },
        changeBrand(val){
            this.search.list[this.search.series].currentVal='';
            this.search.list[this.search.model].currentVal='';
            this.search.list[this.search.model].selectOptions=[];
            this.$fetch.common.carSeries({'brandId': val},false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search.series].selectOptions = this.$hasArrContent(res)?res:[];
                }, false);
            })
        },
        changeSeries(val){
            this.search.list[this.search.model].currentVal='';
            this.$fetch.common.carModel({'seriesId': val},false).then((res)=>{
                this.search.list[this.search.model].selectOptions = this.$hasArrContent(res.data.data)?res.data.data:[];
            })
        },
        //点击表格复选 结果
        handleSelectionChange(sel) {
            if(this.exportConfig){ //导出的复选框-选中项
                this.exportConfig.select = sel; 
            }
            this.selectData = sel; //一般的复选框-选中项
        },
        searchTable(params){ // table 上的搜索
            this.dataTable.page.currentPage = params.page;
            this.queryData();
        },
        find(){
            this.dataTable.page.currentPage = 1; 
            this.$refs.DataTableRef.initCurrentPage(); // 触发第一页
            this.queryData();
        },
        clear(){
            this.clearSearch();
            this.dataTable.page.currentPage = 1; 
            this.$refs.DataTableRef.initCurrentPage();
            this.queryData(); // 先调接口，后清理筛选数据
        },
        getClueGradeList(key="grade"){ // 线索评分
            this.$fetch.common.commonClueGradeList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getClueStatusList(key="state"){ // 线索状态
            this.$fetch.common.commonClueStatusList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getClueTypeList(key="type"){ // 线索类型
            this.$fetch.common.commonClueTypeList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getClueLevelList(key="level"){ // 意向等级
            this.$fetch.common.commonClueLevelList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    if(this.$hasArrContent(res)){
                        let arr = [];
                        res.forEach((item)=>{
                            arr.push({'title': item + '级', 'id': item})
                        })
                        this.search.list[this.search[key]].selectOptions = arr;
                    }
                }, false);
            })
        },
        getAreaOptions(key="area"){ // 门店列表
            this.$fetch.common.commonAreaList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getArrivalOptions(key="arrival"){ // 到店类型
            this.$fetch.common.commonArrivalList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getDefeatStatusOptions(key="status"){ // 战败状态
            this.$fetch.common.commonDefeatStatusList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getDefeatReasonOptions(key="type"){ // 战败类型
            this.$fetch.common.defeatReasonTypeList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
        getArchiveStatusOptions(key="status"){ // 潜客跟进状态
            this.$fetch.common.ArchiveStatusList({},false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.search.list[this.search[key]].selectOptions = this.$hasArrContent(res)?res:[]; 
                }, false);
            })
        },
    }
}
</script>

