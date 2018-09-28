<template>
    <div class="financing-wrapper">
        <div v-loading="loading">
            <div class="title">融资管理</div>
            <div class="overview clear">
                <div class="cell fl">
                    <p>剩余授信额度</p>
                    <p><span class="text-warn" style="font-size:24px">{{info.leftSum|toDoubleThousands}}</span>元</p>
                    <p class="text-gray">总额度：{{info.auditQuota|toDoubleThousands}}元</p>
                    <p class="text-gray">已用额度：{{info.borrowSum|toDoubleThousands}}元</p>
                    <p class="text-gray">逾期记录：{{info.isOverDue?"有":"无"}}</p>
                </div>
                <div class="cell fl">
                    <p>待还款总额</p>
                    <p><span class="text-danger" style="font-size:24px">{{borrowRepayment.repaymentAmount|toDoubleThousands}}</span>元</p>
                    <p class="text-gray">下笔还款额：{{borrowRepayment.amount|toDoubleThousands}}元</p>
                    <p class="text-gray">下个还款日：{{borrowRepayment.repaymentTime|formatTime("YMD")}}</p>
                </div>
            </div>
        </div>

        <el-tabs v-model="tab" @tab-click="tabChecked">
            <el-tab-pane label="融资还款" name="1"></el-tab-pane>
            <el-tab-pane label="融资募集" name="2"></el-tab-pane>
            <el-tab-pane label="融资申请" name="3"></el-tab-pane>
        </el-tabs>

    <!--筛选栏-->
        <div class="clear table-status-bar">
            <span class="fl" style="font-size:12px;margin-right:14px">{{tab==1?"最后还款日":tab==2?"成立时间":"申请时间"}}</span>

            <date-range-picker1 class="fl" v-if="tab==1" @date-changed="dateChanged"></date-range-picker1>
            <date-range-picker2 class="fl" v-if="tab==2" @date-changed="dateChanged"></date-range-picker2>
            <date-range-picker3 class="fl" v-if="tab==3" @date-changed="dateChanged"></date-range-picker3>

            <span v-if="tab!=3" class="fl" style="font-size:12px;margin:0 14px 0 38px">交易类型</span>

            <el-select class="fl" v-model="tableData.borrowStatus" @change="changeType" v-if="tab==1" >
                <el-option label="全部" value="0"></el-option>
                <el-option label="待还款" value="8"></el-option>
                <el-option label="已还款" value="9"></el-option>
            </el-select>
            <el-select class="fl" v-model="tableData.borrowStatus" @change="changeType" v-if="tab==2" >
                <el-option label="全部" value="0"></el-option>
                <el-option label="募集中" value="5"></el-option>
                <el-option label="募集完成" value="6"></el-option>
                <el-option label="募集失败" value="7"></el-option>
            </el-select>
            <!-- <el-select class="fl" v-model="tableData.borrowStatus" @change="changeType" v-if="tab==3" >
                <el-option label="全部" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="已审核" value="2"></el-option>
                <el-option label="已驳回" value="3"></el-option>
                <el-option label="已作废" value="4"></el-option>
            </el-select> -->
        </div>
    <!--筛选栏-->

        <table1 v-if="tab==1" :table-data="tableData"></table1>
        <table2 v-if="tab==2" :table-data="tableData"></table2>
        <table3 v-if="tab==3" :table-data="tableData"></table3>

        <pagination v-if="!!tableData.total" :page-data="tableData" @page-changed="pageChanged" style="margin:20px 0 50px"></pagination>

    </div>
</template>

<script>
import dateRangePicker1 from '@/components/common/dateRangePicker'
import dateRangePicker2 from '@/components/common/dateRangePicker'
import dateRangePicker3 from '@/components/common/dateRangePicker'
import pagination from '@/components/common/pagination'
import table1 from './financing-table-tab1'
import table2 from './financing-table-tab2'
import table3 from './financing-table-tab3'

export default {
    components:{
        dateRangePicker1,
        dateRangePicker2,
        dateRangePicker3,
        pagination,
        table1,
        table2,
        table3
    },
    data(){
        return{
            loading:false,
            tab:this.$route.query.activeName||'1',
            info:{},
            activeName:'',
            borrowRepayment:{},
            tableData:{
                loading:false,
                pageIndex:1,
                pageSize:10,
                beginTime:null,
                endTime:null,
                borrowStatus:"0",
                reqType:1,
                total:0,
                list:[]
            }
        }
    },
    methods:{
        getInfo(){
            this.loading=true;
            this.$ajax.get('/basemall-fax/borrow-repayment/select-borrow-repayment').then((res)=>{
                this.loading=false;
                this.info=res||{};
                this.borrowRepayment=res.borrowRepayment||{};
                let auditQuota=res.auditQuota||0;
                let borrowSum=res.borrowSum||0;
                this.info.leftSum=auditQuota-borrowSum;
            }).catch(()=>{
                this.loading=false;
            })
        },
        tabChecked(tab, event){
            // console.log(tab.name);
            this.initTableParam();
            this.getList();
            this.activeName = tab.name;
            this.$router.push({
                path: `/user-center/financing?activeName=${this.activeName}`
            });
        },
        initTableParam(){
            this.tableData.pageIndex=1;
            this.tableData.beginTime=null;
            this.tableData.endTime=null;
            this.tableData.borrowStatus="0";
        },
        beforeRequest(){
            this.tableData.loading=true;
            this.tableData.list=[];
            this.tableData.total=0;
            let data={
                pageIndex:this.tableData.pageIndex,
                pageSize:this.tableData.pageSize,
                beginTime:this.tableData.beginTime,
                endTime:this.tableData.endTime,
                borrowStatus:this.tableData.borrowStatus=='0'?null:this.tableData.borrowStatus,
                reqType:parseInt(this.tab)
            };
            return data
        },
        getList(){
            let data=this.beforeRequest();
            this.$ajax.post(`/basemall-fax/borrow/raise-list`,data).then((res)=>{
                this.tableData.loading=false;
                this.tableData.list=res.list||[];
                this.tableData.total=res.total||0;
            }).catch(()=>{
                this.tableData.loading=false
            })
        },
        dateChanged(date){
            this.tableData.pageIndex=1;
            this.tableData.beginTime=!!date?`${this.tools.formatDate(date[0])} 00:00:00`:null;
            this.tableData.endTime=!!date?`${this.tools.formatDate(date[1])} 23:59:59`:null;
            this.getList()
        },
        changeType(){
            this.tableData.pageIndex=1;
            this.getList()
        },
        pageChanged(pageIndex){
            this.tableData.pageIndex=pageIndex
            this.getList()
        }
    },
    created () {
        this.tab = this.$route.query.tab||'1'
        this.getInfo();
        this.getList(this.tab);
    }
}
</script>


<style lang="less" scoped>
    .financing-wrapper{
        .title{
            font-size: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ebebeb;
            margin-bottom: 20px;
        }
        .overview{
            padding-bottom: 10px;
            border-bottom: 1px solid #ebebeb;
            margin-bottom: 10px;
            .cell{
                box-sizing: border-box;
                width: 48%;
                padding-left: 15px;
                p{
                    padding-bottom: 10px;
                }
            }
        }
        .table-status-bar{
            margin-bottom: 20px;
            line-height: 40px;
        }
    }
</style>
