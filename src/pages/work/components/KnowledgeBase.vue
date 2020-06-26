<template>
  <div class="knowledge-base">
    <tabs-scrm @change="tabChange" :tabs="tabs"></tabs-scrm>
    <div class="tabs-pane">
      <div v-if="currentTab == 0" class="models-contrast record-activity">
        <div class="models-group models-group-top">
          <div class="models-group-items models-group-item1">
            <div style="">配置情况</div>
            <div><i class="setting-icon setting-icon-bp"></i> 标配</div>
            <div><i class="setting-icon setting-icon-xp"></i> 选配</div>
            <div>- 无</div>
            <el-checkbox v-model="checked">隐藏相同</el-checkbox>
          </div>
          <div class="models-group-items models-group-item2">
            <div class="models-info">
              <!-- <div class="close-icon" @click="clearModle(1)">
                <img class="" :src="require('@/assets/images/work/close-black.png')">
              </div> -->
              <div class="cont-flex">
                <div>
                  <div v-if="modelData1" class="img-box">
                    <img :src="modelData1.img['160']" alt="">
                  </div>
                  <div>{{modelData1.modelName}}</div>
                </div>
                <el-select popper-class="models-contrast-select" size="mini" v-model="model1" placeholder="意向车型" filterable @change="modelChange(1)">
                  <el-option
                    v-for="item in archiveAndModels"
                    :key="item.modelId"
                    :label="item.modelName"
                    :value="item.modelId"
                    :disabled="item.modelId == model2">
                  </el-option>
                  <div v-if="$route.query.id" class="option-load-more" @click="allMore(1)">添加更多</div>
                  <div v-if="$route.query.id" slot="empty" class="option-load-more" @click="allMore(1)">添加更多</div>
                </el-select>
              </div>
            </div>
            <div class="models-none" v-if="false">
              选择车型
            </div>
          </div>
          <div class="models-group-items models-group-item3">
            <div class="models-info">
              <!-- <div class="close-icon" @click="clearModle(2)">
                <img class="" :src="require('@/assets/images/work/close-black.png')">
              </div> -->
              <div class="cont-flex">
                <div>
                  <div v-if="modelData2" class="img-box">
                    <img :src="modelData2.img['160']" alt="">
                  </div>
                  <div>{{modelData2.modelName}}</div>
                </div>
                <el-select popper-class="models-contrast-select" size="mini" v-model="model2" placeholder="对比车型" @change="modelChange(2)">
                  <el-option
                    v-for="item in kbModelsData2"
                    :key="item.modelId"
                    :label="item.modelName"
                    :value="item.modelId"
                    :disabled="item.modelId == model1">
                  </el-option>
                  <div v-if="$route.query.id" class="option-load-more" @click="allMore(2)">添加更多</div>
                  <div v-if="$route.query.id" slot="empty" class="option-load-more" @click="allMore(2)">添加更多</div>
                </el-select>
              </div>
            </div>
            <div class="models-none" v-if="false">
              选择车型
            </div>
          </div>
        </div>
        <div class="models-group" v-if="model1">
          <div class="models-group-items" style="text-align: right;">厂商指导价(元)</div>
          <div class="models-group-items">{{modelData1.factoryPrice}}万</div>
          <div class="models-group-items">{{modelData2.factoryPrice}}万</div>
        </div>
        <div v-for="(item,idx) in modelData1.params" :key="idx">
          <div v-for="(value,key, index) in item" :key="index">
            <div v-if="key != '车身颜色'" class="models-Gtitle">{{key}}</div>
            <div v-if="key != '车身颜色'">
              <div v-for="(v,k, i) in value" :key="i">
                <div class="models-group" v-if="!(checked && modelData2.params && v == modelData2.params[idx][key][k]) ">
                  <div class="models-group-items models-group-items-first">{{k}}</div>
                  <div class="models-group-items">{{v}}</div>
                  <div class="models-group-items">{{(modelData2.params && modelData2.params[idx][key][k]) || ''}}</div>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
        
        
      </div>
      <div v-if="currentTab == 1" class="store-activity record-activity">
        <el-row class="store-activity-car">
          <el-col class="width-75">
            <div class="grid-content-left">
              意向车型
            </div>
          </el-col>
          <el-col class="width-right-cont">
            <div class="grid-content">
              <el-select popper-class="models-contrast-select" size="mini" v-model="seriesId" placeholder="意向车型"  @change="modelChange(3)" clearable>
                <el-option
                  v-for="item in archiveAndModels"
                  :key="item.carSeriesId"
                  :label="item.carSeriesName"
                  :value="item.carSeriesId">
                </el-option>
                <div v-if="$route.query.id" class="option-load-more" @click="allMore(1)">添加更多</div>
                <div v-if="$route.query.id" slot="empty" class="option-load-more" @click="allMore(1)">添加更多</div>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <div v-if="seriesId">
          <div class="knowledge-base-search">
            <el-input placeholder="搜索" v-model="input" clearable @clear="getKBSpeechcraft(2, 'init')" size="mini">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="getKBSpeechcraft(2, 'init')"></i>
            </el-input>
          </div>
          <div class="sales-content-list">
            <div v-if="siveActivity.length > 0" class="sc-content-item">
              <el-collapse accordion>
                <el-collapse-item  v-for="(item, index) in siveActivity" :key="index">
                  <template slot="title">
                    <div class="sc-item-title">{{item.titleAll}}</div>
                  </template>
                  <div class="sc-item-detail">
                    {{item.content}}
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div v-else class="no-data">暂无数据</div>
          </div>
        </div>
      </div>
      <div v-if="currentTab == 2" class="sales-activity record-activity">
        <div class="knowledge-base-search">
          <el-input placeholder="搜索" v-model="input" clearable @clear="getKBGroupActivity('init')" size="mini">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="getKBGroupActivity('init')"></i>
          </el-input>
        </div>
        <div class="sales-content-list">
          <div class="sc-content-item">
            <el-collapse accordion>
            <el-collapse-item  v-for="(item, index) in groupActivity" :key="index">
              <template slot="title">
                  <div class="sc-item-title">
                    <div class="title-store">{{item.activityTypeTitle}}<span v-if="item.activityType == 1">-{{item.areaOverview}}</span></div>
                    <div>{{item.title}}</div>
                  </div>
              </template>
              <div class="sc-item-detail">
                <div class="font-16">适用门店：{{item.areaOverview}}</div>
                <div class="font-16">活动有效期：{{item.startDate}} —— {{item.endDate}}</div>
                <div>活动内容：{{item.content}}</div>

              </div>
            </el-collapse-item>
          </el-collapse>
          </div>
        </div>
      </div>
      <div v-if="currentTab == 3" class="sive-activity record-activity">
        <div class="knowledge-base-search">
          <el-input placeholder="搜索" v-model="input" clearable @clear="getKBSpeechcraft(1, 'init')" size="mini">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="getKBSpeechcraft(1, 'init')"></i>
          </el-input>
        </div>
        <div class="sive-content-list">
          <div class="sc-content-item">
            <el-collapse accordion>
            <el-collapse-item  v-for="(item, index) in normalActivity" :key="index">
              <template slot="title">
                <div class="sc-item-title">{{item.titleAll}}</div>
              </template>
              <div class="sc-item-detail">
                {{item.content}}
              </div>
            </el-collapse-item>
          </el-collapse>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识库意向车型管理 -->
    <el-dialog
      class="add-car-dialog"
      :visible.sync="dialogVisible"
      width="480px"
      :title="addType == 1 ? '知识库意向车型管理': '知识库对比车型管理'"
      :before-close="handleClose"
    >
      <div class="dialog-center">
        <el-row :gutter="22" v-if="addType == 1">
          <el-col :span="24" class="m-b-15" v-for="(item, index) in archiveModelsList" :key="'a'+index">
            <el-row class="rowmbottom10">
              <el-col :span="5">
                <div class="grid-content-left">
                  意向车型{{index + 1}}：
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content grid-content-right">
                  {{item.modelName || item.modelId}}
                </div>
              </el-col>
            </el-row>
          </el-col>
          <add-models-temp :key="time" :length="archiveModelsList.length" :data="kbModelsData" :type="1" @deleteFn="deleteFn" @callbackFn="callbackFn" @callbackFlagFn="callbackFlagFn"></add-models-temp>
        </el-row>
        <el-row :gutter="22" v-if="addType == 2">
          <add-models-temp :key="time" :length=0 :data="kbModelsData2" :type="2" @deleteFn="deleteFn" @callbackFn="callbackFn" @callbackFlagFn="callbackFlagFn"></add-models-temp>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" size="medium" class="w-90 plain-btn-style" @click="handleClose" round>取消</el-button>
        <el-button type="primary" size="medium" class="w-90" @click="save(addType)" round>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Http from '@/apis/work'
