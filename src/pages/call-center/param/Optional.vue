<template>
    <div class="param-optional-setting m-20 common-box min-h-750">
        <div class="title line">可选功能</div>

        <div class="p-30">
            <div class="box-wrap">
                <div class="flex box-item" v-for="(item, index) in obj.list" :key="index">
                    <div class="flex-1 p-r-20">
                        {{ item.title }}
                        <el-tooltip  effect="light" :content="item.tip" placement="top">
                          <i class="el-icon-question" v-if="item.tip"></i>
                        </el-tooltip>
                    </div>
                    <div class="flex-1" >
                        <div v-show="item.state && item.prop == 'clueInvalidReview'">
                            大于等于
                            <el-select placeholder="请选择"  size="small" v-model="item.value" class="w-90 m-r-5" @change="changeStatue(item)">
                                <el-option v-for="day in gradeList" :key="day.value" :value="day.value" :label="day.label"></el-option>
                            </el-select>
                            分值
                        </div>
                        <div v-show="item.state && (item.prop == 'archiveTimeoutRecycle'|| item.prop == 'intentionTimeoutShare'||item.prop == 'inviteMaxTime')">
                            <el-input type="number" class="w-90 m-l-60 m-r-5" size="small" v-model="item.value" placeholder="请输入" @blur="changeStatue(item)"></el-input>
                            <span>{{ item.prop == 'archiveTimeoutRecycle'?'小时': '天'}}</span>
                        </div>
                    </div>
                    <div class="w-100"> 
                        <el-switch class='switch-scrm' v-model="item.state" active-text="ON" inactive-text="OFF" @change="changeStatue(item)"></el-switch>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            obj: {
                list: [
                    { 'title': "高分线索标记无效审核",    'state': 0, value: 4,  'prop': 'clueInvalidReview', 'tip':''},
                    { 'title': "超时未跟进邀约档案回收",  'state': 0, value: 24,  'prop': 'archiveTimeoutRecycle', 'tip':'超过设置的时间门店未进行任何跟进，直接从门店回收该档案'},
                    { 'title': "超时未成交线索共享",      'state': 0 ,value: 30,  'prop': 'intentionTimeoutShare', 'tip':'超过设置的时间门店未成交，DCC可将该线索共享给其他门店跟进'},
                    { 'title': "最大邀约时间设置",        'state': 0, value: 7,  'prop': 'inviteMaxTime', 'tip':''},
                ],
                clueInvalidReview: 0,
                archiveTimeoutRecycle: 1,
                intentionTimeoutShare: 2,
                inviteMaxTime: 3,
            },
        }
    },
    created(){
        this.gradeList =  [{value:1, label:1},{value:2, label:2},{value:3,label:3},{value:4 ,label:4},{value:5 ,label:5}];
        this.queryData();
    },
    methods: {
        queryData(){
            this.$fetch.callCenter.optionalFunction({}).then((res)=>{
                this.$handleResponse(res, res=>{
                    const {list, clueInvalidReview, archiveTimeoutRecycle, intentionTimeoutShare, inviteMaxTime} = this.obj;

                    this.obj.list[clueInvalidReview].value = res.clueInvalidReview > 0 ? res.clueInvalidReview:4;
                    this.obj.list[clueInvalidReview].state = res.clueInvalidReview > 0? true:false;

                    this.obj.list[archiveTimeoutRecycle].value = res.archiveTimeoutRecycle > 0?res.archiveTimeoutRecycle: 24;
                    this.obj.list[archiveTimeoutRecycle].state = res.archiveTimeoutRecycle > 0?true:false;

                    this.obj.list[intentionTimeoutShare].value = res.intentionTimeoutShare > 0?res.intentionTimeoutShare:30;
                    this.obj.list[intentionTimeoutShare].state = res.intentionTimeoutShare > 0?true:false;

                    this.obj.list[inviteMaxTime].value = res.inviteMaxTime>0?res.inviteMaxTime:7;
                    this.obj.list[inviteMaxTime].state = res.inviteMaxTime > 0?true:false;
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        changeStatue(item){
            const { list } = this.obj;
            let params = {
                'clueInvalidReview': list[0].state?list[0].value: '',
                'archiveTimeoutRecycle':list[1].state?list[1].value: '',
                'intentionTimeoutShare': list[2].state?list[2].value: '',
                'inviteMaxTime': list[3].state?list[3].value: '',
            }
            this.$fetch.callCenter.saveOptionalFunction(params).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.$message.success('更新成功')
                    this.queryData();
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
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
    width: 800px;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
}
.box-item {
    font-size: 14px;
    color: #444;
    height: 60px;
    line-height: 60px;
    padding-left: 19px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}
.el-icon-question {
    color: #3d7eff;
    cursor: pointer;
    font-size: 18px;
}
</style>