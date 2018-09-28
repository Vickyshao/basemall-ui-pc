<template>
    <div class="capital-list">
        <div class="head" v-if="$store.state.userData.userType==1">
            <p class="fl">交易记录</p>
            <span class="fl" style="font-size:12px;margin:0 14px 0 38px">时间</span>
            <date-range-picker class="fl" @date-changed="dateChanged"></date-range-picker>
            <span class="fl" style="font-size:12px;margin:0 14px 0 38px">交易类型</span>
            <el-select class="fl" v-model="tableData.tradeCode" @change="changeType" placeholder="请选择交易类型">
                <el-option label="全部" value="0"></el-option>
                <el-option label="充值" value="1"></el-option>
                <el-option label="供求" value="2"></el-option>
                <!-- <el-option label="收益" value="3"></el-option> -->
                <!-- <el-option label="供求冻结" value="4"></el-option> -->
                <el-option label="提现" value="5"></el-option>
                <!-- <el-option label="回款" value="6"></el-option> -->
                <el-option label="还款" value="6"></el-option>
            </el-select>
        </div>

        <div class="head" v-if="$store.state.userData.userType==3">
            <p class="fl" style="line-height:1">我的投资</p>
        </div>

        <div v-loading="tableData.loading" v-nodata="!tableData.total">
            <table class="table" v-if="$store.state.userData.userType==1">
                <thead>
                    <tr>
                        <th>交易时间</th>
                        <th>发起账户</th>
                        <th>用途</th>
                        <th>交易类型</th>
                        <th>交易状态</th>
                        <th>收支</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="x in tableData.list">
                        <td>{{x.createTime}}</td>
                        <td>{{info.bankName}}结算账户（<span class="text-gray">{{info.bankAccount|subStrBankNo}}</span>）</td>
                        <td>{{x.tradeType==2?"买入":x.tradeType==1?"卖出":x.tradeType==3?"提现":x.tradeType==4?"充值":x.tradeType==5?"还款":"-"}}</td>
                        <td>{{x.tradeCode==1?"充值":x.tradeCode==2?"供求":x.tradeCode==3?"收益":x.tradeCode==4?"供求冻结":x.tradeCode==5?"提现":x.tradeCode==6?"还款":"-"}}</td>
                        <td>{{x.status==1?"交易成功":x.status==2?"冻结":x.status==3?"交易失败":"-"}}</td>
                        <td>{{x.tradeType==1||x.tradeType==4?'+':'-'}}{{x.amount|toDoubleThousands}}</td>
                    </tr>
                </tbody>
            </table>

            <table class="table" v-if="$store.state.userData.userType==3">
                <thead>
                    <tr>
                        <th>产品名称</th>
                        <th>历史年化收益率</th>
                        <th>期限</th>
                        <th>待收本金（元）</th>
                        <th>待收收益（元）</th>
                        <th>预计收益到账日</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="x in tableData.list">
                        <td><span class="text-href" @click="jumpToDetail(x)">{{x.borrowTitle}}</span></td>
                        <td>{{x.annualFinancingRate}}%</td>
                        <td>{{x.borrowTimeLimit}}天</td>
                        <td>{{x.dealMoney|toDoubleThousands}}</td>
                        <td>{{x.expectedEarnings|toDoubleThousands}}</td>
                        <td>{{x.expectedExpirationTime}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <pagination v-if="!!tableData.total" :page-data="tableData" @page-changed="pageChanged"></pagination>

    </div>
</template>
<script>
import pagination from '@/components/common/pagination'
import dateRangePicker from '@/components/common/dateRangePicker'

export default {
    created(){
        this.userType=this.$store.state.userData.userType;
        this.getList()
    },
    props:['info'],
    components:{
        pagination,
        dateRangePicker
    },
    data(){
        return{
            userType:null,
            tableData:{
                loading:false,
                pageIndex:1,
                pageSize:10,
                beginTime:null,
                endTime:null,
                tradeCode:"0",
                reqType:1,
                total:0,
                list:[]
            }
        }
    },
    methods: {
        beforeRequest(){
            this.tableData.loading=true;
            this.tableData.list=[];
            this.tableData.total=0;
            let data={
                pageIndex:this.tableData.pageIndex,
                pageSize:this.tableData.pageSize
            };
            if(this.userType==1){
                data.beginTime=this.tableData.beginTime;
                data.endTime=this.tableData.endTime;
                data.tradeCode=this.tableData.tradeCode=='0'?null:parseInt(this.tableData.tradeCode)
            };
            return data
        },
        getList(){
            let time= new Date().getTime();
            let url=this.$store.state.userData.userType==1?`trade-bill/select-trade-bill?`+time:`account/my-account-by-investment?`+time;
            let data=this.beforeRequest();
            this.$ajax.post(`/basemall-fax/${url}`,data).then((res)=>{
                this.tableData.loading=false;
                this.tableData.list=res.tradeBillList||res.list;
                this.tableData.total=res.tradeBillCount||res.total;
            }).catch(()=>{
                this.tableData.loading=false
            })
        },
        dateChanged(date){
            this.tableData.pageIndex=1;
            this.tableData.beginTime=!!date?`${this.tools.formatDate(date[0])} 00:00:00`:null;
            this.tableData.endTime=!!date?`${this.tools.formatDate(date[1])} 23:59:59`:null;
            this.getList()
        },
        changeType(){
            this.tableData.pageIndex=1;
            this.getList()
        },
        pageChanged(pageIndex){
            this.tableData.pageIndex=pageIndex
            this.getList()
        },
        jumpToDetail(x){
            this.$router.push({
                path:`/finance/detail?borrowId=${x.id}`
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .capital-list{
        width: 100%;
        .fl{float:left;}
        .head{
            overflow: hidden;
            line-height: 40px;
            margin-bottom: 20px;
        }
    }
</style>
