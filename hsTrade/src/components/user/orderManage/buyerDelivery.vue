<template>
    <div class="orderStatus">
        <div class="title">当前阶段：
            <span v-if="info.orderState<2" class="colorBlack">支付尾款</span>
            <span v-if="info.orderState<5" class="colorBlack">等待发货</span>
            <span v-if="info.orderState>=5" class="colorBlack">已发货</span>
            <span v-if="info.orderState<5 && (parseInt(info.deliveryDays)*86400000)>=info.createTime" class="colorBlack">待发货</span>
            <!-- <span v-if="info.orderState<5 && (parseInt(info.deliveryDays)*86400000)<info.createTime" class="colorBlack">待发货（已超时）</span> -->
            <div class="curStatus">订单状态：
                <span v-if="info.orderState<5" class="colorRed">待发货
                <span class="color-red" v-if="(info.payTailTime+info.deliveryDays * 86400000)-info.currentTime<=0">(已超时)</span>
                </span>
                <span v-if="info.orderState>=5" class="colorRed">已发货</span>
            </div>
        </div>
        <div class="cnt">
            {{info.shopName}} {{info.shopCount}}{{info.meterUnit}} 至 <view-address :options="{address:info.shippingAddress}"></view-address>
            <div class="btns">
                <button class="btn_contactCustomer" @click="contactCustomer.isShowCustomerDialog = true">联系客服</button>
            </div>
            <div class="tips">您的货款已到监管账户，等待卖家发货。<!--<span class="colorRed">在您确认收到的货物之前，您的钱款不会支付给卖家。</span>--></div>
        </div>
        <contactCustomer :contactCustomer='contactCustomer'></contactCustomer>
    </div>
</template>

<script>
    import contactCustomer from './contactCustomerDialog.vue'
    import viewAddress from '@/components/common/viewAddress'
    export default {
        props: ['info'],
        created() {},
        components: {
            viewAddress,
            contactCustomer
        },
        data() {
            return {
                contactCustomer: {
                    isShowCustomerDialog: false,
                },
            };
        },
        methods: {},
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
                .inputPwd {
                    margin-top: 26px;
                }
                .btns {
                    width: 100%;
                    display: inline-table;
                    margin-top: 31px;
                    button {
                        width: 114px;
                        height: 40px;
                        line-height: 40px;
                        color: #fff;
                        background: #ff0000;
                        font-size: 17px;
                        border-radius: 4px;
                        &.btn_contactCustomer {
                            background: #ff0000;
                        }
                    }
                }
                .tips {
                    height: 22px;
                    color: #666;
                    margin-top: 25px;
                    background: url('/static/img/user/sigh.png') no-repeat left center;
                    padding-left: 30px;
                    line-height: 24px;
                    font-size: 14px;
                }
            }
        }
    }
</style>