import TabsScrm from "@/components/TabsScrm";
import addModelsTemp from "./addModelsTemp";

export default {
  components: { TabsScrm, addModelsTemp},
  props: ["competeModels","archiveModels", "followType", "extendDataIdx"],
  data() {
    return {
      tabs: [
        { title: "车型对比", name: "0" },
        { title: "攻防话术", name: "1" },
        { title: "当前活动", name: "2" },
        { title: "常用话术", name: "3" }
      ],
      currentTab: "0",

      checked: '',
      options:[
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }
      ],
      value: '',
      models1:{
        name: '传祺CS4 2020款 270T 自动尊享版',
        price: '9.09',
        params:{
          '厂商': '广汽乘用车',
          '级别': 'suv',
          '级别2': 'suv',
          '级别3': 'suv',
          '级别4': 'suv',
          '级别5': 'suv',
          '级别6': 'suv',
          '级别7': 'suv',
          '级别8': 'suv',
          '级别9': 'suv',
          '级别0': 'suv',
          '级别01': 'suv',
        },
        cheshen: {
          width: 1900,
          height: 1200,
        }
      },
      models2:{
        name: '传祺CS4 2020款 270T 自动尊享版222',
        price: '9.092',
        params:{
          '厂商': '广汽乘用车2',
          '级别': 'suv2',
        },
        cheshen: {
          width: 1900,
          height: 1200,
        }
      },


      input: "",
      siveActivity: [], //攻防话术
      normalActivity: [], //常用话术
      groupActivity: [], //当前活动
      modelData1: '',  //车型信息
      modelData2: '',  //车型信息

      model1: '', //比对车型1
      model2: '', //比对车型2
      competeModels1: '', // 车型选择下拉数据
      competeModels2: '',
      dialogVisible: false,
      addCarModel: [],
      filter: {

      },
      addType: 1, // 1 知识库意向车型管理、 2知识库对比车型管理
      seriesId: '',

      kbModelsData: [], //自加车型（意向车型）
      kbModelsData2: [], //自加车型（对比车型）
      archiveAndModels: [], // 档案意向车型+自加车型
      intentionInfoOptions: [],  //可编辑的自加车型
      brandOptions: [],
      seriesOptions: [],
      modelOptions: [],  // 集团车型下拉列表
      compareModels: [],  // 对比车型

      recordPage: {
          totalCount: 0,
          page: 1,
          pageSize: 20,
          totalPage: 1
      },
      recordDom: null,
      time: '',
      addModels: [],
      intentionInfoOptionsFlag: [],
    };
  },
  created(){
    console.log('档案车型', this.archiveModels)
    if(this.$route.query.id){ //新增档案的时候获取不了车型也添加不了
      this.getKBModels(null, 1); //获取自加车型
      this.getKBModels(null, 2); //获取自加车型
    }else{
      this.archiveAndModels = this.archiveModelsList;
    }
    

    

    // this.intentionInfoOptions.push({
    //   brandOptions: [],
    //   seriesOptions: [],
    //   modelOptions: []
    // })
    

    // this.getKBModelParams(1);
    this.competeModels1 = Object.assign({},this.competeModels);
    this.competeModels2 = Object.assign({},this.competeModels);
    
    this.model1 = (this.archiveModels && this.archiveModels[this.extendDataIdx] && this.archiveModels[this.extendDataIdx].modelId) || '';
    this.seriesId = (this.archiveModels && this.archiveModels[this.extendDataIdx] && this.archiveModels[this.extendDataIdx].carSeriesId) || '';
    if(this.model1){
      this.getKBModelParams(1);
    }

  },
  computed:{
    archiveModelsList(){
      let list = []
      this.archiveModels.forEach((element)=>{
        if(!element.modelId || !element.modelName){

        }else{
          element.brandId = element.brandId || '';
          element.brandName = element.brandName || '';
          element.carSeriesId = element.carSeriesId || '';
          element.carSeriesName = element.carSeriesName || '';
          element.modelId = element.modelId ? element.modelId : element.modelName; //id不存在时显示车型名称
          element.modelName = element.modelName;
          list.push(element)
        }
        console.log(list)
      })
      return list;
    }
  },
  mounted(){
    // 滚动条监听
    this.recordDom = document.querySelector('.record-activity');
    console.log(this.recordDom)
    this.recordDom.addEventListener('scroll', this.onRecordDomScroll, true);
  },
  methods: {
    onRecordDomScroll() {
      let scrollTop = this.recordDom.scrollTop;
      let clientHeight = this.recordDom.clientHeight;
      let scrollHeight = this.recordDom.scrollHeight;

      if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
          // 请求加载更多
          if(this.currentTab == 0){

          }else{
            if (this.recordPage.page >= this.recordPage.totalPage) {
                return;
            }
            this.recordPage.page++;
            this.recordPage.pageSize = 20;
            if(this.currentTab == 1){
              this.getKBSpeechcraft(2);
            }else if(this.currentTab == 2){
              this.getKBGroupActivity();
            }else if(this.currentTab == 4){
              this.getKBSpeechcraft(1);
            }
            
          }
          
      }
    },
    tabChange(item) {
      this.currentTab = item;
      this.input = '';
      // this.seriesId = '';
      switch(item){
        case '0': 
          // this.getKBModelParams();
          break;
        case '1': 
          this.getKBSpeechcraft(2, 'init');
          break;
        case '2': 
          this.getKBGroupActivity('init');
          break;
        case '3': 
          this.getKBSpeechcraft(1, 'init');
          break;
        default:
          break;
      }
    },
    //潜客跟进 - 获取知识库内容 - 车型信息
    getKBModelParams(type){
      Http.getKBModelParams({
        modelId: type == 1 ? this.model1 : this.model2 //车型id
      }).then(res => {
        this.$store.commit("closeLoading");
        this.$handleResponse(res, res => {
          // 数据处理
          if(type == 1){
            this.modelData1 = res;
          }else{
            this.modelData2 = res;
          }
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    //潜客跟进 - 获取知识库内容 - 话术
    getKBSpeechcraft(type, reset){
      if(reset == 'init') {
          this.normalActivity = [];
          this.siveActivity = [];
          this.recordPage.page = 1;
          this.recordPage.pageSize = 20;
      }
      const { page, pageSize } = this.recordPage
      Http.getKBSpeechcraft({
        type: type, //1:销售话术，2攻防话术
        kwd: this.input,
        seriesId: this.seriesId, //车系id
        page,
        pageSize
      }).then(res => {
        this.$store.commit("closeLoading");
        this.$handleResponse(res, res => {
          // 数据处理
          const { list, page} = res;
          if (list.length > 0) {
            if(type == 1){
              this.normalActivity = [...this.normalActivity, ...list];
            }else{
              this.siveActivity = [...this.siveActivity, ...list];
            }
          }
          this.recordPage.totalCount = page.totalCount;
          this.recordPage.totalPage = page.totalPage;
          
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    // 当前活动列表
    getKBGroupActivity(reset){
      if(reset == 'init') {
          this.groupActivity = [];
          this.recordPage.page = 1;
          this.recordPage.pageSize = 20;
      }
      const { page, pageSize } = this.recordPage
      Http.getKBGroupActivity({
        kwd: this.input,
        page,
        pageSize
      }).then(res => {
        this.$store.commit("closeLoading");
        this.$handleResponse(res, res => {
          // 数据处理
          const { list, page} = res;
          if (list.length > 0) {
              this.groupActivity = [...this.groupActivity, ...list];
          }
          this.recordPage.totalCount = page.totalCount;
          this.recordPage.totalPage = page.totalPage;
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    // 选择意向车型
    modelChange(type){
      if(type == 1 || type == 2){
        this.getKBModelParams(type);
      }else if(type == 3){
        console.log(this.seriesId);
        this.getKBSpeechcraft(2,'init');
      }else if(type == 4){
        console.log(this.seriesId);
        this.getKBSpeechcraft(1, 'init');
      }
    },
    clearModle(type){
      if(type == 1){
        this.model1 = '';
        this.modelData1 = '';
      }else{
        this.model2 = '';
        this.modelData2 = '';
      }
    },
    // 知识库意向车型管理
    allMore(type){
      this.addType = type;
      this.time = new Date().getTime();
      this.dialogVisible = true;
      if(type == 1){
        this.getKBModels('true')
      }else if(type == 2){
        this.addCarModel = [];
        this.intentionInfoOptions = [];
        if(this.compareModels && this.compareModels.length > 0){
          //知识库意向车型管理
          this.compareModels.forEach((element,index) => {
            this.addCarModel.push({
              modelName: element.modelName,
              brandId: element.brandId,
              carSeriesId: element.carSeriesId,
              modelId: element.modelId,
            })
            this.intentionInfoOptions.push({
              brandOptions: [],
              seriesOptions: [],
              modelOptions: []
            })
            console.log(this.addCarModel)
            this.getBrandList(index, 'noclear', type);
            if(this.addCarModel[index].brandId){
              this.changeBrand(1, index, 'noclear')
            }
            if(this.addCarModel[index].carSeriesId){
              this.changeSeries(1, index, 'noclear')
            }
          });
        }else{
          this.addStroeAndCar(type);
        }
      }
    },
    // 知识库获取自加车型
    getKBModels(handle = false, modelType){
      Http.getKBModel({
        dataType: this.followType == 'cluesDeal' ? 2 : 1, //数据类型，1潜客，2线索
        dataId:this.$route.query.id,  //对应潜客或者线索的id
        modelType: modelType, //车型类型，1意向车型，2对比车型
      }).then(res => {
        this.$store.commit("closeLoading");
        this.$handleResponse(res, res => {
          // 数据处理
          if(modelType == 1){
            this.kbModelsData = res;
            this.archiveAndModels = this.archiveModelsList.concat(this.kbModelsData);
          }else{
            this.kbModelsData2 = res;
            this.model2 = res[0] && res[0].modelId;
            if(this.model2){
              this.getKBModelParams(2);
            }else{
              this.modelData2 = '';
            }
          }
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    addStroeAndCar(type) {
      this.addCarModel.push({
        brandId: '',
        carSeriesId: '',
        modelId: ''
      });
      this.intentionInfoOptions.push({
        brandOptions: [],
        seriesOptions: [],
        modelOptions: []
      })
      this.getBrandList(this.addCarModel.length - 1, '', type);
    },
    clearCar(index){
      this.addCarModel.splice(index, 1);
      this.intentionInfoOptions.splice(index, 1);
    },
    //弹窗 关闭
    handleClose() {
      this.dialogVisible = false;
    }, 
    // 知识库删除自加车型 记录id
    deleteFn(id){
      Http.deleteKBModel({id: id})
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            this.$message.success('删除成功');
            this.getKBModels(null, this.addType);
          }, true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    //知识库车型修改
    callbackFn(data){
      console.log(data)
      // this.save(this.dataType, data)
      this.addCarModel = data;
    },
    callbackFlagFn(data){
      this.intentionInfoOptionsFlag = data;
    },
    //知识库添加(修改)车型
    save(type) {
      if(this.intentionInfoOptionsFlag && this.intentionInfoOptionsFlag.length > 0){
        let params = {
          dataType: this.followType == 'cluesDeal' ? 2 : 1, //数据类型，1潜客，2线索
          dataId:this.$route.query.id,  //对应潜客或者线索的id
          userId: this.$route.query.userId,  //对应的user id
          modelType: type, //车型数据类型，1意向车型，2对比车型
          models: this.addCarModel,
        }
        Http.setBKeditModel(params)
          .then(res => {
            this.$handleResponse(res, res => {
              // 数据处理
              this.$message.success('保存成功');
              this.handleClose();
              this.getKBModels(null, type);
            },true);
          })
          .catch(err => {
            this.$store.commit("closeLoading");
          });
        if(type == 1){  //意向车型管理保存
          
        }else if(type == 2){
          this.compareModels = this.addCarModel;
          console.log(this.compareModels);  
        }
      }else{
        this.handleClose();
      }
    },
    getBrandList(index, noclear, type){
        // type == 2对比车型， 1意向车型
        let queryName = type == 2 ? 'carBrandAll' : 'carBrand'
        this.$fetch.common[queryName]({},false).then((res)=>{
            this.$handleResponse(res, res=>{
              this.intentionInfoOptions[index].brandOptions = this.$hasArrContent(res)?res:[];
            }, false);
            
        })
    },
    changeBrand(type, index, noclear){
        if(!noclear){
          this.addCarModel[index].carSeriesId = '';
          this.addCarModel[index].modelId = '';
          this.intentionInfoOptions[index].seriesOptions = [];
          this.intentionInfoOptions[index].modelOptions = [];
        }
        
        this.$fetch.common.carSeries({'brandId': this.addCarModel[index].brandId},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.intentionInfoOptions[index].seriesOptions = this.$hasArrContent(res)?res:[];
            }, false);
        })
        
    },
    changeSeries(type, index, noclear){
      if(!noclear){
        this.addCarModel[index].modelId = '';
        this.intentionInfoOptions[index].modelOptions = [];
      }
      this.$fetch.common.carModel({'seriesId': this.addCarModel[index].carSeriesId},false).then((res)=>{
          this.intentionInfoOptions[index].modelOptions = this.$hasArrContent(res.data.data)?res.data.data:[];
      })
        
    },
    changeModel(type, index){
        if(this.addType == 2){  //加上车型名称
          console.log(this.intentionInfoOptions[index].modelOptions, this.addCarModel[index].modelId, index);
          this.intentionInfoOptions[index].modelOptions.forEach(element => {
            if(element.id == this.addCarModel[index].modelId)
            this.addCarModel[index]['modelName'] = element.title;
          });
        }
        this.$forceUpdate();
    }
  }
};
</script>
<style lang="scss" scoped>
.tabs-pane .knowledge-base-search >>> .el-input--suffix .el-input__inner {
  border-radius: 36px;
  // height: 24px;
  // color: #3d7eff;
  // border-color: #409EFF;
  // border-radius: 0;
}
// .tabs-pane .models-contrast-select >>> .el-input--suffix .el-input__inner{
//   height: 30px;
//   color: #3d7eff;
//   border-color: #409EFF;
//   border-radius: 0;
// }
.knowledge-base .models-contrast{
  .models-Gtitle{
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    padding-left: 8px;
    color: #212427;
	  background-color: #eaebf0;
  }
  .models-group{
    display: flex;
  }
  .models-group.models-group-top{
    height: 215px;
  }
  .models-group-items{
    width: 33%;
    padding: 8px;
    border-bottom: 1px solid #eaebf0;
    word-break: break-all;
  }
  .models-group-items:not(:last-child){
    border-right: 1px solid #eaebf0;
  }
  .models-group-items-first{
    color: #2a57b0;
    text-align: right;
  }
  .models-group-top .models-group-items{
    padding-top: 15px
  }
  .models-group-top .models-group-items.models-group-item1{
    padding: 15px;
    line-height: 1.5;
    color: #616063;
    /deep/ .el-checkbox__label{
      padding-left: 4px;
    }
  }
  .models-info{
    position:relative;
    .close-icon{
      position: absolute;
      right: -5px;
      top: -10px;
      cursor: pointer;
    }
    .cont-flex{
      min-height: 199px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px 0;
      text-align: center;
      .img-box{
        // background-color: #eaebf0;
        width: 100%;
        min-height: 53px;
        margin: 0 auto;
        img{
          width: 100%;
          display: block;
        }
      }
    }
  }
}
.knowledge-base {
  font-size: 14px;
  .knowledge-base-search {
    padding: 10px;
    background-color: #f7faff;
  }
  
}
.knowledge-base >>> .el-collapse-item__header{
  height: auto;
  line-height: 1;
}
// .knowledge-base >>> .el-collapse-item__arrow{
//   display: none;
// }
.knowledge-base >>> .el-collapse-item__header.is-active{
  background-color: #f2f8fc;
}
.knowledge-base >>> .el-collapse-item__wrap .el-collapse-item__content{
  padding-bottom: 10px
}
.store-activity, .sales-activity, .sive-activity{
  .sc-content-item{
    .sc-item-title{
      padding: 15px 10px;
      font-size: 14px;

      .title-store{
        padding-bottom: 10px;
        font-size: 14px;
        color: #212427;
      }
    }
    .sc-item-detail{
      padding: 10px 20px 0;
      font-size: 14px;
      word-break: break-all;
      .font-16{
        font-size: 14px;
        color: #212427;
      }
    }
    .sc-detail-li{
      display: flex;
    }
    .sc-detail-li.scene{
      padding-bottom: 15px;
    }
    .sc-detail-tags{
      background-color: #ff8964;
      padding: 0 8px;
      color: #fff;
      height: 24px;
    }
    .skills .sc-detail-tags{
      background-color: #616063;
    }
    .sc-detail{
      flex: 1;
      margin-left: 15px;
      background-color: #f2f8fc;
      border: solid 1px #dcdfe6;
      padding: 0 8px;
    }
    
  }
}
.setting-icon{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #212427;
  
}
.setting-icon.setting-icon-bp {
  background-color: #212427;
}
.setting-icon.setting-icon-xp {
  background-color: #fff;
}
.knowledge-base >>> .el-tabs__nav{
  display: flex;
  width: 100%;
}
.knowledge-base >>> .el-tabs__item{
  padding: 0px!important;
  width: 25%;
  text-align: center;
  height: 42px!important;
  line-height: 42px!important;
}
.knowledge-base /deep/ .el-tabs__header{
  margin-bottom: 0;
  height: 42px!important;
}
.knowledge-base, .tabs-pane{
  height: 100%;
}
.models-contrast, .store-activity, .sales-activity, .sive-activity{
  height: calc(100% - 50px);
  overflow: auto;
  &::-webkit-scrollbar {
      width: 6px;
      border-radius: 25px;
      opacity: 0;
      -webkit-transition: opacity .12s ease-out;
      transition: opacity .12s ease-out;
  }

  &::-webkit-scrollbar-thumb {
      border-radius: 25px;
      background-color: rgba(144, 147, 153, 0.3);
      -webkit-transition: background-color .3s;
      transition: background-color .3s;
  }
}

.models-contrast-select .option-load-more{
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #409EFF;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
  background-color: #F5F7FA;
}
.store-activity .store-activity-car, .sive-activity .store-activity-car{
  background-color: #f7faff;
  padding: 10px 15px;
  border-bottom: 1px solid #eaebf0;
  display: flex;
  .width-75 {
    width: 75px;
  }
  .width-right-cont{
    flex: 1;
  }
  .grid-content-left {
    text-align: left;
    margin-right: 6px;
    line-height: 36px;
    font-size: 13px;
  }
  .grid-content-right{
    line-height: 36px;
  }
}
.add-car-dialog{
  .grid-content-left {
    text-align: right;
    margin-right: 6px;
    line-height: 36px;
    font-size: 13px;
  }
  .grid-content-right{
    line-height: 36px;
  }
  .close-icon{
    display: inline-block;
    margin: 7px;
    img{
      vertical-align: middle;
    }
  }
}

</style>
