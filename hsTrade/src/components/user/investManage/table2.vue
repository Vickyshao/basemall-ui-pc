<template>
    <div v-loading="tableData.loading" v-nodata="!tableData.total">
        <table class="table proTbl" cellspacing="0">
            <thead>
                <tr>
                    <th>产品名称</th>
                    <th>投资日期</th>
                    <th>投资金额（元）</th>
                    <th>待收利息（元）</th>
                    <th>下次回款日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(x,i) in tableData.list" :key="i">
                    <td><span class="text-href" @click="toDetail(x)">{{x.borrowTitle}}</span></td>
                    <td>{{x.createTime}}</td>
                    <td>{{x.dealMoney|toDoubleThousands}}</td>
                    <td>{{x.expectedEarnings|toDoubleThousands}}</td>
                    <td>{{x.expectedExpirationTime}}</td>
                    <td><span class="text-href" @click="toDetail(x)">查看明细</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props:['tableData'],
    methods:{
        toDetail(x){
            sessionStorage.setItem('_idtl',JSON.stringify(x));
            this.$router.push({path:`/user-center/my-investment-detail?id=${x.id}`})
        }
    }
}
</script>
