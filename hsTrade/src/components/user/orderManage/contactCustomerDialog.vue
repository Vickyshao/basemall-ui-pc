<template>
    <div class="contactCustomer">
        <el-dialog :visible.sync="contactCustomer.isShowCustomerDialog" width="424px">
            <div class="title">请拨打客服热线</div>
            <div class="phone">{{phoneNum}}</div>
            <div class="workingtime">工作时间：09：00-18:00</div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
        },
        props: ['contactCustomer'],
        data() {
            return {
                phoneNum: localStorage.getItem('phoneNum')
            };
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
    .contactCustomer {
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
                    div {
                        text-align: center;
                        font-size: 16px;
                    }
                    .title {
                        font-size: 20px;
                        color: #000;
                        margin-top: 10px;
                    }
                    .phone {
                        color: #1650a2;
                        font-size: 30px;
                        margin: 35px auto;
                    }
                    .workingtime {
                        margin-bottom: 30px;
                    }
                }
            }
        }
        p {
            text-align: justify;
        }
        text-align: left;
    }
</style>
