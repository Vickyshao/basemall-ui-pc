<template>
  <div>
    <div class="user-wrapper">
      <div class="user-aside" v-if="!hideUserAside.val">
        <sidebar :nav-list="navList" :current="currentTab"></sidebar>
      </div>
      <div class="user-container">
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sidebar from './sidebar'

import navList from './data/navList'
import financingNavList from './data/financingNavList'

export default {
  created(){
    if(!localStorage.getItem('UD')){
      this.$router.push('/login')
    }
    this.navList=this.$store.state.userData.userType==3 ? financingNavList : navList;
    this.initTab()
    if(!window.hideUserAside){
      window.hideUserAside = {val:false}
    }
    this.hideUserAside = window.hideUserAside
  },
  data(){
    return {
      navList:[],
      currentTab:{
        tab:'01',
        child:'011'
      },
      hideUserAside:{}
    }
  },
  components:{
    sidebar
  },
  methods:{
    initTab(){
      let name=this.$route.name, arr=[], currentId="";
      this.navList.map(x=>x.child).forEach((x)=>{
        arr=arr.concat(x)
      })
      arr.forEach((x)=>{
        if(x.name==name){ currentId=x.id }
      })
      if(name=='融资详情' || name=='还款'){
        this.currentTab.tab='01'
        this.currentTab.child='012'
      }else if(name=='订单处理'){
        this.currentTab.tab='02'
        this.currentTab.child='021'
      }else{
        this.currentTab.tab=currentId.substr(0,2)
        this.currentTab.child=currentId
      }
    }
  },
  watch:{
    $route(to){
      this.initTab()
      window.hideUserAside.val = false
    }
  }
}
</script>
<style lang="less">
@import '../../less/user.less';
  .user-wrapper{
    width: 1200px;
    box-sizing: border-box;
    margin: 0px auto 50px;
    font-size: 15px;
    display: flex;
    .user-container{
      flex:1;
      margin-left: 34px;
      &>div{
        padding:30px;
        background: #fff;
      }
    }
  }
</style>