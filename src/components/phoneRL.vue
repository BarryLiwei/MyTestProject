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
    <div class="RL-BOX remote-places">
      <div id="softphonebar" style="position: relative;">
        <div class="mrg5" id="peerStatus">
          <span id="phoneAgentStatus">
            <a
              href="#"
              onclick="javascript:phone.m7SetBusy(false,'0')"
              id="IdleDisable"
              class="IdleDisable userStatus"
              style="color: #53d466;"
            >
              <span class="ponit" style="background-color: #53d466;"></span>空闲
              <span class="line"></span>
            </a>
            <a
              href="#"
              onclick="javascript:phone.m7SetBusy(true,'2')"
              id="RestDisable"
              class="RestDisable userStatus"
            >
              <span class="ponit"></span>小休
              <span class="line"></span>
            </a>
            <a
              href="#"
              onclick="javascript:phone.m7SetBusy(true,'1')"
              id="BusyDisable"
              class="BusyDisable userStatus"
            >
              <span class="ponit"></span>忙碌
              <span class="line"></span>
            </a>
            <span id="phoneConfigStatus"></span>
          </span>
          <span class="softphone_timer">
            <span id="softphonebar.peerState" style="margin-left: 10px"></span>
            <span id="softphonebar.peerTimeState" class="peerTimeState">00:00:00</span>
          </span>
        </div>
        <div class="mrg5" id="callStatus">
          <input
            type="text"
            id="moorCall-dialout-input"
            placeholder="输入手机号"
            value=""
            onKeyDown="if(event.keyCode == 13){softphoneBar.dialout(m7$('#moorCall-dialout-input').val())}"
            class="ipt fl"
          >
          <ul id="callStatusList">
            <li>
              <a href="#" class="DialEnable" id="DialEnable" @click="diaLoutVue()" onclick>
                外呼
                <span class="icon outcallIcon"></span>
              </a>
              <a href="#" class="DialDisable disable" id="DialDisable" style="display: none">
                外呼
                <span class="icon outcallIcon"></span>
              </a>
            </li>
            <li style="display:none">
              <a
                href="#"
                class="DialEnable"
                id="smallDialEnable"
                style="width: 102px;"
                onclick="softphoneBar.dialout(m7$('#moorCall-dialout-input').val(), 'smallPhone')"
              >
                小号外呼
                <span class="icon outcallIcon"></span>
              </a>
              <a
                href="#"
                class="DialDisable disable"
                id="smallDialDisable"
                style="display: none;width: 102px;"
              >
                小号外呼
                <span class="icon outcallIcon"></span>
              </a>
            </li>
            <li>
              <!-- <a href="#" class="HangupEnable" id="HangupEnable" style="display: none"
                              onClick="javascript:phone.hangup()">挂机
                                  <span class="icon handupIcon"></span>
              </a>-->
              <a href="#" class="HangupEnable" id="HangupEnable" @click="hangupVue()" onclick>
                挂机
                <span class="icon handupIcon"></span>
              </a>
              <a href="#" class="HangupDisable disable" id="HangupDisable">
                挂机
                <span class="icon handupIcon"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="HoldEnable"
                id="HoldEnable"
                style="display: none"
                onClick="phone.hold();"
              >
                保持
                <span class="icon holdIcon"></span>
              </a>
              <a href="#" class="HoldDisable disable" id="HoldDisable">
                保持
                <span class="icon holdIcon"></span>
              </a>
              <a
                href="#"
                class="HoldGetEnable"
                id="HoldGetEnable"
                style="display: none"
                onClick="phone.unhold();"
              >
                继续
                <span class="icon holdIcon"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="TransferEnable"
                id="TransferEnable"
                style="display: none"
                onClick="javascript:softphoneBar.m7ToTransfer();"
              >
                转移
                <span class="icon transferIcon"></span>
              </a>
              <a href="#" class="TransferDisable disable" id="TransferDisable">
                转移
                <span class="icon transferIcon"></span>
              </a>
              <a
                href="#"
                class="TransferEnable"
                id="ConsultTransferEnable"
                style="display: none"
                onclick="javascript:phone.transfer('9333333','external', {})"
              >
                转移
                <span class="icon transferIcon"></span>
              </a>
              <a href="#" class="TransferDisable" id="ConsultTransferDisable" style="display: none">
                转移
                <span class="icon transferIcon"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="ConsultEnable"
                id="ConsultEnable"
                style="display: none"
                onclick="javascript:softphoneBar.m7ToConsult();"
              >
                咨询
                <span class="icon webchatIcon"></span>
              </a>
              <a href="#" class="ConsultDisable disable" id="ConsultDisable">
                咨询
                <span class="icon webchatIcon"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="StopConsultEnable disable"
                id="StopConsultDisable"
                style="width: 102px"
              >
                结束咨询
                <span class="icon webchatIcon"></span>
              </a>
              <a
                href="#"
                class="StopConsultEnable"
                id="StopConsultEnable"
                style="width: 102px;display:none;"
                onclick="javascript:phone.stopConsult();"
              >
                结束咨询
                <span class="icon webchatIcon"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="ThreeWayCallEnable"
                id="ThreeWayCallEnable"
                style="display: none;width: 102px"
                onclick="javascript:softphoneBar.toThreeWayCall();"
              >
                三方通话
                <span class="icon threeWaycall"></span>
              </a>
              <a
                href="#"
                class="ThreeWayCallDisable disable"
                id="ThreeWayCallDisable"
                style="width: 102px"
              >
                三方通话
                <span class="icon threeWaycall"></span>
              </a>
              <a
                href="#"
                class="ThreeWayCallEnable"
                id="ConsultThreeWayCallEnable"
                style="display: none;width: 102px"
                onclick="javascript:phone.threeWayCall('9333333')"
              >
                三方通话
                <span class="icon threeWaycall"></span>
              </a>
              <a
                href="#"
                class="ThreeWayCallDisable"
                id="ConsultThreeWayCallDisable"
                style="display: none;width: 102px"
              >
                三方通话
                <span class="icon threeWaycall"></span>
              </a>
            </li>
            <li>
              <a href="#" class="StopConsultEnable disable" id="transferIVR" style="width: 110px">
                转IVR菜单
                <span class="icon transferIcon"></span>
              </a>
              <a
                href="#"
                class="StopConsultEnable"
                id="transferIVREnable"
                style="width: 110px;display:none;"
                onclick="javascript:phone.m7Phone_toMenu('');"
              >
                转IVR菜单
                <span class="icon transferIcon"></span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="transferSatisfaction disable"
                id="transferSatisfaction"
                style="width: 130px"
              >
                转满意度评价
                <span class="icon transferSatisfactionIcon"></span>
              </a>
              <a
                href="#"
                class="transferSatisfaction"
                id="transferSatisfactionEnable"
                style="width: 130px;display:none;"
                onclick="javascript:phone.investigate();"
              >
                转满意度评价
                <span class="icon transferSatisfactionIcon"></span>
              </a>
            </li>
          </ul>
        </div>
        <div id="netMessage"></div>
      </div>
      <!-- <iframe id="moorCall.iframe" style="display: none"></iframe> -->

      <div id="moorCall_minitor">
        <div class="task_title"></div>
        <div class="task_content">
          <div class="form_area" style="padding: 0px 10px 10px">
            <div style="width:100%;padding-bottom:1px;">
              <div class="grid">
                <div class="gridhead">
                  <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
                    <colgroup>
                      <col width="100%">
                    </colgroup>
                    <thead class="monitor_thead">
                      <tr>
                        <th colspan="4" align="left">
                          <div class="monitor_thead_title">服务号监控列表</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="padding-left: 1px;">
                          <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <!-- <colgroup>
                                                          <COL width="10%" span="4">
                            </colgroup>-->
                            <tr id="icc.monitor.serviceNos.thead">
                              <td
                                align="center"
                                style="cursor:pointer;"
                                id="icc.monitor.serviceNosTd"
                                onclick="tablesort.sortTable(this, 'icc.monitor.serviceNos', 0, 'string');"
                              >
                                <span>服务号码</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.serviceNos', 1, 'int');"
                              >
                                <span>今日外部来电数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.serviceNos', 2, 'int');"
                              >
                                <span>今日未接外部来电</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.serviceNos', 3, 'int');"
                              >
                                <span>今日已接外部来电</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="griddata">
                  <div>
                    <table id="icc.monitor.serviceNos" width="100%" cellspacing="0" cellpadding="0">
                      <colgroup>
                        <col width="100%">
                      </colgroup>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="grid" style="width:100%;float:left;padding:20px 0 30px 0;">
                <div class="gridhead">
                  <table width="100%" height="100%" cellspacing="0" cellpadding="0">
                    <colgroup>
                      <col width="100%">
                    </colgroup>
                    <thead class="monitor_thead">
                      <tr>
                        <th colspan="5" align="left">
                          <div class="monitor_thead_title">技能组监控列表</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="padding-left: 1px;">
                          <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <colgroup>
                              <col width="10%" span="5">
                            </colgroup>
                            <tr id="icc.monitor.queues.thead">
                              <td
                                align="center"
                                style="cursor:pointer;"
                                id="icc.monitor.queuesTd"
                                onclick="tablesort.sortTable(this, 'icc.monitor.queues', 0, 'string');"
                              >
                                <span>技能组名称</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.queues', 1, 'int');"
                              >
                                <span>空闲座席数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.queues', 2, 'int');"
                              >
                                <span>签入座席数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.queues', 3, 'int');"
                              >
                                <span>排队数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td
                                align="center"
                                style="cursor:pointer;"
                                onclick="tablesort.sortTable(this, 'icc.monitor.queues', 4, 'int');"
                              >
                                <span>今日接通电话数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="griddata">
                  <div>
                    <table id="icc.monitor.queues" width="100%" cellspacing="0" cellpadding="0">
                      <colgroup>
                        <col width="100%">
                      </colgroup>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="grid" style="width:100%;float:left;">
                <div class="gridhead">
                  <table width="100%" height="100%" cellspacing="0" cellpadding="0">
                    <colgroup>
                      <col width="100%">
                    </colgroup>
                    <thead class="monitor_thead">
                      <tr>
                        <th colspan="10" align="left">
                          <div class="monitor_thead_title" style="display:none">
                            座席监控列表&nbsp;&nbsp;(坐席总量:
                            <span
                              id="icc.monitor.agents.totalPeer"
                              style="color:#dc4f4f"
                            ></span>&nbsp;&nbsp;在线坐席:
                            <span
                              id="icc.monitor.agents.onlinePeer"
                              style="color:#dc4f4f"
                            ></span>&nbsp;&nbsp;空闲坐席:
                            <span
                              id="icc.monitor.agents.idlePeer"
                              style="color:#dc4f4f"
                            ></span>)
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th style="padding-left: 1px;">
                          <table
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                            width="100%"
                            style="border: none"
                          >
                            <colgroup>
                              <col width="9%">
                              <col width="7%">
                              <col width="9%">
                              <col width="9%">
                              <col width="11%">
                              <col width="9%">
                              <col width="9%">
                              <col width="9%">
                              <col width="9%">
                              <col width="19%">
                            </colgroup>
                            <tr id="icc.monitor.agents.thead" class="first-tr">
                              <td align="center" style="cursor:pointer;" id="icc.monitor.agentsTd">
                                <span class="headTitle">座席姓名</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td align="center" style="cursor:pointer;">
                                <span class="headTitle">工号</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td align="center" style="cursor:pointer;">
                                <span class="headTitle">已接听数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td align="center" style="cursor:pointer;">
                                <span class="headTitle">外呼成功数</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td align="center" class="headTitle">客户号码</td>
                              <td align="center" class="headTitle">接听方式</td>
                              <td align="center" style="cursor:pointer;">
                                <span class="headTitle">状态</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td align="center" class="headTitle">状态时长</td>
                              <td align="center" style="cursor:pointer;">
                                <span class="headTitle">网络延迟</span>
                                <span style="width:15px;">&nbsp;</span>
                                <span name="currentState"></span>
                              </td>
                              <td align="center" class="headTitle">操作</td>
                            </tr>
                          </table>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="griddata">
                  <div>
                    <table id="icc.monitor.agents" width="100%" cellspacing="0" cellpadding="0">
                      <colgroup>
                        <col width="100%">
                      </colgroup>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div style="height:10px;overflow: hidden;clear: both">&nbsp;</div>
          </div>
        </div>
      </div>
      <div id="cover" style="display: none"></div>
    </div>
    
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialogVisible: false,
      show: true,
      statusText: '',  //区分状态（失效）
      callStatusTimer: '',
      transferTelWay: 'gateway', // 接听方式
    };
  },
  computed: {
        ...mapState(["loginType", "agentInfo"]),
    },
  created() {
    if (!window.m7$ || window.localStorage.getItem('c_LoginStatus') == 'true') {
      let that = this;
      that.load_script("../../../static/edb/js/jq/jquery.js", function() {
        that.load_script("./static/edb/moor/moor.js", function() {
          that.load_script("../../../static/edb/js/m7Util.js", function() {
            that.load_script("../../../static/edb/js/moortools.js", function() {
              that.load_script(
                "../../../static/edb/js/m7PhoneBar.js",
                function() {
                  //全部载入后的操作...
                  that.load_script(
                    "../../../static/edb/js/objectDeclare.js",
                    function() {
                      //全部载入后的操作...
                      that.load_script(
                        "../../../static/edb/js/recordError.js",
                        function() {
                          //全部载入后的操作...
                          that.load_script(
                            "../../../static/edb/js/m7Monitor.js",
                            function() {
                              //全部载入后的操作...
                              that.load_script(
                                "../../../static/edb/js/crypto/md5.min.js",
                                function() {
                                  //全部载入后的操作...
                                  that.load_script(
                                    "../../../static/edb/js/crypto/base64.min.js",
                                    function() {
                                      //全部载入后的操作...
                                      console.log("initRLSDK");
                                      that.initRLSDK();
                                      console.log("initRLSDK--- -end");
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      });
      //引入cti.css文件 会造成其他全局样式的改动，暂时不引入
      // that.linkScript("../../../static/edb/css/cti.css");
    }
    setTimeout(()=>{
      console.log(window.localStorage.getItem('c_LoginStatus') , window.localStorage.getItem('c_LoginStatus') == 'true')
    })
    console.log(window.localStorage.getItem('c_LoginStatus') , window.localStorage.getItem('c_LoginStatus') == 'true')
    if((this.loginType == 'invite' || this.loginType == 'group') && window.localStorage.getItem('c_LoginStatus') && window.localStorage.getItem('c_LoginStatus') == 'true'){
      this.dialogVisible = true;
    }

    window.eventBus.$on("diaLoutBus", param => {
      // 创建时，进行事件onb1监听
      this.diaLoutVue(param);
    });
    window.eventBus.$on("hangupBus", param => {
      // 创建时，进行事件onb1监听
      console.log("receive onb2", param);
      this.hangupVue();
    });
    // window.eventBus.$on("m7SetBusyBus", param => {
    //   // 创建时，进行事件onb1监听
    //   console.log("receive m7SetBusyBus", param);
    //   this.m7SetBusy(param.p1,param.p2);
    // });

    //监听容联返回的事件（来电弹屏m7Ring、外呼振铃onDialing、接听方法EvtConnected、挂机方法onHangup、软电话条注销方法m7logout）
    // window.eventBus.$off('objectDeclareFuncRLBus'); //重新登录后可能触发多次事件
    window.eventBus.$on("objectDeclareFuncRLBus", param => {
      // 创建时，进行事件objectDeclareFuncRLBus监听
      console.log("receive objectDeclareFuncRLBus:", param);
      this.$eventHub.$emit('objectDeclareFuncRLvueBus', param);  //通知自己系统
      // switch(param.type){
      //   case 'm7Ring':  //来电弹屏的时候需要知道来电信息
      //     this.$eventHub.$emit('m7RingRLBus', param.data)
      //     break;
      //   case 'onDialing':
      //     this.$eventHub.$emit('onDialingRLBus', param.data)
      //     break;
      //   case 'EvtConnected':  //容联无法在网页接听
      //     this.$eventHub.$emit('EvtConnectedRLBus', param.data)
      //     break;
      //   default:
      //     break;
      // }
    });


  },
  mounted(){
    console.log(document.getElementById('softphonebar.peerState'));
    this.statusText = document.getElementById('softphonebar.peerState');
  },
  methods: {
    load_script(url, callback) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (url == "./static/edb/moor/moor.js") {
        script.djConfig = "isDebug:false, parseOnLoad:false";
      }
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
    //异步加载css文件
    linkScript(parm, fn) {
      var Head = document.getElementsByTagName('head')[0],style = document.createElement('style');
      var linkScript;
      if (/\.css[^\.]*$/.test(parm)) {
        linkScript = document.createElement("link");
        linkScript.type = "text/" + "css";
        linkScript.rel = "stylesheet";
        linkScript.href = parm;
      } else {
        linkScript = document.createElement("script");
        linkScript.type = "text/" + "javascript";
        linkScript.src = parm;
      }
      Head.insertBefore(linkScript, Head.lastChild);
      linkScript.onload = linkScript.onerror = function() {
        if (fn) fn();
      };
    },
    initRLSDK() {
      if(!this.agentInfo.thirdSeat){
        return;
      }
      let c_use_tel = window.localStorage.getItem('c_use_tel');
      if(c_use_tel == 3){
          this.transferTelWay = 'sip';
      }else if(c_use_tel == 1){
          this.transferTelWay = 'Local';
      }else if(c_use_tel == 2){
          this.transferTelWay = 'gateway';
      }
      window.m7$ = $.noConflict();

      //  window.m7$(window).load(function(){

      // var loginName = moorCall.moortools.m7getUrlVal("loginName");
      // var password = moorCall.moortools.m7getUrlVal("password");
      // var loginType = moorCall.moortools.m7getUrlVal("loginType");
      // var agentStatus = moorCall.moortools.m7getUrlVal("agentStatus");
      var extenType = "";
      var loginName = this.agentInfo.thirdSeat.loginName || "8000@qdxmt",
        password = this.agentInfo.thirdSeat.loginPwd || "#TFliuf8GRc8000",
        loginType = "Local",
        agentStatus = "0";
      if (loginType != "") {
        extenType = loginType;
      }
      if (agentStatus === "0") {
        m7$("#IdleDisable").css("color", "#53d466");
        m7$("#IdleDisable")
          .find("span")
          .css("background-color", "#53d466");
        m7$("#BusyDisable").css("color", "#8a8a8a");
        m7$("#BusyDisable")
          .find("span")
          .css("background-color", "#8a8a8a");
        m7$(".peerTimeState").css("color", "#53d466");
      } else {
        m7$("#IdleDisable").css("color", "#8a8a8a");
        m7$("#IdleDisable")
          .find("span")
          .css("background-color", "#8a8a8a");
        m7$("#BusyDisable").css("color", "#ff7a72");
        m7$("#BusyDisable")
          .find("span")
          .css("background-color", "#ff7a72");
        m7$(".peerTimeState").css("color", "#ff7a72");
      }
      
      console.log(softphoneBar);
      if((this.loginType == 'invite' || this.loginType == 'group') && window.localStorage.getItem('c_LoginStatus') && window.localStorage.getItem('c_LoginStatus') == 'true'){
        this.dialogVisible = true;
        // moorCall.moortools.m7BeginLogon(
        //   "8000@qdxmt",
        //   "#TFliuf8GRc8000",
        //   transferTelWay,  // sip 工作号 ， Local 私人号码
        //   "0"
        // );
      }else if(window.sessionStorage.getItem('c_RLtransferStatus') != '3'){
        console.log('登录zhong 、、登录方式：',this.transferTelWay, window.sessionStorage.getItem('c_RLtransferStatus') != '3')
        let work = this.$route.path.indexOf('/work') > -1
        console.log("是否为工作台:", work)
        if (work) {
          setTimeout(()=>{
            let loginName = this.agentInfo.thirdSeat.loginName || '8000@qdxmt';
            let loginPwd = this.agentInfo.thirdSeat.loginPwd || '#TFliuf8GRc8000';
            moorCall.moortools.m7BeginLogon(
              loginName,
              loginPwd,
              this.transferTelWay,  // sip 工作号 ， Local 私人号码
              "0"
            );
          }, 0)
        } else {
          window.sessionStorage.setItem('c_RLtransferStatus', 3)
        }
        
      }
      // });
    },
    // 呼出
    diaLoutVue(data) {
      console.log("触发呼出事件", data);
      // softphoneBar.dialout(m7$('#moorCall-dialout-input').val(), '')
      softphoneBar.dialout(data.tel, "", data.dccGroupId);

      // console.log("=========2020-06-05 由后台转拨=========")
      // const { thirdSeat, admin } = this.agentInfo;
      // console.log(this.transferTelWay)
      // let callType = this.transferTelWay == 'Local' ? 1 : this.transferTelWay == 'sip' ? 2 : 3; // 1手机，2SIP，3软电话
      // let showTel = callType == 1 ? '' : thirdSeat.tel;

      // let agentInfo = JSON.parse(window.localStorage.getItem('agentInfo'))
      // let roleKey = agentInfo.role.role_key;
      // let id = agentInfo.admin.id;
      // let dccGroupIdParam = data.dccGroupId ? ',dccGroupId:' + data.dccGroupId:'';
      // let ActionID3 = "roleKey:" + roleKey + ",id:" + id + ",times:" + new Date().getTime() + dccGroupIdParam;

      // let params = {
      //   agentNo: thirdSeat.thirdId || 8000, // 坐席工号
      //   tel: data.tel,  // 被呼叫号码
      //   param: ActionID3,  // 附加参数
      //   callType,  // 呼叫类型
      //   showTel, // 外显电话
      // }
      // console.log(params)
      // this.handleOutCall(params);
    },
    // 执行外呼
    handleOutCall(params) {
      this.$fetch.dccSeat.outCall(params).then((res) => {
        this.$handleResponse(res, data=>{
          console.log(data)
        });
      })
    },
    hangupVue() {
      console.log("触发挂机事件");
      phone.hangup();
    },
    handleClose(){
      this.dialogVisible = false;
      window.localStorage.removeItem('c_LoginStatus');
    },
    changeStatus(){
      // 切换到上线状态
      if(this.agentInfo.thirdSeat){
        let loginName = this.agentInfo.thirdSeat.loginName; //8000@qdxmt
        let loginPwd = this.agentInfo.thirdSeat.loginPwd; //#TFliuf8GRc8000

        moorCall.moortools.m7BeginLogon(
          loginName,
          loginPwd,
          "sip",  // sip 工作号 ， Local 私人号码
          "0"
        );
      }
      console.log('登录zhong 、、登录方式：sip', )
      window.sessionStorage.setItem('c_RLtransferStatus','1');
      window.eventBus.$emit('c_RLtransferStatus', '1');
      this.dialogVisible = false;
      window.localStorage.removeItem('c_LoginStatus');
      
    },

  },
  beforeDestroy() {
    window.eventBus.$off("diaLoutBus"); // 销毁时，事件onb1监听取消
    window.eventBus.$off("hangupBus"); // 销毁时，事件onb1监听取消
    window.eventBus.$off("objectDeclareFuncRLBus"); // 销毁时，事件监听取消
    console.log("listener was closed");
    clearTimeout(this.callStatusTimer);
  }
};
</script>
<style style lang="scss" scoped>
// 不希望看见你，去到遥远的地方
.remote-places{
    // z-index: -999999;
    // position: absolute;
    // top: -9999px;
    // right: -9999px;
    display: none;
}
</style>
<style>
.dialoutCenterBox {
	border-radius: 6px;
	background: #ffffff;
	position: absolute;
	font: 12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif;
	z-index: 10001;
}
.dialoutCenterBox .confirm {
	color: #ffffff;
	background-color: #4DB690;
	width: 52px;
	height: 30px;
	display: block;
	line-height: 30px;
	text-decoration: none;
	border-radius: 4px;
	margin-left: 30px;
}
</style>


