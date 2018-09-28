import Vue from 'vue'
import Vuex from 'vuex'
import routes from './router/alias'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        navTree: [...routes],
        uuid:'',
        userData: {
            userType: 1, //3:融资用户, 1:供求用户
        },
        globalData:{
            isLogin:false,
            noticeCount:{ //右上角未读消息通知数量
                unreadOrderNum: 0, //订单消息数量（供求用户）
                unreadSysNum: 0, //系统消息数量（所有用户）
                unreadChatNum: 0, //聊天消息数量（供求用户）
                unreadDealNum: 0, //交易消息数量（融资用户）
                unreadConfigNum: 0, //推送消息数量（融资用户）
            },
            chatData:{ //聊天框数据
                type:1, //1询价，2报价
                showBuyChat:false, //询价框显示状态
                showSupplyChat:false, //报价框显示状态
                shopId:null, //商品id
                itemDataIds:null, //商品参数ids
                goodsInfo:{}, //商品详情
                goodsParamsInfo:[], //商品参数
                chatList:[], //聊天记录列表
                remoteId:null, //对方用户id
            },
            addrData: null, //省市区三级联动json
            orderNums: null, //询报价下单数量
            msgDatas: [],
            message_option:null,
            isRead:null,
            chatnum:0,//聊天消息(liuli)
        }
    },
    mutations:{
        updateNoticeCount(state,obj){ //更新右上角未读消息数量
            state.globalData.noticeCount.unreadSysNum = obj[4]||0;
            state.globalData.noticeCount.unreadOrderNum = obj[5]||0;
            state.globalData.noticeCount.unreadChatNum = obj[6]||0;
            state.globalData.noticeCount.unreadDealNum = obj[7]||0;
            state.globalData.noticeCount.unreadConfigNum = obj[8]||0;
            state.globalData.noticeCount.answerList = obj.answerList||0;
            state.globalData.noticeCount.askList = obj.askList || 0;
            let answerList = state.globalData.noticeCount.answerList, answerSum=0;
            let askList = state.globalData.noticeCount.askList, askSum=0;
            if(answerList.length>0) {
                answerList.forEach(x => {
                    answerSum += x.unreadCount;

                    window.chat.disId = answerList[0].discussId;
                });
            }

            if (askList.length>0) {
                askList.forEach(x => {
                    askSum += x.unreadCount;

                    window.chat.disId = askList[0].discussId;
                });
            }

            state.globalData.noticeCount.answerNum = answerSum;
            state.globalData.noticeCount.askNum = askSum;
            state.globalData.noticeCount.unreadChatNum = askSum + answerSum;
        },
        updateAddrData(state,obj){
            state.globalData.addrData=obj;
        },
        showChatDialog(state,opt){ //显示聊天框
            state.globalData.chatData.remoteId=opt.remoteId; //赋值对方用户id
            state.globalData.chatData.type=opt.type||1; //赋值聊天类型
            state.globalData.chatData.shopId=opt.shopId; //赋值商品id，聊天框右侧商品详情展示需要该字段
            state.globalData.chatData.itemDataIds=opt.itemDataIds; //赋值商品属性ids，聊天框右侧商品详情展示需要该字段
            setTimeout(() => {
                //type为1打开询价框，type为2打开报价框
                if(opt.type==1){
                    state.globalData.chatData.showBuyChat = true
                }else{
                    state.globalData.chatData.showSupplyChat = true
                }
            },0);
        },
        closeChatDialog(state){ //关闭聊天框并重置聊天框参数
            state.globalData.chatData.showBuyChat = false;
            state.globalData.chatData.showSupplyChat = false;
            state.globalData.chatData.shopId = null;
            state.globalData.chatData.itemDataIds = null;
            state.globalData.chatData.goodsInfo={};
            state.globalData.chatData.goodsParamsInfo=[];
            state.globalData.chatData.cahtList=[];
        },
        updateChatGoodsInfo(state,dtl){
            state.globalData.chatData.goodsInfo=dtl
        },
        updateChatGoodsParamsInfo(state,dtl){
            state.globalData.chatData.goodsParamsInfo=dtl
        },
        updateChatList(state,obj){
            if(obj instanceof Array){
                state.globalData.chatData.chatList=obj;
                state.globalData.chatData.chatList.total = obj.total;
            }else{
                state.globalData.chatData.chatList = obj.discussList;
                state.globalData.chatData.chatList.total = obj.total;

            }
        },
        updateAllChatList(state, obj){
            state.globalData.chatData.allChatList = obj.discussList;
        },
        updateOrderNums(state, obj){
            state.globalData.orderNums = obj;
        },
        showLoginBox(state) {
            state.globalData.isLogin = true
        },
        closeLoginBox(state) {
            state.globalData.isLogin = false
        },
        updateMsgDatas(state, obj) {
            let option = {}, ele = {}, eles=[];
            if(obj.length>1) {
                obj.forEach((x,i)=>{
                    option = {
                        scene: x.scene||'',
                        to: x.to,
                        from: x.from,
                        text: x.text,
                    }
                    ele.lastMsg = option
                    ele.updateTime = x.time
                    eles.push(ele);
                    option = {};
                    ele = {};
                });
                state.globalData.msgDatas.unshift(...eles);
            } else {
                state.globalData.msgDatas.unshift(obj);
            }
        },
        updateMsgOption(state,option){
            state.globalData.message_option = option
        },
        updateRead(state,obj){
            state.globalData.isRead = obj
        },
        updataChatnum(state,nim){
            console.log('执行了更新聊天消息的函数')
            let num = 0
            nim.getLocalSessions({
                limit: 100,
                done:getLocalSessionsDone
            });
            function getLocalSessionsDone(error,obj){
                if(!error){
                    let sessions = obj.sessions
                    sessions.forEach(v=>{           
                        if(v.lastMsg){
                            num = num + v.unread
                        }                       
                    })
                }
                state.globalData.chatnum = num
                console.log(num)
            }
            
        }
    }
})
