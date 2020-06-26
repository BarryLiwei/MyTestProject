<template>
    <!--此组件为公用的导出文件(既包含带进度条的下载导出文件和下载excel, 在exportFile 函数中判断下载哪一种) -->
    <div class="common-export">
        <el-button
            round
            :class="config['btnClass']"
            :size="btnSize"
            v-bind="$attrs"
            @click="exportFile">
            <span class="icon-out" v-if="showBtnIcon">
                <img src="@/assets/images/icons/in-blue.png" alt>
            </span> 
            <span :class="config.textClass">{{btnName}}</span>
        </el-button>
    
        <div class="inline__block" v-if="isLoad">
            <div class="blue m-l-5" v-if="progress!='100%' && progress!='0%'">正在下载文件{{progress}}...</div>
            <a class="blue" v-if="progress=='100%'" @click="download">下载导出文件</a>
        </div>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
import moment from "moment";
import request from '@/apis/axios';
import { downloadBlobFn } from '@/utils/download'
export default {
    props: {
        isLoad: { //  true为带进度条的，false为下载直接下载excel
            type: Boolean,
            default: true
        },
        config: { // 下载excel的配置
            type: Object,
            default() {
              return {
                    btnClass:'table-bar-left-btn', // 按钮的样式
                    textClass: 'link-download', // 按钮文字要不要下拉划线等样式 
                    fileName: "",  // 导出文件名
                    ext: "csv",    // 导出文件格式
                    isFile: false, // 下载的是否为文件
                    idName: "id",  // 取对象的那个字段的值
                    select: [],    // 多选的时候导出
                    taskType: "",  // 任务的类型
                    url: "common.exporExcelBlob",  // 接口路径:  模块.方法 (下载有get,put 请求，下载的类型也有blob, arrayBuffer类型,根据不同的下载方法及下载路径配置)
                    other: {},     // 其它等参数，比如分页，每页多少，或者其他筛选条件的参数
              };
            }
        },
        btnName: {     // 按钮名称
            type: String,
            default: '导出'
        },
        btnSize: {    // 按钮大小
            type: String,
            default: 'medium'
        },
        showBtnIcon:{ // 是否显示图标
            type: Boolean,
            default: false
        },
        getLastTask: { // 切换tab时，此时不需要上一次的状态,设false
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            progress: "0%",
        };
    },
    created() {
        let taskType = this.config.taskType;
        this.taskObject = this.$store.state.taskObject
        let taskObject = this.taskObject[taskType]; //获取任务数据
        if(taskObject && this.getLastTask) {
            this.taskHash = taskObject.taskHash; //任务标识
            this.progress = taskObject.progress; //完成的百分比
            if(this.progress != "100%") {
                this.loopGetProgress(this.taskHash);  // 进行上一次的下载
            }
        }
    },
    methods: {
        ...mapMutations(["setTask"]),
        exportFile() {
            // true 为加载进度条的下载
            this.isLoad ? this.downloadFile() : this.downloadExcel();
        },
        getParams(){ // 获取参数
            let params = {};
            // 有复选框的条件，需要处理导出选中项
            let select = this.config.select;
            if(select && select.length > 0) {
                let ids = [];
                let idName = this.config.idName;
                for (var i of select) {
                    ids.push(i[idName]);
                }
                params.ids = ids;
            }
            params.taskType = this.config.taskType;   // 任务类型处理
            Object.assign(params, this.config.other);  // 其他参数合并
            return params;
        },
        getModel(){
            if(this.config && this.config.url && !this.downMethod){ // 执行下载会执行很多次，第一次进入获取方法，后续的加载this.downMethod已经存在就不会再进入
                this.downModel = this.config.url.split(".")[0];   // 下载调用的模块
                this.downMethod = this.config.url.split(".")[1];  // 下载调用的方法
            }
        },
        downloadExcel(){ // 直接点击导出excel
            let params = this.getParams();
            this.getModel(); // 下载有get,post请求的下载，下载responType也有blob, arrayBuffer等格式
            this.$fetch[this.downModel][this.downMethod](params).then((res) => {
                // const blob = new Blob([res.data], { type: 'application/ms-excel' });
                // let fileName = `${this.config.fileName}-${moment().format('YYYYMMDDHHmmss')}.${this.config.ext || 'xlsx'}`;
                // downloadBlobFn(blob, fileName);
                this.excelDownResponse(res);
            })
        },
        excelDownResponse(res){
            const blob = new Blob([res.data], { type: 'application/ms-excel' });
            let fileName = `${this.config.fileName}-${moment().format('YYYYMMDDHHmmss')}.${this.config.ext || 'xlsx'}`;
            downloadBlobFn(blob, fileName);
        },
        downloadFile(){ // 不是直接下载excel
            let params = this.getParams();
            // 需要处理别的接口时，将newTask 作为参数配置（即this.$fetch.common[name]）
            this.$fetch.common.newtask(params).then(res => {
                this.$handleResponse(res, data => {
                    if (data.callback == "handle") {
                       this.$fetch.common.handle({ taskHash: data.taskHash });
                    } else if (data.callback == "queue") {
                      this.$message.warning("任务已排队，请耐心等待");
                    }
                    this.loopGetProgress(data.taskHash);
                });
              },false)
        },
        loopGetProgress(taskHash) {
            this.getProgress(taskHash).then(progress => {
                let obj = {};
                obj[this.config.taskType] = { taskHash, progress };
                this.setTask(obj); //设置任务状态
                if(progress != "100%" && progress != "error") {
                    let _this = this;
                    this.timeOut = setTimeout(() => {
                      _this.loopGetProgress(taskHash);
                    }, 3000);
                } else if (progress == "error") { //获取进度有问题给出提示
                    let obj = {};
                    obj[this.config.taskType] = { taskHash, progress: '100%' };
                    this.setTask(obj);
                    this.$message.error('抱歉，下载失败了')
                }
            });
        },
        //获取进度条
        getProgress(taskHash) {
          return this.$fetch.common.progress({ taskHash }).then(res => {
                let data = res.data.data
                this.taskHash = data.taskHash;
                this.progress = data.progress;
                return data && data.progress;
            }).catch(err => {
                return "error";
            });
        },
        //下载文件 interface,id,config.fileName,config.ext
        download() {
            let parmas = Object.assign(this.getParams(), { taskHash: this.taskHash });
            this.getModel(); // 下载有get,post请求的下载，下载responType也有blob, arrayBuffer等格式
            this.$fetch[this.downModel][this.downMethod](parmas).then(res => {
                const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
                if (this.isIE()) {
                    window.navigator.msSaveOrOpenBlob(blob, this.config.fileName+'.csv');
                }else {
                    let fileName = `${this.config.fileName}-${moment().format('YYYYMMDDHHmmss')}.${this.config.ext || 'xlsx'}`;
                    downloadBlobFn(blob, fileName);
                }
                this.$store.state.taskObject = ""; //下载后数据初始化
            })
        },
        isIE(){
            if(!!window.ActiveXObject || "ActiveXObject" in window) {
                return true;
            }
            return false;
        }
    },
};
</script>
<style scoped>
.common-export {
    display: inline-block;
    vertical-align: top;
}
a.blue:hover {
    color: #3d7eff;
    cursor: pointer;
}
.common-export .blue {
    line-height: 34px;
    margin-left: 16px;
}
.link-download {
    text-decoration: underline
}
.common-export .icon-out {
  padding: 0px 5px;
}
.common-export .icon-out img {
  width: 12px;
  height: 12px;
}
</style>
