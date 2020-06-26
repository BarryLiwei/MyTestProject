<template>
    <el-dialog
        :title="config.title"
        class="actived-dialog"
        :visible.sync="showDialog"
        width="520px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">

        <div v-if="config.title.indexOf('批量') > -1" class="total">已选数据 <span class="total-num"> {{ config.selectId && config.selectId.length? config.selectId.length:0}}</span> 条</div>

        <div v-if="config.tip" class="active-title" :class="{'active-title-not-total': config.title.indexOf('批量') == -1}">{{ config.tip }}</div>

        <el-form ref="form" label-width="120px" v-loading="loading">
            <scrm-form-item v-if="config.showLevel" itemLabel="意向等级" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info"  itemKey="level" :filterable="true"  :selectOptions="levelOptions" :optionLabel="'title'" :optionValue="'id'"></scrm-form-item>

            <scrm-form-item v-if="config.showTime" itemLabel="下次跟进时间" itemType="datePicker" type="datetime" :itemRequired="true" itemClass="form_required_after form-task-time" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info"  itemKey="nextFollowDate" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" :default-time="defeatTime" @focus="getCurrentTime()"></scrm-form-item>

            <!-- 都在同一个组，才能分配和激活  listTotal == 1, 才能分配和激活坐席 -->
            <scrm-form-item v-if="config.listTotal == 1" :itemLabel="config.groupLabel" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info"  itemKey="dccGroupId" :filterable="true"  :selectOptions="config.groupOptions" :optionLabel="'dccGroupName'" :optionValue="'id'"></scrm-form-item>
            
            <scrm-form-item v-if="config.listTotal == 1"  :itemLabel="config.dccLabel" itemType="select" :itemRequired="config.dccRequired" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info"  itemKey="dccId" :filterable="true" :selectOptions="dccOptions" :optionLabel="'dccName'" :optionValue="'id'" ></scrm-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="medium" class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="medium" class="w-90" type="primary" @click="save" :disabled="loading">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
// 激活（潜客和战败管理）激活和批量激活共用一个组件
import ScrmFormItem from '@/components/form/ScrmFormItem'
import moment from 'moment'
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
                level:'',
                nextFollowDate:''
            },
            dccOptions: [],
            levelOptions:[],
            defeatTime:'12:00:00'
        }
    },
    created(){
        const { groupOptions } = this.config;
        this.dccOptions = groupOptions[0] && groupOptions[0].dccList? groupOptions[0].dccList:[];
        this.info.dccGroupId = groupOptions[0] && groupOptions[0].id ? groupOptions[0].id:[];

        if(this.config.levelOptions && this.config.levelOptions.length){
            this.config.levelOptions.forEach((item)=>{
                if(item.id != 'F'){
                    this.levelOptions.push(item)
                }
            })
        }
    },
    methods: {
        cancel(){
            this.$emit('close','cancel')
        },
        save(){
            this.$emit('close','save', this.info)
        },
        getCurrentTime(){
            this.defeatTime = moment(new Date()).format('HH:mm:ss');
        }
    }
}
</script>

<style lang="scss" scoped>
.actived-dialog /deep/.el-dialog__body {
    padding: 30px 35px 15px 20px;
}

.actived-dialog /deep/.el-dialog__footer {
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
.active-title {
    color: #a7b2c0;
    font-size: 14px;
    padding-left: 15px;
    margin-bottom: 20px;
    margin-top: -10px
}

.active-title.active-title-not-total{
    margin-top: 0;
}

.actived-dialog /deep/.el-date-editor.el-input,
.actived-dialog /deep/.form-task-time /deep/.el-input__inner {
    width: 100%;
}

</style>


