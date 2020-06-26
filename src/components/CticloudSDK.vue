<template>
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
</template>

<script>
//退出
function doLogout() {
  var params = {};
  params.logoutMode = 1;
  params.removeBinding = 0;
  CTILink.Agent.logout(params, function(result) {
    if (result.code == 0) {
      //退出成功
    }
  });
}

//置忙
function doPause() {
  var params = {};
  params.pauseType = 1;
  params.pauseDescription = "置忙";
  CTILink.Agent.pause(params);
}

//置闲
function doUnpause() {
  CTILink.Agent.unpause();
}

//预览外呼
function doPreviewOutcall(tel) {
  var params = {};
  params.tel = tel;
  CTILink.Agent.previewOutcall(params);
}

/** 通话状态下的操作 */
//挂断
function doUnlink() {
  if (CTILink.Session.isSessionAlive()) {
    CTILink.Session.unlink();
  }
}

//咨询
function doConsult(tel) {
  if (CTILink.Session.isSessionAlive()) {
    var params = {};
    params.objectType = 0;
    params.consultObject = tel;
    CTILink.Session.consult(params);
  }
}

/** 事件处理 */
//处理状态事件
function handleState(event) {
  console.log(event);

  //座席状态描述 : 离线，失效，空闲，置忙，整理，呼叫中，响铃，通话
  var stateShow = event.state;
  switch (event.state) {
    case "离线":
      break;
    case "失效":
      //软电话状态, 退出
      doLogout();
      break;
    case "空闲":
      break;
    case "置忙":
      break;
    case "呼叫中":
      break;
    case "响铃":
      switch (event.stateAction) {
        case "ringingIb": //呼入座席响铃
          break;
        case "ringingAgentOb": //外呼座席响铃
          break;
        case "ringingCustomerOb": //外呼客户响铃
          break;
      }
      break;
    case "通话":
      switch (event.stateAction) {
        case "busyIb": //呼入座席接听
          break;
        case "busyOb": //外呼客户接听 客户和座席通话
          break;
        case "hold": //保持开始
          stateShow = "保持";
          break;
        case "unhold": //保持结束
          break;
        case "consultStart": //咨询开始
          break;
        case "consultLink": //咨询成功
          stateShow = "咨询";
          break;
        case "busyConsult": //被咨询转接或转移的通话
        case "busyTransfer":
          break;
        case "consultThreeway":
          stateShow = "咨询三方";
        default:
      }
      break;
    case "整理": //整理开始（座席挂断）
      break;
  }
  console.log(event.state, event.stateAction);
  // $('#status').html(event.state);
  // $('#stateAction').html(event.stateAction);
  window.eventBus.$emit("stateAction", event.stateAction);
  window.localStorage.setItem('stateAction', event.stateAction)
  if(event.stateAction == 'ringingIb') {
    window.eventBus.$emit("customerNumber", event.customerNumber);
  }
}

//弹屏
function handleRinging(event) {
  console.log("弹屏");
}

//被踢下线
function handleKickout(event) {
  if (event.code == 0) {
    //被踢下线
    console.log("被踢下线,需要重新登录");
  }
}

//拒接
function refuse() {
  var params = {};
  params.description = "忙碌";
  CTILink.Session.refuse(params);
}
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  created() {
    let that = this;
    that.load_script(
      "//agent-gateway-1.cticloud.cn/js/agent/v10/cti-link.js",
      function() {
        that.load_script(
          "//lib.sinaapp.com/js/jquery/3.1.0/jquery-3.1.0.min.js",
          function() {
            that.load_script(
              "//cdn.bootcss.com/blueimp-md5/2.13.0/js/md5.min.js",
              function() {
                that.initSDK();
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
      let that = this;
      // $(document).ready(function () {
      CTILink.setup({ webrtc: true, debug: true }, function() {
        //CTILink加载完成

        //注册事件处理方法
        /** 状态事件 */
        CTILink.event("status", handleState); //当前座席状态
        CTILink.event("previewOutcallRinging", handleState); //外呼座席响铃
        CTILink.event("previewOutcallBridge", handleState); //外呼接通
        CTILink.event("consultStart", handleState); //咨询开始
        CTILink.event("consultLink", handleState); //咨询接听
        CTILink.event("consultError", handleState); //咨询失败
        CTILink.event("unconsult", handleState); //咨询挂断/接回/取消
        CTILink.event("consultThreeway", handleState); //咨询三方
        CTILink.event("consultThreewayUnlink", handleState); //咨询三方挂断
        CTILink.event("consultTransfer", handleState); //咨询转移

        /** 其他事件 */
        CTILink.event("ringing", handleRinging); //弹屏
        CTILink.event("kickout", handleKickout); //被踢下线
        if(window.localStorage.getItem('c_LoginStatus') && window.localStorage.getItem('c_LoginStatus') == 'true'){
          that.dialogVisible = true;
        }else{
          //自动登录
          let c_use_tel = window.localStorage.getItem('c_use_tel');
          if(c_use_tel == 3){
              that.doLogin();
          }else if(c_use_tel == 1){
              that.doLogin('17322300397', 1);
          }
        }

        
      });
      // });
    },
    //登录
    doLogin(bindTel='100002', bindType=3) {
      //调用座席登录权限验证接口获取sessionKey, qids和webSocketUrl等参数

      var departmentId = "BM3000527";
      var crmId = "0001";
      var timestamp = parseInt(new Date().getTime() / 1000);
      var token = "acfd80b3a36bec1acd79da0710684687";
      var sign = md5(departmentId + timestamp + token);

      var url =
        "https://api-test-2.cticloud.cn/interface/v10/agentLogin/authenticateJsonp";
      url +=
        "?validateType=1&departmentId=" +
        departmentId +
        "&crmId=" +
        crmId +
        "&timestamp=" +
        timestamp +
        "&sign=" +
        sign;
      $.ajax({
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback",
        url: url,
        success: function(r) {
          var data = eval("(" + r + ")");
          if (data != undefined && data.result == "0") {
            var params = {};
            params.sessionKey = data.sessionKey;
            params.enterpriseId = data.enterpriseId; //
            params.cno = data.cno;
            params.bindTel = bindTel; //'100002' 自己的手机号或者分机号，请查看 bindType 
            params.bindType = bindType; //1普通电话，2分机，3软电话
            params.loginStatus = 1;
            params.webSocketUrl = data.agentGateWayUrl;
            params.qids = data.qids; //班长席时返回

            CTILink.Agent.login(params, function(result) {
              if (result.code == 0) {
                //座席登录成功
                console.log("登录成功");
                console.log(result);
                
              } else {
                //座席登录失败，失败原因： + result.msg
                console.log(result);
              }
            });
          }
        },
        error: function(r) {
          //登录失败，接口请求错误
        }
      });
    },
    handleClose(){
      this.dialogVisible = false;
      window.localStorage.removeItem('c_LoginStatus');
      window.eventBus.$emit("stateAction", 'offline');
      window.localStorage.setItem('stateAction', 'offline')
    },
    changeStatus(){
      // 切换到上线状态
      this.doLogin();
      window.sessionStorage.setItem('c_RLtransferStatus','1');
      this.dialogVisible = false;
      window.localStorage.removeItem('c_LoginStatus');
      
    }
  }
};
</script>

<style lang="scss" scoped>
</style>



