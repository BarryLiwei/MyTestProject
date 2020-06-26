<template>
    <el-dialog
      :title="title"
      class="add-talk-task-dialog"
      :visible.sync="dialogVisible"
      width="650px"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
        <el-form ref="form" label-width="110px" v-loading="loading">
            <scrm-form-item :itemInfo="info" itemKey="time" itemLabel="有效期" :itemRequired="true" itemClass="form_required_after"  class="form-task-time" 
                itemType="datePicker" subClass="w-400" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="checked"
                :picker-options="{
                    disabledDate: time => {
                        return time < new Date(this.minTime).getTime();
                    },
                }"></scrm-form-item>

            <scrm-form-item  :itemInfo="info"  itemKey="type" itemLabel="活动类型"  :itemRequired="true"  itemClass="form_required_after"  
                itemType="select"  subClass="w-400" placeholder="请选择" :filterable="true" :selectOptions="optionsInfo.type"  :optionLabel="'title'" :optionValue="'id'" @change="typeChange()"></scrm-form-item>

            <scrm-form-item v-show="info.type == 3" :itemInfo="info" itemKey="brandId" itemLabel="适用品牌"  :itemRequired="true"  itemClass="form_required_after"  
                itemType="select"  subClass="w-400" placeholder="请选择" :filterable="true" :selectOptions="optionsInfo.brand"  :optionLabel="'title'" :optionValue="'id'"></scrm-form-item>

            <scrm-form-item v-show="info.type == 4" :itemInfo="info" itemKey="areaId" itemLabel="适用门店"  :itemRequired="true"  itemClass="form_required_after"  
                itemType="select" multiple  subClass="w-400" placeholder="请选择" :filterable="true" :selectOptions="optionsInfo.area"  :optionLabel="'title'" :optionValue="'id'"></scrm-form-item>

            <scrm-form-item v-if="info.type" :itemInfo="info"  itemKey="title" itemLabel="活动标题"  :itemRequired="true"  itemClass="form_required_after" 
                itemType="input"  subClass="w-400" maxlength="20"  placeholder="20个字符以内">
            </scrm-form-item>

            <scrm-form-item v-if="info.type" :itemInfo="info"  itemKey="content" itemLabel="内容"  :itemRequired="true"  itemClass="form_required_after" 
                itemType="input" type="textarea" :autosize="{ minRows: 4}" subClass="w-400" maxlength="500"  placeholder="请输入活动内容" show-word-limit>
            </scrm-form-item>
        </el-form>

      <span slot="footer">
        <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
        <el-button round size="small" class="w-90" @click="addFn" type="primary">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import ScrmFormItem from '@/components/form/ScrmFormItem'
