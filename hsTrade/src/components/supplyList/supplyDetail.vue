<template>
<div class="supplyDetail_container">
    <div class="supplyDetail">
        <div class="list_detail">
            <div class="goods_details">
               <img :src="buyForm.titleImage" alt="" class="goodImg">
            </div>
            <div class="goods_offer">
                <div class="title">{{this.buyForm.name}}</div>
                <div class="priceAndNum clearfix">
                    <div class="price">参考价:<span :class="{'red_text':!grayText,'gray_text':grayText}">¥ <b>{{priceAndNum.price|toDoubleThousands}}</b></span></div>
                    <div class="num"><span>剩余数量:<i class="gray_text">{{priceAndNum.quantity}}</i>{{buyForm.unit}}</span></div>
                </div>
                <div class="parameter">
                    <ul class="clearfix">
                        <li>
                            <label>供应商 :</label>
                            <span>{{buyForm.corpName}}</span>
                        </li>
                        <li>
                            <label>类别 :</label>
                            <span>{{buyForm.typeName}}</span>
                        </li>
                        <li>
                            <label>商品编号 :</label>
                            <span>{{buyForm.productNum}}</span>
                        </li>
                        <li>
                            <label>供货总量 :</label>
                            <span>{{buyForm.storage}}{{buyForm.unit}}</span>
                        </li>
                        <li>
                            <label>发布时间 :</label>
                            <span>{{buyForm.pubdateTime}}</span>
                        </li>
                        <li>
                            <label>有效时间 :</label>
                            <span>{{buyForm.overTime}}</span>
                        </li>
                    </ul>
                </div>
                <div class="offer" v-if="buyForm.status == 2">
                    <el-row v-for="(item,itemIndex) in attrList" :key="item.itemName">
                        <label for="">{{item.itemName}}</label>
                        <el-radio-group v-model="optionsSelected[itemIndex]" @change="optionsChange">
                            <el-radio-button v-for="color in item.colors" :label="color" :key="color.id">{{color.name}}</el-radio-button>
                        </el-radio-group>
                    </el-row>
                </div>
                <div class="offer_num">
                    <span class="num_name">数量</span>
                    <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10000" label="描述文字"></el-input-number>
                </div>
                <router-link tag="a" target="_blank" :to="{name:'询价',params:{},query:{id:$route.query.id,remoteId:remoteId,skuId:priceAndNum.id,skuKeyId:priceAndNum.keyId, remoteCorpName:buyForm.corpName, to:buyForm.userMobile}}">
                    <el-button v-show="false" ref="btnOffer" class="order_btn"></el-button>
                </router-link>
                <el-button type="primary" class="order_btn btn_offer" v-if="accout||!btnDisabled" :disabled="btnDisabled" @click="toOffer">
                    {{this.buyForm.status==2?'发起询价':'已结束'}}
                </el-button>
                <el-button type="primary" class="order_btn btn_offer" v-if="!accout && btnDisabled" @click="toOffer" :disabled="btnDisabled">
                    {{this.buyForm.status==2?'发起询价':'已结束'}}
                </el-button>
                <el-button type="primary" class="order_btn">下单</el-button>
            </div>
        </div>
        <div class="class_list">
            <div class="list_name">描述</div>
            <div class="describe_con">
                <div class="describe">
                    <div  v-html="buyForm.shopDetail"></div>
                </div>
            </div>
            <!-- <div class="list_name same_product">同类产品</div>
            <div class="clearfix">
                <ul class="supply_list">
                    <li class="goods_list" v-for="item in goodsList">
                        <router-link :to="{path:'/supply/detail',query:{ id:item.id,modelId:item.modelId}}"><img :src="item.titleImage" class="goods_img"></router-link>
                        <div class="goods_num">
                            <div class="name black_text">{{item.name}}</div>
                            <div class="num">库存<span>{{item.storage}}</span>件</div>
                            <router-link class="blue_link" :to="{path:''}">{{item.coreName}}</router-link>
                        </div>
                        <div class="goods_price">
                            <span class="price red_text">¥{{item.price}}</span>
                            <span class="order float_r">{{item.orderCount}}人下过单</span>
                        </div>
                    </li>
                </ul>
            </div> -->
            <pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
        </div>
    </div>
