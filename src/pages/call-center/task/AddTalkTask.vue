<template>
    <el-dialog
      :title="title"
      class="add-talk-task-dialog"
      :visible.sync="dialogVisible"
      custom-class="dialog-width"
      appentToBody
      :close-on-click-modal="false"
      :before-close="cancel">
        <el-form ref="form" label-width="110px" v-loading="loading">
            <scrm-form-item  :itemInfo="info"  itemKey="scenario" itemLabel="适用场景"  :itemRequired="true"  itemClass="form_required_after"  
                itemType="select"  subClass="w-350" placeholder="请选择" :filterable="true" :selectOptions="optionsInfo.scenarios"  :optionLabel="'title'" :optionValue="'id'"></scrm-form-item>

            <scrm-form-item  :itemInfo="info"  itemKey="title" itemLabel="任务名称"  :itemRequired="true"  itemClass="form_required_after" 
                itemType="input"  subClass="w-350" maxlength="20"  placeholder="20个字符以内">
            </scrm-form-item>

            <scrm-form-item :itemInfo="{}" itemLabel="任务内容" :itemRequired="true" itemClass="form_required_after" subClass="w-350">
                <template slot="custom">
                    <el-button class="blue_font_white_bg w-60"  plain round size="mini" @click="addContent"><i class="el-icon-plus"></i></el-button>
                </template>
            </scrm-form-item>

            <div v-for="(item,index) in  info.content" :key="index">
                <scrm-form-item :itemLabel="`任务${index+1}`" :itemInfo="item" itemKey="title"  itemType="input"  :itemRequired="true" itemClass="form_required_after" subClass="w-350"  maxlength="30" placeholder="30个字符以内">
                    <template slot="lineHander">
                        <span class="span-icon icon-down" v-show="index != (info.content.length -1) && info.content.length > 1" @click="downBtn(index)"></span>
                        <span class="span-icon icon-up" v-show="index > 0 && info.content.length > 1" @click="upBtn(index)"></span>
                        <span class="span-icon icon-delete" v-show="index > 0 && info.content.length > 1" @click="deleteBtn(index)"></span>
                    </template>
                </scrm-form-item>
            </div>

            <scrm-form-item :itemInfo="info" itemKey="dccGroup" itemLabel="适用坐席组"  :itemRequired="true" itemClass="form_required_after" 
                itemType="select"  :filterable="true"  multiple  collapse-tags :selectOptions="optionsInfo.dccGroup" :optionLabel="'title'" :optionValue="'id'" 
                subClass="w-350"   :selectIsAll='true'  placeholder="请选择" @change="changeGroup"></scrm-form-item>


            <el-form-item label="任务开始时间" :required="true" class="form_required_after form-task-time" style="margin-bottom: 22px;">
                <el-date-picker
                    v-model="info.startDate"
                    type="datetime"
                    size="small"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    :default-time="defaultStartDate"
                    @focus="dataFocus()"
                    :picker-options="{
                    disabledDate: time => {
                            return time < new Date(Date.now()-1 * 24 * 3600 * 1000).getTime();
                        },
                    }">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="任务结束时间" :required="true" class="form_required_after form-task-time">
                <el-date-picker
                    v-model="info.endDate"
                    type="datetime"
                    size="small"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    default-time="23:59:59"
                    :disabled="checked"
                    :picker-options="{
                    disabledDate: time => {
                            return time < new Date(Date.now()-1 * 24 * 3600 * 1000).getTime();
                        },
                    }">
                </el-date-picker>
            </el-form-item>

            <scrm-form-item :itemInfo="{}" class="form-task-limit">
                <template slot="custom">
                    <el-checkbox v-model="checked" @change="limitTimechange">长期有效</el-checkbox>
                </template>
            </scrm-form-item>
        </el-form>

        <span slot="footer">
            <el-button round size="small"  class="w-90" @click="cancel">取 消</el-button>
            <el-button round size="small"  class="w-90" @click="addFn" type="primary">保 存</el-button>
            <el-button round size="small"  @click="addFn('online')" type="primary">保存并上架</el-button>
        </span>
    </el-dialog>
</template>

