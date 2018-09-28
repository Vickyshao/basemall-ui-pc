<template>
  <div class="login_container">
    <div class="login">
      <div class="login_banner"></div>
      <div class="login_form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="手机号" prop="username">
            <el-input v-model.trim="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode">
            <el-input v-model.trim="ruleForm.verifyCode" class="codeInput"></el-input>
            <img class="code" :src="info.imgUrl" @click="getVerifyCode"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login_btn" @click="submitForm('ruleForm')" :disabled = 'info.isDisabled'>立即登录</el-button>
            <router-link class="float_r" :to="'/forget-password'">忘记密码</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'login',
    components: {},
    data() {
      return {
        logining:false,
        info:{
          imgUrl: '',
          isDisabled: false,
        },
        ruleForm: {
          username: '',
          password: '',
          verifyCode:''
        },
        rules: {
          username: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur'}
          ],
           password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '密码必须是6-16位数字和字母的组合', trigger: 'blur'}
          ],
           verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9]{4}$/, message: '验证码必须是4位数字和字母的组合', trigger: 'blur'}
          ]
        }
      }
    },
    created(){
      this.firstGetVerifyCode();
      document.addEventListener('keydown',(event)=>{
        event=event||window.event;
        if(event.which==13){
          this.submitForm('ruleForm')
        }
      })
    },
    methods: {
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            // this.logining=true;
            this.$ajax.post('/basemall-account/login/login',this.ruleForm,{
              headers: {
                  'uuid': this.$store.state.uuid
              }
          }).then((res)=>{
                
                
                this.getUserRoot()
                localStorage.setItem('UD',JSON.stringify(res));
                this.getFile()
                this.$store.state.userData = localStorage.UD?JSON.parse(localStorage.UD):{};
                localStorage.setItem('accessToken',res.accessToken.accessToken);
                localStorage.setItem('refreshToken',res.accessToken.refreshToken);
                this.logining=false;
                

                this.$router.push({
                  path:`/user-center`
                })
                // location.reload();
            }).catch(()=>{
               this.logining=false;
            })
          } else {
            return false;
          }
        });
      },
      firstGetVerifyCode(){
          var s = [];
          var hexDigits = "0123456789abcdef";
          for (var i = 0; i < 36; i++) {
              s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
          }
          s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
          s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
          s[8] = s[13] = s[18] = s[23] = "-";
          var uuid = s.join("");
          this.$store.state.uuid = uuid;
          let res = '/api/basemall-account/static/kaptcha.jpg';
          let tamp=new Date().getTime();
          if(location.href.indexOf('localhost')>-1){
            res='http://dev.basemall.cn/api/basemall-account/static/kaptcha.jpg'
          };
          this.info.imgUrl = `${res}?uuid=${uuid}&tamp=${tamp}`;
      },
      getVerifyCode(){
          let res = '/api/basemall-account/static/kaptcha.jpg';
          let tamp=new Date().getTime();
          let uuid =  this.$store.state.uuid;
          if(location.href.indexOf('localhost')>-1){
            res='http://dev.basemall.cn/api/basemall-account/static/kaptcha.jpg'
          };
          this.info.imgUrl = `${res}?uuid=${uuid}&tamp=${tamp}`;
      },
      getUserRoot(){
        // console.log()
          this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then(res=>{
            if(!window.UserRoot){
              window.UserRoot={root:false}
            }
            if(true){
              //认证通过
              window.UserRoot.root = true
              localStorage.setItem('UR', 'true')
            }else{
              //认证不通过
              window.UserRoot.root = false
              localStorage.setItem('UR', 'false')
            }
          })
      },
      getFile(){
        console.log(323232)
        require('./chat/js/init.js')
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/css/comcss/com_UI.less';
.login_container{
  background-color: @background-color;
  padding-bottom: 40px;
    .login{
    display: -webkit-flex; /* Safari */
    display: flex;
    margin:0 auto;
    max-width: 1200px;
    height: 420px;
    border: 1px solid @line-color;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: @background-color;
    .login_banner{
      width: 655px;
      margin: 25px;
      background: url(/static/img/banner.jpg);
      background-size: 100% auto;
      box-sizing: border-box;
    }
    .login_form{
      width: 540px;
      background-color: #f6f6f6;
      border-left: 1px solid @line-color;
      padding: 60px 50px 25px 10px;
      box-sizing: border-box;
      border-radius: 0 5px 5px 0;
      .el-form{
        .el-form-item{
          .el-form-item__label{
            // text-align: left;
            display: block;
            width: 100%;
          }
          .el-form-item__content{
            position:relative;
            margin-left: 0;
            .el-input{
               position:static;
              .el-input__inner{
                width: 100%;
                height: 48px;
                line-height: 48px;
                border-radius: 5px;
                text-indent: 1em;
                font-size: 15px;
              }
            }
            .codeInput{
              .el-input__inner{
                width: 70%;
              }
            }
            .code{
                position: absolute;
                top:0;
                right: 0;
                width:95px;
                height: 48px;
                line-height: 50px;
                cursor: pointer;
              }
          }
          .login_btn{
          width: 100%;
          height: 48px;
          font-size: 20px;
          margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
