<template>
    <div>
        <div class="orderlist-wrapper" v-if="!send_success.status">
            <div class="title">订单列表</div>
            <el-tabs class="thirdNav" v-model="tab" @tab-click="tabChecked">
                <el-tab-pane label="采购订单" name="1"></el-tab-pane>
                <el-tab-pane label="销售订单" name="2"></el-tab-pane>
            </el-tabs>

            <div class="list-head clear">
                <span class="fl label">交易时间</span>
                <date-range-picker class="fl" @date-changed="dateChanged"></date-range-picker>
                <span class="fl label" style="margin-left:38px">交易状态</span>
                <el-select class="fl" v-model="tableData.tradingState" @change="changeType" placeholder="请选择交易状态">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="待付款" value="1"></el-option>
                    <el-option label="待发货" value="2"></el-option>
                    <el-option label="待验收" value="3"></el-option>
                    <el-option label="已完成" value="4"></el-option>
                </el-select>
            </div>


            <table-in v-if="tab==1" :table-data="tableData" @get-list="getList" @show-dialog="showDialog"></table-in>

            <table-out  v-if="tab==2" :table-data="tableData"  @get-list="getList" @show-dialog="showDialog"></table-out>

            <pagination v-if="!!tableData.total" :page-data="tableData" @page-changed="pageChanged" style="margin:20px 0 50px"></pagination>

            <div v-if="!tableData.total" class="noData">
                <div class="head"></div>
                <div class="detail">暂无数据</div>
            </div>

            <el-dialog title="" :visible.sync="tableData.dialogShowType" width="750px">
                <p class="oddNum">物流单号：{{dialogData.no}}</p>
                <div class="dialog-img-area">
                    <span class="left el-icon-caret-left" @click="imgMove(1)" v-show="dialogData.nos.length>1&&dialogData.index<0"></span>
                    <span class="right el-icon-caret-right" @click="imgMove(0)" v-show="dialogData.nos.length>1&&(-dialogData.nos.length<dialogData.index-1)"></span>
                    <div class="scroll-box" v-if="dialogData.imgs.length>0">
                        <div class="clear" :style="dialogData.style">
                            <img :src="x" v-for="(x,i) in dialogData.imgs" :key="i" @click="viewBigPic(x)">
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
        <div class="pay-success" v-if="send_success.status">
            <div class="top clear">
                <p>您的订单<span style="font-size:30px">{{send_success.num}}</span>发货成功</p>
            </div>
            <div class="bottom">
                <el-button type="primary" @click="outerLink(2)">提醒验收</el-button>
                <el-button plain @click="outerLink(1)">管理订单</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import dateRangePicker from '@/components/common/dateRangePicker'
import pagination from '@/components/common/pagination'
import tableIn from './orderList-table-in'
import tableOut from './orderList-table-out'

