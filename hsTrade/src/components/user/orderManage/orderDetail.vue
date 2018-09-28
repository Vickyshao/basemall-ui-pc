<template>
    <div>
        <div class="orderlist-wrapper" v-if="!send_success.status">
            <div class="orderDetail">
                <div class="orderNum">订单号：{{info.orderNo}}</div>
                <div class="detailTbl">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>单价（元）</th>
                                <th>数量</th>
                                <th>交货地</th>
                                <th>交易时间</th>
                                <th>总价（元）</th>
                                <th>交易合同</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td :title="info.shopName">{{info.shopName||"-"}}</td>
                                <td>{{info.unitPrice|toDoubleThousands}}</td>
                                <td>{{info.shopCount}}</td>
                                <td>
                                    <view-address :options="{address:info.shippingAddress}"></view-address>
                                </td>
                                <td>{{info.createTime|formatTime("YMDHMS")}}</td>
                                <td>{{info.totalAmount|toDoubleThousands}}</td>
                                <td><span class="text-href" @click="viewContract">查看合同</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="height:168px;position:relative">
                <div class="process" v-if="info.orderState!=4">
                    <ul class="clear">
                        <li :class="{active:info.orderState>0}">
                            <div>
                                <p>生成订单</p>
                                <p class="small">{{info.createTime|formatTime("YMDHMS")}}</p>
                            </div>
                        </li>
                        <li v-if="info.orderState>=2" :class="{active:info.orderState>=2}">
                            <div>
                                <p>定金已付</p>
                                <p class="small" v-if="info.orderState>1">{{info.updateTime|formatTime("YMDHMS")}}</p>
                                <time-count v-if="info.orderState<2" class="small" :info="info"></time-count>
                            </div>
                        </li>
                        <li v-if="info.orderState<2" :class="{active:info.orderState<2}">
                            <div>
                                <p>定金待付</p>
                                <!-- <p class="colorRed"><time-count v-if="info.orderState<2" class="small" :info="info"></time-count></p> -->
                                <day-time-overtime class="remainTime" :details="{'leftTime':pendingPay}" v-if="pendingPay>0&&info.orderState<2"></day-time-overtime>
                            </div>
                        </li>
                        <li :class="{active:info.orderState>=2}">
                            <div>
                                <p>{{info.orderState<=2?'尾款待付':'尾款已付'}}</p>
                                <p class="small" v-if="info.orderState!=4&&info.orderState>=3">{{info.payTailTime|formatTime("YMDHMS")}}</p>
                                <day-time-overtime class="remainTime" :details="{'leftTime':pendingTail}" v-if="pendingTail>0&&info.orderState<=2&&info.orderState>1"></day-time-overtime>
                            </div>
                        </li>
                        <li v-if="info.orderState<5" :class="{active:info.orderState>=3&&info.orderState<5}">
                            <div>
                                <p>待发货</p>
                                <p class="small" v-if="info.orderState>=3&&info.orderState<6">
                                <day-time-overtime class="remainTime" :details="{'leftTime':leftTime}" v-if="leftTime>0&&info.orderState<5"></day-time-overtime>
                                <p v-if="leftTime<=0"><span class="color-red">已超时</span></p>
                                <!-- {{info.updateTime|formatTime("YMDHMS")}} -->
                                </p>
                                <time-count class="small" :info="info"></time-count>
                            </div>
                        </li>
                        <li v-if="info.orderState>=5" :class="{active:info.orderState>=5}">
                            <div>
                                <p>发货<span class="color-red" v-if="(info.payTailTime+info.deliveryDays * 86400000)-info.currentTime<=0">(超时)</span></p>
                                <p class="text-href small" v-if="info.orderState>=5" @click="viewInvoice">(查看发货单)</p>
                                <p class="small">{{info.deliveryTime|formatTime("YMDHMS")}}</p>
                            </div>
                        </li>
                        <li :class="{active:info.orderState>=5 && info.orderState<=7}">
                            <div>
                                <p>确认收货</p>
                                <p class="small" v-if="info.orderState>=6 && info.orderState<8">{{info.confirmTime|formatTime("YMDHMS")}}</p>
                            </div>
                        </li>
                        <li :class="{active:info.orderState>=6 && info.orderState<8}">
                            <div>
                                <p>交易成功</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="process" v-if="info.orderState==4">
                    <ul class="clear">
                        <li>
                            <div>
                                <p>订单已取消</p>
                                <!-- <p class="small">{{info.createTime|formatTime("YMDHMS")}}</p> -->
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>定金支付</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>尾款支付</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>发货</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>确认收货</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>交易成功</p>
                            </div>
                        </li>
                    </ul>
                </div>
                </div>
            </div>
            <div class="status" v-if="info.orderState!=4">
                <pending-payment v-if="info.orderState<3 && info.orderState<7" :info="info"></pending-payment>
                <buyer-delivery v-if="$route.query.orderType==1 && info.orderState>=3 && info.orderState<5" :info="info"></buyer-delivery>
                <seller-delivery v-if="$route.query.orderType==2 && info.orderState>=3 && info.orderState<5" @get-info="getInfo" :info="info"></seller-delivery>
                <concact v-if="$route.query.orderType==2 && info.orderState>3 && info.orderState<5" :info="info"></concact>
                <confirm-delivery v-if="info.orderState==5" :info="info" @get-info="getInfo"></confirm-delivery>
                <dealSuc v-if="info.orderState>=6&&info.orderState<8"></dealSuc>
                <!-- <confirm-delivery :info="info"></confirm-delivery> -->
                <!-- <make-payment></make-payment> -->
                <!-- <buyerPayment></buyerPayment> -->
            </div>
            <el-dialog title="" :visible.sync="isShowInvoice" width="750px">
                <p class="oddNum">物流单号：{{dialogData.no}}</p>
                <div class="dialog-img-area">
                    <span class="left el-icon-caret-left" @click="imgMove(1)" v-show="dialogData.nos.length>1&&dialogData.index<0"></span>
                    <span class="right el-icon-caret-right" @click="imgMove(0)" v-show="dialogData.nos.length>1&&(-dialogData.nos.length<dialogData.index-1)"></span>
                    <div class="scroll-box" v-if="dialogData.imgs.length>0">
                        <div class="clear" :style="dialogData.style">
                            <img :src="x" v-for="(x,i) in dialogData.imgs" :key="i" @click="viewBigPic(x)">
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
        <div class="pay-success" v-if="send_success.status">
            <div class="top clear">
                <p>您的订单<span style="font-size:30px">{{info.orderNo}}</span>发货成功</p>
            </div>
            <div class="bottom">
                <el-button type="primary" @click="outerLink(2)">提醒验收</el-button>
                <el-button plain @click="outerLink(1)">管理订单</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import viewAddress from '@/components/common/viewAddress'
    import timeCount from "./timeCount"
    import pendingPayment from "./pendingPayment.vue"
    import buyerDelivery from "./buyerDelivery.vue"
    import sellerDelivery from "./sellerDelivery.vue"
    import concact from "./concact.vue"
    import confirmDelivery from "./confirmDelivery.vue"
    import dealSuc from "./dealSuc.vue"

    import makePayment from "./makePayment.vue"
    import dayTimeOvertime from "./dayTimeOvertime"
    export default {
        created() {
            this.init();
            if(window.sendSuccess){
                this.send_success = window.sendSuccess
            }
            // console.log(this.$route.path)
        },
        components: {
            dayTimeOvertime,
            viewAddress,
            timeCount,
            pendingPayment,
            buyerDelivery,
            sellerDelivery,
            concact,
            confirmDelivery,
            dealSuc,
            makePayment,
        },
        data() {
            return {
                info: {
                    orderType: this.$route.query.orderType,
                    tradingState: this.$route.query.tradingState
                },
                isShowInvoice: false,
                dialogData: {
                    index: 0,
                    no: '',
                    nos: [],
                    imgs: [],
                    style: {
                        width: '380px',
                        marginLeft: 0
                    }
                },
                send_success:{
                    status:false,
                    id:0
                }
            };
        },
        methods: {
            outerLink(num){
                if(num == 2){
                    this.$ajax.post('/basemall-shop/shop-order/remind',{
                        id: this.$route.query.id,
                        field: 2
                    }).then(((res)=>{
                        
                    }));
                }
                this.$router.push('/user-center/order-list')
            },
            init() {
                this.getInfo();
            },
            getInfo() {
                let t = new Date().getTime();
                this.$ajax
                    .get(`/basemall-shop/shop-order/order?id=${this.$route.query.id}&t=${t}`)
                    .then(res => {
                        this.info = res[0];
                    });
            },
            viewInvoice() {
                this.isShowInvoice = true;
                this.dialogData.index = 0;
                this.dialogData.style.marginLeft = this.dialogData.index * 380 + 'px';
                this.dialogData.no = this.dialogData.nos[-this.dialogData.index]
                this.dialogData.nos = this.info.expressNumbers.split(',');
                this.dialogData.imgs = !!this.info.expressImages && this.info.expressImages.split(',').map(x => `${x}?${parseInt(Math.random()*1000000)}`);
                if (this.dialogData.nos.length > 0) {
                    this.dialogData.no = this.dialogData.nos[0];
                    this.dialogData.style.width = this.dialogData.nos.length * 380 + 'px'
                }
            },
            imgMove(type) {
                if (type == 1) {
                    this.dialogData.index++;
                } else {
                    this.dialogData.index--;
                };
                this.dialogData.style.marginLeft = this.dialogData.index * 380 + 'px';
                this.dialogData.no = this.dialogData.nos[-this.dialogData.index]
            },
            viewBigPic(img) {
                window.open(img, "_target")
            },
            viewContract() {
                let newTab = window.open('about:blank');
                this.$ajax.post(`/basemall-shop/shopAgreement/view`, {
                    detailId: this.info.detailId || '',
                }).then((res) => {
                    newTab.location.href = res;
                })
            },
        },
        computed: {
            leftTime(){
                return (this.info.deliveryDays*86400000-(this.info.currentTime-this.info.payTailTime))/1000;
            },
            pendingPay(){
                return (this.info.createTime+(86400000*3)-this.info.currentTime)/1000;
            },
            pendingTail(){
                // return (this.info.updateTime+(86400000*3)-this.info.currentTime)/1000;
                return (this.info.createTime+(86400000*3)-this.info.currentTime)/1000;
            }
        }
    };
