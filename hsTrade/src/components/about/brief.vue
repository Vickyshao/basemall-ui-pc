<template>
    <div class="brief">
        <div class="brief_title">公司简介</div>
        <div class="brief_body">
           <div class="gray_text text_content" v-html="text"></div>
        </div>
        <div class="aircraft">
        </div>
    </div>
</template>
<script>
export default {
  name:'brief',
  data () {
      return {
         text:''
      }
  },
  methods: {
    getBrief(){
        let data={
          findCode: 'gongsijieshao'
        };
        this.$ajax.post('/basemall-cms/index/get-detail-by-findcode',data).then((res)=>{
           this.text = res.content;
        })
    }
  },
  created () {
      this.getBrief()
  }
}
</script>

<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
  .brief{
      position: relative;
   .brief_title{
        font-size: 22px;
   }
   .brief_body{
        max-width:866px;
        margin-top: 20px;
        font-size: 14px;
        line-height: 2;
        .text_content{
           max-width:866px;  
        }
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