</div>
</template>
<script>
import viewAddress from '@/components/common/viewAddress'
import pagination from '@/components/common/pagination'
export default {
    name: 'buyDetail',
    components: {
        viewAddress,
        pagination
    },
    data() {
        return {
            num1: 1,
            optionsSelected: [],
            btnDisabled: false,
            grayText:false,
            buyForm: {},
            propvalids:[],
            properties:[],
            priceAndNum:{},
            attrList: [],
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                type: 2,
                total: 0,
                list: [],
                loading: false
            },
            colors: [],
            remoteId: null,
            accout: !!localStorage.UD?JSON.parse(localStorage.UD).username:'',
            goodsList:[]
        }
    },
    methods: {
        handleChange(value) {
            console.log(value);
        },
        optionsChange() {
            var obj = this.optionsSelected;
            let ids=[];
            let tie = [];
            obj.forEach((x)=>{
                ids.push(x.id);
                tie.push(x.name); //adjahhzsdhsjfdhdjs
            });
            this.propvalids = ids;
            this.properties = tie ;
        },
        getBuyDetail() {
            let id = this.$route.query.id;
            this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', {
                shopId: id
            }).then((res) => {
                this.buyForm = res.goodsMap;
                if(this.buyForm.status == 2){
                    this.grayText= false;
                }else{
                     this.grayText= true;
                }
                this.attrList = res.itemList;
                this.propvalids = [];
                this.properties = [];
                this.attrList.forEach((x, i) => {
                    let clors = [];
                    x.dataName.split(",").forEach((dataNameItem, dataNameItemIndex) => {
                        clors.push({
                            id: dataNameItem.split("|")[0],
                            name: dataNameItem.split("|")[1]
                        });
                    });
                    x.colors = clors;
                    this.optionsSelected[i] = clors[0];
                    this.propvalids.push(clors[0].id);
                    this.properties.push(clors[0].name);
                })
                this.getPriceAndNum();
            })
        },
        getPriceAndNum(){
            var propNames = this.properties.toString().replace(/\,/g,";");
            let data={
                shopId:this.$route.query.id,
                // propvalIds:this.propvalids.toString()
                properties:propNames
            };
            if(this.propvalids.length!==0){
                this.$ajax.post('/basemall-shop/shop-sku/shop-sku-information', data).then((res) => {
                    /* 商品数量不0 或 商品状态为2 或为融资用户 按钮置灰 */
                    this.priceAndNum = res;
                    console.log(this.priceAndNum);
                    if(this.priceAndNum.quantity==0 || this.buyForm.status !== 2 ||this.$store.state.userData.userType == 3){
                        this.btnDisabled = true;
                    }else{
                        this.btnDisabled = false;
                    }
                })
            }
        },
        getSameProduct() {
            let data = {
                pageIndex: this.tableData.pageIndex,
                pageSize: this.tableData.pageSize,
                modelId: this.$route.query.modelId,
                shopId: this.$route.query.id,
                type: this.tableData.type
            };
            this.$ajax.post('/basemall-shop/shop-goods/find-goods-list', data).then((res) => {
                this.tableData.total = res.total;
                this.tableData.list = res.shopGoodsList;
                this.goodsList = res.shopGoodsList;
            })
        },
        pageChanged(pageIndex) {
            this.tableData.pageIndex = pageIndex
            // this.getSameProduct()
        },
        toOffer() {
            let newTab;
            if(!localStorage.getItem("UD")){
                this.$store.commit('showLoginBox')
            } else {
                if(this.buyForm.corpName==this.$store.state.userData.corpName){

                    this.$message.warning('不能对自己询价！');
                    return false;
                }else{
                    this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then((res) => {
                        if(true){
                            // console.log(window.nim)
                            // localStorage.setItem('nim',JSON.stringify(window.nim))
                            this.setUserRoot()
                            let data = {
                                shopId: this.$route.query.id,
                                itemDataIds: this.optionsSelected.map(_ => _.id) || this.$route.query.itemDataIds
                            };
                            this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', data).then((res) => {
                                data.type = 1;
                                this.remoteId = this.buyForm.userId;
                                this.$store.commit('showChatDialog', data);
                                localStorage.setItem('itemDataIds',data.itemDataIds);
                                this.$refs.btnOffer.click();
                                // newTab = window.open('about:blank');
                                // newTab.location.href = `#/supply/chat?id=${this.$route.query.id}&skuId=${this.priceAndNum.id}&skuKeyId=${this.priceAndNum.keyId}&remoteId=${this.remoteId}&remoteCorpName=${this.buyForm.corpName}&to=${this.buyForm.legalPersonPhone}`;
                                // window.open(`#/supply/chat?id=${this.$route.query.id}&skuId=${this.priceAndNum.id}&remoteId=${data.remoteId}&remoteCorpName=${this.buyForm.corpName}`, '_blank');
                            })
                        }else{
                            this.$message.warning('还未认证不可询价！')
                        }
                    })
                }
            }
        },
        setUserRoot(){
            localStorage.setItem('UR','true')
            if(!window.UserRoot){
                window.UserRoot={root:false}
            }
            window.UserRoot.root = true
        },
        init() {
            this.getBuyDetail();
            // this.getSameProduct();
        }
    },
    created() {
        this.init();
    },
    updated() {
        $('.describe').find('img').css({
            "max-width":"654px"
        });
    },
    watch: {
        'propvalids'(newVal,oldVal){
           this.getPriceAndNum();
        },
        'properties'(newVal,oldVal){
           this.getPriceAndNum();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
@import '../../less/supplyDetail.less';
.supplyDetail {
    max-width: 1200px;
    margin: 0 auto 50px;
    font-size: 15px;
}
</style>
