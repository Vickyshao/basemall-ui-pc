<template>
  <div class="pub_container">
    <div class="pub_center">
      <div class="center_container">
        <div class="center_company"><router-link to="/">沪深商贸</router-link></div>
        <div class="center_login" v-if="!navData.LoginIn">登录</div>
        <div class="center_nav" v-if="navData.LoginIn">
          <ul>
            <li v-if="x.show" v-for="x in $store.state.navTree" :key="x.name" :class="{active:navData.breadNames.indexOf(x.name)!=-1&&x.name!='首页'}" @click="jump(x)">{{x.name}}</li>
          </ul>
        </div>
      </div>
    </div>
    <bread-nav :list="navData.currentBread" v-if="navData.LoginIn"></bread-nav>
  </div>
</template>
<script>
    import breadNav from './breadNav'
    export default {
      props:['navData'],
      components:{ breadNav },
      created() {
        this.name='';
        this.name = this.$route.name;
      },
      data() {
        return {
          name: ''
        }
      },
      methods: {
        jump(x){
          this.$router.push({path:x.path})
        }
      }
    }
</script>

<style scoped lang="less">
 @import '../assets/css/comcss/com_UI.less';
    .pub_center{
      border-top: 1px solid @line-color;
      background-color: @background-color;
      .center_container{
        height: 100px;
        margin: 0 auto;
        max-width: 1200px;
        .center_company{
          float: left;
          a{
            display: inline-block;
            width: 200px;
            height: 100px;
            background: url(/static/img/index/logo.png) no-repeat center center;
            background-size: 200px 50px;
            text-indent: -999px;
          }
        }
        .center_login{
          float: left;
          margin-left: 25px;
          margin-top: 30px;
          padding-left: 25px;
          font-size: 24px;
          height: 40px;
          border-left: 2px solid @line-color;
        }
        .center_nav{
          float: right;
          margin-left: 50px;
          padding: 30px 0;
          ul{
            overflow: hidden;
            li{
              font-size: 16px;
              float: left;
              line-height: 40px;
              margin-left: 60px;
              padding: 0 5px;
              cursor: pointer;
              &.active{
                border-bottom: 2px solid #1650a2;
                color: #1650a2;
              }
              &:hover{
                color: #1650a2;
              }
            }
          }
        }
      }
    }
</style>
