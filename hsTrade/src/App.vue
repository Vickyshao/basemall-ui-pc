<template>
    <div id="app">
        <vheader v-if="!isHome"></vheader>
        <vnav v-if="!isHome&&!isSupplyChat&&!isBuyChat" :nav-data="navData"></vnav>
        <router-view></router-view>
        <vfooter></vfooter>
        <vloginBox></vloginBox>
        <!-- <chat-buy-dialog></chat-buy-dialog>
        <chat-supply-dialog></chat-supply-dialog> -->
    </div>
</template>

<script>
    window.indexNotice = null;
    window.noticeMessage = null;
    window.resetPassword = null;
    window.updateBuyChat = null;
    window.updateSupplyChat = null;
    if(!window.chat){
        window.chat={disId:null};
    }
    if(!window.uniqueAskNum){
        window.uniqueAskNum={value:null};
    }
    if(!window.uniqueAnswerNum){
        window.uniqueAnswerNum={value:null};
    }

    if(!window.unreadAskList){
        window.unreadAskList={value:null};
    }
    if(!window.unreadAnswerList){
        window.unreadAnswerList={value:null};
    }
    if(!window.isCurrentPage) {
        window.isCurrentPage ={supply:false, buy:false}
    }

    import vheader from "./components/header/header.vue";
    import vnav from "./components/nav.vue";
    import vloginBox from "./components/loginBox.vue";
    import vfooter from "./components/footer/footer.vue";
    import loginBoxVue from './components/loginBox.vue';
    // import chatBuyDialog from "./components/chat/chat-buy.vue";
    // import chatSupplyDialog from "./components/chat/chat-supply.vue";
    export default {
        name: "app",
        data() {
            return {
                isHome: false,
                isSupplyChat: false,
                isBuyChat: false,
                dialogData: {
                    dialogVisible: false
                },
                navData: {
                    LoginIn: true,
                    breadNames: [],
                    currentBread: []
                },
                chat: null,
                uniqueAskNum: 0,
                uniqueAnswerNum: 0
            }
        },
        created() {
            this.init(this.$route);
            // this.$store.state.userData.userType
            // this.getLoginState();
        },
        components: {
            vheader,
            vnav,
            vfooter,
            vloginBox,
            // chatBuyDialog,
            // chatSupplyDialog
        },
        methods: {
            init(to) {
                this.checkUD();
                this.initCurrentBread();
                this.isHome = this.$route.name == "首页";
                this.isSupplyChat = this.$route.path == "/supply/chat";
                this.isBuyChat = this.$route.path == "/buy/chat";
                this.navData.LoginIn = this.$route.name != "登录" && this.$route.name != "忘记登录密码";
                this.pageNotFound(to)
                this.setAddr();
                this.chat = window.chat;
                this.uniqueAnswerNum = window.uniqueAnswerNum;
                this.uniqueAskNum = window.uniqueAskNum;
                localStorage.Envir = window.location.host.includes('localhost')?'localhost':window.location.host.includes('dev.basemall.cn')?'dev':'';
            },
            setAddr() {
                if (!localStorage.getItem('addrData')) {
                    this.$ajax.post('/basemall-shop/shop-goods/select-district-list').then((res) => {
                        localStorage.setItem('addrData',JSON.stringify(res.json));
                    });
                }
            },
            getLoginState() {
                let token=localStorage.getItem('_token')||null;
                this.$ajax.post('/basemall-account/login/get-login-status',{token}).then((res) => {
                    console.log(res);
                })
            },
            initCurrentBread() {
                let currentBread = [...this.$route.matched].map(a => {
                    return {
                        name: a.name,
                        path: a.path
                    };
                });
                currentBread.unshift({
                    name: "首页",
                    path: "/"
                });
                this.navData.currentBread = currentBread;
                this.navData.breadNames = currentBread.map(bread => bread.name);
            },
            checkUD() {
                let UD = localStorage.getItem("UD");
                if (!!UD && UD != "null") {
                    this.$store.state.userData = JSON.parse(UD);
                } else {
                    this.$store.state.userData = {};
                };
                this.isShowUsercenter(!!this.$store.state.userData.userType);
            },
            isShowUsercenter(show) {
                let i;
                this.$store.state.navTree.forEach((x, xi) => {
                    if (x.name == "会员中心") {
                        i = xi;
                    }
                });
                this.$store.state.navTree[i].show = show;
            },
            pageNotFound(to) {
                let arr = [];
                this.$store.state.navTree.forEach((nav) => {
                    arr.push(nav.name)
                    if (nav.children) {
                        nav.children.forEach((c) => {
                            arr.push(c.name)
                        })
                    }
                });
                if (arr.indexOf(to.name) == -1) {
                    this.$router.push({
                        path: '/404'
                    })
                }
            },
        },
        computed: {},
        watch: {
            $route(to,old) {
                this.init(to);
                clearInterval(window.indexNotice);
                if(to.path!='/supply/chat' || to.path!='/buy/chat') {
                    clearTimeout(window.updateBuyChat);
                    window.updateBuyChat = null;
                    clearTimeout(window.updateSupplyChat);
                    window.updateSupplyChat = null;

                    window.RCorpName = null;
                    window.BuyRCorpName = null;

                    window.uniqueAnswerNum=null;

                }

                if(to.path=='/supply/chat' || to.path=='/buy/chat') {
                    window.uniqueAskNum.value= 0;
                    window.uniqueAnswerNum.value = 0
                }

                if(to.path == '/user-center/message-list' && old.fullPath == window.detailMsgPath){
                    window.setMsgTabTag = true
                }else{
                    window.setMsgTabTag = false
                }
                if(window.hideUserAside){
                    window.hideUserAside.val = false
                }
                if(window.sendSuccess){
                    window.sendSuccess.status = false
                    window.sendSuccess.num = ''
                    window.sendSuccess.id = 0
                }
            },
        }
    };

var newMessageRemind={
	_step: 0,
    _title: document.title,
    _timer: null,
	//显示新消息提示
	show:function(){
		var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
		 newMessageRemind._timer = setTimeout(function() {
            newMessageRemind.show();
			//这里写Cookie操作
            newMessageRemind._step++;
            if (newMessageRemind._step == 3) { newMessageRemind._step = 1 };
            if (newMessageRemind._step == 1) { document.title = "【　　　】" + temps };
            if (newMessageRemind._step == 2) { document.title = "【新消息】" + temps };
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
</script>

<style lang="scss">
    #app {
        background-color: #f1f1f1;
    }
</style>
