<template>
    <el-dialog
      title="查看详情"
      class="view-talk-task-dialog"
      :visible.sync="dialogVisible"
      width="500px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
      <el-form ref="form" label-width="110px" v-loading="loading">
            <scrm-form-item itemLabel="适用场景" itemType="input" :itemInfo="viewInfo" itemKey="scenarioTitle" :editable="false"></scrm-form-item>

            <scrm-form-item itemLabel="任务名称" itemType="input" :itemInfo="viewInfo" itemKey="title" :editable="false"></scrm-form-item>
            
            <scrm-form-item itemLabel="任务内容" class="custom-form"></scrm-form-item>

            <scrm-form-item :itemLabel="`任务${index+1}`" class="custom-form" v-for="(item,index) in  viewInfo.content" :key="index" :itemInfo="item" itemKey="title"  itemType="input" :editable="false"></scrm-form-item>

            <scrm-form-item itemLabel="适用坐席组" class="m-t-15" :itemInfo="{}" :editable="false">
                 <template slot="notEdit">
                     <el-tag v-for="(item,index) in viewInfo.dccGroup" :key="'tag'+index" type="info" effect="plain">
                       {{ item.title}}
                     </el-tag>
                </template>
            </scrm-form-item>
            
            <scrm-form-item itemLabel="任务时间" itemType="input" :itemInfo="viewInfo" itemKey="endDate" :editable="false"></scrm-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    components: {
        ScrmFormItem
    },
    props: {
        id: {
            type: [String, Number],
            default: ''
        } 
    },
    data(){
        return{
            dialogVisible: true,
            checked: true,
            loading: false,
            viewInfo: {},
        }
    },
    created(){
        this.taskView();
    },
    methods: {
        cancel(){
            this.$emit('close')
        },
        taskView(){
            this.loading = true;
            this.$fetch.callCenter.openTaskView({'id': this.id}).then((res)=>{
                this.viewInfo = res.data.data;
                if(this.viewInfo.endDate != '永久有效' && this.viewInfo.startDate){
                   this.viewInfo.endDate = `${this.viewInfo.startDate} - ${this.viewInfo.endDate}`
                }
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.view-talk-task-dialog /deep/.el-dialog__body {
    padding: 20px 20px 30px;
}

.el-form-item {
    margin-bottom: 6px;
}
.el-form-item /deep/.el-form-item__label{
    padding-right: 25px;
}
.el-tag {
    margin-right: 10px;
}

.custom-form.el-form-item {
    margin-bottom: 0;
}

.custom-form.el-form-item /deep/.el-form-item__label,
.custom-form.el-form-item /deep/ .el-form-item__content{
    height: 32px;
    line-height: 32px;
}
</style>


