<template>
    <div class="publishD">
        <div class="publishD_header">
            <div class="publishD_title">{{title}}</div>
            <div class="publishD_time">{{time|formatTime("YMD")}}</div>
        </div>
        <div class="publisDh_body" v-html="content">
        </div>
        <div class="aircraft">
        </div>
    </div>
</template>
<script>
export default {
  name:'publishD',
  data(){
    return{
        title:'',
        time:'',
        content:''
    }
  },
 created() {
    var id=this.$route.query.id;
    this.$ajax.post('/basemall-cms/index/get-detail',{id:id}).then((res) => {
       this.title = res.title;
       this.time = res.publishTime;
       this.content = res.content;
    })
  }
}
</script>
<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
  .publishD{
      font-size: 16px;
      position: relative;
   .publishD_header{
        text-align: center;
       .publishD_title{
           font-size: 22px;
       }.publishD_time{
           padding: 20px 25px;
           border-bottom: 1px solid @line-color;
       }
   }
   .publisDh_body{
       padding: 30px 0;
       line-height: 25px;
       color: @text-color-gray;
   }
    .aircraft{
       position: absolute;
       width: 300px;
       height: 55px;
       background: url(/static/img/aboutUs/aircraft@2x.png) no-repeat right top/contain;
       top:0;
       right: 0;
   }
  }
</style>
