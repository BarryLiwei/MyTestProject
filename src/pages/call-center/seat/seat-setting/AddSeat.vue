<template>
    <el-dialog
        :title="title"
        class="add-seat-dialog"
        :visible.sync="dialogVisible"
        width="550px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">
        <el-form ref="form" label-width="120px" v-loading="loading">
            <scrm-form-item itemLabel="姓名" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="form" itemKey="dccId" :filterable="true"  :selectOptions="userOptions" :optionLabel="'nickname'" :optionValue="'id'" @change="dccChange"></scrm-form-item>

            <scrm-form-item itemLabel="手机号" itemType="input" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="form" itemKey="dccTel" :disabled="true"></scrm-form-item>

            <el-form-item label="角色" :required="true" class="form_required_after">
                {{ form.roleName | filterBlank }}
            </el-form-item>
            
            <scrm-form-item itemLabel="绑定坐席号码" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="form" itemKey="seatId" :filterable="true"  :selectOptions="seatOptions" :optionLabel="'tel'" :optionValue="'id'"></scrm-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="small" class="w-90" @click="addFn" type="primary" :disabled="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
// 添加坐席和添加DCC共用一个组件
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    props: {
        rowItem: {
            type: Object,
            default: ()=>{ return {}
            }
        }
    },
    components: {
        ScrmFormItem
    },
    data(){
        return{
            loading:false,
            dialogVisible: true,
            title: '添加坐席',
            seatOptions: [],
            form: {
                dccId: '',
                dccTel: '',
                seatId: '',
                roleName: '',
            },
            userOptions: [],
        }
    },
    created(){
        if(this.rowItem.type == 'edit'){
            this.title = '编辑坐席';
            let row = this.rowItem.row;
            this.form.id = row.id;
            this.form.dccId = row.dccId;
            this.form.dccTel = row.dccTel;
            this.form.roleName = row.roleName; 
            this.form.seatId = row.seatNumberId; // 坐席号码id
        }
        this.initAdd()
    },
    methods: {
        initAdd(){
            const { type, row } = this.rowItem;
            this.$fetch.callCenter.initFormSeat().then((res)=>{
                this.$handleResponse(res, (res)=>{
                    this.seatOptions = this.$hasArrContent(res.seatNumber)?res.seatNumber:[];
                    if(type == 'edit'){ // 由于用掉的列表就不会返回来，所有不需要过滤
                        this.seatOptions.unshift({'id': row.seatNumberId, 'tel': row.seatTel?row.seatTel:'--'})
                    }
                },true)
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
            
            this.getUserList();
        },
        getUserList(){ 
            this.loading=true;
            this.$fetch.callCenter.seatDccSelectList().then((res)=>{
                this.loading=false;
                this.$handleResponse(res, data => {
                    let arr = this.$hasArrContent(data)?data:[];
                    const { type ,row } = this.rowItem;
                    if(type == 'edit'){
                        if(!this.checkOptionsHasId(row.dccId, arr, 'id')){
                           this.userOptions.push({'id':row.dccId, "nickname":row.dccName?row.dccName:'--', 'tel':row.dccTel, 'roleName': row.roleName});
                        }
                    }
                    this.userOptions = this.userOptions.concat(arr);
                    this.userObj = {};
                    if(this.userOptions && this.userOptions.length){
                        this.userOptions.forEach((item)=>{
                            this.userObj[item.id] = item;
                        })
                    }
                },false)
            }).catch((err)=>{
                this.loading=false;
            })
        },
        checkOptionsHasId(id, option, key){
            let isHas = false;
            if(id > -1){ 
                for(let i=0;i< option.length; i++){
                    if(option[i][key] == id){
                        isHas = true;
                        break;
                    }
                }
            }
            return isHas
        },
        dccChange(){
            this.form.dccTel = this.userObj[this.form.dccId].tel;
            this.form.roleName = this.userObj[this.form.dccId].roleName;
        },
        getParams(){
            const { dccId, seatId, id } = this.form;
            if(!dccId){
                this.$message.error('DCC邀约员不为空');
                return false
            }
            if(!seatId){
                this.$message.error('绑定坐席号码不为空');
                return false
            }
            return {'dccId': dccId, 'seatNumberId': seatId , id};
        },
        addFn(){
            let params = this.getParams();
            if(!params){
                return;
            }
            this.loading = true;
            let fn = this.rowItem.type == 'add'?'createSeat': 'updateSeat';
            this.$fetch.callCenter[fn](params).then((res)=>{
                this.loading = false;
                this.$handleResponse(res, res=>{
                    this.$message.success(`${this.rowItem.type == 'add'?'新增':'编辑'}成功`)
                    this.$emit('close', 'success')
                },true);
            }).catch(()=>{
                this.loading = false;
                this.$store.commit('closeLoading');
            })
        },
        cancel(){
            this.$emit('close', 'cancel')
        },
    }
}
</script>

<style lang="scss" scoped>
.add-seat-dialog /deep/.el-dialog__body {
    margin-top: 8px;
    padding: 35px 40px 20px 20px;
}

.add-seat-dialog /deep/.el-dialog__footer {
    padding: 0 0 30px;
}

.el-form-item {
    margin-bottom: 15px;
}
.el-form-item /deep/.el-form-item__label{
    padding-right: 20px;
}

</style>


