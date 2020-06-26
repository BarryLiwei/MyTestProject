<template>
    <el-dialog
      :title="title"
      class="add-seat-dialog"
      :visible.sync="dialogVisible"
      width="520px"
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancel">
      <el-form ref="form" label-width="110px" v-loading="loading">
            <!--  scrm-form-item 上设置的属性会进入到 scrm-form-item里面的子组件editCell上设置的 -->
            <scrm-form-item 
                :itemLabel="dialogConfig.label"
                itemType="select" 
                :filterable="true" 
                :selectOptions="dialogConfig.selectOptions" 
                :optionLabel="dialogConfig.optionLabel"
                :optionValue="dialogConfig.optionValue"
                :itemInfo="dialogConfig.itemInfo"
                :itemKey="dialogConfig.itemKey"
                @change="changeTag"
                v-bind="$attrs" 
                v-on="$listeners"></scrm-form-item>
            <el-form-item 
            ></el-form-item>
      </el-form>

      <span slot="footer">
        <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
        <el-button round size="small" class="w-90" @click="addFn" type="primary">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
// 添加坐席和添加DCC共用一个组件
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    props: {
        title: {
            type: String,
            default: '添加坐席'
        },
        config: {
            type: Object,
            default: {
                label: '坐席',
                selectOptions:[],
                optionLabel:'',
                optionValue:'',
                itemInfo: {},
                itemKey: 'name',
                isCheckRemove: true, // 是否需要检测删除的判断
            }
        },
        isDccDialog: {
            type: Boolean,
            default: false
        }
    },
    components: {
        ScrmFormItem
    },
    data(){
        return{
            dialogVisible: true,
            dialogConfig: {},
            loading: false
        }
    },
    created(){
        this.copyArr = []; 
        this.dialogConfig = this.$deepCopyContent(this.config); // 弹窗出现的时候，列表数据已经获取到了
        if(this.dialogConfig.isCheckRemove){
            let val = this.dialogConfig.itemInfo[this.dialogConfig.itemKey];
            this.dialogConfig['copyDcc'] = val ? this.$deepCopyContent(val): []; // 目前先处理多选的，单选以后用到再补充
            this.copyArr = val ? this.$deepCopyContent(val): [];
        }

        // 此方法是添加Dcc邀约员需要获取下拉列表, 添加坐席组添加DCC组长弹窗不需要(坐席组的数据从父元素传进来)
        if(this.isDccDialog){ 
            this.getSelectList();
        }
    },
    methods: {
        addFn(){
            Object.assign(this.config, this.dialogConfig)
            this.$emit('close', 'success')
        },
        cancel(){
            this.$emit('close','cancel')
        },
        getSelectList(){
            this.loading=true;
            // 已经添加的dcc邀约员，下拉列表没有值，每次接口下拉返回来都变化，因此不缓存
            this.$fetch.callCenter.dccSelectList({'page': 1, 'pageSize': 10000}).then((res)=>{
                this.loading=false;
                this.$handleResponse(res, (data)=>{
                    let arr = this.$hasArrContent(data)?data:[]; 
                    this.checkSelectOptions(arr);
                }, false)
            }).catch(()=>{
                this.loading=false;
            })
        },
        checkSelectOptions(arr){
            let ids=[];
            if(this.$hasArrContent(this.dialogConfig.selectOptions)){ // 获取从父元素的值
                this.dialogConfig.selectOptions.forEach((item)=>{
                    ids.push(item[this.dialogConfig.optionValue])
                })
            }
            if(this.$hasArrContent(ids) && this.$hasArrContent(arr)){ // 接口和父元素都有值，需要过滤
                arr.forEach((sub)=>{
                    if(ids.indexOf(sub[this.dialogConfig.optionValue])==-1){
                        this.dialogConfig.selectOptions.push(sub)
                    }
                })
            }else{
                this.dialogConfig.selectOptions = this.dialogConfig.selectOptions.concat(arr);
            }
        },
        changeTag(val){
            if(!this.dialogConfig.isCheckRemove){ // 删除时要判断的的才进来
                return;
            }

            if(this.copyArr.length <= val.length){ // 增加的时候不需要检验
                this.copyArr = this.$deepCopyContent(val);
                return;
            }

            // 取消的时候执行
            let checkVal = this.copyArr.filter(function (item) { return val.indexOf(item) === -1 }); // 取差集
            if(!this.dialogConfig['copyDcc'].includes(checkVal[0])){ // 在初始化的数据中不包含的，就是新增
                this.copyArr = this.$deepCopyContent(val);
                return;
            }
            
            // 取消且需要校验的邀约员
            this.loading = true;
            this.$fetch.callCenter.checkDccUnbind({'dccId': checkVal[0]}).then((res)=>{
                this.loading = false;
                this.$handleResponse(res, (res)=>{                                    
                    if(res.result == 0){ // 接口返回来不可删 0为不可移出  1 可移出
                        this.$message.error(res.msg)
                        this.dialogConfig.itemInfo[this.dialogConfig.itemKey] = this.$deepCopyContent(this.copyArr);
                    }else {
                        // 接口返回来可以删
                        this.copyArr = this.$deepCopyContent(val);
                        for(let i=0, length=this.dialogConfig.copyDcc.length; i<length; i++){
                            if(this.dialogConfig.copyDcc[i] == checkVal[0]){
                                this.dialogConfig.copyDcc.splice(i, 1);
                                return;
                            }
                        } 
                    }
                },true)
            }).catch((err)=>{
                this.loading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.add-seat-dialog /deep/.el-dialog__body {
    margin-top: 8px;
    padding: 35px 35px 20px 10px;
}

.add-seat-dialog /deep/.el-dialog__footer {
    padding-bottom: 34px;
}

.el-form-item {
    margin-bottom: 5px;
}
.el-form-item /deep/.el-form-item__label{
    padding-right: 20px;
}

</style>


