<template>
    <div class="setting-org-structure-page m-20 common-box min-h-600">
        <div class="group-title">组织架构设置</div>

        <left-tree class="left-tree"></left-tree>

        <right-content class="right-content"></right-content>
    </div>
</template>

<script>
import LeftTree from './components/LeftTree';
import RightContent from './components/RightContent'
export default {
    components: {
        LeftTree,
        RightContent
    },
    data(){
        return{}
    },
}
</script>

<style lang="scss" scoped>
.group-title {
    color: #444;
    font-size: 20px;
    padding-left: 20px;
    font-weight: 600;
    height: 60px;
    line-height: 60px;
    background-color: #fafcff;
    border-bottom: solid 1px #eaebf0;
}
.left-tree {
    width: 230px;
    height: 100%;
    min-height: 600px;
    display: inline-block;
    vertical-align: top;
}

.right-content {
    display: inline-block;
    width: calc(100% - 235px);
    border-left: solid 1px #eaebf0;
}
</style>
