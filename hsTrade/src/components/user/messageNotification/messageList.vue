<template>
<div>
    <div class="topTitle">消息列表 </div>
	<el-tabs class="tab_full-width three" v-model="tab" @tab-click="tabChecked" v-if="$store.state.userData.userType==3">
		<el-tab-pane :label="'交易消息'+dealNum" name="7"></el-tab-pane>
        <el-tab-pane :label="'系统消息'+sysNum" name="3"></el-tab-pane>
		<el-tab-pane :label="'推送消息'+configNum" name="9"></el-tab-pane>
	</el-tabs>

	<el-tabs class="tab_full-width three" v-model="tab" @tab-click="tabChecked" v-if="$store.state.userData.userType==1">
		<el-tab-pane :label="'互动消息'+chatNum" name="1"></el-tab-pane>
		<el-tab-pane :label="'订单消息'+orderNum" name="2"></el-tab-pane>
		<el-tab-pane :label="'系统消息'+sysNum" name="3"></el-tab-pane>
	</el-tabs>

	<business v-if="false" @chat-num="chatNum"></business>
    <ul v-if="tab==1">
        <li v-for="item in msg_data" style="margin-bottom: 10px" >
            <router-link tag="a" target="_blank" :to="{name:'询价',params:{},query:{id:item.id,remoteId:item.remoteId,skuId:item.skuId,skuKeyId:item.skuKeyId, remoteCorpName:item.remoteCorpName, to:item.from}}" style="border:1px solid transparent">
                <span @click="setRead(item.from)">
                    <span style="float:left" v-if="item.unread==0">[{{item.from}}] 会话</span>
                    <span class="msg_read" style="float:left" v-if="item.unread!=0">[{{item.from}}]  新消息提醒</span>
                    <!-- <span class="msg_read" style="float:left" v-if="item.unread!=2">{{item}}</span> -->
                    <span style="float:right">{{item.time|formatTime("YMDHMS")}}</span>
                </span>
            </router-link>
        </li>
    </ul>

    <div class="investmentElTabs" v-if="tab ==2||tab==3||tab==7||tab==9">
        <div class="messagesIns" v-loading="tableData.loading" v-if="tab==2||tab==7">
            <ul>
                <li @click="updateReadStatus(item,1)" v-if="$store.state.userData.userType==3" v-for="item in tableData.messageDataList">
                    <!-- <span class="title blue_link" :class="{read:! item.readStatus}">{{item.letterTitle}}</span>
                    <span class="fr text-gray">{{item.createTime|formatTime("YMD")}}</span> -->
                    <span class="title" :class="{read:! item.readStatus}">{{item.letterTitle}}</span>
                    <span class="fr text-gray">{{item.createTime|formatTime("YMDHMS")}}</span>
                    <p v-if="tab!=2">{{tab!=2?item.letterContent:item.letterTitle}}</p>
                </li>
                <li v-if="$store.state.userData.userType==1" v-for="item in tableData.messageDataList">
                    <span :class="{read:! item.readStatus}"><i class="text-href m-r" @click="updateReadStatus(item,2)">[订单{{item.orderNo}}]</i><i>{{tab==2?item.letterTitle:item.letterContent}}</i></span>
                    <span class="fr text-gray">{{item.createTime|formatTime("YMD")}}</span>
                </li>
            </ul>
        </div>

        <div class="messagesIns" v-loading="tableData.loading" v-if="tab==3">
            <ul>
                <li @click="updateReadStatus(item)" v-for="item in tableData.messageDataList">
                    <span class="title" :class="{read:! item.readStatus}">{{item.letterTitle}}</span>
                    <span class="fr text-gray">{{item.createTime|formatTime("YMD")}}</span>
                    <p>{{item.letterContent}}</p>
                </li>
            </ul>
        </div>
        
        <div class="messagesIns" v-loading="tableData.loading" v-if="tab==9">
            <div v-if="!openInfoConfig" >
                <el-button size="medium" type="info" @click="setPushInfo" style="margin-bottom: 20px">推送消息配置</el-button>
                <ul>
                    <li v-for="item in tableData.messageDataList" @click="setReadInfo(item)">
                        <span class="title" :class="{read:! item.readStatus}">{{item.letterTitle}}</span>
                        <span class="fr text-gray">{{item.createTime|formatTime("YMD")}}</span>
                        <p>{{item.letterContent}}</p>
                    </li>
                </ul>
            </div>
            <div v-if="openInfoConfig" class="config-box">
                <div class="push-title">配置推送消息</div>
                <el-form :model="infoConfig" :rules="rules" ref="infoConfig">
                    <div class="rows">
                        <span class="rows-til">融资比例</span>
                        <div class="row-min">
                            <el-form-item
                            prop="scaleMin"
                            >
                                <el-input  v-model="infoConfig.scaleMin" clearable size='mini' ref="scalemin"></el-input>
                            </el-form-item>
                        </div>
                        <span class="rows-line">—</span>
                        <div class="row-max"><el-form-item prop='scaleMax'><el-input  v-model="infoConfig.scaleMax" clearable size='mini' ref='scalemax'></el-input></el-form-item></div>
                    </div>
                    <div class="rows">
                        <span class="rows-til">融资期限</span>
                        <div class="row-min">
                            <el-form-item
                            prop="timeMin"
                            >
                                <el-input  v-model="infoConfig.timeMin" clearable size='mini'></el-input>
                            </el-form-item>
                        </div>
                        <span class="rows-line">—</span>
                        <div class="row-max">
                            <el-form-item
                            prop="timeMax"
                            >
                                <el-input  v-model="infoConfig.timeMax" clearable size='mini'></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="rows">
                        <span class="rows-til">融资金额</span>
                        <div class="row-min"><el-form-item prop='moneyMin'><el-input  v-model="infoConfig.moneyMin" clearable size='mini'></el-input></el-form-item></div>
                        <span class="rows-line">—</span>
                        <div class="row-max"><el-form-item prop='moneyMax'><el-input  v-model="infoConfig.moneyMax" clearable size='mini'></el-input></el-form-item></div>
                    </div>
                    <div class="rows">
                        <span class="rows-til" style="margin-right:30px">融资利率(年化)</span>
                        <div class="row-min"><el-form-item prop='pointMin'><el-input  v-model="infoConfig.pointMin" clearable size='mini'></el-input></el-form-item></div>
                        <span class="rows-line">—</span>
                        <div class="row-max"><el-form-item prop='pointMax'><el-input  v-model="infoConfig.pointMax" clearable size='mini'></el-input></el-form-item></div>
                    </div>
                    <div class="submit-btn">
                        <el-button type="info" size='small' style="width:100px;margin-right:20px" @click="clearInfoConfig">清空</el-button>
                        <el-button type="primary" size='small' style="width:100px" @click="submitForm('infoConfig')">确定</el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <p v-if="!tableData.total && !openInfoConfig" class="no-message"></p>

        <pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
    </div>
    <el-dialog title="" :visible.sync="isShowInvoice" width="750px">
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
</template>

