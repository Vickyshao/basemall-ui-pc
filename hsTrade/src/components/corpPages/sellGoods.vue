<template>
    <div>
        <div class="goodsInfo">
            <div class="subtitle mT0">商品信息</div>
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
    </div>
</template>
<script>
export default {
    data(){
        return {
            goods: [],
        }
    },
    created(){
        this.getGoods();
    },
    methods: {
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
    }
}
</script>

