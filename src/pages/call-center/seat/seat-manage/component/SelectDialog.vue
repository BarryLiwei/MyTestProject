<template>
    <div class="add-seat-component">
        <el-button round @click="showDailog=true" size="small"  type="primary">{{ btnName }}</el-button>
        <div class="mt15 sale_box" v-show="configs.itemInfo[configs.itemKey] && configs.itemInfo[configs.itemKey].length && isMultiple">
            <div class="sale_style">
                <p class="item" v-for="(item,index) in configs.itemInfo[configs.itemKey]" :key='index'>
                    {{ configs.selectOptions | getOptionsValue(configs.optionValue, configs.optionLabel, item) | filterBlank }}
                </p>
            </div>   
        </div>

         <div class="mt15 sale_box" v-show="configs.itemInfo[configs.itemKey] && !isMultiple">
            <div class="sale_style">
                <p class="item">
                    {{ configs.selectOptions | getOptionsValue(configs.optionValue, configs.optionLabel, configs.itemInfo[configs.itemKey]) | filterBlank }}
                </p>
            </div>   
        </div>

        <!-- 弹窗 -->
        <add-seat-dailog v-if="showDailog" v-bind="$attrs"  @close="showDailog=false" :isDccDialog="configs.isDccDialog" :title="configs.title"  :config="configs"></add-seat-dailog>
    </div>
</template>

<script>
import AddSeatDailog from './AddSeatDialog';
export default {
    components: {
       AddSeatDailog
    },
    props: {
        btnName: {
            type: String,
            default: '添加'
        },
        isMultiple: { // 默认是多选
            type: Boolean,
            default: true
        },
        configs: {
          type: Object,
          default(){
            return{
                title: '添加坐席', // 弹窗的标题
                label: '坐席', // 弹窗的左侧标题
                selectOptions:[],
                optionLabel:'',
                optionValue:'',
                itemInfo: {},
                itemKey: 'name'
            }
          }
        }
    },
    data(){
        return {
            showDailog: false
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.sale_box{
    width: 360px;
    padding: 11px 0 11px 18px;
    background: #eef3f9;
    border-radius: 5px;
    margin-top: 15px;
    .sale_style{
        max-height: 317px;
        overflow-y: auto;
        .item {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #444;
        }
    }
}
</style>