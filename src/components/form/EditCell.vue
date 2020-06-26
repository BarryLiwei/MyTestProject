<template>
    <div class="edit-cell-component">
        <div v-if="!$slots.custom && editable">
            <el-select
                v-if="itemType == 'select'"
                v-model="itemInfo[itemKey]"
                :size="btnSize"
                :class="subClass"
                v-bind="$attrs"
                v-on="$listeners">
                <el-option v-if="selectIsAll && selectOptions && selectOptions.length" :label="selectIsAllTitle" value=" " ></el-option>
                <el-option
                    v-for="(option,index1) in selectOptions"
                    :key="index1"
                    :label="option[optionLabel]"
                    :value="option[optionValue]"
                    :disabled="option.disabled"
                ></el-option>
            </el-select>

            <el-date-picker
                v-if="itemType == 'datePicker'"
                v-model="itemInfo[itemKey]"
                :size="btnSize"
                :class="subClass"
                v-bind="$attrs"
                v-on="$listeners">
            </el-date-picker>

            <el-input
                v-if="itemType == 'input'"
                v-model="itemInfo[itemKey]"
                :size="btnSize"
                :class="subClass"
                v-bind="$attrs"
                v-on="$listeners">
            </el-input>

            <slot name="lineHander"></slot>
        </div>

        <slot v-if="$slots.custom && editable" name="custom" :obj="itemInfo"></slot>

        <!-- 由于v-model写在父元素，还是在父元素处理不可编辑状态, 不满足的情况下可以自定义notEdit -->
        <div v-if="!editable && !$slots.notEdit">
            <div v-if="itemType == 'input'"  :class="{'ellipsis': isEllipsis}" :title="itemInfo[itemKey]"> {{ itemInfo[itemKey] | filterBlank }}</div>
            <div v-if="itemType == 'select'" :class="{'ellipsis': isEllipsis}"> 
                <div v-if="!isTransfer"> {{ itemInfo[itemKey] | filterBlank }} </div>
                <div v-if="isTransfer"> {{ selectOptions | selectGetTitle(optionValue, optionLabel,itemInfo[itemKey]) | filterBlank }}</div>
            </div>
            <div v-if="itemType == 'datePicker'" :class="{'ellipsis': isEllipsis}">
                <div v-if="!isTransfer"> {{ itemInfo[itemKey] | filterBlank  }} </div>  
                <div v-if="isTransfer"> {{ itemInfo[itemKey]| normalTime | filterBlank }}</div>
            </div>
        </div>
        <slot v-if="!editable && $slots.notEdit"  name="notEdit" :obj="itemInfo"></slot>
    </div>
</template>

<script>
// 此组件是封装form-item，对里面的组件输入框，下拉框等封装，后续由需求可以进行补充
// 对form上的属性通过pros传进来，以item-开头命名 
// selectOptions为下拉框列表；  optionLabel为下拉框的label字段, optionVaule 为下拉框的value字段  isAll 布尔值，是否显示全部， isAllTitle，全部的中文字段

export default {
    props: {
        itemInfo: { // 选中的值(由于在父元素用v-model在别的项目，有的同事打包后报错，故通过对象的方式保存值) 
            type: Object,
            default: ()=>{ // 传进来form表单，通过item.key来绑定所取的值
                return{}
            }
        }, 
        itemKey: String,
        itemType: { // 哪种类型的输入框 input, select
            type: String,
            default: ''
        },
        editable: { // 是否可编辑， 默认可编辑
            type: Boolean,
            default: true
        },
        subClass: { // 传进来的class
            type: String,
            default: 'defaultSubClass'
        },
        selectIsAll: { // 当为select时是否需要全选
            type: Boolean,
            default: false
        },
        selectIsAllTitle: { // 当为select时的名字
            type: String,
            default: '全部'
        },
        selectOptions:{
            type: Array,
            default:()=>{return []}
        },
        optionLabel:{
            type: String,
            default:''
        },
        optionValue:{
            type:String,
            default:''
        },
        isEllipsis:{ // 默认超出部分显示点点点
            type: Boolean,
            default: true
        },
        currentVal: '', // 父元素的 v-model值，此值为非编辑状态下，传进来，有input 字符串是形式，有select的v-model，还有日期(数组或字符串)
        isTransfer: { // 时间和下拉框需要转移的，加这个字段, 默认下拉框直接显示中文，如果是传进来id，需要显示label，就让这个字段为true
            type: Boolean,
            default: false
        },
        btnSize: { // 用户那边默认用最小
            type: String,
            default: 'small'
        }
    },
    data(){
        return{}
    }
}
</script>

<style lang="scss" scoped>
.defaultSubClass {
    width: 100%;
}

.edit-cell-component /deep/ .el-date-editor .el-range-separator {
    width: 12%;
    min-width: 30px;
}
</style>