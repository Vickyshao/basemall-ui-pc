<template>
    <div class="orderStatus">
        <div class="title">当前阶段：
            <span v-if="info.orderState<=2" class="colorBlack">待付款</span>
            <span v-if="info.orderState<=3" class="colorBlack">待付尾款</span>
            <div class="curStatus">订单状态：
                <span v-if="info.orderState<=2" class="colorRed">待付款</span>
                <span v-if="info.orderState<=3" class="colorRed">待付尾款</span>
            </div>
        </div>
        <div class="cnt">
            支付金额：<span class="colorRed"><em class="num">3000.00</em> 元</span>
            <div class="btns">
                <button class="btn_deliverGoods" @click="deliverGoods">立即支付</button>
            </div>
            <div class="remainTime">
                您还有<span class="colorRed">3天23小时23分6秒</span>来付款。</div>
        </div>
    </div>
</template>

<script>
    export default {
        created() {},
        components: {},
        data() {
            return {

            };
        },
        methods: {
            deliverGoods() {
                console.log('deliverGoods');

            },
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
                    button {
                        width: 114px;
                        height: 40px;
                        line-height: 40px;
                        color: #fff;
                        background: #ff0000;
                        font-size: 17px;
                        border-radius: 4px;
                        &.btn_deliverGoods {
                            background: #1650a2;
                        }
                    }
                }
                .remainTime {
                    height: 22px;
                    color: #666;
                    margin-top: 25px;
                    background: url('/static/img/user/sigh.png') no-repeat left center;
                    padding-left: 30px;
                    line-height: 24px;
                }
            }
        }
    }
</style>