<script>
import business from './business';
import pagination from "@/components/common/pagination.vue";
export default {
    name: "assetDetail",
    components: {
		business,
        pagination
    },
    data() {
        let validateScaleMin = (rule, value, callback)=>{
           if( value!="" && (Number(value) <= 0 || Number(value) > 100 || !/^[0-9]*$/.test(value))){
                callback(new Error('融资比例只能是 100 以内正数'))
                return
            }
            if(this.infoConfig.scaleMax&&value!=""){
                if(Number(value) > Number(this.infoConfig.scaleMax)){
                    callback(new Error('范围的起始不能大于范围的结束'))
                    return
                }
            }
            callback()
        }
        let validateScaleMax = (rule,value,callback)=>{
            if(value!=""&&(Number(value) <= 0 || Number(value) > 100 || !/^[0-9]*$/.test(value))){
                callback(new Error('融资比例只能是 100 以内正数'))
                return
            }
            if(this.infoConfig.scaleMin&&value!=""){
                if(Number(value) < Number(this.infoConfig.scaleMin)){
                    callback(new Error('范围的结束不能小于范围的开始'))
                    return
                }
            }
            callback()
        }
        let validateMoneyMin = (rule,value,callback)=>{
            if(value!=""&&(Number(value) <= 0 || !/^[0-9]*$/.test(value))){
                callback(new Error('融资金额只能是正数'))
                return
            }
            if(this.infoConfig.moneyMax&&value!=""){
                if(Number(value) > Number(this.infoConfig.moneyMax)){
                    callback(new Error('范围的起始不能大于范围的结束'))
                    return
                }
            }
            callback()
        }
        let validateMoneyMax = (rule,value,callback)=>{
            if(value!=""&&(Number(value) <= 0 || !/^[0-9]*$/.test(value))){
                callback(new Error('融资金额只能是正数'))
                return
            }
            if(this.infoConfig.moneyMin&&value!=""){
                if(Number(value) < Number(this.infoConfig.moneyMin)){
                    callback(new Error('范围的结束不能小于范围的开始'))
                    return
                }
            }
            callback()
        }
        let validatePointMin = (rule,value,callback)=>{
            if(value!=""&&(Number(value) <= 0 || !/^[0-9]*$/.test(value))){
                callback(new Error('融资比例只能是正数'))
                return
            }
            if(this.infoConfig.pointMax&&value!=""){
                if(Number(value) > Number(this.infoConfig.pointMax)){
                    callback(new Error('范围的起始不能大于范围的结束'))
                    return
                }
            }
            callback()
        }
        let validatePointMax = (rule,value,callback)=>{
            if(value!=""&&(Number(value) <= 0 || !/^[0-9]*$/.test(value))){
                callback(new Error('融资比例只能是正数'))
                return
            }
            if(this.infoConfig.pointMin&&value!=""){
                if(Number(value) < Number(this.infoConfig.pointMin)){
                    callback(new Error('范围的结束不能小于范围的开始'))
                    return
                }
            }
            callback()
        }
        let validateTimeMin = (rule,value,callback)=>{
            if(value!="" && !/^[1-9]\d*$/.test(value)){
                callback(new Error('融资期限只能是正整数'))
                return
            }
            // console.log(Number(value) < Number(this.infoConfig.timeMax))
            if(this.infoConfig.timeMax&&value!=""){
                if(Number(value) > Number(this.infoConfig.timeMax)){
                    callback(new Error('范围的起始不能大于范围的结束'))
                    return
                }
            }
            callback()
        }
        let validateTimeMax = (rule,value,callback)=>{
            if(value!="" && !/^[1-9]\d*$/.test(value)){
                callback(new Error('融资期限只能是正整数'))
                return
            }
            if(this.infoConfig.timeMin&&value!=""){
                if(Number(value) < Number(this.infoConfig.timeMin)){
                    callback(new Error('范围的结束不能小于范围的开始'))
                    return
                }
            }
            callback()
        }
        return {
            tab:null,
            userId:null,
            tableData: {
                loading: false,
                pageIndex: 1,
                pageSize: 10,
                total: 0,
                messageDataList: []
            },
            openInfoConfig:false,
            infoConfig:{
                scaleMin:'',
                scaleMax:'',
                timeMax:'',
                timeMin:'',
                moneyMin:'',
                moneyMax:'',
                pointMin:'',
                pointMax:''
            },
            rules: {
                scaleMin: [
                    { validator: validateScaleMin, trigger: 'blur' }
                ],
                scaleMax: [
                    { validator: validateScaleMax, trigger: 'blur' }
                ],
                moneyMin: [
                    { validator: validateMoneyMin, trigger: 'blur' }
                ],
                moneyMax: [
                    { validator: validateMoneyMax, trigger: 'blur' }
                ],
                pointMin: [
                    { validator: validatePointMin, trigger: 'blur' }
                ],
                pointMax: [
                    { validator: validatePointMax, trigger: 'blur' }
                ],
                timeMin: [
                    { validator: validateTimeMin, trigger: 'blur' }
                ],
                timeMax: [
                    { validator: validateTimeMax, trigger: 'blur' }
                ],
            },
            websock:null,
            isShowInvoice:false,
            dialogData: {
                index: 0,
                no: '',
                nos: [],
                imgs: [],
                style: {
                    width: '380px',
                    marginLeft: 0
                }
            },
            info:[],
            msg_data:[]
        }
    },
    created() {
        nim.getLocalSessions({
            limit: 100,
            done: this.getLocalSessionsDone
        });
        if(this.$store.state.userData.userType==3){
            if(localStorage.getItem("MessageTab")){
                this.setLocal('get')
                this.tabChecked()
            }else{
                this.tab='7';
                this.getMessageList();
            }
        }else{
            if(localStorage.getItem("MessageTab")){
                this.setLocal('get')
                this.tabChecked()
            }else{
                this.tab= window.setMsgTabTag ? window.MsgTabTag : '1';
                this.tabChecked()
            }
        }
        
    },
    methods: {
        setRead(sessionId){
            //nim.setCurrSession('p2p-'+sessionId)
            nim.resetSessionUnread('p2p-'+sessionId)
            this.msg_data.forEach(v=>{
                if(v.from == sessionId){
                    v.unread = 0
                }
            })
        },
        getLocalSessionsDone(error, obj){
            if(!error){
                let sessions = obj.sessions
                sessions.forEach(v=>{
                    console.log(v)
                    let obj = {}
                    obj.from = v.to
                    obj.time = v.updateTime
                    obj.unread = v.unread
                    this.msg_data.push(obj)
                })
            }
        },
        sendInfoConfig(){
            let obj = {}
            if(this.infoConfig.scaleMin || this.infoConfig.scaleMax){
                obj.financingRatio = {msgSubscribeId:1}
                if(this.infoConfig.scaleMin){
                   obj.financingRatio.minValue =  this.infoConfig.scaleMin
                }
                if(this.infoConfig.scaleMax){
                    obj.financingRatio.maxValue =  this.infoConfig.scaleMax
                }
                // obj.financingRatio = {msgSubscribeId:1,minValue:this.infoConfig.scaleMin,maxValue:this.infoConfig.scaleMax}
            }
            if(this.infoConfig.timeMin || this.infoConfig.timeMax){
                obj.financingPeriod  = {msgSubscribeId:2}
                if(this.infoConfig.timeMin){
                    obj.financingPeriod.minValue = this.infoConfig.timeMin
                }
                if(this.infoConfig.timeMax){
                    obj.financingPeriod.maxValue = this.infoConfig.timeMax
                }
                // obj.financingPeriod  = {msgSubscribeId:2,minValue:this.infoConfig.timeMin,maxValue:this.infoConfig.timeMax}
            }
            if(this.infoConfig.moneyMin || this.infoConfig.moneyMax){
                obj.financingAmount = {msgSubscribeId:3}
                if(this.infoConfig.moneyMin){
                    obj.financingAmount.minValue = this.infoConfig.moneyMin
                }
                if(this.infoConfig.moneyMax){
                    obj.financingAmount.maxValue = this.infoConfig.moneyMax
                }
                // obj.financingAmount = {msgSubscribeId:3,minValue:this.infoConfig.moneyMin,maxValue:this.infoConfig.moneyMax}
            }
            if(this.infoConfig.pointMin || this.infoConfig.pointMax){
                obj.financingRate = {msgSubscribeId:4}
                if(this.infoConfig.pointMin){
                    obj.financingRate.minValue = this.infoConfig.pointMin
                }
                if(this.infoConfig.pointMax){
                    obj.financingRate.maxValue = this.infoConfig.pointMax
                }
                // obj.financingRate = {msgSubscribeId:4,minValue:this.infoConfig.pointMin,maxValue:this.infoConfig.pointMax}
            }
            

            if(Object.keys(obj).length == 0){
                return
            }

            this.$ajax.post('/basemall-message/subscribe-user/add-subscribe-user',obj).then((res)=>{ 
                // console.log(res.code)
                this.openInfoConfig = false
                this.getMessageList()
            }).catch((err)=>{
                console.log('发送失败')
                this.$message.error('配置信息设置失败');
            })


        },

		tabChecked(){
            this.setLocal('set')
            this.tableData.pageIndex=1;
            if(this.tab==2||this.tab==3||this.tab==7||this.tab==9){
                this.getMessageList();
            }
            // if(this.tab==9){
            //     console.log(2131313)
            //     this.getSubscribeMsg()
            // }
            window.MsgTabTag = this.tab

            //localStorage.setItem('MessageTab', this.tab)

		},
        pageChanged(pageIndex) {
            this.tableData.pageIndex = pageIndex;
            this.getMessageList()
            //this.tab == 9?this.getSubscribeMsg():this.getMessageList()
        },
        getMessageList() {
            this.init();
            // console.log(this.tab)
            let data = {
                pageIndex: this.tableData.pageIndex,
                pageSize: this.tableData.pageSize,
                letterTypeId: this.tab == 2 ? 5 :this.tab==3 ? 4 :this.tab==7?7 : this.tab == 9 ? 8 : 6,
            };
            this.$ajax.post('/basemall-message/message/message-list', data).then((res) => {
                this.userId=res.userId;
                this.tableData.loading = false;
                this.tableData.total = res.total;
                this.tableData.messageDataList = res.letterList;
            }).catch((err) => {
                this.tableData.loading = false;
            })
        },
        setReadInfo(item){
            let id = item.orderId
            if(item.readStatus==0){
                let data = {
                    letterUserId:item.letterUserId
                }
                this.$ajax.post('/basemall-message/message/update-message-state',data).then(res=>{
                    item.readStatus = 1
                })
            }
            this.$router.push({
                path: '/finance/detail',
                query: {
                    borrowId: id
                }
            });            
        },
        init() {
            this.tableData.loading = true;
            this.tableData.messageDataList = [];
            this.tableData.total = 0;
        },
        viewInvoice() {
            this.isShowInvoice = true;
            this.dialogData.index = 0;
            this.dialogData.style.marginLeft = this.dialogData.index * 380 + 'px';
            this.dialogData.no = this.dialogData.nos[-this.dialogData.index]
            this.dialogData.nos = this.info.expressNumbers.split(',');
            this.dialogData.imgs = !!this.info.expressImages && this.info.expressImages.split(',').map(x => `${x}?${parseInt(Math.random()*1000000)}`);
            if (this.dialogData.nos.length > 0) {
                this.dialogData.no = this.dialogData.nos[0];
                this.dialogData.style.width = this.dialogData.nos.length * 380 + 'px'
            }
        },
        imgMove(type) {
            if (type == 1) {
                this.dialogData.index++;
            } else {
                this.dialogData.index--;
            };
            this.dialogData.style.marginLeft = this.dialogData.index * 380 + 'px';
            this.dialogData.no = this.dialogData.nos[-this.dialogData.index]
        },
        viewBigPic(img) {
            window.open(img, "_target")
        },
        updateReadStatus(opt,type){
            //console.log(opt)
            if(opt.letterTitle == '发货'){

                console.log(opt.orderId)
                this.$ajax.get('/basemall-shop/shop-order/order?id='+opt.orderId).then(res=>{
                    this.info = res[0];
                    this.viewInvoice()
                })

            }
            if(opt.readStatus==0){
                let url='/basemall-message/message/update-message-state',
                    data={letterUserId:opt.letterUserId};
                this.$ajax.post(url,data).then(()=>{
                    opt.readStatus=1;
                });
            };
            if(type==2){
                let orderType=1;
                if(opt.sellerId==this.userId){ orderType=2 };
                window.detailMsgPath = "/user-center/order-list/order-detail?id="+opt.orderId+"&orderType="+orderType
                this.$router.push({path:`/user-center/order-list/order-detail?id=${opt.orderId}&orderType=${orderType}`})
            }
        },
        setPushInfo(){
            this.openInfoConfig = true
            this.tableData.messageDataList = [];
            this.tableData.total = 0;
            this.$ajax.get('/basemall-message/subscribe-user/show-subscribe-user').then(res=>{
                console.log(res)
            })
        },
        clearInfoConfig(){
            for(let key in this.infoConfig){
                this.infoConfig[key] = ''
            }
            // this.openInfoConfig = false
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sendInfoConfig()                    
                  } else {
                    this.$message.error('配置信息填写错误');
                    return false;
                }
            });
        },
        setLocal(tag){
            if(tag == 'set'){
                localStorage.setItem('MessageTab', this.tab)
            }
            if(tag == 'get'){
                this.tab = localStorage.getItem("MessageTab")
            }
            if(tag == 'remove'){
                localStorage.removeItem('MessageTab')
            }
        }
    },
    beforeRouteLeave(to, from, next){
        this.setLocal('remove')
        next(true)
    },
    computed:{
        orderNum(){
            let num=this.$store.state.globalData.noticeCount.unreadOrderNum;
            return !!num?`(${num})`:''
        },
        sysNum(){
            let num=this.$store.state.globalData.noticeCount.unreadSysNum;
            return !!num?`(${num})`:''
        },
        dealNum(){
            let num=this.$store.state.globalData.noticeCount.unreadDealNum;
            return !!num?`(${num})`:''
        },
        chatNum(){
            let num = this.$store.state.globalData.noticeCount.unreadChatNum;
            return !!num?`(${num})`:''
        },
        configNum(){
            let num = this.$store.state.globalData.noticeCount.unreadConfigNum;
            return !!num?`(${num})`:''
        },
        message_option(){
            console.log(this.$store.state.globalData.message_option);
            return this.$store.state.globalData.message_option;
        },
        isRead(){
            return this.$store.state.globalData.isRead
        }

    },
    watch: {
        message_option:{
            handler(newVal,oldVal){
                console.log(111,newVal)
                let isTrue = false
                for(let i = 0; i < this.msg_data.length; i++){
                    if(this.msg_data[i].from == newVal.from){
                        isTrue = true
                        this.msg_data[i].unread = 1
                    }
                }

                if(!isTrue){
                    this.msg_data.push(newVal)
                }

            },
            deep: true
        },
        isRead:{
            handler(newval){
                this.msg_data.forEach(v=>{
                    if(v.from == newval.account){
                        v.unread = newval.unread
                    }
                })
            },
            deep:true
        }
    }
}
</script>

