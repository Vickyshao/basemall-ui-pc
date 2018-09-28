<template>
    <div class="capital-info" v-loading="loading">
        <div class="top clear">
            <p class="fl">{{info.corpName}}</p>
            <span class="fl tag" v-if="!!state">已认证</span>
        </div>
        <div class="line"></div>
        <p class="text-gray">可用金额</p>
        <div class="balance text-danger clear">
            <div class="amount fl">{{info.availableMoney|toDoubleThousands}}<span>元</span></div>
            <el-button type="primary" class="fl recharge_btn" @click="moneyOperate(1)">充值</el-button>
            <el-button plain class="fl cash_btn" @click="moneyOperate(2)">提现</el-button>
        </div>
        <div class="bank">
            {{info.bankName}}结算账户（<span class="text-gray">{{info.bankAccount|subStrBankNo}}</span>）
        </div>
        <div class="income clear">
            <!-- <div>
                <span class="text-gray">隔夜收益</span>
                <span class="text-danger" style="font-size:20px">23.10</span>
                <span class="text-danger">元</span>
            </div> -->
            <div>
                <span class="text-gray">账户总额</span>
                <span class="text-danger" style="font-size:20px">{{info.availableMoney*1 + info.unavailableMoney*1|toDoubleThousands}}</span>
                <span class="text-danger">元</span>
            </div>
            <div class="unavailable">
                <span class="splitter"> | </span>
                <span class="text-gray">冻结资金</span>
                <span style="font-size:20px">{{info.unavailableMoney|toDoubleThousands}}</span>
                <span>元</span>
            </div>
        </div>
        <total :info="{a:info.mrTotalAmount,b:info.mcTotalAmount}"></total>
    </div>
</template>
<script>
import total from './capital-total.vue'

export default {
    props:['infoData'],
    components:{total},
    methods: {
        moneyOperate(type){
            this.$router.push({
                path:type==1?'/user-center/recharge':'/user-center/present'
            })
        }
    },
    computed:{
        loading(){
            return this.infoData.loading
        },
        state(){
            return this.infoData.state
        },
        info(){
            return this.infoData.info
        }
    }
}
</script>

<style lang="scss" scoped>
    .fl{float:left;}
    .text-gray{font-size:14px;}
    .capital-info{
        width: 100%;
        font-size: 14px;
        .top{
            line-height: 18px;
            p{
                font-size: 18px;
            }
            .tag{
                border: 1px solid #36af35;
                color: #36af35;
                padding: 0 2px;
                margin-left: 15px;
            }
        }
        .line{
            width: 100%;
            border-bottom: 1px solid #ebebeb;
            margin: 26px 0 37px;
        }
        .balance{
            font-size: 32px;
            .recharge_btn,.cash_btn{width:120px;margin:0;}
            .recharge_btn{
                margin: 0 43px 0 75px;
            }
        }
        .bank{
            font-size: 16px;
            margin: 34px 0 46px;
        }
        .income{
            &>div{
                float: left;
                // &:first-child{
                //     padding-right: 28px;
                //     position: relative;
                //     &:after{
                //         content:"";
                //         position: absolute;
                //         right:0;
                //         bottom: 3px;
                //         width: 1px;
                //         height: 14px;
                //         background: #333;
                //     }
                // }
                &:last-child{
                    padding-left: 28px;
                    .splitter {
                        display: inline-block;
                        margin-right: 22px;
                    }
                }
            }
        }
    }
</style>
