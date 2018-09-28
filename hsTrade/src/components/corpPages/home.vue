<template>
    <div>
        <div class="enterprise">
            <div class="subtitle mT0">企业简介</div>
            <div class="brief">
                <div class="desc">{{homeData.corp_info||'-'}}</div>
            </div>
        </div>

        <div class="goodsInfo">
            <div class="subtitle">商品信息</div>
            <div class="more" @click="more">更多</div>
            <div class="goods">
                <ul>
                    <li v-for="item in goods">
                        <div class="goodsName">{{item.name}}</div>
                        <div class="imgs">
                            <img :src="item.titleImage"/>
                        </div>
                        <div class="price">最低价：<span>¥{{item.price}}</span></div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="latestDeal">
            <div class="subtitle">最新成交</div>
            <div class="orders">
                <ul>
                    <li>
                        <span>11111</span>
                        <span class="time">2018-07-04  18: 00</span>
                    </li>
                    <li>
                        <span>2222</span>
                        <span class="time">2018-07-04  18: 00</span>
                    </li>
                    <li>
                        <span>3333</span>
                        <span class="time">2018-07-04  18: 00</span>
                    </li>
                    <li>
                        <span>4444</span>
                        <span class="time">2018-07-04  18: 00</span>
                    </li>
                    <li>
                        <span>5555</span>
                        <span class="time">2018-07-04  18: 00</span>
                    </li>
                    <li>
                        <span>6666</span>
                        <span class="time">2018-07-04  18: 00</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['homeData'],
    data(){
        return {
            goods: [],
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            this.getGoods();
        },
        more(){
            this.$emit('changeActivename', '2');
        },
        getGoods(){
            let query = {
                type: 2,
                pageIndex: 1,
                pageSize: 20
            };
            this.$ajax.post('/basemall-shop/shop-goods/find-goods-list', query).then((res)=>{
                this.goods = res.shopGoodsList;
            });
        },

    },
    watch: {
        homeData: {
            handler(newVal, oldVal) {
                console.log(333, newVal);
            },
            deep: true
        },
    }
}
</script>

