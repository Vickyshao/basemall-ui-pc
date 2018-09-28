<template>
  <div class="forget_container">
    <div class="forget">
        <div class="forget_title">找回登录密码</div>
        <div class="cycle_line">
            <el-steps :active="active" align-center>
                <el-step title="验证身份"></el-step>
                <el-step title="重置密码"></el-step>
                <el-step title="修改成功"></el-step>
            </el-steps>
        </div>
        <div class="forget_form">
        <el-form v-if="this.active==1" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="手机号码" prop="loginName">
            <el-input v-model.trim="ruleForm.loginName"></el-input>
          </el-form-item>
          <el-form-item label="手机验证码" prop="verifyCode">
            <el-input v-model.trim="ruleForm.verifyCode" class="codeInput"></el-input>
            <el-button class="code" type="primary" v-show="timerDate.show" @click="getCode" :disabled="timerDate.disabled">获取验证码</el-button>
            <el-button class="code" type="primary" v-show="!timerDate.show" :disabled="true">{{timerDate.count+'S'}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login_btn" @click="checkUser('ruleForm')">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="this.active==2" :model="ruleFormPassword" :rules="passwordRules" ref="ruleFormPassword" class="reset_form">
            <el-form-item prop="newPassWord">
              <el-input v-model.trim="ruleFormPassword.newPassWord" type="password" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item prop="newPassWordToo">
              <el-input v-model.trim="ruleFormPassword.newPassWordToo" type="password" placeholder="确认新密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login_btn" @click="checkNew('ruleFormPassword')">下一步</el-button>
            </el-form-item>
        </el-form>
        <div v-if="this.active==3" class="changeSuccess">
            <span>登录密码修改成功！</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'forget',
    components: {},
    data() {
      var validateLoginName = (rule, value, callback) => {
          if (value === '') {
          this.timerDate.disabled=true;
          callback(new Error('请输入手机号码'));
          } else if(value.length==11){
            this.timerDate.disabled=false;
            let regs=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!regs.test(this.ruleForm.loginName)) {
                callback(new Error('手机格式不正确'));
            }
            callback();
          }else{
            this.timerDate.disabled=true;
          }
      };
      var validateVerifyCode = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入验证码'));
          } else {
            let regs=/^\d{6}$/;
            if (!regs.test(this.ruleForm.verifyCode)) {
                callback(new Error('验证码必须是6位数字'));
            }
            else{
               callback();
            }
            }
      };
      var validateNewPassWord = (rule, value, callback) => {
          if (value === '') {
          callback(new Error('请输入密码'));
          } else {
            let regs = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            if (!regs.test(this.ruleFormPassword.newPassWord)) {
                callback(new Error('密码必须是6-16位数字和字母的组合'));
            }else{
              callback();
            }
          }
      };
      var validateNewPassWordToo = (rule, value, callback) => {
          let regs = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
          if (value === '') {
          callback(new Error('请再次输入密码'));
          }else if(!regs.test(this.ruleFormPassword.newPassWordToo)){
            callback(new Error('密码必须是6-16位数字和字母的组合'));
          }else if (value !== this.ruleFormPassword.newPassWord) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
      };
      return {
        logining:false,
        active:1,
        timerDate:{
            show:true,
            count: '',
            timer: null,
            disabled:true
        },
        ruleFormPassword:{
            newPassWord:'',
            newPassWordToo:''
        },
        ruleForm: {
          loginName: '',
          verifyCode:''
        },
        rules: {
          loginName: [
            { validator:validateLoginName, trigger: 'blur,change' }
          ],
          verifyCode: [
             { validator:validateVerifyCode, trigger: 'blur' }
          ]
        },
        passwordRules: {
              newPassWord: [
                { validator: validateNewPassWord, trigger: ['blur'] }
              ],
              newPassWordToo: [
                { validator: validateNewPassWordToo, trigger: 'blur' }
              ]
          }
      }
    },
    created () {
      this.$store.commit('closeLoginBox');
    },
    methods: {
        getCode(){
            this.$ajax.post('/basemall-account/account/send-sms',{mobile:this.ruleForm.loginName}).then((res)=>{
              this.timerDate.show=false;
              this.timerDate.disabled=true;
              let TIME_COUNT = 60;
              this.timerDate.count = TIME_COUNT;
              window.resetPassword = setInterval(() => {
                if (this.timerDate.count > 0 && this.timerDate.count <= TIME_COUNT) {
                    this.timerDate.count--;
                    this.timerDate.disabled= true;
                } else {
                    clearInterval(window.resetPassword);
                    window.resetPassword = null;
                    this.timerDate.disabled= false;
                    this.timerDate.show=true;
                }
                }, 1000);
            })
        },
        checkUser(ruleForm){
          this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let data={ 
              mobile:this.ruleForm.loginName, 
              smsCode:this.ruleForm.verifyCode, 
            } 
            this.logining=true;
            this.$ajax.post('/basemall-account/account/identify-check',data).then((res)=>{
              this.logining=false;
              this.active=2;
            }).catch(()=>{
               this.logining=false;
            })
          } else {
            return false;
            }
          })
        },
        checkNew(ruleFormPassword){
          this.$refs[ruleFormPassword].validate((valid) => {
          if (valid) {
            this.logining=true;
            let data={ 
              mobile:this.ruleForm.loginName, 
              newPassWord:this.ruleFormPassword.newPassWord
            } 
            this.$ajax.post('/basemall-account/account/change-password',data).then((res)=>{
              this.logining=false;
              this.active=3;
              setTimeout(() => {
                this.$router.push('/login')
              }, 3000);
            }).catch(()=>{
               this.logining=false;
            })
          } else {
            return false;
            }
          })
        }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../assets/css/comcss/com_UI.less';
.forget_container{
  background-color: @background-color;
  padding-bottom: 40px;
    .forget{
    margin:0 auto;
    max-width: 1200px;
    padding: 48px 200px;
    border: 1px solid @line-color;
    box-sizing: border-box;
    background-color: @background-color;
    .forget_title{
        font-size: 24px;
        text-align: center;
        margin-bottom: 50px;
    }
    .forget_form{
      padding: 60px 150px 60px 110px;
      box-sizing: border-box;
      border-radius: 0 5px 5px 0;
      .reset_form{
          margin: 0 80px 0 100px;
      }
      .el-form{
        .el-form-item{
          .el-form-item__label{
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
            width:107px;
            height: 48px;
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
    .changeSuccess{
        margin: 0 auto;
        width: 220px;
        font-size: 24px;
        padding-left: 70px;
        line-height: 52px;
        background-size: 53px 53px;
        background: url(/static/img/index/payment@2x.png) no-repeat left center;
    }
  }
}
</style>
