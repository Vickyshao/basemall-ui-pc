<template>
  <div class="loginBox_container">
    <el-dialog class="loginBox" title="登录沪深商贸网" :visible.sync="$store.state.globalData.isLogin" :before-close="beforeClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <div class="loginTitle">会员登录</div>
            <el-form-item prop="username">
                <el-input v-model.trim="ruleForm.username" placeholder="用户名" prefix-icon="el-icon-ump-yonghu loginIcon"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model.trim="ruleForm.password" placeholder="登录密码" prefix-icon="el-icon-ump-xiugaidenglumima loginIcon"></el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
                <el-input v-model.trim="ruleForm.verifyCode" placeholder="输入验证码" class="codeInput"></el-input>
                <img class="code" :src="info.imgUrl" @click="getVerifyCode"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="login_btn" @click="submitForm('ruleForm')" :disabled = 'info.isDisabled'>登录</el-button>
                <router-link class="float_r" :to="'/forget-password'">忘记密码</router-link>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
    export default {
    data () {
        return {
            logining:false,
            info:{
                errorTip: '',
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
      this.getVerifyCode();
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
                        this.$store.state.globalData.isLogin=false;
                        localStorage.setItem('UD',JSON.stringify(res))
                        this.$store.state.userData = localStorage.UD?JSON.parse(localStorage.UD):{}
                        localStorage.setItem('accessToken',res.accessToken.accessToken);
                        localStorage.setItem('refreshToken',res.accessToken.refreshToken);
                        this.logining=false;
                        this.$refs['ruleForm'].resetFields();
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
        beforeClose(done) {
            done();
            setTimeout(() => {
            this.$refs['ruleForm'].resetFields()
            }, 5);
        },
        getUserRoot(){
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
            location.reload();
          })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/css/comcss/com_UI.less';
.loginBox{
      .el-dialog{
        width: 500px;
        .el-dialog__header{
            padding: 30px 40px;
            border-bottom: 1px solid @line-color;
            span{
              font-size: 22px;
              line-height: 22px;
            }
            i{
              font-size: 27px;
            }
        }
        .el-dialog__body{
          padding: 25px 45px;
          position: relative;
          box-sizing: border-box;
          .el-form-item__content{
            position: relative;
          }
          .loginTitle{
            font-size: 18px;
            margin-bottom: 12px;
          }
          .el-input__inner{
            height: 50px;
            padding-left:40px;
            font-size: 16px;
          }
          .loginIcon{
              font-size: 22px;
              color: #cccccc;
          }
          .checkLine{
            margin: 0;
            .check{
              margin-right: 10px;
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
          .login_btn{
            width: 100%;
            height: 48px;
            font-size: 20px;
            margin-top: 20px;
          }
        }
      }
    }
</style>
