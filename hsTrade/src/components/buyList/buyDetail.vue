<template>
<div class="buyDetail_container">
    <div class="buyDetail">
        <div class="list_details">
            <div class="goods_details">
                <div class="title">
                    <span class="name">{{this.buyForm.name}}</span>
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
                            <label>采购总量 :</label>
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
                <div class="describe">
                    <label>描述 :</label>
                    <div  v-html="buyForm.shopDetail"></div>
                </div>
            </div>
            <div class="goods_offer">
                <div class="price">参考单价<span :class="{'red_text':!grayText,'gray_text':grayText}">¥ <b>{{priceAndNum.price|toDoubleThousands}}</b></span></div>
                <div class="num">
                    <span>剩余采购数量<i :class="{'blue_text':!grayText,'gray_text':grayText}">{{priceAndNum.quantity}}</i>{{buyForm.unit}}</span>
                </div>
                <div class="offer" v-if="buyForm.status == 2">
                    <el-row v-for="(item,itemIndex) in attrList" :key="item.itemName">
                        <label for="">{{item.itemName}}</label>
                        <el-radio-group v-model="optionsSelected[itemIndex]" @change="optionsChange">
                            <el-radio-button v-for="color in item.colors" :label="color" :key="color.id">{{color.name}}</el-radio-button>
                        </el-radio-group>
                    </el-row>
                </div>
                <div class="offer none_goods" v-if="buyForm.status !== 2">
                </div>
                <!-- <router-link tag="a" target="_blank" :to="{name:'报价',params:{},query:{id:$route.query.id,skuId:priceAndNum.id}}"> -->
                    <button class="all_btn bule_btn btn_offer" @click="toOffer" :disabled="btnDisabled">
                        {{this.buyForm.status==2?'我要报价':'已结束'}}
                    </button>
                <!-- </router-link> -->
            </div>
        </div>
        <div class="class_list">
            <el-row class="class_sort">
                <div class="num">同类产品</div>
            </el-row>
            <el-row class="table_data">
                <el-table element-loading-text="正在加载......" :data="tableData.list" style="width: 100%">
                    <el-table-column prop="name" label="品名" width="240">
                        <template slot-scope="scope" prop="id">
							<div class="blue_link product_name" @click="link(scope.row)">{{scope.row.name}}</div>
						</template>
                    </el-table-column>
                    <el-table-column label="价格（元）" width="180">
                        <template slot-scope="scope" prop="price">
								<div >{{scope.row.price|toDoubleThousands}}-{{scope.row.maxPrice|toDoubleThousands}}</div>
						</template>
                    </el-table-column>
                    <el-table-column label="剩余采购数量/采购总量" width="230">
                        <template slot-scope="scope">
							<span class="red_text"  prop="dataQuantity">{{scope.row.dataQuantity}}</span>/<span  prop="storage">{{scope.row.storage}}</span>
						</template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
							<div prop="status" v-if="scope.row.status==2">
								<div class="red_text" >求购</div>
								<div class="gray_text" prop="validPeriod" style="font-size:12px;">有效期<i>{{scope.row.validPeriod}}</i>天</div>
							</div>
							<div prop="status" v-else-if="scope.row.status==4 || scope.row.status==5">
								<div class="gray_text" >关闭</div>
							</div>
						</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope" prop="id">
							<el-button v-if="scope.row.status==2" @click="link(scope.row)">报价</el-button>
							<el-button v-if="scope.row.status==4 || scope.row.status==5" disabled>报价</el-button>
						</template>
                    </el-table-column>
                </el-table>
            </el-row>
            <pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
        </div>
    </div>
</div>
</template>
<script>
import pagination from '@/components/common/pagination'
import viewAddress from '@/components/common/viewAddress'
export default {
    name: 'buyDetail',
    components: {
        pagination,
        viewAddress
    },
    data() {
        return {
            optionsSelected: [],
            pactDialogVisible: false,
            btnDisabled: false,
            grayText:false,
            buyForm: {},
            propvalids:[],
            properties:[],
            priceAndNum:{},
            attrList: {},
            tableData: {
                pageIndex: 1,
                pageSize: 10,
                type: 1,
                total: 0,
                list: [],
                loading: false
            },
            colors: [],
        }
    },
    methods: {
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
                this.toTop();
            })
        },
        pageChanged(pageIndex) {
            this.tableData.pageIndex = pageIndex
            this.getSameProduct()
        },
        toOffer() {
            let newTab;
            if (localStorage.getItem("UD")) {
                if(this.buyForm.corpName==this.$store.state.userData.corpName){
                    this.$message.warning('不能对自己报价！')
                }else{
                    this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then((res) => {
                        if(true){
                            let data = {
                                shopId: this.$route.query.id,
                                itemDataIds: this.optionsSelected.map(_ => _.id) || this.$route.query.itemDataIds
                            };
                            this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', data).then((res) => {
                                data.type = 2;
                                data.remoteId = this.buyForm.userId;
                                this.$store.commit('showChatDialog', data);
                                localStorage.setItem('itemDataIds',data.itemDataIds);
                                newTab = window.open('about:blank');
                                newTab.location.href= `#/buy/chat?id=${this.$route.query.id}&skuId=${this.priceAndNum.id}&skuKeyId=${this.priceAndNum.keyId}&remoteId=${data.remoteId}&remoteCorpName=${this.buyForm.corpName}`;
                                // window.open(`#/buy/chat?id=${this.$route.query.id}&skuId=${this.priceAndNum.id}&remoteId=${data.remoteId}&remoteCorpName=${this.buyForm.corpName}`, '_blank');
                            })
                        }else{
                            this.$message.warning('还未认证不可报价！')
                        }
                    })
                }
            } else {
                this.$store.commit('showLoginBox')
            }
        },
        link(item) {
            let { id, modelId } = item;
            this.$router.push({
                path: `/buy/detail?id=${id}&modelId=${modelId}`
            });
            this.init();
        },
        init() {
            this.getBuyDetail();
            this.getSameProduct();
        },
        toTop() {
            document.body.scrollTop = 0;
        }
    },
    created() {
        this.init();
    },
    computed: {
        totalPrice() {
            let price=this.buyForm.price||0;
			let totalAttr = 0;
			if(this.optionsSelected&&this.optionsSelected.length>0){
				this.optionsSelected.forEach(x => {
					totalAttr += x.price * 1
				})
			};
			return this.buyForm.price + totalAttr
        }
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
@import '../../less/areaClass.less';
.buyDetail {
    max-width: 1200px;
    margin: 0 auto 50px;
    font-size: 15px;
}
</style>
