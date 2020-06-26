<template>
    <el-dialog class="attack-form-dialog"
        :title="title"
        :visible.sync="dialogVisible"
        width="480px"
        :close-on-click-modal="false"
        :before-close="handleCancel">
        <el-form label-width="90px" :model="attackForm" :rules="rules" ref="attackForm">
            <el-form-item label="状态" :prop="isView ? '' : 'displayStatus'" class="require-right">
                <el-select v-if="!isView" v-model="attackForm.displayStatus" placeholder="状态" style="width: 100%;" size="small">
                    <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <div v-if="isView">{{attackForm.displayStatusTitle}}</div>
            </el-form-item>
            <el-form-item label="主体车型" :prop="isView ? '' : 'carSeriesId'" class="require-right">
                <car-select v-if="!isView" :showCar="mainCarConfig" :brandOptions="brandOptions" @carSelect="getMainCarData"></car-select>
                <!-- input 作用于实时监控返回的车型是否有值 -->
                <el-input v-show="false" v-model="attackForm.carSeriesId" size="small" />
                <div v-if="isView">{{attackForm.carSeriesName}}</div>
            </el-form-item>
            <el-form-item label="对比车型" :prop="isView ? '' : 'competitionCarSeriesId'" class="require-right">
                <car-select v-if="!isView" 
                    :showCar="compareCarConfig" 
                    :brandOptions="compareBrandOptions" 
                    remote 
                    @carSelect="getCompareCarData" 
                    :remote-method="initCompareBrandOptins"></car-select>
                <!-- input 作用于实时监控返回的车型是否有值 -->
                <el-input v-show="false" v-model="attackForm.competitionCarSeriesId" size="small"/>
                <div v-if="isView">{{attackForm.competitionCarSeriesName}}</div>
            </el-form-item>
            <el-form-item label="内容" :prop="isView ? '' : 'content'" class="require-right">
                <el-input v-if="!isView" type="textarea" v-model="attackForm.content" maxlength="500" :autosize="{ minRows: 5}" show-word-limit></el-input>
                <div v-if="isView">{{attackForm.content}}</div>
            </el-form-item>
        </el-form>

        <div slot="footer" class="p-b-20">
            <el-button size="small" class="blue_font_white_bg w-90" @click="handleCancel" round>取消</el-button>
            <el-button size="small" class="w-90" v-if="!isView" type="primary" @click="handleSave" round>保存</el-button>
            <el-button size="small" class="w-90" v-if="isView" type="primary" @click="handleEdit" round>编辑</el-button>
        </div>
    </el-dialog>
</template>

<script>
import CarSelect from '@/components/CarSelect'
export default {
    components: {
        CarSelect
    },
    props: {
        // 弹窗类型 add：新增 edit：编辑  view：查看
        dialogType: {
            type: String,
            default: ''
        },
        // 行数据
        rowData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            title: '新增攻防话术',
            isView: false,  // 是否预览模式
            stateOptions: [
                {
                    label: '显示',
                    value: 1
                },
                {
                    label: '隐藏',
                    value: 0
                },
            ], 
            mainCarConfig: {
                brand: true,  // 是否展示品牌
                brandId: null,
                series: true,  // 是否展示车系
                seriesId: null,
                model: false,  // 是否展示车型
            },
            compareCarConfig: {
                brand: true,  // 是否展示品牌
                brandId: null,
                series: true,  // 是否展示车系
                seriesId: null,
                model: false,  // 是否展示车型
            },
            attackForm: {
                carSeriesId: null,
                competitionCarSeriesId: null,
                brandId: null,
                competitionBrandId: null, 
                displayStatus: null,
                displayStatusTitle: '',
                carSeriesName: '',
                competitionCarSeriesName: '',
                content: ''
            },
            rules: {
                displayStatus: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                carSeriesId: [
                    { required: true, message: '请选择主体车型', trigger: 'change' }
                ],
                competitionCarSeriesId: [
                    { required: true, message: '请选择对比车型', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                ],
            },
            dialogVisible: true,
            brandOptions: [],
            compareBrandOptions: []
        }
    },
    created() {
        this.initForm()

    },
    methods: {
        initForm() {
            switch (this.dialogType) {
                case 'add':
                    this.title = '新增攻防话术';
                    this.initBrandOptins();
                    this.initCompareBrandOptins()
                    break;
                case 'edit':
                    this.title = '编辑攻防话术'
                    Promise.all([this.initBrandOptins(), this.initCompareBrandOptins()]).then(() => {
                        this.initData();
                    })
                    break;
                case 'view':
                    this.title = '攻防话术详情'
                    this.initData();
                    this.isView = true;
                    break;
            
                default:
                    break;
            }
        },
        initBrandOptins() {
            this.$fetch.common.carBrand({},false).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.brandOptions = data;
                }, false);
                
            })
        },
        initCompareBrandOptins(query) {
            this.$fetch.common.carBrandAll({'kwd': query},false).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.compareBrandOptions = data;
                }, false);
                
            })
        },
        initData() {
            if (this.rowData) {
                const { id, displayStatus, carSeriesId, competitionCarSeriesId, content, displayStatusTitle, carSeriesName, competitionCarSeriesName,
                        brandId, competitionBrandId } = this.rowData;
                this.attackForm = {
                    id,
                    displayStatus,
                    displayStatusTitle,
                    carSeriesName,
                    competitionCarSeriesName,
                    brandId,
                    competitionBrandId,
                    carSeriesId,
                    competitionCarSeriesId,
                    content
                }

                this.mainCarConfig.brandId = parseInt(brandId);
                this.compareCarConfig.brandId = parseInt(competitionBrandId);

                this.mainCarConfig.seriesId = parseInt(carSeriesId);
                this.compareCarConfig.seriesId = parseInt(competitionCarSeriesId);
            }
        },
        handleSave() {
            this.$refs['attackForm'].validate((valid) => {
                if (valid) {
                    const { displayStatus, carSeriesId, competitionCarSeriesId, content } = this.attackForm;

                    let queryName = '';
                    let params = {
                        displayStatus,
                        carSeriesId,
                        competitionCarSeriesId,
                        content
                    }

                    switch (this.dialogType) {
                        case 'add':
                            queryName = 'competitionCreate';
                            break;
                        default:   // 编辑
                            params.id = this.attackForm.id;
                            queryName = 'competitionUpdate';
                            break;
                    }
                    
                    this.$fetch.callCenter[queryName](params).then((res)=>{
                        this.$handleResponse(res, res=>{
                            this.$message.success(`${this.dialogType == 'add' ? '新增' : '修改'}成功`);
                            this.$emit('success')
                        },true);
                    }).catch(()=>{
                        this.$store.commit('closeLoading');
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        handleEdit() {
            this.isView = !this.isView;
        },
        getMainCarData(value) {
            const { seriesId } = value;
            this.attackForm.carSeriesId = seriesId;
        },
        getCompareCarData(value) {
            const { seriesId } = value;
            this.attackForm.competitionCarSeriesId = seriesId;
        },
        handleCancel() {
            this.$emit('cancel')
        }
    },
}
</script>

<style lang="scss" scoped>
.attack-form-dialog {
    .require-right {
        /deep/ .el-form-item__label {
            position: relative;
            &:before {
                position: absolute;
                right: 5px;
                top: 2px;
                z-index: 1;
            }
        }
    }
}

.el-form-item {
    // margin-bottom: 10px;
}
</style>

