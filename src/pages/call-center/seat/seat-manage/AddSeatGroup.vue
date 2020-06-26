<template>
    <div class="add-seat-page">
        <bread-crumb class="m-20 common-box"></bread-crumb>

        <div class="m-20 common-box p-20 add-seat-content" :style="{'min-height': minH + 'px'}">
            <el-form ref="form" class="add-seat-form m-t-10" label-width="180px">
                <scrm-form-item itemLabel="坐席组名称" itemType="input" :itemRequired="true" itemClass="form_required_after" subClass="w-100-percent" placeholder="20个字符以内"
                    :itemInfo="form" itemKey="title" maxlength="20"></scrm-form-item>

                <scrm-form-item itemLabel="负责人" :itemRequired="true" itemClass="form_required_after">
                    <template slot="custom">
                        <select-dialog key="dcc" btnName="选择DCC组长" :isMultiple="false" :configs="dccGroupConfig" ></select-dialog>
                    </template>
                </scrm-form-item>

                <scrm-form-item itemLabel="服务门店" :itemRequired="true" itemClass="form_required_after">
                    <template slot="custom">
                        <transfer key="shop" size="small" :configs="shopList" btnName="添加4S店" :transProps="transProps" optionKey="title"></transfer>
                    </template>
                </scrm-form-item>

                <scrm-form-item itemLabel="DCC邀约员" :itemRequired="true" itemClass="form_required_after">
                    <template slot="custom">
                        <select-dialog key="invite" :btnName="'添加DCC邀约员'" multiple collapse-tags :configs="dccConfig"></select-dialog>
                    </template>
                </scrm-form-item>

                <scrm-form-item class="m-t-30">
                    <template slot="custom">
                        <el-button round size="small" class="w-90" @click="cancelFn">取 消</el-button>
                        <el-button round size="small" class="w-90" type="primary" @click="saveFn">确 定</el-button>
                    </template>
                </scrm-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
// 新增坐席组页面
import BreadCrumb from '@/components/bread/BreadCrumb'
import ScrmFormItem from '@/components/form/ScrmFormItem'
import Transfer from '@/components/transfer/Transfer'
import SelectDialog from './component/SelectDialog';
export default {
    components: {
       BreadCrumb,
       ScrmFormItem,
       Transfer,
       SelectDialog
    },
    data(){
        return{
            minH: 500,
            shopList: {
                unSelectOptions:[],
                selectedOptions:[]
            },
            dccGroupConfig: {
                title: '选择DCC组长', // 弹窗的标题
                label: 'DCC组长', // 弹窗的左侧标题
                selectOptions:[],
                // isDccDialog: false,
                optionLabel:'nickname',
                optionValue:'id',
                itemInfo: {'leaderId': ''},
                itemKey: 'leaderId'
            },
            dccConfig: {
                title: '添加DCC邀约员', // 弹窗的标题
                label: 'DCC邀约员', // 弹窗的左侧标题
                selectOptions:[],
                isCheckRemove:true,
                isDccDialog: true,
                optionLabel:'nickname',
                optionValue:'id',
                itemInfo: {'dcc':[]},
                itemKey: 'dcc'
            },
            form: {
                title: ''
            }
        }
    },
    created(){
        this.initData();
        this.getUsers();
        
        if(this.$route.path == '/call/seat/seat-manage/edit'){
            this.editId = this.$route.query.id;
            this.type='edit';
            this.getViewInfo();
        }
        
    },
    mounted(){
        this.$nextTick(()=>{
            this.minH = document.body.clientHeight - 200;
        })
    },
    methods: {
        initData(){
            this.transProps = {key: 'id', label: 'title'}
            this.$fetch.callCenter.areaSelectList({}).then((res)=>{
                this.$handleResponse(res, (res)=>{
                   this.shopList.unSelectOptions = res;
                },true)
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        getUsers(){ 
            this.$fetch.setting.queryAccountList({'pagination':0, 'roleKey':'dcc_group_leader'}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.dccGroupConfig.selectOptions = this.$hasArrContent(res.list)?res.list:[];
                    this.checkGroupLeader(); // 编辑的时候判断
                },true)
            }).catch((err)=>{
                this.$store.commit('closeLoading');
            })
        },
        getViewInfo(){
            this.$fetch.callCenter.viewGroup({'id': this.editId}).then((res)=>{
                this.$handleResponse(res, (res)=>{
                    this.form.title = res.title;
                    this.dccGroupConfig.itemInfo.leaderId = res.leaderId;  //坐席组长
                    if(this.$hasArrContent(res.areas)){ // 门店列表
                        res.areas.forEach((item)=>{
                            this.shopList.selectedOptions.push({'id': item.id, 'title': item.areaName});
                            this.shopList.unSelectOptions.push({'id': item.id, 'title': item.areaName})
                        })
                    }
                    if(this.$hasArrContent(res.dccs)){ // dcc邀约员
                        let ids = [];
                        let arr = []
                        res.dccs.forEach((item)=>{
                            ids.push(item.dccId);
                            arr.push({'id': item.dccId ,"nickname": item.dccName?item.dccName:'--'})
                        })
                        this.dccConfig.itemInfo.dcc = ids;
                        this.dccConfig.selectOptions = arr;
                    }
                    this.checkGroupLeader(); // 编辑的时候判断
                },true)
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        checkGroupLeader(){
            let { leaderId, leaderName} = this.dccGroupConfig.itemInfo;
            if(this.type=='edit' && leaderId > -1){
                let isHas = false;
                if(this.$hasArrContent(this.dccGroupConfig.selectOptions)){
                    for(let i=0; i<this.dccGroupConfig.selectOptions.length; i++){
                        if(this.dccGroupConfig.selectOptions[i].id == leaderId){
                            isHas = true;
                            break;
                        }
                    }
                }
                if(!isHas){
                    this.dccGroupConfig.selectOptions.unshift({'id': leaderId,"nickname":leaderName?leaderName:'--'})
                }
            }
        },
        getParams(){
            if(!this.form.title){
                this.$message.error('坐席组名称不为空');
                return false
            }
            let dccLeaderId = this.dccGroupConfig.itemInfo.leaderId;
            if(!dccLeaderId){
                this.$message.error('负责人不为空');
                return false
            }

            let areaId = [];
            if(this.$hasArrContent(this.shopList.selectedOptions)){
                this.shopList.selectedOptions.forEach((item)=>{
                    areaId.push(item.id)
                })
            }
            
            if(!this.$hasArrContent(areaId)){
                this.$message.error('服务门店不为空');
                return false
            }

            let dccId = this.dccConfig.itemInfo.dcc;

            let params = {
                title: this.form.title,
                leaderId: dccLeaderId,
                area: areaId,
                dccId: dccId,
                id: this.editId
            }
            return params;
        },
        saveFn(){
            let params = this.getParams();
            if(!params){
                return;
            }
            let fn = this.editId ? 'updateSeatGroup': 'createGroupSeat';
            this.$fetch.callCenter[fn](params).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success(`${this.editId ?'编辑':'新增'}成功`)
                    this.$router.push('/call/seat/seat-manage')
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        cancelFn(){
            this.$router.push('/call/seat/seat-manage');
        },
    }
}
</script>

<style lang="scss" scoped>
.add-seat-form {
    width: 540px;
}
</style>


