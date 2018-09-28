<template>
	<div class="assetDetail">
		<div class="title clear">资产明细</div>

		<div class="clear table-status-bar">
            <span class="fl" style="font-size:12px;margin-right:14px">类型</span>
            <el-select class="fl" v-model="pageData.tradeCode" @change="changeType" placeholder="请选择交易类型">
                <el-option label="全部" value="0"></el-option>
                <el-option label="充值" value="1"></el-option>
                <el-option label="提现" value="2"></el-option>
                <el-option label="投资" value="3"></el-option>
                <el-option label="收益" value="4"></el-option>
                <el-option label="提现手续费" value="5"></el-option>
                <el-option label="回款" value="7"></el-option>
            </el-select>
            <span class="fl" style="font-size:12px;margin:0 14px 0 38px">时间</span>
            <date-range-picker class="fl" @date-changed="dateChanged"></date-range-picker>
        </div>

		<div v-loading="loading" v-nodata="!pageData.total">
			<table class="table">
				<thead>
					<tr>
						<th>时间</th>
						<th>收入（元）</th>
						<th>支出（元）</th>
						<th>类型</th>
						<th>说明</th>
						<th>账户余额（元）</th>
						<th>交易状态</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(x,i) in list" :key="i">
						<td>{{x.createTime}}</td>
						<td class="text-success">{{x.srMoney|toDoubleThousands}}</td>
						<td class="text-danger">{{x.zcMoney|toDoubleThousands}}</td>
                        <td>{{x.tradeType}}</td>
                        <td>{{x.explain}}</td>
						<td>{{x.availableMoney|toDoubleThousands}}</td>
						<td class="text-success">{{x.result}}</td>
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
			list:[],
            pageData: {
                tradeCode:'0',
				pageIndex: 1,
				pageSize:10,
				beginTime:null,
				endTime:null,
				total: 0,
            }
        }
    },
    methods: {
		beforeRequest(){
            this.pageData.total=0;
            this.pageData.list=[];
			let {pageIndex,pageSize,beginTime,endTime} = this.pageData;
            let data={pageIndex,pageSize,beginTime,endTime};
            data.tradeCode=this.pageData.tradeCode=='0'?null:parseInt(this.pageData.tradeCode);
			return data
		},
		getData(){
			this.loading=true;
			let data = this.beforeRequest();
			this.$ajax.post(`/basemall-fax/account-bill/query-my-account-bill`,data).then((res)=>{
				this.loading=false;
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
        },
        changeType(){
            this.pageData.pageIndex=1;
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
	}
	.table-status-bar{
		line-height: 40px;
		padding: 20px;
	}
}
</style>
