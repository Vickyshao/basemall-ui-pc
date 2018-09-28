<template>
<div class="index_container">
  <div class="index">
    <div class="banner_container" :style="{backgroundImage: imgUrl?('url('+ imageBase + imgUrl + ')'):''}">
      <div class="banner_index">
        <div class="banner_header">
          <div class="banner_logo">
            <div class="logo"><router-link :to="'/'">沪深商贸</router-link></div>
            <div class="phone_num">客服热线  :<b>{{phoneNum}}</b></div>
          </div>
          <div class="banner_login">
            <ul class="login_list">
              <li class="login_li">您好，
                <span v-if="!$store.state.userData.userType">游客</span>
                <span v-if="!!$store.state.userData.userType">{{$store.state.userData.username|subStrMobile}}</span>
              </li>
              <li class="login_li" v-if="!$store.state.userData.userType"><router-link class="all_btn white_tra_btn login_btn" :to="'/login'">请登录</router-link></li>
              <!-- <li class="login_li"><router-link class="all_btn white_tra_btn login_btn" :to="'/'">注册</router-link></li> -->
            </ul>
          </div>
        </div>
        <div class="banner_introduction">
          <h1 class="introduction1">现货零距离，交易全方位</h1>
          <h2 class="introduction2">资源优势整合，供需一站解决！</h2>
        </div>
        <div class="banner_fun">
          <div class="partition_container">
            <div class="partition banner_buy" @mouseenter="buy=!buy" :class="{up_head: buy, down_head: !buy}">
              <div class="partition_icon buy_icon">去投资</div>
            </div>
            <div class="partition banner_process process_1" @mouseleave="buy=!buy" :class="{up: !buy, down: buy}">
              <div class="process_buy">
                <h1 class="process_icon buy"></h1>
                <p>我要投资</p>
              </div>
              <ul class="process_list process_list_1">
                <li v-for="item in stepsL" :key="item.id"><h1 class="list_icon"></h1><p>{{item.name}}</p></li>
              </ul>
              <div class="process_container">
                <router-link class="all_btn white_tra_btn find_btn" :to="'/invest/list'">我要投资</router-link>
                <div class="process_verify">
                  <span class="verify verify_1">
                    企业信用认证
                  </span>
                  <span class="verify verify_2">
                    优质资源审核
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="partition_container">
            <div class="partition banner_provide" @mouseenter="provide=!provide" :class="{up_head: provide, down_head: !provide}">
              <div class="partition_icon provide_icon">去融资</div>
            </div>
            <div class="partition banner_process process_2" @mouseleave="provide=!provide" :class="{up: !provide, down: provide}">
              <div class="process_buy">
                <h1 class="process_icon provide"></h1>
                <p>我要融资</p>
              </div>
              <ul class="process_list process_list_2">
                <li v-for="item in stepsR" :key="item.id"><h1 class="list_icon"></h1><p>{{item.name}}</p></li>
              </ul>
              <div class="process_container">
                <!-- <router-link class="all_btn white_tra_btn find_btn" :to="'/publish/goods'">快速发布商品</router-link><br> -->
                <el-button class="all_btn white_tra_btn find_btn" @click="toPublishGoods" :disabled="($store.state.userData.userType == '1')&&!userRouter.root" style="line-height: 0;" :class="($store.state.userData.userType == '1')&&!userRouter.root?'disablepublish':''">我要融资</el-button>
                <div class="process_verify">
                  <span class="verify verify_1">
                    企业信用认证
                  </span>
                  <span class="verify verify_2">
                    优质资源审核
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="notices_container">
      <div class="notices">
        <div class="notice_list">
          <div class="horn_icon"></div>
          <ul class="notice_li" id="con1" ref="con1" :class="{anim:animate}" @mouseover="noticeHover" @mouseout="noticeLeave">
            <li v-for="item in notes" :key="item.id"><router-link class="blue_link" :to="{path:'/about/publish-detail',query:{ id:item.id }}">{{item.title}}</router-link><span>{{item.publishTime}}</span></li>
          </ul>
          <ul class="swap"></ul>
          <div class="more"><router-link class="blue_link" :to="'/about/publish'">更多>></router-link></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      return {
        animate:false,
        activeName2: 'first',
        buy: true,/*控制采购区显示隐藏*/
        provide: true,/*控制供货区显示隐藏*/
        notes: [],
        imgUrl:'',
        imageBase:'',
        phoneNum:'',
        stepsL:[
          {
            name:"搜索产品",id:"0",
          },
          {
            name:"提交订单",id:"1"
          },
          {
            name:"款到第三方",id:"2"
          },
          {
            name:"确认收货",id:"3"
          }
        ],
        stepsR:[
          {
            name:"商家入驻",id:"0",
          },
          {
            name:"处理订单",id:"1"
          },
          {
            name:"按时发货",id:"2"
          },
          {
            name:"收到货款",id:"3"
          }
        ],
        userRouter:{root:false}
      };
    },
    created(){
      this.getNoteList();
      if(!window.UserRoot){
        window.UserRoot = {root:false}
      }
      if(localStorage.getItem('UR')){
          window.UserRoot.root = localStorage.getItem('UR')=='true'?true:false
      }
      this.userRouter = window.UserRoot
    },
    methods: {
      moveNotes(list){
      let con1 = document.querySelector("#con1");
        con1.style.cssText='transform:translateY(-60px);-webkit-transform:translateY(-60px);-ms-transform:translateY(-60px);-moz-transform:translateY(-60px)';
        this.animate=!this.animate;
        var that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
        setTimeout(function(){
            that.notes.push(that.notes[0]);
            that.notes.shift();
            con1.style.cssText='transform:translateY(0);-webkit-transform:translateY(0);-ms-transform:translateY(0);-moz-transform:translateY(0)';
            that.animate=!that.animate;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
        },500)
      },
      getNoteList() {
        this.$ajax.get('/basemall-cms/index/get-index').then((res)=>{
           this.notes = res.notice;
           this.phoneNum=res.phone;
           this.imgUrl=res.banner[0].titleImage;
           this.imageBase = res.imageBase;
           if(this.notes.length>1){
             window.indexNotice=setInterval(this.moveNotes,4000)
           }
        })
      },
      noticeHover(){
        clearInterval(window.indexNotice)
      },
      noticeLeave(){
        if(this.notes.length>1){
          window.indexNotice=setInterval(this.moveNotes,4000)
        }
      },
      toPublishGoods(){
        // this.$router.push('/publish/goods')
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
 @import '../assets/css/comcss/com_UI.less';
  .index{
    width: 100%;
    height: 740px;
    overflow: hidden;
    .banner_container{
      width: 100%;
      height: 680px;
      background: url(/static/img/index/index_banners.jpg) no-repeat top center;
      background-size: 100% 100%;
      text-align: center;
      color: @background-color;
      .banner_index{
        max-width:1200px;
        height: 680px;
        position: relative;
        margin: 0 auto;
        .banner_header{
          padding-top: 30px;
          display: flex;
          display: -webkit-flex; /* Safari */
          align-items: center;
          justify-content: space-between;
          .banner_logo{
              height: 55px;
              display: flex;
              display: -webkit-flex; /* Safari */
              align-items: center;
            .logo a{
              display: inline-block;
              width: 200px;
              height: 55px;
              background: url(/static/img/index/index_logo@2x.png) no-repeat left center;
              background-size: 100% auto;
              text-indent: -9999px;
            }
            .phone_num{
              display: inline-block;
              width: 300px;
              height: 30px;
              line-height: 30px;
              padding-left: 40px;
              background: url(/static/img/index/index_phone@2x.png) no-repeat left top/contain;
              background-size: 30px 30px;
              text-align: left;
              font-size: 18px;
              margin-left: 30px;
              b{
                margin: 0 5px;
              }
            }
          }
          .banner_login{
              height: 55px;
              line-height: 55px;
              .login_list .login_li{
                float: left;
                margin-left: 20px;
                font-size: 14px;
                .login_btn{
                  display:inline-block;
                  width: 85px;
                  height: 35px;
                  line-height: 35px;
                  font-size: 18px;
                }
              }
          }
        }
        .banner_introduction{
          margin-top:120px;
          .introduction1{
            font-size: 58px;
          }.introduction2{
            font-size: 28px;
            margin-top: 40px;
          }
        }
        .banner_fun{
          .partition_container{
            .partition{
            width: 400px;
            opacity: 0.95;
            border-radius: 5px 5px 0 0;
            position: absolute;
            bottom: 0;
           }.banner_buy{
            left: 40px;
            height: 210px;
            line-height: 210px;
            background-color: #164f9e;
           }.up_head{
              animation: mymoves 1s 1;
              animation-fill-mode:forwards;
              @keyframes mymoves{
              from {height:0px;}
              to {height:210px;}
              }
           }.down_head{
              animation: mymoves2 1s 1;
              animation-fill-mode:forwards;
              @keyframes mymoves2{
              from {height:210px;}
              to {height:0px;}
              }
           }
           .banner_provide{
            right: 40px;
            height: 210px;
            line-height: 210px;
            background-color: #36aa38;
           }.partition_icon{
            width: 400px;
            height: 210px;
            background-size: 135px 135px;
            font-size: 38px;
            cursor: pointer;
           }.buy_icon{
            background: url(/static/img/index/index_list@2x.png) no-repeat right bottom;
           }.provide_icon{
            background: url(/static/img/index/index_goods@2x.png) no-repeat right bottom;
           }.banner_process{
            border-radius: 5px 5px 0 0;
            opacity: 0.95;
            cursor: pointer;
            height: 0;
            .process_buy{
              font-size: 24px;
              padding: 70px 0 60px;
              .process_icon{
                width: 85px;
                height: 85px;
                margin: 0 auto 15px;
                background-size: 100% auto;
              }.buy{
                background: url(/static/img/index/index_shopping@2x.png) no-repeat right bottom;
              }.provide{
                background: url(/static/img/index/index_supply@2x.png) no-repeat right bottom;
              }
            }.process_list{
              padding: 20px 20px;
              font-size: 16px;
              display: flex;
              display: -webkit-flex; /* Safari */
              align-items: center;
              justify-content: space-between;
              li{
                padding-right: 25px;
                background: url(/static/img/index/index_right@2x.png) no-repeat right center;
                background-size: 18px 33px;
                .list_icon{
                  width: 65px;
                  height: 65px;
                  margin: 0 auto;
                  background-position: center center;
                  background-repeat: no-repeat;
                  background-size: 45px 45px;
                }

              }
              li:last-child{
                 padding-right: 0;
                 background:none;
              }
            }.process_list_1{
              background-color: #1a4c93;
              li:nth-child(1) .list_icon{
                background-image: url(/static/img/index/index_find@2x.png);
              }
              li:nth-child(2) .list_icon{
                background-image: url(/static/img/index/index_submit@2x.png);
              }
              li:nth-child(3) .list_icon{
                background-image: url(/static/img/index/index_card@2x.png);
              }
              li:nth-child(4) .list_icon{
                background-image: url(/static/img/index/index_sure@2x.png);
              }
            }.process_list_2{
              background-color: #349d37;
               li:nth-child(1) .list_icon{
                background-image: url(/static/img/index/index_business@2x.png);
              }
              li:nth-child(2) .list_icon{
                background-image: url(/static/img/index/index_handle@2x.png);
              }
              li:nth-child(3) .list_icon{
                background-image: url(/static/img/index/index_car@2x.png);
              }
              li:nth-child(4) .list_icon{
                background-image: url(/static/img/index/index_receiv@2x.png);
              }
            }
            .process_container{
              padding: 60px 0 100px;
              .disablepublish{
                background:transparent !important;
                color:#fff !important;
              }
              .find_btn{
              display:inline-block;
              width: 280px;
              height: 50px;
              line-height: 50px;
              font-size: 20px;
              margin-bottom: 50px;
            }.process_verify{
              width: 270px;
              margin: 0 auto;
              font-size: 14px;
              display: flex;
              display: -webkit-flex; /* Safari */
              align-items: center;
              justify-content: space-between;
              .verify{
                width: 90px;
                height: 25px;
                line-height: 25px;
                padding-left: 30px;
              }.verify_1{
                background: url(/static/img/index/index_credit@2x.png) no-repeat left top/contain;;
              }.verify_2{
                background: url(/static/img/index/index_examine@2x.png) no-repeat left top/contain;;
               }
              }
            }
           }.process_1{
            left: 40px;
            background-color: #164f9e;
           }.up{
              animation: mymove 0.8s 1;
              animation-fill-mode:forwards;
              @keyframes mymove{
              from {height:0px;}
              to {height:672px;}
              }
           }.down{
              animation: mymove2 0.8s 1;
              animation-fill-mode:forwards;
              @keyframes mymove2{
              from {height:672px;}
              to {height:0px;}
              }
           }
           .process_2{
            right: 40px;
            background-color: #36aa38;
           }
          }
        }
      }
    }
    .notices_container{
      background-color: #ffffff;
      position: absolute;
      top:680px;
      left: 0;
      width: 100%;
      // height: 60px;
      .anim{
        transition: all .5s;
      }
      .notices{
        overflow:hidden;
        max-width: 1200px;
        margin: 0 auto;
        .notice_list{
          height:60px;
          line-height: 60px;
          overflow:hidden;
          position:relative;
          .notice_li,.swap{
            display:inline-block;
            position:absolute;
            top:0;
            left:40px;
            span{
              margin: 0 30px;
            }
          }
          .horn_icon{
            display:inline-block;
            width: 30px;
            height: 20px;
            border-right: 1px solid #ccc;
            background: url(/static/img/index/index_horn@2x.png) no-repeat left center;
            background-size: 18px auto;
            position:absolute;
            top:50%;
            transform: translateY(-50%);
            left:0;
          }
          .more{
            position:absolute;
            top:0;
            right:10px;
          }
        }
      }
    }
  }
</style>
