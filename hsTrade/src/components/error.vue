<template>
  <div class="error_container">
    <div class="error">
      <div class="error_img"></div>
      <div class="error_title">&nbsp;&nbsp;&nbsp;404错误啦！</div>
      <div class="error_tip">郁闷！页面打不开了。服务器内部错误！请稍后再试。</div>
      <button class="all_btn bule_btn back" @click="backindex">返回首页</button>
    </div>
  </div>
</template>
<script>
    export default {
    name: 'error',
    methods: {
      backindex() {
        this.$router.push({
          path:'/',
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/css/comcss/com_UI.less';
  .error{
    max-width: 1200px;
    margin: 0px auto;
    font-size: 15px;
    height: 655px;
    text-align: center;
    padding: 75px 0 225px;
    box-sizing: border-box;
    .error_img{
      width: 176px;
      height: 138px;
      margin: 0 auto;
      background: url(/static/img/com/error@2x.png) no-repeat top center;
      background-size: 100% 100%;
      margin-bottom: 30px;
    }.error_title{
      font-size: 40px;
    }.error_tip{
      margin: 25px 0 35px;
      font-size: 16px;
      color: @text-color-gray;
    }.back{
      font-size: 18px;
      width: 145px;
      height: 50px;
    }
  }
</style>
