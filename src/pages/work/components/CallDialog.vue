<template>
  <div>
    <el-dialog
            class="call-dialog"
            :visible.sync="dialogVisible"
            width="400px"
            :before-close="handleClose"
        >
        <div slot="title" class="dialog-title">
            
        </div>
      <div class="dialog-center call-dialog-center">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="拨号键盘" name="first" class="tab-content">
          <div class="call-input">
            <el-input
              placeholder="请输入号码"
              v-model="input1">
              <el-button slot="suffix" type="primary" icon="el-icon-phone" circle></el-button>
            </el-input>
          </div>
          <div class="call-number">
            <div class="call-number-items">
              <el-button class="call-btn" round>1</el-button>
              <el-button class="call-btn" round>2</el-button>
              <el-button class="call-btn" round>3</el-button>
            </div>
            <div class="call-number-items">
              <el-button class="call-btn" round>4</el-button>
              <el-button class="call-btn" round>5</el-button>
              <el-button class="call-btn" round>6</el-button>
            </div>
            <div class="call-number-items">
              <el-button class="call-btn" round>7</el-button>
              <el-button class="call-btn" round>8</el-button>
              <el-button class="call-btn" round>9</el-button>
            </div>
            <div class="call-number-items">
              <el-button class="call-btn" round>*</el-button>
              <el-button class="call-btn" round>0</el-button>
              <el-button class="call-btn" round>#</el-button>
            </div>
          </div>
          
          
        </el-tab-pane>
        <el-tab-pane label="通话记录" name="second">
          <div class="call-record-tab">
            <div class="call-input">
              <el-input
                placeholder="请输入号码"
                v-model="input1">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
                <!-- <el-button slot="suffix" type="primary" icon="el-icon-phone" circle size="small"></el-button> -->
              </el-input>
            </div>
            <div class="record-list">
              <div class="record-item">
                <div class="phone">13388887777</div>
                <div class="record-info">
                  <span>刚刚</span>
                  <span>呼入40秒</span>
                  <span>广东深圳</span>
                  <span>移动</span>
                </div>
              </div>
              <div class="record-item">
                <div class="phone">13388887777</div>
                <div class="record-info">
                  <span>刚刚</span>
                  <span>呼入40秒</span>
                  <span>广东深圳</span>
                  <span>移动</span>
                </div>
              </div>
              <div class="record-item">
                <div class="phone">13388887777</div>
                <div class="record-info">
                  <span>刚刚</span>
                  <span>呼入40秒</span>
                  <span>广东深圳</span>
                  <span>移动</span>
                </div>
              </div>
              <div class="record-item">
                <div class="phone">13388887777</div>
                <div class="record-info">
                  <span>刚刚</span>
                  <span>呼入40秒</span>
                  <span>广东深圳</span>
                  <span>移动</span>
                </div>
              </div>
              <div class="record-item">
                <div class="phone">13388887777</div>
                <div class="record-info">
                  <span>刚刚</span>
                  <span>呼入40秒</span>
                  <span>广东深圳</span>
                  <span>移动</span>
                </div>
              </div>
              <div class="record-item">
                <div class="phone">13388887777</div>
                <div class="record-info">
                  <span>刚刚</span>
                  <span>呼入40秒</span>
                  <span>广东深圳</span>
                  <span>移动</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      </div>
      
      </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: true,
      val: "",
      options: [
            {
            value: "1",
            label: "是"
            },
            {
            value: "0",
            label: "否"
            }
      ],
      checkboxGroup1: ['1', '2'],
      radio4: "1",
      percentage: 80,
      items: ['内饰','外观','舒适度'],

      activeName: 'first',
      input1: ''
    };
  },
  methods: {
    
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //表格 顶部按钮 新增
    add() {
      this.addressDefaultData = {};
      this.dialogVisible = true;
      // this.$fetch.cusService
      //     .importUserConf()
      //     .then(res => {
      //     this.closeLoading(); //关闭加载中
      //     this.addData = res.data;
      //     this.addData.u_sex.val = String(this.addData.u_sex.val);
      //     })
      //     .catch(err => {
      //     this.closeLoading();
      //     });
    },
    //弹窗 关闭
    handleClose() {
      this.dialogVisible = false;
      this.$emit("callCloseFn");
    },
    save() {}
  }
};
</script>

<style lang="scss" scoped>
.call-dialog >>> .el-dialog__header{
  display: none;
}
.call-dialog >>> .el-dialog__body{
  padding: 0;
}

.call-dialog >>> .el-tabs--card>.el-tabs__header .el-tabs__nav{
  width: 100%;
}
.call-dialog >>> .el-tabs--card>.el-tabs__header .el-tabs__item{
  width: 50%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 20px;
  color: #26252e;
  background-color: #fafcff;
  border-bottom: 1px solid #E4E7ED;
}
.call-dialog >>> .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  color: #3d7eff;
  background-color: #fff;
  border-bottom-color: #fff;
}

.call-dialog >>> .el-tabs__content{
  // padding: 15px 30px;
}
.call-dialog .tab-content >>> .el-input__suffix{
  line-height: 60px;
  right: 10px;
}
.call-dialog .call-record-tab >>> .el-input__suffix{
  line-height: 30px;
  right: 5px;
}
.call-dialog >>> .el-input--suffix .el-input__inner{
  border-radius: 36px;
  font-size: 20px;
}
.call-dialog .tab-content >>> .el-input--suffix .el-input__inner{
  height: 60px;
}
.tab-content{
  padding: 15px 30px;
}
.call-number {
  margin-top: 20px;
  .call-number-items{
    margin-bottom: 20px;
  }
  .call-btn{
    width: 100px;
    height: 60px;
    background-color: #ffffff;
    border-radius: 30px;
    color: #7a8189;
    font-size: 30px;
    width: 30%;
  }
}
.call-record-tab{
  height: 430px;
  .call-input{
    padding: 15px 30px;
  }
  .record-list{
    padding-left: 30px;
    height: 355px;
    overflow-y: scroll;
    .record-item{
      padding: 15px;
    }
    .record-item:not(:last-child){
      border-bottom: 1px solid #e7e7e7;
    }
    .phone{
      font-size: 18px;
    }
    .record-info{
      font-size: 14px;
      color: #7a8189;
    }
  }
}
</style>