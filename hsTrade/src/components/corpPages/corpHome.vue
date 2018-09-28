<template>
  <div class="comCnt">
      <div class="comInfo">
          <div class="logo">
              <img :src="corpInfo?corpInfo.imageBase+corpInfo.corp_logo:''"/>
          </div>
          <div class="infos">
              <div class="comName">{{userData.corpName||'-'}}</div>
              <ul>
                  <li>
                      <span class="t_name">所属行业：</span>
                      <span class="text">{{corpInfo.business_main||'-'}}</span>
                  </li>
                  <li>
                      <span class="t_name">营业执照：</span>
                      <span class="text">{{corpInfo.register_number||'-'}}</span>
                  </li>
                  <li>
                      <span class="t_name">注册资本：</span>
                      <span class="text">{{corpInfo.register_capital||'-'}}万人民币</span>
                  </li>
                  <li>
                      <span class="t_name">法人姓名：</span>
                      <span class="text">{{corpInfo.legal_person_name||'-'}}</span>
                  </li>
                  <li>
                      <span class="t_name">企业地址：</span>
                      <span class="text">{{corpInfo.mailing_address||'-'}}</span>
                  </li>
              </ul>
          </div>
      </div>
      <div class="bot">
          <div class="tabs">
            <el-tabs v-model="activeName" @tab-click="changeTab">
                <el-tab-pane label="首页" name="1"></el-tab-pane>
                <el-tab-pane label="出售商品" name="2"></el-tab-pane>
                <el-tab-pane label="采购信息" name="3"></el-tab-pane>
                <el-tab-pane v-if="userData.userType == 1" label="企业授权声明" name="4"></el-tab-pane>
                <el-tab-pane v-if="userData.userType == 3" label="交易消息" name="4"></el-tab-pane>
                <el-tab-pane v-if="userData.userType == 3" label="历史融资" name="5"></el-tab-pane>
                <el-tab-pane v-if="userData.userType == 3" label="企业信息" name="6"></el-tab-pane>
                <el-tab-pane v-if="userData.userType == 3" label="企业授权声明" name="7"></el-tab-pane>
            </el-tabs>

            <div class="cnt">
                <div v-if="activeName==1"><com-home :home-data="homeData" @changeActivename="changeActivename"></com-home></div>
                <div v-if="activeName==2"><sell-goods></sell-goods></div>
                <div v-if="activeName==3"><purchase-info></purchase-info></div>
                <div v-if="userData.userType == 1&&activeName==4"><author></author></div>
                <div v-if="userData.userType == 3">
                    <div v-if="activeName==4"><transaction></transaction></div>
                    <div v-if="activeName==5"><history-finance></history-finance></div>
                    <div v-if="activeName==6"><enterprise-info :corp-info="corpInfo"></enterprise-info></div>
                    <div v-if="activeName==7"><author></author></div>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>
<script>
    import comHome from './home.vue'                     //主页
    import sellGoods from './sellGoods.vue'              //出售商品
    import purchaseInfo from './purchaseInfo.vue'        //采购信息
    import transaction from './transaction.vue'          //交易信息
    import historyFinance from './historyFinance.vue'    //历史融资
    import enterpriseInfo from './enterpriseInfo.vue'    //企业信息
    import author from './author.vue'                    //企业授权信息
    export default {
        data(){
            return {
                activeName: '1',
                corpInfo: {},
                goods: [],
                homeData: {},
                userData: this.$store.state.userData,
            };
        },
        components: {
            comHome,
            sellGoods,
            purchaseInfo,
            transaction,
            historyFinance,
            enterpriseInfo,
            author,
        },
        created(){
            this.init();
            console.log('userData:', this.userData);
        },
        methods: {
            init(){
                this.getCorp();
                this.changeTab();
                setInterval(noticeUp, 2000);
            },
            changeTab(tab, event) {
            },
            getCorp(){
                this.$ajax.get('/basemall-account/account/get-corp').then((res)=>{
                    this.corpInfo = res;
                    console.log('t/get-corp',this.corpInfo);
                    this.homeData.corp_info = this.corpInfo.corp_info;

                });
            },
            changeActivename(a){
                this.activeName = a;
            },





        },
    }

    function noticeUp() {
        $('.latestDeal .orders ul').animate({
            marginTop: '-15px'
            }, 1000, function () {
            $(this).find("li").eq(0).appendTo(this);
            $(this).css({'margin-top': 0});
            // $(this).find("li:first").appendTo(this);
        })
    }

</script>
<style lang="less">
    @import url('../../less/corpPages.less');
</style>

