<template>
    <div class="org-manage-shop">
        <div class="org-title"> 当前组织:  {{ currentOrg.name | filterBlank }}</div>

        <tabs-scrm class="org-tab" :tabs="tabs" @change="changeTab" :tabStyle="{'height':'3px', 'line':'bottom'}"></tabs-scrm>

        <manage-shop  ref="shop"  :currentOrg="currentOrg" v-show="activedTab=='shop'" @total="totalShop"></manage-shop>

        <manage-people ref="people" :currentOrg="currentOrg" v-show="activedTab=='people'" @total="totalPeople"></manage-people>
    </div>
</template>

<script>
import TabsScrm from '@/components/TabsScrm'
import ManageShop from './ManageShop';
import ManagePeople from './ManagePeople'
export default {
    components:{
        TabsScrm,
        ManageShop,
        ManagePeople
    },
    data(){
        return {
            currentOrg: {}, // 当前组织 
            tabs: [{'title': '管理门店', "name": 'shop', 'count': 0},{'title': '管理人员', "name": 'people', 'count': 0}],
            activedTab: 'shop',
        }
    },
    mounted(){
        this.$eventHub.$on('changeCurrentOrg', (data)=>{
            this.currentOrg = data;
            this.$nextTick(()=>{
                this.$refs.shop && this.$refs.shop.clear(); // 子菜单调接口获取
                this.$refs.people && this.$refs.people.clear(); // 调两个接口，为了获取total数组
            })
        });
    },
    methods: {
        changeTab(item){
            this.activedTab = item;
            // this.$refs[item] && this.$refs[item].clear(); // 子菜单调接口获取
        },
        totalPeople(val){
            this.tabs[1].count=val;
        },
        totalShop(val){
            this.tabs[0].count=val;
        }
    }
}
</script>

<style lang="scss" scoped>
.org-title {
    font-size: 18px;
    color: #444;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
    padding: 10px 20px 5px;
}

.org-tab.tabs__scrm /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item {
    border-left: none;
    padding: 0;
    margin: 0 15px;
    font-size: 16px;
}

.org-tab.tabs__scrm /deep/ .el-tabs--card>.el-tabs__header {
    background: #fff;
    padding-left: 5px;
}

@media screen and (max-width: 1485px){
    .org-title {
        font-size: 16px;
        line-height: 35px;
    }

    .org-tab.tabs__scrm /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item {
        font-size: 14px;
    }
}
</style>

