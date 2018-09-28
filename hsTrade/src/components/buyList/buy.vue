<template>
  <div class="buy_container">
    <div class="buy">
      <div class="class_list" style="margin:0">
        <el-row class="class_sort">
           <div class="num">共找到<span class="red_text">{{this.tableData.total}}</span>条产品</div>
           <div class="sort" style="display:none;">
             <span>默认</span>
             <span>价格<i class="el-icon-ump-plus-shiftdown"></i></span>
             <span>剩余数量<i class="el-icon-ump-plus-shiftdown"></i></span>
           </div>
        </el-row>
        <el-row class="table_data" v-loading="tableData.loading">
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
    name: 'captial',
    components: {
     pagination,viewAddress
    },
    data() {
     return {
        tableData:{
          loading:false,
          pageIndex:1,
          pageSize:10,
          total:0,
          list:[]
        }
      }
    },
    methods: {
      getBuyWareList() {
        this.tableData.loading=true;
        let data={
          pageIndex:this.tableData.pageIndex,
          pageSize:this.tableData.pageSize,
          type:1
        };
        this.$ajax.post('/basemall-shop/shop-goods/find-goods-list',data).then((res)=>{
            console.log('777',this.$store.state.uuid);
            // 3已售完，5已过期
            this.tableData.loading=false;
            this.tableData.total=res.total;
            this.tableData.list = res.shopGoodsList;
        }).catch((err)=>{
          this.tableData.loading=false;
        })
      },
      pageChanged(pageIndex){
        this.tableData.pageIndex=pageIndex;
        this.getBuyWareList()
      },
      link(item){
          let {id,modelId}=item
          this.$router.push({
            path:`/buy/detail?id=${id}&modelId=${modelId}`
          })
      }
    },
    created(){
      this.getBuyWareList();  
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
@import '../../less/areaClass.less';
  .buy{
    max-width: 1200px;
    margin: 0px auto 50px;
    font-size: 15px;
  }
</style>
