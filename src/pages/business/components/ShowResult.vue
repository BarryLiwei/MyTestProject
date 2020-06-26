<template>
    <el-dialog
        :title="title"
        class="actived-dialog"
        :visible.sync="dialogShow"
        width="480px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">

        <div class="tip-result">导入数量 {{ config.total }} ， 成功<span class="tip-green m-l-5">{{config.success }}</span>，失败<span class="tip-red m-l-5">{{ config.fail }}</span></div>
        <div class="tip-error-text" v-if="config.tip">{{ config.tip }}</div>
        <slot></slot>
        <span slot="footer">
            <el-button round size="medium" class="w-90" type="primary" @click="cancel">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
// 批量分配，激活弹窗显示
export default {
    props: {
        config: {
            type: Object,
            default: ()=>{ 
                return {
                    success: 0,
                    fail: 0,
                    tip: ''
                }
            }
        },
        title: {
            type: String,
            default: '提示'
        }
    },
    data(){
        return{
            dialogShow:true
        }
    },
    methods: {
        cancel(){
            this.$emit('close','cancel')
        },
    }
}
</script>

<style lang="scss" scoped>
.actived-dialog /deep/.el-dialog__body {
    padding: 45px 35px 22px 20px;
}

.actived-dialog /deep/.el-dialog__footer {
    padding: 10px 0 30px;
}

.tip-green {
    color: #34b572;
}

.tip-red {
    color: #ea5a54;
}

.tip-error-text{
    color: #a7b2c0;
    font-size: 14px;
    padding-left: 15px;
    margin-bottom: 5px;
}

.tip-result {
    line-height: 30px;
    font-size: 16px;
    color: #444;
    padding-left: 15px;
    margin-bottom: 10px;
}

</style>


