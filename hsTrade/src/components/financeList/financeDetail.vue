<template>
    <div class="financeDetail_container">
        <div class="financeDetail">
            <div class="list_details">
                <div class="finance_details">
                    <div class="title">
                        <span class="name">{{borrow.borrowTitle}}</span>
                    </div>
                    <ul class="number_list">
                        <li class="data_li">
                            <p class="red_text number"><span class="data">{{borrow.annualFinancingRate}}</span>%</p>
                            <i class="notes">历史年化收益率</i>
                        </li>
                        <li class="data_li">
                            <p class="number"><span class="data">{{borrow.borrowTimeLimit}}</span>{{borrow.isDay == 1 ? '天' : '月'}}</p>
                            <!-- <p class="number"><span class="data">{{borrow.borrowTimeLimit}}</span>天</p> -->
                            <i class="notes">融资期限</i>
                        </li>
                        <li class="data_li">
                            <p class="number"><span class="data">{{borrow.borrowSum | toDoubleThousands}}</span>元</p>
                            <i class="notes">融资总额</i>
                        </li>
                    </ul>
                    <ol class="mode_list clearfix">
                        <li class="mode_li">
                            <label class="label_title">还款方式：</label>
                            <span v-if="borrow.repaymentStyle == 1">一次性还款</span>
                            <span v-if="borrow.repaymentStyle == 2">按月分期</span>
                            <span v-if="borrow.repaymentStyle == 3">每月还息到期还本</span>
                        </li>
                        <li class="mode_li">
                            <label class="label_title">起息时间：</label>
                            <span v-if="borrow.borrowStatus==5">{{(borrow.endTenderTime+86400000) | formatTime}}</span>
                            <span v-if="borrow.borrowStatus!=5">{{(borrow.publishDatetime+86400000) | formatTime}}</span>
                        </li>
                        <li class="mode_li">
                            <label class="label_title">成立时间：</label>
                            <span v-if="borrow.borrowStatus==5">{{(borrow.endTenderTime) | formatTime}}</span>
                            <span v-if="borrow.borrowStatus!=5">{{(borrow.publishDatetime) | formatTime}}</span>
                        </li>
                        <li class="mode_li">
                            <label class="label_title">剩余时间：</label>
                            <!-- 允许投标结束时间 - 今天投资日期 -->
                            <!-- <span>{{borrow.endTenderTime>=today?(Math.floor((borrow.endTenderTime-today)/86400000)):0}} 天</span> -->
                            <span v-if="borrow.borrowStatus==5">{{Math.floor((borrow.endTenderTime-today)/86400000)}} 天</span>
                            <span v-if="borrow.borrowStatus!=5"> 0天</span>
                        </li>
                    </ol>
                    <div class="cycle">
                        <div class="cycle_title">
                            投资周期
                        </div>
                        <div class="cycle_line">
                            <el-steps :active="1" align-center>
                                <el-step title="今日投资" :description="today | formatTime"></el-step>
                                <!-- 允许投标结束时间 + 1 -->
                                <el-step v-if="borrow.borrowStatus==5" title="项目成立" :description="(borrow.endTenderTime) | formatTime"></el-step>
                                <el-step v-if="borrow.borrowStatus!=5" title="项目成立" :description="(borrow.publishDatetime) | formatTime"></el-step>
                                <!-- 允许投标结束时间 + 1 + 融资期限 -->
                                <el-step v-if="borrow.borrowStatus==5" title="项目到期" :description="(borrow.endTenderTime+(borrow.borrowTimeLimit+1)*86400000) | formatTime"></el-step>
                                <el-step v-if="borrow.borrowStatus!=5" title="项目到期" :description="(borrow.publishDatetime+(borrow.borrowTimeLimit+1)*86400000) | formatTime"></el-step>
                                <!-- 允许投标结束时间 + 1 + 融资期限 + 1 -->
                                <el-step v-if="borrow.borrowStatus==5" title="本息到账" :description="(borrow.endTenderTime+(borrow.borrowTimeLimit+1+1)*86400000) | formatTime"></el-step>
                                <el-step v-if="borrow.borrowStatus!=5" title="本息到账" :description="(borrow.publishDatetime+(borrow.borrowTimeLimit+1+1)*86400000) | formatTime"></el-step>
                            </el-steps>
                        </div>
                    </div>
                </div>
                <div class="quota">
                    <div class="investData" v-if="this.borrow.borrowStatus==5">
                        <div class="amount">剩余可投（元）<span class="red_text num">{{borrow.borrowSum - borrow.tenderSum | toDoubleThousands}}</span></div>
                        <div class="progress">
                            <label class="label_title">项目进度</label>
                            <el-progress :percentage="borrow.tenderSum? Math.floor(borrow.tenderSum/borrow.borrowSum*100):0"></el-progress>
                        </div>
                        <div class="balance">
                            <div v-if="!!this.$store.state.userData && !!this.$store.state.userData.username">
                                <label class="label_title">账户余额(元)</label>
                                <span>{{account.availableMoney||0 |toDoubleThousands}}</span>
                            </div>
                            <span class="blue_link put">
                                <router-link :to="{path:'/user-center/recharge'}">充值</router-link>
                            </span>
                        </div>
                        <div class="money">
                            <label class="label_title">投资金额</label>
                            <el-input class="money_input" v-model="investInfos.investAmount" @input="amountChange" type="" name="" :placeholder="(borrow.minAmount||'100')+'起投，'+borrow.minAmount+'递增递减'"></el-input>
                            <!-- <input type="" name="" v-model="investInfos.investAmount" class="money_input" :placeholder="(borrow.minAmount||'100')+'起投，1万递增递减'" /> -->
                        </div>
                        <div>
                            <label class="label_title">　　　　</label>
                            <div class="tips" v-if="!!tips">* {{tips}}</div>
                        </div>
                        <div class="profit">
                            <label class="label_title">预期收益（元）</label>
                            <!-- 预期收益 = 投资金额*(历史年化收益率*(投资期限/360) -->
                            <span class="red_text" v-if="investInfos.investAmount">{{investInfos.investAmount * (borrow.annualFinancingRate/100*(borrow.borrowTimeLimit/360)) | keepTwoPoints}}</span>
                        </div>
                    </div>
                    <div v-if="this.borrow.borrowStatus!==5" class="investDataNull">

                    </div>
                    <div>
                        <button v-if="!isLogin" class="all_btn bule_btn invest_btn" :disabled="!isAccept || borrow.tenderSum == borrow.borrowSum || today > borrow.endTenderTime" @click="toInvest">立即投资</button>
                        <button v-if="isLogin" class="all_btn bule_btn invest_btn" :disabled="!isAccept || userType==1 || borrow.tenderSum == borrow.borrowSum || borrow.borrowStatus!==5" @click="toInvest">
                            <span v-if="this.borrow.borrowStatus==5">立即投资</span>
                            <span v-if="this.borrow.borrowStatus!==5">募集结束</span>
                        </button>
                    </div>
                    <div class="loanAgree">
                        <invest-dialog :invest-infos="investInfos" @get-investRecords="getInvestRecords"></invest-dialog>
                    </div>
                    <div v-if="this.borrow.borrowStatus==5" class="agreement">
                        <input type="checkbox" v-model="isAccept">
                        <span class="model">我已阅读并接受<b class="blue_link" @click="isShowloanDialog = true">《借款协议》</b>（范本）</span>
                        <div class="loanAgree">
                            <el-dialog title="借款协议" :visible.sync="isShowloanDialog">
                                <div v-html="text"></div>
                            </el-dialog>
                        </div>
                    </div>
                </div>
            </div>
            <div class="material">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="项目介绍" name="first">
                        <div class="proIntroduce">
                            <div class="title">审核项目</div>
                            <div class="auditPro">
                                <table class="table" cellspacing="0">
                                    <tr>
                                        <td>公司工商信息</td>
                                        <td>
                                            <i class="auditedIco"></i>
                                            <b>已审核</b>
                                        </td>
                                        <td>营业执照</td>
                                        <td>
                                            <i class="auditedIco"></i>
                                            <b>已审核</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>开户许可证</td>
                                        <td>
                                            <i class="auditedIco"></i>
                                            <b>已审核</b>
                                        </td>
                                        <td>法人及股东身份证</td>
                                        <td>
                                            <i class="auditedIco"></i>
                                            <b>已审核</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>公司章程</td>
                                        <td>
                                            <i class="auditedIco"></i>
                                            <b>已审核</b>
                                        </td>
                                        <td>经验场所实地认证</td>
                                        <td>
                                            <i class="auditedIco"></i>
                                            <b>已审核</b>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="title marginT45" v-if="false&&(auditMap.businessLicense || auditMap.legalPersonPhotoo || auditMap.legalPersonPhoto || auditMap.organizationLicense)">项目资料</div>
                            <div class="proInfos" v-show="false">
                                <div class="ins">
                                    <!-- <img style="opacity:0" class="leftIcon" @click="prev()" src="/static/img/financeList/left@2x.png" /> -->
                                    <img style="opacity:0" class="leftIcon" src="/static/img/financeList/left@2x.png" />
                                    <div class="imgs">
                                        <div>
                                            <img v-if="auditMap.businessLicense" :src="auditMap.businessLicense"/>
                                            <img v-if="auditMap.legalPersonPhotoo" :src="auditMap.legalPersonPhotoo" />
                                            <img v-if="auditMap.organizationLicense" :src="auditMap.organizationLicense" />
                                            <img v-if="auditMap.legalPersonPhoto" :src="auditMap.legalPersonPhoto" />
                                        </div>
                                    </div>
                                    <!-- <img style="opacity:0" class="rightIcon" @click="next()" src="/static/img/financeList/right@2x.png" /> -->
                                    <img style="opacity:0" class="rightIcon" src="/static/img/financeList/right@2x.png" />
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="安全保障" name="second">
                        <div class="safetyGuarantee">
                            <ul>
                                <li>
                                    <div class="img">
                                        <img src="/static/img/financeList/lawyers.png" />
                                    </div>
                                    <div class="txt">
                                        <b>两大权威律师事务所合规支持</b>
                                        <p>沪深合创平台聘用了国内权威律师事务所作为公司的常年法律顾问。沪深合创平台所有业务活动以及相关合同和协议均咨询律师事务所，确保其符合相关法律法规，沪深合创平台合法守信经营，让沪深合创平台的用户权益受国家法律保护。</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="img">
                                        <img src="/static/img/financeList/largeData.png" />
                                    </div>
                                    <div class="txt">
                                        <b>360°严格风控体系</b>
                                        <p>沪深合创平台拥有强大专业的风控团队，采用银行级的风控制度和流程。</p>
                                        <p>贷前：针对每一个借款人的资质进行线上大数据建模分析和线下实地考核相结合，评估借款人的还款能力和还款意愿，保证借款人的质量。</p>
                                        <p>贷中：采用技术手段跟踪每一笔借款的资金走向，确保资金完全用于经过贷前审核的项目，保证借款资金的专款专用。</p>
                                        <p>贷后：利用大数据平台对借款人的状态进行实时扫描和追踪，如出现风险，沪深合创平台的专业团队奖第一时间进行风险管理。</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="img">
                                        <img src="/static/img/financeList/safety.png" />
                                    </div>
                                    <div class="txt">
                                        <b>合作保障机构</b>
                                        <p>沪深合创平台已和业内多家专业的商业保理公司和担保公司达成合作。针对不同的项目，将有相应的合作保障机构进行担保。一旦借款人还款出现坏账，将由相应的合作保障机构对投资人的本息进行垫付。
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <div class="img">
                                        <img src="/static/img/financeList/bank.png" />
                                    </div>
                                    <div class="txt">
                                        <b>银行级网站技术</b>
                                        <p>沪深合创平台有用强大专业的互联网技术团队，核心成员来自著名的互联网金融公司有丰富的行业经验。同时沪深合创平台的网络系统采用了阿里巴巴集团旗下的“阿里云”金融解决方案，该技术平台通过了公安部等级保护评测，达到了银行级技术水平。
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="'投资记录（'+ (!!appUsers.count?appUsers.count:0) +'）'" name="third">
                        <div class="investmentRecords">
                            <table class="table" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>投资人</th>
                                        <th>金额（元）</th>
                                        <th>时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user,i) in appUsers.list" :key="i">
                                        <td>{{user.mobile}}</td>
                                        <td>{{user.bidAmount |toDoubleThousands('thousand')}}</td>
                                        <td>{{user.createTime}}</td>
                                    </tr>
                                    <tr v-if="!appUsers.count">
                                        <td colspan="3" class="no-data">暂无数据</td>
                                    </tr>
                                </tbody>
                            </table>
                            <pagination v-if="!!appUsers.count" :page-data="pageData" @page-changed="pageChanged"></pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <less-balance :less-balance="lessBalance"></less-balance>
    </div>
