<template>
    <div class="investDialog">
        <el-dialog title="确认投资" :visible.sync="investInfos.isShowInvestDialog">
            <div class="con">
                <div class="title">产品信息</div>
                <div class="ins">
                    <dl>
                        <dt>产品名称：</dt>
                        <dd>{{investInfos.info.borrow && investInfos.info.borrow.borrowTitle}}</dd>
                    </dl>
                    <dl>
                        <dt>项目期限：</dt>
                        <dd>{{investInfos.info.borrow && investInfos.info.borrow.borrowTimeLimit}}天</dd>
                    </dl>
                    <dl>
                        <dt>还款方式：</dt>
                        <dd v-if="investInfos.info.borrow && investInfos.info.borrow.repaymentStyle == 1">一次性还款</dd>
                        <dd v-if="investInfos.info.borrow && investInfos.info.borrow.repaymentStyle == 2">按月分期</dd>
                        <dd v-if="investInfos.info.borrow && investInfos.info.borrow.repaymentStyle == 3">每月还息到期还本</dd>
                    </dl>
                    <dl>
                        <dt>融资总额：</dt>
                        <dd v-if="investInfos.info.borrow">{{investInfos.info.borrow.borrowSum | toDoubleThousands}}元</dd>
                    </dl>
                </div>
            </div>
            <div class="con profit">
                <div class="title"></div>
                <div class="ins">
                    <dl>
                        <dt>历史年化收益率：</dt>
                        <dd v-if="investInfos.info.borrow">{{investInfos.info.borrow.annualFinancingRate}}%</dd>
                    </dl>
                    <dl>
                        <dt>预期收益：</dt>
                        <dd class="colorRed" v-if="investInfos.info.borrow && investInfos.investAmount">{{investInfos.investAmount * (investInfos.info.borrow.annualFinancingRate/100*(investInfos.info.borrow.borrowTimeLimit/360)) | keepTwoPoints}}元</dd>
                        <!-- 预期收益 = 投资金额*(历史年化收益率*(投资期限/360) -->
                    </dl>
                    <dl>
                        <dt>实际付款金额：</dt>
                        <dd class="colorRed" v-if="investInfos.info.borrow&&investInfos.investAmount">{{investInfos.investAmount | toDoubleThousands}}元</dd>
                    </dl>
                </div>
            </div>
            <div class="con pwd">
                <div class="title">交易密码</div>
                <div class="ins">
                    <dl>
                        <dt><el-input v-model="pwd" type="password" placeholder="" :maxlength="6" style="width: 250px;"></el-input></dt>
                        <dd class="forgetPwd">
                            <router-link to="/user-center/account-safety">忘记交易密码？</router-link>
                        </dd>
                    </dl>
                    <dl>
                        <dd>
                            <div class="btns">
                                <el-button :loading="paying" @click="confirmInvest($event)">确认投资</el-button>
                                <el-button @click="cancelInvest">取消投资</el-button>
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['investInfos'],
        data() {
            return {
                paying:false,
                pwd: null,
            }
        },
        created() {

        },
        methods: {
            confirmInvest() {
                if (!!this.pwd) {
                    this.$ajax.post('/basemall-account/account/check-pay-password', {
                        payPassWord: this.pwd
                        })
                        .then(res => {
                            this.paying=true;
                            this.$ajax.post('/basemall-fax/borrow/add-investment', {
                                    borrowId: this.investInfos.info.borrow.id,
                                    amount: this.investInfos.investAmount
                                })
                                .then(res => {
                                    this.tips = '';
                                    this.paying=false;
                                    (this.pwd = null), (this.investInfos.investAmount = null)
                                    this.investInfos.isShowInvestDialog = false
                                    this.$emit('get-investRecords')
                                    this.$router.push({
                                        path: '/finance/investSuc',
                                        query: {
                                            investInfos: this.investInfos
                                        }
                                    })
                                })
                        })
                } else {
                    this.$message.warning('请输入交易密码');
                }

            },
            cancelInvest() {
                this.investInfos.isShowInvestDialog = false;
                this.pwd = null;
            },
        },
    }
</script>

<style lang="less" scoped>
    .colorRed {
        color: red;
    }
</style>


