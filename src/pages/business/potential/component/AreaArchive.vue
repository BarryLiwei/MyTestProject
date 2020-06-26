<template>
    <div class="area-archive-component">
        <div class="m-b-10">
            <el-tag class="m-r-10 m-b-10" v-for="(item,index) in tags" :key="'tag'+index"  :effect="activedTag == index?'dark':'plain'" @click="changeTag(item, index)">
                {{ item.areaName }}
            </el-tag>
        </div>

        <div class="detail-wrap flex">
            <div class="flex-1 detail-left">
                <step-title :step="{'title': '客户档案'}"></step-title>

                <el-form ref="form" label-position="right" label-width="150px" class="m-t-20">
                    <!-- <el-form-item label="跟进状态"> {{ shopInfo.followStatus | filterBlank}} </el-form-item>
                    <el-form-item label="跟进坐席组"> {{ shopInfo.dccGroupName | filterBlank}} </el-form-item>
                    <el-form-item label="跟进DCC"> {{ shopInfo.dccName | filterBlank}} </el-form-item>
                    <el-form-item label="客户ID"> {{ shopInfo.userId | filterBlank}} </el-form-item>
                    <el-form-item label="客户姓名"> {{ shopInfo.name | filterBlank}} </el-form-item>
                    <el-form-item label="手机号码"> {{ shopInfo.tel | filterBlank}} </el-form-item>
                    <el-form-item label="意向等级"> {{ shopInfo.level | filterBlank}} <span v-if="shopInfo.level">级</span></el-form-item>
                    <el-form-item label="建档时间"> {{ shopInfo.createdAt | filterBlank}} </el-form-item>
                    <el-form-item label="最后跟进时间"> {{ shopInfo.lastFollowTime | filterBlank}} </el-form-item>
                    <el-form-item label="下次跟进时间"> {{ shopInfo.nextFollowTime | filterBlank}} </el-form-item>
                    <el-form-item label="归属门店"> {{ shopInfo.areaName | filterBlank}} </el-form-item>
                    <el-form-item label="意向车型"> {{ shopInfo.modelName | filterBlank}} </el-form-item>
                    <el-form-item label="客户来源"> {{ shopInfo.from | filterBlank}} </el-form-item>
                    <el-form-item label="销售顾问"> {{ shopInfo.adviserName | filterBlank}} </el-form-item>
                    <el-form-item label="购车区域"> {{ shopInfo.buyCity | filterBlank}} </el-form-item>
                    <el-form-item label="购车类型"> {{ shopInfo.buyType | filterBlank}} </el-form-item>
                    <el-form-item label="是否贷款"> {{ shopInfo.isLoan | filterBlank}} </el-form-item> -->

                    <!-- 单店内容  字段后端还没补全，字段随便取先 上面注释的，后续就删掉，防止产品说跟dcc一样 -->
                    <el-form-item label="姓名"> {{ shopInfo.name | filterBlank}} </el-form-item>
                    <el-form-item label="性别"> {{ shopInfo.sex==1?"男":"女"}} </el-form-item>
                    <el-form-item label="手机号码"> {{ shopInfo.tel | filterBlank}} </el-form-item>
                    <el-form-item label="微信号"> {{ shopInfo.wechat_id | filterBlank}} </el-form-item>
                    <el-form-item label="出生日期"> {{ shopInfo.birthday | filterBlank}} </el-form-item>
                    <el-form-item label="身份证"> {{ shopInfo.id_number | filterBlank}} </el-form-item>
                    <el-form-item label="年龄段"> {{ shopInfo.ageText | filterBlank}} </el-form-item>
                    <el-form-item label="客户来源"> {{ formText | filterBlank}} </el-form-item>
                    <el-form-item label="居住地址"> {{ addressStr | filterBlank}} </el-form-item>
                    <el-form-item label="保有车型"> {{ hasCarStyle | filterBlank}} </el-form-item>
                    <el-form-item label="竞争车型"> {{ shopInfo.compare_car| filterBlank}} </el-form-item>
                    <el-form-item label="客户标签"> 
                        <div v-if="shopInfo.tag_info">
                            <el-tag class="m-r-5 m-b-5" v-for="tag in shopInfo.tag_info" :key="tag.tag_name">
                              {{tag.tag_name}}
                            </el-tag>
                        </div>
                        <div v-else>--</div>
                    </el-form-item>
                    <el-form-item label="购车用途"> {{ shopInfo.purpose | filterBlank}} </el-form-item>
                    <el-form-item label="购车类型"> {{ shopInfo.buy_type | filterBlank}} </el-form-item>
                    <el-form-item label="二手车车型" v-if="shopInfo.buy_type=='置换'"> {{ shopInfo.second_hand_car | filterBlank}} </el-form-item>
                </el-form>
            </div>
            <div class="w-100"></div>
            <div class="flex-1 detail-right">
                <step-title :step="{'title': '跟进记录'}"></step-title>

                <area-follow-record :list="recordList"></area-follow-record>
            </div>
        </div>

    </div>
