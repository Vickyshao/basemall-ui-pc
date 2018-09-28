<template>
  <div>
    <div class="about-wrapper">
      <!-- <div class="about-aside"> -->
        <sidebar :data="sidebarData"></sidebar>
      <!-- </div> -->
      <div class="about-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import sidebar from './about-sidebar'

export default {
  created(){
    this.initTab()
  },
  data(){
    return {
      sidebarData:{
        current:'01',
        nav:{
          title:{id:'01',name:'关于我们',icon:'icon-about'},
          child:[
            {id:'01',name:'公司简介',url:'/about/brief',icon:'icon-brief'},
            {id:'02',name:'法律申明',url:'/about/group',icon:'icon-group'},
            {id:'03',name:'联系我们',url:'/about/contact',icon:'icon-contact'},
            {id:'04',name:'网站公告',url:'/about/publish',icon:'icon-publish'}
          ]
        }
      }
    }
  },
  components:{
    sidebar
  },
  methods:{
    initTab(){
		let name=this.$route.name, current;
		this.sidebarData.nav.child.forEach((x)=>{
			if(x.name==name){current=x.id}
		});
    this.sidebarData.current=current;
    if(name=="公告详情"){
      this.sidebarData.current='04';
      }
    }
  },
  watch:{
    $route(to){
      this.initTab()
    }
  }
}
</script>
<style lang="less">
  .about-wrapper{
    width: 1200px;
    box-sizing: border-box;
    margin: 0px auto 50px;
    font-size: 15px;
    display: flex;
    .about-container{
      flex:1;
      padding:30px 30px;
      margin-left: 34px;
      background: #fff;
    }
  }
</style>