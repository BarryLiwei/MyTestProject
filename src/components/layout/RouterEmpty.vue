<template>
    <router-view></router-view>
</template>

<script>
// 空 router-view, 用于路由时过渡一层子路由
// 此组件用于面包屑时需要处理的中间层
export default {
    data(){
        return {}
    }
}
</script>