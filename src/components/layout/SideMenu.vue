<template>
    <div class="side-menu-component p-t-15 reset-scrollbar">
        <el-menu  class="side-menu-theme"
            ref="webSubMenu"
            router
            :default-active="activeIndex"
            :default-openeds="openeds"
            active-text-color="#ffd04b">

            <div v-for="(item, key) in sideMenu" :key="needRender+key">
                <el-submenu  v-if="item.child && item.child.length"  :index="'/' + item.url">
                    <template slot="title">
                        <i class="icon-item" :class="`${item.url.split('/').join('-')}`"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item v-for="(c, k) in item.child"  :key="'sub'+k" :index="'/' + c.url"
                    >{{c.name}}</el-menu-item>
                </el-submenu>
                <!-- 没有子菜单 -->
                <el-menu-item v-if="!item.child || !item.child.length" :index="'/' + item.url">
                    <i class="icon-item" :class="`${item.url.split('/').join('-')}`"></i>
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>

<script>
// 此组件为有左侧有二级菜单时用
import { getSubMenu, getHashPath,menuPath, getAllPath} from '@/utils/getUserInfo'
export default {
    data() {
        return {
            openeds: [], // 需要默认打开的三级菜单项
            sideMenu: [],
            activeIndex: "/",
            needRender: 'side' , // 需要重新渲染一下
        };
    },
    created() {
        this.onloadCheck(); // 只在刷新的时候需求判断, 体验的问题

        this.getSideMenu();
        this.updataIndex();
    },
    watch: {
        $route: function(newVal){
            // 此三个方法的顺序不能调，先判断是否切换了大模块(business->setting), 做这个判断主要是为了减少计算量
            this.changeSubMenu(newVal); 
            this.getSideMenu(newVal);
            this.updataIndex();
        }
    },
    methods: {
        updataIndex(){  // 此方法主要是获取当前高亮的activeIndex的值
            if(!this.allPath || !Object.keys(this.allPath).length){ // 获取所有的菜单
                this.allPath = getAllPath();
            }
            let arr = menuPath(3); // 获取路径

            if(this.checkPath(arr)) {
                return ;
            };

            arr.pop(); // 缩减一层再匹配 （左侧菜单要么匹配第三层，要么匹配第二层）
            this.checkPath(arr);
        },
        checkPath(arr){
            if(this.allPath[arr.join('/')]){ // 匹配不上
                this.activeIndex = '/' + arr.join('/');
                return true;
            }
            return false
        },
        getSideMenu(newVal) { // 此方法获取左侧菜单栏
            if(this.sideMenu && this.sideMenu.length && newVal && !this.checkChangeModel(newVal)){ // 已经存在菜单就不需要再重新获取，除非切换大的模块
                return;
            }
            this.sideMenu = getSubMenu();
            if(this.sideMenu && this.sideMenu.length){
                this.sideMenu.forEach(item => {
                    if(item.child && item.child.length){
                        this.openeds.push("/" + item.url); // 判断有子菜单的tree打开open
                    }
                });
            }
        },
        changeSubMenu(newVal){ // 切换到大模块的时候，需要重新渲染一下，不然没法改变子菜单的默认值
            if(this.checkChangeModel(newVal)){ // 判断是否切换了大类的模块
                this.needRender = this.needRender + "a";
            }
        },
        checkChangeModel(newVal){ // 此方法是判断是否切换了大模块，如 business业务管理切换到setting 大模块
            let newPath = newVal.path.split('/')[1];
            let oldPath = this.activeIndex.split('/')[1];
            if(newPath !== oldPath){
                return true;
            }
            return false;
        },
        onloadCheck(){
            // 场景，在url 上输入localhost:3000/business, 页面没有重定向，为了体验问题，加个重定向，如果后续忽略这个体验，可省去
            if(this.load){ // 执行一遍后，不需要再执行
                return;
            }
            this.load = true; 
            let hash = getHashPath();
            if (hash && hash[1] && !hash[2]){
                this.sideMenu = getSubMenu();
                if(this.$hasArrContent(this.sideMenu)){
                    if(this.$hasArrContent(this.sideMenu[0].child)){ // 跳三级第一个菜单
                        this.$router.push('/'+this.sideMenu[0].child[0].url)
                    }else {
                        this.$router.push('/'+this.sideMenu[0].url); // 跳二级菜单
                    }
                }
                return;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.side-menu-component{
    overflow: auto;
    overflow-x: hidden;
    height: 100%;
    max-height: 100%;
    margin-right:5px;
}
.side-menu-theme {
  background: #363d46;
  &.el-menu {
    border-right-width: 0;
  }
  /deep/ .el-submenu__title {
    color: rgb(191, 203, 217);
    background-color: #363d46;
    &:hover {
      color: rgb(191, 203, 217);
      background-color: #363d46;
    }
  }
  /deep/ .el-menu-item {
    color: rgb(191, 203, 217);
    background-color: #363d46;
    &.is-active {
      color: #FFF!important;
      background-color: #21262b;
      &::before {
        content: '';
        width: 5px;
        height: 100%;
        background: #1494eb;
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0px;
      }
    //   &::after {
    //     display: inline-block;
    //     content: '';
    //     width: 0; 
    //     height: 0;
    //     border-width: 10px;
    //     border-style: solid;
    //     border-color: transparent #fff transparent transparent ;
    //     position: absolute;
    //     right: -1px;
    //     top: 50%;
    //     transform: translateY(-50%)
    //   }
    }
    &:hover {
      color: #fff;
      background-color: #21262b;
    }
  }
  .el-submenu {
    .el-menu-item {
      padding-left: 47px!important;
    }
  }
}


.side-menu-component.reset-scrollbar {
    &::-webkit-scrollbar {
        width: 6px;
        border-radius: 25px;
        opacity: 0;
        -webkit-transition: opacity .12s ease-out;
        transition: opacity .12s ease-out;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 25px;
        background-color: rgba(144, 147, 153, 0.3);
        -webkit-transition: background-color .3s;
        transition: background-color .3s;
    }
}

.icon-item {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-size: contain;
    margin-right: 7px;
}

// 业务管理
.business-clue {
   background-image: url('~@/assets/images/icons/business/business-clue.png') 
}
.is-active .business-clue {
   background-image: url('~@/assets/images/icons/business/business-clue-active.png')  
}

.business-potential {
   background-image: url('~@/assets/images/icons/business/business-potential.png') 
}
.is-active .business-potential {
   background-image: url('~@/assets/images/icons/business/business-potential-active.png')  
}

.business-invite {
   background-image: url('~@/assets/images/icons/business/business-invite.png') 
}
.is-active .business-invite {
   background-image: url('~@/assets/images/icons/business/business-invite-active.png')  
}

.business-order {
   background-image: url('~@/assets/images/icons/business/business-order.png') 
}
.is-active .business-order {
   background-image: url('~@/assets/images/icons/business/business-order-active.png')  
}

.business-defeat {
   background-image: url('~@/assets/images/icons/business/business-defeat.png') 
}
.is-active .business-defeat {
   background-image: url('~@/assets/images/icons/business/business-defeat-active.png')  
}

// 呼叫中心
.call-task {
    background-image: url('~@/assets/images/icons/call/call-task.png')
}
.is-active .call-task {
   background-image: url('~@/assets/images/icons/call/call-task-active.png')  
}

.call-know {
    background-image: url('~@/assets/images/icons/call/call-know.png')
}
.is-active .call-know {
   background-image: url('~@/assets/images/icons/call/call-know-active.png')  
}

.call-seat {
    background-image: url('~@/assets/images/icons/call/call-seat.png')
}
.is-active .call-seat {
   background-image: url('~@/assets/images/icons/call/call-seat-active.png')  
}

.call-media-manage {
    background-image: url('~@/assets/images/icons/call/call-media-manage.png')
}
.is-active .call-media-manage {
   background-image: url('~@/assets/images/icons/call/call-media-manage-active.png')  
}

.call-call-record {
    background-image: url('~@/assets/images/icons/call/call-call-record.png')
}
.is-active .call-call-record {
   background-image: url('~@/assets/images/icons/call/call-call-record-active.png')  
}

.call-param {
    background-image: url('~@/assets/images/icons/call/call-param.png')
}
.is-active .call-param {
   background-image: url('~@/assets/images/icons/call/call-param-active.png')  
}

.call-param {
    background-image: url('~@/assets/images/icons/call/call-param.png')
}
.is-active .call-param {
   background-image: url('~@/assets/images/icons/call/call-param-active.png')  
}

// 系统设置
.setting-group-people {
    background-image: url('~@/assets/images/icons/settings/setting-group-people.png')
}
.is-active .setting-group-people {
   background-image: url('~@/assets/images/icons/settings/setting-group-people-active.png')  
}

.setting-role-power {
    background-image: url('~@/assets/images/icons/settings/setting-role-power.png')
}
.is-active .setting-role-power {
   background-image: url('~@/assets/images/icons/settings/setting-role-power-active.png')  
}

.setting-group-shop {
    background-image: url('~@/assets/images/icons/settings/setting-group-shop.png')
}
.is-active .setting-group-shop {
   background-image: url('~@/assets/images/icons/settings/setting-group-shop-active.png')  
}

.setting-org-structure {
    background-image: url('~@/assets/images/icons/settings/setting-org-structure.png')
}
.is-active .setting-org-structure {
   background-image: url('~@/assets/images/icons/settings/setting-org-structure-active.png')  
}

@media (max-width: 1500px) {
    /deep/.side-menu-theme{
        .el-submenu {
          .el-menu-item {
            padding-left: 38px!important;
          }
        }
        /deep/.el-submenu__title {
            padding-left: 11px!important;
        }
        .el-menu-item {
            padding-left: 11px!important;
        }
    }
}

@media (max-width: 1400px) {
    /deep/.side-menu-theme{
        .el-submenu {
          .el-menu-item {
            padding-left: 37px!important;
          }
        }
        /deep/.el-submenu__title {
            padding-left: 10px!important;
        }
        .el-menu-item {
            padding-left: 10px!important;
        }
    }
}

</style>


