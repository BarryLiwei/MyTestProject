<template>
    <div class="dcc-invite-component">
        <top-bar></top-bar>
        <div class="dcc-invite-content">
            <div id="workbench-container"></div>

            <input type="button" @click="call1()" value="打电话给1">
            <input type="button" @click="call2()" value="打电话给2">
            <input type="button" @click="hangUp()" value="挂机">
            <input type="button" @click="answer()" value="接听"/>

            <input type="button" @click="getStatus()" value="获取状态"/>


            <!-- <input type="button" @click="toggleMuteInCall()" value="通话中静音"/> -->
            <el-button v-if="toggleMuteInCallStatus" type="danger" icon="el-icon-turn-off-microphone" circle size="small" @click="toggleMuteInCall()"></el-button>
            <el-button v-if="!toggleMuteInCallStatus" type="info" icon="el-icon-turn-off-microphone" circle size="small" @click="toggleMuteInCall()"></el-button>

                
            <el-popover
            placement="right"
            width="400"
            trigger="click">
                <div>
                    <el-button type="danger" @click="ready()">在线</el-button>
                    <el-button type="danger" @click="applyForBreak()">忙碌</el-button>
                    <el-button type="danger" @click="logOut()">离线</el-button>

                </div>
            <el-button slot="reference" @click="visible = !visible">坐席状态：{{codeStatusText}}</el-button>
            </el-popover>



            <el-button @click="getLY()">录音详细信息</el-button>

            <el-button @click="offline()">手机接听</el-button>
            <el-button @click="online()">结束手机接听状态</el-button>



             <!-- 智能通话播放录音弹窗组件 -->
            <Aplayer :aplayData="aplayData" v-if="musicIsshow" @sendAplayer="sendAplayer"></Aplayer>
            <!-- <audio v-if="musicIsshow" :src="aplayData.voice_file" controls="controls" style="opacity: 1; transition: all 0.5s ease 0s; margin-top: -12px;">
                Your browser does not support the audio element.
            </audio> -->

            
            

        </div>

        <!-- 来电弹框 -->
        <!-- <IncomingCall v-if="dialogVisibleIncomeCall" @IncomeCallCloseFn="IncomeCallCloseFn"></IncomingCall> -->
        <!-- <phoneRL></phoneRL> -->
        


        <div class="dcc-invite-content">
            <!-- dcc邀约员 -->
        </div>
    </div>
</template>
<script type="text/javascript" src="./static/edb/js/jq/jquery.js"></script>


<script>
import TopBar from './components/TopBar'
import IncomingCall from "@/components/IncomingCall";
import phoneRL from "@/components/phoneRL";   //容联的软电话条

