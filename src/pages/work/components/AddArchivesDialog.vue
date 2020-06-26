<template>
  <div class="add-archives-dialog">
    <el-dialog
        title="新增档案"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        custom-class="dialog-width"
        :before-close="handleClose"
    >
        <div class="dialog-center">
            <el-row :gutter="22">
                <el-col :span="12" class="m-b-10" v-if="dccConfig.show">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">
                                处理坐席组
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-select
                                    style="width:100%;"
                                    v-model="filters.dccGroupId"
                                    filterable
                                    placeholder="请选择"
                                    @change="dccGroupChange"
                                    size="small"
                                >
                                    <el-option
                                        v-for="item in dccConfig.groupOptions"
                                        :key="item.id"
                                        :label="item.dccGroupName"
                                        :value="item.id"
                                    ></el-option>
                                </el-select>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10" v-if="dccConfig.show">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">
                                处理DCC
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-select
                                    style="width:100%;"
                                    v-model="filters.dccId"
                                    filterable
                                    placeholder="请选择"
                                    size="small"
                                >
                                    <el-option
                                        v-for="item in dccOptions"
                                        :key="item.id"
                                        :label="item.dccName"
                                        :value="item.id"
                                    ></el-option>
                                </el-select>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">客户名称
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-input v-model="filters.nickname" placeholder="请输入" maxlength="20"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">性别
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-radio-group class="radio-button-level" :gutter="24" style="width:100%;" v-model="gender" size="small">
                                    <el-radio-button
                                        :label="item.value"
                                        v-for="item in genderOptions"
                                        :key="item.value"
                                    >{{item.label}}</el-radio-button>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">客户电话
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-input v-model="filters.tel" placeholder="请输入" type="text" maxlength="11"></el-input>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">微信号
                                <span class="mini-width5"></span>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="grid-content">
                                <el-input v-model="filters.wechatNumber" placeholder="请输入"></el-input>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div class="grid-content">
                                <el-checkbox
                                    class="grid-content-wechat"
                                    style="float:right;"
                                    v-model="filters.wechatAdded"
                                >已加微信</el-checkbox>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="24" class="m-b-10" style="padding-left: 0;padding-right: 0;" v-for="(items, index) in intentionInfo" :key="index">
                    <el-col :span="12">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">归属门店
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-select style="width:100%;" v-model="intentionInfo[index].areaId" filterable placeholder="请选择" @change="areaIdChange()" size="small">
                                        <el-option
                                            v-for="item in areaListOptions"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">意向车型
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-col :span="8">
                                        <el-select
                                            v-model="intentionInfo[index].brandId"
                                            placeholder="请选择"
                                            filterable
                                            @change="changeBrand"
                                            :class="intentionInfo[index].brandId==''?'c-placeholder':''"
                                            size="small"
                                        >
                                            <el-option
                                                v-for="item in intentionInfoOptions[index].brandOptions"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-select
                                            v-model="intentionInfo[index].carSeriesId"
                                            placeholder="请选择"
                                            filterable
                                            @change="changeSeries"
                                            :class="intentionInfo[index].carSeriesId==''?'c-placeholder':''"
                                            size="small"
                                        >
                                            <el-option
                                                v-for="item in intentionInfoOptions[index].seriesOptions"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-select
                                            v-model="intentionInfo[index].modelId"
                                            placeholder="请选择"
                                            filterable
                                            @change="changeModel"
                                            :class="intentionInfo[index].modelId==''?'c-placeholder':''"
                                            size="small"
                                        >
                                            <el-option
                                                v-for="item in intentionInfoOptions[index].modelOptions"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                    </el-col>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-col>
                <el-col :span="12" class="m-b-10" v-for="(items, index) in intentionInfo" :key="'source-'+index">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">
                                客户来源
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-col :span="12">
                                    <el-select
                                        v-model="items.fromTopId"
                                        placeholder="一级来源"
                                        filterable
                                        @change="sourceChange(index)"
                                        size="small"
                                    >
                                        <el-option
                                        v-for="item in clueFromOptions"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="12">
                                    <el-select
                                        v-model="items.fromSecondId"
                                        placeholder="二级来源"
                                        filterable
                                        @change="sourceSecondChange"
                                        size="small"
                                    >
                                        <el-option
                                            v-for="item in source_second"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-col>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <!-- <el-col :span="24" class="m-b-10">
                    <el-row>
                        <el-col :span="3"><div class="grid-content-left" style="width: 88.5px;height: 1px;"></div></el-col>
                        <el-col :span="21">
                            <div class="grid-content">
                                <div style="width:98%; float:right;">
                                    <el-button :gutter="24" type="primary" icon="el-icon-plus" @click="addStroeAndCar">新增门店和车型</el-button>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-col> -->

                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">
                                购车区域
                                <span class="mini-width5"></span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-col :span="8">
                                    <el-select
                                        style="width: 100%;"
                                        v-model="filters.provinceId"
                                        filterable
                                        placeholder="省"
                                        @change="changeSheng"
                                        :class="filters.provinceId==''?'c-placeholder':''"
                                        size="small"
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
                                        v-model="filters.cityId"
                                        placeholder="市"
                                        filterable
                                        @change="changeShi"
                                        :class="filters.cityId==''?'c-placeholder':''"
                                        size="small"
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
                                        v-model="filters.regionId"
                                        placeholder="区"
                                        filterable
                                        @change="changeQu"
                                        :class="filters.regionId==''?'c-placeholder':''"
                                        size="small"
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
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">购车指标<span class="mini-width5"></span></div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-radio-group
                                    class="radio-button-level"
                                    :gutter="24"
                                    style="width:100%;"
                                    v-model="filters.buyQuota"
                                    size="small"
                                >
                                    <el-radio-button
                                        :label="item.value"
                                        v-for="item in options2"
                                        :key="item.value"
                                    >{{item.label}}</el-radio-button>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                    
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">购车类型
                                <span class="mini-width5"></span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-select style="width:100%;" v-model="filters.buyType" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in buyTypeOptions"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"
                                    size="small"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">是否贷款
                                <span class="mini-width5"></span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-radio-group class="radio-button-level" :gutter="24" style="width:100%;" v-model="filters.isMortgage" size="small">
                                    <!-- <el-radio-button label="是" ></el-radio-button>
                                    <el-radio-button label="否"></el-radio-button> -->
                                    <el-radio-button
                                        :label="item.value"
                                        v-for="item in options"
                                        :key="item.value"
                                    >{{item.label}}</el-radio-button>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10 col-line-height"></el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">客户级别
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-radio-group class="radio-button-level" :gutter="24" style="width:100%;" v-model="filters.level" size="small" @change="getNextFollowDate()">
                                    <el-radio-button label="H"></el-radio-button>
                                    <el-radio-button label="A"></el-radio-button>
                                    <el-radio-button label="B"></el-radio-button>
                                    <el-radio-button label="C"></el-radio-button>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">跟进类型
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-radio-group class="radio-button-level" :gutter="24" style="width:100%;" v-model="filters.followType" size="small">
                                    <el-radio-button
                                        :label="item.value"
                                        v-for="item in followTypeOptions"
                                        :key="item.value"
                                    >{{item.label}}</el-radio-button>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">跟进结果
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-radio-group class="radio-button-level" :gutter="24" style="width:100%;" v-model="filters.followResult" size="small" @change="getNextFollowDate()">
                                    <el-radio-button
                                        :label="item.value"
                                        v-for="item in followResultOptions"
                                        :key="item.value"
                                    >{{item.label}}</el-radio-button>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10" v-if="filters.followResult == 1">
                    <el-row class="rowmbottom10">
                        <el-col :span="7">
                            <div class="grid-content-left">下次跟进
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="grid-content">
                                <el-date-picker
                                    v-model="nextFollowDate"
                                    type="date"
                                    placeholder="选择日期"
                                    style="width:100%"
                                    class="my-date-picker"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions"
                                    size="small"
                                ></el-date-picker>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" class="m-b-10 col-line-height" v-if="filters.followResult == 2"></el-col>
                <el-col :span="24" class="m-b-10" style="padding-left: 0;padding-right: 0;" v-for="(items, index) in inviteInfo" :key="'invite-'+index" v-if="filters.followResult == 2" >
                    <el-col :span="12" class="m-b-10">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">邀约门店
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-select style="width:100%;" v-model="items.areaId" filterable placeholder="请选择" size="small">
                                        <el-option
                                            v-for="item in yaoyueOptions"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" class="m-b-10">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">到店时间
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-date-picker
                                        v-model="items.date"
                                        type="datetime"
                                        placeholder="选择到店时间"
                                        style="width:100%"
                                        class="my-date-picker"
                                        value-format="yyyy-MM-dd HH:mm"
                                        format="yyyy-MM-dd HH:mm"
                                        size="small"
                                    ></el-date-picker>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">下次跟进
                                    <span class="mini-width5"></span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-date-picker
                                        v-model="nextFollowDate2"
                                        type="date"
                                        placeholder="选择日期"
                                        style="width:100%"
                                        class="my-date-picker"
                                        value-format="yyyy-MM-dd"
                                        size="small"
                                    ></el-date-picker>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-col>
                
                <el-col :span="24" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="3">
                            <div class="grid-content-left content-left-remark">客户描述
                                <span class="red">*</span>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <div class="grid-content">
                                <el-input
                                    style="width:98%; float:right;" 
                                    v-model="filters.remark"
                                    placeholder="请输入"
                                    type="textarea"
                                    maxlength="120"
                                    :autosize="{ minRows: 4}"
                                    show-word-limit
                                ></el-input>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="24" class="m-b-10">
                    <el-row class="rowmbottom10">
                        <el-col :span="3"><div class="grid-content-left" style="width: 88.5px;height: 1px;"></div></el-col>
                        <el-col :span="21">
                            <div class="grid-content">
                              <el-checkbox style="width:98%; float:right;"  v-model="filters.addClue">同时增加一条线索</el-checkbox>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" type="" class="w-90 plain-btn-style" @click="handleClose" round>取消</el-button>
            <el-button size="small"  type="primary" class="w-90" @click="save" round :disabled="loading">完成</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Http from '@/apis/work'
