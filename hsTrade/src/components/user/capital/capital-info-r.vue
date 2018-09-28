<template>
    <div v-loading="loading">
        <div class="capital-info clear">
            <div class="left fl">
                <div class="top clear">
                    <span class="fl">您好，{{$store.state.userData.username|subStrMobile}}</span>
                    <div class="icons fl">
                        <img class="fl" src="/static/img/user/phone_1@2x.png">
                        <!-- <img class="fl" src="/static/img/user/phone_2@2x.png"> -->
                        <img class="fl" src="/static/img/user/card_1@2x.png">
                        <!-- <img class="fl" src="/static/img/user/card_2@2x.png"> -->
                        <img class="fl" src="/static/img/user/password_1@2x.png">
                        <!-- <img class="fl" src="/static/img/user/password_2@2x.png"> -->
                    </div>
                </div>
                <div class="bottom">
                    <div class="left">
                        <p style="font-size:26px;margin-bottom:10px">{{info.allMoney|toDoubleThousands("thousand")}}</p>
                        <p class="text-gray">资产总额（元）</p>
                    </div>
                    <div class="right">
                        <ul class="clear">
                            <li class="fl">
                                <span class="fl text-gray">待收收益（元）</span>
                                <span class="fr text-danger">{{info.waitRepossessedInterest|toDoubleThousands}}</span>
                            </li>
                            <li class="fl">
                                <span class="fl text-gray">待收本金（元）</span>
                                <span class="fr">{{info.waitRepossessedCapital|toDoubleThousands}}</span>
                            </li>
                            <li class="fl">
                                <span class="fl text-gray">冻结金额（元）</span>
                                <span class="fr">{{info.unavailableMoney|toDoubleThousands}}</span>
                            </li>
                            <li class="fl">
                                <span class="fl text-gray">可用余额（元）</span>
                                <span class="fr">{{info.availableMoney|toDoubleThousands}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="right fr">
                <p class="text-danger" style="font-size:26px;margin:62px 0 10px 0">{{info.availableMoney|toDoubleThousands}}</p>
                <p class="text-gray" style="margin-bottom:62px">可用余额（元）</p>
                <div class="clear btns">
                    <el-button type="primary" class="fl recharge_btn" @click="moneyOperate(1)">充值</el-button>
                    <el-button plain class="fr cash_btn" @click="moneyOperate(2)">提现</el-button>
                </div>
            </div>

        </div>

        <total :info="{a:info.payInvestmentAmount,b:info.getInterest}"></total>
    </div>
</template>
<script>
import total from './capital-total.vue'
export default {
    props:['infoData'],
    components:{
        total
    },
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
        info(){
            return this.infoData.info
        }
    }
}
</script>

<style lang="scss" scoped>
    $border-color:#ebeef5;
    .fl{float:left;}
    .fr{float:right;}
    .capital-info{
        width: 100%;
        &>.left{
            width: 558px;
            border: 1px solid $border-color;
            .top{
                height: 62px;
                line-height: 62px;
                border-bottom: 1px solid $border-color;
                padding-left: 20px;
                .icons{
                    padding-top: 15px;
                    margin-left: 20px;
                    img{
                        margin-right: 6px;
                    }
                }
            }
            .bottom{
                padding: 36px 0;
                height: 128px;
                display: table;
                &>.left{
                    display: table-cell;
                    vertical-align: middle;
                    width: 224px;
                    text-align: center;
                    border-right: 1px solid $border-color;
                    p{
                        line-height: 1;
                    }
                }
                &>.right{
                    display: table-cell;
                    vertical-align: middle;
                    ul{
                        padding-left: 40px;
                        li{
                            width: 244px;
                            line-height: 34px;

                        }
                    }
                }
            }
        }
        &>.right{
            width: 280px;
            height: 271px;
            border: 1px solid $border-color;
            text-align: center;
            &>p{
                line-height: 1;
            }
            .btns{
                width:242px;
                padding-left: 19px;
                .recharge_btn,.cash_btn{
                    width: 110px;
                }
            }
        }
    }
</style>
