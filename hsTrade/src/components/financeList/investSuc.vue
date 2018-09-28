<template>
    <div class="investSuc">
        <div class="details">
            <div class="icoSuc">恭喜您，投资成功！</div>
            <ul class="state">
                <li class="active">
                    <div>投资成功</div>
                    <div class="date">{{investInfos.info.today | formatTime}}</div>
                </li>
                <li>
                    <div>项目成立</div>
                    <div class="date">{{(investInfos.info.borrow.endTenderTime) | formatTime}}</div>
                </li>
                <li>
                    <div>项目到期（1日后到账）</div>
                    <div class="date">{{(investInfos.info.borrow.endTenderTime+(investInfos.info.borrow.borrowTimeLimit+1)*86400000) | formatTime}}</div>
                </li>
            </ul>
            <div class="btns">
                <span>现在您可以</span>
                <router-link :to="'/user-center/my-investment'"><button>查看详情</button></router-link>
                <router-link :to="'/finance/list'"><button class="write_btn">继续投资</button></router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [''],
        data() {
            return {
                investInfos: {},
            }
        },
        created() {
            this.investInfos = this.$route.query.investInfos;
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
    @grey: #666;
    @lightGrey: #d1d1d1;
    @blue: #1650a2;
    .investSuc {
        width: 1200px;
        background: #fff;
        margin: 0 auto;
        padding: 73px;
        margin-bottom: 38px;
        color: #000;
        font-size: 18px;
        .details {
            width: 400px;
            margin: 0 auto;
            text-align: left;
            .icoSuc {
                width: auto;
                height: 55px;
                padding-left: 80px;
                font-size: 32px;
                background: url('/static/img/financeList/investSuc.png') no-repeat left top;
            }
            ul.state {
                width: 570px;
                display: inline-table;
                white-space: nowrap;
                font-size: 14px;
                li {
                    float: left;
                    width: 146px;
                    line-height: 53px;
                    text-align: center;
                    span {
                        color: #666;
                        margin-right: 19px;
                    }
                    &::before {
                        display: inline-table;
                        width: 147px;
                        content: '';
                        border-top: 2px solid @lightGrey;
                        color: @lightGrey;
                        position: relative;
                        top: 74px;
                        .date {
                            color: #333;
                        }
                    }
                    &::after {
                        width: 13px;
                        height: 13px;
                        content: '';
                        border-radius: 50%;
                        position: relative;
                        top: -93px;
                        background: @lightGrey;
                        display: inline-table;
                    }
                    &.active {
                        color: @blue;
                        &::before {
                            border-color: @blue;
                        }
                        &::after {
                            background: @blue;
                        }
                    }
                }
            }
            .btns {
                .write_btn{
                    background: transparent;
                    border: 1px solid #1650a2;
                    color: #1650a2;
                }
                span {
                    color: @grey;
                    font-size: 16px;
                    padding-right: 19px;
                }
                a {
                    cursor: pointer;
                    button {
                        width: 132px;
                        height: 50px;
                        line-height: 50px;
                        font-size: 20px;
                        border-radius: 4px;
                        color: #fff;
                        background: @blue;
                    }
                    &:last-child {
                        float: right;
                        background: #fff;
                    }
                }
            }
        }
    }
</style>


