<template>
    <div class="area-follow-record record-wrap">
        <div class="history-record reset-scrollbar">
            <div class="clearfix" v-for="(item,i) in list" :key="i">
                <div class="histore-left">
                    {{item.addtime | filterBlank}}
                </div>
                <div class="histore-right">
                    <div class="histore-point"></div>
                    <ul>
                        <li>
                            <div class="h-li-left">意向等级</div>
                            <div class="h-li-right">
                                <div class="h-label">{{item.level_name | filterBlank}}</div>
                            </div>
                        </li>
                        <li>
                            <div class="h-li-left">意向车型</div>
                            <div class="h-li-right">{{item.log_car_name | filterBlank}}</div>
                        </li>
                         <li>
                            <div class="h-li-left">跟进类型</div>
                            <div class="h-li-right">{{item.behavior_name | filterBlank}}</div>
                        </li>
                        <li>
                            <div class="h-li-left">发生事件</div>
                            <div class="h-li-right" v-if="!item.behavior_name3 || (item.behavior_name3 && item.behavior_name3.length==0)">无</div>
                            <div class="h-li-right" v-else>
                              <span v-for="(val,k) in item.behavior_name3 " :key="k">[{{val.event | filterBlank}}]</span>
                            </div>
                        </li>
                        <li>
                            <div class="h-li-left">下次跟进时间</div>
                            <div class="h-li-right">{{item.next_revisit_time | filterBlank}}</div>
                        </li>
                         <li>
                            <div class="h-li-left">跟进备注</div>
                            <div class="h-li-right">{{item.content | filterBlank}}</div>
                        </li>
                         <li>
                            <div class="h-li-left">跟进人</div>
                            <div class="h-li-right">{{item.au_name | filterBlank}}</div>
                        </li>
                        <!--报价-->
                         <li v-if="item.offer && item.offer.price">
                            <div class="h-li-left">报价金额</div>
                            <div class="h-li-right">{{item.offer.price | filterBlank}}元</div>
                        </li>
                         <li v-if="item.offer && item.offer.car_name">
                            <div class="h-li-left">报价车型</div>
                            <div class="h-li-right">{{item.offer.car_name | filterBlank}}</div>
                        </li>
                        <!--下订-->
                         <li v-if="item.order && item.order.deal_price">
                            <div class="h-li-left">订单金额</div>
                            <div class="h-li-right">{{item.order.deal_price | filterBlank}}元</div>
                        </li>
                         <li v-if="item.order && item.order.is_loan">
                            <div class="h-li-left">是否贷款</div>
                            <div class="h-li-right">{{item.order.is_loan | filterBlank}}</div>
                        </li>
                         <li v-if="item.order && item.order.is_insurance">
                            <div class="h-li-left">是否贷款</div>
                            <div class="h-li-right">{{item.order.is_insurance | filterBlank}}</div>
                        </li>
                        <!--邀约登记-->
                         <li v-if="item.bespeak_arrive && item.bespeak_arrive.addtime">
                            <div class="h-li-left">约定到店时间</div>
                            <div class="h-li-right">{{item.bespeak_arrive.addtime | filterBlank}}</div>
                        </li>
                        <!--预约试驾-->
                         <li v-if="item.bespeak_driver && item.bespeak_driver.confirm_at">
                            <div class="h-li-left">预约试驾时间</div>
                            <div class="h-li-right">{{item.bespeak_driver.confirm_at | filterBlank}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="history-empty" v-if="list.length==0">
            暂无跟进记录
        </div> 
    </div>
</template>

<script>
// 此为门店跟进记录，产品彭说复制单店的
export default {
    props: {
        list: {
            type: Array,
            default: ()=>{return []}
        }
    },
    data () {
      return {}
    }
}
</script>

<style lang="scss" scoped>
.record-wrap{
    width:532px;
    max-width: 100%;
    padding: 0 16px;
    position: relative;
}
.history-record{
    margin-top: 30px;
    max-height: 600px;
    overflow-y: auto;
    font-size: 14px;
}
.histore-left {
    margin-left: 18px;
    width: 76px;
    text-align: right;
    float: left;
    padding-top:1px;
}
.histore-right {
    border-left: 1px solid #409EFF;
    float: left;
    margin-left: 38px;

    position: relative;
}
.histore-right ul {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-left: 16px;
    padding-bottom: 48px;
    font-weight: normal;
}
.histore-right ul li {
    width: 316px;
    display: flex;
    line-height: 18px;
    min-height: 26px;
    justify-content: space-between;
}
.h-li-right{text-align: right;line-height: 18px;width: 190px;display: flex;justify-content: flex-end;padding:3px 0;}
.h-li-left{width:108px;display: block;display: flex;padding:3px 0;}
.h-label{height: 22px;padding:0 14px;background: #409EFF;border-radius: 12px;line-height: 22px;color:white;}
.histore-point{width:20px;height:20px;background: #fff;position:absolute;display: flex;justify-content:center;align-items: center;left: -10px;top:1px;}
.histore-point::before{
    content: '';
    width:12px;
    display: block;
    height: 12px;
    border-radius: 12px;
    background: #409EFF;
}
.histore-more{
    text-align: center;
    width:100%;
    color:#999;
    margin-top:24px;
    float:left;
}
.history-empty{
    color: #909399;
    text-align: left;
    margin-top: 30px;
}
</style>


