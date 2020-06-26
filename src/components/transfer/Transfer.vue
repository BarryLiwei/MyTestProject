<template>
    <div class="transfer-component">
        <el-button round v-bind="$attrs" @click="showDailog=true" type="primary">{{ btnName }}</el-button>
        <div class="mt15 sale_box" v-show="configs.selectedOptions && configs.selectedOptions.length">
          <div class="sale_style">
            <p class="item" v-for="(item,index) in configs.selectedOptions" :key='index'>{{item[optionKey]}}</p>
          </div>
        </div>

        <!-- 穿梭框选择区域 -->
        <select-area
          v-if="showDailog"
          :title="dialogTitle"
          :transProps="transProps"
          :selectedOptions="configs.selectedOptions"
          :unSelectOptions="configs.unSelectOptions"
          v-on:areas-change="listenToAreas"
          @cancel="showDailog = !showDailog"
        ></select-area>
    </div>
</template>

<script>
import SelectArea from './SelectArea'
export default {
    components: {
        SelectArea
    },
    props: {
        btnName: {
            type: String,
            default: '添加'
        },
        dialogTitle: {
            type: String,
            default: '添加4S店'
        },
        transProps: {
          default: () => ({
            key: 'area_id',
            label: 'name'
          })
        },
        optionKey: {
            type: String,
            default: 'name'
        },
        configs: {
          type: Object,
          default(){
            return{
              selectedOptions:[], // 已选择
              unSelectOptions:[], // 未选中
            }
          }
        }
    },
    data(){
        return {
            showDailog: false
        }
    },
    methods: {
        listenToAreas(somedata) {
          this.configs.selectedOptions = somedata;
        }
    }
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