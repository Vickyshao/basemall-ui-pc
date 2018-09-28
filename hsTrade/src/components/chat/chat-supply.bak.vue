<template>
    <div>
        <div v-if="!isCreateOrder||!isShowGenerated" class="chat-wrapper">
            <div class="chat-container clear">
                <div class="top">
                    <!-- <div class="title color-blue">卖方: {{corpName}}</div> -->
                    <div class="title color-blue">卖方: {{chatData.remoteCorpName}}</div>
                </div>
                <div class="bot">
                    <div class="left">
                        <div class="tops">
                            <div v-if="isShowSeeMore&&!!chatList&&chatList.total>10" class="seeMore" @click="seeMore">点击查看更多消息</div>
                            <div class="chat-box chat-box-supply">
                                <ul class="chat-list chat-list-supply">
                                    <li class="chat-item offer" :class="{self:userId==x.createBy&&!x.orderId,other:userId!=x.createBy&&!x.orderId,'':!!x.orderId}" v-for="x in pageDatas">
                                        <div class="chat-content" v-if="!x.orderId">
                                            <p>{{x.letterContent}} <span class="color-red">{{!!x.remark?x.remark:''}}</span></p>
                                            <p class="chat-content-top">
                                                {{userId!=x.createBy?"卖方":"我"}} {{x.createTime|formatTime("YMDHMS")}}
                                            </p>
                                        </div>
                                        <div v-if="x.orderId" class="order">{{x.letterContent}}:<span class="color-red">{{x.orderNo}},</span>
                                            <span class="text-href" @click="viewOrderDetail(x)">点击查看</span>
                                        </div>
                                    </li>
                                    <li v-if="!pageDatas||pageDatas.length==0" style="text-align:center">暂无未读消息</li>
                                    <!-- <li class="created" v-if="chatList.length>0&&!!chatList[chatList.length-1].orderId" style="margin-bottom:28px">
                                            卖方已同意买方对 {{detail.name}}
                                                <span class="tag-list" v-if="paramsDetail&&paramsDetail.length>0">
                                                    <span class="tag" v-for="x in paramsDetail">{{x.value}}</span>
                                                </span> 的询价,价格：{{partinerPrice}}，数量：{{partinerNum}},订单已生成，订单编号:
                                            <span class="text-danger color-red">{{chatList[chatList.length-1].orderNo}},</span>
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
                                    <span v-if="detail.status!=2||detail.dataQuantity<=0" class="m-l-md text-href">全买</span>
                                    <span v-if="detail.status==2&&detail.dataQuantity>0" class="m-l-md text-href" @click="(count=detail.dataQuantity,amount=detail.price)">全买</span>
                                    <em class="tips" v-if="!!tipCount">　　  {{tipCount}}</em>
                                </div>
                                <div>
                                    <el-button id="sendBtn" class="btn color-blue" type="primary" @click="send" :disabled="detail.status!=2||detail.dataQuantity<=0">发送</el-button>
                                </div>
                            </div>
                            <div class="partners">
                                <span class="fl">目前对方认可的价格及数量为</span>
                                <div class="prices">
                                    <span class="color-red">{{partinerPrice}}<em> 元</em></span>
                                    <span class="color-red">{{partinerNum}}<em> {{detail.unit}}</em></span>
                                </div>
                                <div>是否以此价格下单</div>
                                <div>
                                    <el-button class="btn createOrder color-orange" type="warning" @click="createOrder" :loading="isInsertOrder" :disabled="detail.status!=2||detail.dataQuantity<=0">下单</el-button>
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
        <div v-if="isCreateOrder&&isShowGenerated">
            <order-generated :order-data="orderData"></order-generated>
        </div>
    </div>
</template>

