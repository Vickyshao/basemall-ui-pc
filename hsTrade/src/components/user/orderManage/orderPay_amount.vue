<template>
    <div>
        <div style="padding:20px;border-bottom:1px solid #ebebeb">
            <span class="text-gray">账户余额：</span><span>{{infos.info.availableMoney | toDoubleThousands}}元</span>
            <!-- 付定金 -->
            <span v-if="infos.info.orderState<=1">
                <p class="balanceNotEnough" style="padding-top:10px" v-if="depositPay > infos.info.availableMoney">
                    <img src="/static/img/user/sigh.png"><span class="text-gray">结算账户余额不足，请 </span>
                    <router-link class="text-href" to="/user-center/recharge">立即充值</router-link>
                </p>
            </span>
            <!-- 付尾款 -->
            <span v-if="infos.info.orderState<3 && infos.info.orderState>=2">
                <p class="balanceNotEnough" style="padding-top:10px" v-if="infos.info.tailAmount > infos.info.availableMoney&&infos.info.tailAmount > 0">
                    <img src="/static/img/user/sigh.png"><span class="text-gray">结算账户余额不足，请 </span>
                    <router-link class="text-href" to="/user-center/recharge">立即充值</router-link>
                </p>
            </span>


            <div style="margin-top: 17px;" v-if="infos.info.orderState<=1">
                <span class="text-gray">支付比例：</span>
                <el-select v-model="financeRatio" placeholder="请选择支付比例" @change="onSelectedDrug($event)">
                    <el-option label="自定义" value=""></el-option>
                    <el-option label="30%" value="30"></el-option>
                    <el-option label="40%" value="40"></el-option>
                    <el-option label="50%" value="50"></el-option>
                    <el-option label="60%" value="60"></el-option>
                    <el-option label="70%" value="70"></el-option>
                    <el-option label="80%" value="80"></el-option>
                    <el-option label="90%" value="90"></el-option>
                </el-select>
                <el-input v-if="showInput" v-model="customrRatio" @blur="changeRatio" style="display:inline-block;width:150px;margin-left:10px;" placeholder="请输入支付比例" suffix-icon="el-icon-ump-percent"></el-input>
                <i style="color: #f56c6c;font-size: 12px;">{{this.errorTips}}</i>
            </div>
        </div>

        <div style="padding:30px 20px;">
            <span class="text-gray">实付金额：</span>
            <!-- 付定金 -->
            <div v-if="infos.info.orderState<=1" style="display:inline-block">
                <!-- 付定金时，需把融资金额不满千元的一起付掉： -->
                <span class="text-danger" style="font-size:20px">{{depositPay | toDoubleThousands}}</span><span class="text-danger">元</span>
                <a class="el-icon-ump-iconfontwenhao1" title="付定金时，需将尾款不满千元部分一起支付" style="color:#dcdfe6;cursor:pointer;"></a>
            </div>
            <!-- 付尾款 -->
            <div v-if="infos.info.orderState<3 && infos.info.orderState>=2" style="display:inline-block">
                <span class="text-danger" style="font-size:20px">{{infos.info.tailAmount | toDoubleThousands}}</span><span class="text-danger">元</span>
            </div>
        </div>

        <div style="padding:0 20px;">
            <span>交易密码：</span>
            <el-input v-model="pwd" style="display:inline-block;width:240px" type="password"></el-input>
            <router-link class="text-href m-l" to="/user-center/account-safety">忘记交易密码？</router-link>
        </div>

        <el-button :loading="paying" type="primary" style="margin:26px 0 0 95px" @click="confirmPay" :disabled="infos.info.isLocked==1">确认付款</el-button>
    </div>
</template>

