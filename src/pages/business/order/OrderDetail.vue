<template>
    <el-dialog
        title="订单详情"
        class="order-detail-dialog"
        :visible.sync="showDialog"
        width="900px"
        append-to-body
        :close-on-click-modal="false"
        :before-close="cancel">

        <el-button round size="small" class="m-b-20" type="primary" @click="seeArchive">潜客详情</el-button>

        <div class="flex  m-b-15" v-for="(item, index) in rowConfig" :key="'row'+index">
            <div class="flex-1 flex">
                <div class="w-90">{{ item.left.label}}</div>
                <div class="flex-1 m-l-15"> {{ row[item.left.key] | filterBlank}}</div>
                <div class="w-90 p-l-10" v-if="item.left.label=='手机号码'">{{ item.middle.label}}</div>
                <div class="flex-1" v-if="item.left.label=='手机号码'"> {{ row[item.middle.key] | filterBlank}}</div>
            </div>
            <div class="flex-1 flex box-right" v-if="item.right">
                <div class="w-140 m-l-15">{{ row[item.right.key] | filterBlank}}</div>
                <div class="w-90">{{ item.right.label }}</div>
            </div>
        </div>
        
        <div class="table-content">
            <el-table class="table_first" :data="info" style="width: 100%" border>
                <el-table-column v-for="(item, index) in tableConfig[0]" :key="'first'+index"
                    :label="item.header"
                    align="center">
                    <template slot-scope="scope">
                        {{ scope.row[item.key] | filterBlank}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table  :data="info"  style="width: 100%" border>
                <el-table-column v-for="(item, index) in tableConfig[1]" :key="'first'+index"
                    :label="item.header"
                    align="center">
                    <template slot-scope="scope">
                        {{ scope.row[item.key] | filterBlank}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        row: {
            type: Object,
            default: ()=>{ return{} }
        }
    },
    data(){
        return{
            showDialog: true,
            info: [],
        }
    },
    created(){
        this.initRowData();
        this.initData();
    },
    methods: {
        initData(){
            this.rowConfig = [
                {'left': {'label':'客户ID', 'key': 'userId'}, 'right': {'label':'订单状态', 'key': 'orderStatus'}},
                {'left': {'label':'客户姓名', 'key': 'nickname'}, 'right': {'label':'下订时间', 'key': 'orderTime'}},
                {'left': {'label':'手机号码', 'key': 'tel'},'middle':{'label':'意向等级', 'key': 'level'}, 'right': {'label':'交车时间', 'key': 'orderDeliveryTime'}}
            ];
            this.tableConfig = [
                [
                    {'header': '跟进DCC',  'key': 'dccName', },
                    {'header': '订单编号',  'key': 'orderId',},
                    {'header': '订单门店',  'key': 'orderAreaName',},
                    {'header': '销售顾问',  'key': 'orderAdvisorName',},
                    {'header': '订单姓名',  'key': 'orderNickname',},
                    {'header': '订单电话',  'key': 'orderTel',},
                    {'header': '订单品牌',  'key': 'orderBrand',},
                ],[
                    {'header': '订单车系',  'key': 'orderCarSeries',},
                    {'header': '订单车型',  'key': 'orderModel',},
                    {'header': '购买保险',  'key': 'orderIsInsuranceName',},
                    {'header': '是否贷款',  'key': 'orderIsMortgageName',},
                    {'header': '车牌号',    'key': 'orderLicensePlate',},
                    {'header': 'VIN',       'key': 'orderVin',},
                    {'header': '客户来源',  'key': 'customFrom',},
                ],
            ]
        },
        initRowData(){
            let info = this.$deepCopyContent(this.row);
            let arr = [];
            if(this.row.orderFromTopName){
                arr.push(this.row.orderFromTopName)
            }
            if(this.row.orderFromSecondName){
                arr.push(this.row.orderFromSecondName)
            }
            info['customFrom']=arr.join('-');
            this.info.push(info);
        },
        getDetail(){
            // this.$fetch.business.orderDetail().then().catch(()=>{})
        },
        seeArchive(){
            this.$router.push({'path':'/business/potential/detail', query: {'id': this.row.intentionId}});
            this.$emit('cancel')
        },
        cancel(){
            this.$emit('cancel')
        }
    }
}
</script>

<style lang="scss" scoped>
.order-detail-dialog /deep/.el-dialog__body {
    padding: 30px 30px 36px;
}

.box-right {
    flex-direction: row-reverse;
}

/deep/.el-table .el-table__body .el-table__row tr:hover>td{
    background-color: #fff!important;
}

.table_first {
    border-bottom: 0px solid #ddd;
}
</style>


