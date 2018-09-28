<template>
    <div class="contact">
        <div class="contact_title">联系我们</div>
        <div class="contact_body clearfix">
           <div class="contact_left" v-html="text"></div>
           <!-- <div class="contact_right">
               <img class="address_img" :src="this.imgurl">
           </div> -->
        </div>
        <div class="aircraft"></div>
    </div>
</template>
<script>
export default {
  name:'contact',
  data () {
      return {
          text:'',
        //   imgurl:''
      }
  },
  methods: {
    getContact(){
        let data={
          findCode: 'lianxi'
        };
        this.$ajax.post('/basemall-cms/index/get-detail-by-findcode',data).then((res)=>{
           this.text = res.content;
        //    this.imgurl = 'http://p8ee2k5tt.bkt.clouddn.com'+res.title_image;
        })
    }
  },
  created () {
      this.getContact()
  }
}
</script>

<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
  .contact{
      position: relative;
   .contact_title{
        font-size: 22px;
   }
   .contact_body{
        margin-top: 40px;
        font-size: 14px;
        padding-bottom: 40px;
        border-bottom: 1px solid  @line-color;
        .contact_left{
            float: left;
            padding-left: 10px;
            .company_name{
                font-size: 18px;
                margin-bottom: 25px;
            }
            .company_message li{
                margin-bottom: 23px;
            }
        }
        .contact_right{
            float: right;
            .address_img{
                width: 385px;
                height: 212px;
                margin-top: 12px;
                margin-right: 45px;
            }
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
