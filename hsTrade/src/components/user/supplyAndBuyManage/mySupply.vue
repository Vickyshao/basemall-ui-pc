<template>
  <div class="mySupply">
    <div class="mySupply_title">
      我的供求
    </div>
    <div class="mySupply_list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的供货" name="first">
						<div class="clearfix">
						<!-- 	<router-link class="all_btn bule_btn release_btn" :to="'/publish/goods'">+发布商品</router-link> -->
						<el-button size="medium" class="all_btn bule_btn release_btn" @click="publishGoods" :disabled="!userRoot.root" :class="!userRoot.root?'disableBtn':''">+发布商品</el-button>
						</div>
						<el-row class="mySupply_table" v-loading="tableData.loading">
							<el-table element-loading-text="正在加载......" :data="tableData.list" style="width: 100%">
								<el-table-column prop="name" label="名称">
									<template slot-scope="scope" prop="goodsId">
											<div class="blue_link" v-if="scope.row.status==2||scope.row.status==3||scope.row.status==4||scope.row.status==5" @click="linkGoodsDetail(scope.row)">{{scope.row.name}}</div>
											<div class="blue_text" v-if="scope.row.status==1||scope.row.status==6" disabled>{{scope.row.name}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="supplyAddress" label="交货地">
									<template slot-scope="scope" prop="supplyAddress">
											<view-address :options="{address:scope.row.supplyAddress,type:'d'}"></view-address>
									</template>
								</el-table-column>
								<el-table-column prop="storage" label="数量">
								</el-table-column>
								<el-table-column prop="price" label="价格(元)">
									<template slot-scope="scope">
											<div>{{scope.row.minPrice|toDoubleThousands}}-{{scope.row.maxPrice|toDoubleThousands}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="overTime" label="有效期">
									<template slot-scope="scope">
											<div>{{scope.row.overTime|formatTime("YMD")}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="pubdateTime" label="发布时间">
									<template slot-scope="scope">
											<div>{{scope.row.pubdateTime|formatTime("YMD")}}</div>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="150">
									<template slot-scope="scope" prop="id"> 
										<span>
											<i class="green-text" v-if="scope.row.status==2" @click="offTheShelf(scope.row)">下架</i>
											<i class="green-text" v-if="scope.row.status==3" @click="theShelves(scope.row)">上架</i>
											<i class="gray_text" v-if="scope.row.status==4||scope.row.status==5">已结束</i>
											<i class="gray_text" v-if="scope.row.status==1">待审核</i>
											<i class="gray_text" v-if="scope.row.status==6">审核失败</i>
										</span>
										<span class="blue_text" v-if="scope.row.status==2||scope.row.status==3" @click="editGoods(scope.row)">编辑</span>
										<span class="red_text" v-if="scope.row.status==2||scope.row.status==3" @click="deleteGoods(scope.row)">删除</span>
									</template>
								</el-table-column>
							</el-table>
						</el-row>
						<pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
          </el-tab-pane>
          <el-tab-pane label="我的求购" name="second">
						<div class="clearfix">
							<el-button size="medium" class="all_btn bule_btn release_btn" @click="publishSeek" :disabled="!userRoot.root" :class="!userRoot.root?'disableBtn':''">+发布求购</el-button>
						  <!-- <router-link class="all_btn bule_btn release_btn" :to="'/publish/seek-purchase'">+发布求购</router-link> -->
						</div>
						<el-row class="mySupply_table" v-loading="tableData.loading">
							<el-table element-loading-text="正在加载......" :data="tableData.list" style="width: 100%">
								<el-table-column prop="name" label="名称">
									<template slot-scope="scope" prop="goodsId">
											<div class="blue_link" v-if="scope.row.status==2||scope.row.status==3||scope.row.status==4||scope.row.status==5" @click="linkGoodsDetail(scope.row)">{{scope.row.name}}</div>
											<div class="blue_text" v-if="scope.row.status==1||scope.row.status==6" disabled>{{scope.row.name}}</div>
									</template>
								</el-table-column>
								<el-table-column label="交货地">
									<template slot-scope="scope" prop="supplyAddress">
											<view-address :options="{address:scope.row.supplyAddress,type:'d'}"></view-address>
									</template>
								</el-table-column>
								<el-table-column prop="storage" label="数量">
								</el-table-column>
								<el-table-column prop="price" label="价格(元)">
									<template slot-scope="scope">
											<div>{{scope.row.minPrice|toDoubleThousands}}-{{scope.row.maxPrice|toDoubleThousands}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="overTime" label="有效期">
									<template slot-scope="scope">
											<div>{{scope.row.overTime|formatTime("YMD")}}</div>
									</template>
								</el-table-column>
								<el-table-column prop="pubdateTime" label="发布时间">
									<template slot-scope="scope">
											<div>{{scope.row.pubdateTime|formatTime("YMD")}}</div>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="150">
									<template slot-scope="scope" prop="id"> 
										<span>
											<i class="green-text" v-if="scope.row.status==2" @click="offTheShelf(scope.row)">下架</i>
											<i class="green-text" v-if="scope.row.status==3" @click="theShelves(scope.row)">上架</i>
											<i class="gray_text" v-if="scope.row.status==4||scope.row.status==5">已结束</i>
											<i class="gray_text" v-if="scope.row.status==1">待审核</i>
											<i class="gray_text" v-if="scope.row.status==6">审核失败</i>
										</span>
										<span class="blue_text" v-if="scope.row.status==2||scope.row.status==3" @click="editGoods(scope.row)">编辑</span>
										<span class="red_text" v-if="scope.row.status==2||scope.row.status==3" @click="deleteGoods(scope.row)">删除</span>
									</template>
								</el-table-column>
							</el-table>
						</el-row>
						<pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
		      </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/common/pagination'
import viewAddress from '@/components/common/viewAddress'
export default {
		name: 'mySupply',
    components:{
        pagination,viewAddress
    },
    data() {
      return {
		activeName: 'first',
		itemSelected:[],
    	tableData:{
			loading:false,
			type:2,
          pageIndex:1,
          pageSize:10,
          total:0,
          list:[]
        },
        userRoot:{root:false}
      };
    },
    methods: {
    	publishSeek(){
    		this.$router.push('/publish/seek-purchase')
    	},
    	publishGoods(){
    		this.$router.push('/publish/goods')
    	},
      handleClick(tab, event) {
				this.tableData.type=this.activeName=='first'?2:1;
				this.getGoodsList();
				this.$router.push({
					path: `/user-center/my-buy?activeName=${this.activeName}`
        });
	    },
	    getGoodsList(type) {
        this.tableData.loading=true;
				this.tableData.type=this.activeName=='first'?2:1;
        let data={
          pageIndex:this.tableData.pageIndex,
          pageSize:this.tableData.pageSize,
          type:this.tableData.type
        };
        this.$ajax.post('/basemall-shop/shop-goods/select-goods-list-by-userId',data).then((res)=>{
          this.tableData.loading=false;
          this.tableData.total=res.total;
          this.tableData.list = res.shopGoodsList;
        }).catch((err)=>{
          this.tableData.loading=false;
        })
      },
      pageChanged(pageIndex){
        this.tableData.pageIndex=pageIndex;
        this.getGoodsList()
      },
      linkGoodsDetail(item){
        let {id,modelId}=item
				if(this.tableData.type==2){
					this.$router.push({
          path:`/supply/detail?id=${id}&modelId=${modelId}`
				  });
				} else if(this.tableData.type==1){
					this.$router.push({
          path:`/buy/detail?id=${id}&modelId=${modelId}`
				  });
				}
			},
			offTheShelf(item) {
        this.$confirm('下架商品后商品前台不可见，确认下架商品？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					let data={
						goodsId:item.id
					}
					this.$ajax.post('/basemall-shop/shop-goods/update-down-shelf-status',data).then((res)=>{
						this.$message({
							type: 'success',
							message: '下架成功!'
						});
						this.getGoodsList();
					})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下架'
          });          
        });
			},
			theShelves(item) {
				this.$confirm('上架商品后前台可以继续购买，确认上架商品？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					let data={
						goodsId:item.id
					}
          this.$ajax.post('/basemall-shop/shop-goods/update-up-shelf-status',data).then((res)=>{
						this.$message({
							type: 'success',
							message: '上架成功!'
						});
							this.getGoodsList();
					})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上架'
          });          
        });
			},
			deleteGoods(item) {
				this.$confirm('删除商品后商品前台不可见，确认删除商品？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					let data={
						goodsId:[JSON.stringify(item.id)]
					}
          this.$ajax.post('/basemall-shop/shop-goods/delete-all-goods-by-ids',data).then((res)=>{
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
							this.getGoodsList();
					})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
			},
			getActiveTab(){
				let num=this.$route.query.activeName;
				this.activeName=this.$route.query.activeName!==undefined?num:'first';
				this.tableData.type=this.$route.query.type?this.$route.query.type:2;
				this.getGoodsList();
			},
			editGoods(item){
				let {id}=item
				if(this.tableData.type==2){
					this.$router.push({path:`/publish/goods?shopId=${id}`})
				} else if(this.tableData.type==1){
					this.$router.push({path:`/publish/seek-purchase?shopId=${id}`})
				}
			}
		},
		created () {
			this.getActiveTab()
			if(window.UserRoot){
				this.userRoot = window.UserRoot
			}
		}
}
</script>
<style lang="less">
@import '../../../assets/css/comcss/com_UI.less';
  .mySupply{
      .mySupply_title{
          font-size: 22px;
          padding-bottom: 25px;
          border-bottom: 1px solid @line-color;
      }
      .mySupply_list{
          .el-tabs__header{
              margin:0;
              .el-tabs__nav-wrap::after{
                  background-color:transparent;
              }
          .el-tabs__nav{
              margin:30px 0 0;
            .el-tabs__active-bar{
              background-color:@text-color-blue;
            }
            .el-tabs__item{
              font-size: 18px;
            }.is-active{
              color:@text-color-blue;
            }
            .el-tabs__item:hover{
              color: @text-color-blue;
            }
          }
        }
        .el-tabs__content{
					.release_btn{
						display: block;
						width: 130px;
						height: 40px;
					  float: right;
					  color:#fff !important;
					  background: #1650A2 !important;
					}
					.release_btn:hover{
					  background: #003691 !important;
					  color: #fff;
					}	
				.mySupply_table{
					margin-top:15px;
					text-align: center; 
					border:1px solid @line-color;
					border-bottom: none;
					th{
						background-color: @table-th-color;
						height: 55px;
						text-align: center;
						color: @text-color-gray;
						font-weight: normal;
					}tbody{
						color: @text-color-black;
						tr{
							height: 95px;
							td{
								div{
									overflow: hidden;
									text-overflow:ellipsis;
									white-space: nowrap;
									span{
										margin: 0 3px;
									}
								}
							}
						}
						tr:hover{
							cursor: pointer;
							.btn_a{
								display: block;
							}
						}
					}
				}
      }
    }
  }
  .disableBtn{
  	background: #1650A2 !important;
  }
</style>

