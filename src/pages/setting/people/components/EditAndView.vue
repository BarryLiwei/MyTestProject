<template>
    <el-dialog
      :title="title"
      class="edit-people-dialog"
      :visible.sync="dialogVisible"
      width="550px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
        <div v-show="dialogType == 'edit'" class='edit-form' v-loading="loading">
            <!-- editInfo.type  账号类型:0自定义增加，1业财增加  判断是业财还是自定义 -->
            <el-form ref="form" label-width="120px">
                <el-form-item label="账号:">
                    {{ editInfo.account | filterBlank}}
                </el-form-item>

                <el-form-item label="姓名:">
                    <el-input v-if="editInfo.type==0" v-model="editInfo.nickname" class="w-350" size="small"></el-input>
                    <span   v-else>{{ editInfo.nickname }}</span>
                </el-form-item>

                <el-form-item label="重置密码:" v-if="editInfo.type==0">
                    <el-input  v-model="editInfo.password" class="w-350" size="small"></el-input>
                </el-form-item>

                <el-form-item label="手机号:">
                    <el-input v-if="editInfo.type == 0" type="number" oninput="if(value.length>11)value=value.slice(0,11)"  v-model.trim="editInfo.tel" class="w-350" size="small"></el-input>
                    <span   v-else>{{ editInfo.tel }}</span>
                </el-form-item>

                <el-form-item label="账号状态:" :required="true" class="form_required_after">
                    <el-select v-model="editInfo.status" class="w-350" size="small">
                        <el-option  :value="0" :label="'启用'"></el-option>
                        <el-option  :value="1" :label="'禁用'"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户类型:" >
                   {{ editInfo.type == 0?'自定义增入': '业财增入' }}
                </el-form-item>

                <div v-for="(item, index) in editInfo.roles" :key="'sub'+index" class="role-wrap por">
                    <el-form-item :label="`角色${index+1}:`" class="role-item" :required="index==0?true:false" :class="{'form_required_after':index==0?true:false}">
                        <el-select v-model="item.id" class="w-350" @change="roleChange" size="small">
                            <el-option v-for="(role,index) in item.options" :key="'role'+index" :value="role.id" :label="role.name" :disabled="role.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="poa close-icon pointer" v-if="index" @click="deleteRole(index)"><i class="el-icon-error"></i></div>
                </div>

                <el-form-item label="" >
                    <el-button class="blue_font_white_bg" plain round icon="el-icon-plus" size="small" @click="addRole">增加角色</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-show="dialogType == 'view'" class="view-form">
            <el-form ref="form" label-width="155px">
                <el-form-item label="增入时间:">
                    {{ info.data.createdDate | filterBlank}}
                </el-form-item>

                <el-form-item label="姓名:">
                    {{ info.data.nickname | filterBlank}}
                </el-form-item>

                <el-form-item label="账号:">
                    {{ info.data.account | filterBlank}}
                </el-form-item>

                <el-form-item label="账号状态:">
                    <span :class="{'success': info.data.status==0}">{{ info.data.status==0?"启用":'禁用'}}</span>
                </el-form-item>

                <div v-for="(item, index) in info.data.roles" :key="'sub'+index" class="role-wrap-view por">
                    <el-form-item :label="`角色${index+1}:`" class="role-item">
                         {{ item.name | filterBlank}}
                    </el-form-item>
                    <el-form-item :label="`管理范围${index+1}:`">
                        <p :class="{'p-text': index>0}" v-for="(subItem, index) in item.orgs" :key="'orgs'+index"> {{ subItem.name | filterBlank}}</p>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <span slot="footer">
            <el-button round size="small" class="w-90" @click="cancel('1')">取 消</el-button>
            <el-button round size="small" class="w-90" @click="editFn()" type="primary" v-show="dialogType== 'view'"> 编辑</el-button>
            <el-button round size="small" class="w-90" @click="saveFn()" type="primary" v-show="dialogType== 'edit'"> 保存 </el-button>
        </span>
    </el-dialog>
</template>

