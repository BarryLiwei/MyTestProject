<template>
    <el-dialog
        :title="config.title"
        class="distribute-dialog"
        :visible.sync="showDialog"
        width="480px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">

        <div v-if="showBatch" class="total">已选数据 <span class="total-num"> {{ selectTotal }}</span> 条</div>

        <el-form ref="form" label-width="105px" v-loading="loading">
            <scrm-form-item :itemLabel="config.groupLabel" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info"  itemKey="dccGroupId" :filterable="true"  :selectOptions="config.groupOptions" :optionLabel="'dccGroupName'" :optionValue="'id'"></scrm-form-item>
            
            <scrm-form-item :itemLabel="config.dccLabel" itemType="select" :itemRequired="config.dccRequired" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择" 
                :itemInfo="info"  itemKey="dccId" :filterable="true" :selectOptions="dccOptions" :optionLabel="'dccName'" :optionValue="'id'" ></scrm-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="medium" class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="medium" class="w-90" type="primary" @click="save" :disabled="loading">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
// 分配和批量分配  激活和批量激活共用一个组件
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    components: {
        ScrmFormItem
    },
    props: {
        config: {
            type: Object,
            default: ()=>{ 
                return {
                    type: 'active', // 激活和分配distribute
                    title: '分配', // 分配和批量分配
                    groupLabel: '处理坐席组',
                    groupOptions: [],  // 坐席组下拉列表
                    groupObj: {}, // 坐席组对象
                    dccLabel: '处理DCC',
                    selectId: [], // 选择的列表id
                }
            }
        },
        loading:{
            type: Boolean,
            default: false,
        }
    },
    data(){
        return{
            showDialog: true,
            info: {
                dccGroupId: '',
                dccId: '',
            },
            dccOptions: []
        }
    },
    created(){
        const { groupOptions } = this.config;
        this.dccOptions = groupOptions[0] && groupOptions[0].dccList? groupOptions[0].dccList:[];
        this.info.dccGroupId = groupOptions[0] && groupOptions[0].id ? groupOptions[0].id:[]
    },
    computed:{
        showBatch(){
            return this.config.title.indexOf('批量') > -1? true: false
        },
        selectTotal(){
            return this.config.selectId && this.config.selectId.length? this.config.selectId.length:0
        }
    },
    methods: {
        cancel(){
            this.$emit('close','cancel')
        },
        save(){
            this.$emit('close','save', this.info)
        }
    }
}
</script>

<style lang="scss" scoped>
.distribute-dialog /deep/.el-dialog__body {
    padding: 30px 35px 15px 20px;
}

.distribute-dialog /deep/.el-dialog__footer {
    padding: 10px 0 30px;
}

.total {
    line-height: 30px;
    font-size: 14px;
    color: #444;
    padding-left: 15px;
    margin-bottom: 10px;
    .total-num {
        color: #34b572;
    }
}

</style>


