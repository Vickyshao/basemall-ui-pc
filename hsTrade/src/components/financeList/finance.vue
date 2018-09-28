<template>
    <div class="finance_container">
        <div class="finance">
            <div class="list_title">
                融资列表
            </div>
            <div class="list_box">
                <ul>
                    <li v-if="pageData.total<=0">
                         <div class="no-data">暂无数据</div>
                    </li>
                    <li v-if="pageData.total>0" class="list_li" v-for="list in borrowLists" :key="list.id" :class="[list.tenderSum == list.borrowSum ? 'inoperable' : '']">
                        <div class="company_title">{{list.borrowTitle}}</div>
                        <ol class="project_list">
                            <li class="project_li">
                                <p class="red_text number"><span class="data">{{list.annualFinancingRate}}</span>%</p>
                                <i class="notes">历史年化收益率</i>
                            </li>
                            <li class="project_li">
                                <p class="number"><span class="data">{{list.borrowSum | toDoubleThousands}}</span>元</p>
                                <i class="notes">融资总额</i>
                            </li>
                            <li class="project_li">
                                <p class="number"><span class="data">{{list.borrowTimeLimit}}</span>天</p>
                                <i class="notes">融资期限</i>
                            </li>
                            <li class="project_li">
                                <p class="data number" v-if="list.repaymentStyle == 1">一次性还清</p>
                                <p class="data number" v-else-if="list.repaymentStyle == 2">按月分期</p>
                                <p class="data number" v-else-if="list.repaymentStyle == 3">每月还息到期还本</p>
                                <i class="notes">还款方式</i>
                            </li>
                            <li class="project_li" style="width: 130px;">
                                <el-progress :percentage="list.percentage||0" :stroke-width="2"></el-progress>
                                <el-button plain class="bule_tra_btn" type="text" :disabled="list.tenderSum == list.borrowSum" @click="toInvest(list.id)">立即投资</el-button>
                                <!-- <el-button v-show="list.tenderSum == list.borrowSum" type="text" class="bule_tra_btn">立即投资</el-button>-->
                            </li>
                        </ol>
                    </li>
                </ul>
                <pagination v-if="pageData.total>0" :page-data="pageData" @page-changed="pageChanged"></pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import pagination from '../common/pagination.vue'
    export default {
        name: 'finance',
        data() {
            return {
                borrowLists: [],
                pageData: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: null,
                },
            }
        },
        components: {
            pagination
        },
        created() {
            this.getBorrowList();
        },
        methods: {
            toInvest(id) {
                this.$router.push({
                    path: '/finance/detail',
                    query: {
                        borrowId: id
                    }
                });
            },
            getBorrowList: function() {
                let {
                    pageIndex,
                    pageSize
                } = this.pageData;
                this.$ajax.get('/basemall-fax/borrow/borrow-list' + this.tools.formatQueryParam(this.pageData)).then((res) => {
                    this.borrowLists = res.list;
                    this.pageData.total = res.total;
                    this.borrowLists.forEach(_ => {
                        let tenderSum = _.tenderSum || 0;
                        let borrowSum = _.borrowSum || 0;
                        _.percentage = Math.floor(tenderSum / borrowSum * 100)
                    });
                })
            },
            pageChanged(pageIndex) {
                this.pageData.pageIndex = pageIndex;
                this.getBorrowList();
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    @import '../../assets/css/comcss/com_UI.less';
    @import '../../less/areaClass.less';
    .finance {
        max-width: 1200px;
        margin: 0px auto 50px;
        background-color: @background-color;
        font-size: 15px;
        padding: 30px 45px;
        box-sizing: border-box;
        .list_title {
            height: 50px;
            font-size: 24px;
            border-bottom: 1px solid @line-color;
        }
        .list_box {
            .list_li {
                padding: 0 15px;
                border-bottom: 1px solid @line-color;
                .company_title {
                    padding: 30px 0;
                    font-size: 20px;
                    padding-left: 40px;
                    background: url(/static/img/financeList/financing_1@2x.png) no-repeat left center;
                    background-size: 30px auto;
                }
                .project_list {
                    text-align: center;
                    display: -webkit-flex;
                    /* Safari */
                    display: flex;
                    justify-content: space-between;
                    .project_li {
                        margin-bottom: 30px;
                        font-size: 18px;
                        .bule_tra_btn {
                            width: 117px;
                            color: #1650A2;
                            &:hover {
                                width: 117px;
                                color: darken(#1650A2, 16%);
                                border: 1px solid #1650a2;
                            }
                        }
                        .data {
                            font-size: 22px;
                        }
                        .number {
                            margin-bottom: 18px;
                        }
                        .notes {
                            color: @text-color-gray;
                            font-size: 14px;
                        }
                        .el-progress {
                            margin-bottom: 15px;
                            .el-progress-bar {
                                padding-right: 40px;
                                .el-progress-bar__outer {
                                    background-color: @background-color;
                                    border: 1px solid @progress-color;
                                    border-radius: 0;
                                    .el-progress-bar__inner {
                                        background-color: @progress-color;
                                        border-radius: 0;
                                    }
                                }
                            }
                            .el-progress__text {
                                color: @progress-color;
                                font-size: 14px;
                                margin-left: 20px;
                            }
                        }
                    }
                }
                &.inoperable {
                    background: #f7f7f7;
                    * {
                        color: #888;
                    }
                }
            }
            .list_li:hover {
                background-color: @table-background-color;
                cursor: pointer;
            }
        }
    }
</style>
