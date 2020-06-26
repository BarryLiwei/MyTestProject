<template>
    <div class="record-item-component">
        <div class="follow-content flex por">
            <div class="flex-1">
                <record-cell v-if="showBaseCell"  key="基本信息" :title="'基本信息'" :table="config.baseTable" :info="config.baseInfo"></record-cell>

                <record-cell v-if="showFouceCell" key="线索增强" :title="'线索增强'" :table="config.fouceTable" :info="config.fouceInfo"></record-cell>

                <record-cell v-if="showSingleCell" key="其它类" :showTitle="config.showTitle" :title="config.title" :table="config.table" :info="config.info"></record-cell>
                
                <div class="icon-position">
                    <span class="icon-item icon-comments" v-show="showCommentBtn&&!showEdit&& (record.followComment && record.followComment.sign)" @click="showEdit=true"></span>
                    <span class="icon-item icon-audio" v-if="record.callVoiceFile" @click="showAudio=true"></span>
                </div>
            </div>
            <div class="w-80"></div>
        </div>

        <!-- record.followComment.sign 是否允许评论： 0 否 1 有 -->
        <div class="m-t-10" v-if="showEdit && (record.followComment && record.followComment.sign)">
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入"
                v-model.trim="commentText">
            </el-input>
            <div class="text-right m-t-10">
                <el-button size="mini" round plain @click="cancelComment()" :disabled="loading">取消</el-button>
                <el-button size="mini" type="primary" plain round @click="saveComments()" :disabled="loading">保存</el-button>
            </div>
        </div>

        <!-- 点评记录 -->
        <div class="comment-log" v-if="record.followComment && record.followComment.sign==0 && record.followComment.content">
            <h3 class="title">{{record.followComment.createdRole}}【{{ record.followComment.createdName }}】 点评：</h3>
            <div class="log-text">{{ record.followComment.content | filterBlank }}</div>
        </div>

        <!-- 查看录音 -->
        <audio-player v-if="showAudio" :url="record.callVoiceFile" @cancel="showAudio=false"></audio-player>
    </div>
</template>

<script>
import RecordCell from './RecordCell'
import AudioPlayer from "@/components/AudioPlayer";

