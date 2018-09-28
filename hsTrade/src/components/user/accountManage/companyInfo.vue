<template>
  <div class="companyInfo">
    <div class="companyInfo_container">
        <div class="companyInfo_title">
            企业信息
        </div>
        <table cellpadding="0" cellspacing="0" border="0" summary="基本信息">
            <caption align="top">基本信息</caption>
            <tr>
                <th width="150" class="name">会员类型</th>
                <th width="415">{{this.companyData.user_type==1?'企业':'金融机构'}}</th>
                <th width="105" class="name">手机号</th>
                <th>{{this.companyData.username|subStrMobile}}</th>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" summary="企业认证">
            <caption align="top">企业认证</caption>
            <tr>
                <th width="160" class="name">公司名称</th>
                <th width="160">{{this.companyData.corp_name}}</th>
                <th width="123" class="name">工商登记号</th>
                <th width="158">{{this.companyData.corp_number}}</th>
                <th width="105" class="name">企业类型</th>
                <th width="210">{{this.companyData.corp_type}}</th>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" summary="企业信息">
            <caption align="top">企业信息</caption>
            <!-- <tr>
                <th width="130" class="name">组织机构代码</th>
                <th width="160">{{this.companyData.organization_code}}</th>
                <th width="123" class="name">注册号</th>
                <th width="158">{{this.companyData.register_number}}</th>
                <th width="105" class="name">经营模式</th>
                <th width="210">{{this.companyData.business_model}}</th>
            </tr> -->
            <tr>
                <th width="160" class="name">营业执照注册号</th>
                <th colspan="3">{{this.companyData.register_number}}</th>
                <th width="105" class="name">经营模式</th>
                <th width="210">{{this.companyData.business_model}}</th>
            </tr>
            <tr>
                <th width="130" class="name">法人姓名</th>
                <th width="160">{{this.companyData.legal_person_name}}</th>
                <th width="123" class="name">身份证类型</th>
                <th width="158">{{this.companyData.idcard_type}}</th>
                <th width="105" class="name">法人电话</th>
                <th width="210">{{this.companyData.legal_person_phone|subStrMobile}}</th>
            </tr>
            <!-- <tr>
                <th class="name">证件类型</th>
                <th colspan="3">{{this.companyData.id_type}}</th>
                <th width="105" class="name">注册资金</th>
                <th width="210">{{this.companyData.register_capital}}万</th>
            </tr> -->
            <tr>
                <th width="130" class="name">注册时间</th>
                <th width="160">{{this.companyData.register_date|formatTime(YMD)}}</th>
                <th width="123" class="name">有效期</th>
                <th width="158">{{this.companyData.business_term|formatTime(YMD)}}</th>
                <th width="105" class="name">注册资金</th>
                <th width="210">{{this.companyData.register_capital}}万</th>
            </tr>
            <tr>
                <th class="name">单位所在地</th>
                <th colspan="3"><view-address :options="{address:this.companyData.corp_location}"></view-address></th>
                <th width="105" class="name">主营业务</th>
                <th width="210">{{this.companyData.business_main}}</th>
            </tr>
            <tr>
                <th class="name">住所</th>
                <th colspan="5">{{this.companyData.address}}</th>
            </tr>
            <tr>
                <th class="name">经营范围</th>
                <th colspan="5">{{this.companyData.business_scope}}</th>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" summary="法定代表人的证件照">
            <caption align="top" class="capName">法定代表人的证件照</caption>
            <tr>
                <th width="160" class="name">法人身份证信息页</th>
                <th width="275"><img class="legalPerson" :src="this.companyData.imageBase+this.companyData.legal_person_photo" alt=""></th>
                <th width="160" class="name">法人身份证国徽页</th>
                <th><img class="legalPerson" :src="this.companyData.imageBase+this.companyData.legal_person_photoo" alt=""></th>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" class="legalTable">
            <tr>
                <th class="name" width="160">公司电话</th>
                <th width="275">{{this.companyData.corp_phone}}</th>
                <th width="160" class="name">通信地址</th>
                <th colspan="3">{{this.companyData.mailing_address}}</th>
            </tr>
            <tr>
                <th class="name" width="125">邮编</th>
                <th width="160">{{this.companyData.postcode}}</th>
                <th width="150" class="name">邮箱</th>
                <th colspan="3">{{this.companyData.email}}</th>
            </tr>
            <tr>
                <th class="name" width="125">企业信息来源</th>
                <th colspan="3">{{this.companyData.message_source}}</th>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" summary="事业单位法人证书及组织结构代码证">
            <caption align="top" class="capName">事业单位法人证书及组织结构代码证</caption>
            <tr>
                <th width="160" class="name">单位法人证书</th>
                <th width="275"><img class="legalPerson" :src="this.companyData.imageBase+this.companyData.business_license" alt=""></th>
                <th width="160" class="name">组织机构代码证</th>
                <th><img class="legalPerson" :src="this.companyData.imageBase+this.companyData.organization_license" alt=""></th>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" class="legalTable">
            <tr>
                <th class="name" width="160">备注</th>
                <th colspan="5">{{this.companyData.remark}}</th>
            </tr>
        </table>
    </div>
  </div>
</template>
<script>
import viewAddress from '@/components/common/viewAddress'
export default {
    name:'companyInfo',
    components: {
        viewAddress
    },
    data() {
      return {
          companyData:{}
      }
    },
    methods: {
        getCompanyData(){
            this.$ajax.get('/basemall-account/account/get-corp').then((res)=>{
                this.companyData = res;
          })
        }
    },
    created () {
         this.getCompanyData()
    }
}
</script>
<style lang="less">
@import '../../../assets/css/comcss/com_UI.less';
  .companyInfo{
      .companyInfo_title{
          font-size: 22px;
          padding-bottom: 25px;
          border-bottom: 1px solid @line-color;
      }
    table{width:100%;font-size:15px;line-height:1.2;border-top:1px solid #ebebeb;border-left:1px solid #ebebeb;margin:0 auto;}
    table  caption{font-size: 16px;text-align: left;background-color: #f1f1f1;height: 45px;line-height: 45px;font-weight: bold;padding-left: 15px;margin-top: 37px;}
    table td, table th{ border-right:1px solid #ebebeb; border-bottom:1px solid #ebebeb;font-weight: normal;text-align: left;}
    table th{padding:18px 15px 18px 15px;box-sizing: border-box;line-height: 1.5;}
    table td{font-size: 14px;}
    .align-justy{text-align: justify;}
    .name{color: #666666;}
    .capName{
        margin-bottom: 12px;
    }
    .legalPerson{
        width: 100%;
        height: auto;
        background-color: #f1f1f1;
    }
    .legalTable{
        margin-top: 15px;
    }
  }
</style>

