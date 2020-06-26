<template>
    <div class="web-work">
        <!-- dcc邀约员(invite) -->
        <dcc-invite v-if="loginType=='invite'"></dcc-invite>
        <!-- 组长(group) -->
        <dcc-group v-if="loginType=='group'"></dcc-group>
        <!-- 经理(manage) -->
        <dcc-manage v-if="loginType=='manage'"></dcc-manage>
    </div>
</template>

<script>
    import * as Http from '@/apis/work'
    import DccGroup from './DccGroup'
    import DccInvite from './DccInvite'
    import DccManage from './DccManage'
    import { mapState } from 'vuex'
    export default {
        components: {
            DccGroup,
            DccInvite,
            DccManage
        },
        computed: {
            ...mapState(["loginType"])
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/assets/scss/mixin.scss";

    .web-work {
        padding: 20px 10px;
    }
</style>


