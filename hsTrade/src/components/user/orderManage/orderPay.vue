<template>
    <div class="financing-repayment">
        <div v-if="!infos.paySuccess">
            <div class="head">订单号：{{infos.info.orderNo||'-'}}</div>
            <div class="group">
                <div class="item">
                    <div class="item-body">
                        <p>
                            <span class="text-gray">商品：</span>
                            <span>{{infos.info.shopName}}</span>
                        </p>
                        <p>
                            <span class="text-gray">阶段：</span>
                            <span v-if="infos.info.orderState<=1">待付定金</span>
                            <span v-if="infos.info.orderState<3 && infos.info.orderState>=2">待付尾款</span>
                        </p>
                        <p>
                            <span class="text-gray">应付金额：</span>
                            <span>{{infos.info.tailAmount | toDoubleThousands}}元</span>
                        </p>
                    </div>
                </div>
            </div>

            <el-tabs class="tab-border_bottom" v-model="payType" @tab-click="payTypeChanged">
                <el-tab-pane label="现金支付" name="1"></el-tab-pane>
                <el-tab-pane label="融资支付" name="2" v-if="infos.info.orderState < 3 && infos.info.orderState >= 2"></el-tab-pane>
            </el-tabs>

            <amount-pay :infos="infos" v-if="payType==1"></amount-pay>
            <financing-pay :infos="infos" v-if="payType==2"></financing-pay>
        </div>

        <div class="pay-success" v-if="payType==1&&infos.paySuccess">
            <div class="top clear">
                <p v-if="infos.info.orderState<=1">您已支付订单<span>{{infos.info.orderNo||'-'}}</span>的定金</p>
                <p v-if="infos.info.orderState<3 && infos.info.orderState>=2">您已支付订单<span>{{infos.info.orderNo||'-'}}</span>的尾款</p>
            </div>
            <p>交易金额：{{infos.amount | toDoubleThousands}}元</p>
            <p>交易时间：{{infos.date}}</p>
            <div class="bottom">
                <!-- <el-button type="primary" @click="outerLink(1)">查看详情</el-button> -->
                <el-button v-if="infos.info.orderState<=1" type="primary" @click="continuePay">支付尾款</el-button>
                <el-button v-if="infos.info.orderState<3 && infos.info.orderState>=2" type="primary" @click="deliveryGoods">提醒发货</el-button>
                <el-button class="write_btn" @click="continueBuy">继续采购</el-button>
            </div>
        </div>

        <div class="pay-success" v-if="payType==2&&infos.paySuccess">
            <div class="top clear">
                <p>融资申请成功</p>
            </div>
            <p>申请融资总额：{{infos.amount | toDoubleThousands}}元</p>
            <p>申请时间：{{infos.date}}</p>
            <p class="text-danger" style="font-size:12px">我们会在1-2个工作日内审核融资申请，请耐心等待</p>
            <div class="bottom">
                <!-- <el-button type="primary" @click="outerLink(2)">查看我的融资</el-button> -->
                <el-button type="primary" @click="outerLink(2)">查看详情</el-button>
                <el-button class="write_btn"  @click="continueBuy">继续采购</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import amountPay from './orderPay_amount'
    import financingPay from './orderPay_financing'
    export default {
        components: {
            amountPay,
            financingPay
        },
        created() {
            this.init();
        },
        data() {
            return {
                payType: '1',
                infos: {
                    paySuccess: false,
                    info: {},
                    amountPaid: null,
                    ratio: null,
                }
            }
        },
        methods: {
            init() {
                this.getAccount();
            },
            deliveryGoods(){
                var data={
                    id:this.$route.query.id,
                    field:0
                }
                this.$ajax.post('/basemall-shop/shop-order/remind',data).then((res)=> {
                    this.$router.push({
                        path:`/user-center/order-list`,
                    })
                }).catch((err) => {
                    this.V.$message.error('提醒发货失败');
                })
            },
            continuePay(){
                this.infos.paySuccess = false;
                if(window.hideUserAside){
                    window.hideUserAside.val = false
                }
                var id = this.$route.query.id;
                this.getAccount();
                this.$router.push({
                    path:`/user-center/order-list/order-pay?id=${id}&orderType=1`,
                })
            },
            continueBuy(){
                this.$router.push({
                    path: `/supply/list`
                })
            },
            getAccount() {
                let availableMoney;
                this.$ajax.get('/basemall-fax/account/my-account').then((res) => {
                    this.account = res;
                    availableMoney = this.account.account.availableMoney;
                    this.$ajax
                        .get(`/basemall-shop/shop-order/order?id=${this.$route.query.id}&t=${new Date().getTime()}`)
                        .then(res => {
                            this.infos.info = res[0];
                            this.infos.info.availableMoney = availableMoney;
                            if (this.$route.query.orderType==1 && (this.infos.info.orderState > 1 && this.infos.info.orderState <= 2)) {
                                this.paid();
                            }
                        });
                });
            },
            paid() {
                this.$ajax.get(`/basemall-fax/trade-bill/query-trade-bill-radio?shopOrderId=${(this.$route.query.id*1)}&t=${new Date().getTime()}`)
                    .then((res) => {
                        this.infos.amountPaid = res.amountPaid;
                        this.infos.ratio = res.ratio;
                    });
            },
            payTypeChanged() {

            },
            pay() {
                this.infos.paySuccess = true
            },
            outerLink(type) {
                let path = type == 1 ? 'order-list' : 'financing?tab=3' ;
                this.$router.push({
                    path: `/user-center/${path}`
                })
            }
        },
        computed: {
            amount() {
                return !!this.infos.amountPaid ? (this.infos.info.totalAmount - (this.infos.amountPaid * 1)) : this.infos.info.totalAmount;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .financing-repayment {
        padding-bottom: 50px;
        .head {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .group {
            margin-bottom: 20px;
            .item {
                border: 1px solid #1650A2;
                background: #F5F8FB;
                border-radius: 5px;
                overflow: hidden;
                .item-body {
                    padding: 30px;
                    p {
                        overflow: hidden;
                        margin-bottom: 20px;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        span {
                            float: left;
                        }
                    }
                }
            }
        }
        .pay-success {
            text-align: center;
            padding-top: 80px;
            margin: 0 auto;
            .top {
                padding-left: 80px;
                background: url(/static/img/user/payment@2x.png) no-repeat left top;
                background-size: auto 55px;
                display: inline-block;
                text-align: left;
                font-size: 29px;
                line-height: 55px;
                height: 55px;
                margin-bottom: 20px;
            }
            &>p {
                color: #666;
                font-size: 16px;
                margin-bottom: 10px;
                white-space: nowrap;
            }
            .bottom {
                margin-top: 30px;
                margin-bottom: 50px;
                .write_btn{
                    background: transparent;
                    border: 1px solid #1650a2;
                    color: #1650a2;
                }
            }
        }
    }
</style>