</template>

<script>
    import pagination from '../common/pagination.vue'
    import investDialog from './investDialog.vue'
    import lessBalance from './lessBalanceDialog.vue'
    export default {
        name: 'financeDetail',
        data() {
            return {
                today: '',
                account: {},
                appUsers: {},
                auditMap: {},
                borrow: {},
                activeName: 'first',
                isAccept: true,
                step: 1,
                text:'',
                investProgress: 1,
                // investAmount: null,
                tips: '',
                pageData: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: null,
                },
                isShowloanDialog: false,
                // 投资弹框
                investInfos: {
                    isShowInvestDialog: false,
                    info: {},
                    investAmount: null,
                },
                showLoginBoxNums: 0,
                lessBalance: {
                    isShowLessBalanceDialog: false
                }
            }
        },
        components: {
            pagination,
            investDialog,
            lessBalance
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.getDetails();
                this.getInvestRecords();
                this.getText();
            },
            handleClick(tab, event) {
            },
            getDetails() {
                let borrowId = this.$route.query.borrowId;
                let params = null
                if(localStorage.UD){
                    params = {borrowId:borrowId,userId:JSON.parse(localStorage.UD).id}
                }else{
                    params = {borrowId:borrowId}
                }
                this.$ajax.post('/basemall-fax/borrow/borrow-detail',params).then((res) => {
                    this.investInfos.info = res;
                    this.today = res.today;
                    this.account = res.account;
                    this.auditMap = res.auditMap;
                    this.borrow = res.borrow;
                });
                // let url = ""
                // if(localStorage.UD){
                //     url = '/basemall-fax/borrow/borrow-detail?borrowId='+ borrowId + '&userId=' + JSON.parse(localStorage.UD).id
                // }else{
                //     url = '/basemall-fax/borrow/borrow-detail?borrowId='+ borrowId
                // }
                // this.$ajax.get(url).then((res) => {
                //     this.investInfos.info = res;
                //     this.today = res.today;
                //     this.account = res.account;
                //     this.auditMap = res.auditMap;
                //     this.borrow = res.borrow;
                //     console.log(res.borrow.borrowStatus);
                // });
            },
            getText(){
                this.$ajax.post('/basemall-cms/index/get-detail-by-findcode',{findCode:'LoanAgreement'}).then((res)=>{
                    this.text = res.content;
                })
            },
            toInvest() {
                if (!!this.$store.state.userData.username) {
                    let borrowId = this.$route.query.borrowId;
                    this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then((res) => {
                        if(true){
                            if (this.amountChange()) {
                                if (!!this.investInfos.investAmount) {
                                    this.investInfos.isShowInvestDialog = true;
                                }
                            }
                        } else{
                            this.$message.warning('还未认证不可投资！！')
                        }
                    })
                } else {
                    this.$store.commit('showLoginBox');
                }

                if (this.investInfos.investAmount > (this.borrow.borrowSum - this.borrow.tenderSum)) {
                    this.$message.warning('可投资金额不足');
                    this.investInfos.investAmount = null;
                    this.getDetails();
                }
            },
            amountChange() {
                if (!!this.$store.state.userData.username && this.userType == 3) {
                    // 补标用户手机号 41343124532
                    if (!this.investInfos.investAmount) {
                        this.tips = '请输入投资金额';
                        return false;
                    } else {
                        if (this.investInfos.investAmount > (this.borrow.borrowSum - this.borrow.tenderSum)) {
                            this.tips = '投资金额已超过最大投资额';
                            return false;
                        } else if ((this.$store.state.userData.username != '41343124532') && this.investInfos.investAmount < this.borrow.minAmount) {
                            this.tips = `投资金额应大于最低投标金额${this.borrow.minAmount}元`;
                            return false;
                        } else if ((this.$store.state.userData.username != '41343124532') && this.investInfos.investAmount % 1000 != 0) {
                            this.tips = '投资金额应该是1000的倍数';
                            return false;
                        } else if(this.$store.state.userData.username == '41343124532' && this.investInfos.investAmount <= 0){
                            this.tips = '请输入大于0的投资金额';
                            return false;
                        } else if (this.investInfos.investAmount > this.account.availableMoney) {
                            // this.tips = '账户余额不足，请先充值';
                            this.lessBalance.isShowLessBalanceDialog = true;
                            return false;
                        } else {
                            this.tips = '';
                            return true;
                        }
                    }
                }
            },
            validateValue() {
                this.tips = '';
                // this.investInfos.investAmount = parseInt(this.investInfos.investAmount.replace(/[\D]/gi, ''));
                // this.investInfos.investAmount = this.investInfos.investAmount.replace(/[\D]/gi, 0);
                this.investInfos.investAmount = this.investInfos.investAmount;
            },
            getInvestRecords() {
                this.$ajax.post(`/basemall-fax/borrow-bid/select-investment-records`, {
                    borrowId: parseInt(this.$route.query.borrowId),
                    pageIndex: this.pageData.pageIndex,
                    pageSize: this.pageData.pageSize,
                }).then((res) => {
                    this.appUsers = res;
                    this.pageData.total = res.count;
                });
            },
            pageChanged(pageIndex) {
                this.pageData.pageIndex = pageIndex;
                this.getInvestRecords();
            },
            prev() {
                if (this.step <= 6) {
                    --this.step;
                    $('.proInfos .ins .imgs div').animate({
                        'right': '0',
                        'left': (227 * (this.step - 1)) + 'px'
                    }, 500);
                    if (this.step <= 1) {
                        this.step = 1;
                    }
                }
            },
            next() {
                if (this.step < 6) {
                    ++this.step;
                    $('.proInfos .ins .imgs div').animate({
                        'right': '0',
                        'left': -(227 * (this.step - 1)) + 'px'
                    }, 500);
                } else if (this.step >= 6) {
                    this.step = 1;
                }
            },
        },
        computed: {
            isLogin() {
                return !!this.$store.state.userData.username;
            },
            userType() {
                return this.$store.state.userData.userType
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    @import '../../assets/css/comcss/com_UI.less';
    @import '../../less/financeDetail.less';
</style>