import moment from 'moment'
export default {
  props: {
    dccConfig:{
      type: Object,
      default: ()=>{return {}}
    }
  },
  data() {
    return {
      loading: false,  
      dialogVisible: true,
      followTypeOptions:[
        {
          value: 1,
          label: "电话跟进"
        },
        {
          value: 2,
          label: "微信跟进"
        }
      ],
      followResultOptions:[
        {
          value: 1,
          label: "继续跟进"
        },
        {
          value: 2,
          label: "下发邀约"
        }
      ],
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
      options: [
            {
            value: 1,
            label: "是"
            },
            {
            value: 0,
            label: "否"
            }
      ],
      options2: [
            {
            value: 1,
            label: "有"
            },
            {
            value: 0,
            label: "无"
            }
      ],
      yaoyueOptions: [],  //邀约门店为归属门店的合集
      filters: {
        dccGroupId: '',
        dccId: '',
        nickname: '',
        tel: '',
        wechatNumber: '',
        wechatAdded: '',
        buyType: "",
        isMortgage: "",
        provinceId: '',
        cityId: '',
        regionId: '',
        buyQuota: '',
        level: 'H',
        followType: 1,
        followResult: 1,
        remark: '',
        addClue: '',
      },  // 表单字段
      pickerOptions: {},// 最大时间
      nextFollowDate: '',
      nextFollowDate2: '',
      inviteInfo:[  //邀约计划
        {
          areaId: '',
          date: '' //到店时间
        }
      ],
      source: [
        {
          source_id: 1,
          source_title: "2323"
        }
      ], //一级来源
      clueFromOptions: '', //线索来源
      buyTypeOptions: '',   //购买类型
      areaListOptions: '',  //归属门店可选门店列表
      source_second: [], //二级来源
      intentionInfo:[  
        {
        //   clueId: '',
          areaId: '',
          brandId: '',
          carSeriesId: '',
          modelId: '',
          fromTopId: '',
          fromSecondId: ''
        }
      ],
      intentionInfoOptions: [{
        brandOptions: [],
        seriesOptions: [],
        modelOptions: []
      }],
      cars: [],
      address: "", //购车城市
      shiAddress: "",
      sheng: "",
      quAddress: "",
      gender: '',
      dccOptions:[],
      minTime:moment(new Date()).subtract(1, 'day'),
    };
  },
  created(){
      this.getFollowForm();
      this.getAreaList();
      this.getCitys(); //购车城市
      this.getNextFollowDate()
  },
  methods: {
    //百应电话外拨
    initSDK() {
      const slot = document.getElementById('clues-phone-slot');
      console.log(slot)
      if (slot) {
          new window.AiccSdk.default({
              companyId: '34590',
              mobile: '13168766000',
              client_id: '9vVgN0xsBFpSuz8W',
              client_secret: 'c2lhuHLS0Z6beCFC07lPniiDEGSR1A',
              phoneRenderSlot: slot,
          });
          
      }
      
      
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //表格 顶部按钮 新增
    add() {
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
      this.$emit("archiveCloseFn", 'cancel');
    },
    save() {
        console.log(this.filters)
        let params = {};
        Object.assign(params, this.filters)
        params.wechatAdded = params.wechatAdded == true ? 1 : 0;
        params.addClue = params.addClue == true ? 1 : 0;
        params.gender = this.gender;
        params.intentionInfo = this.intentionInfo;
        console.log(params)
        //校验字段必填
        if (this.dccConfig.show && !this.filters.dccGroupId) {
            this.$message.error("请填写处理坐席组");
            return;
        }
        if (this.dccConfig.show && !this.filters.dccId) {
            this.$message.error("请填写处理DCC");
            return;
        }
        if (!params.nickname) {
            this.$message.error("请填写客户姓名");
            return;
        }
        if (!params.gender) {
            this.$message.error("请填写性别");
            return;
        }
        if (!params.tel) {
            this.$message.error("请填写客户电话");
            return;
        }
        if (params.tel && !/^1[0-9]{10}$/.test(params.tel)) {
            this.$message.error("客户电话格式错误！");
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
                console.log('dsdsd')
                if (element.areaId && !element.modelId) {
                    this.$message.error("请选择意向车型");
                    flag = false;
                    throw Error();
                }
                if (!element.fromTopId) {
                    this.$message.error("请选择客户来源");
                    flag = false;
                    throw Error();
                }
            })
        } catch (e) {
        }
        if(!flag){  //通过throw error结束foreach循环，但是下面的代码仍然会执行，所以采用flag标志
            return;
        }

        
        if(this.filters.followResult == 1){
            params.nextFollowDate = this.nextFollowDate;
            if (!params.nextFollowDate) {
                this.$message.error("请选择下次跟进时间");
                return;
            }
        }else{
            params.inviteInfo = this.inviteInfo;
            params.nextFollowDate = this.nextFollowDate2;
            let flag2 = true;
            try {
                params.inviteInfo.forEach((element, i) =>{
                    if (!element.areaId) {
                        this.$message.error("请选择邀约门店");
                        flag2 = false;
                        throw Error();
                    }
                    console.log('dsdsd')
                    if (element.areaId && !element.date) {
                        this.$message.error("请选择到店时间");
                        flag2 = false;
                        throw Error();
                    }
                })
            } catch (e) {
            }
            if(!flag2){  //通过throw error结束foreach循环，但是下面的代码仍然会执行，所以采用flag标志
                return;
            }
        }
        if (!params.remark) {
            this.$message.error("请填写客户描述");
            return;
        }
        console.log(params)

        this.loading=true;
        Http.clueAdd2(params)
        .then(res => {
            this.loading=false;
            this.$handleResponse(res, res => {
              // 数据处理
              console.log(res)
              this.$emit("archiveCloseFn", 'success');
            },true);
        })
        .catch(err => {
            this.loading=false;
            this.$store.commit("closeLoading");
        });

    },
    addStroeAndCar(){
        this.storeAndCar.push({
              store: '',
              car: ''
          })
    },
    // 潜客跟进 - 获取页面初始数据
    getFollowForm(){
      Http.getFollowForm({})
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            this.clueFromOptions = res.clueFrom;
            this.buyTypeOptions = res.buyType;
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },

    // 门店下拉数据
    getAreaList(){
      this.$fetch.common.commonAreaList({})
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            this.areaListOptions = res;
            this.$forceUpdate();
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },

    getCitys() {
      Http.getRegin({})
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
              if (this.filters.provinceId == res.id) {
                this.sheng = res;
                this.shiAddress = res.children;
                res.children.forEach(res2 => {
                  if (this.filters.cityId == res2.id) {
                    this.shi = res2;
                    this.quAddress = res2.children;
                    res2.children.forEach(res3 => {
                      if (this.filters.regionId == res3.id) {
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
      this.filters.cityId = "";
      this.filters.regionId = "";
      this.shiAddress = [];
      this.quAddress = [];
      for (let i of this.address) {
        if (i.id == this.filters.provinceId) {
          // this.select.provinceName = i.regionName;
          this.shiAddress = i.children;
        }
      }
    },
    changeShi() {
      this.filters.regionId = "";
      this.quAddress = [];
      for (let i of this.shiAddress) {
        if (i.id == this.filters.cityId) {
          // this.select.cityName = i.regionName;
          this.quAddress = i.children;
        }
      }
    },
    changeQu(){
      // for (let i of this.quAddress) {
      //   if (i.id == this.filters.regionId) {
      //     this.select.regionName = i.regionName;
      //   }
      // }
    },
    //取当前二级来源
    sourceChange(index) {
      this.intentionInfo[index].fromSecondId = "";
      for (let i of this.clueFromOptions) {
        if (i.id == this.intentionInfo[index].fromTopId) {
          this.source_second = i.children || [];
        }
      }
    },
    sourceSecondChange(){
      this.$forceUpdate();
    },
    areaIdChange(index=0, item){
        this.intentionInfo[index].brandId = '';
        this.intentionInfo[index].carSeriesId = '';
        this.intentionInfo[index].modelId = '';
        this.intentionInfoOptions[index].brandOptions = [];
        this.intentionInfoOptions[index].seriesOptions = [];
        this.intentionInfoOptions[index].modelOptions = [];
        this.getBrandList(this.intentionInfo[index].areaId, index);
        console.log(item)
        let id = this.intentionInfo[index].areaId;
        let title  = '';
        this.areaListOptions.forEach((element)=>{
            if(element.id == id){
                title = element.title;
            }
        })
        this.yaoyueOptions = [{
            id: id,
            title: title
        }]
    },
    getBrandList(areaId, index=0){
        this.$fetch.common.carBrand({'areaId': areaId},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.intentionInfoOptions[index].brandOptions = this.$hasArrContent(res)?res:[];
            }, false);
            
        })
    },
    changeBrand(val, index=0){
        this.intentionInfo[index].carSeriesId = '';
        this.intentionInfo[index].modelId = '';
        this.intentionInfoOptions[index].seriesOptions = [];
        this.intentionInfoOptions[index].modelOptions = [];
        this.$fetch.common.carSeries({'brandId': val},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.intentionInfoOptions[index].seriesOptions = this.$hasArrContent(res)?res:[];
            }, false);
        })
    },
    changeSeries(val,index=0){
        this.intentionInfo[index].modelId = '';
        this.intentionInfoOptions[index].modelOptions = [];
        this.$fetch.common.carModel({'seriesId': val},false).then((res)=>{
            this.intentionInfoOptions[index].modelOptions = this.$hasArrContent(res.data.data)?res.data.data:[];
        })
    },
    changeModel(val){
        this.$forceUpdate();
    },
    getNextFollowDate(){
        let that = this;
        if(this.filters.followResult == 1){
            Http.nextFollowDate({'level': this.filters.level})
            .then(res => {
                this.$store.commit("closeLoading");
                this.$handleResponse(res, res => {
                    this.pickerOptions = {
                      disabledDate(time) {
                        return time < new Date(that.minTime).getTime() || time > new Date(res.date).getTime();
                      }
                    }
                    this.nextFollowDate = res.date;
                },true);
            })
            .catch(err => {
                this.$store.commit("closeLoading");
            });
        }
    },
    dccGroupChange(val){
        let dccList = this.dccConfig.groupObj[val]['dccList'];
        this.filters.dccId = '';
        this.dccOptions = this.$hasArrContent(dccList)?dccList:[];
    },
  }
};
</script>