<style lang="less" scoped>
.investmentElTabs {
    width: 100%;
    line-height: 30px;
}
.no-message{
    width: 100%;
    height: 280px;
    background: url(/static/img/user/no-message.png) no-repeat center center;
}
.topTitle {
    font-size: 22px;
    color: #000;
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 21px;
    padding-bottom: 21px;
}
.messagesIns {
    ul {
        li {
            color: #000;
            border-bottom: 1px solid #ebebeb;
            font-size: 14px;
            padding: 15px 0;
            color: #333;
            .title{ font-size: 18px; }
            p{
                padding-left: 30px;
                width: 100%;
                word-break: break-all;
                box-sizing: border-box;
                padding-top: 15px;
            }
        }
        li:hover{
            cursor: pointer;
            background-color:#F5F8FB;
        }
        .read{
            font-weight: bold;
        }
    }
}
.config-box{
    margin-left:30px;
    .push-title{
        font-size:20px;
        margin-bottom: 30px;
    }
    .rows{
        font-size:16px;
        margin-bottom: 20px;
        .rows-til{
            margin-left: 20px;
            margin-right:70px;
        }
        .row-min,.row-max{
            // background:red;
            width:222px;
            height:28px;
            display: inline-block;
            vertical-align: top
        }
        span{
            display: inline-block;
            height: 40px;
            line-height: 40px;
            vertical-align: top;
        }
        .input-set{
            height:28px;
        }
    }
}
.submit-btn{
    margin-top:60px;
    margin-left:500px;
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
.msg_read{
    font-weight: bold;
}
</style>
