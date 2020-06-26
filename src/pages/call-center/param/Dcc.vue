<template>
    <div class="param-dcc-setting m-20 common-box min-h-750">
        <div class="title line">DCC跟进规则设置</div>

        <div class="p-30">
            <div class="box-wrap">
                <div class="flex box-item" v-for="(item, index) in dccList" :key="index">
                    <div class="flex-1 box-required">{{ item.level }}级客户跟进间隔</div>
                    <div class="box-handle w-250">
                        <el-input-number v-model="item.daysInterval" :min="1" size="small"></el-input-number>
                        <span class="m-l-15">天</span>
                    </div>
                </div>
            </div>

            <div class="m-t-50">
                <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
                <el-button round size="small" class="w-90" @click="save" type="primary">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            dccList: []
        }
    },
    created(){
        this.queryData();
    },
    methods: {
        queryData(){
            this.$fetch.callCenter.dccSettingFollowRule({}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.dccList = res;
                    this.copyList = this.$deepCopyContent(res);
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        cancel(){
            this.dccList = this.$deepCopyContent(this.copyList);
        },
        save(){
            this.$fetch.callCenter.dccSettingSaveFollowRule(this.dccList).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('保存成功');
                    this.copyList = this.$deepCopyContent(this.dccList);
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
.box-wrap {
    width: 660px;
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
}

.box-item {
    font-size: 14px;
    color: #444;
    height: 65px;
    line-height: 65px;
    padding-left: 19px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

.box-required::after {
    content: '*';
    color: #F56C6C;
    margin-left: 4px;
    vertical-align: middle;
}
.box-handle /deep/ .el-input-number__decrease, 
.box-handle /deep/ .el-input-number__increase,
.box-handle /deep/ .el-input-number__decrease:hover, 
.box-handle /deep/ .el-input-number__increase:hover {
    background: #fff;
}
</style>


