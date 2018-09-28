<template>
	<div class='invest'>
		<div class="invest_content">
			<div class="invest_header">
				<span @click="clickTab(1)" :class="{s_active:num==1}">综合排序</span>
				<span @click="clickTab(2)" :class="{s_active:num==2}">更新时间</span>
			</div>
			<div class="invest_line" v-if="list.length==0">暂无数据</div>
			<ul class="invest_list">
				<li class="list_li" v-for="item in list" @click="searchDetail(item.id)">
					<div class="list_div list_left">
						<span class='list_title'>{{item.corpName}} 融资{{item.borrowSum}}元</span>
						<ul>
							<li>
								<div>所在地区：{{item.corpLocation}}</div>
								<div>所属行业：{{item.businessMain}}</div>
							</li>
							<li>
								<div>利率范围：{{item.minRate}}-{{item.maxRate}}</div>
								<div>融资用途：{{item.purpose}}</div>
							</li>
							<li>
								<div>融资资金：</div>
								<div class="list_money">{{item.borrowSum}}元</div>
							</li>
						</ul>
					</div>
					<div class="list_div list_right">
						<!-- <button class="btn" @click.stop="interview(item)" display>约谈项目</button> -->
						<el-button class="btn" @click.stop="interview(item.id)" :disabled='$store.state.userData.userType==1'>约谈项目</el-button>
						<div>剩余 <span>{{item.termOfValidity}}</span> 天结束</div>
					</div>
				</li>
			</ul>
			<div class="page"  v-show="list.length!=0">
				<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="nowPage"
			      :page-size="pageSize"
			      background
			      layout="total,  prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		    </div>
		</div>
		<el-dialog
		  title="约谈项目"
		  :visible.sync="centerDialogVisible"
		  width="400px"
		  top="30vh"
		  >
		  <div style="width: 100%;text-align: center" v-if='!isRoot'>
			  <span style="text-align: center;display: inline-block;width:100%;font-size:16px;">需要通过金融机构身份认证才能发起约谈</span>
			  <button class="root_btn" @click="goToRoot" style="font-size: 14px" v-if='false'>去认证</button>
		  </div>
		  <div style="width: 100%;text-align: left" v-if='isRoot'>
		  	<div style='margin-right: 25px'>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
					
					<el-form-item label="时间" prop="time">
					    <el-select v-model="ruleForm.time" placeholder="请选择时间" style="width:250px">
					      <el-option label="线下约定" value="线下约定"></el-option>
					      <el-option label="工作日8:00~12:00" value="工作日8:00~12:00"></el-option>
					      <el-option label="工作日13:00~18:00" value="工作日13:00~18:00"></el-option>
					      <el-option label="全天" value="全天"></el-option>
					    </el-select>
					 </el-form-item>
					 <el-form-item label="联系人" prop="people">
					    <el-input v-model="ruleForm.people"></el-input>
					</el-form-item>
					<el-form-item label="" prop="sex">
					    <el-radio-group v-model="ruleForm.sex">
					      <el-radio label="男"></el-radio>
					      <el-radio label="女"></el-radio>
					    </el-radio-group>
				 	</el-form-item>
				 	<el-form-item label="联系电话" prop="phone">
					    <el-input v-model="ruleForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="备注">
					    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
					</el-form-item>
					<el-form-item style="width:100%;text-align: center;">
					    <el-button type="primary" @click="submitForm('ruleForm')" style="width:110px">提交</el-button>
					 </el-form-item>
				</el-form>
		  	</div>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name:'invest',
		created(){
			this.getData(1)
		},
		data(){
			return{
				list:[],
				centerDialogVisible:false,
				nowPage:1,
				pageSize:10,
				total:0,
				num:1,
				ruleForm:{
					time:'',
					people:'',
					sex:'',
					phone:'',
					desc:''
				},
				isRoot:false,
				rules:{
					time: [
			            { required: true, message: '请输入时间', trigger: 'blur' },
			          ],
					people: [
			            { required: true, message: '请输入联系人', trigger: 'blur' },
			          ],
					sex: [
			            { required: true, message: '请选择性别', trigger: 'change' },
			          ],
					phone: [
			            { required: true, message: '请输入手机号码', trigger: 'blur' },
            			{ pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur'}
			          ],
				},
				borrowId:0
			}
		},
		methods: {
			clickTab(num){
				this.num = num
				this.nowPage = 1
				this.getData()
			},
	      handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	      },
	      handleCurrentChange(val) {
	      	this.nowPage = val
	      	this.getData()
	        console.log(`当前页: ${val}`);
	      },
	      searchDetail(id){
	      	//点击具体项目跳转到详情页面
	      	
	      	this.$router.push('/invest/detail?borrowId='+id)
	      	console.log(id)
	      },
	      interview(id){
	      	//判断自己有没有认证通过
	      	this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then((res) => {
                if(true){
                	//认证通过
                    this.isRoot = true
                    this.borrowId = id
                } else{
                	this.isRoot = false
                }
                this.centerDialogVisible = true
            })
	      },
	      submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	            let obj = {}
	            obj.borrowId = this.borrowId
	            obj.name = this.ruleForm.people
	            obj.phone = this.ruleForm.phone
	            obj.sex = this.ruleForm.sex=='男'?1:2
	            obj.interviewTime = this.ruleForm.time
	            obj.remark = this.ruleForm.desc
	            this.centerDialogVisible = false
	            
	            this.$ajax.post('/basemall-fax/interview-info/add-interview',obj).then(res=>{
	            	console.log(res)
	            })

	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
	      },
	      resetForm(formName) {
	        this.$refs[formName].resetFields();
	      },
	      getData(){
	      	let url = '/basemall-fax/borrow/borrow-list?pageIndex='+this.nowPage+'&pageSize='+this.pageSize
	      	if(this.num==2){
	      		// data.order="time"
	      		url = url + '&order=time'
	      	}
	      	this.$ajax.get(url).then(res=>{
	      		this.total = res.total
	      		this.list = res.list
	      	})
	      },
	      goToRoot(){
	      	console.log('去认证')
	      	this.centerDialogVisible = false
	      }
	    },
	    watch:{
	    	centerDialogVisible(){
	    		if(!this.centerDialogVisible){
	    			console.log(this.centerDialogVisible)
	    			//this.resetForm('ruleForm')
	    		}
	    	}
	    	
	    }
	}
