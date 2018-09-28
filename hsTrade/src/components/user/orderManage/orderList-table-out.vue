<template>
    <div v-loading="tableData.loading">
        <div class="list-item" v-for="(x,i) in tableData.list" :key="i">
            <div class="head clear">
                <span class="fl">订单号：{{x.orderNo}}</span>
                <span class="fl m-l">交易时间：{{x.createTime|formatTime("YMDHMS")}}</span>
                <el-button type="text" class="fr remarks" v-if="!!x.remark&&x.remark==0&&(x.orderState>=3&&x.orderState<5)">
                    <span class="warning fl"></span>
                    <span class="fl">提醒发货</span>
                </el-button>
            </div>
            <div class="detail">
                <div class="left">
                    <div>
                        <div class="cell">商品：<router-link class="text-href" :title="x.shopName" :to="'/buy/detail?id='+x.goodsId+'&modelId='+x.modelId">{{x.shopName}}</router-link></div>
                        <div class="cell">总额：{{x.totalAmount|toDoubleThousands}}元</div>
                        <div class="cell">总量：{{x.shopCount}}{{x.meterUnit}}</div>
                    </div>
                    <div>
                        <div class="cell">现阶段：
                            <span v-if="x.orderState<=1">待付定金</span>
                            <span v-if="x.orderState<=2&&x.orderState>1">待付尾款</span>
                            <span v-if="x.orderState>=3&&x.orderState<5">待发货</span>
                            <span v-if="x.orderState==4">已取消</span>
                            <span v-if="x.orderState>=5&&x.orderState<6">待验收</span>
                            <span v-if="x.orderState>=6&&x.orderState<=7">已完成</span>
                            <span v-if="x.orderState==8">退款中</span>
                            <span v-if="x.orderState==9">已退款</span>
                            <span v-if="x.orderState==10">已关闭</span>
                        </div>
                        <!-- <div class="cell">金额：100000.00元</div> -->
                        <div class="cell c7">
                            <span>
                                <span class="fl text-danger status" v-if="x.orderState<=2">待付款　</span>
                                <span class="fl text-danger status" v-if="x.orderState!=4&&x.orderState>=3&&x.orderState<5">待发货　</span>
                                <span class="fl status" v-if="x.orderState==4">已取消　</span>
                                <span class="fl text-danger status" v-if="x.orderState>=5&&x.orderState<6">已发货　</span>
                                <span class="fl status" v-if="x.orderState>=6&&x.orderState<=7">已完成　</span>
                                <span class="fl text-danger status" v-if="x.orderState==8">退款中　</span>
                                <span class="fl status" v-if="x.orderState==9">已退款　</span>
                                <span class="fl status" v-if="x.orderState==10">已关闭　</span>
                            </span>
                            <!-- <span class="el-icon-time m-l-xs fl text-gray" style="font-size:16px;line-height:60px" v-if="x.orderState==1||x.orderState==2||x.orderState==8"></span> -->
                            <!-- <day-time-count class="fl text-gray" :details="x" v-if="x.orderState==1||x.orderState==2||x.orderState==5||x.orderState==8"></day-time-count> -->
                            <!-- isLocked    0 未锁定  1 锁定 -->
                            <span v-if="x.isLocked==0">
                                <day-time-overtime class="fl text-gray" :details="x" v-if="x.orderState<=5"></day-time-overtime>
                                <span class="text-href m-l" @click="showDialog(i)" v-if="(x.orderState==5||x.orderState==6)&&!!x.expressImages">查看发货单</span>
                            </span>
                            <span v-if="x.isLocked==1" class="fl text-danger status">锁定</span>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div><span class="text-href" @click="toDetail(x)">订单详情</span></div>
                    <div><el-button type="primary" size="mini" v-if="x.orderState>=1&&x.orderState<3&&(!x.remark||x.remark!=1)&&x.isLocked==0" @click="remindDelivery(x,1)" :disabled="x.isLocked==1">提醒付款</el-button></div>
                    <div><el-button type="primary" size="mini" v-if="x.orderState==5&&(!x.remark||x.remark!=2)&&x.isLocked==0" @click="remindDelivery(x,2)" :disabled="x.isLocked==1">提醒验收</el-button></div>
                    <div><el-button type="primary" size="mini" v-if="x.orderState==3" @click="delivery(x)" :disabled="x.isLocked==1">发货</el-button></div>
                    <div>
                        <!-- 待付定金和待付尾款超时 -->
                        <span class="text-danger pointer" v-if="(x.orderState==1||x.orderState==2)&&(x.currentTime-x.createTime)-3*86400000>=0" @click="contactCustomer.isShowCustomerDialog = true">联系客服</span>
                        <!-- 待发货超时 -->
                        <span class="text-danger pointer" v-if="x.orderState==3&&(x.currentTime-x.updateTime)-x.deliveryDays*86400000>=0" @click="contactCustomer.isShowCustomerDialog = true">联系客服</span>
                    </div>
                    <div><span class="text-success" v-if="x.orderState>=6&&x.orderState<8">交易成功</span></div>
                </div>
            </div>
        </div>
        <delivery-dialog :seller-delivery="sellerDelivery" @renew-list="getList"></delivery-dialog>
        <contactCustomer :contactCustomer='contactCustomer'></contactCustomer>
    </div>
