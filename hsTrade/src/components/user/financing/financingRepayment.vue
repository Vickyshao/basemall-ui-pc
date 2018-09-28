<template>
    <div class="financing-repayment">
        <div v-if="!paySuccess">
            <div class="group" v-for="(x,i) in items" :key="i">
                <div class="label" v-if="items.length>1">
                    <input type="checkbox" name="item-label" :checked="selected.includes(x)" @click="check($event,x)">
                </div>
                <div class="item" :class="{active:selected.includes(x)}">
                    <div class="item-head">订单号：{{x.borrowOrderNo}}</div>
                    <div class="item-body">
                        <p>
                            <span class="text-gray">支付类型：</span>
                            <span>融资还款</span>
                        </p>
                        <p>
                            <span class="text-gray">还款金额：</span>
                            <span>{{x.repaymentAmount|toDoubleThousands}}元</span>
                            <span>（本金：</span>
                            <span class="text-danger">{{x.borrowSum|toDoubleThousands}}元</span>
                            <span class="m-l">实际利息：</span>
                            <span class="text-danger">{{(x.repaymentAmount-x.borrowSum).toFixed(2)}}元</span>
                            <span class="m-l">实际借款天数：</span>
                            <span>{{x.borrowTimeLimit}}天）</span>
                        </p>
                    </div>
                </div>
            </div>

            <div style="padding:20px;border-bottom:1px solid #ebebeb">
                <span class="text-gray">账户余额：</span><span>{{balance|toDoubleThousands}}元</span>
                <p class="balanceNotEnough" style="padding-top:10px" v-show="balance<sum||!balance">
                    <img src="/static/img/user/sigh.png"><span class="text-gray">结算账户余额不足，请 </span><router-link class="text-href" to="/user-center/recharge">立即充值</router-link>
                </p>
            </div>

            <div style="padding:30px 20px;">
                <span class="text-gray">实付金额：</span><span class="text-danger" style="font-size:20px">{{sum|toDoubleThousands}}</span><span class="text-danger">元</span>
            </div>

            <div style="padding:0 20px;">
                <span>交易密码：</span><el-input type="password" style="display:inline-block;width:240px" v-model="code"></el-input><router-link class="text-href m-l" to="/user-center/account-safety">忘记交易密码？</router-link>
            </div>

            <el-button type="primary" style="margin:26px 0 0 95px" :disabled="!sum||balance<sum" @click="pay">确认付款</el-button>
        </div>
        <div class="pay-success" v-if="paySuccess">
            <div class="top clear">
                <p>您已成功还款<span style="color:red;font-size:30px">{{sum|toDoubleThousands}}</span>元</p>
            </div>
            <div class="pay-times">
                <span class="text-gray">支付时间：{{payTime|formatTime("YMDHMS")}}</span>
            </div>
            <div class="bottom">
                <!-- <span class="text-gray">现在您可以</span> -->
                <el-button type="primary" @click="outerLink(1)">查看详情</el-button>
                <el-button plain @click="outerLink(2)">继续采购</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    created(){
        this.getBalance();
        this.selected=[...this.items];
    },
    data(){
        return{
            code:'',
            paySuccess:false,
            balance:0,
            selected:[],
            payTime:null
        }
    },
    methods:{
        getBalance(){
            this.$ajax.get('/basemall-fax/account/my-account').then((res)=>{
                this.balance=res.account.availableMoney;
            })
        },
        check(e,x){
            let selected=new Set([...this.selected]);
            if(e.target.checked){
                selected.add(x);
            } else{
                selected.delete(x);
            };
            this.selected=Array.from(selected);
        },
        validate(next){
            if(!this.code){
                this.$message.warning('请输入交易密码！');
            }else{
                next()
            }
        },
        auditPayPassword(next){
            this.$ajax.post('/basemall-account/account/check-pay-password',{
                payPassWord:this.code
            }).then((res)=>{
                next()
            })
        },
        pay(){
            this.validate(()=>{
                let ids=this.selected.map(_=>_.id).join(',');
                this.auditPayPassword(()=>{
                    this.$ajax.post(`/basemall-fax/borrow-repayment/begin-repayment?borrowId=${ids}`).then((res)=>{
                        this.payTime=new Date().getTime();
                        this.paySuccess=true;
                    })
                })
            })
        },
        outerLink(type){
            this.$router.push({path:type==1?'/user-center/financing':'/supply/list'})
        }
    },
    computed:{
        items(){
            let items=sessionStorage.getItem('_frcpd');
            return items?JSON.parse(items):[]
        },
        sum(){
            let sum=0;
            if(this.selected.length>0){
                this.selected.forEach(x=>{
                    sum+=x.repaymentAmount*1
                })
            };
            return sum
        }
    },
    watch:{
        paySuccess(newVal,oldVal){
            window.hideUserAside.val = this.paySuccess
        }
    }
}
</script>

<style lang="scss" scoped>
    .financing-repayment{
        padding-bottom: 50px;
        .m-l{
            margin-left: 15px;
        }
        .balanceNotEnough{
            overflow: hidden;
            img{
                float: left;
                margin-right: 5px;
                height: 20px;
            }
        }
        .group{
            display: flex;
            margin-bottom: 20px;
            .label{
                position: relative;
                width: 40px;
                [name="item-label"]{
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    margin:auto;
                }
            }
            .item{
                flex:1;
                border: 1px solid #ebebeb;
                border-radius: 5px;
                overflow: hidden;
                &.active{
                    border-color: #1650a2;
                }
                .item-head{
                    line-height: 58px;
                    height: 58px;
                    font-size: 18px;
                    background: #F5F8FB;
                    border-bottom: 1px solid #ebebeb;
                    padding: 0 30px;
                }
                .item-body{
                    padding: 30px;
                    p{
                        overflow: hidden;
                        margin-bottom: 20px;
                        &:last-child{
                            margin-bottom: 0;
                        }
                        span{
                            float: left;
                        }
                    }
                }
            }
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
                height:55px;
                p,span{
                    line-height: 1;
                }
                p{
                    color: inherit;
                    font-size: 30px;
                    margin-top: 20px;
                }
                span{
                    font-size: 16px;
                }
            }
            .pay-times{
                margin-top:20px;
                text-align:center;
                span{
                    line-height:1;
                    font-size: 16px;
                }
            }
            .bottom{
                margin-top: 70px;
                span{
                    font-size: 14px;
                    margin-right: 20px;
                }
            }
        }
        .codeErr{
            color: red;
            font-size: 12px;
            padding-left: 90px;
        }
    }
</style>
