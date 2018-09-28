<template>
    <div class="group">
        <div class="group_title">法律申明</div>
        <div class="group_body">
           <div class="gray_text" v-html="text"></div>
        </div>
        <div class="aircraft">
        </div>
    </div>
</template>
<script>
export default {
  name:'group',
  data () {
      return {
         text:''
      }
  },
  methods: {
    getGroup(){
        let data={
          findCode: 'rules'
        };
        this.$ajax.post('/basemall-cms/index/get-detail-by-findcode',data).then((res)=>{
           this.text = res.content;
        })
    }
  },
  created () {
      this.getGroup()
  }
}
</script>

<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
  .group{
      position: relative;
   .group_title{
        font-size: 22px;
   }
   .group_body{
        max-width:866px;
        margin-top: 20px;
        font-size: 14px;
        line-height: 2;
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
