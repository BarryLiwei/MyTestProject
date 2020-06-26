<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="450px"
        append-to-body
        :before-close="handleCancel">
        
        <el-form v-if="auditType != 'level'" ref="allotForm" :model="form" :rules="auditRules" label-width="100px" class="required-right">
            <el-form-item label="分配DCC" prop="dcc">
                <el-select v-model="form.dcc" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item, index) in dccOptions" :key="index" :value="item.id" :label="item.dccName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" placeholder="请输入" show-word-limit v-model="form.remark" maxlength="120" rows="5"></el-input>
            </el-form-item>
        </el-form>

        <el-form v-if="auditType == 'level'" ref="allotForm" :model="form" :rules="auditRules">
            <p class="m-b-10">更改意向等级至：</p>
            <el-form-item prop="level">
                <el-select v-model="form.level" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item, index) in levelOptions" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <div slot="footer" class="p-b-20">
            <el-button class="blue_font_white_bg" @click="handleCancel" round>取消</el-button>
            <el-button type="primary" @click="handleNext" round>确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import * as Http from '@/apis/work'
export default {
    props: {
        auditType: {
            type: String,
            default: ''
        },
        auditId: null, // 战败审核-intentionId，无效审核-clueId，降级监控-id
        dccGroupId: null  // 组id
    },
    data() {
        return {
            dialogVisible: true,
            title: '',
            form: {
                dcc: '',
                remark: '',
                level: '',
            },
            dccOptions: [],
            levelOptions: ['H', 'A', 'B', 'C'],
            auditRules: {
                dcc: [
                    { required: true, message: '请选择分配DCC', trigger: 'change' },
                ],
                level: [
                    { required: true, message: '请勾选更改意向等级', trigger: 'change' },
                ]
            }
        }
    },
    created() {
        this.initData();
    },
    methods: {
        initData() {
            switch (this.auditType) {
                case 'defeat':
                    this.title = '拒绝战败'
                    this.getDccSelect();
                    break;
                case 'invalid':
                    this.title = '驳回无效'
                    this.getDccSelect();
                break;
                case 'level':
                    this.title = '干预变更'
                    this.getLevelSelect();
                    break;
                default:
                    break;
            }
        },
        getLevelSelect() {
            let parentAudit = this.$parent.auditInfo;
            let newArr = this.levelOptions.filter(item => (item != parentAudit.newLevel));
            this.levelOptions = newArr;
        },
        getDccSelect(){ // DCC/组列表
            this.$fetch.common.commonDccList({dccGroupId: this.dccGroupId}, false, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.dccOptions = res;
                }, false);
            })
        },
        handleNext() {
            this.$refs['allotForm'].validate((valid) => {
                if (valid) {
                    let qureyName;

                    const { level, dcc, remark} = this.form;
                    let params = {
                        id: this.auditId,
                    }

                    // 干预变更
                    if (this.auditType == 'level') {
                        qureyName = 'changeLevel';
                        params.level = level;
                    } else {  
                        qureyName = this.auditType == 'invalid' ? 'clueInvalidRefuse' : 'defeatRefuse';
                        params.dccId = dcc;
                        params.remark = remark;
                    }

                    Http[qureyName](params).then((res)=> {
                        this.$handleResponse(res, data => {
                            this.$message.success('操作成功');
                            let params = {};
                            // 降级监控更改成功后的回显数据
                            if (data.level) {
                                params.level = data.level;
                            }
                            this.$emit('successAudit', params)
                        },true)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleCancel() {
            this.$emit('cancelAudit')
        },
    },
}
</script>

