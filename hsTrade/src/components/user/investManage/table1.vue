<template>
    <div v-loading="tableData.loading" v-nodata="!tableData.total">
        <table class="table proTbl" cellspacing="0">
            <thead>
                <tr>
                    <th>产品名称</th>
                    <th>投资日期</th>
                    <th>投资金额（元）</th>
                    <th>预计收益（元）</th>
                    <th>回款方式</th>
                    <th>投资状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(x,i) in tableData.list" :key="i">
                    <td><router-link class="text-href" :to="'/finance/detail?borrowId='+x.id">{{x.borrowTitle}}</router-link></td>
                    <td>{{x.createTime}}</td>
                    <td>{{x.dealMoney|toDoubleThousands}}</td>
                    <td>{{x.expectedEarnings|toDoubleThousands}}</td>
                    <td>{{x.repaymentStyle==1?"一次性还本息":"-"}}</td>
                    <td><span class="text-success">投资成功</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props:['tableData']
}
</script>
