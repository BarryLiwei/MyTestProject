<template>
  <div>
    <el-dialog class="transfer-clue-dialog" :visible.sync="dialogVisible" width="480px" title="线索转移"
      :before-close="handleClose">
      <div class="dialog-center">
        <el-row :gutter="22">
          <!-- <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  线索姓名
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-input v-model="filters.clueName" placeholder="请输入" size="medium"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  性别
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-radio-group v-model="filters.gender" size="medium">
                    <el-radio-button
                      :label="item.value"
                      v-for="item in genderOptions"
                      :key="item.value"
                      size="medium">
                        {{item.label}}
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  手机号
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-input v-model="filters.tel" placeholder="请输入" size="medium"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col> -->
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  移交门店
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-select style="width:100%;" v-model="filters.areaId" filterable placeholder="请选择"
                    @change="areaIdChange" size="medium">
                    <el-option v-for="item in areaListOptions" :key="item.id" :label="item.short_name" :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15" v-if="filters.areaId">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  意向车型
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-col :span="8">
                    <el-select v-model="filters.brandId" placeholder="请选择" filterable @change="changeBrand"
                      :class="filters.brandId==''?'c-placeholder':''" size="medium">
                      <el-option v-for="item in brandOptions" :key="item.id" :label="item.title" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select v-model="filters.carSeriesId" placeholder="请选择" filterable @change="changeSeries"
                      :class="filters.carSeriesId==''?'c-placeholder':''" size="medium">
                      <el-option v-for="item in seriesOptions" :key="item.id" :label="item.title" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select v-model="filters.modelId" placeholder="请选择" filterable @change="changeModel"
                      :class="filters.modelId==''?'c-placeholder':''" size="medium">
                      <el-option v-for="item in modelOptions" :key="item.id" :label="item.title" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  客户来源
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content flex">
                  <el-select v-model="filters.fromTopId" placeholder="一级来源" filterable
                    @change="sourceChange" size="medium">
                    <el-option v-for="item in oneSourceOptions" :key="item.id" :label="item.title" :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="filters.fromSecondId" placeholder="二级来源"
                    filterable size="medium">
                    <el-option v-for="item in secondSourceOptions" :key="item.id" :label="item.title" :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" class="m-b-15">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  移交原因
                  <span class="red">*</span>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <el-input v-model="filters.transferReason" placeholder="请输入" type="textarea" maxlength="120"
                    :autosize="{ minRows: 4}" show-word-limit></el-input>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" size="medium" class="w-90 plain-btn-style" @click="handleClose" round>取消</el-button>
        <el-button type="primary" size="medium" class="w-90" @click="save" round>移交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as Http from "@/apis/work";
  export default {
    props: ["type", "clueInfo"],
    data() {
      return {
        dialogVisible: true,
        areaListOptions: "", //归属门店可选门店列表
        brandOptions: [],
        seriesOptions: [],
        modelOptions: [],
        oneSourceOptions: [], // 客户来源-一级来源
        secondSourceOptions: [], // 客户来源-二级来源
        genderOptions:[
          {
            value: 1,
            label: "男"
          },
          {
            value: 2,
            label: "女"
          }
        ],
        filters: {
          clueName: '', // 线索姓名
          fromTopId: '',  // 一级来源id
          fromSecondId: '', // 二级来源id 
          tel: '', // 手机号
          gender: '',  // 性别
          id: this.$route.query.id,
        }
      };
    },
    created() {
      this.getCommonAreaList();
      this.getCommonFromList();
    },
    methods: {
      // 取当前二级来源
      sourceChange() {
        this.filters.fromSecondId = "";
        for (let i of this.oneSourceOptions) {
          if (i.id == this.filters.fromTopId) {
            this.secondSourceOptions = i.children || [];
          }
        }
      },
      // 获取客户来源
      getCommonFromList() {
        this.$fetch.common.commonFromList({}).then(res => {
          this.$handleResponse(res, res => {
            this.oneSourceOptions = res;
          },true);
        }).catch(err => {
          this.$store.commit("closeLoading");
        });
      },
      //弹窗 关闭
      handleClose() {
        this.dialogVisible = false;
        this.$emit("transferClueCloseFn");
      },
      save() {
        let params = this.filters;
        if (!params.areaId) {
          this.$message.error("请选择移交门店");
          return;
        }
        if (!params.modelId) {
          this.$message.error("请选择意向车型");
          return;
        }
        if (!params.fromTopId) {
          this.$message.error("请选择客户来源");
          return;
        }
        if (!params.transferReason) {
          this.$message.error("请填写移交原因");
          return;
        }
        if (this.type == "customerFollow") {
          // 区分是线索处理还是潜客跟进
          // params.id = this.clueInfo && this.clueInfo[0] && this.clueInfo[0].clueId;
          params.type = 1;
        }
        if (this.type == 'cluesDeal') {
          params.type = 2;
        }
        Http.clueTransfer(params)
          .then(res => {
            this.$handleResponse(res, res => {
              // 数据处理
              console.log(res)
              this.$emit("transferClueCloseFn", 'next');
            },true);
          })
          .catch(err => {
            this.$store.commit("closeLoading");
          });
      },
      getCommonAreaList() {
        this.$fetch.setting
          .queryAreasList({
            pagination: 0, //不需要分页
          })
          .then(res => {
            this.$handleResponse(res, res => {
              this.areaListOptions = res.list;
            },true);
          })
          .catch(err => {
            this.$store.commit("closeLoading");
          });
      },
      areaIdChange() {
        this.filters.brandId = "";
        this.filters.carSeriesId = "";
        this.filters.modelId = "";
        this.brandOptions = [];
        this.seriesOptions = [];
        this.modelOptions = [];
        this.getBrandList();
      },
      getBrandList() {
        console.log(this.filters.areaId);
        this.$fetch.common
          .carBrand({
            areaId: this.filters.areaId
          }, false)
          .then(res => {
            this.$handleResponse(
              res,
              res => {
                this.brandOptions = this.$hasArrContent(res) ? res : [];
              },
              false
            );
          });
      },
      changeBrand(val) {
        this.filters.carSeriesId = "";
        this.filters.modelId = "";
        this.seriesOptions = [];
        this.modelOptions = [];
        this.$fetch.common.carSeries({
          brandId: val
        }, false).then(res => {
          this.$handleResponse(
            res,
            res => {
              this.seriesOptions = this.$hasArrContent(res) ? res : [];
            },
            false
          );
        });
      },
      changeSeries(val) {
        this.filters.modelId = "";
        this.modelOptions = [];
        this.$fetch.common.carModel({
          seriesId: val
        }, false).then(res => {
          this.modelOptions = this.$hasArrContent(res.data.data) ?
            res.data.data :
            [];
        });
      },
      changeModel(val) {
        this.$forceUpdate();
      }
    }
  };

</script>

<style lang="scss" scoped>
  .red {
    color: #ea5a54;
  }

  .transfer-clue-dialog {
    color: #444444;

    .grid-content-left {
      text-align: right;
      margin-right: 6px;
      line-height: 40px;
      font-size: 13px;
    }
  }

.grid-content >>> .el-textarea .el-input__count {
    bottom: 4px;
    right: 8px;
}

</style>
