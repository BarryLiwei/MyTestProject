<template>
  <div class="error-page">
    <div class="side-main-menu" v-if="showLeft">
        <side-menu></side-menu>
    </div>
    <div class="errorWarp">
      <div class="image">
        <img :src="image"/>
      </div>
      <h3 class="desc" v-text="desc"></h3>
    </div>
  </div>
</template>
<script type="text/javascript">
  import SideMenu from '@/components/layout/SideMenu';
  import { getSubMenu } from '@/utils/getUserInfo'
  export default {
    components: {
      SideMenu
    },
    name: 'noPage',
    data() {
      return {
        image: require('./images/404_error.png'),
        desc: '抱歉，找不到对应的页面',
        showLeft: false,
      }
    },
    created(){
      let subMenu = getSubMenu(); // 获取子菜单，如果有子菜单的，就显示左侧的菜单
      if(this.$hasArrContent(subMenu) && !['#/error','#/work'].indexOf(window.location.hash) > -1){ 
        this.showLeft=true;
      }
    }
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
    z-index: 99;
}
.error-page {
  .errorWarp {
    text-align: center;
    margin: 10% auto auto auto;
    .image {
      margin: 20px auto;
    }
    .title {
      color: #fff;
      font-size: 64px;
      padding: 15px 30px;
      margin-bottom: 20px;
      margin-top: 50px;
      font-weight: bold;
    }
    .desc {
      font-size: 32px;
      color: #474747;
      font-weight: bold;
      line-height: 30px;
      margin-top: 50px;
    }
    .backBtn {
      display: inline-block;
      color: #fff;
      margin-bottom: 20px;
      margin-top: 50px;
      padding: 15px 30px;
      border: 1px solid #fff;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>
