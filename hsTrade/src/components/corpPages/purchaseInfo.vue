<template>
    <div>
        <div class="purchaseInfo">
            <el-table :data="lists" style="width: 100%">
                <el-table-column prop="name" label="采购商品名称" width="230"> </el-table-column>
                <el-table-column prop="price" label="采购价格" width="180"> </el-table-column>
                <el-table-column prop="nums" label="剩余数量/总数量" width="180">
                    <template slot-scope="scope">
                        <span class="colorRed">{{scope.row.dataQuantity}}</span> / {{scope.row.storage}}
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.pubdateTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="截止时间" width="200">
                    <template slot-scope="scope">
                        {{scope.row.overTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="110">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
    </div>
</template>
<script>
import pagination from '../common/pagination.vue'
export default {
    data(){
        return {
            lists: [],
            tableData: {
                pageIndex:1,
                pageSize:10,
                total: 0
            },
        }
    },
    components: {
        pagination,
    },
    created(){
        this.getList();
    },
    methods: {
        handleClick(row) {
            console.log(row);
        },
        getList() {
            let query = {
                type: 1,
                pageIndex: this.tableData.pageIndex,
                pageSize: this.tableData.pageSize
            }
            this.$ajax.post('/basemall-shop/shop-goods/find-goods-list', query).then((res)=>{
                this.lists = res.shopGoodsList;
                this.tableData.total = res.total;

            })
        },
        pageChanged(v){
            this.tableData.pageIndex = v;
            this.getList();
        },





    }
}
</script>

