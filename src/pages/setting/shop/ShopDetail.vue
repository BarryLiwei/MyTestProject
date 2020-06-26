<template>
    <el-dialog
      title="门店详情"
      class="shop-detail-dialog"
      :visible.sync="dialogVisible"
      width="650px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
        <el-form ref="form" label-width="155px">
            <el-form-item label="增入时间:">
                {{ info.created_date | filterBlank}}
            </el-form-item>

            <el-form-item label="门店名称:">
                {{ info.full_name | filterBlank}}
            </el-form-item>

            <el-form-item label="品牌:">
                {{ info.brandsName | filterBlank}}
            </el-form-item>

            <el-form-item label="门店地址:">
                {{ info.address | filterBlank}}
            </el-form-item>

            <el-form-item :label="`所属组织(${info.orgs.length}):`">
                <p v-for="(item, index) in info.orgs" :key="index"> {{ item.name | filterBlank}}</p>
            </el-form-item>

            <el-form-item label="门店系统管理员:">
                {{ info.admin_name | filterBlank}}
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
// 开口任务新增、编辑、 查看另外写吧，都放在一块会觉得拥挤，不好维护
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    props: {
        info:{
            type: Object,
            default:()=>{
                return {}
            }
        }
    },
    components: {
        ScrmFormItem
    },
    data(){
        return{
            dialogVisible: true,
        }
    },
    methods: {
        cancel(){
            this.$emit('cancel')
        },
    }
}
</script>

<style lang="scss" scoped>
.shop-detail-dialog /deep/.el-dialog__body {
    padding: 20px 35px 35px 20px;
}

.shop-detail-dialog /deep/ .el-form-item {
    margin-bottom: 12px;
}

</style>

