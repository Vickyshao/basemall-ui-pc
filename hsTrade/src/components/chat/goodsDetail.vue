<template>
    <div>
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
            <p><label>交货地点：</label><view-address :options="{address:detail.supplyAddress}"></view-address></p>
            <p><label>发布时间：</label>{{detail.pubdateTime}}</p>
            <p><label>有效时间：</label>{{detail.overTime}}</p>
            <p><label>商品状态：</label>{{detail.dataQuantity<=0?'已售完':(detail.status==2?'上架':detail.status==3?'下架':detail.status==5?'已过期':'')}}</p><!-- 1:待审核,2:上架,3:下架,4:已售完,5：已过期,6:审核失败 -->
            <!-- <p><label>商品状态：</label>{{detail.status==2?'上架':detail.status==3?'下架':detail.status==5?'5：已过期':''}}</p>1:待审核,2:上架,3:下架,4:已售完,5：已过期,6:审核失败 -->
        </div>
    </div>
</template>
<script>
import viewAddress from '@/components/common/viewAddress'
export default {
    props:['detail','paramsDetail'],
    created() {
        this.isBuy = this.$route.path=='/buy/chat';
    },
    components:{
        viewAddress
    },
    computed:{
        type(){
            return this.$store.state.globalData.chatData.type
        }
    }
}
</script>
