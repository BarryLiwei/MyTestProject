<template>
  <div>
    <div id="workbench-container"></div>
    <div>
      <el-dialog
            title="欢迎回来"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="471px"
            :before-close="handleClose"
        >
            <div class="dialog-center" style="text-align: center;">
                欢迎回来，请问是否需要切换到“坐席在线”状态并开始工作？
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="" class="w-90 plain-btn-style" @click="handleClose" round>不需要</el-button>
                <el-button size="medium" type="primary" class="w-90"  @click="changeStatus" round>是的</el-button>
            </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  created() {
    let that = this;
    that.load_script(
      "//g.alicdn.com/cloudcallcenter/SIPml/0.1.2/SIPml-api.js",
      function() {
        that.load_script(
          "//g.alicdn.com/cloudcallcenter-voip/agentbar-sdk/2.7.8/index.js",
          function() {
            that.load_script(
              "https://g.alicdn.com/acca/workbench-sdk/0.9.6/workbenchSdk.min.js",
              function() {
                // that.load_script(
                //   "https://cdn.bootcss.com/jquery/3.4.1/jquery.js",
                //   function() {
                    that.initSDK();
                  // }
                // );
              }
            );
          }
        );
      }
    );
  },
  methods: {
    load_script(url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (script.readyState) {
        //IE
        script.onreadystatechange = function() {
          if (
            script.readyState == "loaded" ||
            script.readyState == "complete"
          ) {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        //others
        script.onload = function() {
          callback();
        };
      }
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script); // document.body.appendChild(script);
    },
    initSDK() {
      var DDLH = window.localStorage.getItem('hasWorkbenchSdkDDLH')
      console.log(DDLH, window.location.href)
      console.log(localStorage.getItem('workbenchSdkStatus'), localStorage.getItem('workbench'))
      
      let workbenchSdkStatus = localStorage.getItem('workbenchSdkStatus')
      if(DDLH && DDLH == 'true' && workbenchSdkStatus!=-1){
        console.log('同一个浏览器已经注册过了，')
        this.initAlicc();
        // if(window.localStorage.getItem('LoginStatus') && window.localStorage.getItem('LoginStatus') == 'true'){
        //   this.dialogVisible = true;
        // }
        // this.resetSetItem('watchStorage', localStorage.getItem('workbenchSdkStatus'));
      }else{
        this.getToken()
      }
  },
  getToken(){
    let that = this;
    $.ajax({
      url : 'https://alicall.net.cn/aliccc/token?userId=1',
      data:{},
      cache : false,
      async : true,//异步请求
      type : "POST",
      contentType:'application/x-www-form-urlencoded',
      // dataType : 'Json',
      success : function (res){
          console.log('成功');
          that.initAlicc();
      }
    });
  },
  
  initAlicc(st){
    var that = this;
    console.log('WorkbenchSdk')
    window.workbench = new window.WorkbenchSdk({
      dom: "workbench-container",
      width: "320px",
      height: "550px",
      instanceId: "ee0cd08d-29e4-4f11-bed0-e313feb4d077",
      ajaxPath: "/aliccc/api",
      ajaxOrigin: 'https://alicall.net.cn', //请求源
      ajaxMethod: "post",
      ajaxHeaders:{
        userId: 1
      },
      afterCallRule: 15,  // 挂机后的话后处理时间
      header: true,
      // autoAnswerCall: 8,  // 有来电振铃响8s后自动接听
      useOpenApiSdk: true,
      exportErrorOfApi: true,
      moreActionList: ["mobilePhoneAnswer", "break", "offline"],
      defaultVisible: false,  //默认的面板
      useLocalStorageToCall: true, //允许使用多标签页外呼
      onInit: function () {
        if(!st){
          
          console.log(window.localStorage.getItem('LoginStatus'))
          let watchStorage = sessionStorage.getItem('watchStorage');
          if(watchStorage != '-1' && watchStorage != '0' && watchStorage != '1' && watchStorage != '4' && window.localStorage.getItem('LoginStatus') != 'true'){
            window.workbench.register() // 想实现自动上线在此注册
          }
        }
          
          
      },
      onBeforeCallDialing: function (payload) {
          console.log('onBeforeCallDialing----->', payload)
          if (payload.callee) {
              // 执行callback调用 拨打电话
              payload.callback();
          }
      },
      onErrorNotify: function (error) {
          console.warn(error)
          // that.getToken();
      },
      onCallComing: function (connid, caller, callee, contactId, skillgroupId) {
          console.log(connid, caller, callee, contactId, skillgroupId);

          window.eventBus.$emit('caller', caller);
          
      },
      onCallDialing: function (connid, caller, callee, contactId) {
          console.log(connid, caller, callee, contactId);
      },
      onStatusChange: function (code, lastCode, context) {
          console.log(code, lastCode, context);
          if(code != 0  && code != 1 && code != -1){
            console.log(window.workbench)
            // window.localStorage.setItem('workbench', JSON.stringify(window.workbench))
            window.localStorage.setItem('hasWorkbenchSdkDDLH', 'true')
          }else{
            // window.localStorage.setItem('workbench', null)

            window.localStorage.setItem('hasWorkbenchSdkDDLH', 'false')
          }
          window.eventBus.$emit('getAliCode', code);
          that.resetSetItem('watchStorage', code);

      },
      onCallEstablish: function (connid, caller, privateData) {
          console.log("这里是通话建立时触发的回调函数", connid, caller, privateData)
          var value = {
                    callee: '17322300397',
                    caller:'',
                    publicKey: '',
                    useVirNumCall: true,
                    random: Math.random()
                }
                localStorage.setItem('workbenchSdkCall', JSON.stringify(value))
      },
      onCallRelease: function (connid, caller, privateData) {
          console.log("这里是通话结束时触发的回调函数", connid, caller, privateData)
          localStorage.setItem('workbenchSdkHangup',  Math.random())
      },
      onHangUp: function (type) {
          console.log("这里是onHangUp事件，type =" + type)
          localStorage.setItem('workbenchSdkHangup',  Math.random())
      }
    });
    if(window.localStorage.getItem('LoginStatus') && window.localStorage.getItem('LoginStatus') == 'true'){
      this.dialogVisible = true;
    }
  },
  handleClose(){
    this.dialogVisible = false;
    window.localStorage.setItem('LoginStatus', false)
  },
  changeStatus(){
    // 切换到上线状态
    console.log(window.workbench.getStatus())
    if(window.workbench.getStatus() == 'off'){
        window.workbench.register();
        this.dialogVisible = false;
        window.localStorage.setItem('LoginStatus', null)
    }
    
  }
  }
};
</script>

<style lang="scss" scoped>
</style>



