<template>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="550px" :before-close="handleClose"  appentToBody    class="add-mormal-dialog-self" :close-on-click-modal="false">


            <el-row class="marTop15" v-if="dialogType == 1 || dialogType == 2">
                <el-col :span="6">
                    <div class="grid-content godian"> 状态<span class="reddot">*</span></div>
                </el-col>
                <el-col :span="18">
                        <el-select v-model="formDefault.displayStatus" placeholder="请选择" size="small">
                            <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                            </el-option>
                        </el-select>
                </el-col>
            </el-row>


            <el-row class="marTop15" v-if="dialogType == 3">
                <el-col :span="6">
                    <div class="grid-content godian"> 状态</div>
                </el-col>
                <el-col :span="18">
                      <div class="godian"> {{formDefault.displayStatusTitle}}  </div> 
                </el-col>
            </el-row>


            <el-row class="marTop15" v-if="dialogType == 1 || dialogType == 2">
                <el-col :span="6">
                    <div class="grid-content godian"> 常用话术标题<span class="reddot">*</span></div>
                </el-col>
                <el-col :span="18">
                    <el-input v-model="formDefault.title" maxlength="20" placeholder="20个字符以内" size="small"></el-input>
                </el-col>
            </el-row>

            <el-row class="marTop15" v-if="dialogType == 3">
                <el-col :span="6">
                    <div class="grid-content godian"> 常用话术标题</div>
                </el-col>
                <el-col :span="18">
                     <div class="godian"> {{formDefault.title}}</div> 
                </el-col>
            </el-row>


            <el-row class="marTop15" v-if="dialogType == 1 || dialogType == 2">
                <el-col :span="6">
                    <div class="grid-content godian"> 内容<span class="reddot">*</span></div>
                </el-col>
                <el-col :span="18">
                    <el-input v-model="formDefault.content" type="textarea" maxlength="300" rows="5" placeholder="300个字符以内"></el-input>
                </el-col>
            </el-row>


            <el-row class="marTop15" v-if="dialogType == 3">
                <el-col :span="6">
                    <div class="grid-content godian"> 内容</div>
                </el-col>
                <el-col :span="18">
                    <div class="godian"> {{formDefault.content}}</div> 
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
            <el-button round size="small" class="w-90" @click="handleClose">取消</el-button>
            <el-button round size="small" class="w-90" type="primary" @click="confirm" v-if="dialogType == 3">编辑</el-button>
            <el-button round size="small" class="w-90" type="primary" @click="confirm" v-if="dialogType == 1 || dialogType == 2">保存</el-button>


          </span>
        </el-dialog>
  
</template>
<script>
    import {
        mapMutations,
        mapState
    } from "vuex";
    export default {
        props: {
            dialogType: {
                type: Number,
                default: 1 //1增加，2编辑，  3查看详情
            },
            content: {
                type: Object,
                default: {}
            },
            options:{
                type:Array,
                default:[]
            }
        },
        watch:{
            dialogType(nv,ov){
                if (nv == 1) {
                    this.title = '新增常用话术';
                } else if (nv == 2) {
                    this.title = '编辑常用话术';
                } else if (nv == 3) {
                    this.title = '常用话术详情';
                }
            }
        },
        data() {
            return {
                formDefault: {
                    title: '',
                    content: '',
                    displayStatus:'',
                },
                dialogVisible: true,
                title: '',
            }
        },
        mounted() {
            console.log('传入的数据',this.content);
            if (this.dialogType == 1) {
                this.formDefault = {
                    title: '',
                    content: '',
                    displayStatus:'',
                };
                this.title = '新增常用话术';
            } else if (this.dialogType == 2) {
                this.title = '编辑常用话术';
                Object.assign(this.formDefault, this.content);
            } else if (this.dialogType == 3) {
                this.title = '常用话术详情';
                Object.assign(this.formDefault, this.content);
            }
        },
        methods: {
            ...mapMutations(["closeLoading"]),
            handleClose() {
                this.$emit("closeDiolag");
            },
            confirm() {

                let that = this;
                if(that.dialogType == 1)
                {
                  if(that.formDefault.displayStatus === '')
                  {
      
                     this.$message.warning('状态必填')
                     return;
                  }else if(!that.formDefault.title){
                       this.$message.warning('常用话术标题必填')
      
                     return;
                  }else if(!that.formDefault.content){
                       this.$message.warning('内容必填')
      
                      return;
                  }

                  this.$fetch.callCenter
                    .normalCreate(that.formDefault)
                    .then(res => {
                      that.closeLoading(); //关闭加载中
                       that.$message.success('新增成功')

                      that.handleClose();
                    })
                    .catch(err => {
                      that.closeLoading();
                    });
                }else if(that.dialogType == 2){

                    this.$fetch.callCenter
                    .normalUpdate(that.formDefault)
                    .then(res => {
                      that.closeLoading(); //关闭加载中
       
                        that.$message.success('编辑成功')

                      that.handleClose();
                    })
                    .catch(err => {
                      that.closeLoading();
                    });
                }else if(that.dialogType == 3){
                    that.dialogType = 2;

                }
            }
        }
    }
</script>


<style  scoped>
    .godian {
        line-height: 40px;
    }
    .marTop15 {
        margin-bottom: 15px;
    }
    .grid-content{
        text-align: right;
        padding-right: 10px;
    }
    .reddot{
        color: #F56C6C;   
    }
</style>
<style>
.createPass-dialog .el-dialog__body {
    padding-bottom: 4px;
    
}

.add-mormal-dialog-self .el-dialog__body {
    padding: 25px 35px 0 20px;
}

.add-mormal-dialog-self .el-dialog__footer {
    padding-bottom: 37px;
}
</style>