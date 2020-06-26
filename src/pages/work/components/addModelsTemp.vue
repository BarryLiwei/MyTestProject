<template>
  <div class="add-models-temp">
    <el-col :span="24" class="m-b-15" v-for="(items, index) in addCarModel" :key="'add-'+index">
      <el-row class="rowmbottom10">
        <el-col :span="5">
          <div class="grid-content-left">
            意向车型{{index + 1 + length}}：
          </div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            <el-col :span="7">
              <el-select v-if="type == 1"
                v-model="items.brandId"
                placeholder="请选择"
                filterable
                @change="changeBrand(1, index)"
                :class="items.brandId==''?'c-placeholder':''"
                size="small"
              >
                  <el-option
                      v-for="item in intentionInfoOptions[index].brandOptions"
                      :key="index+'-brand-'+item.id"
                      :label="item.title"
                      :value="item.id"
                  ></el-option>
              </el-select>

              <el-select v-if="type == 2"
                v-model="items.brandId"
                placeholder="请选择"
                filterable
                remote 
                :remote-method="getBrandList"
                @change="changeBrand(1, index)"
                :class="items.brandId==''?'c-placeholder':''"
                size="small"
              >
                  <el-option
                      v-for="item in intentionInfoOptions[index].brandOptions"
                      :key="index+'-brand-'+item.id"
                      :label="item.title"
                      :value="item.id"
                  ></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select
                v-model="items.carSeriesId"
                placeholder="请选择"
                filterable
                @change="changeSeries(1, index)"
                :class="items.carSeriesId==''?'c-placeholder':''"
                size="small"
              >
                  <el-option
                      v-for="item in intentionInfoOptions[index].seriesOptions"
                      :key="index+'-series-'+item.id"
                      :label="item.title"
                      :value="item.id"
                  ></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-select
                v-model="items.modelId"
                placeholder="请选择"
                filterable
                @change="changeModel(1, index)"
                :class="items.modelId==''?'c-placeholder':''"
                size="small"
              >
                  <el-option
                      v-for="item in intentionInfoOptions[index].modelOptions"
                      :key="index+'-model'+item.id"
                      :label="item.title"
                      :value="item.id"
                  ></el-option>
              </el-select>
            </el-col>
            <div class="close-icon" @click="clearCar(index)">
              <img class="" :src="require('@/assets/images/work/close-black.png')">
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" class="m-b-15 store-and-car-btn">
      <el-row class="rowmbottom10">
        <el-col class="width-75">
          <div class="grid-content-left" style="width: 88.5px;height: 1px;"></div>
        </el-col>
        <el-col class="width-right-cont">
          <div class="grid-content">
            <div style="">
              <el-button
                :gutter="24"
                size="small"
                type="primary"
                icon="el-icon-plus"
                @click="addStroeAndCar"
              >添加</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>
<script>
export default {
  props: ["data", "length", "type"],
  data(){
    return {
      // parentsData: [],
      addCarModel: [],
      flagIndex: 0,
      intentionInfoOptions: []
    }
  },
  created(){
    console.log(this.data)
    this.handleModelsData();
  },
  computed: {
    'parentsData'(){
      return this.data;
    }
  },
  methods:{
    handleModelsData(){
      this.addCarModel = [];  //数据
      this.intentionInfoOptions = []; //options
      //知识库意向车型管理
      this.data.forEach((element,index) => {
        this.addCarModel.push({
          id: element.id,
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
        this.getBrandList('', index, 'noclear');
        if(this.addCarModel[index].brandId){
          this.changeBrand(1, index, 'noclear')
        }
        if(this.addCarModel[index].carSeriesId){
          this.changeSeries(1, index, 'noclear')
        }
      });
    },
    addStroeAndCar() {
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
      console.log(this.addCarModel, this.addCarModel.length)
      this.getBrandList('', this.addCarModel.length - 1);
      this.$emit('callbackFlagFn', this.intentionInfoOptions)
    },
    clearCar(index){
      if(this.addCarModel[index].id){
        this.$emit('deleteFn', this.addCarModel[index].id)
      }
      this.addCarModel.splice(index, 1);
      this.intentionInfoOptions.splice(index, 1);
      this.$emit('callbackFn', this.addCarModel)
    },
    getBrandList(kwd, index, noclear){
        this.flagIndex = index ? index : this.flagIndex;
        let queryName = '';
        let params = {};
        if (this.type == 2) {
          queryName = 'carBrandAll',
          params.kwd = kwd;
        } else {
            queryName = 'carBrand',
            params = {};
        }
        this.$fetch.common[queryName](params,false).then((res)=>{
            this.$handleResponse(res, res=>{
              this.intentionInfoOptions[this.flagIndex].brandOptions = this.$hasArrContent(res)?res:[];
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
        console.log(this.addCarModel)
        this.$emit('callbackFn', this.addCarModel)
    }
  }
  
}
</script>
<style lang="scss" scoped>
.grid-content-left {
  text-align: left;
  margin-right: 6px;
  line-height: 32px;
}
</style>

