<template>
    <div class="recharge-wrapper">
        <div v-if="!status.paySuccess">
            <div class="recharge-banks">
                <div class="recharge-banks-tab clear">
                    <div class="recharge-banks-tab__item" :class="{active:banksTab==1}" @click="banksTab=1">网银支付</div>
                    <div class="recharge-banks-tab__item" :class="{active:banksTab==2}" @click="banksTab=2">企业网银</div>
                </div>
                <div class="recharge-banks-list clear">
                    <div class="recharge-banks-list__item" :class="{active:bank.id==x.id}" v-for="x in banks" @click="choseBank(x)">{{x.name}}</div>
                </div>
            </div>

            <div class="input-group clear">
                <label class="text-gray">充值金额：</label>
                <div class="input">
                    <el-input v-model="amount"></el-input>
                </div>
            </div>

            <div class="input-group clear">
                <label class="text-gray">备注：</label>
                <div class="input">
                    <el-input type="textarea"></el-input>
                </div>
            </div>

            <div class="input-group clear">
                <el-button class="recharge_btn" type="primary" @click="pay">充值</el-button>
            </div>
        </div>

        <div class="pay-success" v-if="status.paySuccess">
            <div class="top clear">
                <p>充值成功</p>
            </div>
            <p>充值金额：{{this.amount|toDoubleThousands}}元</p>
            <p>充值时间：{{new Date().getTime()|formatTime("YMDHMS")}}</p>
            <div class="bottom">
                <el-button type="primary" style="font-size:18px" @click="(status.paySuccess=false,status.tab='2')">查看资金明细</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['status'],
    data(){
        return{
            banksTab:1,
            paySuccess:false,
            amount:'',
            bank:{
                id:1,
                name:"中国银行"
            },
            banks:[{
                id:1,
                name:"中国银行"
            },{
                id:2,
                name:"建设银行"
            }]
        }
    },
    methods:{
        choseBank(x){
            this.bank={...x}
        },
        pay(){
            if(this.amount==''){
                this.$message.warning('请输入充值金额！')
            }else if(!/^\d+(\.\d{1,2})?$/.test(this.amount)){
                this.$message.warning('充值金额为非负整数或保留小数点后两位！')
            }else{
                this.$ajax.post(`/basemall-fax/account/net-silver-recharge`,{
                    rechargeMoney:this.amount
                }).then((res)=>{
                    this.status.paySuccess=true
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .recharge-wrapper{
        .recharge-banks{
            .recharge-banks-tab{
                .recharge-banks-tab__item{
                    float: left;
                    font-size: 16px;
                    color: #666;
                    height: 70px;
                    line-height: 70px;
                    padding: 0 70px;
                    border-right: 1px solid #ebebeb;
                    border-top: 1px solid #ebebeb;
                    box-sizing: border-box;
                    cursor: pointer;
                    &:first-child{
                        border-left: 1px solid #ebebeb;
                    }
                    &.active{
                        background: #f5f8fb;
                        color: #1650a2;
                        border-bottom: 2px solid #1650a2;
                    }
                }
            }
            .recharge-banks-list{
                border: 1px solid #ebebeb;
                padding: 20px 0 0 20px;
                .recharge-banks-list__item{
                    width: 164px;
                    height: 50px;
                    border: 2px solid #ebebeb;
                    box-sizing: border-box;
                    float: left;
                    margin: 0 20px 20px 0;
                    position: relative;
                    cursor: pointer;
                    line-height: 50px;
                    text-align: center;
                    &.active{
                        border-color: #ff8300;
                        &:before{
                            position: absolute;
                            right: 0;
                            top: 0;
                            content: "";
                            border: 10px solid #ff8300;
                            border-left-color: transparent;
                            border-bottom-color: transparent;
                        }
                        &:after{
                            content: "√";
                            position: absolute;
                            right: 0;
                            top: 0;
                            font-size: 12px;
                            line-height: 1;
                            color: #fff;
                        }
                    }
                }
            }
        }
        .input-group{
            line-height: 40px;
            margin-top: 20px;
            label,.input{
                float: left;
            }
            label{
                width: 90px;
            }
            .input{
                width: 292px;
            }
        }
        .recharge_btn{
            float: left;
            margin-left: 90px;
        }
        .pay-success{
            text-align: center;
            padding-top: 80px;
            .top{
                padding-left: 80px;
                background: url(/static/img/user/payment@2x.png) no-repeat left top;
                background-size: auto 55px;
                display: inline-block;
                text-align: left;
                font-size: 30px;
                line-height: 55px;
                height: 55px;
                margin-bottom: 20px;
            }
            &>p{
                color: #666;
                font-size: 16px;
                margin-bottom: 10px;
            }
            .bottom{
                margin-top: 30px;
                margin-bottom: 50px;
            }
        }
    }
</style>