</template>

<script>
    import dayTimeCount from './dayTimeCount'
    import deliveryDialog from "./deliveryDialog.vue"
    import dayTimeOvertime from './dayTimeOvertime'
    import contactCustomer from './contactCustomerDialog.vue'
    export default {
        props: ['tableData'],
        created() {
        },
        components: {
            dayTimeCount,
            deliveryDialog,
            dayTimeOvertime,
            contactCustomer
        },
        data() {
            return {
                sellerDelivery: {
                    isShowDialog: false,
                    detailId: ''
                },
                contactCustomer: {
                    isShowCustomerDialog: false,
                },
            }
        },
        methods: {
            showDialog(i) {
                this.tableData.dialogShowType = true;
                this.$emit('show-dialog', i)
            },
            toDetail(x) {
                this.$router.push({
                    path: `/user-center/order-list/order-detail?id=${x.id}`,
                    query: {
                        orderType: 2,
                        tradingState: x.tradingState
                    }
                })
            },
            delivery(x){
                this.sellerDelivery.id = x.id;
                this.sellerDelivery.detailId = x.detailId;
                this.sellerDelivery.isShowDialog = true
                window.sendSuccess.num = x.orderNo
                window.sendSuccess.id = x.id
            },
            getList(){
                this.$emit('get-list');
            },
            remindDelivery(x,v){
            this.$ajax.post('/basemall-shop/shop-order/remind',{
                id: x.id,
                field: v
            }).then(((res)=>{
                this.getList();
            }));
        }
        }
    }
</script>

<style lang="less" scoped>
    .m-l-xs {
        margin-left: 5px;
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .pointer {
        cursor: pointer;
    }

    .list-item {
        width: 100%;
        border: 1px solid #ebebeb;
        font-size: 12px;
        margin-bottom: 10px;
        div {
            box-sizing: border-box;
        }
        .m-l {
            margin-left: 25px;
        }
        .head {
            padding: 20px;
            background: #F5F8FB;
            color: #666;
            .remarks {
                line-height: 21px;
                margin-right: 21px;
                padding: 0px;
                color: rgb(22, 80, 162);
                .warning {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                    background: url('/static/img/user/icon-warning.png') no-repeat center center;
                }
            }
        }
        .detail {
            display: flex;
            align-items: center;
            height: 121px;
            .left {
                flex: 1;
                &>div {
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    border-right: 1px solid #ebebeb;
                    &:first-child {
                        border-bottom: 1px solid #ebebeb;
                    }
                    .cell {
                        width: 30%;
                        max-width: 30%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        float: left;
                        padding-left: 20px;
                        .status {
                            font-size: 14px;
                        }
                        &:last-child {
                            width: 40%;
                            max-width: 40%;
                        }
                        &.c7 {
                            width: 70%;
                            max-width: 70%;
                        }
                    }
                }
            }
            .right {
                width: 146px;
                text-align: center;
                &>div {
                    margin-bottom: 10px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>