export default {
    created(){
        this.getList(this.tab);
        if(!window.sendSuccess){
            window.sendSuccess = {num:"",status:false,id:0}
        }

        this.send_success = window.sendSuccess
    },
    components:{
        dateRangePicker,
        pagination,
        tableIn,
        tableOut
    },
    data(){
        return{
            tab:this.$route.query.activeName||'1',
            activeName:'',
            tableData:{
                loading:false,
                startTime:null,
                endTime:null,
                pageIndex:1,
                pageSize:10,
                total:0,
                tradingState:'0',
                list:[],
                dialogShowType: false
            },
            dialogData:{
                index:0,
                no:'',
                nos:[],
                imgs:[],
                style:{
                    width:'380px',
                    marginLeft:0
                }
            },
            send_success:{}
        }
    },
    methods:{
        tabChecked(tab, event){
            this.initTableParam();
            this.getList();
            this.activeName = tab.name;
            this.$router.push({
                path: `/user-center/order-list?activeName=${this.activeName}`
            });
        },
        initTableParam(){
            this.tableData.pageIndex=1;
            this.tableData.startTime=null;
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
                startTime:this.tableData.startTime,
                endTime:this.tableData.endTime,
                tradingState:this.tableData.tradingState=='0'?null:this.tableData.tradingState,
            };
            if(this.tab==1){
                data.purchaserId=1
            }else{
                data.sellerId=1
            };
            return data
        },
        getList(){
            let data=this.beforeRequest();
            this.$ajax.post(`/basemall-shop/shop-order/order-list`,data).then((res)=>{
                this.tableData.loading=false;
                this.tableData.list=res.orderList||[];
                this.tableData.total=res.total||0;
                this.tableData.list.forEach(v => {
                    v.isOvertime = '';
                });
            }).catch(()=>{
                this.tableData.loading=false
            })
        },
        dateChanged(date){
            this.tableData.pageIndex=1;
            this.tableData.startTime=!!date?`${this.tools.formatDate(date[0])} 00:00:00`:null;
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
        },
        showDialog(i){
            this.dialogData.index=0;
            this.dialogData.style.marginLeft=this.dialogData.index*380+'px';
            this.dialogData.no=this.dialogData.nos[-this.dialogData.index]
            let item=this.tableData.list[i];
            this.dialogData.nos=item.expressNumbers.split(',');
            this.dialogData.imgs=!!item.expressImages && item.expressImages.split(',').map(x=>`${x}?${parseInt(Math.random()*1000000)}`);

            if(this.dialogData.nos.length>0){
                this.dialogData.no=this.dialogData.nos[0];
                this.dialogData.style.width=this.dialogData.nos.length*380+'px'
            }
        },
        viewBigPic(img){
            window.open(img,"_target")
        },
        imgMove(type){
            if(type==1){
                this.dialogData.index++;
            }else{
                this.dialogData.index--
            };
            this.dialogData.style.marginLeft=this.dialogData.index*380+'px';
            this.dialogData.no=this.dialogData.nos[-this.dialogData.index]
        },
        outerLink(num){
            // 点击发货以后提醒对方验收
            if(num == 2){
                this.$ajax.post('/basemall-shop/shop-order/remind',{
                    id: this.send_success.id,
                    field: 2
                }).then(((res)=>{
                    
                }));
            }
            this.changeType();
            window.sendSuccess.status = false
            window.hideUserAside.val = false
        },
        created () {
            this.getList(this.tab);
        }
    }
}
</script>
<style lang="less" scoped>
    .orderlist-wrapper{
        .clear:after{ display: block; width: 100%; height: 0; content: ""; clear: both; }
        .m-l-xs{ margin-left: 5px; }
        .title{
            font-size: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ebebeb;
            margin-bottom: 10px;
        }
        .list-head{
            line-height:40px;
            margin-bottom:20px;
            .label{
                font-size:12px;
                margin-right:14px;
            }
        }
        .noData{
            width: 100%;
            border: 1px solid #ebebeb;
            font-size: 14px;
            text-align: center;
            margin-bottom: 10px;
            .head{
                height: 55px;
                border-bottom: 1px solid #ebebeb;
                background: #F5F8FB;
            }
            .detail{
                height: 60px;
                line-height: 60px;
                color: #999999;
            }
        }
        .oddNum{
                text-align: center;
                font-size: 18px;
                height: 60px;
                line-height: 60px;
            }
        .dialog-img-area{
            position: relative;
            margin-bottom: 20px;
            .left,.right{
                position: absolute;
                top: 45%;
                font-size: 30px;
                width: 30px;
                height: 30px;
                background: #ccc;
                color: #fff;
                border-radius: 50%;
                cursor: pointer;
                transition: all 1s;
                &:hover{
                    box-shadow: 0 0 0 25px #666 inset;
                }
            }
            .left{ left: 0; }
            .right{ right: 0; }
            .scroll-box{
                width: 380px;
                margin:0 auto;
                overflow: hidden;
                &>div{
                    transition: all .5s;
                    img{
                        float: left;
                        width: 380px;
                        cursor: zoom-in;
                    }
                }
            }
        }
    }
    .pay-success{
        text-align: center;
        padding-top: 100px;
        .top{
            padding-left: 80px;
            background: url(/static/img/user/payment@2x.png) no-repeat left top;
            background-size: auto 55px;
            display: inline-block;
            text-align: left;
            height:55px;
            p,span{
                line-height: 1;
            }
            p{
                color: inherit;
                font-size: 30px;
                margin-top: 20px;
            }
            span{
                font-size: 16px;
            }
        }
        .bottom{
            margin-top: 80px;
            margin-bottom:100px;
            span{
                font-size: 14px;
                margin-right: 20px;
            }
        }
    }
</style>