</script>

<style lang="scss" scoped>
    $blueColor: #f5f8fb;
    $darkBlueColor: #1952a3;
    .colorRed {
        color: #ff0000 !important;
    }

    .orderlist-wrapper {
        // background: #f1f1f1;
        // padding-bottom: 36px;
        .orderDetail {
            width: 100%;
            display: inline-block;
            border: 1px solid #ebebeb;
            border-radius: 6px;
            background: #fff;
            .orderNum {
                background: $blueColor;
                border-bottom: 1px solid #ebebeb;
                line-height: 60px;
                font-size: 24px;
                color: #000;
                margin-bottom: 30px;
                padding-left: 30px;
            }
            .detailTbl {
                width: 90%;
                margin: 0 auto;
                .table {
                    tbody td:first-child {
                        width: 150px;
                        max-width: 150px;
                    }
                }
            }
            .process {
                width: 100%;
                margin: 34px auto;
                text-align: center;

                position: absolute;
                top: 0;
                left: 0;
                z-index:10;

                ul {
                    margin: 0;
                    display: inline-block;
                    li {
                        display: table;
                        float: left;
                        position: relative;
                        width: 98px;
                        height: 95px;
                        border-radius: 50%;
                        border: 2px solid #ebebeb;
                        margin-left: 43px;
                        box-sizing: border-box;
                        &:after {
                            position: absolute;
                            width: 45px;
                            content: "";
                            border-bottom: 2px solid #ebebeb;
                            left: -45px;
                            top: 43px;
                            z-index: -1;
                        }
                        &:first-child {
                            margin: 0;
                            &:after {
                                width: 0;
                                border: none;
                            }
                        }
                        &>div {
                            display: table-cell;
                            vertical-align: middle;
                            p {
                                color: #666;
                                font-size: 14px;
                                padding-top: 6px;
                            }
                        }
                        .small {
                            margin: 0 auto;
                            width: 80%;
                            font-size: 12px;
                            line-height: 14px;
                        }
                        &.active {
                            border: 2px solid #1650a2;
                            p {
                                color: #333;
                            }
                            &:after {
                                border-bottom: 2px solid #1650a2;
                            }
                        }
                        .remainTime {
                            // float: left;
                            color: red;
                            display: inline-block;
                            width: 80%;
                            font-size: 12px;
                            margin: 5px 0 0 10px;
                        }
                    }
                }
            }
        }
        .status {
            display: inline-block;
            width: 100%;
            padding-bottom: 48px;
            background: #f1f1f1;
        }
        .oddNum{
            text-align: center;
            font-size: 18px;
            height: 60px;
            line-height: 60px;
        }
        .dialog-img-area{
            position: relative;
            margin-bottom: 20px;
            .left,.right{
                position: absolute;
                top: 45%;
                font-size: 30px;
                width: 30px;
                height: 30px;
                background: #ccc;
                color: #fff;
                border-radius: 50%;
                cursor: pointer;
                transition: all 1s;
                &:hover{
                    box-shadow: 0 0 0 25px #666 inset;
                }
            }
            .left{ left: 0; }
            .right{ right: 0; }
            .scroll-box{
                width: 380px;
                margin:0 auto;
                overflow: hidden;
                &>div{
                    transition: all .5s;
                    img{
                        float: left;
                        width: 380px;
                        cursor: zoom-in;
                    }
                }
            }
        }
    }
    .pay-success{
        text-align: center;
        padding-top: 100px;
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
        .bottom{
            margin-top: 80px;
            margin-bottom:100px;
            span{
                font-size: 14px;
                margin-right: 20px;
            }
        }
    }
</style>
