<template>
	<div class="invest_detail">
		<div class="con_info">
			<div class="info_l">
				<span class="info_t">{{detail_info.corpName || ''}} 融资{{detail_info.borrowSum || 0 }}元</span>
				<div class='info_d'>
					<ul>
						<li>
							<span>所在地区 : {{detail_info.corpLocation}}</span>
							<span>融资总额：{{detail_info.borrowSum}}元</span>
						</li>
						<li>
							<span>所属行业：{{detail_info.businessMain}}</span>
							<span>利率范围：{{detail_info.minRate}}-{{detail_info.maxRate}}</span>
						</li>
						<li>
							<span>融资方式：</span>
							<span>提供资料：{{detail_info.projectDate}}</span>
						</li>
						<li>
							<span>融资用途：{{detail_info.purpose}}</span>
							
						</li>
					</ul>
				</div>
				<div class="inf_f">
					<div class="inf_f_l">
						<span class="info_fl_t">已收到约谈共计{{detail_info.interviewNo}}次</span>
						<div><span>发布时间: {{detail_info.publishDatetime}}</span><span>有效时间：  还剩 <b style="color:orange">{{detail_info.termOfValidity}}</b> 天 </span></div>
					</div>
					<div class="inf_f_r">
							<el-button  @click.stop="interview" :disabled='$store.state.userData.userType==1'>约谈项目</el-button>
					</div>
				</div>
			</div>
			<div class="info_r">
				<span class="con_info_t">企业名片</span>
				<div class="con_pic">
					<div class="con_pic_c">
						<img src="../chat/images/default-icon.png" alt="">
					</div>
				</div>
				<span class="con_f" style="margin-top:20px">所在地区 ： {{detail_info.corpLocation}}</span>
				<span class="con_f" style="margin-top:15px">所属行业 ： {{detail_info.businessMain}}</span>
				<button @click="viewComponyIndex">查看企业主页</button>
			</div>
		</div>
		<div class="con_detail">
			<div class="describe">
				<div class="describe_t">项目描述</div>
				<p class='describe_c' v-html="detail_info.remark">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</p>
			</div>
			<div class="datum" v-if="isRoot">
				<div class="datum_t">项目资料</div>
				<p class='datum_c'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo</p>
				<ul class="datum_pic clearfix">
					<li>
						<img src="../../../static/img/banner.jpg" alt="">
					</li>
					<li>
						<img src="../../../static/img/banner.jpg" alt="">
					</li>
					<li>
						<img src="../../../static/img/banner.jpg" alt="">
					</li>
				</ul>
			</div>
			<div class="clause">
				<div class="clause_t">声明条款 <span>平台不做担保的系列声明</span></div>
				<p class='clause_c'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</p>
				<p class='clause_c'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</p>
			</div>
		</div>
		<el-dialog
		  title="约谈项目"
		  :visible.sync="centerDialogVisible"
		  width="400px"
		  top="30vh"
		  >
		  <div style="width: 100%;text-align: center" v-if='false'>
			  <span style="text-align: center;display: inline-block;width:100%;font-size:16px;">需要通过金融机构身份认证才能发起约谈</span>
			  <button class="root_btn">去认证</button>
		  </div>
		  <div style="width: 100%;text-align: left" v-if='true'>
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
		name:'invest_detail',
		created(){
			
			//判断自己有没有认证通过
			if(this.$store.state.userData.userType==1){
				this.isRoot = false
				this.getDetailInfo()
			}else{
				this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then((res) => {
	                if(true){
	                	//认证通过
	                    this.isRoot = true
	                } else{
	                	this.isRoot = false
	                }
	                // this.centerDialogVisible = true
	                this.getDetailInfo()
	            })
			} 	
		},
		data(){
			return {
				centerDialogVisible:false,
				detail_info:{},
				isRoot:false,
				corpId:0,
				ruleForm:{
					time:'',
					people:'',
					sex:'',
					phone:'',
					desc:''
				},
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
				}
			}
		},
		methods:{
			submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		            let obj = {}
		            obj.borrowId = this.$route.query.borrowId
		            obj.name = this.ruleForm.people
		            obj.phone = this.ruleForm.phone
		            obj.sex = this.ruleForm.sex=='男'?1:2
		            obj.interviewTime = this.ruleForm.time
		            obj.remark = this.ruleForm.desc

		            this.$ajax.post('/basemall-fax/interview-info/add-interview',obj).then(res=>{
		            	this.centerDialogVisible = false
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
	      	interview(){
	      		this.centerDialogVisible = true
	      	},
	      	getDetailInfo(){
	      		let data = {borrowId:this.$route.query.borrowId}
	      		if(this.isRoot){
	      			data.auditUser = true
	      		}
	      		this.$ajax.post('/basemall-fax/borrow/borrow-detail',data).then(res=>{
	      			console.log(res)
	      			this.detail_info = res.borrow
	      			this.corpId = res.borrow.uid
	      		})
	      	},
	      	viewComponyIndex(){
	      		this.$router.push('/company/home?corpId='+this.corpId)
	      		// if(this.$store.state.userData.userType==1){
	      		// 	console.log('这是企业')
	      		// }else{
	      		// 	console.log('这是金融机构')
	      		// }
	      	}
		},
		watch:{
	    	centerDialogVisible(){
	    		if(!this.centerDialogVisible){
	    			this.resetForm('ruleForm')
	    		}
	    	}	
	    }
	}
</script>
<style scoped lang='less'>
@import '../../assets/css/comcss/com_UI.less';
@import '../../less/areaClass.less';
.invest_detail{
	max-width: 1200px;
    margin: 0px auto 50px;
    // background-color: @background-color;
    font-size: 15px;
    box-sizing: border-box;
    div,span,ul,li{
    	box-sizing: border-box
    }
    .con_info{
    	width:100%;
    	height: 350px;
    	background: @background-color;
    	.info_l{
    		height: 100%;
    		width:75%;
    		padding-top: 30px;
    		padding-left:20px;
    		// background:blue;
    		float:left;
    		.info_t{
    			display: block;
				font-size:18px;
				color:#0066ff;
    		}
    		.info_d{
    			padding-top:5px;
    			padding-left:20px;
    			li{
    				width:100%;
    				height: 30px;
    				// background:red;
    				margin-top:2px;
    			}
    			span{
    				display:inline-block;
    				height: 100%; 
    				line-height: 30px;
    			}
    			span:nth-child(1){
    				width:45%;
    			}
    		}
    		.inf_f{
    			height:90px;
    			width:85%;
    			border:1px dashed #ccc;
    			margin-top: 20px;
    			.inf_f_l{
	    			width:70%;
	    			height:100%;
	    			padding-top:15px;
	    			padding-left:20px;
	    			float:left;
	    			// background:red;
	    			.info_fl_t{
	    				font-size: 18px;
	    			}
	    			div{
	    				margin-top:10px;
	    				span{
	    					display: inline-block;
	    					height: 16px;
	    					line-height: 16px;
	    					font-size:14px;
	    					// width:100px;
	    					&:nth-child(1){
	    						width:175px;
	    						border-right:2px solid #ccc;
	    						margin-right: 35px;
	    					}
	    				}
	    			}
	    		}
	    		.inf_f_r{
	    			height: 100%;
	    			width:30%;
	    			position: relative;
	    			float:right;
	    			button{
	    				width:120px;
	    				height: 40px;
	    				background:rgba(241, 101, 17, 1);
	    				position: absolute;
	    				font-size:16px;
	    				top:50%;
	    				left:50%;
	    				color:#fff;
	    				transform: translate(-50% ,-50%);
	    				-webkit-transform:translate(-50% ,-50%);
	    				-moz-transform:translate(-50% ,-50%);
	    				-ms-transform:translate(-50% ,-50%);
	    				-o-transform:translate(-50% ,-50%);
	    			}
	    		}
    		}
    	}
    	.info_r{
    		height: 100%;
			background: #f5f8fb;
    		width:25%;
    		float:left;
    		padding:20px 40px 0 40px;
			.con_info_t{
				display: inline-block;
				height:15px;
				width:100%;
				font-size: 14px;
				line-height: 15px;
				font-family: 'PingFangSC-Regular', 'PingFang SC';
			    font-weight: 400;
			    font-style: normal;
			}
			.con_pic{
				width:100%;
				height: 110px;
				// background:red;
				margin-top: 20px;
				position: relative;
				.con_pic_c{
					width:110px;
					height: 110px;
					// background:red;
					position: absolute;
					top:50%;
					left:50%;
					transform: translate(-50% ,-50%);
					-webkit-transform: translate(-50% ,-50%);
					-moz-transform: translate(-50% ,-50%);
					-ms-transform: translate(-50% ,-50%);
					-o-transform: translate(-50% ,-50%);
					border-radius: 50%;
					img{
						width:100%;
					}
				}
			}
			.con_f{
				display: inline-block;
				width:100%;
				height: 20px;
				line-height: 20px;
				font-size: 14px;
				// &:nth-child(1){
				// 	margin-top: 20px;	
				// }
				// &:nth-child(2){
				// 	margin-top: 15px;
				// }
			}
			button{
				width:100%;
				height:35px;
				line-height: 35px;
				margin-top: 20px;
				font-size: 14px;
				border:1px solid rgb(51,51,51);
				color: rgb(51,51,51);
			}
    	}
    }
    .con_detail{
    	margin-top:20px;
    	padding:30px 30px;
    	background: @background-color;
    	.describe{
    		width:100%;
    		padding:0 20px;
    		.describe_t{
    			background: rgba(241, 241, 241, 1);
    			height: 50px;
    			line-height: 50px;
    			width:100%;
				color:rgb(51,51,51);
				padding-left:20px;
    		}
    		.describe_c{
    			margin-top: 20px;
    			padding-left: 20px;
    		}
    	}
    	.datum{
    		width:100%;
    		padding:0 20px;
    		margin-top: 40px;
    		.datum_t{
    			background: rgba(241, 241, 241, 1);
    			height: 50px;
    			line-height: 50px;
    			width:100%;
				color:rgb(51,51,51);
				padding-left:20px;
    		}
    		.datum_c{
    			margin-top: 20px;
    			padding-left: 20px;
    		}
    		.datum_pic{
    			width:100%;
    			padding-left: 20px;
    			li{
    				width:210px;
    				height:260px;
    				background: red;
    				margin-right: 50px;
    				float:left;
    				margin-top: 10px;
    				img{
    					width:100%;
    					height: 100%;
    				}
    			}
    		}
    		.clearfix:after{
			  content: "020"; 
			  display: block; 
			  height: 0; 
			  clear: both; 
			  visibility: hidden;  
			  }

			.clearfix {
			  zoom: 1; 
			  }
    	}
    	.clause{
    		width:100%;
    		padding:0 20px;
    		margin-top:40px;
			.clause_t{
				background: rgba(241, 241, 241, 1);
    			height: 50px;
    			line-height: 50px;
    			width:100%;
				color:rgb(51,51,51);
				padding-left:20px;
				span{
					margin-left: 50px;
					color:red;
					font-size: 14px;
				}
			}
			.clause_c{
    			margin-top: 20px;
    			padding-left: 20px;
    		}
    	}
    }
}
</style>

