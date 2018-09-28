<template>
    <div class="box">
        <div v-if="accountFriend!=goods_account" style="font-size: 14px;width: 100%;text-align: center;padding-top:20px">暂无商品询价记录</div>
        <div v-if="accountFriend==goods_account">
            <div class="title" :class="{buy:isBuy}">{{detail.name||'-'}}</div>
            <div class="tag-list clear" v-if="paramsDetail&&paramsDetail.length>0">
                <span class="tag fl" v-for="x in paramsDetail">{{x.value}}</span>
                <!-- <span class="tag fl" v-for="x in paramsDetail">{{x.label}}：{{x.value}}</span> -->
            </div>
            <div class="params">
                <p><label>初始价格：</label>{{detail.price|toDoubleThousands}}元</p>
                <p><label>{{type==1?"剩余数量":"采购总量"}}：</label>{{detail.dataQuantity}}{{detail.unit}}</p>
                <!-- <p v-if="type==1"><label>起订量：</label>{{detail.minCount}}{{detail.unit}}</p> -->
                <!-- <p><label>{{type==1?"供应商":"采购商"}}：</label>{{detail.corpName}}</p> -->
                <p><label>商品编号：</label>{{detail.productNum}}</p>
                <!-- <p><label>交货地点：</label><view-address :options="{address:detail.supplyAddress}"></view-address></p> -->
                <p><label>发布时间：</label>{{detail.pubdateTime}}</p>
                <p><label>有效时间：</label>{{detail.overTime}}</p>
                <p><label>商品状态：</label>{{detail.dataQuantity<=0?'已售完':(detail.status==2?'上架':detail.status==3?'下架':detail.status==5?'已过期':'')}}</p><!-- 1:待审核,2:上架,3:下架,4:已售完,5：已过期,6:审核失败 -->
                <!-- <p><label>商品状态：</label>{{detail.status==2?'上架':detail.status==3?'下架':detail.status==5?'5：已过期':''}}</p>1:待审核,2:上架,3:下架,4:已售完,5：已过期,6:审核失败 -->
            </div>
            
            <div class="btn_b">
                <button class="btn" @click="send_link">发送链接</button>
            </div>
        </div>
    </div>
</template>
<script>
import viewAddress from '@/components/common/viewAddress'
export default {
    // props:['detail','paramsDetail'],
    created() {
        // this.isBuy = this.$route.path=='/buy/chat';
        if(this.$route.query.id&&this.$route.query.skuId&&this.$route.query.skuKeyId){
            this.getDetail()
        }
        
    },
    props:['accountFriend'],
    components:{
        viewAddress
    },
    data(){
        return{
            detail:{},
            paramsDetail:[],
            isBuy:'',
            goods_account:this.$route.query.to
        }
    },
    methods:{
        getDetail(){
            let data = {
                shopId: this.$route.query.id,
                skuId: this.$route.query.skuId,
                skuKeyId: this.$route.query.skuKeyId
            };
             this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', data).then((res) => {
                this.detail = res.goodsMap
            })
        },
        send_link(){
            this.$emit('sendlink')
        }
    },
    computed:{
        type(){
            return this.$store.state.globalData.chatData.type
        }
    },
    watch:{
        accountFriend(newVal,oldVal){
            console.log('这是在新的detail里面',newVal)
        }
    }
}
</script>
<style lang="less" scoped>
ul,div,li,button{
    box-sizing: border-box;
}
 .params {
    padding: 30px 0 0 37px;
    line-height: 34px;
    font-size: 16px;
    p {
        color: #000;
        margin-bottom: 12px;
        label {
            display: inline-block;
            cursor: text;
            width: 90px;
            color: #666;
        }
    }
}
.title {
    font-size: 22px;
    height: 50px;
    line-height: 50px;
    padding-left:10px;
    color: #000;
    border-bottom: 1px solid #ebebeb;
    position: relative;
}
.btn_b{
    height: 80px;
    width:100%;
    position:absolute;
    bottom: 0;
    left: 0;
    border-top:1px solid #ccc;
}
.box{
    height: 100%;
    position:relative;
}
.btn{
    width:100px;
    height: 30px;
    line-height: 30px;
    border:1px solid #ccc;
    margin:30px auto;
    margin-left:80px;
    font-size: 14px
}
</style>