<template>
  <div class="bread__crumb mb20">
    <span class="bread_back" @click="goBack" v-show="isBack">
      <i class="el-icon-back"></i>
    </span>
    <!-- 面包屑 -->
    <a class="bread_color" v-for="(item,index) in bread" :key="index">
      <span  
        class="bread_font"
        :class="{'frist_bread': index == 0, 'last_bread': index == (bread.length-1)}"
        @click="goTo(item.path, index)"
      >{{item.name}}</span>
      <i class="el-icon-arrow-right" v-show="index != (bread.length-1)"></i>
    </a>
  </div>
</template>

<script>
import BreadObj from './bread';
export default {
  props: {
    isBack: {
      type: Boolean,
      default: true
    },
    breadName: { // 当路由有变量/:id时，由于this.$route.path匹配不上/:id的情形，此时从父元素传进来路径去匹配; 新增/编辑共用一个面包屑时从父元素传进
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bread:[]
    };
  },
  mounted() {
    this.getbreadcrumb();
  },
  watch: {
    $route(to, from) {
      this.getbreadcrumb();
    }
  },
  methods: {
    goBack() {
        // 返回上一页
        if (window.history.length <= 1) {
          this.$router.push({ path: "/" }); // 在路由中执行了跳到第一个菜单的页面
          return;
        } else {
          this.$router.go(-1);
        }
    },
    goTo(path, index) {
        if (index == this.bread.length - 1) {
          return;
        }
        this.$router.go(-(this.bread.length - 1 - index));
    },
    getbreadcrumb() {
        //获取面包屑路由
        let name = this.breadName || this.$route.path; // 先取外部的，没有就取路由上的
        this.bread = BreadObj[name];
    },
  }
};
</script>

<style lang="scss" scoped>
.bread__crumb {
  display: flex;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  background: #ffffff;
  border-radius: 5px;
  .bread_back {
    display: inline-block;
    width: 44px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background: #3d7eff;
    color: #fff;
    font-size: 23px;
    border-radius: 5px 0 0 5px;
    box-shadow: 0px 0px 1px 0px #3d7eff;
    cursor: pointer;
  }
  .bread_color {
    color: #3d7eff;
    line-height: 48px;
    .bread_font {
      margin: 0 2px 0 5px;
    }
    .frist_bread {
      margin-left: 20px;
    }
    .last_bread {
      color: #454545;
      cursor: default;
    }
  }
}
</style>