import moment from 'moment'
export default {
    props: {
        rowInfo: {
            type: Object,
            default: ()=>{ 
                return {}
            }
        }
    },
    components: {
        ScrmFormItem
    },
    data(){
        return{
            loading: false,
            dialogVisible: true,
            title: '新增活动',
            type: 'add',
            info:{
                type: '',
                brandId: '',
                areaId: [],
                title: '',
                content: '',
                time: [],    // "endDate": "2020-08-01 12:00"  过期时间，没有过期时间传0
            },
            checked: false,
            optionsInfo: {
                type: [],
                brand: [],
                area: []
            },
            minTime:moment(new Date()).subtract(1, 'day'),
        }
    },
    created(){
        if(Object.keys(this.rowInfo).length){
            this.title = '编辑活动';
            this.type = 'edit';
            this.taskView();
        }
        this.initTypeOptions();
    },
    methods: {
        initTypeOptions(){
            this.optionsInfo.type = [
                {
                    "id": 2,
                    "title": "集团活动"
                },
                {
                    "id": 3,
                    "title": "品牌活动"
                },
                {
                    "id": 4,
                    "title": "其他活动"
                }
            ]
        },
        taskView(){
            this.$fetch.callCenter.activityView({'id': this.rowInfo.id}).then((res)=>{
                this.$handleResponse(res, res => {
                    let result = res;
                    this.info.type = result.activityType;
                    if(result.endDate){
                        this.info.time.length = 0;
                        this.info.time.push(result.startDate);
                        this.info.time.push(result.endDate);
                    }
                    this.typeChange();
                    this.info.areaId = [];
                    result.areas.forEach(element => {
                        this.info.areaId.push(element.id)
                    });
                    this.info.brandId = result.brandId;
                    this.info.title = result.title;
                    this.info.content = result.content;

                    
                },true);
            }).catch(()=>{
                this.$store.commit("closeLoading");
            })
        },
        cancel(){
            this.$emit('close', 'cancel');
        },
        getParmam(){
            const { type, brandId, areaId, title, content, time} = this.info;
            if(!time.length){
                this.$message.error('有效期未填写，请完成填写再提交')
                return false;
            }
            if(!type){
                this.$message.error('活动类型未填写，请完成填写再提交')
                return false;
            }
            if(type && type == 3 && !brandId){
                this.$message.error('品牌未填写，请完成填写再提交')
                return false;
            }
            if(type && type == 4 && !areaId.length){
                this.$message.error('适用门店未填写，请完成填写再提交')
                return false;
            }
            if(!title){
                this.$message.error('活动标题未填写，请完成填写再提交')
                return false;
            }
            if(!content){
                this.$message.error('内容未填写，请完成填写再提交')
                return false;
            }
            
            let params = {
                type: type,       // 活动类型
                title: title,      // 标题
                content: content,      // 内容
                startDate: time && time[0],
                endDate: time && time[1]
            }
            if(params.type == 3){
                params.brandId = brandId;
            }else if(params.type == 4){
                params.areaId = areaId;
            }
            return params;
        },
        addFn(){
            let params = this.getParmam();
            if(params){
                if(this.type == 'add'){
                    this.$fetch.callCenter.activityCreate(params).then((res)=>{
                        this.$handleResponse(res, res => {
                            this.$message.success('新增成功');
                            this.$emit('close', 'success')
                        },true);
                    }).catch(()=>{ this.$store.commit("closeLoading");})
                }else {
                    params['id'] = this.rowInfo.id;
                    this.$fetch.callCenter.activityUpdate(params).then((res)=>{
                        this.$handleResponse(res, res => {
                            this.$message.success('编辑成功');
                            this.$emit('close', 'success')
                        },true);
                    }).catch(()=>{ this.$store.commit("closeLoading");})
                }
            }
        },
        typeChange(){
            if(this.info.type == 3){
                this.initBrandOptions();
            }else if(this.info.type == 4){
                this.initAreaOptions();
            }
        },
        initBrandOptions(){
            this.$fetch.common.carBrand({}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.optionsInfo.brand = res;
                },true);
            }).catch(()=>{
                this.$store.commit("closeLoading");
            })
        },
        initAreaOptions(){
            this.$fetch.common.commonAreaList({}).then((res)=>{
                this.$handleResponse(res, res => {
                    this.optionsInfo.area = res;
                },true);
            }).catch(()=>{
                this.$store.commit("closeLoading");
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.add-talk-task-dialog /deep/.el-dialog__body {
    padding: 25px 35px 0 20px;
}

.add-talk-task-dialog /deep/.el-dialog__footer {
    padding-bottom: 37px;
}

.form-task-time.el-form-item {
    // margin-bottom: 5px;
}
.el-form-item,
.form-task-limit.el-form-item {
    margin-bottom: 10px;
}
.w-60 {
    width: 60px;
}

.span-icon {
    display: inline-block;
    width: 38px;
    height: 38px;
    cursor: pointer;
    vertical-align: middle;
}

</style>

<style>
.add-talk-task-dialog /deep/.form-task-time /deep/.el-input__inner {
    width: 400px;
}
</style>

