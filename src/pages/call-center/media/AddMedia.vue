<template>
    <el-dialog
        :title="title"
        class="add-media-dialog"
        :visible.sync="dialogVisible"
        width="870px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">
        <!-- 新增/编辑 -->
        <div v-if="!showView" v-loading="loading">
            <el-form ref="form" label-width="80px">
                <scrm-form-item itemLabel="门店" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-250" placeholder="请选择门店"
                    :itemInfo="media"  itemKey="id" :filterable="true"  :selectOptions="shopOptions" :optionLabel="'title'" :optionValue="'id'" 
                    :editable="dialogType=='add'?true:false" :isTransfer="true" @change="changeArea"></scrm-form-item>

                <scrm-form-item itemLabel="垂媒账号" class="add-item" :itemRequired="true" itemClass="form_required_after" :itemInfo="{}">
                    <template slot="custom">
                        <el-button type="primary" icon="el-icon-plus" round size="small"  class="m-b-20" @click="addCount">新增垂媒账号</el-button>
                    </template>
                </scrm-form-item>
            </el-form>

            <el-form ref="form" label-width="80px">
                <table class="custom-table" width="100%" cellpadding="0" cellspacing="0"  border="0">
                    <tr class="tr-item" v-for="(item, index) in mediaTable" :key="index">
                        <td class="td-item" width="30%">
                            <scrm-form-item :itemLabel="`垂媒${index+1}`" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择垂媒"
                            :itemInfo="item" itemKey="type" :filterable="true"  :selectOptions="item.options" :optionLabel="'text'" :optionValue="'val'" @change="selectChange(item)"></scrm-form-item>
                        </td>
                        <td class="td-item" width="30%">
                            <scrm-form-item itemLabel="账号" itemType="input" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请输入"
                            :itemInfo="item" itemKey="account_name"></scrm-form-item>
                        </td>
                        <td class="td-item" width="30%">
                            <scrm-form-item itemLabel="密码" itemType="input" type="password" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请输入"
                            :itemInfo="item" itemKey="account_pwd"></scrm-form-item>
                        </td>
                        <td class="td-item" width="10%">
                            <i class="el-icon-delete m-l-15 pointer" v-if="index" @click="deleteFn(index)"></i>
                        </td>
                    </tr>
                </table>
            </el-form>
        </div>

        <!-- 查看详情 -->
        <div v-if="showView" class="view">
            <h3 class="title m-b-20">{{ info.short_name | filterBlank }}</h3>
            
            <el-table :data="media.account" style="width: 100%" border>
                <el-table-column prop="type_text" label="垂媒" align="center">
                    <template slot-scope="scope">
                        <div class="media-wrap">
                            <span class="dot" :class="[scope.row.status ==1?'green':'red']"></span>
                            {{ scope.row.type_text }}
                        </div>
                    </template> 
                </el-table-column>
                <el-table-column prop="account_name" label="账号" align="center"></el-table-column>
                <el-table-column prop="account_pwd" label="密码" align="center">
                    <template slot-scope="scope" >
                        <span style="font-size:20px;font-weight:700;">{{ scope.row.account_pwd | changePwd |filterBlank }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <span slot="footer">
            <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="small" class="w-90" @click="addFn" type="primary"> {{ btnName }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ScrmFormItem from '@/components/form/ScrmFormItem'
import { addArrToOptions } from '@/utils/util' 
export default {
    components: {
        ScrmFormItem
    },
    props: {
        info: { // 传进来行
            type: Object,
            default: ()=>{ return {}}
        },
        type: {
            type: String,
            default: 'add'
        },
        shopList: { // 门店下拉列表
            type: Array,
            default: ()=>{ return []}
        },
        mediaOptions: { // 垂媒下拉列表
            type:Array,
            default: ()=>{return []}
        }
    },
    data(){
        return{
            dialogVisible: true,
            showView: false, // 查看的时候显示， 新增和编辑不显示
            title: '新增垂媒账号',   // 新增垂媒账号   查看详情，  编辑
            media: {
                id: ''
            }, // 页面的元素
            dialogType: '',
            mediaTable: [{'type_text': '', 'type':'', 'id': '', 'account_name': '', 'account_pwd':'','options':[]}],
            selectId: [], // 已经选中了的下拉置灰
            loading: false,
            shopOptions: [], // 下拉列表
        }
    },
    created(){
        this.dialogType = this.type;
        if(this.type == 'add'){
            this.title="新增垂媒账号";
            this.shopOptions = this.$deepCopyContent(this.shopList);
            if(this.shopOptions && this.shopOptions.length){ // 选择第一家门店
                this.info['short_name'] = this.shopOptions[0].short_name;
                this.info['shopId'] = this.shopOptions[0].id;
            }
            this.mediaTable[0]['options'] = this.$deepCopyContent(this.mediaOptions);
        }else if(this.type == 'view'){
            this.showView = true;
            this.title = '查看详情';
            this.media = this.$deepCopyContent(this.info);
        }
    },
    computed:{
        btnName:function(){
            return this.dialogType=='add'?'确定':this.dialogType=='view'?'编辑':'保存'
        }
    },
    methods: {
        addFn(){
            // 校验和新增的门店搜索没做
            if(this.dialogType == "view"){
                this.dialogType = 'edit';
                this.showView = false;
                this.title = '编辑';
                this.mediaTable = this.$deepCopyContent(this.media.account);
                if(this.mediaTable.length){
                    this.mediaTable.forEach((item)=>{
                        this.$set(item, 'options', this.$deepCopyContent(this.mediaOptions))
                    })
                    this.selectChange();
                }
                
                this.shopOptions = this.$deepCopyContent(this.shopList); 
                this.shopOptions = addArrToOptions([this.info],'id', 'short_name', this.shopOptions,'id','title'); // 下拉框增加已删除的值
                return;
            }
            // 没有新增接口，共用编辑接口 
            this.updateMedia();
        },
        getParams(){
            let arr = [];
            if(this.mediaTable.length){
                for(let i=0, length=this.mediaTable.length; i<length; i++){
                    // if(!this.mediaTable[i].type){
                    //     this.$message.error(`请选择垂媒${i+1}的类型`)
                    //     return false
                    // }
                    // if(!this.mediaTable[i].account_name){
                    //     this.$message.error(`请输入垂媒${i+1}的账号`)
                    //     return false
                    // }
                    // if(!this.mediaTable[i].account_pwd){
                    //     this.$message.error(`请输入垂媒${i+1}的密码`)
                    //     return false
                    // }
                    arr.push({'id':this.mediaTable[i].id, 'type': this.mediaTable[i].type, 'account_name': this.mediaTable[i].account_name, 'account_pwd': this.mediaTable[i].account_pwd})
                }
            }
            let params = {
                area_id: this.media.id,      // 门店id
                accounts: arr,        // 垂媒账号类型 1懂车帝 2太平洋 3易车 4汽车之家'
            }
            return params;
        },
        updateMedia(){
            let that = this;
            let params = this.getParams();
            this.loading=true;
            this.$fetch.callCenter.mediaAccountEdit(params).then((res)=>{
                this.loading=false;
                this.$handleResponse(res, res=>{
                    this.$message.success(`${this.dialogType == "add"?'新增':'编辑'}成功`);
                    this.$emit('close', 'success')
                },true);
            }).catch(()=>{
                this.loading=false;
                this.$store.commit('closeLoading');
            })
        },
        cancel(){
            if(this.dialogType == 'edit'){
                this.dialogType = 'view';
                this.title = '查看详情';
                this.showView = true;
                this.media = this.$deepCopyContent(this.info);
                return;
            }
            this.$emit('close', 'cancel')
        },
        addCount(){
            let params = {
                'type_text': '', 
                'type':'', 'id': '', 
                'account_name': '', 
                'account_pwd':'', 
                'options': this.$deepCopyContent(this.mediaOptions)
            };
            this.mediaTable.push(params);
            this.selectChange();
        },
        selectChange(){
            this.getSelectId();
            this.checkDisabled();
        },
        getSelectId(){
            this.selectId = [];
            this.mediaTable.forEach((item)=>{
                if(item.type){
                    this.selectId.push(item.type)
                }
            })
        },
        checkDisabled(){
            if(this.$hasArrContent(this.selectId) && this.$hasArrContent(this.mediaTable)){ // 判断selectId 和mediaTable数组长度都存在
                this.mediaTable.forEach((item)=>{
                    if(item.options && item.options.length){
                        item.options = this.$deepCopyContent(this.mediaOptions); // 重新置空之前下拉选项
                        this.contrast(item);
                    }
                })
            }
        },
        contrast(media){
            this.selectId && this.selectId.forEach((item)=>{
                for(let i=0; i< media.options.length; i++){
                    if(item != media.id && item == media.options[i].val){
                        media.options[i]['disabled'] = true;
                        break;
                    }
                }
            })
        },
        deleteFn(index){
            this.mediaTable.splice(index, 1);
            this.selectChange(); // 获取最新的不点点击事件
        },
        changeArea(id){
            this.loading=true;
            this.$fetch.callCenter.getAccountByArea({'id':id}).then((res)=>{
                this.loading=false;
                this.$handleResponse(res, (data)=>{
                    this.mediaTable = this.$hasArrContent(data)?data:[];
                    if(this.mediaTable.length){
                        this.mediaTable.forEach((item)=>{
                            this.$set(item, 'options', this.$deepCopyContent(this.mediaOptions))
                        })
                        this.selectChange();
                    }
                },false)                
            }).catch(()=>{
                this.loading=false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.add-media-dialog /deep/.el-dialog__body {
    margin-top: 8px;
    padding: 25px 30px 33px;
    min-height: 250px;
}

.add-media-dialog /deep/.el-dialog__footer {
    padding: 10px 0 30px;
}

.el-form-item {
    margin-bottom: 15px;
}
.el-form-item.add-item{
    margin-bottom: 0;
}
.el-form-item /deep/.el-form-item__label{
    padding-right: 20px;
}

.view .title {
    // font-family: PingFang-SC-Bold;
	font-size: 18px;
    color: #444;
}

.media-wrap {
    display:inline-block;
    margin-right: 15px;
}
.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
}
.red {
    background-color: #ea5a54;
}
.green {
    background-color: #34b572;
}

.custom-table {
    border-left: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
}
.custom-table .tr-item {
    height: 75px;
    line-height: 75px;
} 

.custom-table .td-item {
    border-right: 1px solid #EBEEF5;
    border-top: 1px solid #EBEEF5;
    padding: 0 20px 0 0;
} 

.custom-table .tr-item .el-form-item {
    margin-bottom: 0;
}
.el-icon-delete {
    color: #3d7eff;
    font-size: 20px;
}
</style>


