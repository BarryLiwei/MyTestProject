<template>
    <el-dialog
      title="角色详情"
      class="view-role-dialog"
      :visible.sync="dialogVisible"
      width="800px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">

        <el-form ref="form" label-width="110px">
            <el-form-item label="角色名称:">
                {{ info.name | filterBlank}}
            </el-form-item>

            <el-form-item label="角色描述:">
                {{ info.desc | filterBlank}}
            </el-form-item>

            <el-form-item label="权限:">
                <div class="box-wrap" v-show="permissionsList.length">
                    <div class="flex box-item" v-for="(item, index) in permissionsList" :key="'pow'+index">
                        <div class="w-90 p-l-10 box-left">{{ item.left }}</div>
                        <div class="flex-1 p-r-10 box-right">
                            <p class="box-right-p">{{ item.right }}</p></div>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="用户:">
                <el-table
                    class="user-table"
                    :data="userList"
                    :border="true"
                    max-height="360">
                    <el-table-column
                        prop="name"
                        label="用户姓名"
                        width="300"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="org"
                        label="管理范围"
                        align="center">
                        <template slot-scope="scope">
                          <span>{{scope.row.org | filterBlank }}</span>      
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="small" class="w-90" @click="cancel">关闭</el-button>
            <el-button round size="small" class="w-90" @click="editFn()" type="primary"> 编辑</el-button>
        </span>
    </el-dialog>
</template>

<script>
// 查看
export default {
    props: {
        info:{
            type: Object,
            default:()=>{
                return {}
            }
        }
    },
    data(){
        return{
            dialogVisible: true,
            permissionsList: [],
            userList:[]
        }
    },
    created(){
       this.getDetail(this.info.id);
       this.getUsers();
    },
    methods: {
        cancel(type){
            this.$emit('close', 'cancel')
        },
        editFn(){
           this.$router.push({path: '/setting/role-power/edit', query: { roleId: this.info.id}})
        },
        getDetail(id){
            this.$fetch.setting.roleInfo(id, {'expand':'permissions'}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.handleData(res.role.permissions);
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        handleData(permissions){
            if(this.$hasArrContent(permissions)){
                permissions.forEach((item)=>{
                    if(item.checked){
                        let rightValue = [];
                        if(this.$hasArrContent(item.child)){
                            item.child.forEach((sub)=>{
                                if(sub.checked){
                                    let childName = [];
                                    if(this.$hasArrContent(sub.child)){
                                        sub.child.forEach((child)=>{
                                            if(child.checked){
                                                childName.push(child.name)
                                            }
                                        })
                                    }
                                    if(this.$hasArrContent(childName)){
                                        rightValue.push(`${sub.name}(${childName.join(',')})`)
                                    }else {
                                        rightValue.push(sub.name)
                                    }
                                }
                                
                            })
                        }
                        this.permissionsList.push({ left: item.name, right: rightValue.join('、')})
                    }
                })
            }
        },
        getUsers(){ 
            this.$fetch.setting.queryAccountList({'expand': 'roles','roleId': this.info.id}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.handleUserData(res.list);
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        handleUserData(users){
            if(this.$hasArrContent(users)){
                users.forEach((item)=>{
                    let rightValue = [];
                    if(this.$hasArrContent(item.roles)){
                        item.roles.forEach((sub)=>{
                            if(['dcc_supervisor','dcc_inviter','dcc_group_leader'].indexOf(sub.role_key)==-1){
                                let orgArr=[];
                                if(sub.orgs && sub.orgs.length){
                                    sub.orgs.forEach((org)=>{
                                        orgArr.push(org.name)
                                    })

                                    rightValue.push(`${sub.name}(${orgArr.join('、')})`);
                                }else {
                                    rightValue.push(sub.name);
                                }
                            }
                        })
                    }
                    this.userList.push({ 'name': `${item.nickname?item.nickname:'--'}(${item.tel?item.tel:'--'})`, 'org': rightValue.join('、')})
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.view-role-dialog /deep/.el-dialog__body {
    padding: 20px 35px 20px 20px;
}

.view-role-dialog /deep/.el-dialog__footer {
    padding-bottom: 35px;
}

.view-role-dialog /deep/ .el-form-item {
    margin-bottom: 10px;
}

.box-wrap {
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
}
.box-item {
    font-size: 14px;
    color: #444;
    
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}
.box-left {
    height: 50px;
    line-height: 50px;
}

.box-right {
    display: flex;
    align-items: center;
}

.box-right-p {
    color: #9ba6b6;
    line-height: 25px;
    padding: 12px 0;
}


.user-table {
    width: 100%;
}
.el-table /deep/ .el-table__header .has-gutter tr th{
    height: 30px;
    line-height: 25px;
}

</style>

