<template>
    <div class="record-cell-component">
        <h3 class="title" v-if="showTitle"> {{ title | filterBlank }}</h3>
        <div class="flex detail" v-for="(item, index) in table" :key="index">
            <div v-if="item.title" class="w-90 detail-item">{{ item.title }}</div>
            <div class="flex-1 detail-item"> {{ info[item.key] | filterBlank }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        showTitle: { // 是否显示头部
            type: Boolean,
            default: true
        },
        title: {  // 标题
            type: String,
            default: '基本信息'
        },
        table: { // 配置的数组
            type:Array,
            default:()=>{return[]}
        },
        info: { // 存信息的对象
            type: Object,
            default:()=>{return{}}
        }
    },
    data(){
        return{}
    }
}
</script>

<style lang="scss" scoped>
.title {
    font-size: 15px;
    color: #616063;
    line-height: 25px;
}
.detail {
    color: #838b96;
    font-size: 14px;
    line-height: 22px;
}

@media screen and (max-width: 1485px){
    .title {
        font-size: 14px;
        line-height: 20px;
    }
    .detail-item {
        font-size: 13px;
    }
}
</style>