<script>
    require('../../js/IM/NIM_Web_NIM_v5.2.0.js')
    require('../../js/IM/NIM_Web_SDK_v5.2.0.js')
    import goodsDetail from './goodsDetail'
    import orderGenerated from './orderGenerated'
    export default {
        created() {
            this.uniqueAskNum = 0;
            this.chatData.remoteId = this.$route.query.remoteId;
            this.chatData.remoteCorpName = this.$route.query.remoteCorpName;
            window.RCorpName = this.chatData.remoteCorpName;
            window.updateStatus = this.updateStatus;

            if(!window.uniqueAskNum){
                window.uniqueAskNum={value:null};
            }

            this.chatData.itemDataIds = localStorage.getItem('itemDataIds');
            this.getGoodsDetail();
            document.addEventListener("visibilitychange", function() {
                if (!document.hidden) {
                    window.uniqueAskNum.value = 0;
                    // window.unreadAskList.value = 0;
                    window.unreadAskList = {value: 0};

                    newMessageRemind.clear();
                    window.isCurrentPage ={supply:true};
                    window.updateStatus();
                    document.title = '沪深商贸';
                } else {
                    window.isCurrentPage ={supply:false};
                }
                // judgeCurrentPage();
            });

            window.onfocus = function() {
                if (this.uniqueAskNum > 0) {
                    this.updateStatus();
                }
                document.title = '沪深商贸';
            };
            this.connect();
        },
        components: {
            goodsDetail,
            orderGenerated
        },
        data() {
            return {
                amount: null,
                count: 1,
                userId: null,
                tipCount: '',
                tipAmount: '',
                pageIndex: 1,
                pageSize: 10,
                pageDatas: null,
                isShowSeeMore: true,
                isShowGenerated: false,
                isCreateOrder: false,
                isFirstExec: true,
                disId: null,
                readStatus: null,
                // uniqueAskNum: 0,
                orderData: {
                    orderId: null,
                    orderType: 1
                },
                unreadAskList: null,
                isInsertOrder: false,
                refreshToken: localStorage.refreshToken
            }
        },
        methods: {
            connect(){
                connectSDK();
            },
            beforeClose(done) {
                done();
                this.amount = this.count = '';
                this.$store.commit('closeChatDialog')
            },
            getGoodsDetail() {
                let {
                    shopId,
                    itemDataIds
                } = this.chatData;
                let data = {
                    shopId: this.$route.query.id,
                    skuId: this.$route.query.skuId,
                    skuKeyId: this.$route.query.skuKeyId
                };
                // let data = {shopId: shopId,itemDataIds: itemDataIds.join(',')};
                this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', data).then((res) => {
                    this.$store.commit('updateChatGoodsInfo', res.goodsMap);
                    this.$store.commit('updateChatGoodsParamsInfo', res.itemList);
                    this.amount = this.detail.price;
                    // this.count = this.detail.dataQuantity;
                    if (this.detail.status != 2 || this.detail.dataQuantity <= 0) {
                        this.amount = null;
                        this.count = null;
                    }
                })
                this.uniqueDiscuss();
            },
            uniqueDiscuss() {
                this.$ajax.post('/basemall-message/discuss/unique-discuss', {
                    chatMethod: 1,
                    remoteId: this.chatData.remoteId,
                    goodsId: this.$route.query.id,
                    goodsPropertiesIds: this.$route.query.skuKeyId
                }).then((res) => {
                    this.disId = !!res?res.id:'';
                    this.getAllMsgList(this.chatData.remoteId);
                });
            },
            getAllMsgList() {
                clearTimeout(window.updateSupplyChat);
                window.updateSupplyChat = null;
                this.$ajax.post('/basemall-message/discuss/window-discuss-list', {
                    discussId: this.$route.query.disId || this.disId,
                    remoteId: this.chatData.remoteId,
                    goodsId: this.$route.query.id,
                    pageIndex: '',
                    pageSize: '',
                    chatMethod: 1
                }).then((res) => {
                    this.$store.commit('updateChatList', res);
                    this.userId = res.userId;
                    this.pageDatas = this.chatList.filter((x, i) => {
                        return i < this.pageIndex * this.pageSize
                    }).reverse();

                    // setTimeout(() => {
                        window.unreadAskList = {value:this.$store.state.globalData.noticeCount.askList};
                    // }, 40);
                    this.unreadAskList = window.unreadAskList;
                    if(window.isCurrentPage.supply) {
                        newMessageRemind.clear();
                        if(window.uniqueAskNum.value>0){
                            this.updateStatus();
                        }
                        window.unreadAskList.value = 0;
                    }

                    this.readStatus = this.pageDatas.length > 0 ? this.pageDatas[this.pageDatas.length - 1].readStatus : '';
                    window.chat.disId = this.pageDatas.length>0 ? this.pageDatas[0].discussId : null;
                    this.pageDatas.forEach((x, i) => {
                        // if(!!x&&x.orderId) {
                        //     this.orderData.orderId=x.orderId;
                        //     this.isShowGenerated = true;
                        // } else {
                        //     this.isShowGenerated = false;
                        // }
                        if (x.sellerId == this.userId) {
                            this.orderData.orderType = 2;
                        } else {
                            this.orderData.orderType = 1;
                        }
                    });

                    if (this.isFirstExec) {
                        // this.uniqueDiscuss();
                    } else {
                        if (this.chatList.length > 0) {
                            this.isFirstExec = false;
                        } else {
                            this.isFirstExec = true;
                        }
                    }
                    if (!!this.uniqueAskNum && this.uniqueAskNum > 0 && this.$route.path == '/supply/chat') {
                        // newMessage()
                    }
                    window.updateSupplyChat = setInterval(() => {
                        this.getAllMsgList(this.chatData.remoteId);
                    }, 10000);
                    setTimeout(scrollToBottom, 5);
                }).catch(() => {
                    this.$store.commit('updateChatList', []);
                })
            },
            getMsgList(id) {
                clearTimeout(window.updateSupplyChat);
                window.updateSupplyChat = null;
                this.$ajax.post('/basemall-message/discuss/window-discuss-list', {
                    discussId: this.$route.query.disId,
                    remoteId: id,
                    goodsId: this.$route.query.id,
                    pageIndex: 1,
                    pageSize: 10 * (this.pageIndex * 1),
                    chatMethod: 1
                }).then((res) => {
                    this.$store.commit('updateChatList', res);
                    this.userId = res.userId;
                    window.updateSupplyChat = setInterval(() => {
                        this.getMsgList(this.chatData.remoteId);
                    }, 10000);
                    setTimeout(scrollToBottom, 5);
                }).catch(() => {
                    this.$store.commit('updateChatList', []);
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
                //     this.$store.commit('updateNoticeCount',obj);
                //     window.noticeMessage=setTimeout(this.getCount,10000)
                // }).catch(()=>{
                //     if(!!window.noticeMessage){
                //         window.noticeMessage=setTimeout(this.getCount,10000)
                //     }
                // })
            },
            seeMore() {
                if (this.pageIndex < Math.ceil(this.chatList.total / 10)) {
                    this.pageIndex++;
                } else {
                    this.pageIndex = Math.ceil(this.chatList.total / 10);
                    this.isShowSeeMore = false;
                }
                clearTimeout(window.updateSupplyChat);
                window.updateSupplyChat = null;
                this.getAllMsgList(this.chatData.remoteId);
            },
            addLetter(content) {
                 this.sendTextMessage.bind(this);

                this.$ajax.post('/basemall-message/discuss/add-discuss', {
                    corpName: this.corpName,
                    goodsName: this.detail.name,
                    // goodsId: this.chatData.goodsInfo.id * 1,
                    goodsId: this.$route.query.id * 1,
                    goodsProperties: this.paramsVal,
                    goodsPropertiesIds: this.$route.query.skuKeyId,
                    chatMethod: 1,
                    recieverId: this.chatData.remoteId * 1,
                    letterContent: this.detail.name + '　' + this.paramsVal + content,
                    price: this.amount * 1,
                    amount: this.count * 1,
                    goodsUnit: this.detail.unit,
                    status: 2
                }).then((res) => {
                    if (!this.disId) {
                        this.disId = res.discussId;
                    }
                    if (this.isFirstExec) {
                        // this.uniqueDiscuss();
                    }
                    this.pageIndex = 1;
                    this.isShowSeeMore = true;
                    this.getAllMsgList(this.chatData.remoteId);
                    this.amount = null;
                    this.count = null;
                    setTimeout(scrollToBottom, 5);
                })
            },
            send() {
                this.validate(() => {
                    let letterContent = [`　询价:${this.amount}元`, ` 数量:${this.count}${this.detail.unit}`];
                    this.addLetter(letterContent.join(';'));
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
            getTotalAmountAndCount(content) {
                // let contentArr = content.split(';');
                let amt, count, price;
                // amt = contentArr[0].split(':')[1].replace(/[\u4E00-\u9FA5]/g, '');
                // count = contentArr[1].split(':')[1].replace(/[\u4E00-\u9FA5]/g, '');
                // price = content.price;
                // count = content.amount;
                price = this.partinerPrice;
                count = this.partinerNum;
                return {
                    amt: price * count,
                    count,
                    price
                }
            },
            createOrder() {
                let {
                    self,
                    other
                } = this.SOList;
                // if (!other || other.length == 0) {
                //     this.$message.warning('供应商未报价，不能下单！')
                // } else {
                if (this.partinerNum > this.detail.dataQuantity) {
                    this.$message.warning('目前对方认可的的数量小于剩余数量，请重新更改数量后下单');
                    return false;
                } else {
                    this.$confirm('是否根据当前报价价格下单？').then(_ => {
                        this.isInsertOrder = true;
                        let total = this.getTotalAmountAndCount(other[other.length - 1]);
                        let otherLast = this.SOList.other[this.SOList.other.length - 1];
                        this.$store.commit('updateOrderNums',total.count);
                        let data = {
                            // goodsId: this.chatData.shopId * 1,
                            goodsId: this.$route.query.id * 1,
                            sellerId: this.chatData.remoteId,
                            shippingAddress: this.detail.supplyAddress,
                            currency: 1,
                            meterUnit: this.detail.unit,
                            totalAmount: total.amt,
                            shopCount: total.count * 1,
                            type: this.chatData.type == 1 ? 2 : 1,
                            letterCenterId: !!this.chatList[this.chatList.length - 1] ? this.chatList[this.chatList.length - 1].letterCenterId : '',
                            letterContent: `卖方已同意买方对 ${this.detail.name} ${this.paramsVal}的询价, 价格: ${total.price}元，数量：${total.count}${this.detail.unit},订单已生成，订单编号`,
                            letterTitle: `${this.detail.name} 价格: ${total.price}元，数量：${total.count}${this.detail.unit}`,
                            skuId: this.$route.query.skuId,
                            skuQuantity: this.detail.dataQuantity,
                            goodsPropertiesIds: this.$route.query.skuKeyId,
                            corpName: this.chatData.remoteCorpName,
                            goodsName: this.detail.name,
                            goodsProperties: this.paramsVal,
                        };
                        if (total.count == this.detail.dataQuantity) {
                            data.shopStatus = 4
                        };
                        this.$ajax.post('/basemall-shop/shop-order/insert-order', data).then((res) => {
                            window.unreadAskList.value = 0;
                            this.isCreateOrder = true;
                            this.isShowGenerated = true;
                            this.orderData.orderId = res.orderId;
                            this.getGoodsDetail();
                            this.getAllMsgList(this.chatData.remoteId);
                        })
                    })
                }
                // }
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
                let data = {discussId: this.disId};
                this.$ajax.post('/basemall-message/discuss/update-discuss-status', data).then(() => {
                    // opt.data.readStatus=1
                })
            },
            uniqueAskNums() {
                // this.getCount();
                // setTimeout(() => {
                    let askList = this.$store.state.globalData.noticeCount.askList, a = 0;
                    if(!!askList && askList.length>0) {
                        askList.forEach((x)=>{
                            if(x.discussId == this.disId) {
                                a += 1;
                            }
                        });
                    }
                    window.uniqueAskNum.value = a;

                    if(window.uniqueAskNum.value>0 && this.$route.path == '/supply/chat'){
                        newMessageRemind.show();
                    } else {
                        window.uniqueAskNum.value = 0;
                        document.title='沪深商贸';
                        clearNewMessageRemind();
                        return;
                    }
                    return a;
                // }, 104);
            },
            // uniqueAskNum() {
            //     setTimeout(() => {
            //         let askList = this.$store.state.globalData.noticeCount.askList,
            //             a = 0;
            //         if (!!askList && askList.length > 0) {
            //             askList.forEach((x) => {
            //                 if (x.discussId == this.disId) {
            //                     a += 1;
            //                 }
            //             });
            //         }
            //         window.uniqueAskNum.value = a;
            //         this.uniqueAskNum = a;;
            //     }, 30);
            // },
        },
        computed: {
            chatData() {
                return this.$store.state.globalData.chatData
            },
            chatList() {
                return this.chatData.chatList;
            },
            remoteCorpName() {
                return this.chatData.chatList[0].remoteCorpName;
            },
            num() {
                return this.$store.state.globalData.noticeCount.unreadChatNum
            },
            show() {
                return this.chatData.showSupplyChat
            },
            SOList() {
                let self = [],
                    other = [];
                // if(!!this.chatData&&!!this.chatData.allChatList){
                if (!!this.chatList) {
                    this.chatList.forEach(_ => {
                        // if (_.createBy == this.detail.userId) {
                        if (_.createBy == this.userId && !_.orderId) {
                            self.push({ ..._
                            })
                        } else {
                            if (!_.orderId) {
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
            lastChat() {
                if (this.SOList.other) {
                    return this.SOList.other[this.SOList.other.length - 1];
                }
            },
            partinerPrice() {
                // let a, lPrice;
                // if(!!this.lastChat.letterContent&&this.lastChat.letterContent.split(' ')[0]) {
                //     a = this.lastChat.letterContent.split(' ')[0].replace(/[\u4E00-\u9FA5]/g,'');
                //     lPrice = a.includes(':')?a.replace(':',''):a;
                //     return lPrice;
                // } else {
                //     return '';
                // }
                if (!!this.lastChat && this.userId != this.lastChat.createBy) {
                    if (this.lastChat.letterContent.includes(this.paramsVal)) {
                        return this.lastChat.price * 1;
                    } else {
                        return this.detail.price * 1;
                    }
                } else {
                    return this.detail.price * 1;
                }
            },
            partinerNum() {
                // let a, lNum;
                // if(!!this.lastChat.letterContent && this.lastChat.letterContent.split(' ')[1]) {
                //     a = this.lastChat.letterContent.split(' ')[1].replace(/[\u4E00-\u9FA5]/g,'');
                //     lNum = a.includes(':')?a.replace(':',''):a;
                //     return lNum;
                // } else {
                //     return '';
                // }
                // return !!this.lastChat&&this.userId!=this.lastChat.createBy?this.lastChat.amount:this.detail.dataQuantity;
                if (!!this.lastChat && this.userId != this.lastChat.createBy) {
                    if (this.lastChat.letterContent.includes(this.paramsVal)) {
                        return this.lastChat.amount * 1;
                    } else {
                        return 1;
                    }
                } else {
                    return 1;
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
                        if (x.dataName.split(',').length > 1) {
                            let names = x.dataName.split(',');
                            names.forEach((x) => {
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
            paramsVal() {
                let vals = this.paramsDetail.map((x) => {
                    return x.value
                }).toString();
                vals = vals.includes(',') ? vals.replace(/\,/g, ' ') : vals;
                return vals;
            },
            lastContent() {
                if (this.chatList.length > 0) {
                    let last = this.chatList[this.chatList.length - 1].letterContent;
                    return last.split(';')
                } else {
                    return [];
                }
            },
            corpName() {
                return JSON.parse(localStorage.UD).corpName;
            },
            askList() {
                setTimeout(() => {
                    return this.$store.state.globalData.noticeCount.askList;
                }, 2);
            },
            chatNum(){
                let num = this.$store.state.globalData.noticeCount.unreadChatNum;
                return !!num?`(${num})`:''
            },
        },
        watch: {
            // num(val) {
            //     if (this.show) {
            //         this.getMsgList(this.chatData.remoteId);
            //     }
            // },
            show(val) {
                if (val) {
                    this.getGoodsDetail();
                }
            },
            // uniqueAskNum(val) {
            //     if (val > 0) {
            //         // newMessage();
            //     } else {
            //         this.updateStatus();
            //     }
            // },
            // chatNum(val){
            //     this.getAllMsgList(this.chatData.remoteId);
            // },

            // uniqueAskNum(val) {
            unreadAskList(val) {
                let lists = val.value||[], isHas=false;
                lists.forEach((x)=>{
                    if(x.discussId == this.disId){
                        isHas = true;
                    } else {
                        isHas = false;
                    }
                });
                if(!!val.value&&val.value.length>0&&isHas){
                    this.uniqueAskNums();
                    // this.getAllMsgList();
                } else {
                    newMessageRemind.clear();
                    document.title='沪深商贸';
                    return false;
                }
            },
            // uniqueAskNum: {
            //     handler(newVal, oldVal) {
            //         if(newVal.value>0){
            //             // this.uniqueAnswerNums();
            //             this.uniqueAskNums();
            //         } else {
            //             clearNewMessageRemind();
            //             return false;
            //         }
            //     },
            //     deep: true
            // },
            pageDatas(val) {
                // val.forEach((x,i) => {
                //     if (!!x.orderId) {
                //         return x;
                //         this.getGoodsDetail()
                //     }
                // });

                // if(!!val[val.length-1]&&!!val[val.length-1].orderId) {
                //     this.getGoodsDetail()
                // }

            },
            watch: {
                $route(to) {
                    this.init(to);
                    clearInterval(window.indexNotice);
                    if (to.path != '/supply/chat') {
                        clearTimeout(window.updateSupplyChat);
                        window.updateSupplyChat = null;
                    }
                },
                "chatData": {
                    handler() {
                        let self = [],
                            other = [];
                        if (!!this.chatData) {
                            this.chatData.allChatList.forEach(_ => {
                                if (_.createBy == this.userId && !_.orderId) {
                                    self.push({ ..._
                                    })
                                } else {
                                    if (!_.orderId) {
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
                // // if (newMessageRemind._step == 1) { document.title = "【　　　】" + temps };
                // if (newMessageRemind._step == 2) { document.title = "【新消息】" + '您有1条新消息'};
                // // if (newMessageRemind._step == 2) { document.title = "【新消息】" + temps };
                if (newMessageRemind._step % 2 == 0) {
                    document.title = `【新消息】您有1条新消息 ${window.RCorpName}`
                } else {
                    document.title = `【　　　】您有1条新消息 ${window.RCorpName}`
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
        if(window.isCurrentPage.supply) {
            newMessageRemind.clear();
            window.updateStatus();
            document.title='沪深商贸';
        } else {
            newMessageRemind.show();
        }
    }

    // 页面加载时绑定点击事件，单击取消闪烁提示
    function bind() {
        document.onclick = function() {
            message.clear();
        };
    }

    // IM Begin
    var data = {};
    var nim = new NIM({
        // 初始化SDK
        // debug: true
        appKey: '57bbce55b0631938cfbbaef5264206a4',
        account: '13412345678',
        token: 'hs123456',
        onconnect: onConnect,
        onerror: onError,
        onwillreconnect: onWillReconnect,
        ondisconnect: onDisconnect,
        // 多端
        onloginportschange: onLoginPortsChange,
        // 用户关系
        onblacklist: onBlacklist,
        onsyncmarkinblacklist: onMarkInBlacklist,
        onmutelist: onMutelist,
        onsyncmarkinmutelist: onMarkInMutelist,
        // 好友关系
        onfriends: onFriends,
        onsyncfriendaction: onSyncFriendAction,
        // 用户名片
        onmyinfo: onMyInfo,
        onupdatemyinfo: onUpdateMyInfo,
        onusers: onUsers,
        onupdateuser: onUpdateUser,
        // 群组
        onteams: onTeams,
        onsynccreateteam: onCreateTeam,
        onteammembers: onTeamMembers,
        onsyncteammembersdone: onSyncTeamMembersDone,
        onupdateteammember: onUpdateTeamMember,
        // 会话
        onsessions: onSessions,
        onupdatesession: onUpdateSession,
        // 消息
        onroamingmsgs: onRoamingMsgs,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg,
        // 系统通知
        onofflinesysmsgs: onOfflineSysMsgs,
        onsysmsg: onSysMsg,
        onupdatesysmsg: onUpdateSysMsg,
        onsysmsgunread: onSysMsgUnread,
        onupdatesysmsgunread: onUpdateSysMsgUnread,
        onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
        oncustomsysmsg: onCustomSysMsg,
        // 同步完成
        onsyncdone: onSyncDone
    });

    function onConnect() {
        console.log('连接成功');
    }
    function onWillReconnect(obj) {
        // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连', obj);
    }
    function onDisconnect(error) {
        // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('连接断开', error);
        if (error) {
            switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
                break;
            // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
            case 417:
                break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
                break;
            default:
                break;
            }
        }
    }
    function onError(error, obj) {
        console.log('发生错误', error, obj);
    }

    function onLoginPortsChange(loginPorts) {
        console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
    }

    function onBlacklist(blacklist) {
        console.log('收到黑名单', blacklist);
        data.blacklist = nim.mergeRelations(data.blacklist, blacklist);
        data.blacklist = nim.cutRelations(data.blacklist, blacklist.invalid);
        refreshBlacklistUI();
    }
    function onMarkInBlacklist(obj) {
        console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '黑名单', obj);
        if (obj.isAdd) {
            addToBlacklist(obj);
        } else {
            removeFromBlacklist(obj);
        }
    }
    function addToBlacklist(obj) {
        data.blacklist = nim.mergeRelations(data.blacklist, obj.record);
        refreshBlacklistUI();
    }
    function removeFromBlacklist(obj) {
        data.blacklist = nim.cutRelations(data.blacklist, obj.record);
        refreshBlacklistUI();
    }
    function refreshBlacklistUI() {
        // 刷新界面
    }
    function onMutelist(mutelist) {
        console.log('收到静音列表', mutelist);
        data.mutelist = nim.mergeRelations(data.mutelist, mutelist);
        data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid);
        refreshMutelistUI();
    }
    function onMarkInMutelist(obj) {
        console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表', obj);
        if (obj.isAdd) {
            addToMutelist(obj);
        } else {
            removeFromMutelist(obj);
        }
    }
    function addToMutelist(obj) {
        data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
        refreshMutelistUI();
    }
    function removeFromMutelist(obj) {
        data.mutelist = nim.cutRelations(data.mutelist, obj.record);
        refreshMutelistUI();
    }
    function refreshMutelistUI() {
        // 刷新界面
    }

    function onFriends(friends) {
        console.log('收到好友列表', friends);
        data.friends = nim.mergeFriends(data.friends, friends);
        data.friends = nim.cutFriends(data.friends, friends.invalid);
        refreshFriendsUI();
    }
    function onSyncFriendAction(obj) {
        console.log('收到好友操作', obj);
        switch (obj.type) {
        case 'addFriend':
            console.log('你在其它端直接加了一个好友' + obj);
            onAddFriend(obj.friend);
            break;
        case 'applyFriend':
            console.log('你在其它端申请加了一个好友' + obj);
            break;
        case 'passFriendApply':
            console.log('你在其它端通过了一个好友申请' + obj);
            onAddFriend(obj.friend);
            break;
        case 'rejectFriendApply':
            console.log('你在其它端拒绝了一个好友申请' + obj);
            break;
        case 'deleteFriend':
            console.log('你在其它端删了一个好友' + obj);
            onDeleteFriend(obj.account);
            break;
        case 'updateFriend':
            console.log('你在其它端更新了一个好友', obj);
            onUpdateFriend(obj.friend);
            break;
        }
    }
    function onAddFriend(friend) {
        data.friends = nim.mergeFriends(data.friends, friend);
        refreshFriendsUI();
    }
    function onDeleteFriend(account) {
        data.friends = nim.cutFriendsByAccounts(data.friends, account);
        refreshFriendsUI();
    }
    function onUpdateFriend(friend) {
        data.friends = nim.mergeFriends(data.friends, friend);
        refreshFriendsUI();
    }
    function refreshFriendsUI() {
        // 刷新界面
    }

    function onMyInfo(user) {
        console.log('收到我的名片', user);
        data.myInfo = user;
        updateMyInfoUI();
    }
    function onUpdateMyInfo(user) {
        console.log('我的名片更新了', user);
        data.myInfo = NIM.util.merge(data.myInfo, user);
        updateMyInfoUI();
    }
    function updateMyInfoUI() {
        // 刷新界面
    }
    function onUsers(users) {
        console.log('收到用户名片列表', users);
        data.users = nim.mergeUsers(data.users, users);
    }
    function onUpdateUser(user) {
        console.log('用户名片更新了', user);
        data.users = nim.mergeUsers(data.users, user);
    }

    function onTeams(teams) {
        console.log('群列表', teams);
        data.teams = nim.mergeTeams(data.teams, teams);
        onInvalidTeams(teams.invalid);
    }
    function onInvalidTeams(teams) {
        data.teams = nim.cutTeams(data.teams, teams);
        data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
        refreshTeamsUI();
    }
    function onCreateTeam(team) {
        console.log('你创建了一个群', team);
        data.teams = nim.mergeTeams(data.teams, team);
        refreshTeamsUI();
        onTeamMembers({
            teamId: team.teamId,
            members: owner
        });
    }
    function refreshTeamsUI() {
        // 刷新界面
    }
    function onTeamMembers(obj) {
        console.log('收到群成员', obj);
        var teamId = obj.teamId;
        var members = obj.members;
        data.teamMembers = data.teamMembers || {};
        data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
        data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
        refreshTeamMembersUI();
    }
    function onSyncTeamMembersDone() {
        console.log('同步群列表完成');
    }
    function onUpdateTeamMember(teamMember) {
        console.log('群成员信息更新了', teamMember);
        onTeamMembers({
            teamId: teamMember.teamId,
            members: teamMember
        });
    }
    function refreshTeamMembersUI() {
        // 刷新界面
    }

    function onSessions(sessions) {
        console.log('收到会话列表', sessions);
        data.sessions = nim.mergeSessions(data.sessions, sessions);
        updateSessionsUI();
    }
    function onUpdateSession(session) {
        console.log('会话更新了', session);
        data.sessions = nim.mergeSessions(data.sessions, session);
        updateSessionsUI();
    }
    function updateSessionsUI() {
        // 刷新界面
    }

    function onRoamingMsgs(obj) {
        console.log('漫游消息', obj);
        pushMsg(obj.msgs);
    }
    function onOfflineMsgs(obj) {
        console.log('离线消息', obj);
        pushMsg(obj.msgs);
    }
    function onMsg(msg) {
        console.log('收到消息', msg.text, msg.scene, msg.type,  msg);
        pushMsg(msg);
    }
    function pushMsg(msgs) {
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].sessionId;
        data.msgs = data.msgs || {};
        data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
    }

    function onOfflineSysMsgs(sysMsgs) {
        console.log('收到离线系统通知', sysMsgs);
        pushSysMsgs(sysMsgs);
    }
    function onSysMsg(sysMsg) {
        console.log('收到系统通知', sysMsg)
        pushSysMsgs(sysMsg);
    }
    function onUpdateSysMsg(sysMsg) {
        pushSysMsgs(sysMsg);
    }
    function pushSysMsgs(sysMsgs) {
        data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs);
        refreshSysMsgsUI();
    }
    function onSysMsgUnread(obj) {
        console.log('收到系统通知未读数', obj);
        data.sysMsgUnread = obj;
        refreshSysMsgsUI();
    }
    function onUpdateSysMsgUnread(obj) {
        console.log('系统通知未读数更新了', obj);
        data.sysMsgUnread = obj;
        refreshSysMsgsUI();
    }
    function refreshSysMsgsUI() {
        // 刷新界面
    }
    function onOfflineCustomSysMsgs(sysMsgs) {
        console.log('收到离线自定义系统通知', sysMsgs);
    }
    function onCustomSysMsg(sysMsg) {
        console.log('收到自定义系统通知', sysMsg);
    }

    function onSyncDone() {
        console.log('同步完成');
    }
</script>

<style lang="scss">
    @import './chat-dialog.scss'
</style>
