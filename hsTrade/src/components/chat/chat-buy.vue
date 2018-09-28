<template>
    <div class="chat-wrapper">
        <div class="chat-container clear">
            <div class="top">
                <!-- <div class="title color-green">买方:{{corpName}}</div> -->
                <div class="title color-green">买方:{{chatData.remoteCorpName}}</div>
            </div>
            <div class="bot">
                <div class="left">
                    <div class="tops">
                        <div v-if="isShowSeeMore&&!!chatList&&chatList.total>10" class="seeMore" @click="seeMore">点击查看更多消息</div>
                        <div class="chat-box">
                            <ul class="chat-list">
                                <li class="chat-item" :class="{buySelf:userId==x.createBy&&!x.orderId,buyer:userId!=x.createBy&&!x.orderId,'':!!x.orderId}" v-for="x in pageDatas">
                                    <div class="chat-content" v-if="!x.orderId">
                                        <p>{{x.letterContent}} <span class="color-red">{{!!x.remark?x.remark:''}}</span></p>
                                        <p class="chat-content-top">
                                            {{userId!=x.createBy?"买方":"我"}}
                                            {{x.createTime|formatTime("YMDHMS")}}
                                        </p>
                                    </div>
                                    <div v-if="x.orderId" @show="getGoodsDetail" @scroll="getGoodsDetail" class="order">{{x.letterContent}}:<span class="color-red">{{x.orderNo}},</span>
                                        <span class="text-href" @click="viewOrderDetail(x)">点击查看</span>
                                    </div>
                                </li>
                                <li v-if="!pageDatas||pageDatas.length==0" style="text-align:center">暂无未读消息</li>
                                <!-- <li class="created" v-if="chatList.length>0&&!!chatList[chatList.length-1].orderId" style="margin-bottom:28px">
                                    卖方已同意买方对 {{detail.name}}
                                    <span class="tag-list" v-if="paramsDetail&&paramsDetail.length>0">
                                        <span class="tag" v-for="x in paramsDetail">{{x.value}}</span>
                                    </span> 的询价,价格：{{partinerPrice}}，数量：{{partinerNum}},订单已生成，订单编号:
                                    <span class="text-danger">{{chatList[chatList.length-1].orderNo}},</span>
                                    <span class="text-href" @click="viewOrderDetail(chatList[chatList.length-1])">点击查看</span>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                    <div class="chat-select-option clear">
                        <div class="offer">
                            <div>
                                <span class="fl m-r-xs">价格 </span>
                                <el-input class="input-width fl" placeholder="请输入价格" v-model="amount" :disabled="detail.status!=2||detail.dataQuantity<=0" @input="tipAmount=''"></el-input>
                                <em class="tips" v-if="!!tipAmount">　　  {{tipAmount}}</em>
                            </div>
                            <div>
                                <span class="fl">数量 </span>
                                <el-input class="input-width m-l-xs" placeholder="请输入数量" v-model="count" :disabled="detail.status!=2||detail.dataQuantity<=0" @input="tipCount=''"></el-input>
                                <span v-if="detail.status!=2||detail.dataQuantity<=0" class="m-l-md text-href">全卖</span>
                                <span v-if="detail.status==2&&detail.dataQuantity>0" class="m-l-md text-href" @click="(count=detail.dataQuantity,amount=detail.price)">全卖</span>
                                <em class="tips" v-if="!!tipCount">　　  {{tipCount}}</em>
                            </div>
                            <div>
                                <el-button class="btn color-green" type="success" @click="send" :disabled="detail.status!=2||detail.dataQuantity<=0">发送</el-button>
                            </div>
                        </div>
                        <div class="partners">
                            <span class="fl">目前对方认可的价格及数量为</span>
                            <div class="prices">
                                <span class="color-red">{{partinerPrice}}<em> 元</em></span>
                                <span class="color-red">{{partinerNum}}<em> {{detail.unit}}</em></span>
                            </div>
                            <div>是否以此价格成交</div>
                            <div>
                                <el-button class="btn color-orange" type="warning" @click="deal" :disabled="detail.status!=2||detail.dataQuantity<=0">成交</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <goods-detail :detail="detail" :params-detail="paramsDetail"></goods-detail>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import goodsDetail from './goodsDetail'
    export default {
        created() {
            this.uniqueAnswerNum = 0;
            this.chatData.remoteId = this.$route.query.remoteId;
            this.chatData.remoteCorpName = this.$route.query.remoteCorpName;
            window.BuyRCorpName = this.chatData.remoteCorpName;
            window.updateBuyStatus = this.updateStatus;

            if(!window.uniqueAnswerNum){
                window.uniqueAnswerNum={value:null};
            }

            this.uniqueAnswerNum = window.uniqueAnswerNum;
            this.chatData.itemDataIds = localStorage.getItem('itemDataIds');
            this.getGoodsDetail();
            document.addEventListener("visibilitychange", function() {
                // console.log( document.visibilityState );
                if (!document.hidden) {
                    window.uniqueAnswerNum.value=0;
                    // window.unreadAnswerList.value = 0;
                    window.unreadAnswerList = {value: 0};
                    newMessageRemind.clear();
                    window.isCurrentPage ={buy: true};
                    window.updateBuyStatus();
                    document.title = '沪深商贸';
                } else {
                    window.isCurrentPage = {buy: false};
                }
                console.log('window.isCurrentPage.buy77', window.isCurrentPage.buy);
                // judgeCurrentPage();
            });

            window.onfocus = function(){
                if(this.uniqueAnswerNum > 0){
                    this.updateBuyStatus();
                }
                document.title = '沪深商贸';
            };
        },
        components: {
            goodsDetail
        },
        data() {
            return {
                amount: null,
                count: null,
                userId: null,
                tipCount: '',
                tipAmount: '',
                pageIndex: 1,
                pageSize: 10,
                pageDatas: null,
                isShowSeeMore:true,
                isFirstExec: true,
                disId:null,
                readStatus: null,
                // uniqueAnswerNum: 0,
                unreadAnswerList: null,
            }
        },
        methods: {
            beforeClose(done) {
                done();
                this.amount = this.count = '';
                this.$store.commit('closeChatDialog')
            },
            getGoodsDetail() {
                let {shopId,itemDataIds} = this.chatData;
                let data = {shopId: this.$route.query.id,skuKeyId: this.$route.query.skuKeyId};
                this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', data).then((res) => {
                    this.$store.commit('updateChatGoodsInfo', res.goodsMap);
                    this.$store.commit('updateChatGoodsParamsInfo', res.itemList);
                    this.amount = this.detail.price;
                    this.count = this.detail.dataQuantity;
                    if(this.detail.status!=2||this.detail.dataQuantity<=0){
                        this.amount = null;
                        this.count = null;
                    }
                })
                this.uniqueDiscuss();
            },
            uniqueDiscuss(){
                this.$ajax.post('/basemall-message/discuss/unique-discuss',{
                    chatMethod: 2,
                    remoteId: this.chatData.remoteId,
                    goodsId: this.$route.query.id,
                    goodsPropertiesIds: this.$route.query.skuKeyId
                }).then((res)=>{
                    this.disId = !!res?res.id:'';
                    this.getAllMsgList(this.chatData.remoteId);
                });
            },
            getAllMsgList() {
                clearTimeout(window.updateBuyChat);
                window.updateBuyChat = null;
                this.$ajax.post('/basemall-message/discuss/window-discuss-list', {
                    discussId: this.$route.query.disId||this.disId,
                    remoteId: this.chatData.remoteId,
                    goodsId: this.$route.query.id,
                    pageIndex: '',
                    pageSize: '',
                    chatMethod: 2
                }).then((res) => {
                    this.$store.commit('updateChatList', res);
                    this.userId = res.userId;
                    this.pageDatas = this.chatList.filter((x,i)=>{return i<this.pageIndex*this.pageSize}).reverse();

                    window.unreadAnswerList = {value:this.$store.state.globalData.noticeCount.answerList};
                    this.unreadAnswerList = window.unreadAnswerList;
                    console.log('window.uniqueAnswerNum.value22',window.uniqueAnswerNum.value);
                    // if(window.uniqueAnswerNum.value < 1){
                    //     window.unreadAnswerList.value = 0;
                    // }
                    if(window.isCurrentPage.buy) {
                        console.log('888window.isCurrentPage.buy',window.isCurrentPage.buy);
                        console.log('888window.uniqueAnswerNum.value',window.uniqueAnswerNum.value);
                        newMessageRemind.clear();
                        if(window.uniqueAnswerNum.value>0){
                            this.updateStatus();
                        }
                        window.unreadAnswerList.value = 0;
                    }

                    window.chat.disId = this.pageDatas.length>0 ? this.pageDatas[0].discussId : null;

                    if(this.pageDatas.length>0&&!!this.pageDatas[this.pageDatas.length-1].orderId) {
                        this.getGoodsDetail();
                    }

                    this.readStatus = this.pageDatas.length>0?this.pageDatas[this.pageDatas.length-1].readStatus:'';
                    if(this.isFirstExec){
                        // this.uniqueDiscuss();
                    } else {
                        if(this.chatList.length>0){
                            this.isFirstExec=false;
                        } else {
                            this.isFirstExec=true;
                        }
                    }
                    if (!!this.uniqueAnswerNum && this.uniqueAnswerNum > 0 && this.$route.path == '/buy/chat') {
                        // newMessage()
                    }

                    window.updateBuyChat = setInterval(() => {
                        this.getAllMsgList(this.chatData.remoteId);
                    }, 10000);
                    setTimeout(scrollToBottom, 5);
                }).catch(() => {
                    this.$store.commit('updateChatList', []);
                })
            },

            getMsgList(id) {
                clearTimeout(window.updateBuyChat);
                window.updateBuyChat = null;
                this.$ajax.post('/basemall-message/discuss/window-discuss-list', {
                    discussId: this.$route.query.disId,
                    remoteId: id,
                    goodsId: this.$route.query.id,
                    pageIndex: 1,
                    pageSize: 10*(this.pageIndex*1),
                    chatMethod: 2
                }).then((res) => {
                    this.$store.commit('updateChatList', res);
                    this.userId = res.userId;
                    window.updateBuyChat = setInterval(() => {
                        this.getMsgList(this.chatData.remoteId);
                    }, 10000);
                    setTimeout(scrollToBottom, 5);
                }).catch(() => {
                    this.$store.commit('updateChatList', [])
                })
            },
            getCount(){
                clearTimeout(window.noticeMessage);
                // this.$ajax.get('/basemall-message/message/unread-count').then((res) => {
                //     let obj={};
                //     res.forEach(x=>{
                //         obj[x.typeId]=x.unreadCount
                //     });
                //     obj.askList = res[res.length-1].askList;
                //     obj.answerList = res[res.length-1].answerList;
                //     console.log('123obj.answerList', obj.answerList);
                //     this.$store.commit('updateNoticeCount',obj);
                //     window.noticeMessage=setTimeout(this.getCount,10000)
                // }).catch(()=>{
                //     if(!!window.noticeMessage){
                //         window.noticeMessage=setTimeout(this.getCount,10000)
                //     }
                // })
            },
            seeMore(){
                if(this.pageIndex < Math.ceil(this.chatList.total/10)){
                    this.pageIndex++;
                } else {
                    this.pageIndex = Math.ceil(this.chatList.total/10);
                    this.isShowSeeMore=false;
                }
                clearTimeout(window.updateBuyChat);
                window.updateBuyChat = null;
                this.getAllMsgList(this.chatData.remoteId);
            },
            send() {
                this.validate(() => {
                    let letterContent = [`　报价:${this.amount}元`, ` 数量:${this.count}${this.detail.unit}`];
                    letterContent = letterContent.join(';');
                    this.$ajax.post('/basemall-message/discuss/add-discuss', {
                        // corpName: this.chatData.remoteCorpName,
                        corpName: this.corpName,
                        goodsName: this.detail.name,
                        goodsId: this.chatData.goodsInfo.id * 1,
                        goodsProperties: this.paramsVal,
                        goodsPropertiesIds: this.$route.query.skuKeyId,
                        chatMethod: 2,
                        recieverId: this.chatData.remoteId*1,
                        letterContent: this.detail.name+'　'+this.paramsVal+letterContent,
                        price: this.amount*1,
                        amount: this.count*1,
                        goodsUnit: this.detail.unit,
                        remark: '',
                        status: 3
                    }).then((res) => {
                        if(!this.disId) {
                            this.disId=res.discussId;
                        }
                        if(this.isFirstExec){
                            // this.uniqueDiscuss();
                        }
                        this.pageIndex = 1;
                        this.isShowSeeMore=true;
                        this.getAllMsgList(this.chatData.remoteId);
                        this.amount = null;
                        this.count = null;
                        setTimeout(scrollToBottom, 5);
                    })
                })
            },
            deal() {
                let letterContent = ['　报价:' + this.partinerPrice*1 + '元', '数量:' + this.partinerNum*1 + this.detail.unit];
                letterContent = letterContent.join(';');
                this.$ajax.post('/basemall-message/discuss/add-discuss', {
                    // corpName: this.chatData.remoteCorpName,
                    corpName: this.corpName,
                    goodsName: this.detail.name,
                    goodsId: this.chatData.goodsInfo.id * 1,
                    goodsProperties: this.paramsVal,
                    goodsPropertiesIds: this.$route.query.skuKeyId,
                    chatMethod: 2,
                    recieverId: this.chatData.remoteId*1,
                    letterContent: this.detail.name+'　'+this.paramsVal+letterContent,
                    price: this.partinerPrice*1,
                    amount: this.partinerNum*1,
                    goodsUnit: this.detail.unit,
                    remark: '同意出价',
                    status: 3
                }).then((res) => {
                    this.pageIndex = 1;
                    this.isShowSeeMore=true;
                    this.disId = res.discussId||'';
                    this.getAllMsgList(this.chatData.remoteId);
                    setTimeout(scrollToBottom, 5);
                })
            },
            validate(next) {
                if (!this.amount) {
                    this.tipAmount = '请输入价格';
                } else if (!/^[1-9]\d*(\.\d{1,2})?$/.test(this.amount)) {
                    this.amount = null;
                    this.tipAmount = '请输入正确价格';
                } else if (this.count == null) {
                    this.tipCount = '请输入数量';
                } else if (!/^[1-9]\d*$/.test(this.count) || this.count > this.detail.dataQuantity) {
                    this.count = null;
                    this.tipCount = '数量必须是大于 1, 小于等于商品剩余数量的整数';
                } else {
                    let a = parseFloat(this.amount).toFixed(3);
                    this.amount = a.substring(0, a.indexOf('.') + 3);
                    next()
                };
            },
            // getTotalAmountAndCount(content) {
            //     let contentArr = content.split(';');
            //     let amt, count;
            //     amt = contentArr[0].split(':')[1].replace(/[\u4E00-\u9FA5]/g, '');
            //     count = contentArr[1].split(':')[1].replace(/[\u4E00-\u9FA5]/g, '');
            //     return {
            //         amt: amt * count,
            //         count
            //     }
            // },
            agree() {
                let {self,other} = this.SOList;
                if (!other || other.length == 0) {
                    if(self[self.length-1]) {
                        self[self.length-1].remark='同意出价';
                        this.deal(self[self.length-1]);
                    } else {
                        this.$message.warning('对方未询价，不能成交！')
                    }
                } else {
                    if(other[other.length-1]) {
                        other[other.length-1].remark='同意出价';
                        this.deal(other[other.length-1]);
                    }
                }
            },

            viewOrderDetail(opt) {
                this.$store.commit('closeChatDialog');
                let orderType;
                if (opt.sellerId == this.userId) {
                    orderType = 2
                } else {
                    orderType = 1;
                }
                this.$router.push({
                    path: `/user-center/order-list/order-detail?id=${opt.orderId}&orderType=${orderType}`
                })
            },
            updateStatus() {
                let data={discussId: this.disId};
                this.$ajax.post('/basemall-message/discuss/update-discuss-status',data).then(()=>{
                })
            },
            uniqueAnswerNums() {
                // this.getCount();
                // setTimeout(() => {
                    let answerList = this.$store.state.globalData.noticeCount.answerList, a = 0;
                    if(!!answerList && answerList.length>0){
                        answerList.forEach((x)=>{
                            if(x.discussId == this.disId) {
                                a += 1;
                            }
                        });
                    }
                    window.uniqueAnswerNum.value = a;
                    if(window.uniqueAnswerNum.value>0 && this.$route.path == '/buy/chat'){
                        console.log('222window.uniqueAnswerNum.value', window.uniqueAnswerNum.value);
                        newMessageRemind.show();
                    } else {
                        window.uniqueAnswerNum.value = 0;
                        document.title='沪深商贸';
                        clearNewMessageRemind();
                        return;
                    }
                    return a;
                // }, 102);
            },
        },
        computed: {
            chatData() {
                return this.$store.state.globalData.chatData
            },
            chatList() {
                return this.chatData.chatList;
            },
            remoteCorpName(){
                return this.chatData.chatList[0].remoteCorpName;
            },
            num() {
                return this.$store.state.globalData.noticeCount.unreadChatNum
            },
            show() {
                return this.chatData.showBuyChat
            },
            orderNums() {
                return this.$store.state.globalData.orderNums;
            },
            SOList() { //自身和对方聊天消息记录拆解
                let self = [],
                    other = [];
                if(!!this.chatList){
                    this.chatList.forEach(_ => {
                        if (_.createBy == this.userId && !_.orderId) {
                            self.push({ ..._
                            })
                        } else {
                            if(!_.orderId){
                                other.push({ ..._
                                })
                             }
                        }
                    });
                }
                self = self.reverse();
                other = other.reverse();
                return {
                    self,
                    other
                }
            },
            lastChat(){
                if(this.SOList.other) {
                    return this.SOList.other[this.SOList.other.length - 1];
                }
            },
            // paramsLastChat(){
            //     let paramsChat = [[],[],[],[],[],[],[],[],[],[],[],[]];
            //     this.SOList.other.forEach((x,i) => {
            //         if(x.letterContent.includes(this.paramsVal)){
            //             paramsChat[i].push(x);
            //         }
            //     });
            // },
            partinerPrice() {
                if(!!this.lastChat && this.userId!=this.lastChat.createBy){
                    if(this.lastChat.letterContent.includes(this.paramsVal)) {
                        return this.lastChat.price*1;
                    } else {
                        return this.detail.price*1;
                    }
                } else {
                    return this.detail.price*1;
                }
            },
            partinerNum() {
                if(!!this.lastChat && this.userId!=this.lastChat.createBy){
                    if(this.lastChat.letterContent.includes(this.paramsVal)) {
                        return this.lastChat.amount*1;
                    } else {
                        return this.detail.dataQuantity*1;
                    }
                } else {
                    return this.detail.dataQuantity*1;
                }
            },
            detail() {
                return this.chatData.goodsInfo
            },
            paramsDetail() {
                let arr = [];
                let params = this.chatData.goodsParamsInfo;
                params.forEach((x) => {
                    let dataName = [];
                    if (x.dataName) {
                        if(x.dataName.split(',').length>1) {
                            let names = x.dataName.split(',');
                            names.forEach((x)=>{
                                dataName.push(x.split('|')[1]);
                            });
                            dataName = dataName.toString();
                        } else {
                            dataName = x.dataName.split('|')[1];
                        }
                    };
                    arr.push({
                        label: x.itemName,
                        value: dataName
                    })
                });
                return arr
            },
            paramsVal(){
                let vals = this.paramsDetail.map((x)=>{return x.value}).toString();
                vals = vals.includes(',')? vals.replace(/\,/g,' '):vals;
                return vals;
            },
            lastContent() {
                if (this.chatList.length > 0) {
                    let last = this.chatList[this.chatList.length - 1].letterContent;
                    return last.split(';')
                } else {
                    return []
                }
            },
            showCreateOrder() {
                if (this.chatList.length > 0) {
                    if (this.chatList.length == 1) {
                        return this.chatList[0].createBy != this.detail.userId
                    } else {
                        return this.lastContent.length === 3
                    }
                } else {
                    return false
                }
            },
            corpName(){
                return JSON.parse(localStorage.UD).corpName;
            },
            answerList(){
                setTimeout(() => {
                    return this.$store.state.globalData.noticeCount.answerList;
                }, 20);
            },
            chatNum(){
                let num = this.$store.state.globalData.noticeCount.unreadChatNum;
                return !!num?`(${num})`:''
            },
            // uniqueAnswerNum() {
            //     setTimeout(() => {
            //         let answerList = this.$store.state.globalData.noticeCount.answerList, a = 0;
            //         if(!!answerList && answerList.length>0){
            //             answerList.forEach((x)=>{
            //                 if(x.discussId == this.disId) {
            //                     a += 1;
            //                 }
            //             });
            //         }
            //         window.uniqueAnswerNum = a;
            //         return a;
            //     }, 2);
            // },
        },
        watch: {
            // num(val) {
            //     if (this.show) {
            //         this.getMsgList(this.chatData.remoteId)
            //     }
            // },
            show(val) {
                if (val) {
                    this.getGoodsDetail();
                }
            },
            unreadAnswerList(val) {
                console.log('555newVal-AnswerNum',val.value);
                let lists = val.value||[], isHas=false;
                lists.forEach((x)=>{
                    if(x.discussId == this.disId){
                        isHas = true;
                    } else {
                        isHas = false;
                    }
                });
                if(!!val.value&&val.value.length>0&&isHas){
                    this.uniqueAnswerNums();
                    // this.getAllMsgList();
                } else {
                    newMessageRemind.clear();
                    // this.updateStatus();
                    document.title='沪深商贸';
                    return false;
                }
            },
            orderNums(val){
                if(val) {
                    this.getGoodsDetail();
                    this.$sore.commit('updateOrderNums', 0);
                }
            },
            // uniqueAnswerNum(val){
            //     if(val>0){
            //         // newMessage();
            //     } else {
            //         this.updateStatus();
            //     }
            // },

            // chatNum(val){
            //     if(val){
            //         // this.getAllMsgList(this.chatData.remoteId);
            //     }
            // },
            pageDatas(val){
                if(!!val&&!!val.orderId) {
                    this.getGoodsDetail();
                }
            },
            watch: {
                $route(to) {
                    this.init(to);
                    clearInterval(window.indexNotice);
                    if(to.path!='/buy/chat') {
                        clearTimeout(window.updateBuyChat);
                        window.updateBuyChat = null;
                    }
                },
                "chatData": {
                    handler(){
                        let self = [],
                            other = [];
                        if(!!this.chatData){
                            this.chatData.allChatList.forEach(_ => {
                                if (_.createBy == this.userId && !_.orderId) {
                                    self.push({ ..._
                                    })
                                } else {
                                    if(!_.orderId){
                                        other.push({ ..._
                                    })
                                    }
                                }
                            });
                        }
                        self = self.reverse();
                        other = other.reverse();
                        return {
                            self,
                            other
                        }
                        this.SOList.self = self;
                        this.SOList.other = other;
                    },
                    deep: true
                },
                uniqueAnswerNum:{
                    handler(newVal, oldVal) {
                        console.log('111newVal-answerNum', newVal.value);
                        if(newVal.value>0){
                            this.uniqueAnswerNums();
                        } else {
                            clearNewMessageRemind();
                            return false;
                        }
                    },
                    deep: true
                },
            }
        }
    };
    function scrollToBottom() {
        setTimeout(() => {
            let chatBox = document.querySelector('.chat-box');
            let chatList = document.querySelector('.chat-list');
            if (chatBox && chatList) {
                chatBox.scrollTo(0, chatList.offsetHeight)
            }
        }, 0)
    }

    var newMessageRemind = {
        _step: 0,
        _title: document.title,
        _timer: null,
        //显示新消息提示
        show:function(){
            // var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
            newMessageRemind._timer = setTimeout(function() {
                newMessageRemind.show();
                //这里写Cookie操作
                newMessageRemind._step++;
                // if (newMessageRemind._step == 3) { newMessageRemind._step = 1 };
                // if (newMessageRemind._step == 1) { document.title = "【　　　】" + '您有1条新消息'};
                // if (newMessageRemind._step == 2) { document.title = "【新消息】" + '您有1条新消息'};

                // if (newMessageRemind._step == 2) { document.title = "【新消息】" + temps };


                if (newMessageRemind._step % 2 == 0) {
                    document.title = `【新消息】您有1条新消息 ${window.BuyRCorpName}`
                } else {
                    document.title = `【　　　】您有1条新消息 ${window.BuyRCorpName}`
                }
            }, 800);
            return [newMessageRemind._timer, newMessageRemind._title];
        },
        //取消新消息提示
        clear: function(){
            clearTimeout(newMessageRemind._timer );
            document.title = newMessageRemind._title;
            //这里写Cookie操作
        }

    };
    // newMessageRemind.show();
    function clearNewMessageRemind() {
        newMessageRemind.clear();
    }

    function judgeCurrentPage() {
        console.log('执行buy-judgeCurrentPage');
        console.log('window.isCurrentPage.buy55', window.isCurrentPage.buy);
        if(window.isCurrentPage.buy) {
            newMessageRemind.clear();
            window.updateBuyStatus()
            document.title='沪深商贸';
        } else {
            newMessageRemind.show();
        }
    }


        //使用message对象封装消息
        // function newMessage(){
        //     var message = {
        //         time: 0,
        //         title: document.title,
        //         timer: null,
        //         // 显示新消息提示
        //         show: function() {
        //             var title = message.title
        //                 .replace('【　　　】', '')
        //                 .replace('【新消息】', '')
        //             // 定时器，设置消息切换频率闪烁效果就此产生
        //             message.timer = setTimeout(function() {
        //                 message.time++
        //                 message.show()
        //                 if (message.time % 2 == 0) {
        //                     document.title = `【新消息】您有1条新消息 ${window.BuyRCorpName}`
        //                 } else {
        //                     document.title = `【　　　】您有1条新消息 ${window.BuyRCorpName}`
        //                 }
        //             }, 800)
        //             return [message.timer, message.title]
        //         },
        //         // 取消新消息提示
        //         clear: function() {
        //             clearTimeout(message.timer)
        //             document.title = message.title
        //         }
        //     }
        //     message.show()
        // }

        // 页面加载时绑定点击事件，单击取消闪烁提示
        // function bind() {
        //     document.onclick = function () {
        //         message.clear();
        //     };
        // }
</script>

<style lang="scss">
    @import './chat-dialog.scss'
</style>
