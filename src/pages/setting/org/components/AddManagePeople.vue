<template>
    <el-dialog
      :title="title"
      class="add-man-people-dialog"
      :visible.sync="dialogVisible"
      width="510px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel" >
        <el-form ref="form" label-width="110px" v-loading="isLoading">
            <el-form-item label="当前组织" >
                {{ config.org && config.org.name }}
            </el-form-item>

            <scrm-form-item itemLabel="选择管理人员" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info" itemKey="adminId" :filterable="true"  :selectOptions="userOptions" :optionLabel="'nickname'" :optionValue="'id'" @change="changeUser" :disabled="userDisabled"></scrm-form-item>

            <scrm-form-item itemLabel="账号" itemType="input"  :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" 
                :itemInfo="info" itemKey="account" placeholder="请输入内容" disabled>
            </scrm-form-item>

            <scrm-form-item itemLabel="角色" itemType="select" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="请选择"
                :itemInfo="info" itemKey="roleId" :filterable="true" :selectOptions="roleOptions" :optionLabel="'name'" :optionValue="'id'" ></scrm-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="small" class="w-90" @click="addManager" type="primary" :disabled="isLoading">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    props: {
        config: {
            type: Object,
            default: ()=>{ 
                return {
                type: 'add',
                data: {}
                }
            }
        }
    },
    components: {
        ScrmFormItem
    },
    data(){
        return{
            title: '新增管理人员',
            dialogVisible: true,
            info:{
                adminId: '',
                account: '',
                roleId: ''
            },
            userOptions:[], // 管理人员下拉列表
            roleOptions:[], // 角色下拉列表
            isLoading: false
        }
    },
    created(){
        if(this.config.type == 'edit'){
            this.title = '编辑管理人员';
            const {id, account, orgRole} = this.config.data;
            this.info.adminId = id;
            this.info.account = account;
            this.info.roleId = orgRole && orgRole.id;
        }
        this.userObj = {};
        this.getAdminsList();
    },
    computed:{
        userDisabled(){
            return this.config.type == 'edit'?true:false
        }
    },
    methods: {
        getAdmins(){ // 此接口被getAdminsList代替了，后续不用可以删掉
            let params1 = { // 获取当前组织下绑定的管理人员
                expand: 'orgRole',
                orgId: this.config.org && this.config.org.id,
                pagination: 0,
            }
            let params2 = { // 获取过滤掉dcc的管理人员
                expand:'roles',
                filterRoleKey:'dcc',
                pagination: 0, 
            }
            this.isLoading=true; 
            Promise.all([this.$fetch.setting.queryAccountList(params1, false, false), this.$fetch.setting.queryAccountList(params2, false, false)]).then(
                (res)=> {
                    this.isLoading=false; 
                    
                    // 从过滤掉的dcc管理人员中再过滤当前组织下已绑定的管理人员
                    let bindIds = [];
                    this.$handleResponse(res[0], data => {
                        if(data && data.list && data.list.length){
                            data.list.forEach((item)=>{
                                if(this.config.type == 'edit' &&  item.id !== this.config.data.id){ // 编辑的话，不需要过滤自己
                                    bindIds.push(item.id)
                                }else if(this.config.type == 'add'){
                                    bindIds.push(item.id)
                                }
                            })
                        }
                    },false);
                    
                    this.$handleResponse(res[1], data => {
                        let admins = this.$hasArrContent(data.list)?data.list:[];
                        let filterAdmins = []; 
                        if(this.$hasArrContent(bindIds)){ // 有值，需要过滤
                            admins.forEach((item)=>{
                                if(bindIds.indexOf(item.id)==-1){
                                    filterAdmins.push(item);
                                    this.userObj[item.id] = item;
                                }
                            })
                        }
                        this.userOptions = filterAdmins;
                        if(this.config.type == 'edit'){
                            this.roleOptions = this.$hasArrContent(this.userObj[this.config.data.id].roles)?this.userObj[this.config.data.id].roles:[]
                        }
                    },false);
                }
            ).catch(()=>{ 
                this.isLoading=false; 
                this.$store.commit('closeLoading');
            });
        },
        getAdminsList(){
            let params = { 
                expand:'roles',
                // filterRoleKey:'dcc',
                pagination: 0, 
            }
            this.isLoading=true; 
            this.$fetch.setting.queryAccountList(params, false, false).then((res)=>{
                this.isLoading=false; 
                this.$handleResponse(res, data => {
                    this.userOptions = this.$hasArrContent(data.list)?data.list:[];
                    this.userOptions.forEach((item)=>{
                        this.userObj[item.id] = item;
                    })
                    if(this.config.type == 'edit'){
                        this.roleOptions = this.$hasArrContent(this.userObj[this.config.data.id].roles)?this.userObj[this.config.data.id].roles:[];
                        this.roleOptions = this.roleOptions.filter((item)=>{ return ['dcc_inviter','dcc_supervisor','dcc_group_leader'].indexOf(item.role_key) == -1})
                    }
                },false);
            }).catch((err)=>{
                this.isLoading=false; 
                this.$store.commit('closeLoading');
            })
        },
        getParams(){
            let { adminId, roleId} = this.info;
            let params = {
                // orgId: this.config.org.id, // 组织id
                adminId,  // 用户id
                roleId,  // 角色id
            }
            if(!adminId){
                this.$message.error('管理人员不能为空');
                return false;
            }
            if(!roleId){
                this.$message.error('角色不能为空');
                return false;
            }
            return params;
        },
        addManager(){
            let params = this.getParams();
            if(!params){
                return;
            }
            this.config.type == 'add'? this.createFn(params): this.updateFn(params);
        },
        createFn(params){
            this.isLoading = true;
            this.$fetch.setting.adminCreate(this.config.org.id, params).then((res)=>{
                this.isLoading = false;
                this.$handleResponse(res, res => {
                    this.$message.success('新增成功');
                    this.$emit('close', 'success')
                },true);
            }).catch((err)=>{
                this.isLoading = false;
                this.$store.commit('closeLoading');
            })
        },
        updateFn(params){
            this.isLoading = true;
            this.$fetch.setting.adminUpdate(this.config.org.id,this.info.adminId, params).then((res)=>{
                this.isLoading = false;
                this.$handleResponse(res, res => {
                    this.$message.success('更新成功');
                    this.$emit('close', 'success')
                },true);
            }).catch((err)=>{
                this.isLoading = false;
                this.$store.commit('closeLoading');
            })
        },
        cancel(){
            this.$emit('close','cancel')
        },
        changeUser(val){
            this.info.account = this.userObj[val].account;
            this.info.roleId = '';
            this.roleOptions = this.$hasArrContent(this.userObj[val].roles)?this.userObj[val].roles:[]; 
            this.roleOptions = this.roleOptions.filter((item)=>{ return ['dcc_inviter','dcc_supervisor','dcc_group_leader'].indexOf(item.role_key) == -1}); // 前端过滤dcc相关角色
        }
    }
}
</script>

<style lang="scss" scoped>
.add-man-people-dialog /deep/.el-dialog__body {
    padding: 20px 35px 0 20px;
}

.add-man-people-dialog /deep/.el-dialog__footer {
    padding-bottom: 37px;
}

.el-form-item {
    margin-bottom: 13px;
}
</style>


