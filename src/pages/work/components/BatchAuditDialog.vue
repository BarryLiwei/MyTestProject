<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="450px"
        :before-close="handleCancel"
        class="batch-audit-dialog">
        
        <p class="tip">已选{{selectAll > 0 ? selectAll : selectData.length}}条数据</p>

        <el-radio-group v-model="radio" class="radio-group">
            <el-radio :label="1">全部同意</el-radio>
            <el-radio :label="2">全部拒绝<span class="txt">(默认由潜客所属DCC邀约员继续跟进)</span></el-radio>
        </el-radio-group>

        <div slot="footer" class="p-b-20">
            <el-button class="blue_font_white_bg" @click="handleCancel" round>取消</el-button>
            <el-button type="primary" @click="handleEnsure" round>确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import * as Http from '@/apis/work'
export default {
    props: {
        // 所选数据
        selectData: {
            type: Array,
            default: []
        },
        // 所有数据
        selectAll: {
            type: Number,
            default: 0
        },
        // 审核类型  defeat: 战败审核 invalid：无效审核
        auditType: {
            type: String,
            default: 'defeat'
        }
    },
    data() {
        return {
            dialogVisible: true,
            title: '批量战败审核',
            radio: '',
            form: {
                dcc: ''
            }
        }
    },
    created() {
        switch (this.auditType) {
            case 'defeat':
                this.title = '批量战败审核'
                break;
            case 'invalid':
                this.title = '批量无效审核'
            break;
            default:
                break;
        }
    },
    methods: {
        // 确定
        handleEnsure() {
            if(!this.radio) {
                this.$alert('请勾选 “全部同意” 或者 “全部拒绝” ', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {}
                });
                return;
            }
            this.submitBatchType();
        },
        handleCancel() {
            this.$emit('cancelBatch')
        },
        // 提交批量操作类型
        submitBatchType() {
            let queryName = this.auditType == 'invalid' ? 'clueInvalidBatch' : 'defeatBatch';
            let params = {
                ids:  this.selectAll > 0 ? 'all' : this.selectData,
                type: this.radio == 1 ? 'agree' : 'refuse'
            }
            Http[queryName](params).then((res) =>{
                this.$handleResponse(res, data => {
                    if (data) {
                        this.$message.success('操作成功')
                        this.$emit('successBatch')
                    }
                },true)
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.batch-audit-dialog {
    .tip {
        font-size: 14px;
        color: #ea5a54;
    }
    /deep/ .el-dialog__body {
        padding: 30px 40px;
    }

    .radio-group {
        label {
            margin-top: 30px;
            color: #444;
        }

        .txt {
            color: #a8a8a8;
        }
    }
}
</style>

