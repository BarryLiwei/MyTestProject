<template>
    <div class="add-org-page m-20">
        <bread-crumb></bread-crumb>

        <div class="common-box p-b-20 m-t-20">
            <div class="group-title">上层组织: <span class="m-l-5">{{ parentData['parentName']?parentData['parentName']:'广汽集团'}}</span></div>

            <el-form class="m-t-20" ref="form" label-width="150px">
                <scrm-form-item 
                    :itemLabel="labelTitle" itemType="input"  :itemRequired="true" itemClass="form_required_after" 
                    :itemInfo="info" itemKey="name" subClass="w-350"  placeholder="限20个字符" :maxlength="20">
                </scrm-form-item>

                <el-form-item label="选择门店" >
                    <el-transfer
                      class="transfer-class"
                      filterable
                      filter-placeholder="请输入选项名称"
                      v-model="selectedAreas"
                      :data="dataAreas"
                      :titles="['待选选择：', '已选列表：']"
                      :props="transProps"
                    ></el-transfer>
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
            type: 'add', // 编辑类型
            parentData: {},   // 传进来的参数
            info: {
                name: '',
                id: '',
            },
            transProps: {
                key: 'id',
                label: 'short_name'
            },
            dataAreas: [], // 待选列表
            selectedAreas: [], // 已选
            labelTitle:'子组织名称',
        }
    },
    created(){
        this.parentData = this.$route.query;
        if(this.$route.path == '/setting/org-structure/edit'){
            // 编辑的时候，当前组织为当前，上一级组件
            this.type = 'edit';
            this.labelTitle = '当前组织名称'
            this.getDetialOrg(this.parentData.id);
        };

        this.getShopList(); // 获取左侧门店列表
    },
    methods: {
        cancel(){
            this.$router.push('/setting/org-structure');
        },
        getShopList(){ // 新建，编辑的时候左侧shop都调这个接口
            let params = {
                // page: 1,
                // pageSize: 3000,
                pagination: 0
            }
            let id = this.type=='edit'?this.parentData.id :this.parentData.parentId;
            params['mode'] = this.type=='edit'?'update':'add';
            this.$fetch.setting.queryOrgShopList(id, params).then(res => {
                this.$handleResponse(res, (data) => {
                    this.dataAreas= data.areas && data.areas.list; //表格所需数据
                },true);

                if(this.type=='edit'){
                    this.getRightShop();
                }
            }).catch(response => {
                this.$store.commit('closeLoading');
            });
        },
        getRightShop(){ // 右边的shop expand=brands&name=&orgId=1, 编辑才调
            let params={
                expand:'brands',
                orgId: this.parentData.id
            }
            this.$fetch.setting.queryAreasList(params).then((res)=>{
                this.$handleResponse(res, res => {
                    if(this.$hasArrContent(res.list)){
                        res.list.forEach((item)=>{
                            this.selectedAreas.push(item.id);
                            this.dataAreas.push(item); // 由于左边已经过滤掉重复的，所以需要新增进来
                        })
                    }
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        getDetialOrg(id){
            this.$fetch.setting.orgInfo(id,{}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.info = res.org;
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        addManager(){
            let params = this.getParams();
            if(!params){
                return;
            }
            this.type == 'add'? this.createFn(params): this.updateFn(params);
        },
        getParams(){
            let { areaIds, name} = this.info;
            let params = {
                areaIds: this.selectedAreas, 
                name,
                pid:  this.parentData.parentId
            }
            if(!name){
                this.$message.error('组织名称不能为空');
                return false;
            }
            return params;
        },
        createFn(params){
            this.$fetch.setting.orgCreate(params).then((res)=>{
                this.$handleResponse(res, res => {
                    this.$message.success('新增成功');
                    this.$router.push('/setting/org-structure');
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        updateFn(params){
            this.$fetch.setting.orgUpdate(this.parentData.id, params).then((res)=>{
                this.$handleResponse(res, res => {
                    this.$message.success('更新成功');
                    this.$router.push('/setting/org-structure');
                },true);
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        filterMethod(val){
            
        }
    }
}
</script>

<style lang="scss" scoped>
.group-title {
    color: #444;
    font-size: 16px;
    padding-left: 20px;
    font-weight: 600;
    height: 60px;
    line-height: 60px;
    background-color: #fafcff;
    border-bottom: solid 1px #eaebf0;
}

.add-org-page /deep/.transfer-class .el-transfer__button {
    display: block;
    margin: 0 auto 10px;
    padding: 10px;
    border-radius: 50%;
    color: #FFF;
    background-color: #409EFF;
    font-size: 0;
}

.add-org-page /deep/.transfer-class .el-transfer__button.is-disabled, 
.add-org-page /deep/.transfer-class .el-transfer__button.is-disabled:hover{
    border: 1px solid #DCDFE6;
    background-color: #F5F7FA;
    color: #C0C4CC;
}

.add-org-page /deep/.transfer-class .el-transfer-panel{
  width: 350px;
}
.add-org-page /deep/.transfer-class input.el-input__inner {
  width: 100%!important;
}

.add-org-page /deep/.transfer-class .el-transfer-panel__body{
  height: 286px;
}

.add-org-page /deep/ .el-transfer-panel__item {
    display: block;
}
</style>

