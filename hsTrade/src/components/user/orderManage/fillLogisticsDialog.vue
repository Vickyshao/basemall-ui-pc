<template>
    <div class="sellerDelivery">
        <el-dialog title="发货确认" :visible.sync="fillLogistics.isShow" width="749px">
            <div class="border1"></div>
            <div class="upload">
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>
            <div class="bot">
                <el-button class="btnUpload" type="">确认</el-button>
                <div class="tips">支持上传2M之内jpg、gif、png格式图片 </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['fillLogistics'],
        created() {
            console.log('fillLogistics ', this.fillLogistics);

        },
        data() {
            return {
                num: null,
                logisticsPics: [],
            };
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
    .colorRed {
        color: red;
    }

    .sellerDelivery {
        .el-dialog__wrapper {
            border-radius: 4px;
            .el-dialog {
                position: relative;
                border-radius: 4px;
                .border1 {
                    position: absolute;
                    border-top: 1px solid #ebebeb;
                    width: 708px;
                    height: 1px;
                    top: 70px;
                }
                .el-dialog__header {
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    .el-dialog__title {
                        color: #fff;
                        font-size: 20px !important;
                        margin-top: 20px !important;
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
                    padding: 30px 30px;
                    .title {
                        font-size: 16px;
                        color: #000;
                        margin-top: 10px;
                    }
                    .upload {
                        color: #666;
                        margin-top: 25px;
                        ul {
                            li {
                                width: 198px;
                                height: 105px;
                                display: inline-block;
                                margin-right: 39px;
                                &:last-child {
                                    margin-right: 0;
                                }
                                .pic {
                                    border: 1px solid #ccc;
                                    width: 198px;
                                    height: 105px;
                                    &.defaultPic {
                                        background: url(/static/img/user/defaultPic.png) no-repeat left center;
                                    }
                                    &.addPic {
                                        background: url(/static/img/user/addPic.png) no-repeat center center;
                                        cursor: pointer;
                                        #file {
                                            width: 100%;
                                            height: 105px;
                                            opacity: 0;
                                        }
                                    }
                                }
                                .num {
                                    margin-top: 10px;
                                    font-size: 15px;
                                    border: 0;
                                    text-align: center;
                                }
                            }
                        }
                    }
                    .bot {
                        width: 100%;
                        display: table;
                        margin-top: 15px;
                        div {
                            display: table-cell;
                            vertical-align: middle;
                            height: 52px;
                            .btnUpload {
                                width: 160px;
                                height: 52px;
                                color: #fff;
                                font-size: 20px;
                                background: #1650a2;
                            }
                            &.tips {
                                font-size: 14px;
                                display: inline-block;
                                padding-top: 4px;
                            }
                        }
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
