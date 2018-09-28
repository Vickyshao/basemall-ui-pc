<template>
    <div class="orderStatus">
        <div class="title">当前阶段：<span class="colorBlack">等待发货</span>
            <div class="curStatus">订单状态：
                <span v-if="info.orderState<5" class="colorRed">待发货</span>
                <span v-if="info.orderState>=5" class="colorRed">已发货</span>
                <span v-if="leftTime<=0" class="colorRed">（已超时）</span>
            </div>
        </div>
        <div class="cnt">
            {{info.shopName}} {{info.shopCount}}{{info.meterUnit}} 至
            <view-address :options="{address:info.shippingAddress}"></view-address>
            <div class="btns">
                <el-button type="primary" class="btn_deliverGoods" :disabled="this.info.isLocked==1">发货</el-button>
            </div>
            <div class="remainTime" v-if="leftTime>0">
                您承诺的发货时间还剩
                <div class="times" id="remainTime">
                    <day-time-overtime class="fl color-red" :details="{'leftTime':leftTime}" v-if="info.orderState<5"></day-time-overtime>
                </div>
                <!-- 若未及时发货，系统将当作违约记录。 -->
            </div>
        </div>
        <delivery-dialog :seller-delivery="sellerDelivery" @renew-detail="getInfo"></delivery-dialog>
    </div>
</template>

<script>
    import deliveryDialog from "./deliveryDialog.vue"
    import viewAddress from '@/components/common/viewAddress'
    import dayTimeOvertime from "./dayTimeOvertime"
    export default {
        props: ['info'],
        created() {
        },
        components: {
            deliveryDialog,
            viewAddress,
            dayTimeOvertime
        },
        data() {
            return {
                sellerDelivery: {
                    isShowDialog: false,
                    detailId: this.info.detailId
                }
            };
        },
        methods: {
            getInfo(){
                this.$emit('get-info');
            }
        },
        computed: {
            leftTime(){
                return (this.info.deliveryDays*86400000-(this.info.currentTime-this.info.payTailTime))/1000;
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
                    // button {
                    //     width: 114px;
                    //     height: 40px;
                    //     line-height: 40px;
                    //     color: #fff;
                    //     background: #ff0000;
                    //     font-size: 17px;
                    //     border-radius: 4px;
                    //     &.btn_deliverGoods {
                    //         background: #1650a2;
                    //     }
                    // }
                }
                .remainTime {
                    height: 22px;
                    color: #666;
                    margin-top: 25px;
                    background: url('/static/img/user/sigh.png') no-repeat left center;
                    padding-left: 30px;
                    line-height: 24px;
                    .times {
                        display: inline-block;
                        line-height: 10px;
                        padding: 0 5px;
                    }
                }
            }
        }
    }
</style>
