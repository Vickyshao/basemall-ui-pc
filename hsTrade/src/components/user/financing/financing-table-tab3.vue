<template>
    <div v-loading="tableData.loading" v-nodata="!tableData.total">

        <table class="table">
            <thead>
                <tr>
                    <th>订单号</th>
                    <th>融资占比</th>
                    <th>融资金额（元）</th>
                    <th>利率</th>
                    <th>融资期限</th>
                    <th>还款方式</th>
                    <th>申请时间</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(x,i) in tableData.list" :key="i">
                    <td>
                        <router-link class="text-href" :to="'/user-center/order-list/order-detail?id='+x.shopOrderId+'&orderType='+1+'&borrowStatus='+x.borrowStatus">{{x.borrowOrderNo}}</router-link>
                    </td>
                    <td>{{x.ratio*100}}%</td>
                    <td>{{x.borrowSum|toDoubleThousands}}</td>
                    <td>{{x.annualInterestRate}}%</td>
                    <td>{{x.borrowTimeLimit}}天</td>
                    <td>{{x.repaymentStyle==1?"一次性还清":x.repaymentStyle==2?"按月分期":x.repaymentStyle==3?"每月还息到期还本":"-"}}</td>
                    <td>{{x.createTime}}</td>
                    <td>
                        <span class="text-danger" v-if="x.borrowStatus==1">审核中</span>
                        <span class="text-success" v-if="x.borrowStatus==2">已审核</span>
                        <span class="text-disabled" v-if="x.borrowStatus==3">已驳回</span>
                        <span class="text-disabled" v-if="x.borrowStatus==4">已作废</span>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<script>

export default {
    props:['tableData'],
    methods:{

    }
}
</script>
<style lang="less" scoped>
    .fl{float:left;}
</style>
