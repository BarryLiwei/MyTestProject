<template>
    <div class="page">
        <div class="clues-deal-page" :key="key">
          <div class="clues-deal-top">

            <!-- 头部信息，包含外呼 -->
            <div class="clues-deal-title">
              <div class="go-back">
                <img @click="goBack()" :src="require('@/assets/images/work/back.png')" alt="">
              </div>
              <div class="clues-deal-tools">
                <div class="dialog-title-left">
                    <span class="dialog-title-bt dialog-title-text">线索处理<span v-if="$route.query.total && $route.query.total > 0">({{$route.query.total}})</span></span>
                    <span class="tools-line"></span>
                    <span class="dialog-title-text">{{archiveInfo.nickName}}</span>
                    <span class="dialog-title-text">{{archiveInfo.tel}}</span>
                    <span class="tools-line"></span>
                    <div class="dialog-title-right">
                        <el-button size="mini" round plain class="plain-btn-style" @click="invalidClue()">
                          <img class="_img" :src="require('@/assets/images/work/invalid-clue.png')" alt=""> 无效线索
                        </el-button>
                        <el-button size="mini" round plain class="plain-btn-style" @click="transferClue()">
                          <img class="_img" :src="require('@/assets/images/work/transfer-clue.png')" alt=""> 线索转移
                        </el-button>
                        <el-button size="mini" round plain class="plain-btn-style" @click="contactLater()">
                          <img class="_img" :src="require('@/assets/images/work/contact-later.png')" alt=""> 稍后联系
                        </el-button>
                    </div>

                </div>
                <div class="dialog-title-right" v-if="loginType != 'manage'">
                  <!-- <el-button type="success" icon="el-icon-phone" circle @click="call()"></el-button> -->
                  <!-- <CallOutTemp></CallOutTemp> -->
                  <CallOutTempTR v-if="sdkType == 'cticloud'" :tel="archiveInfo.tel" :dccGroupId="archiveInfo.dccGroupId"></CallOutTempTR>
                  <CallOutTempRL v-if="sdkType == 'RL'" :tel="archiveInfo.tel" :dccGroupId="archiveInfo.dccGroupId"></CallOutTempRL>
                </div>
              </div>
            </div>
            <!-- 主体内容 -->
            <div class="call-dialog-center">
                <el-row :gutter="22" style="height: 100%">
                    <el-col :span="6" class="padding0 flex-box-col flex-box-col-1">
                        <!-- <div class="c-iheader">
                            <div class="cont">
                                <div>
                                    <span class="name">李先生</span>
                                    <span class="phone">13888887777</span>
                                </div>
                                <div>广汽传祺 GS4 270T手动 舒适版</div>
                            </div>
                        </div> -->
                        <div class="flex-box-col-1-bottom">
                          <div class="dialog-center-temp open-task" v-if="openTask && openTask.length > 0">
                              <div class="lt-title">开口任务</div>
                              <div class="lt-content">
                                  <OpenTask v-if="openTask" :data="openTask" ref="openTaskRef"></OpenTask>
                              </div>
                          </div>
                          
                          <div class="dialog-center-temp clue-store">
                            <div class="lt-title">线索归属门店</div>
                            <div class="lt-content">
                                <ClueStore :key="ctime" :data="catchIntentionInfo" @setExtendDataIdx="setExtendDataIdx"></ClueStore>
                            </div>
                          </div>
                        </div>
                        <div class="dialog-center-temp clue-em">
                            <div class="lt-title">线索增强</div>
                            <div class="lt-content">
                                <ClueEm v-if="catchExtendData" :data="catchExtendData" :extendDataIdx="extendDataIdx"></ClueEm>
                            </div>
                        </div>
                        
                        
                    </el-col>
                    <el-col :span="6" class="padding0 flex-box-col flex-box-col-2">
                        <div class="dialog-center-temp customer-files">
                            <div class="lt-content">
                              <!-- 客户档案 -->
                              <!-- <CustomerFiles :key="time" v-if="archiveInfo" ref="archiveRef" :data="archiveInfo" :type="followType" @addIntentionInfoFn="addIntentionInfoFn" :followFormData="followFormData" :areaList="areaList"></CustomerFiles> -->
                              <div class="customer-files-page">
                                <div class="lt-title">客户档案
                                  <!-- <div v-if="type == 'customerFollow'">
                                    <div v-if="!editable">
                                      <span class="customer-files-btn edit-btn" @click="edit()">编辑</span>
                                    </div>
                                    <div v-else>
                                      <span class="customer-files-btn save-btn" @click="saveCustomer()">保存</span>
                                      <span class="customer-files-btn cancle-btn" @click="cancel()">取消</span>
                                    </div>
                                  </div> -->
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
                                            <span style="flex: 1;">{{customersView.nickName}}</span>
                                            <span>{{customersView.gender}}</span>
                                          </div>
                                          <div class="grid-content" style="display: flex;" v-else>
                                            <el-input style="flex: 1;" v-model="customers.nickname" placeholder="请输入" size="mini" maxlength="20"></el-input>
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
                                          <div class="grid-content-left">
                                            微信号
                                            <span class="mini-width5"></span>
                                          </div>
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
                                      <div class="close-icon" @click="clearCar(index)" v-if="index > 0 && index > archiveInfo.intentionInfo.length - 1">
                                        <img class="" :src="require('@/assets/images/work/close-black.png')">
                                      </div>
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
                                                :disabled="index < archiveInfo.intentionInfo.length"
                                                style="width:100%;"
                                                v-model="items.areaId"
                                                filterable
                                                placeholder="请选择"
                                                @change="areaIdChange(1, index)"
                                                size="mini"
                                            >
                                                <el-option
                                                    v-for="item in areaList"
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
                                          <div class="grid-content-left">客户来源{{index+1}}<span class="red">*</span></div>
                                        </el-col>
                                        <el-col class="width-right-cont">
                                          <div class="grid-content grid-content-right" v-if="!editable">
                                            <span>{{data.intentionInfo[index].fromTopText}} - {{data.intentionInfo[index].fromSecondText}}</span>
                                          </div>
                                          <div class="grid-content" v-else>
                                            <el-select
                                                :disabled="index < archiveInfo.intentionInfo.length"
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
                                                :disabled="index < archiveInfo.intentionInfo.length"
                                                style="width:100%;margin-top: 10px;"
                                                v-model="items.fromSecondId"
                                                placeholder="二级来源"
                                                filterable
                                                @change="sourceSecondChange(index)"
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
                                                <el-select
                                                    style="width:100%;"
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
                                                <el-select
                                                    style="width:100%;margin-top: 10px;"
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
                                                <el-select
                                                    style="width:100%;margin-top: 10px;"
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
                                            </div>
                                        </el-col>
                                    </el-row>
                                    </el-col>
                                    <el-col :span="24" class="m-b-10">
                                      <el-row class="rowmbottom10">
                                        <el-col class="width-75">
                                          <div class="grid-content-left">
                                            购车指标
                                            <span class="mini-width5"></span>
                                          </div>
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
                                          <div class="grid-content-left">
                                            购车类型
                                            <span class="mini-width5"></span>
                                          </div>
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
                                          <div class="grid-content-left">
                                            是否贷款
                                            <span class="mini-width5"></span>
                                          </div>
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
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" class="padding0 flex-box-col flex-box-col-3">
                      <div class="dialog-center-temp add-follow">
                            <div class="lt-title">添加跟进</div>
                            <div class="lt-content">
                                <AddFollow :key="addFollowKey" :type="followType" ref="followRef" :followFormData="followFormData" :intentionInfo="catchIntentionInfo"></AddFollow>
                            </div>
                        </div>
                        <div class="dialog-center-temp follow-record">
                            <!-- <div class="lt-title">跟进记录</div> -->
                            <div class="lt-content scroll-area">
                                <FollowRecord :key="time" :type="followType" :followFormData="followFormData"></FollowRecord>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" class="padding0 knowledge-base flex-box-col flex-box-col-4">
                        <div class="dialog-center-temp knowledge-base">
                            <div class="lt-title">知识库</div>
                            <div class="lt-content">
                                <KnowledgeBase :key="ctime" v-if="competeModels" :competeModels="competeModels" :archiveModels="catchIntentionInfo" :followType="followType" :extendDataIdx="extendDataIdx"></KnowledgeBase>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
          </div>
            <!-- 底部按钮组 -->
            <div class="clues-deal-footer">
                <el-button v-if="$route.query.total && $route.query.total > 1" size="medium" type="" class="w-90 plain-btn-style" @click="handlePrev()" round>上一条</el-button>
                <!-- <el-button size="medium" type="primary" class="w-90" @click="save" round>保存</el-button> -->
                <el-button v-if="$route.query.total && $route.query.total > 1" size="medium" type="primary" class="" @click="save('next')" round>保存并进入下一条</el-button>
                <el-button v-else size="medium" type="primary" class="w-90" @click="save()" round>保存</el-button>
                <el-button v-if="$route.query.total && $route.query.total > 1" size="medium" type="" class="w-90 plain-btn-style" @click="handleNext()" round>下一条</el-button>
            </div>
        </div>

        <!-- 线索无效弹窗 -->
        <InvalidClueDialog v-if="dialogVisibleInvalidClue" @invalidClueCloseFn="invalidClueCloseFn"></InvalidClueDialog>
        <!-- 线索转移弹窗 -->
        <TransferClueDialog v-if="dialogVisibleTransferClue" @transferClueCloseFn="transferClueCloseFn" :type="followType"></TransferClueDialog>
        <!-- 稍后联系弹窗 -->
        <ContactLaterDialog v-if="dialogVisibleContactLater" @contactLaterCloseFn="contactLaterCloseFn"></ContactLaterDialog>
        
    </div>
