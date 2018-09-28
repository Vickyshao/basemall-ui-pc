<template>
    <div v-loading="tableData.loading" v-nodata="!tableData.total">

        <table class="table repayMentTable">
            <thead>
                <tr>
                    <th><input type="checkbox" name="all" :checked="all" @change="checkall"></th>
                    <th>订单号</th>
                    <th>融资金额（元）</th>
                    <th>利率</th>
                    <th>融资期限</th>
                    <th>还款方式</th>
                    <th>待还本息（元）</th>
                    <th>满标时间</th>
                    <th>最后还款日</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(x,i) in tableData.list" :key="i">
                    <td><input type="checkbox" name="item" :checked="selectedId.includes(x.id)" @click="check($event,x)" :disabled="x.allowablePayment!='true'||x.repaymentStatus==2"></td>
                    <td><router-link class="text-href" :to="'/user-center/order-list/order-detail?id='+x.shopOrderId+'&orderType='+1">{{x.borrowOrderNo}}</router-link></td>
                    <td>{{x.borrowSum|toDoubleThousands}}</td>
                    <td>{{x.annualInterestRate}}%</td>
                    <td>{{x.borrowTimeLimit}}天</td>
                    <td>{{x.repaymentStyle==1?"一次性还清":x.repaymentStyle==2?"按月分期":x.repaymentStyle==3?"每月还息到期还本":"-"}}</td>
                    <td>{{x.repaymentAmount|toDoubleThousands}}</td>
                    <td>{{x.createTime}}</td>
                    <td>{{x.repaymentTime}}</td>
                    <td>
                        <div>
                            <span class="text-href" @click="toDetail(x)">查看详情</span>
                            <p style="height:5px"></p>
                            <el-button type="primary" size="mini" v-if="x.repaymentStatus==1||x.repaymentStatus==4" :disabled="x.allowablePayment!='true'" @click="toRepayment(x)">立即还款</el-button>
                            <span class="text-disabled" v-if="x.repaymentStatus==2">已还款</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <el-button type="primary" style="margin-top:15px" v-if="tableData.list.length>0" :disabled="selectedId.length<2" @click="batchRepayment">合并付款</el-button>

    </div>
</template>
<script>

export default {
    props:['tableData'],
    created(){
        sessionStorage.removeItem('_frcpd')
    },
    data(){
        return{
            all:false,
            selectedId:[],
            selectedItems:[]
        }
    },
    methods:{
        isAll(){
            let a=document.querySelectorAll('.repayMentTable tbody [type="checkbox"]').length;
            let b=document.querySelectorAll('.repayMentTable tbody [type="checkbox"]:checked').length;
            this.all=a===b;
        },
        checkall(e){
            this.all=!this.all;
            let selectedId=new Set([...this.selectedId]);
            let selectedItems=new Set([...this.selectedItems]);
            if(this.all){
                this.tableData.list.forEach((x,i)=>{ 
                    if(x.allowablePayment=='true'&&x.repaymentStatus!==2){
                        selectedId.add(x.id);
                        selectedItems.add(x);
                    }
                });
            }else{
                this.tableData.list.forEach(x=>{ 
                    selectedId.delete(x.id);
                    selectedItems.delete(x);
                });
            };
            this.selectedId=Array.from(selectedId);
            this.selectedItems=Array.from(selectedItems);
        },
        check(e,x){
            this.isAll();
            let selectedId=new Set([...this.selectedId]);
            let selectedItems=new Set([...this.selectedItems]);
            if(e.target.checked){ 
                selectedId.add(x.id);
                selectedItems.add(x);
            } else{ 
                selectedId.delete(x.id);
                selectedItems.delete(x);
            };
            this.selectedId=Array.from(selectedId);
            this.selectedItems=Array.from(selectedItems);
        },
        toRepayment(x){
            sessionStorage.setItem('_frcpd',JSON.stringify([x]));
            this.$router.push({path:`/user-center/financing-repayment`})
        },
        batchRepayment(){
            sessionStorage.setItem('_frcpd',JSON.stringify(this.selectedItems));
            this.$router.push({path:`/user-center/financing-repayment`})
        },
        toDetail(x){
            sessionStorage.setItem('_frcpd',JSON.stringify([x]));
            this.$router.push({path:`/user-center/financing-detail?id=${x.repaymentId}&status=${x.allowablePayment}`})
        }
    },
    computed:{
        pageIndex(){
            return this.tableData.pageIndex
        }
    },
    watch:{
        pageIndex(val){
            this.all=false
        }
    }
}
</script>
<style lang="less" scoped>
    .fl{float:left;}
    .table{
        thead tr th,tbody tr td{
            font-size: 13px;
            padding-right: 0;
            &:last-child{
                padding-right: 10px;
            }
        }
    }
</style>
