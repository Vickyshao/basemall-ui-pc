<template>
  <div class="accountSafety">
    <div class="accountSafety_container">
      <div class="accountSafety_title">
          账户安全
      </div>
      <ul class="accountSafety_list">
        <li v-if="this.$store.state.userData.userType==3">
          <div class="resetHeader">
              <label class="labet_name">认证绑卡</label>
              <span class="gray_text tips"><i>{{bankName}}</i><i>{{bankCardNum|subStrBankNo}}</i></span>
              <span class="float_r blue_text">{{auditStatus==2?'已认证':'未认证'}}</span>
          </div>
        </li>
        <li>
          <div class="resetHeader">
              <label class="labet_name">登录密码</label>
              <span class="gray_text tips">上次登录时间：<i>{{loginTime|formatTime("YMDHMS")}}</i></span>
              <span class="float_r blue_link" @click="showReset(1)">重置</span>
          </div>
        </li>
        <li>
          <div class="resetHeader">
              <label class="labet_name">交易密码</label>
              <span class="gray_text tips">付款或修改账户信息时输入，保护账户资金安全</span>
              <span class="float_r blue_link"  @click="showReset(2)">重置</span>
          </div>
        </li>
        <!-- <li>
          <div class="resetHeader">
              <label class="labet_name">中信交易账户</label>
              <span class="gray_text tips">xxxx公司,账号123456789</span>
              <span class="gray_text tips">开通日期：2014年3月4日</span>
              <span class="float_r">已开通</span>
          </div>
        </li> -->
      </ul>
    </div>
    <div class="resetBox">
      <el-dialog :title="type==1?'登录密码重置':'交易密码重置'" :visible.sync="dialogVisible" :before-close="beforeClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="reset_form">
           <div class="resetTitle gray_text" v-if="this.type==1">为了您的账户安全，请定期更改登录密码，并确保登录密码设置与交易密码不同。</div>
           <div class="resetTitle gray_text" v-if="this.type==2">为了您的账户安全，请定期更改交易密码，并确保交易密码设置与登录密码不同。</div>
            <el-form-item prop="smsCode">
              <el-input v-model.trim="ruleForm.smsCode" class="codeInput float_l" placeholder="短信验证码"></el-input>
              <el-button class="code" type="primary" @click="getCode" :disabled="timerDate.disabled">{{timerDate.disabled==false?'获取验证码':timerDate.count+'S'}}</el-button>
            </el-form-item>
            <el-form-item prop="newPassWord">
              <el-input v-model.trim="ruleForm.newPassWord" type="password" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item prop="newPassWordToo">
              <el-input v-model.trim="ruleForm.newPassWordToo" type="password" placeholder="确认新密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="logining" type="primary" class="login_btn" @click="updatedPassword('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
    name:'accountSafety',
    data() {
      var validateCode = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入验证码'));
        }
        else{
          callback();
        }
      };
      var validateNewPassWord = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          let regs;
          if(this.type==1){
            regs = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
          }else if(this.type==2){
            regs = /^\d{6}$/;
          }
          if (!regs.test(this.ruleForm.newPassWord)) {
            callback(new Error(this.type==1?'密码必须是6-16位数字和字母的组合':'密码必须是6位数字'));
          }
          callback();
        }
      };
      var validateNewPassWordToo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
         show:true,
         logining:false,
         dialogVisible:false,
         type:1,
         loginTime:'',
         bankName:'',
         bankCardNum:'',
         auditStatus:'',
         timerDate:{
            count: '',
            timer: null,
            disabled:false
         },
         ruleForm: {
            smsCode:'',
            newPassWord: '',
            newPassWordToo:''
         },
         rules: {
              smsCode: [
                { validator: validateCode, trigger: 'blur' }
              ],
              newPassWord: [
                { validator: validateNewPassWord, trigger: 'blur' }
              ],
              newPassWordToo: [
                { validator: validateNewPassWordToo, trigger: 'blur' }
              ]
          }
      }
    },
    methods: {
      getCode(){
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
          }
        }, 1000);
        this.$ajax.get(this.type==1?'/basemall-account/account/send-code':'/basemall-account/account/send-pay-code').then((res)=>{

        })
      },
      showReset(resetType){
        clearInterval(window.resetPassword);
        this.timerDate.disabled=false;
        this.timerDate.count = '';
        setTimeout(() => {
          this.$refs['ruleForm'].resetFields()
        }, 5);
        if(this.dialogVisible==true){
            this.dialogVisible=false;
        }else{
            this.dialogVisible=true;
            if(resetType==1){
              this.type=1
            }else if(resetType==2){
              this.type=2;
            }
        }
      },
      updatedPassword(ruleForm){
        let data={
            smsCode:this.ruleForm.smsCode,
            newPassWord:this.ruleForm.newPassWord
        };
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
              // var that = this;
              // this.logining=true;
              this.$ajax.post(this.type==1?'/basemall-account/account/update-password':'/basemall-account/account/update-pay-password',data).then((res)=>{
                // that.logining=false;
                this.showReset();
                this.$message({
                  message: this.type==1?'登录密码修改成功':'交易密码修改成功',
                  type: 'success'
                });
              }).catch((err)=>{
                console.log(1);
              //  that.logining=false;
            })
           }else {
            return false;
          }
        });
      },
      beforeClose(done) {
        done();
        clearInterval(window.resetPassword);
        this.timerDate.disabled=false;
        this.timerDate.count = '';
        setTimeout(() => {
          this.$refs['ruleForm'].resetFields()
        }, 5);
      },
      getLoginTime(){
         this.loginTime=this.$store.state.userData.loginTime;
      },
      getBankCardNum(){
          this.$ajax.get('/basemall-account/account/account-security').then((res)=>{
              this.bankName=res.bank_name;
              this.bankCardNum=res.bank_account;
              this.auditStatus=res.audit_status
          })
      }
    },
    created () {
      this.getLoginTime();
      this.getBankCardNum()
    }
}
</script>
<style lang="less">
@import '../../../assets/css/comcss/com_UI.less';
  .accountSafety{
      .accountSafety_title{
          font-size: 22px;
          padding-bottom: 25px;
          border-bottom: 1px solid @line-color;
      }
      ul.accountSafety_list{
        li{
          .resetHeader{
            height: 95px;
            line-height: 95px;
            border-bottom: 1px solid @line-color;
            position: relative;
            .labet_name{
              font-weight: bold;
            }
            .tips{
            margin-left: 50px;
            i{
              margin-right: 25px;
            }
            }
          }
        }
      }
      .resetBox{
        .resetTitle{
          margin-bottom: 10px;
        }
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
            font-size: 16px;
          }
          .loginIcon{
              font-size: 22px;
              position: absolute;
              top:5px;
              left: 10px;
              color: #cccccc;
          }
          .checkLine{
            margin: 0;
            .check{
              margin-right: 10px;
            }
          }
          .codeInput{
            float: left;
            width: 70%;
          }
          .code{
            position: absolute;
            top:0;
            right: 0;
            width:107px;
            height: 50px;
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
  }
</style>