export default {
    components: {
        RecordCell,
        AudioPlayer
    },
    props:{
        record: {
            type: Object,
            default: ()=>{return{}}
        },
        showCommentBtn:{
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            loading: false, 
            showEdit: false,
            commentText:'',
            showAudio:false,
            config: {},
        }
    },
    created(){
        this.initData();
    },
    computed:{
        showBaseCell(){
            // 手动新增意向9、 线索下发21、线索转移[共享]24、自建线索27、转移线索[被转移者]36、呼入线索37
            if([9,'9',21,'21',24,'24',27,'27',36,'36',37,'37'].indexOf(this.record.followAction)>-1){ // 显示基本信息
                return true;
            }
            return false;
        },
        showFouceCell(){
            // 手动新增意向9、线索下发21、线索转移[共享]24、自建线索27、转移线索[被转移者]36、呼入线索37
            if([9,'9',21,'21',24,'24',27,'27',36,'36',37,'37'].indexOf(this.record.followAction)>-1){ // 显示信息增强
                return true;
            }
            return false;
        },
        showSingleCell(){
            // 继续跟进(普通跟进1)、建档跟进2、邀约下发3、微信跟进4、潜客战败5、潜客共享(线索共享)6、降级7、降级干预8、战败通过10、战败审核不通过11、邀约已登记到店12、邀约未登记到店13、
            // 删除档案dcc14、 稍后联系22、无效23、线索审核通过25、线索审核不通过26、下订28、
            // 线索无效激活31、线索分配32、战败激活33、分配潜客34, 删除线索dcc35、建档-下发邀约(2,3)
            if([1,'1', 2,'2',3,'3',4,'4', 5,'5',6,'6', 7,'7',8,'8',10,'10',11,'11',12,'12',13,'13',14,'14',22,'22',23,'23',25,'25',26,'26',28,'28',31,'31',32,'32',33,'33',
            34,'34', '2,3', 35, '35'].indexOf(this.record.followAction)>-1){ // 单个显示cell
                return true;
            }
            return false;
        },
        showComment(){
            // 继续跟进1， 建档2，邀约下发3、战败审核5、客户降级7、降级干预8、同意战败10、拒绝战败11、
            // 稍后联系22、线索审核25、线索无效26、驳回无效23、线索下发21、下订28、
            if([1,'1',2,'2',3,'3', 5,'5',7,'7',8,'8',10,'10',11,'11',22,'22',23,'23',25,'25',28,'28',26,'26'].indexOf(this.record.followAction)>-1 && !this.record.comment){ // 评论过就不可以再评
                return true;
            }
            return false;
        }
    },
    methods:{
        initData(){
            const { followAction, metadata } = this.record;
            if(followAction && followAction.indexOf(',')>-1){ // followAction目前只有 '2,3' 这一种处理，如果是多个，界面显示最后一个，标签显示多个
                let arr = followAction.split(',');
                this.followAction = parseInt(arr[arr.length-1]);
            }else { 
                this.followAction = followAction ? parseInt(followAction): 0;
            }
            switch(this.followAction){
                case 1: this.handle1();break;      // 继续跟进(普遍跟进)
                case 2: this.handle2();break;      // 建档跟进
                case 3: this.handle3();break;      // 下发邀约
                case 4: this.handle4();break;      // 档案回收
                case 5: this.handle5();break;      // 战败
                case 6: this.handle6();break;      // 潜客共享(线索共享)
                case 7: this.handle7();break;      // 降级
                case 8: this.handle8();break;      // 降级干预
                case 9: this.handle9();break;      // 手动新增意向
                case 10: this.handle10();break;      // 战败通过
                case 11: this.handle11();break;      // 战败审核不通过
                case 12: this.handle12();break;      // 邀约未登记到店
                case 13: this.handle13();break;      // 邀约未登记到店
                case 14: this.handle14And35();break; // 删除档案dcc
                case 21: this.handle21();break;      // 线索下发
                case 22: this.handle22();break;      // 稍后联系
                case 23: this.handle23();break;      // 无效
                case 24: this.handle24();break;      // 线索转移[共享]
                case 25: this.handle25();break;      // 线索审核通过
                case 26: this.handle26();break;      // 线索无效不通过
                case 27: this.handle27();break;      // 自建线索
                case 28: this.handle28();break;       // 客户下订
                case 31: this.handle31();break;       // 线索无效激活
                case 32: this.handle32();break;        // 线索分配
                case 33: this.handle33();break;      // 战败激活
                case 34: this.handle34();break;      // 潜客分配
                case 35: this.handle14And35();break; // 删除线索dcc
                case 36: this.handle24();break;      // 转移线索[被转移者]
                case 37: this.handle24();break;      // 呼入线索
            }
        },
        handle1(){
            // 继续跟进(普通跟进)
            // 建档跟进
            const { followType, followResult, nextFollowDate, remark } = this.record;
            this.config = {
                showTitle: true,
                title: followType==1?'电话跟进':followType==2?'微信跟进':'无',
                info: {
                    'followResult': followResult== 1?'继续跟进':followResult == 2?'下发邀约':'无',
                    'nextFollowDate':nextFollowDate,
                    'remark':remark
                },
                table: [
                    {'title': '跟进结果:', 'key': 'followResult'},
                    {'title': '下次跟进:','key': 'nextFollowDate'},
                    {'title': '客户描述:','key': 'remark'}
                ]
            }
        },
        handle2(){ 
            // 建档跟进
            const { followType, followResult, nextFollowDate, remark } = this.record;
            this.config = {
                showTitle: true,
                title: followType==1?'电话跟进':followType==2?'微信跟进':'无',
                info: {
                    'followResult': followResult== 1?'继续跟进':followResult == 2?'下发邀约':'无',
                    'nextFollowDate':nextFollowDate,
                    'remark':remark
                },
                table: [
                    {'title': '跟进结果:', 'key': 'followResult'},
                    {'title': '下次跟进:','key': 'nextFollowDate'},
                    {'title': '客户描述:','key': 'remark'}
                ]
            }
        },
        handle3(){ 
            // 下发邀约
            const { followType, remark, metadata } = this.record;
            this.config = {
                showTitle: true,
                title: followType==1?'电话跟进':followType==2?'微信跟进':'无',
                info: {
                    'areaName': metadata && metadata.areaName,
                    'invaiteDate': metadata && metadata.invaiteDate,
                    'remark':remark
                },
                table: [
                    {'title': '邀约门店:', 'key': 'areaName'},
                    {'title': '到店时间:','key': 'invaiteDate'},
                    {'title': '客户描述:','key': 'remark'}
                ]
            }
        },
        handle4(){ 
            // 档案回收
            const { metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'areaName': metadata && metadata.areaName,
                    'invaiteDate': metadata && metadata.invaiteDate,
                },
                table: [
                    {'title': '邀约门店:', 'key': 'areaName'},
                    {'title': '预计到店时间:','key': 'invaiteDate'},
                ]
            }
        },
        handle5(){ 
            // 潜客跟进--战败
            const { followType, remark, metadata } = this.record;
            this.config = {
                showTitle: true,
                title: followType==1?'电话跟进':followType==2?'微信跟进':'无',
                info: {
                    'type': metadata && metadata.defeat && metadata.defeat.reasonType,
                    'reason': metadata && metadata.defeat && metadata.defeat.reasonDefeat,
                    'remark':remark
                },
                table: [
                    {'title': '战败类型:', 'key': 'type'},
                    {'title': '战败原因:','key': 'reason'},
                    {'title': '跟进描述:','key': 'remark'}
                ]
            }
        },
        handle6(){ 
            // 潜客共享(线索共享)
            const { metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'areaName': metadata && metadata.areaName,
                },
                table: [
                    {'title': '邀约门店:', 'key': 'areaName'},
                ]
            }
        },
        handle7(){ 
            // 降级
            const { followType, followResult, nextFollowDate, remark, metadata } = this.record;
            this.config = {
                showTitle: true,
                title: followType==1?'电话跟进':followType==2?'微信跟进':'无',
                info: {
                    'level': `${metadata.level.oldLevel} - ${metadata.level.newLevel}`,
                    'followResult': followResult== 1?'继续跟进':followResult == 2?'下发邀约':'无',
                    'nextFollowDate': nextFollowDate,
                    'remark': remark
                },
                table: [
                    {'title': '级别变更:', 'key': 'level'},
                    {'title': '跟进结果:', 'key': 'followResult'},
                    {'title': '下次跟进:','key': 'nextFollowDate'},
                    {'title': '客户描述:','key': 'remark'}
                ]
            }
            // if(metadata.level){
            //     this.config.info['level'] = `${metadata.level.oldLevel} - ${metadata.level.newLevel}`;
            //     this.config.table.unshift({'title': '级别变更:', 'key':'level'});
            // }
        },
        handle8(){ 
            // 降级干预
            const { metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'review': metadata && metadata.review && metadata.review.name,
                    'level': `${metadata.level.oldLevel} - ${metadata.level.newLevel}`
                },
                table: [
                    {'title': '干预人:',  'key': 'review'},
                    {'title': '级别变更:','key': 'level'}
                ]
            }
        },
        handle9(){
            // 手动新增意向
            let arr = [];
            const {  metadata } = this.record;
            if(metadata && metadata.fromTopTitle){
                arr.push(metadata.fromTopTitle)
            }
            if(metadata.fromSecondTitle){
                arr.push(metadata.fromSecondTitle)
            }

            this.config = {
                baseInfo: { 
                    'areaName': metadata.areaName,
                    'model':metadata.modelName,
                    'fromText':arr.join('-')
                },
                baseTable: [
                    {'title': '归属门店:', 'key': 'areaName'},
                    {'title': '意向车型:', 'key': 'model'},
                    {'title': '客户来源:', 'key': 'fromText'},
                ],
                fouceInfo: { 
                    'gradeText': metadata && metadata.grade >-1 && metadata.grade != 11 ? metadata.grade : '--'+"分",
                    'distance': metadata&&metadata.distance,
                    'competeModel': metadata&&metadata.competeModel?(metadata.competeModel instanceof Array? metadata.competeModel.join('、'):metadata.competeModel):'',
                    'focus': metadata&&metadata.focus?(metadata.focus instanceof Array? metadata.focus.join('、'):metadata.focus):'',
                },
                fouceTable: [
                    {'title': '线索评分:', 'key': 'gradeText'},
                    {'title': '距离:',    'key': 'distance'},
                    {'title': '竞争车型:', 'key': 'competeModel'},
                    {'title': '购车关注:', 'key': 'focus'}
                ]
            }
        },
        handle10(){ 
            // 战败通过
            const { metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'review':metadata && metadata.review && metadata.review.name,
                },
                table: [
                    {'title': '审批人:', 'key': 'review'},
                ]
            }
        },
        handle11(){ 
            // 战败审核不通过
            const { remark, metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'review':metadata && metadata.review && metadata.review.name,
                    'targetDcc': metadata &&metadata.targetDcc && metadata.targetDcc.name,
                    'remark': remark,
                },
                table: [
                    {'title': '审批人:', 'key': 'review'},
                    {'title': '分配DCC:', 'key': 'targetDcc'},
                    {'title': '备注:', 'key': 'remark'},
                ]
            }
        },
        handle12(){ 
            // 邀约已登记到店
            const { remark, metadata } = this.record;
            this.config = {
                showTitle: true,
                title: '客户到店',
                info: {
                    'areaName':metadata && metadata.areaName,
                    'visitDate': metadata &&metadata.visitDate,
                    'advisor': metadata && `${metadata.advisorName?metadata.advisorName:''} ${metadata.advisorTel?metadata.advisorTel:''}`,
                },
                table: [
                    {'title': '邀约门店:', 'key': 'areaName'},
                    {'title': '到店时间:', 'key': 'visitDate'},
                    {'title': '销售顾问:', 'key': 'advisor'},
                ]
            }
        },
        handle13(){ 
            // 邀约未登记到店
            const { remark, metadata } = this.record;
            this.config = {
                showTitle: true,
                title: '客户到店',
                info: {
                    'areaName':metadata && metadata.areaName,
                    'visitDate': metadata &&metadata.visitDate,
                    'advisor': metadata && `${metadata.advisorName?metadata.advisorName:''} ${metadata.advisorTel?metadata.advisorTel:''}`
                },
                table: [
                    {'title': '邀约门店:', 'key': 'areaName'},
                    {'title': '到店时间:', 'key': 'visitDate'},
                    {'title': '销售顾问:', 'key': 'advisor'},
                ]
            }
        },
        handle14And35(){ 
            // 邀约未登记到店
            const { remark } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'remark': remark,
                },
                table: [
                    {'title': '', 'key': 'remark'},
                ]
            }
        },
        handle21(){
            // 线索下发,
            let arr = [];
            const {  metadata } = this.record;
            if(metadata && metadata.fromTopTitle){
                arr.push(metadata.fromTopTitle)
            }
            if(metadata.fromSecondTitle){
                arr.push(metadata.fromSecondTitle)
            }

            this.config = {
                baseInfo: { 
                    'areaName': metadata.areaName,
                    'model':metadata.modelName,
                    'fromText':arr.join('-')
                },
                baseTable: [
                    {'title': '归属门店:', 'key': 'areaName'},
                    {'title': '意向车型:', 'key': 'model'},
                    {'title': '客户来源:', 'key': 'fromText'},
                ],
                fouceInfo: { 
                    'gradeText': metadata && metadata.grade >-1 && metadata.grade != 11 ? metadata.grade : '--'+"分",
                    'distance': metadata&&metadata.distance,
                    'competeModel': metadata&&metadata.competeModel?(metadata.competeModel instanceof Array? metadata.competeModel.join('、'):metadata.competeModel):'',
                    'focus': metadata&&metadata.focus?(metadata.focus instanceof Array? metadata.focus.join('、'):metadata.focus):'',
                },
                fouceTable: [
                    {'title': '线索评分:', 'key': 'gradeText'},
                    {'title': '距离:',    'key': 'distance'},
                    {'title': '竞争车型:', 'key': 'competeModel'},
                    {'title': '购车关注:', 'key': 'focus'}
                ]
            }
            
        },
        handle22(){ 
            // 稍后联系
            const { remark, nextFollowDate } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'later': nextFollowDate,
                    'remark': remark,
                },
                table: [
                    {'title': '稍后联系时间:', 'key': 'later'},
                    {'title': '备注:', 'key': 'remark'},
                ]
            }
        },
        handle23(){ 
            // 稍后联系
            const { remark,metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'reason': metadata && metadata.invalid && metadata.invalid.reasonInvalid,
                    'remark': remark,
                },
                table: [
                    {'title': '无效原因:', 'key': 'reason'},
                    {'title': '原因描述:', 'key': 'remark'},
                ]
            }
        },
        handle24(){
            //线索转移[共享]
            const { metadata } = this.record;
            let arr=[]
            if(metadata && metadata.intention && metadata.intention.fromTopTitle){
                arr.push(metadata.intention.fromTopTitle)
            }
            if(metadata && metadata.intention && metadata.intention.fromSecondTitle){
                arr.push(metadata.intention.fromSecondTitle)
            }
            this.config = {
                baseInfo: {
                    'areaName': metadata && metadata.intention && metadata.intention.areaName,
                    'model': metadata && metadata.intention && metadata.intention.model,
                    'fromText': arr.join('-')
                },
                baseTable: [
                    {'title': '归属门店:', 'key': 'areaName'},
                    {'title': '意向车型:', 'key': 'model'},
                    {'title': '客户来源:', 'key': 'fromText'},
                ],
                fouceInfo: {
                    'gradeText': metadata && metadata.grade >-1 && metadata.grade != 11 ? metadata.grade : '--'+"分",
                    'distance': metadata && metadata.distance,
                    'competeModel': metadata&&metadata.competeModel?(metadata.competeModel instanceof Array ? metadata.competeModel.join('、'):metadata.competeModel):'', 
                    'focus': metadata&&metadata.focus?(metadata.focus instanceof Array ? metadata.focus.join('、'):metadata.focus):'', 
                },
                fouceTable: [
                    {'title': '线索评分:', 'key': 'gradeText'},
                    {'title': '距离:',    'key': 'distance'},
                    {'title': '竞争车型:', 'key': 'competeModel'},
                    {'title': '购车关注:', 'key': 'focus'}
                ]
            }
        },
        handle25(){ 
            // 线索审核通过
            const { metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'review': metadata && metadata.review && metadata.review.name,
                },
                table: [
                    {'title': '审批人:', 'key': 'review'},
                ]
            }
        },
        handle26(){ 
            // 线索无效不通过
            const { remark,metadata } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'review': metadata && metadata.review && metadata.review.name,
                    'targetDcc': metadata && metadata.targetDcc && metadata.targetDcc.name,
                    'remark': remark
                },
                table: [
                    {'title': '审批人:', 'key': 'review'},
                    {'title': '分配DCC:', 'key': 'targetDcc'},
                    {'title': '备注:', 'key': 'remark'},
                ]
            }
        },
        handle27(){
            // 手动自建线索,
            const { metadata } = this.record;
            let arr=[]
            if(metadata && metadata.intention && metadata.intention.fromTopTitle){
                arr.push(metadata.intention.fromTopTitle)
            }
            if(metadata && metadata.intention && metadata.intention.fromSecondTitle){
                arr.push(metadata.intention.fromSecondTitle)
            }
            this.config = {
                baseInfo: {
                    'areaName': metadata && metadata.intention && metadata.intention.areaName,
                    'model': metadata && metadata.intention && metadata.intention.model,
                    'fromText': arr.join('-')
                },
                baseTable: [
                    {'title': '归属门店:', 'key': 'areaName'},
                    {'title': '意向车型:', 'key': 'model'},
                    {'title': '客户来源:', 'key': 'fromText'},
                ],
                fouceInfo: {
                    'gradeText': metadata && metadata.grade >-1 && metadata.grade != 11 ? metadata.grade : '--'+"分",
                    'distance': metadata&&metadata.distance,
                    'competeModel': metadata&&metadata.competeModel?(metadata.competeModel instanceof Array? metadata.competeModel.join('、'):metadata.competeModel):'', // 提出不是字符串借口
                    'focus': metadata&&metadata.focus? (metadata.focus instanceof Array?metadata.focus.join('、'):metadata.focus):' ', 
                },
                fouceTable: [
                    {'title': '线索评分:', 'key': 'gradeText'},
                    {'title': '距离:',    'key': 'distance'},
                    {'title': '竞争车型:', 'key': 'competeModel'},
                    {'title': '购车关注:', 'key': 'focus'}
                ]
            }
        },
        handle28(){
            // 手动自建线索,
            const { followType, remark} = this.record;
            this.config = {
                showTitle: true,
                title: followType==1?'电话跟进':followType==2?'微信跟进':'无',
                info: {
                    'remark':remark
                },
                table: [
                    {'title': '跟进描述:','key': 'remark'}
                ]
            }
        },
        handle31(){
            // 线索无效激活,
            const { followUserName,followUserTel,metadata,createdBy } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'dcc': `${createdBy===0?'系统自动操作':(followUserName?followUserName:'')} ${followUserTel}`,
                    'targetDcc': metadata && metadata.targetDcc && metadata.targetDcc.name
                },
                table: [
                    {'title': '经手人:','key': 'dcc'},
                    {'title': '分配DCC:','key': 'targetDcc'}
                ]
            }
        },
        handle32(){
            // 分配线索
            const {  followUserName,followUserTel,metadata,createdBy } = this.record;
            this.config = {
                showTitle: false, // 是否显示头部
                info: {
                    'dcc': `${createdBy===0?'系统自动操作':(followUserName?followUserName:'')} ${followUserTel}`,
                    'targetDcc': metadata && metadata.targetDcc && metadata.targetDcc.name,
                },
                table: [
                    {'title': '经手人:','key': 'dcc'},
                    {'title': '分配DCC:', 'key': 'targetDcc'},
                ]
            }
        },
        handle33(){
            // 潜客战败激活
            const {  metadata, nextFollowDate, remark } = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'targetDcc': metadata && metadata.targetDcc && metadata.targetDcc.name,
                    'nextFollowDate': nextFollowDate,
                },
                table: [
                    {'title': '分配DCC:', 'key': 'targetDcc'},
                    {'title': '下次跟进时间:','key': 'nextFollowDate'},
                ]
            }
        },
        handle34(){
            // 分配潜客
            const {  metadata, nextFollowDate} = this.record;
            this.config = {
                showTitle: false,
                info: {
                    'targetDcc': metadata && metadata.targetDcc && metadata.targetDcc.name,
                    'nextFollowDate': nextFollowDate,
                },
                table: [
                    {'title': '分配DCC:', 'key': 'targetDcc'},
                    {'title': '下次跟进:','key': 'nextFollowDate'},
                ]
            }
        },
        note(){
            // this.record.followAction值的情况
            // 1  //普通跟进
            // 2; //建档
            // 3; //邀约
            // 4; //档案回收
            // 5; //战败
            // 6;  //潜客共享
            // 7; //降级
            // 8; //降级干预
            // 9; //手动新增意向
            // 10; //战败通过
            // 11; //战败审核不通过
            // 14; //删除档案dcc
            // 21; //线索下发
            // 22; //稍后联系
            // 23; //无效
            // 24; //线索转移[共享]
            // 25; //线索审核通过
            // 26; //线索无效不通过
            // 27; //手动新增线索
            // 28; //下订
            // 31;//线索无效激活
            // 32;//线索分配
            // 33;//潜客战败激活
            // 34;//潜客分配
            // 35;// 删除线索dcc
        },
        saveComments(){
            let params = {
                followId: this.record.id,  // 对应跟进记录id
                userId: this.record.userId,  // userId
                content: this.commentText
            }
            this.loading = true;
            this.$fetch.business.followComment(params,true, false).then((res) => {
                this.loading = false;
                this.$handleResponse(res, data=> {
                    // if(data) {
                    //     this.commentData = Object.assign({}, data);
                    // }
                    this.showEdit=false;
                    this.$emit('commentSuccess', data);
                },false)
            }).catch(response => {
                this.loading = false;
                this.$store.commit('closeLoading');
            });
        },
        cancelComment(){
            this.showEdit=false;
            this.commentText='';
        },
    }
}
</script>

