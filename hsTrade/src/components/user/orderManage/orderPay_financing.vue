<template>
    <div>
        <div class="area" style="margin:20px 0;background:#fff;border:none">
            <div>
                <p class="m-b"><span class="text-gray">融资比例：</span>{{(1-this.infos.ratio).toFixed(2)*100}}%</p>
                <p class="m-b">
                    <span class="text-gray fl">融资期限：</span>
                    <el-select class="fl" v-model="time" @change="changeTime" placeholder="请选择交易状态">
                        <el-option label="15天" value="15"></el-option>
                        <el-option label="30天" value="30"></el-option>
                        <el-option label="60天" value="60"></el-option>
                        <el-option label="90天" value="90"></el-option>
                        <el-option label="180天" value="180"></el-option>
                    </el-select>
                </p>
                <p class="m-b">
                    <span class="text-gray fl">还款方式：</span>
                    <el-select class="fl" v-model="type" @change="changeType" placeholder="请选择交易状态">
                        <el-option label="到期还本付息" value="1"></el-option>
                        <el-option label="等额本息" value="2"></el-option>
                    </el-select>
                </p>
            </div>
            <div>
                <p><span class="text-gray">融资总额：</span> {{payAmount | toDoubleThousands}}元</p>
                <!-- <p><span class="text-gray">融资利率：</span><span class="text-danger">{{rate*100 | keepTwoPoints}}%</span></p> -->
                <p>
                    <span class="text-gray">融资利率（年化）：</span>
                    <el-input v-model="rateInput" @blur="changeRatio" @focus="focusRatio" style="display:inline-block;width:135px;" :placeholder="rateText" :suffix-icon="iconname"></el-input>
                    <span style="color: #f56c6c;font-size: 12px;float:left;">{{this.errorTips}}</span>
                </p>
                <p><span class="text-gray">融资服务费：</span><span>{{serverRate | keepTwoPoints}}%</span></p>
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
                <li>{{today+((time*1)*86400000)|formatTime}}</li>
                <li>{{principal | toDoubleThousands}}</li>
                <li>{{interest | toDoubleThousands}}</li>
            </ul>
        </div>
        <div style="margin-top:20px;">
            <input type="checkbox"  v-model="isAccept"><span style="margin-left:10px;">同意《<b class="blue_link">融资付款协议</b>》（<b class="blue_link">点击查看</b>）</span>
        </div>
        <div style="margin:30px 0">
            <span class="text-gray">实付金额：</span>
            <span class="text-danger" style="font-size:20px">{{(payAmount+interest) | toDoubleThousands}}元</span>
        </div>
        <el-button type="primary" @click="pay" :disabled="!isAccept || payAmount+interest==0?true:false || this.infos.info.isLocked==1">申请融资支付</el-button>
    </div>
</template>

