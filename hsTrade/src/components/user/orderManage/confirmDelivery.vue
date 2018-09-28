<template>
    <div class="orderStatus">
        <div class="title">当前阶段：
            <span v-if="info.orderState>=5 && info.orderState<7" class="colorBlack">确认发货</span>
            <div class="curStatus">订单状态：<span class="colorRed">待确认收货</span> </div>
        </div>
        <div class="cnt">
            {{info.shopName}} {{info.shopCount}}{{info.meterUnit}} 至
            <view-address :options="{address:info.shippingAddress}"></view-address>
            <div class="inputPwd" v-if="orderType==1">
                支付密码：
                <el-input v-model="pwd" placeholder="" type="password" style="width:290px;"></el-input>
                <router-link to="/user-center/account-safety">　　忘记支付密码?</router-link>
            </div>
            <div class="btns">
                <el-button type="primary" v-if="orderType==1" class="btn_confirmReceipt" @click="confirmReceipt(5)" :disabled="this.info.isLocked==1">确认收货</el-button>
                <el-button type="primary" v-bind:class="{marLeft38: orderType==1}" class="btn_contactCustomer" @click="contactCustomer.isShowCustomerDialog = true" style="background: #ff0000;border:1px solid #ff0000;">联系客服</el-button>
            </div>
            <div v-if="orderType==1" class="tips">支付货款前，请再次确认收到的货物！</div>
        </div>
        <contactCustomer :contactCustomer='contactCustomer'></contactCustomer>
    </div>
</template>

<script>
    import contactCustomer from './contactCustomerDialog.vue'
    import viewAddress from '@/components/common/viewAddress'
    export default {
        props: ['info'],
        created() {
            this.orderType = this.$route.query.orderType;
        },
        components: {
            contactCustomer,viewAddress
        },
        data() {
            return {
                pwd: '',
                contactCustomer: {
                    isShowCustomerDialog: false,
                },

            };
        },
        methods: {
            confirmReceipt(state) {
                if(this.pwd!==''){
                    this.$ajax.post('/basemall-account/account/check-pay-password', {
                        payPassWord: this.pwd,
                    }).then((res) => {
                        this.deliverGoods(state);
                    });
                }else{
                     this.$message.warning('请输入支付密码');
                }
            },
            deliverGoods(state) {
                // this.$ajax.post('/basemall-fax/account/confirmationOfReceipt', {
                //     shopOrderId: this.$route.query.id,
                // }).then((res) => {
                    this.updateState(state);
                // });
            },
            updateState(state) {
                this.$ajax.post(`/basemall-shop/shop-order/update-state`, {
                    id: this.$route.query.id,
                    orderState: state+1,
                    tradingState: 4
                }).then(res => {
                    this.$message.success('您已验收成功');
                    this.$emit('get-info');
                    // this.$router.push({
                    //     path: '/user-center/order-list/delivery-suc'
                    // });
                });
            }
        }
    }
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
                    &.btn_contactCustomer {
                        background: #ff0000;
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
