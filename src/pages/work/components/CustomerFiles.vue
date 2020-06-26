<template>
  <div class="customer-files-page">
    <div class="lt-title">客户档案
      <div v-if="type == 'customerFollow'">
        <div v-if="!editable">
          <span class="customer-files-btn edit-btn" @click="edit()">编辑</span>
        </div>
        <div v-else>
          <span class="customer-files-btn save-btn" @click="saveCustomer()">保存</span>
          <span class="customer-files-btn cancle-btn" @click="cancel()">取消</span>
        </div>
      </div>
    </div>
    <div class="customer-files-content" :class="{'customer-files-content-edit': editable}">
      <el-row :gutter="22" class="customer-form">
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                客户姓名
                <span class="red">*</span>
              </div>
            </el-col>

            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" style="display: flex;" v-if="!editable">
                <span style="flex: 1;">{{customersView.nickname}}</span>
                <span>{{customersView.gender}}</span>
              </div>
              <div class="grid-content" style="display: flex;" v-else>
                <el-input style="flex: 1;" v-model="customers.nickname" placeholder="请输入" size="mini"></el-input>
                <div class="width-sex">
                  <el-radio-group
                    class="radio-button-level"
                    :gutter="24"
                    style="width:100%;"
                    v-model="customers.gender"
                    size="mini"
                  >
                    <el-radio-button
                        size="mini"
                        :label="item.value"
                        v-for="item in genderOptions"
                        :key="item.value"
                    >{{item.label}}</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">
                手机号码
                <span class="red">*</span>
              </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{customersView.tel}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-input v-model="customers.tel" placeholder="请输入" maxlength="11" size="mini"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">微信号</div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" style="display: flex;" v-if="!editable">
                <span style="flex: 1;">{{customersView.wechatNumber}}</span>
                <span v-if="customersView.wechatAdded == true" class="wechat-add"><i class="el-icon-circle-check"></i> 已加微信</span>
              </div>
              <div class="grid-content" style="display: flex;" v-else>
                <el-input style="flex: 1;" v-model="customers.wechatNumber" placeholder="请输入" size="mini"></el-input>
                <el-checkbox
                    style="line-height: 28px;padding-left: 10px;"
                    v-model="customers.wechatAdded"
                >已加微信</el-checkbox>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10 store-and-car" :class="{'store-and-car-oth': index!=0}" v-for="(items, index) in intentionArchive" :key="index+'archive'">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">归属门店{{index+1}}<span class="red">*</span></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{data.intentionInfo[index].areaName}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-select
                    disabled
                    style="width:100%;"
                    v-model="items.areaId"
                    filterable
                    placeholder="请选择"
                    @change="areaIdChange(1, index)"
                    size="mini"
                >
                    <el-option
                        v-for="item in areaListOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                        :disabled="areaIdHasSelect.indexOf(item.id) > -1"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowmbottom10" style="margin-top: 10px;">
            <el-tooltip effect="dark" placement="top" content="DCC需要根据文本从车型库选取对应的意向车型">
              <div class="car-ques-icon" v-if="editable && isNaN(items.modelId)"><i class="el-icon-question"></i></div>
            </el-tooltip>
            
            <el-col class="width-75">
              <div class="grid-content-left">意向车型{{index+1}}<span class="red">*</span></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{data.intentionInfo[index].modelName}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-select
                    style="width:100%;"
                    v-model="items.brandId"
                    placeholder="请选择"
                    filterable
                    @change="changeBrand(1, index)"
                    :class="items.brandId==''?'c-placeholder':''"
                    size="mini"
                >
                    <el-option
                        v-for="item in intentionArchiveOptions[index].brandOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    style="width:100%;margin-top: 10px;"
                    v-model="items.carSeriesId"
                    placeholder="请选择"
                    filterable
                    @change="changeSeries(1, index)"
                    :class="items.carSeriesId==''?'c-placeholder':''"
                    size="mini"
                >
                    <el-option
                        v-for="item in intentionArchiveOptions[index].seriesOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    style="width:100%;margin-top: 10px;"
                    v-model="items.modelId"
                    placeholder="请选择"
                    filterable
                    @change="changeModel(true, index, 'edit')"
                    :class="items.modelId==''?'c-placeholder':''"
                    size="mini"
                >
                    <el-option
                        v-for="item in intentionArchiveOptions[index].modelOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowmbottom10" style="margin-top: 10px;">
            <el-col class="width-75">
              <div class="grid-content-left">客户来源<span class="red">*</span></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{data.intentionInfo[index].fromTopText}} - {{data.intentionInfo[index].fromSecondText}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-select
                    disabled
                    style="width:100%;"
                    v-model="items.fromTopId"
                    placeholder="一级来源"
                    filterable
                    @change="sourceChange(index)"
                    size="mini"
                >
                    <el-option
                      v-for="item in clueFromOptions"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    disabled
                    style="width:100%;margin-top: 10px;"
                    v-model="items.fromSecondId"
                    placeholder="二级来源"
                    filterable
                    @change="sourceSecondChange"
                    size="mini"
                >
                    <el-option
                        v-for="item in source_second"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10 store-and-car store-and-car-oth" v-if="editable" v-for="(items, index) in intentionInfo" :key="index">
          <div class="close-icon" @click="clearCar(index)">
            <img class="" :src="require('@/assets/images/work/close-black.png')">
          </div>
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">归属门店{{intentionArchive.length+index+1}}<span class="red">*</span></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{customersView.areaId}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-select
                    style="width:100%;"
                    v-model="items.areaId"
                    filterable
                    placeholder="请选择"
                    @change="areaIdChange(2, index)"
                    size="mini"
                >
                    <el-option
                        v-for="item in areaListOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                        :disabled="areaIdHasSelect.indexOf(item.id) > -1"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowmbottom10" style="margin-top: 10px;">
            <!-- <div class="car-ques-icon" v-if="editable"><i class="el-icon-question"></i></div> -->
            <el-col class="width-75">
              <div class="grid-content-left">意向车型{{intentionArchive.length+index+1}}<span class="red">*</span></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-select
                    style="width:100%;"
                    v-model="items.brandId"
                    placeholder="请选择"
                    filterable
                    @change="changeBrand(2, index)"
                    :class="items.brandId==''?'c-placeholder':''"
                    size="mini"
                >
                    <el-option
                        v-for="item in intentionInfoOptions[index].brandOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    style="width:100%;margin-top: 10px;"
                    v-model="items.carSeriesId"
                    placeholder="请选择"
                    filterable
                    @change="changeSeries(2, index)"
                    :class="items.carSeriesId==''?'c-placeholder':''"
                    size="mini"
                >
                    <el-option
                        v-for="item in intentionInfoOptions[index].seriesOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    style="width:100%;margin-top: 10px;"
                    v-model="items.modelId"
                    placeholder="请选择"
                    filterable
                    @change="changeModel(true, index)"
                    :class="items.modelId==''?'c-placeholder':''"
                    size="mini"
                >
                    <el-option
                        v-for="item in intentionInfoOptions[index].modelOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row class="rowmbottom10" style="margin-top: 10px;">
            <el-col class="width-75">
              <div class="grid-content-left">客户来源{{intentionArchive.length+index+1}}<span class="red">*</span></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <el-select
                    style="width:100%;"
                    v-model="items.fromTopId"
                    placeholder="一级来源"
                    filterable
                    @change="sourceChange(index)"
                    size="mini"
                >
                    <el-option
                      v-for="item in clueFromOptions"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                </el-select>
                <el-select
                    style="width:100%;margin-top: 10px;"
                    v-model="items.fromSecondId"
                    placeholder="二级来源"
                    filterable
                    @change="sourceSecondChange"
                    size="mini"
                >
                    <el-option
                        v-for="item in source_second"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10 store-and-car-btn" v-if="editable">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left" style="width: 88.5px;height: 1px;"></div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content">
                <div style="">
                  <el-button
                    :gutter="24"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addStroeAndCar"
                  >新增门店和车型</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
                <div class="grid-content-left">
                    购车区域
                    <span class="red">*</span>
                </div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{customersView.provinceName}}-{{customersView.cityName}}-{{customersView.regionName}}</span>
              </div>
              <div class="grid-content" v-else>
                    <el-col :span="8">
                        <el-select
                            style="width: 98%;"
                            v-model="customers.provinceId"
                            filterable
                            placeholder="省"
                            @change="changeSheng"
                            :class="customers.provinceId==''?'c-placeholder':''"
                            size="mini"
                        >
                            <el-option
                                v-for="option in address"
                                :label="option.regionName"
                                :key="option.id"
                                :value="option.id"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-select
                            style=""
                            v-model="customers.cityId"
                            placeholder="市"
                            filterable
                            @change="changeShi"
                            :class="customers.cityId==''?'c-placeholder':''"
                            size="mini"
                        >
                            <el-option
                                v-for="option in shiAddress"
                                :label="option.regionName"
                                :key="option.id"
                                :value="option.id"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-select
                            style=""
                            v-model="customers.regionId"
                            placeholder="区"
                            filterable
                            @change="changeQu"
                            :class="customers.regionId==''?'c-placeholder':''"
                            size="mini"
                        >
                            <el-option
                                v-for="option in quAddress"
                                :label="option.regionName"
                                :key="option.id"
                                :value="option.id"
                            ></el-option>
                        </el-select>
                    </el-col>
                </div>
            </el-col>
        </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">购车指标</div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{customersView.buyQuotaText}}</span>
              </div>
              <div class="grid-content" v-else>
                  <el-radio-group
                      class="radio-button-level"
                      :gutter="24"
                      style="width:100%;"
                      v-model="customers.buyQuota"
                      size="mini"
                  >
                      <el-radio-button
                          :label="item.value"
                          v-for="item in buyQuotaOptions"
                          :key="item.value"
                      >{{item.label}}</el-radio-button>
                  </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </el-col>
        
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">购车类型</div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{customersView.buyTypeText}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-select
                  :gutter="24"
                  style="width:100%;"
                  v-model="customers.buyType"
                  filterable
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="item in buyTypeOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" class="m-b-10">
          <el-row class="rowmbottom10">
            <el-col class="width-75">
              <div class="grid-content-left">是否贷款</div>
            </el-col>
            <el-col class="width-right-cont">
              <div class="grid-content grid-content-right" v-if="!editable">
                <span>{{customersView.isMortgageText}}</span>
              </div>
              <div class="grid-content" v-else>
                <el-radio-group
                    class="radio-button-level"
                    :gutter="24"
                    style="width:100%;"
                    v-model="customers.isMortgage"
                    size="mini"
                >
                    <el-radio-button
                        :label="item.value"
                        v-for="item in isMortgageOptions"
                        :key="item.value"
                    >{{item.label}}</el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
  
