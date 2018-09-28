<template>
    <div class="orderStatus">
        <div class="title">当前阶段：<span class="colorBlack">确认发货</span>
            <div class="curStatus">订单状态：<span class="colorRed">待确认收货</span> </div>
        </div>
        <div class="cnt">
            {{info.shopName}} {{info.shopCount}}{{info.meterUnit}} 至{{info.shippingAddress}}
            <div class="btns">
                <button class="btn_contactCustomer" @click="contactCustomer.isShowCustomerDialog = true">联系客服</button>
            </div>
        </div>
        <contactCustomer :contactCustomer='contactCustomer'></contactCustomer>
    </div>
</template>

<script>
    import contactCustomer from './contactCustomerDialog.vue'
    export default {
        props: ['info'],
        created() {},
        components: {contactCustomer},
        data() {
            return {
                pwd: '',
                contactCustomer: {
                    isShowCustomerDialog: false,
                },
            };
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
    $blueColor: #f5f8fb;
    $darkBlueColor: #1952a3;
    .orderlist-wrapper {
        background: #f1f1f1;
        padding-bottom: 36px;
        .orderStatus {
            width: 84%;
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
            }
        }
    }
</style>