<style lang="scss" scoped>
.mini-width5, .red{
    width: 5px;
    height: 1px;
    display: inline-block;
}
.grid-content-left {
  text-align: right;
  margin-right: 6px;
  line-height: 32px;
  font-size: 13px;
  color: #454545;
}
.red {
  color: #ea5a54;
}

.add-archives-dialog >>> .el-input__inner, .col-line-height{
    height: 32px;
    line-height: 32px;
}
.add-archives-dialog .grid-content-wechat{
    line-height: 32px;
}
.add-archives-dialog >>> .dialog-width{
    width: 718px;
}
.add-archives-dialog .content-left-remark{
   width: 88.5px;
}

.grid-content >>> .el-textarea .el-input__count {
    bottom: 4px;
    right: 8px;
}

@media screen and (max-width: 1485px) {
    .add-archives-dialog >>> .el-input__inner, .col-line-height{
        height: 28px;
        line-height: 28px;
    }
    .add-archives-dialog  .m-b-10{
        margin-bottom: 8px;
    }
    .add-archives-dialog  .grid-content-left {
        margin-right: 6px;
        line-height: 28px;
    }
    .add-archives-dialog >>> .el-radio-button__inner{
        padding: 7px 15px;
        font-size: 12px;
    }
    .add-archives-dialog  .grid-content-wechat{
        line-height: 28px;
    }
    .add-archives-dialog >>> .dialog-width{
        width: 678px;
    }
    .add-archives-dialog .content-left-remark{
        width: 81.5px;
    }
    .add-archives-dialog >>> .el-input--small .el-input__icon{
        line-height: 28px;
    }
}

.add-archives-dialog /deep/.el-dialog__body {
    padding: 25px 30px 15px 20px;
}

.add-archives-dialog /deep/.el-dialog__footer {
    padding: 10px 0 35px;
}
</style>