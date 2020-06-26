<template>
    <div class="param-defeat-setting m-20 common-box min-h-750">
        <div class="title line">战败原因设置</div>

        <div class="defeat-content">
            <tabs-scrm :tabs="tabs" @change="changeTab" :tabStyle="{'height':'4px', 'line':'bottom'}"></tabs-scrm>
            
            <el-button round icon="el-icon-plus" size="small" type="primary" class="m-b-20 w-100" @click="addReason">新增</el-button>

            <div class="box-wrap">
                <div class="flex box-item" v-for="(item, index) in defeatList" :key="index">
                    <div class="flex-1 p-r-20">{{ item.title }}</div>
                    <div class="flex-1"> <el-switch class='switch-scrm' v-model="item.status" active-text="ON" inactive-text="OFF" @change="changeStatue(item)"></el-switch></div>
                    <div class="w-100"> <el-button type="text" class="red_font" @click="deleteFn(item)">删除</el-button> </div>
                </div>
            </div>
        </div>

        <!-- 新增按钮 -->
        <el-dialog
            title="新增"
            class="add-defeat-dialog"
            :visible.sync="dialog.show"
            width="540px"
            append-to-body
            :close-on-click-modal="false"
            :before-close="cancel">
            <el-form ref="form" label-width="130px">
                <scrm-form-item :itemLabel="dialog.label" itemType="input" subClass="w-100-percent" maxlength="20" placeholder="请输入内容，20个字符以内"
                    :itemInfo="dialog" :itemKey="'value'"></scrm-form-item>
            </el-form>

            <span slot="footer">
                <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
                <el-button round size="small" class="w-90" type="primary" @click="createdFn"> 确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TabsScrm from '@/components/TabsScrm'
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    components: {
        TabsScrm,
        ScrmFormItem
    },
    data(){
        return{
            tabs: [{'title': '同品牌战败设置', "name": '1'},{'title': '他品牌战败设置', "name": '2'},{'title': '取消计划原因设置', "name": '3'}],
            activedTab: 1,
            defeatList: [],
            dialog: { // 新增弹窗参数
                show: false, 
                label: '同品牌战败原因',
                value: ''
            }
        }
    },
    created(){
        this.queryData();
    },
    methods: {
        queryData(){
            this.$fetch.callCenter.defeatReason({'type': this.activedTab}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.defeatList = this.$hasArrContent(res)?res:[];
                    this.defeatList.forEach((item)=>{
                        item.status = item.status==1?true:false;
                    })
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        changeTab(item){
            this.activedTab = item;
            this.queryData();
        },
        addReason(){
            if(this.activedTab == 1){
                this.dialog.label = "同品牌战败原因";
            }else if(this.activedTab == 2){
                this.dialog.label = "他品牌战败原因";
            }else if(this.activedTab == 3){
                this.dialog.label = "取消计划原因";
            }
            this.dialog.value = '';
            this.dialog.show = true;
        },
        cancel(){
            this.dialog.show = false;
        },
        createdFn(){
            if(!this.dialog.value){
                this.$message.error("请输入内容");
                return;
            }
            this.$fetch.callCenter.createDefeatReason({'title':this.dialog.value , 'type': this.activedTab}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.dialog.show = false;
                    this.$message.success('新增成功')
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        deleteFn(item){
            this.$confirm("您确定要删除该战败原因吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(() => {
                this.$fetch.callCenter.deleteDefeatReason({'id': item.id }).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功')
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        changeStatue(item){
            this.$fetch.callCenter.updateDefeatReason({'status':item.status?1:0, 'id': item.id}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('更新成功')
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    color: #444;
    font-size: 20px;
    font-family: PingFang-SC-Medium;
    background-color: #fafcff
}
.defeat-content {
    padding: 15px 30px;
}
.param-defeat-setting /deep/ .tabs__scrm .el-tabs--card>.el-tabs__header {
    background: #fff;
}

.param-defeat-setting /deep/ .tabs__scrm .el-tabs--card .el-tabs__item {
    border-left: none;
    font-size: 15px;
    padding: 0 12px;
}

.box-wrap {
    width: 800px;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
}
.box-item {
    font-size: 14px;
    color: #444;
    height: 60px;
    line-height: 60px;
    padding-left: 19px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

.add-defeat-dialog /deep/.el-dialog__body {
    padding: 40px 30px 0;
}

.add-defeat-dialog /deep/ .el-dialog__footer {
    padding-bottom: 30px;
}
</style>