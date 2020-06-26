<template>
    <div class="form-box">
        <el-row type="flex"  class="header por">
            <el-col :span="12" class="header-title">{{ config.title }}</el-col>
            <el-col :span="12" class="text-right" v-if="config.showEdit"> 
                <el-button class="blue_font_white_bg" plain round size="mini" v-show="!config.editable" @click="goEdit">编辑</el-button>
                <el-button class="blue_font_white_bg" plain round size="mini" v-show="config.editable" @click="saveEdit">保存</el-button>
                <el-button class="blue_font_white_bg" plain round size="mini" v-show="config.editable" @cancel="cancelEdit">取消</el-button>
            </el-col>
        </el-row>
        
        <div class="content m-t-15">
            <!-- 行循环 -->
            <div class="row flex"  v-for="(item, index) in config.table" :key="index"> 
                <div class="title flex-1" v-for="(subItem, index) in item" :key="'sub'+index">
                    <div class="box-title text-center">
                        {{ subItem.header }}
                    </div>
                    <div class="box-body text-center">
                        <edit-cell 
                            :itemInfo="formInfo" 
                            :itemKey="subItem.key" 
                            :editable="config.editable && subItem.canEdit" 
                            :itemType="subItem.type"
                            :subClass="subItem.subClass?subItem.subClass:'defaultSubClass'"
                            :selectIsAll="subItem.isAll"
                            :selectIsAllTitle="subItem.allTitle?subItem.allTitle:'全部'"
                            :selectOptions="subItem.selectOptions"
                            :optionLabel="subItem.optionLabel"
                            :optionValue="subItem.optionValue"
                            :isEllipsis="subItem.isEllipsis"
                            :currentVal="subItem.currentVal"
                            :isTransfer="subItem.isTransfer"
                            v-bind="$attrs"
                            v-on="$listeners">

                            <template v-if="$slots.lineHander">
                                <slot name="lineHander"></slot>
                            </template>

                            <template v-if="$slots.custom">
                                <slot name="custom" :obj="formInfo"></slot>
                            </template>

                            <template v-if="$slots.notEdit">
                                <slot name="notEdit" :obj="formInfo"></slot>
                            </template>
                        </edit-cell>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 此组件的需求发生改变，暂时没有用
import EditCell from './EditCell';
export default {
    components: {
        EditCell 
    },
    props: {
        config: {
            type: Object,
            default(){
                return {
                    title: '基本资料', // 标题
                    showEdit: false, // 是否显示编辑按钮
                    editable: false, // 是否可编辑
                    table: [ // 对表格的配置
                        // [
                        //     {'header': '客户ID','type': 'input', 'key': 'name'},
                        //     {'header': '姓名','type': 'input',  'key': 'name'},
                        //     {'header': '性别','type': 'input', 'key': 'name'},
                        //     {'header': '姓名','type': 'input', 'key': 'name'},
                        //     {'header': '客户ID','type': 'input', 'key': 'name'},
                        //     {'header': '姓名','type': 'input', 'key': 'name'},
                        // ],
                        // [
                        //     {'header': '意向等级','type': 'input', 'key': 'name'},
                        //     {'header': '购买类型','type': 'input', 'key': 'name'}
                        // ]
                    ],   
                }
            }
        },
        formInfo: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return {

        }
    },
    methods: {
        goEdit(){
            this.config.editable = true;
        },
        saveEdit(){
            this.$emit('saveEdit', this.formInfo)
        },
        cancelEdit(){
            this.formInfo.editable = false;
            this.$emit('cancelEdit', this.formInfo);
        },
    }
}
</script>

<style lang="scss" scoped>
.form-box {
    background:#fff;
}
.header-title {
    color: #444;
    font-size: 16px;
    line-height: 28px;
}
.content {
    border-top: solid 1px #e9eff3;
    border-left: solid 1px #e9eff3;
}
.box-title {
    background: #f2f8fc;
    height: 45px;
    line-height: 35px;
    padding: 5px;
    border-right: solid 1px #e9eff3;
    border-bottom: solid 1px #e9eff3;
}
.box-body {
    min-height: 60px;
    padding: 5px;
    border-right: solid 1px #e9eff3;
    border-bottom: solid 1px #e9eff3;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
