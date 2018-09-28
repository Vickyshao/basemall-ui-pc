<template>
	<div class="assetDetail">
		<div class="title clear">资产明细
			<div class="right">账户余额：<span class="text-danger">{{detail.accountBalance|toDoubleThousands}}元</span></div>
		</div>

		<div class="clear table-status-bar">
            <span class="fl" style="font-size:12px;margin-right:14px">时间</span>
            <date-range-picker class="fl" @date-changed="dateChanged"></date-range-picker>
        </div>

		<div class="total-dashboard">
			<table>
				<tbody>
					<tr>
						<td>
							<span class="text-gray">累计收入：</span>
							<span class="text-success big">{{detail.srAmount|toDoubleThousands}}</span>
							<span class="text-success">元</span>
						</td>
						<td>
							<span class="text-gray">累计支出：</span>
							<span class="text-danger big">{{detail.zcAmount|toDoubleThousands}}</span>
							<span class="text-danger">元</span>
						</td>
					</tr>
					<tr>
						<td>
							<span class="text-gray">累计笔数：</span>
							<span>{{detail.srCount}}</span>
							<span>笔</span>
						</td>
						<td>
							<span class="text-gray">累计笔数：</span>
							<span>{{detail.zcCount}}</span>
							<span>笔</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-loading="loading" v-nodata="!pageData.total">
			<table class="table">
				<thead>
					<tr>
						<th>资金流水</th>
						<th>交易时间</th>
						<th>名称/备注</th>
						<th>收入（元）</th>
						<th>支出（元）</th>
						<th>账户余额（元）</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="x in list" :key="x.id">
						<td>{{x.batchNo}}</td>
						<td>{{x.createTime}}</td>
						<td :title="x.remark" style="width:200px;max-width:200px">{{x.remark}}</td>
						<td class="text-success"><span v-if="x.tradeCode==1||x.tradeCode==3">+{{x.amount|toDoubleThousands}}</span></td>
						<td class="text-danger"><span v-if="x.tradeCode==2||x.tradeCode==5||x.tradeCode==6">-{{x.amount|toDoubleThousands}}</span></td>
						<td>{{x.balance|toDoubleThousands}}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<pagination v-if="!!pageData.total" :page-data="pageData" @page-changed="pageChanged"></pagination>
	</div>
</template>

<script>
import dateRangePicker from '@/components/common/dateRangePicker'
import pagination from '@/components/common/pagination.vue'
export default {
	components: {
		dateRangePicker,
        pagination
    },
	created(){
		this.getData()
	},
    data() {
        return {
			loading:false,
			detail:{},
			list:[],
            pageData: {
				pageIndex: 1,
				pageSize:10,
				beginTime:null,
				endTime:null,
				total: 10,
            }
        }
    },
    methods: {
		beforeRequest(){
			this.pageData.total=0;
            this.pageData.list=[];
			let {pageIndex,pageSize,beginTime,endTime} = this.pageData;
			let data={pageIndex,pageSize,beginTime,endTime};
			return data
		},
		getData(){
			this.loading=true;
			let data = this.beforeRequest();
			this.$ajax.post(`/basemall-fax/capital-details/select-asset-detail`,data).then((res)=>{
				this.loading=false;
				this.detail=res.detail||{};
				this.detail.accountBalance=res.accountBalance;
				this.list=res.list;
				this.pageData.total=res.total
			}).catch(()=>{
				this.loading=false;
			})
		},
        dateChanged(date) {
			this.pageData.pageIndex=1;
			if(!!date){
				this.pageData.beginTime=`${this.tools.formatDate(date[0])} 00:00:00`;
				this.pageData.endTime=`${this.tools.formatDate(date[1])} 23:59:59`;
			}else{
				this.pageData.beginTime=null;
				this.pageData.endTime=null;
			};
			this.getData()
		},
		pageChanged(pageIndex){
            this.pageData.pageIndex=pageIndex
            this.getData()
        }
    }
};
</script>

<style lang="scss" scoped>
.assetDetail{
	.title{
		font-size: 20px;
		padding-bottom: 20px;
		.right{
			float: right;
			font-size: 14px;
			margin-top: 5px;
		}
	}
	.total-dashboard{
		border: 1px solid #ebebeb;
		border-bottom: none;
		padding: 20px;
		table{
			width: 100%;
			td{
				padding: 6px 30px;
			}
			.big{font-size: 20px;}
		}
	}
	.table-status-bar{
		background: #f5f8fb;
		border: 1px solid #ebebeb;
		border-bottom: none;
		line-height: 40px;
		padding: 20px;
	}
}
</style>
