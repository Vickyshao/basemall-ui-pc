<template>
    <div class="present-wrapper">
        <div v-if="!status.paySuccess">
            <div class="info">
                <p style="font-size:16px;">提现银行</p>
                <div class="bank clear">
                    <div class="bank-item fl active">建设银行</div>
                    <div class="company fl">
                        <p>XXX有限公司</p>
                        <p>XX省，XX市，XX支行</p>
                    </div>
                </div>
                <p>银行账号：333313431351315</p>
            </div>

            <div class="input-group clear">
                <label class="text-gray">账户余额：</label>
                <p>351351.21元</p>
            </div>

            <div class="input-group clear">
                <label class="text-gray">提现金额：</label>
                <div class="input">
                    <el-input></el-input>
                    <p class="text-danger" style="font-size:12px">账户余额请预留足额手续费，否则可能提现失败。</p>
                </div>
            </div>

            <div class="input-group clear">
                <label class="text-gray">提现手续费：</label>
                <p>按银行收费标准<span class="text-gray">（本月免费次数2）</span></p>
            </div>

            <div class="input-group clear">
                <label class="text-gray">实际到账：</label>
                <p class="text-danger">535.23元</p>
            </div>

            <div class="input-group clear">
                <label class="text-gray">备注：</label>
                <div class="input">
                    <el-input type="textarea"></el-input>
                </div>
            </div>

            <div class="input-group clear">
                <label class="text-gray">支付密码：</label>
                <div class="input">
                    <el-input></el-input>
                </div>
                <span class="fl text-href" style="margin-left:15px">忘记支付密码</span>
            </div>

            <div class="input-group clear">
                <el-button class="present_btn fl" type="primary" @click="pay">提现</el-button>
                <span class="fl text-gray" style="font-size:12px;margin-left:15px">提现到账预计2-3个工作日</span>
            </div>
        </div>
        <div class="pay-success" v-if="status.paySuccess">
            <div class="top clear">
                <p>提现成功</p>
            </div>
            <p>提现金额：1000.00元</p>
            <p>提现手续费：10.00元</p>
            <p>提现时间：2018-02-03 15:00:00</p>
            <div class="bottom">
                <el-button type="primary" style="font-size:18px" @click="(status.paySuccess=false,status.tab='2')">查看提现记录</el-button>
                <p style="margin-top:10px">
                    <span class="text-href" style="margin-top:10px" @click="toCapital">返回我的账户</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['status'],
    data(){
        return{
            
        }
    },
    methods:{
        tabChecked(){
            
        },
        pay(){
            this.status.paySuccess=true
        },
        toCapital(){
            this.$router.push({path:'/user-center/capital'})
        }
    }
}
</script>
<style lang="scss" scoped>
    .present-wrapper{
        .fl{float:left;}
        .info{
            padding: 30px;
            border: 1px solid #ebebeb;
            margin-bottom: 25px;
            .bank{
                margin: 20px 0;
                .bank-item{
                    width: 164px;
                    height: 50px;
                    border: 2px solid #ebebeb;
                    box-sizing: border-box;
                    margin-right: 20px;
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
                .company{
                    p{
                        line-height: 25px;
                        color: #666;
                    }
                }
            }
        }
        .input-group{
            line-height: 40px;
            margin-top: 20px;
            label,.input,p{
                float: left;
            }
            label{
                width: 90px;
            }
            .input{
                width: 292px;
            }
        }
        .present_btn{
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
