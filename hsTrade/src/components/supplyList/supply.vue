<template>
  <div class="supply_container">
    <div class="supply">
      <div class="class_list" style="margin:0">
        <el-row class="class_sort">
           <div class="num">共找到<span class="red_text">{{this.tableData.total}}</span>条产品</div>
        </el-row>
        <el-row>
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
    name: 'supply',
    components: {
     pagination,viewAddress
    },
    data() {
     return {
        entry:'',
        goodsList:[],
        tableData:{
          loading:false,
          pageIndex:1,
          pageSize:20,
          total:0,
          list:[]
        },
        pageData:{
          pageIndex:1,
          pageSize:10
		    }
      }
    },
    methods: {
      getBuyWareList() {
        this.tableData.loading=true;
        let data={
          pageIndex:this.tableData.pageIndex,
          pageSize:this.tableData.pageSize,
          type:2
        };
        this.$ajax.post('/basemall-shop/shop-goods/find-goods-list',data).then((res)=>{
          this.tableData.loading=false;
          this.tableData.total=res.total;
          this.tableData.list = res.shopGoodsList;
          this.goodsList=res.shopGoodsList
        }).catch((err)=>{
          this.tableData.loading=false;
        })
      },
      pageChanged(pageIndex){
        this.tableData.pageIndex=pageIndex;
        this.getBuyWareList()
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
@import '../../less/supplyDetail.less';
  .supply{
    max-width: 1200px;
    margin: 0px auto 50px;
    font-size: 15px;
  }
</style>
