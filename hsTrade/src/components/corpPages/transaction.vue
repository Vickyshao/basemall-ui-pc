<template>
    <div class="transaction">
        <div class="tranTab">
            <span :class="{active:tranTab==1}" @click="changeTranTab(1)">交易统计</span>
            <span :class="{active:tranTab==2}" @click="changeTranTab(2)">交易列表</span>
        </div>
        <div v-if="tranTab==1">
            <statistics @pageChanged="pageChanged" :pageData="pageData"></statistics>
        </div>

        <div class="purchaseInfo" v-if="tranTab==2">
            <el-table :data="lists" style="width: 100%">
                <el-table-column prop="name" label="订单号" width="150"> </el-table-column>
                <el-table-column prop="price" label="订单性质" width="110"> </el-table-column>
                <el-table-column prop="nums" label="贸易伙伴" width="130">
                    <template slot-scope="scope">
                        <span class="colorRed">{{scope.row.dataQuantity}}</span> / {{scope.row.storage}}
                    </template>
                </el-table-column>
                <el-table-column prop="releaseTime" label="交易商品" width="150"> </el-table-column>
                <el-table-column prop="deadline" label="支付方式" width="120"> </el-table-column>
                <el-table-column prop="deadline" label="交易总价" width="110"> </el-table-column>
                <el-table-column prop="deadline" label="下单时间" width="150"> </el-table-column>
                <el-table-column prop="deadline" label="状态" width="100"> </el-table-column>
                <el-table-column label="操作" width="110">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import statistics from './statistics.vue'
export default {
    data(){
        return {
            lists: [],
            tranTab: 1,
            pageData: {
                pageIndex: 1,
                pageSize: 10,
                total: 0
            },


        }
    },
    components: {
        statistics,
    },
    created(){
        console.log(999765,this.$store.state.userData);
        this.getList();
    },
    methods: {
        getList(){
            let query = {
                pageIndex: this.pageData.pageIndex,
                pageSize: this.pageData.pageSize,
                corpId: this.$store.state.userData.id
            };
            this.$ajax.post('/basemall-shop/shop-order/trade-list', query).then((res)=>{
                console.log(4455, res);
                // this.pageData.total = res.total;
            });
        },
        changeTranTab(i){
            this.tranTab = i;
        },
    },
}
</script>

<style>

</style>
