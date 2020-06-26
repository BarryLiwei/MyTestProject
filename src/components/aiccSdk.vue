<template>
  <div>
    <!-- 容联测试 start -->
    <li>
        <i class="el-icon-folder-add" @click="initSDK()">初始化</i>
    </li>
    <li>
        <div id="phone-slot"></div>
        <div id="contact-sdk"></div>
    </li>
    <!-- 容联测试 end -->
  </div>
</template>
<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    //百应电话外拨
    initSDK() {
      const slot = document.getElementById('phone-slot'); //电话条渲染的目标节点
      console.log(slot)
      if (slot) {
          // new window.AiccSdk.default({
          //     companyId: '34590',
          //     mobile: '13168766000',
          //     client_id: '9vVgN0xsBFpSuz8W',
          //     client_secret: 'c2lhuHLS0Z6beCFC07lPniiDEGSR1A',
          //     phoneRenderSlot: slot,
          // });
          window.aiccSdk = new window.AiccSdk.default({
            companyId: '34590',
            // userProperties,
            mobile: '17322300397',
            client_id: '9vVgN0xsBFpSuz8W',
            client_secret: 'c2lhuHLS0Z6beCFC07lPniiDEGSR1A',
            phoneRenderSlot: slot,
            // contact: '17322300397',
            // autoCallOut: false, //增加autoCallOut参数，在默认传递了contact或者setContact方法时自动拨打
        });
          
      }

      // window.aiccSdk.setContact(1234564666);
      window.aiccSdk.onCallStateChange(callState => {
          console.log(callState);
      });
      
      
    },
  }
}
</script>
<style lang="scss" scoped>

</style>

