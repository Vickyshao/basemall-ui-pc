<template>
    <div class="lessBalance">
        <el-dialog :visible.sync="lessBalance.isShowLessBalanceDialog" width="424px">
            <div class="title">
                <!-- <img src="/static/img/user/sigh.png"/> -->
                您的账户余额不足，立即去充值？</div>
            <div>
                <router-link :to="'/user-center/recharge'">
                    <el-button type="">提交</el-button>
                </router-link>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {},
        props: ['lessBalance'],
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
    .lessBalance {
        .el-dialog__wrapper {
            border-radius: 4px;
            .el-dialog {
                border-radius: 4px;
                .el-dialog__header {
                    padding: 18px 20px 14px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    .el-dialog__title {
                        color: #fff;
                    }
                    background: #1650a2;
                    .el-dialog__headerbtn {
                        .el-dialog__close {
                            &::before {
                                font-size: 25px;
                                color: #fff;
                            }
                        }
                    }
                }
                .el-dialog__body {
                    line-height: 50px;
                    padding: 50px 20px;
                    div {
                        text-align: center;
                        font-size: 16px;
                    }
                    .title {
                        font-size: 20px;
                        color: #000;
                        margin-top: 10px 28px 0 0;
                        background: url(/static/img/user/sigh.png) no-repeat left center/contain;
                    }
                    a {
                        .el-button {
                            width: 312px;
                            height: 50px;
                            margin: 0 auto;
                            text-align: center;
                            display: inherit;
                            margin-top: 58px;
                            background: #1650a2;
                            color: #fff;
                            color: #fff;
                            font-size: 20px;
                        }
                    }
                }
            }
        }
        text-align: left;
    }
</style>
