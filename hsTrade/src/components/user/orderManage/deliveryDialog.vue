<template>
    <div class="sellerDelivery">
        <el-dialog title="发货确认" :visible.sync="sellerDelivery.isShowDialog" width="749px" :before-close="beforeClose">
            <div class="border1"></div>
            <div class="title">请添加发货的物流单及单号：</div>
            <div class="upload">
                <ul>
                    <li v-for="(v, i) in logisticsPics">
                        <div class="pic addPic" v-if="!v.img"></div>
                        <input id="picUpload" class="uploadImg" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="up($event,i)" />
                        <div class="pic" v-if="v.img">
                            <img :src="v.img">
                        </div>
                        <img class="delImg pointer" @click="del(i)" v-if="v.img" />
                        <el-input v-model="v.num" placeholder="请输入物流单号" @blur="numBlur"></el-input>
                    </li>
                </ul>
            </div>
            <div class="bot">
                <div>
                    <el-button class="btnUpload" plain :disabled="logisticsPics.length==5" @click="addItem">添加</el-button>
                </div>
                <div class="tips">
                    <p>最多可添加5张照片，支持添加2M之内jpg、gif、png格式图片</p>
                    <p class="colorRed">添加后不可修改、请核实</p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancleUpload">取 消</el-button>
                    <el-button type="primary" @click="complete">确 定</el-button>
                </span>
        </el-dialog>
        <!-- <div class="pay-success">
            <div class="top clear">
                <p>您的订单<span></span>发货成功</p>
            </div>
            <div class="bottom">
                <el-button type="primary">提醒验收</el-button>
            </div>
        </div> -->
    </div>
</template>

