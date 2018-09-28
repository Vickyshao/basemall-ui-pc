<template>
    <div class="historyFinance">
        <div class="category">
            <category @changeCategory="changeCategory"></category>
        </div>
        <div class="purchaseInfo">
            <el-table :data="lists" style="width: 100%">
                <el-table-column prop="borrowNo" label="融资标的编号" width="250"> </el-table-column>
                <el-table-column prop="borrowSum" label="融资金额" width="210"> </el-table-column>
                <el-table-column prop="corpName" label="放款机构" width="250"> </el-table-column>
                <el-table-column prop="financingRate" label="利率" width="220"> </el-table-column>
                <el-table-column prop="id" label="操作" width="210">
                    <template slot-scope="scope">
                        <el-button @click="toSee(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import category from './category.vue'
export default {
    data(){
        return {
            lists: [],
            selectedCategories: {},
            pageData: {
                pageIndex: 1,
                pageSize: 10
            }
        }
    },
    components: {
        category,
    },
    created(){
        this.getList();

    },
    methods: {
        getList(){
            let query = {
                businessMain: this.selectedCategories.business,
                borrowTimeLimit: parseInt(this.selectedCategories.limit),
                borrowSumMin: this.selectedCategories.borrowSumMin,
                borrowSumMax: this.selectedCategories.borrowSumMax,
                pageIndex: this.pageData.pageIndex,
                pageSize: this.pageData.pageSize
            };
            this.$ajax.post('/basemall-fax/borrow/history-financing-list',query).then((res)=>{
                console.log('111history-financing-list', 'res')
                this.lists=res;
            });
        },
        changeCategory(val){
            this.selectedCategories = val;
        },
        toSee(){},
    },
    watch: {
        selectedCategories:{
            handler(newVal, oldVal) {
                if(newVal){
                    this.getList();
                }
            },
            deep: true
        }
    }

}
</script>

<style>

</style>