<script>
// 编辑和查看， 新增有业财和自定义新增，所以分开写
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    props: {
        info:{
            type: Object,
            default:()=>{
                return {}
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
            title: '编辑用户',  // 编辑用户
            dialogType: 'edit',
            editInfo: {}, // 编辑的，放在取消编辑变回查看的时候还原数据
        }
    },
    created(){
        this.dialogType = this.info.type;
        if(this.info.type == 'view'){
            this.title = '用户详情';
        }else {
            this.editFn();
        }
    },
    methods: {
        cancel(type){
            if(this.info.type == 'view' && this.dialogType == 'edit' && type=="1"){ // type 表示右上角的关闭
                this.dialogType = 'view';
                this.title="用户详情";
                return;
            }
            this.$emit('close', 'cancel')
        },
        editFn(){
            this.title = "编辑用户";
            this.dialogType = 'edit';
            this.editInfo = this.$deepCopyContent(this.info.data); // 赋给编辑
            if(this.$hasArrContent(this.editInfo.roles)){
                this.editInfo.roles.forEach((item)=>{
                    item['options'] = this.$deepCopyContent(this.info.roleList);
                })
                this.roleChange();
            }else {
                this.editInfo.roles =[]
            }
        },
        getParams(){
            const { nickname,account,tel,type,status, id, roles } = this.editInfo;
            let roleId = [];
            if(this.$hasArrContent(roles)){
                roles.forEach((item)=>{
                    if(item.id !== ''){
                        roleId.push(item.id)
                    }
                });
            }
            if(!this.$hasArrContent(roles) || (roles && !roles[0].id)){
                this.$message.error('第一个角色必填')
                return false;
            }
            let params = {
                name: nickname,
                account,
                tel,
                type,
                status,
                roleIds: roleId,
                // adminId: id,
            }
            // 账号状态:0启用，1禁用
            if(this.editInfo.type == 0){  // 密码（type=0时必填） 账号类型:0自定义增加，1业财增加
                params['password'] = this.editInfo.password
            }
            return params;
        },
        saveFn(){
            let params = this.getParams();
            if(!params){
                return;
            }
            this.loading = true;
            this.$fetch.setting.accountUpdate(this.editInfo.id,params).then((res)=>{
                this.loading = false;
                this.$handleResponse(res, res=>{
                    this.checkMySelf(params.roleIds);
                    this.$emit('close', 'success');
                },true);
            }).catch(()=>{
                this.loading = false;
                this.$store.commit('closeLoading');
            })
        },
        checkMySelf(roleList){
            let roleInfo=JSON.parse(localStorage.getItem('roleInfo')); // 需要的信息就存
            if(roleInfo && roleInfo.id > -1 && roleInfo.id == this.info.data.id){
                // 编辑的是自己的账号
                let currentRoleId = roleInfo && roleInfo.currentRole && roleInfo.currentRole.id;
                let isExist = false;
                for(let i=0; i< roleList.length; i++){
                    if(currentRoleId > -1 && currentRoleId == roleList[i]){
                        isExist= true;
                        break;
                    }
                }
                if(isExist){ // 没有删除当前登录角色
                    this.$eventHub.$emit("editMySelf", true, 'people')
                    this.$message.success('编辑成功');
                }else { // 删除了当前登录的角色
                    this.$eventHub.$emit("editMySelf", false, 'people')
                }
            }
        },
        getDetail(id){
            // 由于列表的单条数据跟请求的结果是一致的，所以直接取列表的数据，减少请求，当后续不满足的情况后再换到单条请求
            this.$fetch.setting.accountInfo(id,{}).then((res)=>{
                this.$handleResponse(res, res=>{},true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        addRole(){
            this.editInfo.roles.push({id: '', options: this.$deepCopyContent(this.info.roleList)});
            this.roleChange();
        },
        deleteRole(index){
            this.editInfo.roles.splice(index, 1);
            this.roleChange();
        },
        roleChange(){
            this.selectId = [];
            this.editInfo.roles.forEach((item)=> {
                if(item.id){
                    this.selectId.push(item.id)
                }
            })
            this.editInfo.roles.forEach((sub)=>{
                sub.options.forEach((child)=>{
                    if(this.selectId.includes(child.id) && child.id != sub.id){
                        child['disabled'] = true;
                    }else {
                        child['disabled'] = false;
                    }
                })
            })
            this.$forceUpdate();
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-people-dialog /deep/.el-dialog__body {
    padding: 20px 35px 20px 20px;
}

.edit-people-dialog /deep/.el-dialog__footer {
    padding-bottom: 35px;
}

.edit-people-dialog .view-form /deep/  .el-form-item {
    margin-bottom: 0;
}

.edit-people-dialog .edit-form /deep/ .el-form-item {
    margin-bottom: 10px;
}
.p-text {
    height: 27px;
    line-height: 27px;
}

.success {
    color: #34b572;
}
 
.role-wrap {
    // background: #f2f8fc;
    padding: 2px 0 2px;
}

.role-wrap-view {
    background: #f2f8fc;
    padding: 2px 0 2px;
}

.close-icon {
    right: 5px;
    top: 13px;
}
</style>

