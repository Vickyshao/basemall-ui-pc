<template>
    <div class="investment-detail">
        <div class="title clear">投资明细
            <router-link class="back fr text-href" to="/user-center/my-investment?activeName=8">返回列表<i class="el-icon-arrow-right"></i></router-link>
        </div>

        <table class="table m-b">
            <thead>
                <tr>
                    <th>产品名称</th>
                    <th>历史年化收益率</th>
                    <th>期限</th>
                    <th>投资金额</th>
                    <th>收益方式</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{detail.borrowTitle}}</td>
                    <td>{{detail.annualFinancingRate}}%</td>
                    <td>{{detail.borrowTimeLimit}}天</td>
                    <td>{{info.dealMoney|toDoubleThousands}}元</td>
                    <td>{{detail.repaymentStyle==1?"一次性还本息":"-"}}</td>
                    <td>收益中</td>
                </tr>
            </tbody>
        </table>

        <table class="table m-b">
            <thead>
                <tr>
                    <th>期数</th>
                    <th>回款日</th>
                    <th>应收本金（元）</th>
                    <th>应收利息（元）</th>
                    <th>应收总额（元）</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>{{info.expectedExpirationTime||"-"}}</td>
                    <td>{{info.dealMoney|toDoubleThousands}}</td>
                    <td>{{info.expectedEarnings|toDoubleThousands}}</td>
                    <td>{{totalSum|toDoubleThousands}}</td>
                </tr>
                <tr>
                    <td>总计</td>
                    <td></td>
                    <td>{{info.dealMoney|toDoubleThousands}}</td>
                    <td>{{info.expectedEarnings|toDoubleThousands}}</td>
                    <td>{{totalSum|toDoubleThousands}}</td>
                </tr>
            </tbody>
        </table>

        <div class="bottom clear">
            <span class="fl text-href" @click="viewDeal">查看协议</span>
            <span class="fl text-href" @click="downloadDeal">下载协议</span>
        </div>

    </div>
</template>
<script>
export default {
    created(){
        this.getDetail();
        let info=sessionStorage.getItem('_idtl');
        this.info=info?JSON.parse(info):{};
    },
    data(){
        return{
            detail:{},
            info:{}
        }
    },
    methods:{
        getDetail(){
            this.$ajax.get(`/basemall-fax/borrow/select-borrow-detail?borrowId=${this.$route.query.id}`).then((res)=>{
                this.detail=res||{};
            })
        },
        viewDeal(){
            let newTab=window.open('about:blank');
            this.$ajax.post(`/basemall-fax/agreement/view`,{
                borrowId:this.$route.query.id*1,
                amount:this.info.dealMoney*1
            }).then((res)=>{
                newTab.location.href=res
            })
        },
        downloadDeal(){
            let host=localStorage.getItem('who')=='184'?'http://172.16.1.184':'',
                params={
                    borrowId:this.$route.query.id,
                    amount:this.info.dealMoney
                };
            window.open(`${host}/api/basemall-fax/agreement/download${this.tools.formatQueryParam(params)}`,'_blank')
        }
    },
    computed:{
        totalSum(){
            let dealMoney=this.info.dealMoney||0;
            let expectedEarnings=this.info.expectedEarnings||0;
            return dealMoney*1+expectedEarnings*1
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../../less/financingUser.less";
.investment-detail {
    .m-b{margin-bottom:30px;}
    .title{
        font-size: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebebeb;
        margin-bottom: 36px;
        .back{
            font-size: 14px;
        }
    }
    .bottom{
        span{
            line-height: 1;
            font-size: 14px;
        }
        span:first-child{
            padding-right: 10px;
        }
        span:last-child{
            padding-left: 10px;
            border-left: 1px solid #666;
        }
    }
}
</style>
