<template>
    <div class="orderStatus">
        <div class="title">当前阶段：<span class="colorBlack" v-if="info.orderState<=1">待付定金</span>
            <span class="colorBlack" v-if="info.orderState<3 && info.orderState>=2">待付尾款</span>
            <div class="curStatus">订单状态：<span class="colorRed">待付款</span> </div>
        </div>
        <div class="cnt">
            支付金额：<span class="colorRed"><em class="num">{{paidAmount|toDoubleThousands}}</em> 元</span>
            <div class="btns" v-if="orderType==1">
                <el-button type="primary" class="toPay" v-if="info.orderState==1" @click="toPay()" :disabled="info.isLocked==1">立即支付</el-button>
                <el-button type="primary" :class="{toPay:!!borrowStatus&&borrowStatus==3}" v-if="info.orderState>=2" :disabled="(!!borrowStatus && borrowStatus!=3) || info.borrowStatus!=3 || info.isLocked==1" @click="toPay()">{{(!!borrowStatus&&borrowStatus!=3) || info.borrowStatus!=3?'融资中':'立即支付'}}</el-button>
            </div>
            <div class="remainTime" v-if="orderType==1">
                <div class="inline-block" v-if="info.orderState <= 2">
                    <remain-time :time="time"></remain-time>
                </div>
                <!-- <div class="inline-block" v-if="info.orderState > 1 && info.orderState <= 2">
                    <div class="inline-block sigh" v-if="pendingPay / 86400000 <= 3">
                            您还剩<span class="colorRed">{{pendingDelivery|remainTime}}</span>来付款。
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import remainTime from './remainTime.vue'
    export default {
        props: ['info'],
        created() {
            if (this.$route.query.orderType == 1 && (this.info.orderState > 1 && this.info.orderState <= 2)) {
                this.paid();
            }
        },
        components: {
            remainTime
        },
        data() {
            return {
                orderType: this.$route.query.orderType,
                amountPaid: null,
                ratio: null,
                time: this.info,
                borrowStatus: this.$route.query.borrowStatus
            };
        },
        methods: {
            toPay() {
                this.$router.push({
                    path: `/user-center/order-list/order-pay?id=${this.$route.query.id}&orderType=${this.$route.query.orderType}`,
                })
            },
            paid() {
                this.$ajax.get(`/basemall-fax/trade-bill/query-trade-bill-radio?shopOrderId=${(this.$route.query.id*1)}`)
                    .then((res) => {
                        this.amountPaid = res.amountPaid;
                        this.ratio = res.ratio;
                    });
            },
        },
        computed: {
            // pendingPay() {
            //     return this.info.currentTime * 1 - this.info.createTime * 1;
            // },
            pendingDelivery() {
                // return this.info.currentTime * 1 - this.info.updateTime * 1;
                return this.info.deliveryTime + this.info.updateTime - this.info.currentTime;
            },
            paidAmount() {
                return this.info.orderState==1 ? this.info.totalAmount :this.info.tailAmount;;
            }
        }
    };
</script>

<style lang="scss" scoped>
    $blueColor: #f5f8fb;
    $darkBlueColor: #1952a3;
    .orderlist-wrapper {
        background: #f1f1f1;
        padding-bottom: 36px;
        .orderStatus {
            width: 85%;
            margin: 38px auto 0;
            border: 1px solid #ebebeb;
            .colorRed {
                color: #ff0000;
            }
            .colorBlack {
                color: #000;
            }
            .title {
                height: 52px;
                line-height: 52px;
                background: #f5f8fb;
                border-bottom: 1px solid #ebebeb;
                padding: 0 43px;
                font-size: 14px;
                color: #666;
                .curStatus {
                    float: right;
                }
            }
            .cnt {
                background: #fff;
                font-size: 14px;
                color: #000;
                padding: 43px;
                .num {
                    font-size: 24px;
                }
                .btns {
                    width: 100%;
                    display: inline-table;
                    margin-top: 31px;
                }
                .remainTime {
                    height: 22px;
                    color: #666;
                    margin-top: 25px;
                    line-height: 24px;
                    .inline-block {
                        display: inline-block;
                    }
                    .sigh {
                        padding-left: 30px;
                        background: url('/static/img/user/sigh.png') no-repeat left center;
                    }
                }
            }
        }
    }
</style>
