<template>
  <div class="pub_footer">
    <div class="container_footer">
      <div class="menu_footer">
        <span class="menu" v-for="item in menuList" :key="item.id"><router-link class="white_link" :to="item.url">{{item.name}}</router-link></span>
      </div>
      <div class="right_footer">
        <div v-html="copyRight"></div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
    name: 'Cfooter',
    data() {
      return {
       copyRight:"",
       menuList:[],
      }
    },
    created(){
      this.getfooterMessage();
    },
    methods: {
      getfooterMessage() {
        this.$ajax.get('/basemall-cms/index/get-index').then((res)=>{
           this.copyRight = res.copyright.content;
           this.menuList = res.foot_navi;
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../../assets/css/comcss/com_UI.less';
  .pub_footer{
    background-color: #585858;
    color: #b1b1b1;
    .container_footer{
     padding: 30px 0;
     margin: 0 auto;
     max-width: 1200px;
     text-align: center;
      .menu_footer{
        margin-bottom: 20px;
        .menu{
          padding:0 30px;
          border-right: 2px solid #b1b1b1;
        }.menu:last-child{
          border: none;
        }
      }.right_footer{
        .right{
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