</template>
<script>
import * as Http from '@/apis/work'
import { addArrToOptions } from '@/utils/util' 
export default {
  props: ["data", "type","followFormData", "areaList"],
  data() {
    return {
      customers: {
        fromTopId: '',
        fromSecondId: ''
      }, //档案信息
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
      buyQuotaOptions:[
        {
          value: "1",
          label: "有"
        },
        {
          value: "2",
          label: "无"
        }
      ],
      isMortgageOptions:[
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      options: [
        {
          value: "1",
          label: "是"
        },
        {
          value: "2",
          label: "否"
        }
      ],
      isView: true,

      // clueFromOptions: this.followFormData.clueFrom, //线索来源
      // buyTypeOptions: this.followFormData.buyType,   //购买类型
      // areaListOptions: this.followFormData.areaList,  //归属门店可选门店列表
      source_second: '',
      editable: false,
      customersView: '',  //编辑时的数据
      intentionInfo:[],
      intentionInfoOptions: [],
      intentionArchive: [], //潜客意向信息
      intentionArchiveOptions: [],  //潜客意向信息下拉数据
      cars: [],
      address: "", //购车城市
      shiAddress: "",
      sheng: "",
      quAddress: "",
      gender: '',
      areaIdHasSelect: [], //存储已选择的门店id
      dtIntentionInfo: [],
    };
  },
  created(){
    console.log(this.data)
    // this.intentionArchive = this.data.intentionArchive;
    
    if(this.type == 'customerFollow'){
    }else{
      this.editable = true;
    }

    // this.initData(this.data);
    
    
    this.getCitys(); //购车城市

    this.initData(this.data);

  },
  computed: {
    clueFromOptions(){
      return this.followFormData.clueFrom; //线索来源
    },
    buyTypeOptions(){
      return this.followFormData.buyType; //购买类型
    },
    areaListOptions(){
      // return this.areaList; //归属门店可选门店列表
      return addArrToOptions(this.dtIntentionInfo,'areaId', 'areaName', this.areaList,'id','title'); // 下拉框增加已删除的值
    }
    // 'customers[gender]':{
    //   get: function () {
    //     let genderText = '';
    //     if(this.gender == 1){
    //       genderText = '男';
    //     }else if(this.gender == 2){
    //       genderText = '女';
    //     }else{
    //       genderText = ''
    //     }
    //     return  genderText;
    //   }
    // }
  },
  methods: {
    initData(data){
      this.intentionArchive = [];
      let intentionInfo = this.data.intentionInfo || [];
      this.areaIdHasSelect = [];
      intentionInfo.forEach((element,index) => {
      this.intentionArchive.push({
        id: element.id, //潜客跟进-意向id 
        areaId: element.areaId && element.areaId.toString(),  //返回的是数字，和列表字符串类型不匹配
        brandId: element.brandId || '',
        carSeriesId: element.carSeriesId || '',
        modelId: element.modelId ? element.modelId : element.modelName, //id不存在时显示车型名称
        fromTopId: element.fromTopId || '',
        fromSecondId: element.fromSecondId || '',
        clueId: element.clueId && parseInt(element.clueId)    //对应线索id
      })
      this.dtIntentionInfo.push({
        areaId: element.areaId && element.areaId.toString(),
        areaName: element.areaName
      });
      this.intentionArchiveOptions.push({
        brandOptions: [],
        seriesOptions: [],
        modelOptions: []
      })
      if(this.intentionArchive[index].areaId){
        this.getBrandList(this.intentionArchive[index].areaId, 1, index);
      }
      if(this.intentionArchive[index].brandId){
        this.changeBrand(1, index, 'noclear')
      }
      if(this.intentionArchive[index].carSeriesId){
        this.changeSeries(1, index, 'noclear')
      }
      setTimeout(()=>{
        //匹配客户来源数据
        this.intentionArchive.forEach((element,index) => {
          if(element.fromTopId){
            this.sourceChange(index, 'noclear');
          }
        });
      },0)
      
      console.log(this.intentionArchive, this.data.intentionArchive)
      this.handleAreaIdHasSelect();
    });

      this.customers = {
        nickname: data.nickName || data.nickname,
        gender: data.gender, //性别，1男，2女
        tel: data.tel,
        wechatNumber: data.wechatNumber,
        wechatAdded: data.wechatAdded == 1? true: false,
        buyType: data.buyType,
        isMortgage:data.isMortgage, //是否贷款，0未知，1是，2否
        provinceId: data.provinceId || '', //以下三个是购车区域
        cityId: data.cityId ? data.cityId : data.cityName, //
        regionId: data.regionId || '',//
        buyQuota: data.buyQuota, //购车指标，0未知，1有，2无
      };
      console.log(this.customers)
      if(data.gender == '男'){
        this.gender = 1;
      }else if(data.gender == '女'){
        this.gender = 2;
      }else{
        this.gender = ''
      }

      this.customersView = Object.assign({},this.data);
      this.customersView.gender = data.gender == 1? '男' : '女';
    },
    addStroeAndCar() {
      console.log(this.customers.gender)
      if (!this.customers.nickname) {
        this.$message.error("请填写线索姓名");
        return;
      }
      if (!this.customers.gender) {
        this.$message.error("请填写性别");
        return;
      }
      if (!this.customers.tel) {
        this.$message.error("请填写线索号码");
        return;
      }
      this.intentionInfo.push({
          areaId: '',
          brandId: '',
          carSeriesId: '',
          modelId: '',
          fromTopId: '',
          fromSecondId: ''
        });
      this.intentionInfoOptions.push({
        brandOptions: [],
        seriesOptions: [],
        modelOptions: []
      })
    },
    getCitys() {
      this.$fetch.work
        .getRegin({})
        .then(res => {
          this.$store.commit("closeLoading");
          this.$handleResponse(res, res => {
            console.log(res);

            this.address = res;
            // this.address.unshift({
            //   id: "",
            //   regionName: "全部",
            //   children: []
            // });
            this.address.forEach(res => {
              if (this.customers.provinceId == res.id) {
                this.sheng = res;
                this.shiAddress = res.children;
                res.children.forEach(res2 => {
                  if (this.customers.cityId == res2.id) {
                    this.shi = res2;
                    this.quAddress = res2.children;
                    res2.children.forEach(res3 => {
                      if (this.customers.regionId == res3.id) {
                        this.qu = res3;
                      }
                    });
                  }
                });
              }
            });
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    changeSheng() {
      this.customers.cityId = "";
      this.customers.regionId = "";
      this.shiAddress = [];
      this.quAddress = [];
      for (let i of this.address) {
        if (i.id == this.customers.provinceId) {
          // this.select.provinceName = i.regionName;
          this.shiAddress = i.children;
        }
      }
    },
    changeShi() {
      this.customers.regionId = "";
      this.quAddress = [];
      for (let i of this.shiAddress) {
        if (i.id == this.customers.cityId) {
          // this.select.cityName = i.regionName;
          this.quAddress = i.children;
        }
      }
    },
    changeQu(){
      // for (let i of this.quAddress) {
      //   if (i.id == this.customers.regionId) {
      //     this.select.regionName = i.regionName;
      //   }
      // }
    },
    //取当前二级来源
    sourceChange(index, noclear) {
      console.log(this.intentionArchive[index].fromTopId, this.clueFromOptions)
      if(!noclear){
        this.intentionArchive[index].fromSecondId = "";
      }
      for (let i of this.clueFromOptions) {
        if (i.id == this.intentionArchive[index].fromTopId) {
          console.log(i.children)
          this.source_second = i.children || [];
        }
      }
    },
    sourceSecondChange(){
      this.$forceUpdate();
    },
    edit(){
      // this.customersView = Object.assign({}, this.customers);
      this.editable = !this.editable;
    },
    saveCustomer(){
      //保存客户档案
      let params = Object.assign({}, this.customers);
      params.id = this.$route.query.id;//潜客档案id，有编辑，无是新增
      params.userId = this.$route.query.userId;//集团客户id
      params.gender = this.customers.gender;
      params.wechatAdded = params.wechatAdded == true ? 1 : 0;
      params.intentionInfo = this.intentionArchive;
      // params.intentionInfo = params.intentionInfo.concat(this.intentionInfo);
      console.log(params)

      if (!params.nickname) {
        this.$message.error("请填写线索姓名");
        return;
      }
      if (!params.gender) {
        this.$message.error("请填写性别");
        return;
      }
      if (!params.tel) {
        this.$message.error("请填写线索号码");
        return;
      }
      if (params.tel && !/^1[0-9]{10}$/.test(params.tel)) {
        this.$message.error("线索号码格式错误！");
        return;
      }
      let flag = true;
      try {
          params.intentionInfo.forEach((element, i) =>{
              if (!element.areaId) {
                this.$message.error("请选择归属门店");
                flag = false;
                throw Error();
              }
              if (element.areaId && !element.modelId) {
                this.$message.error("请选择意向车型");
                flag = false;
                throw Error();
              }
              // if (i <this.intentionArchive.length && !element.fromTopId) {
              //   this.$message.error("请选择客户来源");
              //   flag = false;
              //   throw Error();
              // }
          })
      } catch (e) {
      }
      if(!flag){  //通过throw error结束foreach循环，但是下面的代码仍然会执行，所以采用flag标志
        return;
      }
      if (!params.provinceId) {
        this.$message.error("请选择购车区域");
        return;
      }
      console.log('保存档案：', params)
      Http.editProfile(params)
      .then(res => {
        this.$handleResponse(res, res => {
          this.$message.success('保存成功');
          this.$emit('requeryDataFn'); //需要重新请求数据
          this.editable = !this.editable;
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
      
    },
    //潜客跟进 - 新增门店车型
    addIntentionInfo(data, index){
      let params = data[index];
      params['userId'] = this.$route.query.userId;//必须
      if(this.type == 'customerFollow'){
        params['intentionId'] = this.$route.query.id;//潜客id，潜客跟进需要
      }else{
        params['clueId'] = this.$route.query.id;//线索id，线索跟进
      }
      params['tel'] = this.customers.tel;
      params['nickname'] = this.customers.nickname;
      params['gender'] = this.customers.gender;
      Http.addIntentionInfo(params)
        .then(res => {
          this.$handleResponse(res, res => {
            // this.$message.success('保存成功');
            this.$emit('addIntentionInfoFn',res )
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    cancel(){
      // this.customers = Object.assign({},this.customersView);
      this.initData(this.data);
      this.editable = !this.editable;
    },
    clearCar(index){
      this.intentionInfo.splice(index, 1);
      this.intentionInfoOptions.splice(index, 1);
      this.handleAreaIdHasSelect();
    },
    handleAreaIdHasSelect(){
      this.areaIdHasSelect = [];
      this.intentionArchive.forEach((element)=>{
        this.areaIdHasSelect.push(element.areaId);
      })
      this.intentionInfo.forEach((element)=>{
        this.areaIdHasSelect.push(element.areaId);
      })
    },
    areaIdChange(type, index){
      this.handleAreaIdHasSelect();
      console.log(this.areaIdHasSelect)
      // this.cars = [];
      // this.intentionInfo.forEach(element => {
      //   this.cars.push(element.modelId)
      // });
      if(type == 1){
        this.intentionArchive[index].brandId = '';
        this.intentionArchive[index].carSeriesId = '';
        this.intentionArchive[index].modelId = '';
        this.intentionArchiveOptions[index].brandOptions = [];
        this.intentionArchiveOptions[index].seriesOptions = [];
        this.intentionArchiveOptions[index].modelOptions = [];
        this.getBrandList(this.intentionArchive[index].areaId, type, index);
      }
      if(type == 2){
        this.intentionInfo[index].brandId = '';
        this.intentionInfo[index].carSeriesId = '';
        this.intentionInfo[index].modelId = '';
        this.intentionInfoOptions[index].brandOptions = [];
        this.intentionInfoOptions[index].seriesOptions = [];
        this.intentionInfoOptions[index].modelOptions = [];
        this.getBrandList(this.intentionInfo[index].areaId, type, index);
      }

    },
    getBrandList(areaId, type, index){
        console.log(areaId)
        this.$fetch.common.carBrand({'areaId': areaId},false).then((res)=>{
            this.$handleResponse(res, res=>{
              if(type == 1){
                this.intentionArchiveOptions[index].brandOptions = this.$hasArrContent(res)?res:[];
              }else if(type == 2){
                this.intentionInfoOptions[index].brandOptions = this.$hasArrContent(res)?res:[];
              }
                
            }, false);
            
        })
    },
    changeBrand(type, index, noclear){
      if(type == 1){
        if(!noclear){
          this.intentionArchive[index].carSeriesId = '';
          this.intentionArchive[index].modelId = '';
          this.intentionArchiveOptions[index].seriesOptions = [];
          this.intentionArchiveOptions[index].modelOptions = [];
        }
        this.$fetch.common.carSeries({'brandId': this.intentionArchive[index].brandId},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.intentionArchiveOptions[index].seriesOptions = this.$hasArrContent(res)?res:[];
            }, false);
        })
      }else if(type == 2){
          this.intentionInfo[index].carSeriesId = '';
          this.intentionInfo[index].modelId = '';
          this.intentionInfoOptions[index].seriesOptions = [];
          this.intentionInfoOptions[index].modelOptions = [];
        this.$fetch.common.carSeries({'brandId': this.intentionInfo[index].brandId},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.intentionInfoOptions[index].seriesOptions = this.$hasArrContent(res)?res:[];
            }, false);
        })
      }
        
    },
    changeSeries(type, index, noclear){
      if(type == 1){
        if(!noclear){
          this.intentionArchive[index].modelId = '';
          this.intentionArchiveOptions[index].modelOptions = [];
        }
        this.$fetch.common.carModel({'seriesId': this.intentionArchive[index].carSeriesId},false).then((res)=>{
            this.intentionArchiveOptions[index].modelOptions = this.$hasArrContent(res.data.data)?res.data.data:[];
        })
      }else if(type == 2){
        this.intentionInfo[index].modelId = '';
        this.intentionInfoOptions[index].modelOptions = [];
        this.$fetch.common.carModel({'seriesId': this.intentionInfo[index].carSeriesId},false).then((res)=>{
            this.intentionInfoOptions[index].modelOptions = this.$hasArrContent(res.data.data)?res.data.data:[];
        })
      }
        
    },
    changeModel(flag = false, index, edit){
        this.$forceUpdate();
        if(flag && edit == 'edit'){
          //提交新增的门店车型
          this.addIntentionInfo(this.intentionArchive, index);
        }else{
          //提交新增的门店车型
          this.addIntentionInfo(this.intentionInfo, index);
        }
       
    }
  }
};
</script>
<style lang="scss" scoped>
.red {
  color: #ea5a54;
}
.customer-files-page{
  height: 100%;
}
.customer-files-content-edit{
  background-color: #f7faff;
}
.customer-files-content {
  padding: 8px 15px 8px 8px;
  overflow: auto;
  height: calc(100% - 36px);
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
  .store-and-car.store-and-car-oth{
    border-top: 1px solid #eaebf0;
    position: relative;
    padding-top: 10px;
    .close-icon{
      position: absolute;
      right: -4px;
      top: -1px;
    }
  }
  .car-ques-icon{
    position: absolute;
    color: #ea5a54;
    right: -15px;
    top: 6px;
    font-size: 14px;
  }
  .store-and-car-btn{
    border-top: 1px solid #eaebf0;
    padding-top: 10px;
  }
  .rowmbottom10{
    display: flex;
  }
  .width-75 {
    width: 75px;
  }
  .width-right-cont{
    flex: 1;
  }
  .width-sex {
    width: auto;
    margin-left: 15px;
  }
  .width-sex >>> .el-radio-button__inner {
    // padding: 10px 15px;
  }
  .grid-content-left {
    text-align: right;
    // margin-right: 6px;
    line-height: 32px;
    font-size: 13px;
    color: #454545;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .grid-content-right{
    line-height: 32px;
    font-size: 14px;
  }
  .wechat-add{
    font-size: 14px;
    color: #67c23a;
  }
}
.customer-files-page .lt-title{
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #212427;
  border-bottom: 1px solid #eaebf0;
  padding-left: 10px;
  .customer-files-btn{
    cursor: pointer;
    font-size: 14px;
    color: #3d7eff;
    padding-right: 15px;
  }
}
</style>

