<template>
<div class="pub_header">
    <div class="pub_top">
        <input type="hidden" name="username" v-model="username">
        <div class="pub_container">
            <div class="header_phone">客服热线：<b>{{phoneNum}}</b>（{{workTimes}}）</div>
            <div class="user_message">
                <div class="release block_first" v-show="!!username && $store.state.userData.userType==1">
                    <el-dropdown>
                        <span class="el-dropdown-link">
							快速发布<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="发布商品">
                                <el-button type="text" :disabled="!userRoot.root" @click="toPublish(1)">发布商品</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item command="发布求购">
                                <el-button type="text" :disabled="!userRoot.root" @click="toPublish(2)">发布求购</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="header_user block">
                    您好，
                    <span v-show="username">{{username|subStrMobile}}</span>
                    <span v-show="!username">游客</span>
                </div>
                <div class="header_login block">
                    <div v-if="!username">
                        <!-- <span class="header_link"><router-link to=''>[注册]</router-link></span> -->
                        <router-link v-if="isLoginPage" class="blue_link" to='/login'>[登录]</router-link>
                    </div>
                    <div v-if="!!username">
                        <span class="header_link"><span class="blue_link" @click="loginOut">[安全退出]</span></span>
                        <span class="header_link" v-if="$store.state.userData.userType==1"><router-link class="blue_link" to='/user-center/order-list'>[我的订单]</router-link></span>
                        <span class="header_link">消息(<router-link class="blue_link" to='/user-center/message-list'>{{num}}</router-link>)</span>
                        <span class="header_link">聊天(<router-link tag='a' target="_blank" class="blue_link" to='/supply/chat'>{{chatnum}}</router-link>)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'pub_header',
    data() {
        return {
            data:{},
            phoneNum:'',
            workTimes:'',
            userRoot:{root:false}
        }
    },
    methods: {
        loginOut() {
            this.$confirm('确定退出登录？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get('/basemall-account/login/login-out').then((res) => {
                    localStorage.removeItem('UD');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('UR');
                    this.$store.state.userData={};
                    this.$router.push({
                        path: '/'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
			});
            clearTimeout(window.noticeMessage);
            clearTimeout(window.updateBuyChat);
            window.updateBuyChat = null;
            clearTimeout(window.updateSupplyChat);
            window.updateSupplyChat = null;
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
        messageNum() {
            this.$store.state.userData.username && this.getCount();
            this.$ajax.get('/basemall-cms/index/get-phone-number-and-work-times').then(res=>{
                this.phoneNum = res.phoneNumber;
                this.workTimes = res.workTimes;
                localStorage.setItem('phoneNum',res.phoneNumber);
            })
        },
        toPublish(num){
            this.$router.push(num==1?'/publish/goods':'/publish/seek-purchase')
        }
	},
	computed:{
		num(){
            let num=0;
            let {unreadOrderNum,unreadSysNum,unreadDealNum,unreadConfigNum,answerNum,askNum,unreadChatNum}=this.$store.state.globalData.noticeCount;
            unreadOrderNum = !!unreadOrderNum?unreadOrderNum:0;
            unreadSysNum = !!unreadSysNum?unreadSysNum:0;
            unreadDealNum = !!unreadDealNum?unreadDealNum:0;
            answerNum = !!answerNum?answerNum:0;
            askNum = !!askNum?askNum:0;
            unreadConfigNum = !!unreadConfigNum?unreadConfigNum:0;
            if(this.$store.state.userData.userType==3){ //融资用户（交易消息+系统消息）
                num=unreadDealNum*1+unreadSysNum*1+unreadConfigNum*1
            }else{ //供求用户（订单消息+系统消息+互动消息）
                num=unreadOrderNum*1 + unreadSysNum*1 + unreadChatNum*1
            };
			return num*1
		},
		username(){
			return this.$store.state.userData.username
        },
        isLoginPage(){
            return this.$route.name!='登录'
        },
        chatnum(){
            return this.$store.state.globalData.chatnum
        }
	},
    created() {
        this.messageNum();

        if(!window.UserRoot){
            window.UserRoot={root:false}
        }
        this.userRoot = window.UserRoot

        if(!!this.username && localStorage.getItem('UR')){
                window.UserRoot.root = localStorage.getItem('UR')=='true'?true:false
        }
	},
	watch:{
		username(val){
			if(!!val){
				this.getCount()
                if(localStorage.getItem('UR')){
                    window.UserRoot.root = localStorage.getItem('UR')=='true'?true:false
                }
			}
        },
        chatnum(){
            console.log('我是header页面的chatnum')
        }
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../assets/css/comcss/com_UI.less';
.pub_header {
    .pub_top {
        background: #F6F6F6;
        font-size: 12px;
        color: @text-color-gray;
        .pub_container {
            max-width: 1200px;
            margin: 0 auto;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            .header_phone {
                float: left;
                padding-left: 30px;
                background: url("/static/img/index/phone.png") no-repeat left center;
                background-size: 20px 20px;
            }
            .user_message {
                float: right;
                display: -webkit-flex;
                /* Safari */
                display: flex;
                align-items: center;
                justify-content: space-between;
                .header_user span {
                    color: @text-color-black;
                }
                .block {
                    margin-left: 20px;
                    .header_link {
                        display: inline-block;
                        margin-left: 20px;
                    }
                }
                .block_first {
                    margin-right: 20px;
                }
                .release {
                    .el-dropdown {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
