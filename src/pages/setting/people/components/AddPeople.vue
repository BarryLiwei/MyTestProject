<template>
    <el-dialog
      :title="title"
      class="add-people-dialog"
      :visible.sync="dialogVisible"
      width="550px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
        
        <el-form ref="form" label-width="120px" v-loading="loading">
            <el-form-item label="姓名:" :required="true" class="form_required_after">
                <el-input v-if="info.type == 0" v-model="formInfo.name" class="w-350" placeholder="自定义输入，最多可输入15个字符" :maxlength="15" size="small"></el-input>
                
                <el-select v-else v-model="formInfo.yecai" class="w-350" filterable @change="changePeople" size="small">
                    <el-option  v-for="(item, index) in nameList" :key="'name'+index" :value="item.id" :label="item.nickname"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="账号:" :required="true" class="form_required_after">
                <el-input v-model="formInfo.account" class="w-350" placeholder="自定义输入，最多可输入15个字符" :maxlength="15" :disabled="info.type==1" size="small"></el-input>
            </el-form-item>

            <el-form-item label="密码:" :required="true" class="form_required_after" v-if="info.type==0">
                <el-input  v-model="formInfo.password" class="w-350" placeholder="123456gqsm" size="small"></el-input>
            </el-form-item>

            <el-form-item label="电话号码:" :required="true" class="form_required_after" >
                <el-input type="number" oninput="if(value.length>11)value=value.slice(0,11)"  v-model.trim="formInfo.tel" :maxlength="11"  class="w-350" placeholder="请输入" :disabled="info.type==1" size="small"></el-input>
            </el-form-item>

            <el-form-item label="账号状态:" :required="true" class="form_required_after">
                <el-select v-model="formInfo.status" class="w-350" size="small">
                    <el-option  :value="0" :label="'启用'"></el-option>
                    <el-option  :value="1" :label="'禁用'"></el-option>
                </el-select>
            </el-form-item>

            <div v-for="(item, index) in formInfo.roles" :key="'sub'+index" class="role-wrap por">
                <el-form-item :label="`角色${index+1}:`" class="role-item" :required="index==0?true:false" :class="{'form_required_after':index==0?true:false}">
                    <el-select v-model="item.id" class="w-350" @change="roleChange" size="small">
                        <el-option v-for="(role,index) in item.options" :key="'role'+index" :value="role.id" :label="role.name" :disabled="role.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item :label="`管理范围${index+1}:`">
                    <el-select v-model="item.orgIds" multiple class="w-350">
                        <el-option v-for="(org,index) in info.orgList" :key="'org'+index" :value="org.id" :label="org.name"></el-option>
                    </el-select>
                </el-form-item> -->
                <div class="poa close-icon pointer" v-if="index" @click="deleteRole(index)"><i class="el-icon-error"></i></div>
            </div>
            <el-form-item label="">
                <el-button class="blue_font_white_bg" plain round icon="el-icon-plus" size="small" @click="addRole">增加角色</el-button>
            </el-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="small" class="w-90" @click="saveFn()" type="primary"> 保存 </el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        info:{  // 账号类型: 0自定义增加，1业财增加
            type: Object,
            default:()=>{
                return {}
            }
        }
    },
    data(){
        return{
            loading: false,
            dialogVisible: true,
            title: '自定义增入',  // 编辑用户
            formInfo: {
                name: '',
                account:'',
                password:'',
                tel:'',
                status:'',
                roles:[{id: '', options: []}],
            }, 
            nameList:[]
        }
    },
    created(){
        if(this.info.type == 1){
            this.title = '业财增入';
            this.getYecaiList();
        }
        // this.$set(this.formInfo.roles[0], 'options', this.$deepCopyContent(this.info.roleList))
        this.formInfo.roles[0].options = this.$deepCopyContent(this.info.roleList);
    },
    methods: {
        getYecaiList(){
            this.loading = true;
            this.$fetch.setting.yecaiAccounts({'pagination': 0}).then((res)=>{
                this.loading = false;
                this.$handleResponse(res, (data)=>{
                    this.nameList = this.$hasArrContent(data.list)?data.list:[];
                    this.nameObj = {};
                    this.nameList.forEach((item)=>{
                        this.nameObj[item.id] = item;
                    })
                },false)
            }).catch((err)=>{
                this.loading = false;
            })
        },
        cancel(){
            this.$emit('close', 'cancel')
        },
        getParams(){
            const { name, account, tel, status, roles } = this.formInfo;
            let ids = [];
            roles.forEach((item)=>{
                if(item.id !== ''){
                    ids.push(item.id)
                }
            });
            if(!this.$hasArrContent(roles) || (roles && !roles[0].id)){
                this.$message.error('第一个角色必填')
                return false;
            }
            
            let params = {
                name,
                account,
                tel,
                type: this.info.type,
                status,
                roleIds: ids,
            }
            // 账号状态:0启用，1禁用
            if(this.info.type == 0 && this.formInfo.password){  // 密码（type=0时必填） 账号类型:0自定义增加，1业财增加
                params['password'] = this.formInfo.password
            }
            return params;
        },
        saveFn(){
            let params = this.getParams();
            if(!params){
                return;
            }
            this.loading = true;
            this.$fetch.setting.accountCreate(params).then((res)=>{
                this.loading = false;
                this.$handleResponse(res, res=>{
                    this.$message.success('新增成功');
                    this.$emit('close', 'success')
                },true);
            }).catch(()=>{
                this.loading = false;
                this.$store.commit('closeLoading');
            })
        },
        addRole(){
            this.formInfo.roles.push({id: '', options: this.$deepCopyContent(this.info.roleList)});
            this.roleChange();
        },
        deleteRole(index){
            this.formInfo.roles.splice(index, 1);
            this.roleChange();
        },
        changePeople(val){
            let item = this.nameObj[val];
            this.formInfo.name = item.nickname;
            this.formInfo.account = item.account;
            this.formInfo.tel = item.tel;
        },
        roleChange(){
            this.selectId = [];
            this.formInfo.roles.forEach((item)=> {
                if(item.id){
                    this.selectId.push(item.id)
                }
            })
            this.formInfo.roles.forEach((sub)=>{
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
.add-people-dialog /deep/.el-dialog__body {
    padding: 20px 35px 20px 20px;
}

.add-people-dialog /deep/.el-dialog__footer {
    padding-bottom: 35px;
}


.add-people-dialog /deep/ .el-form-item {
    margin-bottom: 10px;
}
 
.role-wrap {
    // background: #f2f8fc;
    padding: 2px 0 2px;
}

.close-icon {
    right: 5px;
    top: 14px;
}
</style>

