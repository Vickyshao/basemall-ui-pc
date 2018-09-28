<template>
    <div class="financing-detail">
        <div class="area">
            <p style="font-size:24px">订单号：{{detail.borrowOrderNo}}</p>
        </div>
        <div class="title">
            <img src="/static/img/user/commodity@2x.png" height="26px">
            <p>商品信息</p>
        </div>
        <div class="area">
            <div>
                <p><span class="text-gray">名称：</span>{{detail.goodsName}}</p>
                <p><span class="text-gray">数量：</span>{{detail.shopCount}}</p>
            </div>
        </div>
        <div class="title">
            <img src="/static/img/user/financing@2x.png" height="26px">
            <p>融资信息</p>
        </div>
        <div class="area">
            <div>
                <p class="m-b"><span class="text-gray">融资比例：</span>{{detail.ratio}}%</p>
                <p class="m-b"><span class="text-gray">融资期限：</span>{{detail.borrowTimelimit}}天</p>
                <p class="m-b"><span class="text-gray">还款方式：</span>{{detail.repaymentStyle==1?"一次性还清":detail.repaymentStyle==2?"按月分期":detail.repaymentStyle==3?"每月还息到期还本":"-"}}</p>
                <p><span class="text-gray">融资总额：</span>{{detail.borrowSum|toDoubleThousands}}元</p>
                <p><span class="text-gray">融资利率：</span>{{detail.annualInterestRate}}%</p>
            </div>
        </div>
        <div class="title">
            <img src="/static/img/user/repayment@2x.png" height="26px">
            <p>还款计划</p>
        </div>
        <div class="area">
            <ul class="group-head">
                <li>预计还款日</li>
                <li>应还本金（元）</li>
                <li>应付利息（元）</li>
            </ul>
            <ul class="group-body">
                <li>{{detail.repaymentTime}}</li>
                <li>{{detail.repaymentPrincipal|toDoubleThousands}}</li>
                <li>{{detail.repaymentInterest|toDoubleThousands}}</li>
            </ul>
        </div>
        <div style="padding-top:50px;text-align:center">
            <el-button type="primary" style="width:40%;height:56px;font-size:16px" v-if="detail.allowablePayment=='true'" @click="toRepayment">立即还款</el-button>
            <el-button type="primary" disabled style="width:40%;height:56px;font-size:16px" v-if="detail.repaymentStatus==2">已还款</el-button>
        </div>
    </div>
</template>
<script>
export default {
    created(){
        this.getDetail()
    },
    data(){
        return{
            detail:{},
            status:true
        }
    },
    methods:{
        getDetail(){
            let id=parseInt(this.$route.query.id);
            this.status=this.$route.query.status;
            this.$ajax.get(`/basemall-fax/borrow-repayment/borrow-repayment-detail?repayMentId=${id}`).then((res)=>{
                this.detail=res
            })
        },
        toRepayment(){
            this.$router.push({path:`/user-center/financing-repayment`})
        }
    }
}
</script>

<style lang="less" scoped>
    .financing-detail{
        padding-bottom: 50px;
        .title{
            font-size: 18px;
            line-height: 26px;
            overflow: hidden;
            margin: 20px 0;
            img,p{
                float: left;
                margin-right: 10px;
            }
        }
        .area{
            border: 1px solid #ebebeb;
            background: #f5f8fb;
            padding: 30px;
            border-radius: 5px;
            &>div{
                overflow: hidden;
                width: 100%;
                &>p{
                    float: left;
                    width: 33.3333%;
                    &.m-b{
                        margin-bottom: 40px;
                    }
                }
            }
            .group-head,.group-body{
                overflow: hidden;
                text-align: center;
                display:flex;
                li{
                    flex:1;
                    box-sizing: border-box;
                }
            }
            .group-head{
                li{
                    line-height: 44px;
                    height: 44px;
                    background: #007dc9;
                    color: #fff;
                    &:nth-child(2){
                        background: #1650a2;
                    }
                }
            }
            .group-body{
                li{
                    border-right: 1px solid #1650a2;
                    border-bottom: 1px solid #1650a2;
                    height: 50px;
                    line-height: 50px;
                    &:first-child{
                        border-left: 1px solid #1650a2;
                    }
                }
            }
        }
    }
</style>
