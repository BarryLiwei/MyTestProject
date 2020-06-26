<template>
    <el-dialog
      title="活动详情"
      class="view-talk-task-dialog"
      :visible.sync="dialogVisible"
      width="500px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
      <el-form ref="form" label-width="110px" v-loading="loading">
            <scrm-form-item itemLabel="有效期" itemType="input" :itemInfo="{}" :editable="false">
              <template slot="notEdit">
                     {{viewInfo.startDate}} 至 {{viewInfo.endDate}}
                </template>
            </scrm-form-item>

            <scrm-form-item itemLabel="活动类型" itemType="input" :itemInfo="viewInfo" itemKey="activityTypeTitle" :editable="false"></scrm-form-item>
            
            <scrm-form-item v-show="viewInfo.activityType == 3" itemLabel="适用品牌" itemType="input" :itemInfo="viewInfo" itemKey="brand" :editable="false"></scrm-form-item>

            <scrm-form-item v-show="viewInfo.activityType == 4" :itemLabel="`适用门店(${viewInfo.areasLength})`" itemType="input" :itemInfo="{}" :editable="false">
              <template slot="notEdit">
                     <span v-for="(item, index) in viewInfo.areasName" :key="index"><i v-if="index != 0">、</i>{{item}}</span>
                </template>
            </scrm-form-item>

            <scrm-form-item itemLabel="活动标题" itemType="input" :itemInfo="viewInfo" itemKey="title" :editable="false"></scrm-form-item>

            <scrm-form-item itemLabel="内容" itemType="input" :itemInfo="viewInfo" itemKey="content" :editable="false" :isEllipsis="false"></scrm-form-item>

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
            this.$emit('cancel')
        },
        taskView(){
            this.$fetch.callCenter.activityView({'id': this.id}).then((res)=>{
              this.$handleResponse(res, res=>{
                this.viewInfo = res;
                this.viewInfo.areasName = [];
                res.areas.forEach(element => {
                  this.viewInfo.areasName.push(element.areaName)
                });
                this.viewInfo.areasLength = this.viewInfo.areasName.length;
              },true);
            }).catch(()=>{
              this.$store.commit('closeLoading');
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


