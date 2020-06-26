<template>
    <div class="add-role-page m-20">
        <bread-crumb></bread-crumb>

        <div class="common-box p-b-20 m-t-20">
            <el-form class="m-t-30" ref="form" label-width="180px">
                <scrm-form-item 
                    itemLabel="角色名称" itemType="input"  :itemRequired="true" itemClass="form_required_after" 
                    :itemInfo="info" itemKey="name" subClass="w-350"  placeholder="限20个字符" :maxlength="20">
                </scrm-form-item>

                <scrm-form-item 
                    itemLabel="角色描述" itemType="input" type="textarea" rows="5" show-word-limit  
                    subClass="w-350"  placeholder="限50个字符" :maxlength="50"
                    :itemInfo="info" itemKey="desc">
                </scrm-form-item>

                <div class="line m-t-30 m-b-30"></div>

                <el-form-item label="权限" :required="true" class="form_required_after">
                    <el-tree class="add-role-tree" :data="roleNodes" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" 
                        ref="tree" :props="roleProps" >
                    </el-tree>
                </el-form-item>
            
                <el-form-item label="" class="m-t-50">
                    <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
                    <el-button round size="small" class="w-90" @click="addManager" type="primary">保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import BreadCrumb from '@/components/bread/BreadCrumb';
import ScrmFormItem from '@/components/form/ScrmFormItem'
export default {
    components: {
       BreadCrumb,
       ScrmFormItem,
    },
    data(){
        return{
            info: {
                name: '',
                desc: ''
            },
            roleNodes:[],
            roleProps: {
                children: 'child',
                label: 'name',
                disabled: 'disabled'
            },
        }
    },
    created(){
        this.type = 'add';
        if(this.$route.path == '/setting/role-power/edit'){
            this.type = 'edit';
            this.roleId = this.$route.query.roleId;
        }
        this.getAllNode().then(()=>{ // 先获取所有的节点
            if(this.type == 'edit'){ // 编辑的时候才查询
                this.getDetail(this.roleId);
            }
        })
    },
    methods:{
        async getAllNode(){ // 获取所有权限
            let result = await this.$fetch.setting.rolePermissions(); // 接口改变为对象，联调时后端需要改回来数组形式
            this.$store.commit('closeLoading');
            this.$handleResponse(result, res => {
                this.roleNodes = res.tree;
                if(this.$hasArrContent(this.roleNodes)){
                    for(let i=0; i<this.roleNodes.length; i++){
                        if(this.roleNodes[i].name == '工作台'){
                            this.roleNodes[i]['disabled'] = true;
                            this.roleNodes[i].child.forEach((item)=>{
                                item['disabled'] = true;
                            })
                        }
                    }
                }
            },true);
        },
        getDetail(id){
            this.$fetch.setting.roleInfo(id,{'expand':'permissions'}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.info = res.role;
                    // 让编辑的内容选择
                    this.$refs.tree.setCheckedKeys(this.getCheckedKey(res.role.permissions));
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        getCheckedKey(list){ // 选中的keys
            let keys=[];
            if(this.$hasArrContent(list)){
                list.forEach((item)=>{
                    if(this.$hasArrContent(item.child)){
                        item.child.forEach((subItem)=>{ 
                            if(this.$hasArrContent(subItem.child)){ // 最多三层菜单
                                subItem.child.forEach((childItem)=>{
                                    if(childItem.checked){
                                        keys.push(childItem.id)
                                    }
                                })
                            }else {
                                if(subItem.checked){
                                    keys.push(subItem.id);
                                }
                            }
                        })
                    }else {
                        if(item.checked){
                            keys.push(item.id);
                        }
                    }
                })
            }
            return keys;
        },
        cancel(){
            this.$router.push('/setting/role-power');
        },
        addManager(){
            let params = this.getParams();
            if(!params){
                return;
            }
            this.type == 'add'? this.createFn(params): this.updateFn(params);
        },
        getParams(){
            let { name, desc} = this.info;
            if(!name){
                this.$message.error('角色名称不能为空');
                return false;
            }

            const treeNode = this.$refs.tree.getCheckedNodes(); // 选中的权限信息
            if(treeNode.length === 0 ){
              this.$message.error('请至少选择一项权限');
              return false;
            }
            let ids = [];
            treeNode.forEach((item)=>{
                ids.push(item.id)
            })

            ids = ids.concat(this.$refs.tree.getHalfCheckedKeys());

            let params = {
                name, 
                desc,
                permissionIds:ids
            }
            return params;
        },
        createFn(params){
            this.$fetch.setting.roleCreate(params).then((res)=>{
                this.$handleResponse(res, res => {
                    this.$message.success('新增成功');
                    this.$router.push('/setting/role-power');
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        updateFn(params){
            params['roleId'] = this.roleId;
            this.$fetch.setting.roleUpdate(this.roleId,params).then((res)=>{
                this.$handleResponse(res, res => {
                    this.checkedIsCurrentRole();
                    this.$message.success('更新成功');
                    this.$router.push('/setting/role-power');
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        checkedIsCurrentRole(){ // 检查如果是编辑自己的当前的角色，重新获取一下权限菜单更新
            let roleInfo=JSON.parse(localStorage.getItem('roleInfo')); // 需要的信息就存
            let currentRoleId = roleInfo && roleInfo.currentRole && roleInfo.currentRole.id;
            if(currentRoleId > -1 && currentRoleId == this.roleId){
                this.$eventHub.$emit("editMySelf", true, 'role')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.el-tree {
    width: 500px;
    border: 1px solid #eaebf0;
    border-bottom: none;
}

.el-tree /deep/ .el-tree-node__content {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
}
</style>

<style>
.add-role-tree.el-tree > div {
    border-bottom: 1px solid #eaebf0;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>


