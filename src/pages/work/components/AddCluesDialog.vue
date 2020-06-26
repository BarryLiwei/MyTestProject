<template>
    <div class="add-clues-dialog">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            custom-class="dialog-width"
            :before-close="handleClose"
        >
            <div slot="title">
                <div class="title">{{dialogTitle}}</div>
                <div class="right-call-out" v-if="callConfig.tel && loginType != 'manage'">
                    <CallOutTempRL :tel="callConfig.tel" :dccGroupId="callConfig.dccGroupId" :use="'addCluesDialog'"></CallOutTempRL>
                </div>
            </div>
            <div class="dialog-center">
                <el-row :gutter="22">
                    <el-col :span="24" style="padding-left: 0;padding-right: 0;" class="m-b-10" v-if="this.callConfig.userType == 3">
                        <el-col :span="12">
                            <el-row class="rowmbottom10">
                                <el-col :span="7">
                                    <div class="grid-content-left">线索类型
                                        <span class="mini-width5"></span></div>
                                </el-col>
                                <el-col :span="17">
                                    <div class="grid-content">
                                        <el-radio-group
                                            class="radio-button-level"
                                            :gutter="24"
                                            style="width:100%;"
                                            v-model="filters.clueType"
                                            size="small"
                                            @change="clueTypeChange"
                                        >
                                            <el-radio-button
                                                :label="item.value"
                                                v-for="item in clueTypeOptions"
                                                :key="item.value"
                                            >{{item.label}}</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-col>
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
                                <div class="grid-content-left">
                                    线索姓名
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-input
                                        v-model="filters.nickname"
                                        placeholder="请输入"
                                        maxlength="20"
                                    ></el-input>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" class="m-b-10">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">
                                    性别
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-radio-group
                                        class="radio-button-level"
                                        :gutter="24"
                                        style="width:100%;"
                                        v-model="filters.gender"
                                        size="small"
                                    >
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
                                <div class="grid-content-left">
                                    手机号
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-input
                                        v-model="filters.tel"
                                        placeholder="请输入"
                                        type="text"
                                        maxlength="11"
                                    ></el-input>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" class="m-b-10">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">微信号
                                    <span class="mini-width5"></span></div>
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
                    <el-col
                        :span="24"
                        class="m-b-10"
                        style="padding-left: 0;padding-right: 0;"
                        v-for="(item, index) in storeAndCar"
                        :key="index"
                    >
                        <el-col :span="12">
                            <el-row class="rowmbottom10">
                                <el-col :span="7">
                                    <div class="grid-content-left">
                                        归属门店
                                        <span class="red">*</span>
                                    </div>
                                </el-col>
                                <el-col :span="17">
                                    <div class="grid-content">
                                        <el-select v-if="filters.clueType == 1"
                                            style="width:100%;"
                                            v-model="filters.areaId"
                                            filterable
                                            placeholder="请选择"
                                            @change="areaIdChange"
                                            size="small"
                                        >
                                            <el-option
                                                v-for="item in areaListOptions"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            ></el-option>
                                        </el-select>
                                        <el-select v-if="filters.clueType == 3" style="width:100%;" v-model="filters.areaId" filterable placeholder="请选择"
                                            @change="areaIdChange" size="small">
                                            <el-option v-for="item in areaListOptions2" :key="item.id" :label="item.short_name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <el-row class="rowmbottom10">
                                <el-col :span="7">
                                    <div class="grid-content-left">
                                        意向车型
                                        <span class="red">*</span>
                                    </div>
                                </el-col>
                                <el-col :span="17">
                                    <div class="grid-content">
                                        <el-col :span="8">
                                            <el-select
                                                v-model="filters.brandId"
                                                placeholder="请选择"
                                                filterable
                                                @change="changeBrand"
                                                :class="filters.brandId==''?'c-placeholder':''"
                                                size="small"
                                            >
                                                <el-option
                                                    v-for="item in brandOptions"
                                                    :key="item.id"
                                                    :label="item.title"
                                                    :value="item.id"
                                                ></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-select
                                                v-model="filters.carSeriesId"
                                                placeholder="请选择"
                                                filterable
                                                @change="changeSeries"
                                                :class="filters.carSeriesId==''?'c-placeholder':''"
                                                size="small"
                                            >
                                                <el-option
                                                    v-for="item in seriesOptions"
                                                    :key="item.id"
                                                    :label="item.title"
                                                    :value="item.id"
                                                ></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-select
                                                v-model="filters.modelId"
                                                placeholder="请选择"
                                                filterable
                                                @change="changeModel"
                                                :class="filters.modelId==''?'c-placeholder':''"
                                                size="small"
                                            >
                                                <el-option
                                                    v-for="item in modelOptions"
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
                    <el-col :span="12" class="m-b-10">
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
                                            v-model="filters.fromTopId"
                                            placeholder="一级来源"
                                            filterable
                                            @change="sourceChange"
                                            :class="filters.fromTopId==''?'c-placeholder':''"
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
                                            v-model="filters.fromSecondId"
                                            placeholder="二级来源"
                                            filterable
                                            :class="filters.fromSecondId==''?'c-placeholder':''"
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
                                <div class="grid-content-left">购车指标
                                    <span class="mini-width5"></span></div>
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
                    <el-col :span="24" class="m-b-10">
                        <el-row class="rowmbottom10">
                            <el-col :span="3">
                                <div class="grid-content-left content-left-remark">
                                    线索备注
                                    <span class="mini-width5"></span>
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
                    <!-- <el-col :span="24" class="m-b-10">
                        <el-row class="rowmbottom10">
                            <el-col :span="3">
                                <div class="grid-content-left" style="width: 88.5px;height: 1px;"></div>
                            </el-col>
                            <el-col :span="21">
                                <div class="grid-content">
                                    <el-checkbox
                                        style="width:98%; float:right;"
                                        v-model="filters.checked"
                                    >标记为非意向</el-checkbox>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>-->
                    <el-col :span="12" class="m-b-10" v-if="filters.clueType == 1">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">
                                    无效线索
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-radio-group
                                        class="radio-button-level"
                                        :gutter="24"
                                        style="width:100%;"
                                        v-model="ClueInvalidForm.isInvalid"
                                        size="small"
                                    >
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
                    <el-col :span="12" class="m-b-10" v-if="ClueInvalidForm.isInvalid == '1'">
                        <el-row class="rowmbottom10">
                            <el-col :span="7">
                                <div class="grid-content-left">
                                    无效原因
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="17">
                                <div class="grid-content">
                                    <el-select
                                        :gutter="24"
                                        style="width:100%;"
                                        v-model="ClueInvalidForm.reasonInvalidId"
                                        filterable
                                        placeholder="请选择"
                                        size="small"
                                    >
                                        <el-option
                                            v-for="item in reasonInvalidOptions"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="24" class="m-b-10" v-if="ClueInvalidForm.isInvalid == '1'">
                        <el-row class="rowmbottom10">
                            <el-col :span="3">
                                <div class="grid-content-left" style="width: 88.5px;">
                                    无效说明
                                    <span class="red">*</span>
                                </div>
                            </el-col>
                            <el-col :span="21">
                                <div class="grid-content">
                                    <el-input
                                        style="width:98%; float:right;" 
                                        v-model="ClueInvalidForm.remark"
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
                </el-row>
                <!-- <li class="li-item pointer">
                <i class="el-icon-folder-add" @click="initSDK()">初始化</i>
                </li>-->
                <li class="li-item pointer">
                    <div id="clues-phone-slot"></div>
                    <div id="contact-sdk"></div>
                </li>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="" class="w-90 plain-btn-style" @click="handleClose" round>取消</el-button>
                <el-button size="small" type="primary" class="w-90"  @click="save" round :disabled="loading">完成</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as Http from '@/apis/work'
