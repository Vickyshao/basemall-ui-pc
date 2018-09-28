<template>
    <span>
        <span class="el-icon-time m-l-xs fl text-gray" style="font-size:16px;line-height:60px" v-if="time==0"></span>
        <span class="timeOver" v-if="time==0">已超时</span>
        <span v-if="time!=0">{{time|remainTime}}</span>
    </span>
</template>

<script>
    export default {
        props: ['details'],
        created() {
            // 待付款状态下：  当前时间 - 订单生成时间 > 3 ? 超时 : 未超时
            // 待付尾款状态下：当前时间 - 订单付款时间 > 3 ? 超时 : 未超时
            // 待发货状态下：  当前时间 - 订单付款时间 > 承诺发货时间 ？ 超时 ： 未超时
            !!this.details.currentTime ? this.details.currentTime : new Date().getTime();
            let pendingPay = (this.details.createTime + 3 * 86400000) - this.details.currentTime,
                pendingTail = (this.details.updateTime + 3 * 86400000) - this.details.currentTime,
                pendingDelivery = (this.details.payTailTime + this.details.deliveryDays * 86400000) - this.details.currentTime;
            if (this.details.orderState <= 1) {
                this.details.isOvertime = pendingPay <= 0 ? '超时' : pendingPay/1000;
            } else if (this.details.orderState > 1 && this.details.orderState <= 2) {
                this.details.isOvertime = pendingTail <= 0 ? '超时' : pendingTail/1000;
            } else if (this.details.orderState != 4 && (this.details.orderState >= 3 && this.details.orderState <= 5)) {
                this.details.isOvertime = pendingDelivery <= 0 ? '超时' : pendingDelivery/1000;
            }
            this.time = !!this.leftTime?this.leftTime:this.details.isOvertime;
            this.run();
        },
        data() {
            return {
                time: null,
                leftTime: this.details.leftTime,
            }
        },
        methods: {
            run() {
                let t = setTimeout(() => {
                    if (this.time > 0) {
                        --this.time;
                        clearTimeout(t);
                        this.run();
                    } else {
                        this.time = 0;
                        clearTimeout(t);
                    }
                }, 1000);
            },
        },
    }
</script>
<style lang="scss">
    .timeOver {
        color: red !important;
    }
</style>