<script>
    export default {
        props: ['infos'],
        data() {
            return {
                time: '30',
                type: '1',
                rate: null,
                serverRate:'',
                today: new Date().getTime(),
                isAccept: false,
                rateInput:'',
                errorTips:'',
                rateText:'推荐利率',
                iconname:''
            }
        },
        created() {
            this.queryRate();
        },
        methods: {
            changeTime() {
                this.queryRate();
            },
            changeType() {

            },
            changeRatio(){
                let res=/^[0-9]+([.]{1}[0-9]+){0,1}$/;
                if(this.rateInput==''){
                    this.errorTips = '请输入年化利率';
                    this.rateInput = '';
                    this.rateText = '推荐利率'+this.rate +'%';
                    this.iconname = '';
                    return
                }else{
                    if(!res.test(this.rateInput)&&this.rateInput!==''){
                        this.errorTips = '请输入数字';
                        this.rateInput = '';
                        this.rateText = '推荐利率'+this.rate +'%';
                        this.iconname = '';
                        return
                    }else if(this.rateInput < 0 || this.rateInput > 100){
                        this.errorTips = '年化利率只能输入小于100的正数';
                        this.rateInput = '';
                        this.rateText = '推荐利率'+this.rate +'%';
                        this.iconname = '';
                        return
                    }else{
                        this.errorTips = ''
                        this.iconname = 'el-icon-ump-percent'; 
                    }
                }
            },
            focusRatio(){
                this.rateText = '';
                this.errorTips = '';
                this.iconname = 'el-icon-ump-percent';
            },
            queryRate() {
                this.$ajax.post('/basemall-fax/borrow-rate/query-borrow-rate', {
                    ratio: (100 - this.infos.ratio * 100) / 100,
                    term: this.time * 1,
                    // userType: 2,
                }).then((res => {
                    this.rate = res.rate;
                    this.serverRate = res.borrowFee.value;
                    this.rateText = '推荐利率'+this.rate +'%';
                    console.log(res);
                }));
            },
            pay() {
                if(this.rateInput==''){
                    this.errorTips = '请输入年化利率';
                    return
                }else{
                    this.$confirm('此操作将申请融资支付, 是否继续?', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.pcAddBorrow();
                    }).catch(() => {});
                }

            },
            pcAddBorrow() {
                let rate = this.rate;
                let toFixedNum = rate.toFixed(3);
                rate = toFixedNum.substring(0, toFixedNum.toString().length - 1);
                this.$ajax.post('/basemall-fax/borrow/add-borrow', {
                    borrowSum: this.payAmount,
                    annualInterestRate: this.rateInput,
                    borrowTimeLimit: this.time,
                    isDay: 1,
                    repaymentStyle: this.type,
                    goodsName: this.infos.info.shopName,
                    shopOrderId: this.$route.query.id,
                    ratio: 1 - this.infos.ratio,
                    updateTime: this.infos.info.updateTime
                }).then((res) => {
                    this.infos.paySuccess = true;
                    this.infos.amount = res.amount;
                    this.infos.date = res.date;
                    if(window.hideUserAside){window.hideUserAside.val=true}
                    // this.$ajax.post(`/basemall-shop/shop-order/update-state`, {
                    //     id: this.$route.query.id,
                    //     orderState: 3,
                    //     tradingState: 2
                    // }).then((res) => {});
                }).catch((err)=>{});
            },
        },
        computed: {
            payAmount() {
                return !!this.infos.amountPaid ? (this.infos.info.totalAmount - (this.infos.amountPaid * 1)) : this.infos.info.totalAmount
            },
            principal() {
                return !!this.infos.amountPaid ? (this.infos.info.totalAmount - (this.infos.amountPaid * 1)) : this.infos.info.totalAmount;
            },
            interest() {
                // 投资金额*(历史年化收益率*(投资期限/360)
                // return (!!this.infos.amountPaid ? ((this.infos.info.totalAmount - (this.infos.amountPaid * 1))*(this.rate*(this.time/360))) : this.infos.info.totalAmount) * this.rate;
                /* 如果输入了按输入利率计算应付利息，没有输入就按推荐利率 */
                if(this.rateInput==''){
                    return ((this.infos.info.totalAmount - (this.infos.amountPaid)) * (this.rate * 0.01 * (this.time / 360)));
                }else{
                     return ((this.infos.info.totalAmount - (this.infos.amountPaid)) * (this.rateInput * 0.01 * (this.time / 360)));
                }
                
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        font-size: 18px;
        line-height: 26px;
        overflow: hidden;
        margin: 20px 0;
        img,
        p {
            float: left;
            margin-right: 10px;
        }
    }

    .area {
        border: 1px solid #ebebeb;
        background: #f5f8fb;
        padding: 30px;
        border-radius: 5px;
        &>div {
            overflow: hidden;
            width: 100%;
            &>p {
                float: left;
                line-height: 40px;
                &:first-child {
                    width: 24%;
                }
                &:nth-child(2) {
                    width: 38%;
                }
                &:last-child {
                    width: 38%;
                }
                &.m-b {
                    margin-bottom: 20px;
                }
            }
        }
        .group-head,
        .group-body {
            overflow: hidden;
            text-align: center;
            display: flex;
            li {
                flex: 1;
                box-sizing: border-box;
            }
        }
        .group-head {
            li {
                line-height: 44px;
                height: 44px;
                background: #007dc9;
                border-right: 1px solid #007dc9;
                color: #fff;
                &:nth-child(2) {
                    background: #1650a2;
                    border-right: 1px solid #1650a2;
                    border-left: 1px solid #1650a2;
                }
            }
        }
        .group-body {
            li {
                border-right: 1px solid #1650a2;
                border-bottom: 1px solid #1650a2;
                height: 50px;
                line-height: 50px;
                &:first-child {
                    border-left: 1px solid #1650a2;
                }
            }
        }
    }
</style>