import Aplayer from "./components/AplayerDialog.vue";
export default {
    components:{
       TopBar,
       IncomingCall,
       phoneRL,
       Aplayer
    },
    data(){
        return{
            dialogVisibleIncomeCall: false,   //来电弹出
            dialogVisibleIncomeCallRL: false,  //来电弹出--- 容联
            showInCall2: '',
            toggleMuteInCallStatus: true,   //标志是否静音
            codeStatusText: '在线', //坐席状态
            musicIsshow: false, //播放录音
            aplayData:{},
            visible: ''       
        }
    },
    created(){
    eventBus.$off('getCode'); // 关闭上一次的监听
    eventBus.$on('getCode', (_code) => {
        // alert(`获取MAC地址：${_mac}`);
        console.log(_code)
        if(_code == 6){
            // this.dialogVisibleIncomeCall = true;
        }else if(_code == 5){   //通话结束后的话后处理  =》  话后处理时间之后是 3空闲

        }
        // 状态改变
        if(_code == -1 || _code == 0 || _code == 1){
            this.codeStatusText = "离线";
        }else if(_code == 4){
            this.codeStatusText = "忙碌";
        }else{
            this.codeStatusText = "在线";
        }
    });



    // 容联来电弹屏
    eventBus.$off('m7CallStateDescription_status'); // 关闭上一次的监听
    eventBus.$on('m7CallStateDescription_status', (_code) => {
        console.log(_code)
        if(_code == 'stInnerBelling' || _code == 'stBelling'){
            //来电振铃
            console.log('来电振铃')
            this.dialogVisibleIncomeCallRL = true;
        }else if(_code == 'stInvalid'){   //通话结束后的话后处理  =》  话后处理时间之后是 3空闲
            console.log('空闲')
        }
        
    });
    
    



    
    },
    mounted(){
          window.addEventListener('storage', function(){
            console.log('666')
            }, false)

          window.addEventListener("resize", function(){
            console.log('resize')
            },false);

        //   console.log(showInCall);
        //   this.showInCall2  = showInCall

        // 引入script标签
        // window.onload = ()=>{
            // this.addScriptTag("../../../static/edb/js/m7Util.js");
            // this.addScriptTag("../../../static/edb/js/moortools.js");
            // this.addScriptTag("../../../static/edb/js/m7PhoneBar.js");
            // this.addScriptTag("../../../static/edb/js/objectDeclare.js");
            // this.addScriptTag("../../../static/edb/js/recordError.js");
            // this.addScriptTag("../../../static/edb/js/m7Monitor.js");
            // this.addScriptTag("../../../static/edb/js/crypto/md5.min.js");
            // this.addScriptTag("../../../static/edb/js/crypto/base64.min.js");


        // }

        // setTimeout(()=>{
        //     console.log(softphoneBar, 'initRLSDK')
        //     this.initRLSDK();

        // }, 11)
        
        
        
        
    },
    
    methods:{
        
        sendAplayer() {
            this.musicIsshow = false;
        },
        call1() {
            window.workbench.call('15820723475');
        },
            
        call2() {
            // window.workbench.call('13790770703');
            
            if(window.workbench){
                window.workbench.call('17322300397');
            }else{
                var value = {
                    callee: '17322300397',
                    caller:'',
                    publicKey: '',
                    useVirNumCall: true,
                    random: Math.random()
                }
                localStorage.setItem('workbenchSdkCall', JSON.stringify(value))
            }

        },
        hangUp() {
            if(window.workbench){
                window.workbench.hangUp();
            }else{
                localStorage.setItem('workbenchSdkHangup',  Math.random())
            }
        },
        answer() {
            window.workbench.answer();
            console.log("接听电话，通过该方法可接听来电，建立通话连接。")
        },
        toggleMuteInCall(){
            window.workbench.toggleMuteInCall();
            this.toggleMuteInCallStatus = !this.toggleMuteInCallStatus
            console.log('通话中静音')
        },
        getStatus(){
            console.log('getStatus',  window.workbench.getStatus())
            let  status = window.workbench.getStatus()
            // 在线：可打，打听
            // 忙碌：可打，不可听
            // 离线：不可打，不可听
            if(status == 'ready'){
                console.log('空闲状态');
            }else if(status == 'break'){
                console.log('小休状态');
            }else if(status == 'off'){
                console.log('迁出状态')
            }
        },
        //签入（处于签出状态可调用），调用该方法实现上线操作
        logIn(){
            workbench.logIn();
        },
        //签出 下线操作
        logOut(){
            console.log('当前状态', window.workbench.getStatus())
            workbench.logOut();
        },
        // 置空闲、通过该方法可变为空闲状态，空闲状态后可接听、拨打电话。
        ready(){
            console.log('当前状态', window.workbench.getStatus())
            if(window.workbench.getStatus() == 'off'){
                this.logIn();
            }else{
                workbench.ready();
            }
            
        },
        applyForBreak(){
            console.log('当前状态', window.workbench.getStatus())
            workbench.applyForBreak(1, '临时有事')
        },

        offline(){
            workbench.offline('13410021985', '')
        },
        online(){
            workbench.online()
        },

        getLY(){
            //测试
            let audioObj = {"MediaDownloadParam":{
                "FileName":"158623046305100080354768.wav",
                "SignatureUrl":"\"http:\/\/cloudcallcenter-online.oss-cn-shanghai.aliyuncs.com\/record\/ee0cd08d-29e4-4f11-bed0-e313feb4d077\/158623046305100080354768.wav?Expires=1586246837&OSSAccessKeyId=LTAIvKWEr4DoFSqz&Signature=DWM8Qa1oPEuJYtK622sj3O%2FAPyY%3D\""
                },
                "HttpStatusCode":200,
                "Code":"OK",
                "Success":true
                }
            this.aplayData = {
                voice_file: JSON.parse(audioObj.MediaDownloadParam.SignatureUrl),
                customer_name: '',
                call_type: ''
            };
            this.musicIsshow = true;
            
            // this.ListRecordingsByContactId();  
        },
        ListCallDetailRecords(){
            console.log('获取通话详单')
            let par = {
                InstanceId: 'ee0cd08d-29e4-4f11-bed0-e313feb4d077',
                PageNumber: 1,
                PageSize: 10
            }

            $.ajax({
                url : 'https://alicall.net.cn/aliccc/api?action=ListCallDetailRecords',
                data:{
                    request:JSON.stringify(par)
                },
                cache : false,
                async : true,//异步请求
                type : "POST",
                contentType:'application/x-www-form-urlencoded',
                // dataType : 'Json',
                success : (res)=>{
                    console.log('res:', JSON.parse(res));
                    let data = JSON.parse(res).CallDetailRecords.List.CallDetailRecord;
                    data.forEach(element => {
                        this.ListRecordingsByContactId(element);
                    });
                }
            });
        },
        ListRecordingsByContactId(element){
            console.log('根据话务ID查询录音')
            // url: https://alicall.net.cn/aliccc/api?action=ListRecordingsByContactId
            let params = {
                InstanceId: 'ee0cd08d-29e4-4f11-bed0-e313feb4d077',
                // ContactId: element.ContactId
                ContactId: 2655891604
            }
            $.ajax({
                url : 'https://alicall.net.cn/aliccc/api?action=ListRecordingsByContactId',
                data:{
                    request:JSON.stringify(params)
                },
                cache : false,
                async : true,//异步请求
                type : "POST",
                contentType:'application/x-www-form-urlencoded',
                // dataType : 'Json',
                success : (res)=>{
                    let data = JSON.parse(res).Recordings.Recording;
                    console.log(data)
                    data.forEach(element => {
                        this.DownloadRecording(element.FileName);
                    });
                }
            });
        },
        DownloadRecording(FileName){
            console.log('根据话务ID查询录音')
            // url: https://alicall.net.cn/aliccc/api?action=DownloadRecording
            let params = {
                InstanceId: 'ee0cd08d-29e4-4f11-bed0-e313feb4d077',
                FileName: FileName
            }
            $.ajax({
                url : 'https://alicall.net.cn/aliccc/api?action=DownloadRecording',
                data:{
                    request:JSON.stringify(params)
                },
                cache : false,
                async : true,//异步请求
                type : "POST",
                contentType:'application/x-www-form-urlencoded',
                // dataType : 'Json',
                success : function (res){
                    console.log('成功');
                    // initAlicc();
                }
            });
        },


        addScriptTag(src){

            var script = document.createElement('script');

            script.setAttribute("type","text/javascript");

            script.src = src;

            document.body.appendChild(script);
        },

        


        
        IncomeCallCloseFn(){
            this.dialogVisibleIncomeCall = false;
        },
        IncomeCallRLCloseFn(){
            this.dialogVisibleIncomeCall = false;
        },
        reportParamsObjStorage() {
            // 一堆逻辑省略
            console.log(window.localStorage.getItem('hasWorkbenchSdk'))
            
            
        },
    },
    computed: {
        // // 计算属性的 getter
        // showInCall2: function () {
        // // `this` 指向 vm 实例
        // console.log(this.showInCall2)
        // return this.showInCall2
        // }
    },
    destroyed() {
        // window.removeEventListener('storage', this.reportParamsObjStorage)
    }
}
</script>

<style lang="scss" scoped>
.dcc-invite-content {
    margin-top: 160px;
}
</style>

