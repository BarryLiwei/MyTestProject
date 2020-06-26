<template>
    
</template>

<script>
export default {
    data() {
        return {
            todoStat: {
                cluePendingTotal: 0, // 待处理线索数
                clueOvertimeTotal: 0, // 超时线索数
                archivePendingTotal: 0, // 待跟进潜客数
                archiveOvertimeTotal: 0, // 逾期待跟进潜客数
            },
            followStat: {
                clueHandleTotal: 0,  // 线索数
                clueArchiveTotal: 0,  // 潜客档案数
                inviteTotal: 0,  // 潜客邀约数
                inviteArrivalTotal: 0,  // 潜客到店数
                archiveDefeatedTotal: 0,  // 潜客战败数
                orderTotal: 0   // 成交数 DCC以上角色才有
            },
            callStat: {
                callIn: 0, // 呼入数
                callOut: 0,  // 呼出数
                talk: 0,  // 已接通数
                notTalk: 0,  // 未接通数
                talkTime: 0,  // 通话时长。当权限不一样时，不一定返回
            },
        }
    },
    methods: {
        // 待办事项
        queryStatTodo() {
            this.$fetch.work.getStatTodo().then((res) => {
                this.$handleResponse(res, data =>{
                    if (data) {
                        this.todoStat = data;
                    }
                }, false);
            }).catch(res => {
                console.log(res)
            })
        },
        // 跟进数据
        queryStatFollow(params) {
            this.$fetch.work.getStatFollow(params).then((res) => {
                this.$handleResponse(res, data =>{
                    if (data) {
                        this.followStat = data;
                    }
                }, false);
            }).catch(res => {
                console.log(res)
            })
        },
        // 通话数据
        queryStatCall(params) {
            this.$fetch.work.getStatCall(params).then((res) => {
                this.$handleResponse(res, data =>{
                    if (data) {
                        this.callStat = data;
                    }
                }, false);
            }).catch(res => {
                console.log(res)
            })
        }
    },
}
</script>

