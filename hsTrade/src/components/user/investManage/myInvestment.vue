<template>
<div>
    <div class="topTitle">我的投资</div>
    <div v-loading="loading">
        <table class="table">
            <thead>
                <tr>
                    <th>投资总额（元）</th>
                    <th>已收收益（元）</th>
                    <th>待收本金总额（元）</th>
                    <th>待收收益总额（元）</th>
                </tr>
            </thead>
            <tbody class="font28">
                <tr>
                    <td>{{info.payInvestmentAmount|toDoubleThousands("thousand")}}</td>
                    <td>{{info.getInterest|toDoubleThousands("thousand")}}</td>
                    <td>{{info.waitRepossessedCapital|toDoubleThousands("thousand")}}</td>
                    <td>{{info.waitRepossessedInterest|toDoubleThousands("thousand")}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="investmentElTabs">
		<el-tabs v-model="tab" @tab-click="tabChecked">
			<el-tab-pane :label="'募集中的产品'+countA" name="5"></el-tab-pane>
			<el-tab-pane :label="'收益中的产品'+countB" name="8"></el-tab-pane>
			<el-tab-pane :label="'已到期的产品'+countC" name="9"></el-tab-pane>
		</el-tabs>

		<div class="table-status-bar clear">
			<span class="label fl">投资时间</span>
			<date-range-picker1 class="fl" v-if="tab==5" @date-changed="dateChanged"></date-range-picker1>
			<date-range-picker2 class="fl" v-if="tab==8" @date-changed="dateChanged"></date-range-picker2>
			<date-range-picker3 class="fl" v-if="tab==9" @date-changed="dateChanged"></date-range-picker3>
		</div>

		<table1 :table-data="tableData" v-if="tab==5"></table1>
		<table2 :table-data="tableData" v-if="tab==8"></table2>
		<table3 :table-data="tableData" v-if="tab==9"></table3>

		<pagination v-if="!!tableData.total" :page-data="tableData" @page-changed="pageChanged" style="margin:20px 0 50px"></pagination>

    </div>
</div>
</template>

<script>
import dateRangePicker1 from '@/components/common/dateRangePicker'
import dateRangePicker2 from '@/components/common/dateRangePicker'
import dateRangePicker3 from '@/components/common/dateRangePicker'
import pagination from '@/components/common/pagination'
import table1 from './table1'
import table2 from './table2'
import table3 from './table3'
export default {
    created(){
		let num=this.$route.query.activeName;
		this.tab=this.$route.query.activeName!==undefined?num:'5';
		this.getInfo();
		this.getList(this.tab);
		this.getList('5',true); 
		this.getList('8',true);
		this.getList('9',true); 
	},
    components: {
        dateRangePicker1,
        dateRangePicker2,
        dateRangePicker3,
		pagination,
		table1,
		table2,
		table3
    },
    data() {
        return {
			tab:'5',
			loading:false,
			info:{},
			count:{ a:0, b:0, c:0 },
            tableData:{
				loading:false,
				beginTime:null,
				endTime:null,
				pageIndex:1,
				pageSize:10,
				total:0,
				list:[]
			}
        };
    },
    methods: {
		getInfo(){
            this.loading=true;
            this.$ajax.get('/basemall-fax/account/my-account-by-financing').then((res)=>{
                this.loading=false;
                this.info=res.account||{};
            }).catch(()=>{
                this.loading=false
            })
        },
		getList(tab,r){
			this.tableData.loading=true;
			this.tableData.total=0;
			this.tableData.list=[];
            let data={
				reqType:parseInt(tab),
				beginTime:this.tableData.beginTime,
				endTime:this.tableData.endTime,
				pageIndex:this.tableData.pageIndex,
				pageSize:this.tableData.pageSize
			};
            this.$ajax.post(`/basemall-fax/account/my-account-by-investment`,data).then((res)=>{
				switch(tab){
					case '5': this.count.a=res.total||0; break;
					case '8': this.count.b=res.total||0; break;
					case '9': this.count.c=res.total||0; break;
				};

				if(!r){
					this.tableData.loading=false;
					this.tableData.list=res.list||[];
					this.tableData.total=res.total||res.count||0;
					if(this.tab==3&&this.tableData.list.length>0){
						this.tableData.list.forEach(_=>{
							let e=_.expectedEarnings||0;
							let d=_.dealMoney||0;
							_.edSum=e*1+d*1
						})
					}
				}
            }).catch(()=>{
                this.tableData.loading=false
            })
		},
		initParams(){
			this.tableData.pageIndex=1;
			this.tableData.beginTime=null;
			this.tableData.endTime=null;
		},
		tabChecked(){
			this.initParams();
			this.getList(this.tab);
			this.$router.push({
				path: `/user-center/my-investment?activeName=${this.tab}`
			});
		},
        changeType(){
			this.tableData.pageIndex=1;
			this.getList(this.tab)
		},
		dateChanged(date){
			this.tableData.pageIndex=1;
            this.tableData.beginTime=!!date?`${this.tools.formatDate(date[0])} 00:00:00`:null;
            this.tableData.endTime=!!date?`${this.tools.formatDate(date[1])} 23:59:59`:null;
            this.getList(this.tab)
		},
		pageChanged(pageIndex){
			this.tableData.pageIndex=pageIndex;
			this.getList(this.tab)
		}
	},
	computed:{
		countA(){
			return !!this.count.a?`(${this.count.a})`:''
		},
		countB(){
			return !!this.count.b?`(${this.count.b})`:''
		},
		countC(){
			return !!this.count.c?`(${this.count.c})`:''
		},
	}
};
</script>

<style lang="less" scoped>
@import "../../../less/financingUser.less";
.investmentElTabs {
    width: 100%;
    margin-top: 10px;
	.fl{ float: left; }
	.table-status-bar{
		margin-bottom: 20px;
		line-height: 40px;
		.label{
			font-size: 12px;
			margin:0 14px 0 38px;
			&:first-child{
				margin:0 14px 0 0;
			}
		}
	}
}
</style>