<style lang="scss" scoped>
.follow-content{
    background-color: #f2f8fc;
    border-left: 3px solid rgba(61, 126, 255, .5);
    padding: 7px 10px;
    color: #838b96;
    font-size: 14px;
}

.title {
    font-size: 14px;
    color: #616063;
    line-height: 25px;
}
.detail {
    color: #838b96;
    font-size: 14px;
    line-height: 22px;
}

.content-icon {
    width: 85px;
    height: 100%;
    position:relative
}

.comment-log{
    color: #616063;
    font-size: 14px;
    margin-top: 10px;
    background-color: #d8e5ff;
    border-radius: 10px 0px 10px 10px;
    padding: 10px 12px;
}

.log-text {
    line-height: 20px;
}

.icon-item {
    display: inline-block;
    width: 25px;
    height: 25px;
    background-size: contain;
    margin-left: 4px;
    cursor: pointer;
}

.icon-position{
    position: absolute;
    bottom: 10px;
    right: 12px;
}

.icon-comments {
    background-image: url('~@/assets/images/icons/icon-comments.png');
}
.icon-audio {
    background-image: url('~@/assets/images/icons/icon-audio.png');
}

@media screen and (max-width: 1485px){
    .title {
        font-size: 12px;
        line-height: 20px;
    }
    .log-text {
        font-size: 12px;
    }
}
</style>



