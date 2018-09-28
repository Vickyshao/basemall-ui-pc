<template>
<div class="business">
    <div class="business_list" v-loading="loading">
        <!-- <el-tabs v-model="tab" @tab-click="tabChecked" style="margin:30px 0">
            <el-tab-pane label="我发起的" name="1"></el-tab-pane>
            <el-tab-pane label="我收到的" name="2"></el-tab-pane>
        </el-tabs> -->
        <br/>
        <div class="message_main">
            <div class="message_header">
                <span class="mess_btn" :class="{active: sendType==1}" @click="changeSendType(1)">询价<em v-if="$store.state.globalData.noticeCount.askNum>0">（{{$store.state.globalData.noticeCount.askNum}}）</em></span>
                <span class="mess_btn" :class="{active: sendType==2}" @click="changeSendType(2)">报价<em v-if="$store.state.globalData.noticeCount.answerNum>0">（{{$store.state.globalData.noticeCount.answerNum}}）</em></span>
            </div>
            <div class="message_filter">
                <div class="users">
                    用户　<el-select v-model="user" clearable placeholder="请选择" @change="changeUser" @clear="clearUser">
                        <el-option
                        v-for="item in userList"
                        :key="item.remoteId"
                        :label="item.corpName"
                        :value="item.remoteId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    商品　<el-select v-model="goods" clearable placeholder="请选择" @change="changeGoods" @clear="clearGoods">
                        <el-option
                        v-for="item in goodsList"
                        :key="item.goodsId"
                        :label="item.goodsName"
                        :value="item.goodsId">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="message_body">
                <div class="message_list_main">
                    <ul class="message_list">
                        <li v-for="(x,i) in listData.list" :key="i" :class="{'colorBlue':x.readStatus==0||(userId==x.preSellerId&&x.readStatus==2)||(userId==x.preBuyerId&&x.readStatus==3)}" @click="openChat({type:chatType,data:x})">
                            <span>{{x.corpName||'-'}}</span>
                            <span>{{x.goodsName}}　{{x.goodsProperties}}</span>
                            <span>价格{{x.currentPrice}}元，数量{{x.currentAmount}}{{x.goodsUnit}}</span>
                            <span class="fr">{{x.updateTime|formatTime("YMDHMS")}}</span>
                        </li>
                        <!-- <li v-for="x in listData.list" :class="{'colorBlack':x.readStatus==0&&x.createBy!=userId}">
                            <span v-if="x.createBy==userId">
                                <i>我</i><i class="m-l-xs">回复了</i><i class="m-l-xs text-gray">{{x.remoteCorpName}}</i>
                            </span>
                            <span v-if="x.createBy!=userId">
                                <i class="text-gray">{{x.remoteCorpName}}</i><i class="m-l-xs">回复了</i><i class="m-l-xs">我</i>
                            </span>
                            <i class="text-href m-l-xs" @click="openChat({type:chatType,data:x})">[ {{x.letterContent}} ]</i>
                            <i class="text-gray fr">{{x.createTime|formatTime("YMDHMS")}}</i>
                        </li> -->
                        <!-- <li style="text-align:center" class="text-gray" v-if="!listData.total">暂无数据</li> -->
                        <p class="no-message" v-if="!listData.total"></p>
                    </ul>
                    <pagination v-if="!!listData.total" :page-data="listData" @page-changed="pageChanged"></pagination>
                </div>
            </div>
        </div>

    </div>
