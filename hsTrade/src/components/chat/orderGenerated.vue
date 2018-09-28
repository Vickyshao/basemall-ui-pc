<template>
    <div class="publishSuc order">
        <div class="details">
            <div class="icoSuc">订单已生成</div>
            <div class="tip">请在指定时间内完成付款</div>
            <div class="btns">
                <button @click="toPay">支付定金</button>
                <button @click="toperchase">继续采购</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['orderData'],
        data() {
            return {
            }
        },
        created() {
        },
        methods: {
            toPay(){
                this.$router.push({
                    path: `/user-center/order-list/order-detail?id=${this.orderData.orderId}&orderType=${this.orderData.orderType}`
                })
            },
            toperchase(){
                this.$router.push({
                    path: `/supply/list`
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../less/quickRelease.less";
    .order {
        padding-top: 120px;
        margin-top: 40px;
        padding-bottom: 225px;
        .tip {
            font-size: 18px;
            color: #666;
            margin: 20px auto 52px;
        }
    }
</style>