<script>
// 此组件为开口任务新增和编辑，另外组件写查看，都放在一块会觉得拥挤，不好维护
import ScrmFormItem from '@/components/form/ScrmFormItem'
import moment from 'moment';
import { removeDeleteArr, chagneMultipleSelect } from '@/utils/util'
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
            title: '新增开口任务',
            type: 'add',
            info:{
                scenario:'',
                title:'',
                content: [{'title': ""}],
                dccGroup: [],
                startDate: '',
                endDate: '', // "endDate": "2020-08-01 12:00"  过期时间，没有过期时间传0
            },
            checked: false,
            optionsInfo: {},
            defaultStartDate: '00:00:00'
        }
    },
    created(){
        this.lastSelectLength = 0; // 设置多选的坐席组
        if(Object.keys(this.rowInfo).length){
            this.title = '编辑开口任务';
            this.type = 'edit';
            // this.taskView();
        }
        this.initOptions(); // 获取下拉列表
    },
    methods: {
        dataFocus(){
            this.defaultStartDate = moment(new Date()).format('HH:mm:ss');
        },
        initOptions(){
            this.loading = true;
            this.$fetch.callCenter.openTaskInitOptions({}).then((res)=>{
                this.optionsInfo = res.data.data;
                this.loading = false;   
                if(this.type == 'edit'){ // 先后顺序
                   this.taskView()
                }
            }).catch(()=>{
                this.loading = false;
                if(this.type == 'edit'){
                   this.taskView()
                }
            })
        },
        taskView(){
            this.loading = true;
            this.$fetch.callCenter.openTaskView({'id': this.rowInfo.id}).then((res)=>{
                let result = res.data.data
                let dccIds = [];
                if(this.$hasArrContent(result.dccGroup)){ // 接口已经把之前删除的移除了
                    // result.dccGroup = removeDeleteArr(result.dccGroup, 'id',this.optionsInfo.dccGroup, 'id' ); // 去掉下拉框不匹配的, 后续如果产品说要增加回来，则用addArrToOptions方法
                    result.dccGroup.forEach((item)=>{
                        dccIds.push(item.id)
                    })
                }
                Object.assign(this.info, result);

                this.info.dccGroup = dccIds;
                this.changeGroup(this.info.dccGroup); // 改变全选
                if(result.endDate == "永久有效"){
                    this.checked = true;
                    this.info.endDate = '';
                }
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
        },
        cancel(){
            this.$emit('close', 'cancel');
        },
        addContent(){
            if(this.info.content && this.info.content.length < 8){
                this.info.content.push({'title': ""});
            }else {
                this.$message.warning('任务内容最多添加8个')
            }
        },
        upBtn(index){
            let obj = JSON.parse(JSON.stringify(this.info.content[index-1]));
            Object.assign(this.info.content[index-1],this.info.content[index])
            Object.assign(this.info.content[index] ,obj);
        },
        downBtn(index, item){
            let obj = JSON.parse(JSON.stringify(this.info.content[index+1]));
            Object.assign(this.info.content[index+1] ,this.info.content[index]);
            Object.assign(this.info.content[index], obj);
        },
        deleteBtn(index){
            this.info.content.splice(index, 1)
        },
        limitTimechange(val){
            if(val){
                this.info.endDate = '';
            }
        },
        getParmam(){
            const { scenario, title, content,dccGroup, dccGroupIds, startDate, endDate} = this.info;
            if(!scenario){
                this.$message.error('适用场景必填')
                return false;
            }
            if(!title){
                this.$message.error('任务名称必填')
                return false;
            }
            for(let i=0, length=content.length; i<length; i++){
                if(!content[i].title){
                    this.$message.error(`第${i+1}行任务内容必填`)
                    return false;
                }
            }

            if(!dccGroupIds.length){
                this.$message.error('适用坐席组必填')
                return false;
            }
            if(!startDate){
                this.$message.error('任务开始时间必填')
                return false;
            }
            if(!this.checked && !endDate){
                this.$message.error('任务结束时间必填')
                return false;
            }

            let params = {
                scenario: scenario,       // 任务场景
                title: title,             // 任务名称
                content: content,         // 任务内容
                dccGroup: dccGroupIds,         // 分配坐席组
                startDate: startDate,     // 开始时间
                endDate: endDate,         // 结束时间
            }
            if(this.checked){
                params.endDate = 0;
            }
            return params;
        },
        addFn(type){
            let params = this.getParmam();
            let that = this;
            if(params){
                if(type == 'online'){
                    params["status"] = 1;  // 保存上架按钮点击 
                }
                this.loading = true;
                if(this.type == 'add'){
                    this.$fetch.callCenter.openTaskCreate(params,true,false).then((res)=>{
                        this.loading = false;
                        this.$handleResponse(res, (data)=>{
                            this.$message.success('新增成功');
                            this.$emit('close', 'success')
                        }, false);
                    }).catch(()=>{ this.loading = false;})
                }else {
                    params['id'] = this.rowInfo.id;
                    this.$fetch.callCenter.openTaskUpdate(params,true,false).then((res)=>{
                        this.loading = false;
                        this.$handleResponse(res, (data)=>{
                            this.$message.success('编辑成功');
                            this.$emit('close', 'success')
                        },true);
                    }).catch(()=>{ this.loading = false;})
                }
            }
        },
        changeGroup(item){
            let result = chagneMultipleSelect(item, this.optionsInfo.dccGroup, 'id', 'title', this.lastSelectLength);
            this.info.dccGroup =  result.selectIds;
            this.info['dccGroupIds'] = result.resultIds
            this.lastSelectLength = result.lastSelectLength;
        },
        
    }
}
</script>

<style lang="scss" scoped>
.add-talk-task-dialog /deep/.el-dialog__body {
    margin-top: 8px;
    padding: 25px 0 0 55px;
}

.add-talk-task-dialog /deep/.el-dialog__footer {
    padding-bottom: 37px;
}

.add-talk-task-dialog /deep/.dialog-width {
   width: 640px;
}
.el-form-item {
    margin-bottom: 10px;
}
.form-task-time.el-form-item {
    margin-bottom: 5px;
}
.form-task-limit.el-form-item {
    margin-bottom: 5px;
}
.w-60 {
    width: 60px;
}

.span-icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    cursor: pointer;
    vertical-align: middle;
}
.icon-up {
    background: url('../../../assets/images/icons/common/up.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.icon-down{
    background: url('../../../assets/images/icons/common/down.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.icon-delete{
    background: url('../../../assets/images/icons/common/delete.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

@media screen and (max-width: 1485px) {
    .add-talk-task-dialog /deep/.el-dialog__title {
        font-size: 16px;
        line-height: 20px;
    }
    .add-talk-task-dialog /deep/.el-dialog__headerbtn {
        top: 15px;
    }

    .add-talk-task-dialog /deep/.el-dialog__body {
        padding: 25px 0 0 35px;
    }
}
</style>

<style>
.add-talk-task-dialog /deep/.form-task-time /deep/.el-input__inner {
    width: 350px;
}
</style>

