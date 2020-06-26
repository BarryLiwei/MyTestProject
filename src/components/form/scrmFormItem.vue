<template>
    <el-form-item :label="itemLabel" :required="itemRequired" :class="itemClass" class="custom-form-item">
        <edit-cell
            :itemInfo="itemInfo"
            v-bind="$attrs"
            v-on="$listeners">

            <template slot="lineHander">
                <slot name="lineHander" :obj="itemInfo"></slot>
            </template>

            <template slot="custom">
                <slot name="custom" :obj="itemInfo"></slot>
            </template>

            <template slot="notEdit">
                <slot name="notEdit" :obj="itemInfo"></slot>
            </template>
            
        </edit-cell>
    </el-form-item>
</template>

<script>
// 此组件是封装form-item，对里面的组件输入框，下拉框等封装，后续由需求可以进行补充
// 此组件后续可停用， 后续用的时候直接使用 <el-form-item><editCell></editCell></el-form-item>，减少嵌套层数
import EditCell from './EditCell'
export default {
    components: {
        EditCell
    },
    props: {
        itemLabel: { // form-item上的属性， lalel值
            type: String,
            default: ''
        },
        itemRequired: { // item 上是否必填
            type: Boolean,
            default: false
        },
        itemClass: { // 传进来的class
            type: String,
            default: ''
        },
        itemInfo: { // 选中的值(由于在父元素用v-model在别的项目，有的同事打包后报错，故通过对象的方式保存值) 
            type: Object,
            default: ()=>{ // 传进来form表单，通过item.key来绑定所取的值
                return{}
            }
        }, 
    },
    data(){
        return{}
    }
}
</script>

<style lang="scss" scoped>
.image-size {
    width: 48px;
    cursor: pointer;
}
.defaultSubClass {
    width: 100%;
}

.custom-form-item /deep/ .el-date-editor .el-range-separator {
    width: 12%;
    min-width: 30px;
}
</style>

