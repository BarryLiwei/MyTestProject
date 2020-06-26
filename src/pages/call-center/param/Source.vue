<template>
    <div class="param-source-setting m-20 common-box min-h-750">
       <div class="title line">线索/客户来源设置</div>

       <div class="p-30">
           <el-button round icon="el-icon-plus" size="small" type="primary" class="m-b-30 w-90" @click="addFn({})">新增</el-button>

           <div class="box-wrap">
                <el-tree
                    ref="tagTree"
                    :data="sourceList"
                    :props="defaultProps"
                    :default-expanded-keys="expandKeys"
                    node-key="id"
                    :expand-on-click-node="false"
                    @node-expand="nodeExpandFn"
                    @node-collapse="nodeCollapseFn"
                    icon-class="el-icon-arrow-right">
                    <div class="custom-tree-node flex-1 flex" slot-scope="{ node, data }">
                        <div class="flex-1 p-r-20" >{{ node.label }}</div>
                        <div class="w-300">
                            <el-switch
                              class="switch-scrm"
                              v-model="data.status"
                              @change="changeState(data)"
                              :disabled="data.isSystem?true:false"
                              active-text="ON"
                              inactive-text="OFF"
                            ></el-switch>
                        </div>
                        <div class="w-250">
                            <el-button type="text" @click="edit(data)" :disabled="data.isSystem?true:false">编辑</el-button>
                            <el-button type="text" class="btn-split" v-if="data.pid==0" @click="addFn(data)">新增二级来源</el-button>
                            <el-button type="text" class="btn-split" :class="{'red_font': !data.isSystem}" @click="deleteFn(data)" :disabled="data.isSystem?true:false">删除</el-button>
                        </div>
                    </div>
                </el-tree>
            </div>

       </div>

       <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="dialog.title"
            class="add-source-dialog"
            :visible.sync="dialog.show"
            width="470px"
            append-to-body
            :close-on-click-modal="false"
            :before-close="cancel">
            <el-form ref="form" label-width="80px">
                <scrm-form-item :itemLabel="dialog.label" itemType="input" subClass="w-100-percent" maxlength="16" placeholder="请输入内容，最多16个字符"
                    :itemInfo="dialog" :itemKey="'value'"></scrm-form-item>
            </el-form>

            <span slot="footer">
                <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
                <el-button round size="small" class="w-90" type="primary" @click="saveFn"> 确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    components: {
        ScrmFormItem
    },
    data(){
        return{
            sourceList: [],
            defaultProps: { // 默认属性需要这几个属性
                children: "children",
                label: "title",
            },
            dialog: { // 新增弹窗参数
                show: false, 
                title: '新增',
                label: '一级线索',
                value: '',
                row: {}, // 行的内容
            },
            expandKeys:[]
        }
    },
    created(){
        // this.initTestData();
        this.queryData();
    },
    methods: {
        initTestData(){
            this.sourceList = [
                {
                    name:"微信",
                    parent_id:0,
                    status:1,
                    id: 1,
                    showSub: true,
                    sub: [
                        {
                            name:"个人二维码地方嘎达",
                            parent_id:1,
                            id: 12,
                            status:0
                        },{
                            name:"客流二维码",
                            parent_id:1,
                            id: 13,
                            status:0
                        },{
                            name:"推广二维码",
                            parent_id:1,
                            status:0,
                            id: 14,
                        },
                    ]
                },{
                    name:"自行添加",
                    parent_id:0,
                    status:1,
                    id: 2,
                },
            ]
        },
        queryData(){
            this.$fetch.callCenter.clueFrom({}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.sourceList = res;
                    this.statusBoolean(this.sourceList);
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        statusBoolean(data){
            if(this.$hasArrContent(data)){
                data.forEach((item)=>{
                    item.status = item.status?true:false;
                    if(item.children){
                        this.statusBoolean(item.children)
                    }
                })
            }
        },
        addFn(item){
            this.dialog.title = '新增';
            this.dialog.value = '';
            this.dialog.label = item && item.id? "二级来源" : "一级来源";
            this.dialog.row = this.$deepCopyContent(item); // 二级要传id
            this.dialog.show = true;
        },
        edit(item){
            this.dialog.title = '编辑';
            this.dialog.value = item.title;
            this.dialog.label = !item.pid ? "一级来源" : "二级来源";
            this.dialog.row = this.$deepCopyContent(item);
            this.dialog.show = true;
        },
        saveFn(){
            if(!this.dialog.value){
                this.$message.error("请输入内容");
                return;
            }
            if(this.dialog.title == '新增'){
                this.$fetch.callCenter.createClueFrom({'title':this.dialog.value , 'pid': this.dialog.row.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.dialog.show = false;
                        this.$message.success('新增成功')
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            }else {
                this.$fetch.callCenter.updateClueFrom({'title':this.dialog.value , 'id': this.dialog.row.id}).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.dialog.show = false;
                        this.$message.success('编辑成功')
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            }
            
        },
        changeState(row){
            this.$fetch.callCenter.toggleClueFrom({'status':row.status?1:0 , 'id': row.id}).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.dialog.show = false;
                    this.$message.success('编辑成功')
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        deleteFn(item){
            let tip = `你确定要删除该${!item.pid?"一级":"二级"}来源吗`;
            this.$confirm(tip, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: "needCenterStyle",
                cancelButtonClass: "big cancel",
                confirmButtonClass: "big",
                roundButton: true,
            }).then(()=>{
                this.$fetch.callCenter.deleteClueFrom({'id': item.id }).then((res)=>{
                    this.$handleResponse(res, res=>{
                        this.$message.success('删除成功')
                        this.queryData();
                    },true);
                }).catch(()=>{
                    this.$store.commit('closeLoading');
                })
            })
        },
        cancel(){
            this.dialog.show = false;
        },
        nodeExpandFn(val){
            this.expandKeys.push(val.id);
        },
        nodeCollapseFn(val){
            this.expandKeys = this.expandKeys.filter(item => item != val.id);
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
    width: 950px;
}

.el-tree {
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
}

.el-tree /deep/ .el-icon-arrow-right {
    font-size: 14px;
    font-weight: 700;
    color: #606266;
    margin-left: 10px;
    margin-right: 5px
}
.el-tree /deep/ .el-icon-arrow-right.el-tree-node__expand-icon.is-leaf{
    color: transparent;
}

.el-tree /deep/ .el-tree-node__content {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}

.el-tree /deep/ .el-tree-node > .el-tree-node__children {
    background-color: #f3f8fc;
}

.add-source-dialog /deep/.el-dialog__body {
    padding: 40px 30px 0;
}

.add-source-dialog /deep/ .el-dialog__footer {
    padding-bottom: 30px;
}
</style>