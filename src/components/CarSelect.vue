<template>
  <div class="car-select-compontent">
    <el-select v-if="showCar.brand" v-model="brandId" placeholder="请选择" filterable @change="getSeriesList" :size="btnSize" 
        v-bind="$attrs"
        v-on="$listeners">
        <el-option
            v-for="(item, index) in brandOptions"
            :key="index"
            :label="item.title"
            :value="item.id">
        </el-option>
    </el-select>
    <el-select v-if="showCar.series" v-model="seriesId" placeholder="请选择" filterable @change="getModelList" :size="btnSize">
        <el-option
            v-for="(item, index) in seiresOptions"
            :key="index"
            :label="item.title"
            :value="item.id">
        </el-option>
    </el-select>
    <el-select v-if="showCar.model" v-model="modelId" placeholder="请选择" filterable @change="carSelectData" :size="btnSize">
        <el-option
            v-for="(item, index) in modelOptions"
            :key="index"
            :label="item.title"
            :value="item.id">
        </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    props: {
        showCar: {
            type: Object,
            default: {
                brand: true,  // 是否展示品牌
                series: true,  // 是否展示车系
                model: true,  // 是否展示车型
                brandId: null,
                seriesId: null,
                modelId: null
            }
        },
        brandOptions: {
            type: Array,
            default: []
        },
        btnSize: { // 用户那边默认用最小
            type: String,
            default: 'small'
        }
    },
    data() {
      return {
        seiresOptions: [],
        modelOptions: [],
        brandId: null,  // 品牌ID
        seriesId: null, // 车系ID
        modelId: null,  // 车型ID
      };
    },
    mounted () {
      this.$eventHub.$on('clear-select-car', () => {
          this.brandId = null;
          this.seriesId = null;
          this.modelId = null;
          this.seiresOptions = [];
          this.modelOptions = [];
      })  
    },
    created() {
        
    },
    watch: {
        'showCar.brandId'(newVal, oldVal) {
            this.initData();
        }
    },
    methods: {
        initData() {
            const { brandId, seriesId, modelId } = this.showCar

            if (brandId) {
                // this.getBrandList();
                this.brandId = brandId;

                if (seriesId) {
                    this.getSeriesList();
                    this.seriesId = seriesId;

                    if (modelId) {
                        this.getModelList();
                        this.modelId = modelId;
                    }
                }
            }
        },
        // // vuex中是否有品牌数据
        // hasBrandByVuex() {
        //     const { list } = this.$store.state.brandObject;
        //     // vuex中是否有数据
        //     if (list && list.length > 0) {
        //         this.brandOptions = list;
        //     } else { 
        //         // 重新获取接口
        //         if(this.showCar.brandId) {
        //             this.initData();
        //         } else {
        //             this.getBrandList('init');
        //         }
        //     }
        // },
        getBrandList(init) {
            this.$fetch.common.carBrand({},false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.brandOptions = res;
                    // 初始化没有值时，不需要发送通知
                    if (init != 'init') {
                        this.carSelectData();
                    }
                    this.$store.commit('setBrand', 
                        {
                            list: this.brandOptions,  // 品牌数据
                        } 
                    )
                }, false);
            })
        },
        getSeriesList() {
            this.seiresOptions = [];
            this.modelOptions = [];
            this.seriesId = '';
            this.modelId = '';
            this.$fetch.common.carSeries({ brandId: this.brandId }, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.seiresOptions = res;
                    this.carSelectData();
                }, false);
            })
        },
        getModelList() {
            this.$fetch.common.carModel({ seriesId: this.seriesId }, false).then((res)=>{
                this.$handleResponse(res, res=>{
                    this.modelOptions = res;
                    this.carSelectData();
                }, false);
            })
        },
        carSelectData() {
            let data = {
                brandId: this.brandId
            }

            if (this.seriesId) {
                data.seriesId = this.seriesId;
            }

            if (this.modelId) {
                data.modelId = this.modelId;
            }

            this.$emit('carSelect', data);
        }
    }
  }

</script>

<style lang="scss" scoped>
.car-select-compontent {
    display: flex;
    /deep/ .el-select {
        margin: 0 5px;
    }
}
</style>
