<template>
    <div class="param-clue-setting m-20 common-box min-h-750">
        <div class="title line">线索设置</div>
        
        <div class="p-30">
            <div class="box-wrap m-b-20 w-800">
                <div class="box-header p-l-r-20">
                    线索稍后跟进设置 
                    <span class="m-l-5 sub-title">（线索稍后跟进时支持的最大设置范围）</span>
                </div>
                <div class="box-body p-20">
                    稍后跟进时间不超过 
                    <el-input type="number" v-model="info.clueDeferFollowMaxTime" size="small" class="w-100 clue-input" placeholder="请输入数字"></el-input>
                    小时
                </div>
            </div>

            <div class="box-wrap m-b-20 w-800">
                <div class="box-header p-l-r-20">重复线索剔除设置</div>
                <div class="box-body p-20">
                    同一家店在
                    <el-input type="number" v-model="info.clueRepeatTime" size="small" class="w-100 clue-input" placeholder="请输入数字"></el-input>
                    小时内，重复提交相同线索则该线索直接标记无效。
                </div>
            </div>

            <div class="box-wrap m-b-20 w-800">
                <div class="box-header p-l-r-20">线索下发规则 <span class="m-l-5 sub-title">（设置线索自动下发的时间段）</span></div>
                <div class="box-body p-20">
                    <span class="m-r-10">开始时间</span>
                    <el-time-select
                        size="small"
                        class="w-100"
                        v-model="info.clueAutoDistribution[0]"
                        :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '23:59'
                        }"
                        placeholder="选择时间">
                    </el-time-select>

                    <span class="m-l-30 m-r-10">停止时间</span>
                    <el-time-select
                        class="w-100"
                        size="small"
                        v-model="info.clueAutoDistribution[1]"
                        :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '23:59',
                            minTime: info.sendStart
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </div>
            </div>

            <div class="box-wrap m-b-20 w-800">
                <div class="box-header p-l-r-20">线索超时设置</div>
                
                <div class="box-body p-20">
                    <el-row class="m-b-20">
                        <el-col :span="4" class="box-left">超时考核时间段</el-col>
                        <el-col :span="20">
                            <div class="m-b-10" v-for="(item,index) in info.clueFollowTimeoutCheckTime" :key="index">
                                <el-time-select
                                    class="w-100"
                                    size="small"
                                    v-model="item[0]"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '23:59'
                                    }"
                                    placeholder="选择时间">
                                </el-time-select>
                                <el-time-select
                                    class="w-100"
                                    size="small"
                                    v-model="item[1]"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '23:59',
                                        minTime: item.start
                                    }"
                                    placeholder="选择时间">
                                </el-time-select>

                                <i v-if="index" class="el-icon-delete m-l-15" @click="deleteExam(index)"></i>
                            </div>
                            <el-button plain class="blue_font_white_bg" icon="el-icon-plus" round size="small" @click="addExam">新建考核时段</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="m-b-20">
                        <el-col :span="4" class="box-left">线索下发后超过</el-col>
                        <el-col :span="20">
                            <el-input type="number" v-model="info.clueFollowTimeoutTimeLimit" size="small" class="w-100 clue-input" placeholder="请输入数字"></el-input>
                            分钟未处理，则标记此线索为超时；
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" class="box-left">距离超时前</el-col>
                        <el-col :span="20">
                            <el-input type="number" v-model="info.clueFollowTimeoutAlertTime" size="small" class="w-100 clue-input" placeholder="请输入数字"></el-input>
                            分钟，进行超时预警。
                        </el-col>
                    </el-row>
                </div>
            </div>   

            <div class="m-t-50 m-b-30">
                <el-button round size="small" class="w-90" @click="cancel">取 消</el-button>
                <el-button round size="small" class="w-90" @click="save" type="primary">保存</el-button>
            </div>          
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            info :{
                clueDeferFollowMaxTime: 24, // 稍后跟进  跟后端字段一致
                clueRepeatTime: 24,  // 重复线索剔除
                clueAutoDistribution:['09:00','18:00'], // 线索下发
                clueFollowTimeoutCheckTime: [['11:00','12:00']], //超时考核
                clueFollowTimeoutTimeLimit: '', // 线索超时
                clueFollowTimeoutAlertTime: '', // 超时前提醒
            }
        }
    },
    created(){
        this.queryData();
    },
    methods:{
        queryData(){
            this.$fetch.callCenter.getClueSettingList({}).then((res)=>{
                this.$handleResponse(res, res=>{
                    Object.assign(this.info, res);
                    this.copyInfo=this.$deepCopyContent(this.info);
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        cancel(){
            this.info=this.$deepCopyContent(this.copyInfo);
        },
        transferTime(value){
            let num=0;
            let arr=value.split(":");
            num=parseInt(arr[0])*60+parseInt(arr[1]);
            return num
        },
        save(){
            if(this.info.clueFollowTimeoutCheckTime && this.info.clueFollowTimeoutCheckTime.length){
                let length=this.info.clueFollowTimeoutCheckTime.length;
                for(let i=length-1; i > -1; i--){
                    let time = this.info.clueFollowTimeoutCheckTime[i];
                    if(this.transferTime(time[0]) > this.transferTime(time[1])){
                        this.$message.error(`超时考核时间段第${i+1}行的结束时间不能少于开始时间`);
                        return false;
                    }
                }
            }
            this.$fetch.callCenter.saveClueSetting(this.info).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('保存成功');
                    this.copyInfo=this.$deepCopyContent(this.info);
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        addExam(){
            this.info.clueFollowTimeoutCheckTime.push(['11:00', '12:00']);
        },
        deleteExam(index){
            this.info.clueFollowTimeoutCheckTime.splice(index, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    color: #444;
    font-size: 20px;
    font-family: PingFang-SC-Medium;
    background-color: #fafcff
}

.box-wrap {
    border: 1px solid #eaebf0;
    .box-header {
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        color: #444;
        font-weight: 600;
        font-family: PingFang-SC-Bold;
        background-color: #f2f8fc;
        border-bottom: 1px solid #eaebf0;
        .sub-title {
            color: #a7b2c0;
            font-size: 14px;
        }
    }
    .box-body {
        min-height: 50px;
        color: #444;
        font-size: 14px;
    }
}

.clue-input {
    margin: 0 8px;
}
.box-left {
    height: 36px;
    line-height: 36px;
    text-align: right;
    padding-right: 20px;
}
.el-icon-delete {
    font-size: 16px;
    vertical-align: middle;
    cursor: pointer;
}
</style>