<template>
    <div class="side-main-component">
        <div class="side-main-menu">
            <side-menu></side-menu>
        </div>
        
        <!-- 后面要弄菜单折叠的话，参考web-tj集团的，用动画设置 margin-left的值即可，另折叠的状态不需要弄到全局，直接到当前组件默认打开 -->
        <div class="side-main-body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import SideMenu from './SideMenu';
export default {
    components: {
        SideMenu
    },
    data(){
        return {}
    },
}
</script>

<style lang="scss" scoped>
.side-main-menu {
    width: 240px;
    position:fixed;
    top: 70px;
    left: 0;
    bottom: 0;
    background: #383f48;
    z-index: 999;
}
.side-main-body {
    margin-left: 240px;
}

@media (max-width: 1700px) {
    .side-main-menu {
        width: 220px;
    }
    .side-main-body {
        margin-left: 220px;
    }
}

@media (max-width: 1600px) {
    .side-main-menu {
        width: 200px;
    }
    .side-main-body {
        margin-left: 200px;
    }
}

@media (max-width: 1500px) {
    .side-main-menu {
        width: 190px;
    }
    .side-main-body {
        margin-left: 190px;
    }
}

@media (max-width: 1400px) {
    .side-main-menu {
        width: 180px;
    }
    .side-main-body {
        margin-left: 180px;
    }
}


</style>


