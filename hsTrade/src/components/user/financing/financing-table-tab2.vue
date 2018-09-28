<template>
    <div v-loading="tableData.loading" v-nodata="!tableData.total">

        <table class="table">
            <thead>
                <tr>
                    <th>融资标的</th>
                    <th>融资金额（元）</th>
                    <th>利率</th>
                    <th>融资期限</th>
                    <th>还款方式</th>
                    <th>成立时间</th>
                    <th>结束时间</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(x,i) in tableData.list" :key="i">
                    <td>
                        <router-link class="text-href" :to="'/finance/detail?borrowId='+x.id">{{x.borrowTitle}}</router-link>
                    </td>
                    <td>{{x.borrowSum|toDoubleThousands}}</td>
                    <td>{{x.annualInterestRate}}%</td>
                    <td>{{x.borrowTimeLimit}}天</td>
                    <td>{{x.repaymentStyle==1?"一次性还清":x.repaymentStyle==2?"按月分期":x.repaymentStyle==3?"每月还息到期还本":"-"}}</td>
                    <td>{{x.verifyTrialTime}}</td>
                    <td>
                        <span>{{x.endTenderTime|formatTime("YMD")}}</span>
                    </td>
                    <td>
                        <div class="process" :class="{success:x.borrowStatus==5||x.borrowStatus==6,fail:x.borrowStatus==7}">
                            <el-progress :percentage="Math.floor((x.tenderSum/x.borrowSum)*100)"></el-progress>
                            <p class="m-t text-danger" v-if="x.borrowStatus==5">募集中</p>
                            <p class="m-t" v-if="x.borrowStatus==6">募集完成</p>
                            <p class="m-t text-disabled" v-if="x.borrowStatus==7">募集失败</p>
                        </div>
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
        toDetail(id){
            this.$router.push({path:`/user-center/financing-detail/${id}`})
        }
    }
}
</script>
<style lang="less" scoped>
    .fl{float:left;}
    .m-t{
        margin-top: 10px;
    }
    .table{
        tbody{
            td:last-child{
                width: 90px;
                max-width: 90px;
            }
        }
    }
</style>