</div>
</template>
<script>
import pagination from '@/components/common/pagination'
export default {
    name: 'bussiness',
    created(){
        this.getUsersGoods();
        this.getList();
        window.businessGetList = this.getList;
        document.addEventListener("visibilitychange", function() {
            if (!document.hidden) {
                window.businessGetList();
            }
        });
    },
    components: {
        pagination
    },
    props:['chatNums'],
    data() {
        return {
            tab: '1',
            sendType: 1,
            loading:false,
            userId:null,
            skuKeyId: null,
            userList: null,
            user: null,
            goodsList: null,
            goods: null,
            isVisibility: false,
            listData: {
                pageIndex: 1,
                pageSize:10,
                total: 0,
                list:[]
            },
        };
    },
    methods: {
        getList(){
            this.loading=true;
            let data={
                // chatType:this.tab*1,
                chatMethod:this.sendType*1,
                selectedUserId: this.user || '',
                selectedGoodsId: this.goods || '',
                pageIndex:this.listData.pageIndex,
                pageSize:10
            };
            this.$ajax.post('/basemall-message/discuss/discuss-list',data).then((res)=>{
                let letters, pro;
                this.loading=false;
                this.listData.list=res.letterList||[];
                this.listData.total=res.total||0;
                this.userId=res.userId;
                this.preSellerCorpName = res.preSellerCorpName;
                this.preBuyerCorpName = res.preBuyerCorpName;
                let goodsList = [];
                if(!!this.user) {
                    this.listData.list.forEach((v,i) => {
                        if(goodsList.length>0){
                            goodsList.forEach((j,n)=>{
                                if(j.goodsId != v.goodsId){
                                    goodsList.push({
                                        'goodsId': v.goodsId,
                                        'goodsName': v.goodsName
                                    })
                                }
                            });
                        } else {
                            goodsList.push({
                                'goodsId': v.goodsId,
                                'goodsName': v.goodsName
                            })
                        }
                        let goodsIds=[], goodsNames=[], searchedGoodsList=[];
                        goodsList.forEach(x=>{
                            goodsIds.push(x.goodsId);
                            goodsNames.push(x.goodsName);
                        });
                        goodsIds = Array.from(new Set([...goodsIds]));
                        goodsNames = Array.from(new Set([...goodsNames]));
                        goodsIds.forEach((x,i)=>{
                            searchedGoodsList.push({
                                'goodsId': goodsIds[i],
                            });
                        });
                        searchedGoodsList.forEach((x,i)=>{
                            searchedGoodsList[i].goodsName = goodsNames[i];
                        });
                        this.goodsList = searchedGoodsList;
                    });
                } else if(!!this.goods){
                    let userList = [], searchedUserList = [];
                    if(this.sendType == 1){
                         this.listData.list.forEach((v,i) => {
                            // v.remoteId = this.userId==v.preBuyerId?v.preSellerId:v.preBuyerId;
                            // v.remoteName = this.userId==v.preBuyerId?v.preSellerCorpName:v.preBuyerCorpName;

                            // v.remoteName = this.userId !=v.createBy?v.preSellerCorpName:v.preBuyerCorpName;
                            // v.remoteId = this.userId != v.createBy?v.preSellerId:v.preBuyerId;

                            // if(this.userId == v.createBy) {
                                v.remoteName = JSON.parse(localStorage.UD).corpName==v.corpName?v.preBuyerCorpName:v.preSellerCorpName;
                                v.remoteId = JSON.parse(localStorage.UD).corpName==v.corpName?v.preBuyerId:v.preSellerId;
                            // } else {
                            //     v.remoteName = JSON.parse(localStorage.UD).corpName==v.corpName?v.preSellerCorpName:v.preBuyerCorpName;
                            //     v.remoteId = JSON.parse(localStorage.UD).corpName==v.corpName?v.preSellerId:v.preBuyerId;
                            // }

                            // if(v.corpName==v.preBuyerCorpName) {
                            //     v.remoteName = v.preSellerCorpName;
                            //     v.remoteId = v.preSellerId;
                            // } else {
                            //     v.remoteName = v.preBuyerCorpName;
                            //     v.remoteId = v.preBuyerId;
                            // }
                         });
                    } else {
                        this.listData.list.forEach((v,i) => {
                            // v.remoteId = this.userId==v.preBuyerId?v.preSellerId:v.preBuyerId;
                            // v.remoteName = this.userId==v.preBuyerId?v.preSellerCorpName:v.preBuyerCorpName;

                            // if(this.userId == v.createBy) {
                                v.remoteName = JSON.parse(localStorage.UD).corpName==v.corpName?v.preSellerCorpName:v.preBuyerCorpName;
                                v.remoteId = JSON.parse(localStorage.UD).corpName==v.corpName?v.preSellerId:v.preBuyerId;
                            // }
                            //  else {
                            //     v.remoteName = JSON.parse(localStorage.UD).corpName==v.preBuyerCorpName?v.preBuyerCorpName:v.preSellerCorpName;
                            //     v.remoteId = JSON.parse(localStorage.UD).corpName==v.preBuyerCorpName?v.preBuyerId:v.preSellerId;
                            // }

                            // if(this.userId==v.preSellerId) {
                            //     v.remoteName = v.preBuyerCorpName;
                            //     v.remoteId = v.preBuyerId;
                            // } else {
                            //     v.remoteName = v.preSellerCorpName;
                            //     v.remoteId = v.preSellerId;
                            // }
                         });
                    }
                    this.listData.list.forEach((v,i) => {
                        if(userList.length>0){
                            userList.push({
                                'corpName': v.corpName,
                                'remoteId': v.remoteId
                            })
                        } else {
                            userList.push({
                                'corpName': v.corpName,
                                'remoteId': v.remoteId
                            })
                        }
                        let corpNames=[], remoteIds=[];
                        userList.forEach(x=>{
                            corpNames.push(x.corpName);
                            remoteIds.push(x.remoteId);
                        });
                        corpNames = Array.from(new Set([...corpNames]));
                        remoteIds = Array.from(new Set([...remoteIds]));
                        searchedUserList = [];
                        corpNames.forEach((x,i)=>{
                            searchedUserList.push({
                                'corpName': corpNames[i],
                            });
                        });
                        searchedUserList.forEach((x,i)=>{
                            searchedUserList[i].remoteId = remoteIds[i];
                        });
                        let a = searchedUserList.filter((v,i)=>{
                            return  v.corpName!=JSON.parse(localStorage.UD).corpName;
                        });
                        this.userList = a;
                    });
                }

                this.listData.list.forEach((x)=>{
                    x.letterContent = x.letterContent.includes(';') ?x.letterContent.replace(/\;/g, ','):x.letterContent;
                    x.letterContent = x.letterContent.includes(':') ?x.letterContent.replace(/\:/g, ''):x.letterContent;
                    x.proName = pro[0];
                    x.attr = pro[1];

                    // if(JSON.parse(localStorage.UD).id==x.preSellerId) {
                    //     if(x.readStatus==2){
                    //         this.updateStatus(x);
                    //         this.getList();
                    //     }
                    // } else {
                    //     if(x.readStatus==3){
                    //         this.updateStatus(x);
                    //         this.getList();
                    //     }
                    // }
                });
            }).catch(()=>{
                this.loading=false
            })
        },
        updateStatus(x) {
            let data={discussId: x.id};
            this.$ajax.post('/basemall-message/discuss/update-discuss-status',data).then(()=>{
                x.readStatus=1
            })
        },
        getUsersGoods() {
            this.$ajax.get(`/basemall-message/discuss/discuss-users-goods?chatMethod=${this.sendType}`).then((res)=>{
                this.goodsList = res.goodsList;
                this.userList = res.userList;
            });

        },
        tabChecked() {
            this.sendType = 1;
            this.listData.pageIndex=1;
            this.getList()
        },
        pageChanged(pageIndex) {
            this.listData.pageIndex=pageIndex;
            this.getList()
        },
        changeSendType(i) {
            this.sendType = i;
            this.listData.pageIndex=1;
            this.user = '';
            this.goods = '';
            this.getList();
            this.getUsersGoods();
        },
        openChat(opt) {
            let skuKeyId = opt.data.goodsPropertiesIds,remoteCorpName;
            //如果是买方发的消息，聊天窗口名字显示为卖方的公司名称
            if(this.sendType == 1){
                if(opt.data.corpName==opt.data.preBuyerCorpName) {
                    remoteCorpName = opt.data.preSellerCorpName;
                } else {
                    remoteCorpName = opt.data.preBuyerCorpName;
                }
                if(this.userId!=opt.data.createBy) {
                    remoteCorpName = opt.data.preSellerCorpName;
                }
                if(opt.data.corpName==opt.data.createBy) {
                    remoteCorpName = opt.data.preBuyerCorpName;
                }

                if(this.userId == opt.data.createBy) {
                    remoteCorpName = JSON.parse(localStorage.UD).corpName==opt.data.corpName?opt.data.preBuyerCorpName:opt.data.preSellerCorpName;
                }
            } else {
                if(this.userId==opt.data.preSellerId) {
                    remoteCorpName = opt.data.preBuyerCorpName;
                } else {
                    remoteCorpName = opt.data.preSellerCorpName;
                }

                if(this.userId == opt.data.createBy) {
                    remoteCorpName = JSON.parse(localStorage.UD).corpName==opt.data.preBuyerCorpName?opt.data.preSellerCorpName:opt.data.preBuyerCorpName;
                }

                // if(opt.data.corpName==opt.data.preBuyerCorpName) {
                //     remoteCorpName = opt.data.preSellerCorpName;
                // } else {
                //     remoteCorpName = opt.data.preBuyerCorpName;
                // }
            }
            if(opt.data.readStatus==0){
                this.updateStatus(opt.data);
                this.getList();
            } else {
                if(JSON.parse(localStorage.UD).id==opt.data.preSellerId) {
                    if(opt.data.readStatus==2){
                        this.updateStatus(opt.data);
                        this.getList();
                    }
                } else {
                    if(opt.data.readStatus==3){
                        this.updateStatus(opt.data);
                        this.getList();
                    }
                }
            }
            // if(opt.data.preSellerId==JSON.parse(localStorage.UD).id) {
            //     remoteCorpName = opt.data.createBy==JSON.parse(localStorage.UD).id?opt.data.corpName:JSON.parse(localStorage.UD).corpName;
            // } else {
            //     //我发送的
            //     remoteCorpName = opt.data.createBy==opt.data.preSellerId?opt.data.preBuyerCorpName:opt.data.preSellerCorpName;
            // }
            let shopId = opt.data.goodsId, newTab,to;
            if(opt.data.readStatus==0){
                let url='/basemall-message/discuss/update-discuss-status',
                    data={discussId:opt.data.id};
                this.$ajax.post(url,data).then(()=>{
                    opt.data.readStatus=1
                })
            };

            let remoteId=(opt.data.createBy==this.userId)?opt.data.recieverId:opt.data.createBy;

            this.$store.commit('showChatDialog', {
                remoteId:remoteId,
                type: opt.type,
                shopId:opt.data.goodsId,
                itemDataIds:!!opt.data.goodsProperties?opt.data.goodsProperties.split(','):[]
            })
            // this.sendType == 1?this.$router.push({path: `/supply/chat?id=${shopId}&skuKeyId=${skuKeyId}&remoteId=${remoteId}`}):this.$router.push({path: `/buy/chat?id=${shopId}&skuKeyId=${skuKeyId}&remoteId=${remoteId}`});
            to = this.sendType == 1? `#/supply/chat?id=${shopId}&skuId=${opt.data.skuId}&skuKeyId=${skuKeyId}&disId=${opt.data.id}&remoteId=${remoteId}&remoteCorpName=${remoteCorpName}`: `#/buy/chat?id=${shopId}&skuId=${opt.data.skuId}&skuKeyId=${skuKeyId}&disId=${opt.data.id}&remoteId=${remoteId}&remoteCorpName=${remoteCorpName}`;
            newTab = window.open('about:blank');
            newTab.location.href = to;
        },
        changeUser(){
            this.getList();
        },
        changeGoods(){
            this.getList();
        },
        clearUser(){
            if(!this.goods || (!this.user&&!this.goods)) {
                this.getUsersGoods();
            }
        },
        clearGoods(){
            if(!this.user || (!this.user&&!this.goods)) {
                this.getUsersGoods();
            }
        },
    },
    computed:{
        chatType(){
            let type=1;
            if(this.tab==1){
                type=this.sendType==1?1:2
            }else{
                type=this.sendType==2?1:2
            };
            return type
        },
        askNum(){
            return this.$store.state.globalData.noticeCount.askNum;
        },
        answerNum(){
            return this.$store.state.globalData.noticeCount.answerNum;
        },
        chatNum(){
            let num = this.$store.state.globalData.noticeCount.unreadChatNum;
            return !!num?`(${num})`:''
        },
    },
    watch: {
        askNum(val){
            this.getList();
        },
        answerNum(val){
            this.getList();
        },
        chatNum(val){
            this.getList();
        },
    }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/comcss/com_UI.less';
.business {
    .business_title {
        font-size: 22px;
        padding-bottom: 25px;
        border-bottom: 1px solid @line-color;
    }
    .business_list {
        .message_main {
            .message_header {
                .mess_btn {
                    display: inline-block;
                    width: 116px;
                    height: 42px;
                    line-height: 42px;
                    text-align: center;
                    border-radius: 5px;
                    vertical-align: middle;
                    cursor: pointer;
                    font-size: 18px;
                    border: 1px solid #ebebeb;
                    color: #bbb;
                    margin-right: 30px;
                }
                .mess_btn:hover {
                    border: 1px solid @text-color-blue;
                    color: @text-color-blue;
                }
                .mess_btn.active {
                    border: 1px solid @text-color-blue;
                    color: @text-color-blue;
                }
            }
            .message_filter {
                display: table;
                width: 100%;
                border: 1px solid #ebebeb;
                background: #f5f8fb;
                margin-top: 26px;
                color: #000;
                padding: 18px 25px;
                box-sizing: border-box;
                .users {
                    float: left;
                    margin-right: 72px;
                }
                .el-select {
                    width: 271px;

                }
            }
            .message_body {
                width: 100%;
                margin-top: 22px;
                .message_list {
                    top: 0;
                    left: 0;
                    .no-message{
                        width: 100%;
                        height: 280px;
                        background: url(/static/img/user/no-message.png) no-repeat center center;
                    }
                    li {
                        height: 60px;
                        line-height: 60px;
                        border-bottom: 1px solid @line-color;
                        color: #000;
                        cursor: pointer;
                        span {
                            display: inline-block;
                            width: 24%;
                            margin-right: 2%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            &:nth-child(2) {
                                width: 28%;
                            }
                            &:nth-child(3){
                                width: 19%;
                            }
                           &:last-child{
                                width: 18%;
                                margin-right: 0;
                            }
                        }
                    }
                    .colorBlue {
                        color: #1650a2;
                    }
                }
            }
        }
    }
}
</style>
