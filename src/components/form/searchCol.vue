<template>
    <el-row type="flex"  align="middle" :justify="rowJustify" class="m-b-20 seacrh-col" :class="`el-col-${colWidth}`">
        <el-col :span="leftCol" class="search-lable">{{info.label}}</el-col>
        <el-col :span="rightCol">
            <div v-if="!$slots.custom">
                <el-select
                    v-if="info.type == 'select'"
                    v-model="info.currentVal"
                    :placeholder="selectPlaceholder"
                    :size="btnSize"
                    class="defaultWidth"
                    v-bind="$attrs"
                    v-on="$listeners">
                    <el-option v-if="info.isAll && info.selectOptions && info.selectOptions.length" :label="info.isAllTitle" value=" " ></el-option>
                    <el-option
                        v-for="(option,index1) in info.selectOptions"
                        :key="index1"
                        :label="option[info.optionLabel]"
                        :value="option[info.optionValue]"
                    ></el-option>
                </el-select>

                <el-date-picker
                    v-if="info.type == 'datePicker'"
                    v-model="info.currentVal"
                    class="defaultWidth"
                    :size="btnSize"
                    v-bind="$attrs"
                    v-on="$listeners">
                </el-date-picker>

                <el-input
                    v-if="info.type == 'input'"
                    class="defaultWidth"
                    :size="btnSize"
                    v-model.trim="info.currentVal"
                    v-bind="$attrs"
                    v-on="$listeners">
                </el-input>

                <!-- 两级的联动 -->
                <cascader-scrm v-if="info.type == 'cascader'" :search="info" v-bind="$attrs" v-on="$listeners"></cascader-scrm>      

                <!-- 选择车型 -->
                <car-select v-if="info.type == 'selectCar'" :showCar="info" v-bind="$attrs" v-on="$listeners"></car-select>
            </div>

            <!-- 不满足的时候可以自定义 -->
            <slot name="custom"></slot>
        </el-col>
    </el-row>
</template>

<script>
// 此组件用于 table表格上面的搜索列(两种用法，请参考 @/pages/customer/stock/stockManage/component 里面的stockOrder和stockCar这两个组件);
// info: {type: 'select', 'label': '', currentVal: '', selectOptions:[], optionLabel:'', 'optionValue', isAll: true, isAllTitle: '' }
// type 指的是下拉框还是时间，label为宽左侧的值  currentVal是v-model的选中值 
// selectOptions为下拉框列表；  optionLabel为下拉框的label字段, optionVaule 为下拉框的value字段 
// isAll 布尔值，是否显示全部， isAllTitle，全部的中文字段
import CascaderScrm from '@/components/CascaderScrm';
import CarSelect from '@/components/CarSelect'
export default {
    components: {
        CascaderScrm,
        CarSelect
    },
    props: {
        info: { // 传进来的数组列表的对象
            type: Object,
            default: ()=>{ 
                return {
                    type: 'cascader', // 类型，目前设置了 input, select, date, cascader, selectCar 四种，还可以自定义custom
                    label: 'label', 
                    currentVal: '',   // type为input,select,datepicter的取值
                    oneVal: '',       // type 为cascader的一级绑定值
                    oneOptions:[],    // type 为cascader的一级下拉框值
                    oneOptionLabel: '',
                    oneOptionValue: '',
                    secondVal:'',        // type 为cascader的二级绑定值
                    isAll: true,         // type 为cascader的二级下拉框值是否显示全部 
                    isAllTitle:'全部',   // type 为cascader的二级下拉框值是否显示全部 
                    secondOptions: [],   // type 为cascader的二级下拉框值
                    secondOptionLabel: '', // type 为cascader的二级下拉框值对应的label
                    secondOptionValue: '', // type 为cascader的二级下拉框值对应的value
                    brand: true,  // type 为selectCar时 是否展示品牌
                    series: true,  // type 为selectCar时 是否展示车系
                    model: true,  // type 为selectCar时 是否展示车型
                    brandId: null,  // type 为selectCar时 品牌ID
                    seriesId: null, // type 为selectCar时 车系ID
                    modelId: null,  // type 为selectCar时 车型ID
                    fn: (item)=>{}         // 此函数是此组件for循环时才需要这个函数绑定自定的函数，不用for遍历此组件，可以不需要
                };
            }
        },
        colWidth: {
            type: Number,
            default: 6
        },
        rowJustify: {
            type:String,
            default: 'start'
        },
        leftCol: {  // 由于列表中有左侧菜单，所有用得比较多leftCol=7 和 rightCol=16组合，所以默认这个
            type: Number,
            default: 7
        },
        rightCol: {
            type: Number,
            default: 16
        },
        selectPlaceholder: {
            type: String,
            default: '请选择'
        },
        btnSize: {
            type: String,
            default: 'small'
        }
    },
    data(){
        return {}
    }
}
</script>


<style lang="scss" scoped>
.defaultWidth {
    width: 100%;
}
.seacrh-col {
    float:none;
}
.seacrh-col /deep/ .el-date-editor .el-range-separator {
    width: 12%;
    min-width: 30px;
}

.seacrh-col /deep/ .el-date-editor.el-input__inner {
    width: 100%;
}
</style>