</template>

<script>
import StepTitle from '@/components/step/StepTitle';
import AreaFollowRecord from '@/pages/business/potential/component/AreaFollowRecord'
export default {
    components:{
        StepTitle,
        AreaFollowRecord
    },
    props: {
        tags:{ // tags在门店的接口获取
            type: Array,
            default:()=>{return []}
        }
    },
    data(){
        return{
            shopInfo:{},
            recordList:[], // 跟进记录
            activedTag: 0 ,
        }
    },
    created(){
        if(this.tags && this.tags.length){
            this.getArchiveDetail(this.tags[0].id);
        }
    },
    computed:{
        formText(){
            let text = [];
            if(this.shopInfo.source){
                text.push(this.shopInfo.source)
            }
            if(this.shopInfo.source_second){
                text.push(this.shopInfo.source_second)
            }
            return text.join('-');
        },
        addressStr(){
            let text='';
            if(this.shopInfo.province_name){
                text += this.shopInfo.province_name;
            }
            if(this.shopInfo.city_name){
                text += this.shopInfo.city_name;
            }
            if(this.shopInfo.region_name){
                text += this.shopInfo.region_name;
            }
            if(this.shopInfo.address && this.shopInfo.address.indexOf(this.shopInfo.province_name) > -1){
                text = this.shopInfo.address; // address上有省份，不需要添加
            }else if(this.shopInfo.address){
                text = `${text}(${this.shopInfo.address})`
            }
            return text;
        },
        hasCarStyle(){
            let arr=[]
            if(this.shopInfo.archive_car_brand_name){
                arr.push(this.shopInfo.archive_car_brand_name)
            }
            if(this.shopInfo.archive_car_model_name){
                arr.push(this.shopInfo.archive_car_model_name)
            }
            if(this.shopInfo.archive_car_series_name){
                arr.push(this.shopInfo.archive_car_series_name)
            }
            return arr.join(' ');
        }
    },
    methods:{
        changeTag(item, index){
            this.activedTag = index;
            this.getArchiveDetail(item.id);
        },
        getArchiveDetail(id){ // dcc 档案id
            this.$fetch.business.archiveAreaDetail({'id': id}).then((res)=>{
                this.$handleResponse(res, data=>{
                    this.shopInfo = data?data:{};
                    this.recordList = data.follows?data.follows:[];

                    this.dealData(data);
                    
                },true);
            }).catch(()=>{
                this.$store.commit('closeLoading');
            })
        },
        dealData(data){
            let select_form = data.select_form;
            // 购车用途 
            if(this.shopInfo.purpose){
                let isBuyTrue=false; 
                if(select_form && select_form.Purposes && select_form.Purposes.length){
                    for(let i=0, length=select_form.Purposes.length; i<length; i++){
                        if(this.shopInfo.purpose === select_form.Purposes[i].id){
                            isBuyTrue=true
                            break;
                        }
                    }
                }
                if(!isBuyTrue){
                    this.shopInfo.purpose = '其他';
                }
            }
            //购车类型buy_type
            if(this.shopInfo.buy_type){
                let isTypeTrue=false;
                if(select_form && select_form.BuyTypes && select_form.BuyTypes.length){
                    for(let i=0, length=select_form.BuyTypes.length; i<length; i++){
                        if(this.shopInfo.buy_type === select_form.BuyTypes[i].id){
                            isTypeTrue=true;
                            break;
                        }
                    }
                }
                if(!isTypeTrue){
                    this.shopInfo.buy_type = '其他';
                }
            }
            // 年龄段
            let ageText = '--';
            if(this.shopInfo.age > 0){
                if(select_form && select_form.AgeRange && select_form.AgeRange.length){
                    for(let i=0,length=select_form.AgeRange.length; i<length; i++){
                        if(this.shopInfo.age == select_form.AgeRange[i].id){
                            ageText = select_form.AgeRange[i].name;
                            break;
                        }
                    }
                }
            }
            this.$set(this.shopInfo, 'ageText', ageText)
        }
    }
}
</script>

<style lang="scss" scoped>
.area-archive-component {
    padding: 12px 20px 20px;
}
.el-form-item {
    margin-bottom: 4px;
}
</style>