import { mapState } from 'vuex'
import SearchMixins from '@/pages/mixins/SearchMixins'
import CallOutTempRL from "./CallOutTempRL";
export default {
  props: {
    dccConfig:{
      type: Object,
      default: ()=>{return {}}
    },
    callConfig:{
      type: Object,
      default: ()=>{return {}}
    }
  },
  mixins: [SearchMixins],
  components: {
    CallOutTempRL,
  },
  data() {
    return {
      dialogTitle: '新增线索',
      loading:false,
      dialogVisible: true,
      clueTypeOptions: [
        {
          value: 1,
          label: "新增线索"
        },
        {
          value: 3,
          label: "转移线索"
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
          value: 2,
          label: "无"
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
      reasonInvalidOptions:[],
      filters: {
        clueType: 1,   //默认新增线索
        isCallIn: 0,    //是否呼入线索 1是 0否
        dccGroupId: '',
        dccId: '',
        nickname: "",
        gender: "",
        tel: "",
        wechatNumber: "",
        wechatAdded: 0,    //是否已添加微信号[默认否],0否,1是
        areaId: "", //归属门店id
        buyQuota: 0,  //购车指标 默认未知.0未知,1是,2否
        address: "",
        remark: "",
        checked: true,
        provinceId: "",
        cityId: "",
        regionId: "",
        fromTopId: "",  //一级来源id
        fromSecondId: "",    //一级来源id
      }, // 表单字段
      ClueInvalidForm:{
        isInvalid: 0, //无效线索默认“否”,0否,1是
        reasonInvalidId: "",
        remark: ""
      },
      address: "", //购车城市
      shiAddress: "",
      sheng: "",
      quAddress: "",
      clueFromOptions: '', //线索来源
      areaListOptions: '',  //归属门店可选门店列表
      areaListOptions2: '',  //线索转移-归属门店可选门店列表
      source_second: [], //二级来源
      storeAndCar: [
        {
          areaId: "",
          car: ""
        }
      ],
      brandOptions: [],
      seriesOptions: [],
      modelOptions: [],
      dccOptions: [],
      phoneJson: {}
    };
  },
  computed: {
    ...mapState(["loginType"]),
  },
  mounted() {
  },
  created() {
    if(this.callConfig.userType == 1){  //1潜客，2线索，3未知
        this.dialogTitle = "转移线索";
        this.filters.clueType = 3;
        this.filters.nickname = this.callConfig.nickname;
    }else if(this.callConfig.userType == 2){
        this.dialogTitle = "转移线索";
        this.filters.clueType = 3;
        this.filters.nickname = this.callConfig.nickname;
    }else if(this.callConfig.userType == 3){
        this.dialogTitle = "新增/转移线索";
        this.filters.callThirdId = this.callConfig.callThirdId;
    }
    if(this.callConfig && this.callConfig.userType){
        this.getCommonAreaList2();
        this.filters.tel = this.callConfig.tel;
    }
    this.getCommonAreaList();
    this.filters.isCallIn = this.callConfig.isCallIn;
    this.getCommonFromList();
    this.getClueInvalidReasonList();
    this.getCitys(); //购车城市

    // 通话信息
    window.eventBus.$on('objectDeclareFuncRLBus', data => {
        console.log('通话信息', data.phoneJson);
        this.phoneJson = data.phoneJson
    })
  },
  methods: {
    //百应电话外拨
    initSDK() {
      const slot = document.getElementById("clues-phone-slot");
      console.log(slot);
      if (slot) {
        new window.AiccSdk.default({
          companyId: "34590",
          mobile: "13168766000",
          client_id: "9vVgN0xsBFpSuz8W",
          client_secret: "c2lhuHLS0Z6beCFC07lPniiDEGSR1A",
          phoneRenderSlot: slot
        });
      }
    },
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
      this.$emit("cluesCloseFn");
    },
    save() {
      console.log(this.filters);
      if (this.dccConfig.show && !this.filters.dccGroupId) {
        this.$message.error("请填写处理坐席组");
        return;
      }
      if (this.dccConfig.show && !this.filters.dccId) {
        this.$message.error("请填写处理DCC");
        return;
      }

      if (!this.filters.nickname) {
        this.$message.error("请填写线索姓名");
        return;
      }
      if (!this.filters.gender) {
        this.$message.error("请填写性别");
        return;
      }
      if (!this.filters.tel) {
        this.$message.error("请填写线索号码");
        return;
      }
      if (this.filters.tel && !/^1[0-9]{10}$/.test(this.filters.tel)) {
        this.$message.error("线索号码格式错误！");
        return;
      }
      if (!this.filters.areaId) {
        this.$message.error("请选择归属门店");
        return;
      }
      if (this.filters.areaId && !this.filters.modelId) {
        this.$message.error("请选择意向车型");
        return;
      }
      if (!this.filters.fromTopId) {
        this.$message.error("请选择客户来源");
        return;
      }
      if (this.ClueInvalidForm.isInvalid == "1" && !this.ClueInvalidForm.reasonInvalidId) {
        this.$message.error("请选择无效原因");
        return;
      }
      if (this.ClueInvalidForm.isInvalid == "1" && !this.ClueInvalidForm.remark) {
        this.$message.error("请填写无效说明");
        return;
      }
    
      let saveParams = {};
      saveParams['ClueArchiveForm'] = Object.assign({}, this.filters)
      saveParams['ClueArchiveForm'].wechatAdded = this.filters.wechatAdded == true ? 1 : 0;
      if(this.ClueInvalidForm.isInvalid == "1"){
        saveParams['ClueInvalidForm'] = this.ClueInvalidForm;
      }else{
        saveParams['ClueInvalidForm'] = {
            isInvalid: 0
        };
      }

      let sdkType = window.localStorage.getItem('c_callSDKTools');
      // byaicc 百应， alicc 阿里， RL 容联， cticloud 天润
      switch (sdkType) {
        case 'RL':
          saveParams.callThirdType = 1;
          break;
        case 'byaicc':
          saveParams.callThirdType = 2;
          break;
        case 'cticloud':
          saveParams.callThirdType = 3;
          break;
      
        default:
          break;
      }

      // 通话供应商平台通话id
      if (this.phoneJson.CallsheetId) {
          saveParams.callThirdId = this.phoneJson.CallsheetId
      } else {
          saveParams.callThirdId = this.filters.callThirdId;
      }

      console.log('提交给后台的数据', saveParams)
      this.loading = true;
        Http.addClue(saveParams)
        .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              // 数据处理
              this.$emit("cluesSuccessFn");
            },true);
        })
        .catch(err => {
            this.loading = false;
            this.$store.commit("closeLoading");
        });
    },
    clueTypeChange(){
        this.filters.areaId = '';
        this.filters.brandId = '';
        this.filters.carSeriesId = '';
        this.filters.modelId = '';
        this.brandOptions = [];
        this.seriesOptions = [];
        this.modelOptions = [];
        if(this.filters.clueType == 3){
            this.ClueInvalidForm.isInvalid = 0;
        }
    },
    getCommonAreaList(){
      this.$fetch.common.commonAreaList({})
        .then(res => {
          this.$handleResponse(res, res => {
            this.areaListOptions = res;
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    getCommonAreaList2() {  //转移线索时门店选择列表
      this.$fetch.setting
        .queryAreasList({
        pagination: 0, //不需要分页
        })
        .then(res => {
        this.$handleResponse(res, res => {
            this.areaListOptions2 = res.list;
        },true);
        })
        .catch(err => {
        this.$store.commit("closeLoading");
        });
    },
    getCommonFromList(){
      this.$fetch.common.commonFromList({})
        .then(res => {
          this.$handleResponse(res, res => {
            this.clueFromOptions = res;
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    getClueInvalidReasonList(){
      this.$fetch.common.clueInvalidReasonList({})
        .then(res => {
          this.$handleResponse(res, res => {
            this.reasonInvalidOptions = res;
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
    sourceChange() {
      this.filters.fromSecondId = "";
      for (let i of this.clueFromOptions) {
        if (i.id == this.filters.fromTopId) {
          this.source_second = i.children || [];
        }
      }
    },
    areaIdChange(){
        this.filters.brandId = '';
        this.filters.carSeriesId = '';
        this.filters.modelId = '';
        this.brandOptions = [];
        this.seriesOptions = [];
        this.modelOptions = [];
        this.getBrandList();
    },
    dccGroupChange(val){
        let dccList = this.dccConfig.groupObj[val]['dccList'];
        this.filters.dccId = '';
        this.dccOptions = this.$hasArrContent(dccList)?dccList:[];
    },
    getBrandList(){
        this.$fetch.common.carBrand({'areaId': this.filters.areaId},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.brandOptions = this.$hasArrContent(res)?res:[];
            }, false);
            
        })
    },
    changeBrand(val){
        this.filters.carSeriesId = '';
        this.filters.modelId = '';
        this.seriesOptions = [];
        this.modelOptions = [];
        this.$fetch.common.carSeries({'brandId': val},false).then((res)=>{
            this.$handleResponse(res, res=>{
                this.seriesOptions = this.$hasArrContent(res)?res:[];
            }, false);
        })
    },
    changeSeries(val){
        this.filters.modelId = '';
        this.modelOptions = [];
        this.$fetch.common.carModel({'seriesId': val},false).then((res)=>{
            this.modelOptions = this.$hasArrContent(res.data.data)?res.data.data:[];
        })
    },
    changeModel(val){
        this.$forceUpdate();
    }
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
.add-clues-dialog .el-dialog__header {
    position: relative;
    .title {
        font-size: 18px;
        color: #444;

        span {
            padding-left: 5px;
            color: #b2b2b2;
        }
    }

    .right-call-out{
        position: absolute;
        right: 60px;
        top: 12px;
    }
}
.add-clues-dialog >>> .el-input__inner, .col-line-height{
    height: 32px;
    line-height: 32px;
}
.add-clues-dialog .grid-content-wechat{
    line-height: 32px;
}
.add-clues-dialog >>> .dialog-width{
    width: 718px;
}
.add-clues-dialog .content-left-remark{
   width: 88.5px;
}

.grid-content >>> .el-textarea .el-input__count {
    bottom: 4px;
    right: 8px;
}


@media screen and (max-width: 1485px) {
    .add-clues-dialog >>> .el-input__inner, .col-line-height{
        height: 28px;
        line-height: 28px;
    }
    .add-clues-dialog .m-b-10{
        margin-bottom: 8px;
    }
    .add-clues-dialog .grid-content-left {
        margin-right: 6px;
        line-height: 28px;
    }
    .add-clues-dialog >>> .el-radio-button__inner{
        padding: 7px 15px;
        font-size: 12px;
    }
    .add-clues-dialog .grid-content-wechat{
        line-height: 28px;
    }
    .add-clues-dialog >>> .dialog-width{
        width: 650px;
    }
    .add-clues-dialog .content-left-remark{
        width: 77.5px;
    }
    .add-clues-dialog >>> .el-input--small .el-input__icon{
        line-height: 28px;
    }
}

.add-clues-dialog /deep/.el-dialog__body {
    padding: 25px 30px 15px 20px;
}

.add-clues-dialog /deep/.el-dialog__footer {
    padding: 10px 0 35px;
}
</style>