<script>
    export default {
        created() {},
        components: {},
        props: ['sellerDelivery'],
        data() {
            return {
                logisticsPics: [{
                    img: '',
                    num: ''
                }],
                dialogVisible: false,
            };
        },
        methods: {
            deliver(success, fail) {
                this.logisticsPics.forEach((v,i)=>{
                    if(!v.img) {
                        this.logisticsPics.splice(i,1);
                    }
                });
                let data = {
                    id: this.$route.query.id || this.sellerDelivery.id,
                    detailId: this.sellerDelivery.detailId,
                    expressNumbers: this.logisticsPics.map(_ => _.num).join(','),
                    expressImages: this.logisticsPics.map(_ => _.img).join(','),
                };
                this.$ajax.post('/basemall-shop/shop-order/delivery', data).then((res) => {
                    success(res);
                    // this.updateState();
                }).catch(() => {
                    fail()
                });
            },
            updateState(state) {
                this.$ajax.post(`/basemall-shop/shop-order/update-state`, {
                    id: this.$route.query.id || this.sellerDelivery.id,
                    orderState: 5,
                    tradingState: 3
                }).then((res) => {});
            },
            addItem() {
                let list = [...this.logisticsPics];
                if(list.length>0){
                    if (!!list[list.length - 1].num && !!list[list.length - 1].img) {
                        this.logisticsPics.push({
                            img: '',
                            num: ''
                        })
                    } else if(!list[list.length - 1].num&&!list[list.length - 1].img) {
                        this.$message.warning('请添加发货的物流单及单号');
                    } else if(!list[list.length - 1].num) {
                        this.$message.warning('请输入物流单号');
                    } else if(!list[list.length - 1].img){
                        this.$message.warning('请添加发货的物流单');
                    }
                }else{
                    this.logisticsPics.push({
                        img: '',
                        num: ''
                    })
                }
            },
            complete() {
                if(!!this.logisticsPics[0].num && !!this.logisticsPics[0].img){
                    if (!!this.logisticsPics[this.logisticsPics.length - 1].num == !!this.logisticsPics[this.logisticsPics.length - 1].img) {
                        this.deliver((res) => {
                            this.sellerDelivery.isShowDialog = false;
                            // this.$message.success('订单发货成功');
                            // this.$emit('renew-list');
                            // this.$emit('renew-detail');
                            // this.setNull();
                            
                            //卖方已经发货，买方收到新消息
                            // this.$ajax.post('/basemall-shop/shop-order/remind',{
                            //     id: this.$route.query.id || this.sellerDelivery.id,
                            //     field:0
                            // }).then(((res)=>{
                                
                            // }));
                            //发货成功控制显示发货成功页面，隐藏左边导航
                            window.sendSuccess.status = true
                            window.hideUserAside.val = true

                        }, () => {});
                    } else if(!this.logisticsPics[this.logisticsPics.length - 1].num) {
                        this.$message.warning('请输入物流单号');
                    } else if(!this.logisticsPics[this.logisticsPics.length - 1].img) {
                        this.$message.warning('请添加发货的物流单');
                    }
                } else if(!this.logisticsPics[this.logisticsPics.length - 1].img && !this.logisticsPics[this.logisticsPics.length - 1].num) {
                     this.$message.warning('请添加发货的物流单及单号');
                } else if(!this.logisticsPics[this.logisticsPics.length - 1].img){
                     this.$message.warning('请添加发货的物流单');
                } else if(!this.logisticsPics[this.logisticsPics.length - 1].num){
                    this.$message.warning('请输入物流单号');
                }
            },

            numBlur() {
                if (!!this.logisticsPics[this.logisticsPics.length - 1].img && !this.logisticsPics[this.logisticsPics.length - 1].num) {
                    this.$message.warning('请输入物流单号');
                }
            },
            up(e, i) {
                let file = e.target.files[0];
                let param = new FormData();
                param.append('uploadFiles', file);
                if (file.size > (2 * 1024 * 1024)) {
                    this.$message.warning('所添加的图片大小不能超过 2MB!');
                    return false;
                }
                this.$ajax.uploadImg('/basemall-shop/shopCommon/uploadFiles', param)
                    .then(res => {
                        this.logisticsPics[i].img = res[0];
                    });
            },
            del(i) {
                this.logisticsPics.splice(i, 1);
            },
            beforeClose(done) {
                done();
                this.setNull();
            },
            cancleUpload(){
                this.sellerDelivery.isShowDialog = false;
                this.setNull();
            },
            setNull(){
                this.logisticsPics = [{
                    img: '',
                    num: ''
                }];
            }
        }
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
                                width: 197px;
                                display: inline-block;
                                margin-right: 39px;
                                margin-bottom: 15px;
                                position: relative;
                                &:last-child {
                                    margin-right: 0;
                                }
                                &:nth-child(3n) {
                                    margin-right: 0;
                                }
                                .pic {
                                    border: 1px dashed #ccc;
                                    width: 198px;
                                    height: 106px;
                                    text-align: center;
                                    overflow: hidden;
                                    img {
                                        max-width: 198px;
                                        max-height: 106px;
                                    }
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
                                .delImg {
                                    position: absolute;
                                    width: 20px;
                                    height: 20px;
                                    background: url(/static/img/user/close.png) no-repeat right top;
                                    border: 0;
                                    top: 8px;
                                    right: 5px;
                                    cursor: pointer;
                                }
                                .el-input {
                                    margin-top: 10px;
                                }
                                .num {
                                    width: 199px;
                                    height: 42px;
                                    font-size: 15px;
                                    text-align: center;
                                }
                                .uploadImg {
                                    position: absolute;
                                    width: 198px;
                                    height: 105px;
                                    top: 0;
                                    opacity: 0;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                    .bot {
                        width: 100%;
                        display: table;
                        margin-top: 35px;
                        div {
                            display: table-cell;
                            vertical-align: middle;
                            height: 52px;
                            .btnUpload {
                                width: 119px;
                                height: 48px;
                                // color: #fff;
                                font-size: 18px;
                                // background: #1650a2;
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
        .pay-success {
            text-align: center;
            padding-top: 80px;
            margin: 0 auto;
            .top {
                padding-left: 80px;
                background: url(/static/img/user/payment@2x.png) no-repeat left top;
                background-size: auto 55px;
                display: inline-block;
                text-align: left;
                font-size: 29px;
                line-height: 55px;
                height: 55px;
                margin-bottom: 20px;
            }
            &>p {
                color: #666;
                font-size: 16px;
                margin-bottom: 10px;
                white-space: nowrap;
            }
            .bottom {
                margin-top: 30px;
                margin-bottom: 50px;
                .write_btn{
                    background: transparent;
                    border: 1px solid #1650a2;
                    color: #1650a2;
                }
            }
        }
        p {
            text-align: justify;
        }
        text-align: left;
    }
</style>
