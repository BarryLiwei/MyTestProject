<template>
    <div class="layout_up_down">
        <header-menu></header-menu>
        <div class="layout_body_wrap" v-if="isShow">
            <router-view></router-view>
        </div>
        <!-- 来电弹框 -->
        <IncomingCall v-if="sdkType == 'byaicc'"></IncomingCall>

        <!-- 阿里初始化，阿里来电弹屏 -->
        <div v-if="sdkType == 'alicc'">  
          <AliccSDK></AliccSDK>
          <IncomingCallAli></IncomingCallAli>
        </div>

        <!-- 容联初始化，容联来电/外呼弹屏 -->
        <div v-if="sdkType == 'RL'">
          <phoneRL v-if="show" :key="time"></phoneRL>
          <phoneDialogRL></phoneDialogRL>
        </div>

        <!-- 天润初始化，天润来电弹屏 -->
        <div v-if="sdkType == 'cticloud'">
          <CticloudSDK></CticloudSDK>
          <IncomingCallTR></IncomingCallTR>
        </div>
        
    </div>
</template>

<script>

// 此组件是上下结构，头部和body
import HeaderMenu from "./HeaderMenu";
import IncomingCall from "@/components/IncomingCall";

import phoneRL from "@/components/phoneRL";
import phoneDialogRL from "@/components/phoneDialogRL";

import CticloudSDK from "@/components/CticloudSDK";
import IncomingCallTR from "@/components/IncomingCallTR";

import AliccSDK from "@/components/AliccSDK";
import IncomingCallAli from "@/components/IncomingCallAli";

import { mapState } from 'vuex'
export default {
  components: {
    HeaderMenu,
    IncomingCall,
    phoneRL,
    phoneDialogRL,
    CticloudSDK,
    IncomingCallTR,
    AliccSDK,
    IncomingCallAli
  },
  data() {
    return {
      sdkType: '', // byaicc 百应，   alicc 阿里，   RL 容联，   cticloud 天润
      show: true,
      time:'',
      isShow: true
    };
  },
  computed:{
    ...mapState(["loginType", "agentInfo"]),
  },
  created() {
    if(this.agentInfo && this.agentInfo.thirdSeat && this.agentInfo.thirdSeat.platformType == '1'){ //平台类型：1容联，2百应，3天润
        this.sdkType = 'RL';
    }
    else if(this.agentInfo && this.agentInfo.thirdSeat && this.agentInfo.thirdSeat.platformType == '3'){ //平台类型：1容联，2百应，3天润
        this.sdkType = 'cticloud';
    }
    this.sdkType = window.localStorage.getItem('c_callSDKTools') || this.sdkType;
    window.eventBus.$on("initRLSDKBus", param => {
      // 创建时，进行事件onb1监听
      console.log("receive initRLSDKBus", param);
      this.show = false;

      setTimeout(()=>{
        window.m7$ = '';
        this.show = true;
        this.time = new Date().getTime();
      },1000)
    });
    window.eventBus.$on("destroyRLBus", param => {
      // 创建时，进行事件onb1监听
      console.log("receive destroyRLBus", param);
      this.show = JSON.parse(window.sessionStorage.getItem('c_show_RL'));
    });
    console.log(this.sdkType)
    
  },
  mounted(){
      this.$eventHub.$on('headChangeRole', ()=>{ // 切换角色, 整体除头部刷新一下
          this.isShow=false;
          this.$nextTick(()=>{
              this.isShow=true;
          })
      })    
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.layout_body_wrap {
    // margin-top: 70px;
    position:relative;
    top: 70px;
}
// 不希望看见你，去到遥远的地方
// .remote-places{
//     z-index: -999999;
//     position: absolute;
//     top: -9999px;
//     right: -9999px;
// }
</style>



