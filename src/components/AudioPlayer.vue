<template>
    <el-dialog
        title="播放录音"
        class="audio-player-dialog"
        :visible.sync="dialogVisible"
        width="700px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">
        <VueAplayer class="audio-player" autoplay :music="{ title: '录音播放', author: '播放录音',src: url}"/>
    </el-dialog>
</template>

<script>
import VueAplayer from 'vue-aplayer'
export default {
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    components:{
        VueAplayer
    },
    data(){
        return{
            dialogVisible: true
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        }
    }
}
</script>

<style lang="scss" scoped>
.audio-player-dialog /deep/.el-dialog__body {
    margin-top: 8px;
    padding: 10px 30px 30px;
}

.audio-player-dialog /deep/.aplayer {
    box-shadow: none;
}

.audio-player-dialog /deep/.aplayer-author{
    display: none;
}
.audio-player-dialog /deep/.aplayer-pic {
    background: #fff;
    width: 25px;
    height: 25px;
    position: absolute;
    bottom: -2px;
    left: 10px;
    z-index: 10;
}

.audio-player {
    height: 90px;
}

.audio-player-dialog /deep/.aplayer-pic .aplayer-play {
    width: 23px;
    height: 23px;
    border: 2px solid #fff;
    bottom: 50%;
    right: 50%;
    margin: 0 -13px -13px 0;
}

.audio-player-dialog /deep/.aplayer-pic .aplayer-play .aplayer-icon-play {
    position: absolute;
    top: 4px;
    left: 5px;
    height: 15px;
    width: 15px;
}

.audio-player-dialog /deep/ .aplayer-controller {
    padding-left: 31px;
}

.audio-player-dialog /deep/.aplayer-title {
    font-size: 14px;
    color: #b0b9c4;
}

.audio-player-dialog  /deep/.aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
    transform: scale(1);
    border: 2px solid #3d7eff!important;
    width: 8px;
    height: 8px;
}
.audio-player-dialog /deep/.aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb:hover {
    background-color: #fff!important;
}
.audio-player-dialog /deep/ .aplayer-bar-wrap .aplayer-bar {
    height: 3px;
}
.audio-player-dialog /deep/ .aplayer-bar-wrap .aplayer-played {
    height: 3px;
    background-color: #3d7eff!important;
}

.audio-player-dialog /deep/ .aplayer-controller .aplayer-time .aplayer-icon {
    display:none;
}
</style>