<script>
    export default {
        props: ['infos'],
        created() {},
        data() {
            return {
                paying:false,
                financeRatio: '30',
                paySuccess: false,
                pwd: '',
                payAmount: '',
                flag: '',
                customrRatio:'',
                showInput:false,
                errorTips:'',
                ratioNum:''
            }
        },
        methods: {
            changeRatio(){
                let res=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
                if(this.customrRatio==''){
                    this.errorTips = '请输入支付比例'
                    this.customrRatio = '';
                    return
                }else{
                    if(!res.test(this.customrRatio)){
                        this.errorTips = '请输入数字'
                        this.customrRatio = '';
                        return
                    }else if(this.customrRatio < 0 || this.customrRatio > 100){
                        this.errorTips = '定金支付比例只能输入小于100的正数'
                        this.customrRatio = ''
                        return
                    }else{
                        this.errorTips = ''
                    }
                }
            },
            onSelectedDrug(event) {
                this.customrRatio = '';
                this.errorTips = '';
                if(event==''){
                    this.showInput=true;
                }else if(event!==''){
                    this.showInput=false;
                }
            },
            confirmPay() {
                if(this.customrRatio == ''&& this.showInput==true ){
                    this.errorTips = '请输入支付比例';
                    return
                }else if(this.pwd==''){
                    this.$message.warning('请输入交易密码');
                    return
                }else{
                    // this.paying=true;
                    this.$ajax.post('/basemall-account/account/check-pay-password', {
                        payPassWord: this.pwd,
                        }).then((res) => {
                            this.paying=true;
                            this.pay();
                        }).catch(()=>{
                            this.paying=false;
                    })
                }
            },
            pay() {
                if (this.infos.info.orderState <= 1) {
                    this.flag = '定金';
                    this.payAmount = this.depositPay;
                    console.log(this.payAmount);
                } else if (this.infos.info.orderState < 3 && this.infos.info.orderState >= 2) {
                    this.flag = '现金付尾款';
                    this.payAmount = this.infos.info.tailAmount;
                }
                this.cashPay();
            },
            cashPay() {
                console.log(222);
                let state;
                state = this.infos.info.orderState == 2 ? 3 : 2;
                let ratio;
                if(this.showInput==false){
                    ratio = this.financeRatio;
                }else if(this.showInput==true){
                    ratio =this.customrRatio;
                }
                this.$ajax.post('/basemall-fax/account/payment', {
                    amount: this.payAmount,
                    goodsId: this.infos.info.goodsId,
                    flag: this.flag,
                    shopOrderId: this.$route.query.id * 1,
                    updateTime: this.infos.info.updateTime,
                    ratio: this.infos.info.orderState == 2 ? (100 - this.ratioNum) / 100 : this.ratioNum / 100
                }).then((res) => {
                    this.infos.paySuccess = true;
                    this.infos.amount = res.amount;
                    this.infos.date = res.date;
                    if(window.hideUserAside){window.hideUserAside.val=true}
                    // this.$ajax.post(`/basemall-shop/shop-order/update-state`, {
                    //     id: this.$route.query.id,
                    //     orderState: state,
                    //     tradingState: state == 3 ? 2 : 1
                    // }).then((res) => {});
                });
            },
            outerLink(type) {
                this.$router.push({
                    path: '/user-center/order-list'
                })
            }
        },
        computed: {
            amount() {
                return !!this.infos.amountPaid ? (this.infos.info.totalAmount - (this.infos.amountPaid * 1)) : this.infos.info.totalAmount;
            },
            depositPay() {
                let num1;
                if(this.showInput==false){
                    num1 = this.financeRatio;
                }else if(this.showInput==true){
                    num1 = this.customrRatio;
                    if(num1==100){
                        return this.infos.info.totalAmount
                    }
                }
                let ratioNum = parseFloat(num1.substr(0,num1.indexOf(".")+3));
                this.ratioNum = ratioNum;
                let payAmount = this.infos.info.totalAmount * (ratioNum / 100);
                let financingAmount = this.infos.info.totalAmount - payAmount;
                return payAmount + financingAmount % 1000;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .m-l {
        margin-left: 15px;
    }

    .tail {
        color: #807f7f;
        font-size: 12px;
        margin-top: 13px;
        span {
            color: red;
            font-weight: bold;
            font-size: 13px;
        }
    }

    .balanceNotEnough {
        overflow: hidden;
        img {
            float: left;
            margin-right: 5px;
            height: 20px;
        }
    }
</style>