</template>


<script>
import * as Http from '@/apis/work'
import CallOutTemp from "./components/CallOutTemp";
import CallOutTempTR from "./components/CallOutTempTR";
import CallOutTempRL from "./components/CallOutTempRL";


import InvalidClueDialog from "./components/InvalidClueDialog";
import TransferClueDialog from "./components/TransferClueDialog";
import ContactLaterDialog from "./components/ContactLaterDialog";

import OpenTask from "./components/OpenTask";
import ClueStore from "./components/ClueStore";
import ClueEm from "./components/ClueEm";
import CustomerFiles from "./components/CustomerFiles";
import AddFollow from "./components/AddFollow";
import FollowRecord from "./components/FollowRecord";
import KnowledgeBase from "./components/KnowledgeBase";
import { addArrToOptions } from '@/utils/util' 
import { mapState } from 'vuex'

export default {
  components: {CallOutTemp,CallOutTempTR,CallOutTempRL, InvalidClueDialog,TransferClueDialog, ContactLaterDialog,OpenTask,ClueStore,CustomerFiles,AddFollow,FollowRecord,ClueEm,KnowledgeBase},
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
      
      
      
      followFilters: {}, // 添加跟进信息
      
      tabs: [
        { title: "车型对比", name: "0" },
        { title: "门店活动", name: "1" },
        { title: "销售活动", name: "2" },
        { title: "攻防话术", name: "3" }
      ],
      currentTab: "0",
      input: "",

      alicc_code: 6,
      callTime: "00:00:00",
      lastCallTime: "00:00:00",
      hour: 0,
      minute: 0,
      second: 0, //时 分 秒
      millisecond: 0, //毫秒
      int: "",
      toggleMuteInCallStatus: true,   //标志是否静音

      dialogVisibleInvalidClue: false,   //无效线索
      dialogVisibleTransferClue: false,
      dialogVisibleContactLater: false,

      openTask: '', // 线索详情 - 开口任务
      clueInfo: '', // 线索信息
      intentionInfo: '',// 线索归属门店
      extendData: '', //线索增强信息
      extendDataIdx: 0,
      competeModels: '', // 竞争车型（知识库）
      archiveInfo: '', //档案信息
      followType: 'cluesDeal',
      sdkType: '', // byaicc 百应，   alicc 阿里，   RL 容联，   cticloud 天润

      time: '',
      followFormData: {}, //下拉框数据
      areaList: [], //门店下拉数据
      followPage: {}, //下一条/上一条的id值
      key: '',
      isSaveFlag: false,  //为true代表保存成功过，保存按钮、线索转移、线索无效、稍后联系按钮置灰，上一条下一条不再提示弹窗

      // 客户档案
      ctime: '',
      editable: true,
      customers: {},
      intentionArchive: [],
      address: "", //购车城市
      shiAddress: "",
      sheng: "",
      quAddress: "",
      gender: '',
      intentionArchive: [], //潜客意向信息
      intentionArchiveOptions: [],  //潜客意向信息下拉数据
      areaListOptions: [],
      clueFromOptions: [],
      buyTypeOptions: [],
      areaListOptions: [],
      source_second: '',
      catchIntentionInfo: [],
      catchExtendData: [],
      areaIdHasSelect: [], //存储已选择的门店id
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
      addFollowKey: '',
      phoneJson: {}
    };
  },
  computed: {
    ...mapState(["loginType"]),
  },
  mounted() {
    console.log(document.getElementById("app"));
    var app = document.getElementById("app");
    
    window.onbeforeunload = function (e) {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示';
      }
    
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示';
    
      
    };
  },
  created() {
    this.sdkType = window.localStorage.getItem('c_callSDKTools');
    this.getFollowForm();
    this.getAreaList();
    if(this.$route.query.id){
      this.getFollowClue('init');
    }else{
      this.archiveInfo = {
        tel : this.$route.query.tel,
        intentionInfo: []
      } 
      this.customers = this.archiveInfo;
    }
    
    // 通话信息
    window.eventBus.$on('objectDeclareFuncRLBus', data => {
      console.log('通话信息', data.phoneJson);
      this.phoneJson = data.phoneJson
    })

    eventBus.$off("getCode"); // 关闭上一次的监听
    eventBus.$on("getCode", _code => {
      console.log(`获取code值：${_code}`);
      this.alicc_code = _code;
      console.log("获取_code值", this.alicc_code);
      if (_code == 8) {
        console.log("拨号中、、、");
      } else if (_code == 10) {
        //呼出通话
        console.log("已接通");
        this.int = setInterval(this.timer, 1000);
      } else if (_code == 5) {
        //通话结束后的话后处理  =》  话后处理时间之后是 3空闲
        console.log("结束通话时间", this.callTime);
        this.lastCallTime = this.callTime; //结束后计算通话时长
        window.clearInterval(this.int);
        this.millisecond = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.callTime = "00时00分00秒";
        // console.log('弹窗关闭')
      }
    });
  },
  methods: {
    doSomething(){},
    
    hangUp() {
      window.workbench.hangUp();
      console.log("挂机");
    },
    toggleMuteInCall() {
      window.workbench.toggleMuteInCall();
      this.toggleMuteInCallStatus = !this.toggleMuteInCallStatus
      console.log("静音");
    },
    timer() {
      console.log('时间++')
      this.second++;
      if (this.second >= 60) {
        this.second = 0;
        this.minute = this.minute + 1;
      }

      if (this.minute >= 60) {
        this.minute = 0;
        this.hour = this.hour + 1;
      }

      this.callTime =
        this.formatZero(this.hour) +
        "时" +
        this.formatZero(this.minute) +
        "分" +
        this.formatZero(this.second) +
        "秒";
    },
    formatZero(num, len = 2) {
      if (String(num).length > len) return num;
      return (Array(len).join(0) + num).slice(-len);
    },
    //弹窗 关闭
    handleClose() {
      this.dialogVisible = false;
      this.$emit("cluesDetailCloseFn");
    },
    save(next) {
      let params = {};
      //客户档案
      // console.log(this.$refs.archiveRef.customers, this.$refs.archiveRef.intentionArchive, this.$refs.archiveRef.intentionInfo)
      Object.assign(params, this.customers);
      params.wechatAdded = params.wechatAdded == true ? 1 : 0;
      // params.gender = this.$refs.archiveRef.gender;
      params.intentionInfo = this.intentionArchive;
      // params.intentionInfo = params.intentionInfo.concat(this.$refs.archiveRef.intentionInfo);
      params.userId = this.clueInfo.userId;
      //客户档案字段校验
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
      
      // 添加跟进 表单数据
      let followFilters = this.$refs.followRef.followFilters;
      Object.assign(params, this.$refs.followRef.followFilters);
      if(followFilters.followResult == 1){
        params.nextFollowDate = this.$refs.followRef.nextFollowDate
      }else{
        params.inviteInfo = this.$refs.followRef.inviteInfo
        params.nextFollowDate = this.$refs.followRef.nextFollowDate2;
      }

      if(followFilters.followResult == 1){
          params.nextFollowDate = this.$refs.followRef.nextFollowDate;
          if (!params.nextFollowDate) {
              this.$message.error("请选择下次跟进时间");
              return;
          }
      }else{
          params.inviteInfo = this.$refs.followRef.inviteInfo;
          let flag2 = true;
          try {
              params.inviteInfo.forEach((element, i) =>{
                  if (!element.areaId) {
                      this.$message.error("请选择邀约门店");
                      flag2 = false;
                      throw Error();
                  }
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

      // byaicc 百应， alicc 阿里， RL 容联， cticloud 天润
      switch (this.sdkType) {
        case 'RL':
          params.callThirdType = 1;
          break;
        case 'byaicc':
          params.callThirdType = 2;
          break;
        case 'cticloud':
          params.callThirdType = 3;
          break;
      
        default:
          break;
      }

      // 通话供应商平台通话id
      if (this.phoneJson.CallsheetId) {
        params.callThirdId = this.phoneJson.CallsheetId
      }

      if (this.currentHasCall('save')) {
        this.clueAdd(params, next);
        this.saveOpenTask();
      }
    },
    //保存跟进
    clueAdd(params, next){
      if(!this.$route.query.id){
        params["addClue"] = 0;  //新增档案
      }
      Http.clueAdd2(params)
      .then(res => {
        this.$handleResponse(res, res => {
          // 数据处理
          this.$message.success('保存成功');
          // this.getFollowClue();
          this.isSaveFlag = true;
          if(this.$route.query.back){
            if(next){
              this.handleNext();
            }else{
              this.$router.replace({
                path: '/work',
              })
            }
          }else{
            //回线索详情
            this.$router.push({'path':'/business/clue/detail', query: {'id': this.$route.query.id}});
          }
          
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    // 保存开口任务
    saveOpenTask(){
      if(!this.openTask || this.openTask.length == 0){
        return;
      }
      let contentId = this.$refs.openTaskRef && this.$refs.openTaskRef.checkboxGroup;
      // if(!contentId || contentId.length == 0){
      //   return;
      // }
      let taskData = [];
      this.openTask.forEach((element, index) => {
        if(contentId.indexOf(element.id) > -1){
          taskData.push({
            contentId: element.id,
            status: 1
          })
        }else{
           taskData.push({
            contentId: element.id,
            status: 0
          })
        }
      })
      let params = {
        type: 2, //类型，1潜客，2线索
        userId: this.$route.query.userId,
        dataId: this.$route.query.id,
        task: taskData,  //任务列表
      }
      
      Http.openTaskComplete(params)
      .then(res => {
        this.$handleResponse(res, res => {
          // 数据处理
        },true);
      })
      .catch(err => {
        this.$store.commit("closeLoading");
      });
    },
    
    //返回
    goBack(){
      if (this.currentHasCall('back')) {
        if (window.history.length <= 1) {
          this.$router.push({ path: "/work" });
          return;
        } else {
          this.$router.go(-1);
        }
      }
    },
    // 当前是否在通话
    currentHasCall(type) {
      if(window.localStorage.getItem('objectDeclareFunc') == 'EvtConnected' || window.localStorage.getItem('stateActionRL') == 'EvtConnected'){
        this.$message({
          message: type == 'save' ? '保存失败，请先挂断通话在保存' : '当前正在通话，请不要离开',
          type: 'warning',
          showClose: true
        });
        return false;
      }
      return true;
    },
    // 无效线索
    invalidClue(){
      this.dialogVisibleInvalidClue = true;
    },
    invalidClueCloseFn(next){
        this.dialogVisibleInvalidClue = false;
        if(next){
          console.log('页面跳转到“下一条”待处理线索详情')
          let next = this.followPage.next;
          this.handleData(next);
        }
    },
    // 线索转移
    transferClue(){
      this.dialogVisibleTransferClue = true;
    },
    transferClueCloseFn(next){
      this.dialogVisibleTransferClue = false;
      if(next){
        console.log('回到线索详情页刷新页面')
        this.getFollowClue();
      }
    },
    
    // 稍后联系
    contactLater(){
      this.dialogVisibleContactLater = true;
    },
    contactLaterCloseFn(next){
      this.dialogVisibleContactLater = false;
      if(next){
        console.log('进入下一条数据')
        let next = this.followPage.next;
        this.handleData(next);
      }
    },

    //线索跟进 - 线索详情接口  pageFrom: 页面来源，默认是工作台线索待处理，1线索管理页面
    getFollowClue(init=''){
      Http.getFollowClue({sort: this.$route.query.sort, id: this.$route.query.id, userId: this.$route.query.userId,pageFrom: this.$route.query.total ? '' : -1})
        .then(res => {
          this.$store.commit("closeLoading");
          this.$handleResponse(res, res => {
            // 数据处理
            this.openTask = res.openTask;
            this.clueInfo = res.clueInfo;
            this.intentionInfo = [];
            this.extendData = [];
            this.catchIntentionInfo = [];
            this.catchExtendData = [];
            this.clueInfo.intentionInfo.forEach(element => {
              this.intentionInfo.push(element)
              this.extendData.push(element.extend)
              this.catchIntentionInfo.push(element);  //会更新的数据
              this.catchExtendData.push(element.extend);
            });
            
            this.competeModels = this.catchExtendData[0].competeModel
            this.archiveInfo = res.clueInfo;
            this.followPage = res.followPage;

            this.customers = res.clueInfo;
            // this.intentionArchive = this.archiveInfo.intentionInfo;
            console.log('客户档案信息', this.customers)
            this.customers = {
              nickname: this.archiveInfo.nickName || this.archiveInfo.nickname,
              gender: this.archiveInfo.gender, //性别，1男，2女
              tel: this.archiveInfo.tel,
              wechatNumber: this.archiveInfo.wechatNumber,
              wechatAdded: this.archiveInfo.wechatAdded == 1? true: false,
              buyType: this.archiveInfo.buyType || '',
              isMortgage:this.archiveInfo.isMortgage, //是否贷款，0未知，1是，2否
              provinceId: this.archiveInfo.provinceId || '', //以下三个是购车区域
              cityId: this.archiveInfo.cityId ? this.archiveInfo.cityId : this.archiveInfo.cityName, //
              regionId: this.archiveInfo.regionId || '',//
              buyQuota: this.archiveInfo.buyQuota, //购车指标，0未知，1有，2无
            };
            this.intentionArchive = [];
            this.intentionArchiveOptions = [];
            this.archiveInfo.intentionInfo.forEach((element,index) => {
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
              // this.dtIntentionInfo.push({
              //   areaId: element.areaId && element.areaId.toString(),
              //   areaName: element.areaName
              // });
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
              
              this.handleAreaIdHasSelect();
              if(init){
                this.getCitys(); //购车城市
              }
            })
            
            this.ctime = new Date().getTime();
            this.time = new Date().getTime();
            this.addFollowKey = new Date().getTime();
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },

    // 潜客跟进 - 获取页面初始数据
    getFollowForm(){
      Http.getFollowForm({})
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            console.log('潜客跟进 - 获取页面初始数据:', res)
            this.followFormData = res;
            this.clueFromOptions = res.clueFrom;
            this.buyTypeOptions = res.buyType;
            this.areaListOptions = res.buyType; // 下拉框增加已删除的值

          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },

    getAreaList(){
      this.$fetch.common.commonAreaList({})
        .then(res => {
          this.$handleResponse(res, res => {
            // 数据处理
            this.areaList = res;
            this.$forceUpdate();
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },

    setExtendDataIdx(index){
      this.extendDataIdx = index
      this.competeModels = this.catchExtendData[this.extendDataIdx].competeModel
    },

    addIntentionInfoFn(data){
      // 新增门店和车型成功后的处理
      this.getFollowClue();
      // this.$nextTick(()=>{
      //   this.intentionInfo.push(data);
      //   this.extendData.push(data.extend);
      // })

    },

    //上一条
    handlePrev(){
      if(!this.isSaveFlag){
        this.$confirm('您当前的操作未保存，是否要进行上一条操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let prev = this.followPage.prev;
          this.handleData(prev, false);
        })
        .catch(_ => {});
      }else{
        let prev = this.followPage.prev;
        this.handleData(prev);
      }
      
      
    },
    //下一条
    handleNext(){
      if(!this.isSaveFlag){
        this.$confirm('您当前的操作未保存，是否要进行下一条操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let next = this.followPage.next;
          this.handleData(next, false);
        })
        .catch(_ => {});
      }else{
        let next = this.followPage.next;
        this.handleData(next);
      }
      
    },

    handleData(data, flag=true){  //flag标志是否总数要减一
      if(data.clueId && data.userId){
        this.$router.replace({
          path: '/_empty',
          query:{'back': this.$route.query.back,'total': this.$route.query.total, sort: this.$route.query.sort}
        })
        this.$router.replace({ path: '/work/cluesDeal',query:{'back': this.$route.query.back,'total': flag ? this.$route.query.total - 1 : this.$route.query.total, sort: this.$route.query.sort, 'id': data.clueId, 'userId': data.userId}})
        this.getFollowClue();
        this.key = new Date().getTime();
      }else{
        this.$message({
          message: '暂无需处理的线索',
          type: 'warning',
          showClose: true
        });
        this.$router.replace({
          path: '/work',
        })
      }
      
    },

    addStroeAndCar() {
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
      this.intentionArchive.push({
          areaId: '',
          brandId: '',
          carSeriesId: '',
          modelId: '',
          fromTopId: this.intentionArchive[0].fromTopId,
          fromSecondId: this.intentionArchive[0].fromSecondId
        });
      this.intentionArchiveOptions.push({
        brandOptions: [],
        seriesOptions: [],
        modelOptions: []
      })
    },
    clearCar(index){
      this.intentionArchive.splice(index, 1);
      this.intentionArchiveOptions.splice(index, 1);
      this.handleAreaIdHasSelect();
      this.catchIntentionInfo.splice(index, 1);
      this.catchExtendData.splice(index, 1);
      if(this.extendDataIdx == index){  //选择的是删除的这一条数据
        this.extendDataIdx = 0;
      }
    },
    handleAreaIdHasSelect(){
      this.areaIdHasSelect = [];
      this.intentionArchive.forEach((element)=>{
        this.areaIdHasSelect.push(element.areaId);
      })
    },
    getCitys() {
      this.$fetch.work
        .getRegin({})
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
      if(!noclear){
        this.intentionArchive[index].fromSecondId = "";
      }
      for (let i of this.clueFromOptions) {
        if (i.id == this.intentionArchive[index].fromTopId) {
          this.source_second = i.children || [];
          //只有一级来源的时候也可以提交
          if(this.source_second.length == 0 && this.intentionArchive[index].modelId){
            //提交新增的门店车型
            this.addIntentionInfo(this.intentionArchive, index);
          }
        }
      }
    },
    sourceSecondChange(index){
      this.$forceUpdate();
      if(this.intentionArchive[index].modelId){
        //提交新增的门店车型
        this.addIntentionInfo(this.intentionArchive, index);
      }
    },
    areaIdChange(type, index){
      this.handleAreaIdHasSelect();
      if(type == 1){
        this.intentionArchive[index].brandId = '';
        this.intentionArchive[index].carSeriesId = '';
        this.intentionArchive[index].modelId = '';
        this.intentionArchiveOptions[index].brandOptions = [];
        this.intentionArchiveOptions[index].seriesOptions = [];
        this.intentionArchiveOptions[index].modelOptions = [];
        this.getBrandList(this.intentionArchive[index].areaId, type, index);
      }
    },
    getBrandList(areaId, type, index){
        this.$fetch.common.carBrand({'areaId': areaId},false).then((res)=>{
            this.$handleResponse(res, res=>{
              this.intentionArchiveOptions[index].brandOptions = this.$hasArrContent(res)?res:[];
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
      }
        
    },
    changeModel(flag = false, index, edit){
        this.$forceUpdate();
        if(this.intentionArchive[index].fromSecondId){
          this.addIntentionInfo(this.intentionArchive, index);
          // if(flag && edit == 'edit'){
          //   //提交新增的门店车型
          //   this.addIntentionInfo(this.intentionArchive, index);
          // }
          // else{
          //   //提交新增的门店车型
          //   this.addIntentionInfo(this.intentionInfo, index);
          // }
        }
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
            if(this.catchIntentionInfo[index] && this.catchIntentionInfo[index].extend){
              this.catchIntentionInfo[index] = res; //修改
            }else{
              this.catchIntentionInfo.push(res); //新增
            }
            this.catchIntentionInfo.forEach(element => {
              this.catchExtendData.push(element.extend);
            });
            this.competeModels = this.catchExtendData[this.extendDataIdx].competeModel
            this.ctime = new Date().getTime();
            // this.$message.success('保存成功');
            // this.$emit('addIntentionInfoFn',res )
          },true);
        })
        .catch(err => {
          this.$store.commit("closeLoading");
        });
    },
    
    
  },
  activated(){
    console.log('activated');
  },
  deactivated(){
    console.log('deactivated');
  },
  beforeDestroy(){
  },
  destroyed(){
    console.log('destroyed');
    var app = document.getElementById("app");
    // app.style.minWidth = "1300px"; //设置宽度 
    
  }
};
</script>

<style lang="scss" scoped>
.page {
  // padding: 30px;
}
.mini-width5, .red{
    width: 5px;
    display: inline-block;
}
.red {
  color: #ea5a54;
}
.dialog-center-temp{
    
    border: solid 1px #eaebf0;
}
.flex-box-col .dialog-center-temp:not(:last-child){
  margin-bottom: 10px;
}
.clues-deal-page {
  // background-color: #fff;
}
.clues-deal-top{
  padding: 15px 15px 0;
  background-color: #fff;
// 
  // height: calc(100vh - 90px);
}
.clues-deal-title{
  border: solid 1px #eaebf0;
  border-bottom: 0;
  display: flex;
  .go-back{
    width: 50px;
    background-color: #3d7eff1a;
    position: relative;
    img{
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.clues-deal-tools {
  flex: 1;
  padding: 5px 10px;
  background-color: #fbfcff;
  display: flex;
  justify-content: space-between;
  .dialog-title-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tools-line {
    display: inline-block;
    width: 1px;
    height: 30px;
    background-color: #eaebf0;
    margin: 0 15px;
  }
  .call-out-component {
    .call-out{
      display: flex;
      align-items: center;
      margin: 0 30px;
      .call-btns{
          margin-left: 10px;
      }
    }

    img {
      cursor: pointer;
    }
  } 
}
.grid-content-left {
  text-align: right;
  margin-right: 6px;
  line-height: 40px;
  font-size: 13px;
  color: #454545;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.call-dialog >>> .el-dialog__body {
  padding: 30px 11px !important;
}
.call-dialog .dialog-title {
  display: flex;
  justify-content: space-between;
}
.call-dialog .dialog-title .dialog-title-right {
  margin-right: 30px;
}
.dialog-title-text {
  font-size: 14px;
  margin-right: 10px;
}
.dialog-title-bt.dialog-title-text {
  font-size: 16px;
}
.call-dialog-center {
  background-color: #fff;
  border: 1px solid #eaebf0;
  border-bottom: 0;
  padding: 5px 10px;
  height: 800px;
}
.call-dialog-center .c-iheader {
  height: 90px;
  background-color: #5684ff;
  color: #fff;
  font-size: 14px;
  padding-left: 10px;
  .cont {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .name {
    font-size: 20px;
  }
  .phone {
    font-size: 20px;
  }
}
.call-dialog-center .lt-title {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #212427;
  border-bottom: 1px solid #eaebf0;
  padding-left: 10px;
}

.clues-deal-footer{
    text-align: center;
    padding: 30px;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #eaebf0;
}
.clues-deal-page >>> .el-input__inner{
    // height: 36px;
}

// .scroll-area{
//   height: 200px;
//   overflow: auto;
// }
.lt-content{
  height: calc(100% - 36px);
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
.lt-content.scroll-area{
  height: 100%;
}
.customer-files .lt-content{
  height: 100%;
}
.flex-box-col{
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px!important;
}
.flex-box-col-1{
  padding-left: 10px!important;
  .clue-em{
    flex: 1;
    overflow: hidden;
    margin-top: 8px;
  }
}
.flex-box-col-3{
  .add-follow{
    height: 338px;
  }
  .follow-record{
    flex: 1;
    overflow: hidden;
  }
}
.flex-box-col-2 .dialog-center-temp, .flex-box-col-4 .dialog-center-temp{
  height: 100%;
  .lt-content{
    overflow: hidden;
  }
}
.flex-box-col-4{
  padding-right: 10px!important;
}
.plain-btn-style ._img{
  vertical-align: sub;
}


// 客户档案
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
    justify-content: flex-end;
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



