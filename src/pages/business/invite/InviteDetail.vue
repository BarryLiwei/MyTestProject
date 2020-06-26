<template>
    <el-dialog
        title="邀约详情"
        class="invite-detail-dialog"
        :visible.sync="showDialog"
        width="540px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">

        <el-form ref="form" label-position="right" label-width="150px" class="m-t-20">
            <el-form-item label="客户ID"> {{ row.userId | filterBlank}} </el-form-item>
            <el-form-item label="客户姓名"> {{ row.nickname | filterBlank}} </el-form-item>
            <el-form-item label="手机号码"> {{ row.tel | filterBlank}} </el-form-item>
            <el-form-item label="跟进DCC"> {{ row.dccName | filterBlank}} </el-form-item>
            <el-form-item label="邀约门店"> {{ row.areaName | filterBlank}} </el-form-item>
            <el-form-item label="意向车型"> {{ row.model | filterBlank}} </el-form-item>
            <el-form-item label="下发时间"> {{ row.createdAt | filterBlank}} 分 </el-form-item>
            <el-form-item label="状态"> {{ row.statusName | filterBlank}} </el-form-item>
            <el-form-item label="预计到店时间"> {{ row.appointmentDate | filterBlank}} </el-form-item>
            <el-form-item label="实际到店时间"> {{ row.visitDate | filterBlank}} <span v-if="row.fromSecondName">- {{ row.fromSecondName}}</span></el-form-item>
            <el-form-item label="到店类别"> {{ row.areaName | filterBlank}} </el-form-item>
            <el-form-item label="销售顾问"> {{ row.advisorName | filterBlank}} </el-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="small"  type="primary" @click="seeArchive">潜客详情</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        row: {
            type: Object,
            default: ()=>{ return{} }
        }
    },
    data(){
        return{
          info: {}
        }
    },
    methods: {
        seeArchive(){
            this.$router.push({'path':'/business/potential/detail', query: {'id': this.row.intentionId}});
        },
        cancel(){
            this.$emit('cancel')
        }
    }
}
</script>

<style lang="scss" scoped>
.invite-detail-dialog /deep/.el-dialog__body {
    padding: 0 30px 15px;
}

.invite-detail-dialog /deep/ .el-dialog__footer {
    padding-bottom: 30px;
}

.el-form-item {
    margin-bottom: 4px;
}
</style>