</script>
<style lang='less' scoped>
	@import '../../assets/css/comcss/com_UI.less';
    @import '../../less/areaClass.less';
	.invest_content{
		max-width: 1200px;
        margin: 0px auto 50px;
        background-color: @background-color;
        font-size: 15px;
        padding: 30px 45px;
        box-sizing: border-box;
        div,span,ul,li{
        	box-sizing: border-box
        }
        .invest_line{
        	width:100%;
        	height: 50px;
        	border-top:1px solid #ccc;
        	text-align: center;
        	line-height: 50px;
        	color:#ccc;
        }
        .invest_header{
			border:1px solid #ccc;
			height:40px;
			width:200px;
			line-height: 40px;
			border-bottom:none;
			span{
				height:100%;
				width:99px;
				display: inline-block;
				float:left;
				text-align: center;
				cursor:pointer;
				&:nth-child(1){
					border-right:1px solid #ccc;
				}
			}
		.s_active{
			background:rgba(242, 242, 242, 1)
		}
        }
        .invest_list{
        	width:100%;
        	.list_li{
				width:100%;
				height:130px;
				border:1px solid #ccc;
				border-top:none;
				&:nth-child(1){
					border-top:1px solid #ccc
				}
				.list_div{
					float: left;
					height:100%;
				}
				.list_left{
					width:70%;
					padding-left: 30px;
					padding-top:10px;
					.list_title{
						display: block;
						font-size:18px;
						color:#0066ff;
					}
					ul{
						width:100%;
						li{
							width: 40%;
							height:85px;
							font-size:15px;
							padding-top:20px;
							float:left;
							&:nth-child(3){
								width:15%;
							}
							&:nth-child(1){
								width:45%;
							}
							div{
								height:20px;
								line-height: 20px;
								&:nth-child(2){
									margin-top: 15px;
								}
							}
							.list_money{
								color:red;
								font-size: 20px;
							}
						}
					}
				}
				.list_right{
					width: 30%;
					.btn{
						width:200px;
						// height:30px;
						// line-height: 30px;
						text-align: center;
						background: #f16511;
						color:#fff;
						margin-top:50px;
						margin-left: 55px;
						font-size: 16px;
					}
					div{
						width:200px;
						text-align: center;
						margin-left: 55px;
						margin-top: 10px;
						span{
							color:#f16511;
						}
					}
					// background:red;
				}
        	}
        }
        .page{
        	margin:20px;
        	width:100%;
        	text-align:center;
        }

	}
	.root_btn{
    	width: 150px;
    	height:30px;
    	line-height: 30px;
    	border:1px solid #ccc;
    	text-align: center;
    	margin-top:20px;
    	margin-left: auto;
    }
</style>