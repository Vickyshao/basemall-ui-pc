<template>
	<div class='uploadFile'>
		<div class="order_num"><b>订单号:</b>&nbsp;<span>D123456789012</span></div>
		<div class="order_file">
			 <el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="合同协议" name="1"></el-tab-pane>
			    <el-tab-pane label="发票票据" name="2"></el-tab-pane>
			    <el-tab-pane label="交割凭证" name="3"></el-tab-pane>
			    <el-tab-pane label="付款凭证" name="4"></el-tab-pane>
			  </el-tabs>
			  <div class="order_pic">
				 <div class="pic_title">
					<span><b>供方合同</b>({{data_list.length}})</span>
					<el-button type="primary" size="small" style="float: right;margin-right: 24px" @click="upload">上传合同</el-button>
				 </div>
				 <div class="order_p">
					<ul class='clearfix' id="order_ul">
						<li v-for="item in data_list">
							<span class="order_top">合 同</span>
							<div class="orderPic_cont">
								<span>合同第{{item}}页</span>
								<img src="../../../../static/img/banner.jpg" alt="">
							</div>
							<div class="orderPic_hander"><span class='del'>删除</span><span class="editor">编辑</span></div>
						</li>
					</ul>
				 </div>
				 <div class="arrow arrow_left" @click="arrowLeft(1)"></div>
				 <div class="arrow arrow_right" @click="arrowRight(1)"></div>
			  </div>
			  <div class="order_pic">
				 <div class="pic_title">
					<span><b>需方合同</b>({{data_list.length}})</span>
				 </div>
				 <div class="order_p">
					<ul class='clearfix' id="order_ul_c">
						<li v-for="item in data_list">
							<span class="order_top">合 同</span>
							<div class="orderPic_cont">
								<span>合同第{{item}}页</span>
								<img src="../../../../static/img/banner.jpg" alt="">
							</div>
							<div class="orderPic_hander"><span class='del'>删除</span><span class="editor">编辑</span></div>
						</li>
					</ul>
				 </div>
				 <div class="arrow arrow_left" @click="arrowLeft(2)"></div>
				 <div class="arrow arrow_right" @click="arrowRight(2)"></div>
			  </div>
		</div>
		<el-dialog
		  title=""
		  :visible.sync="centerDialogVisible"
		  width="500px"
		  center>
		  <div class="upload_btn clearfix">
			  <span>点击上传附件</span>
			  <el-upload
				  style="margin-top: 20px"
				  ref="upload"
				  action=""
				  :on-preview="handlePreview"
				  :on-remove="handleRemove"
				  :file-list="fileList"
				  :auto-upload="false">
				  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				  <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-show="false"></el-button> -->
			  </el-upload>
			  <div class="file_name">
				<span>附件名称</span>
				<input type="text">
			  </div>
			  <span>附件简介</span>
			  <el-input
				  type="textarea"
				  :rows="3"
				  placeholder="请输入内容"
				  style="margin-top: 20px;width:290px"
				 >
			  </el-input>
			  <el-button type="primary" @click="submitUpload" size='small' class="btn" style="width:100px">上 传</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		name:'file',
		data(){
			return{
				activeName:'1',
				data_list:[1,2,3,4,5,6],
				centerDialogVisible:false,
				fileList:[],
				form:{
					name:''
				}
			}
		},
		methods:{
			handleClick(tab,event){
				
			},
			arrowRight(num){
				let dom = ''
				if(num==1){
					dom = $('#order_ul')
				}else{
					dom = $('#order_ul_c')
				}

				let left = dom.css('left')
				let left_x = parseFloat(left)-272
				
				if(left_x < -272*(this.data_list.length-3)){
					
					left_x = -272*(this.data_list.length-3)
					return
				}

				dom.css('left',left_x+'px')
			},
			arrowLeft(num){

				let dom = ''
				if(num==1){
					dom = $('#order_ul')
				}else{
					dom = $('#order_ul_c')
				}

				let left = dom.css('left')
				let left_x = parseFloat(left) + 272
				if(left_x > 0){
					left_x = 0;
					return
				}
				dom.css('left',left_x+'px')
			},
			upload(){
				this.centerDialogVisible = true
			},
			upload_file(){

			},
			submitUpload() {
		        this.$refs.upload.submit();
		    },
		    handleRemove(file, fileList) {
		        console.log(file, fileList);
		    },
		    handlePreview(file) {
		        console.log(file);
		    }
		}
	}
</script>
<style scoped lang="less">
	.uploadFile{
		div,ul,li,span,img{
			box-sizing: border-box;
		}
		.order_num{
			font-size: 18px;
		}
		.order_file{
			font-size: 14px;
			margin-top:25px;
			margin-left:20px;
			position:relative;
			.order_pic{
				margin-top:20px;
				padding-right:30px;
				position:relative;
				.pic_title{
					font-size: 16px;
					width:100%;
					height: 25px;
					line-height: 25px;
				}
				.order_p{
					width:100%;
					height:430px;
					margin-top:20px;
					overflow: hidden;
					position:relative;
					ul{
						height:430px;
						width:500%;
						position:absolute;
						top:0;
						left:0;
						transition: all 1s;
						li{
							height:100%;
							float: left;
							width:250px;
							// background:red;
							margin-left: 22px;
							border:2px solid #f1f1f1;
							border-radius: 5px;
							&:nth-child(1){
								margin-left: 0px;
							}
							.order_top{
								display:inline-block;
								width:100%;
								height: 50px;
								border-bottom:2px solid #f1f1f1;
								background: #f5f8fb;
								line-height: 50px;
								padding-left:20px;
								font-size: 16px;
								font-weight: 700;
							}
							.orderPic_cont{
								padding:15px 15px 0 15px;

								img{
									width: 100%;
									margin-top:20px;
									height:280px;
									border:2px solid #ccc;
								}
							}
							.orderPic_hander{
								width:100%;
								height: 25px;
								line-height: 25px;
								font-size: 14px;
								padding-right: 15px;
								margin-top:5px;
								span{
									float: right;
									display:inline-block;									
									height:20px;
									line-height: 20px;
									width:60px;
									cursor: pointer;
								}
								.editor{
									padding-left:15px;
									border-right: 1px solid #ccc;
								}
								.del{
									padding-left:15px;
									color:red;
								}
							}
						}
					}
				}
				.arrow{
					width:20px;
					height: 40px;
					// background:red;
					position:absolute;
					top:60%;
					transform:translateY(-50%);
					-webkit-transform:translateY(-50%);
					-o-transform:translateY(-50%);
					-ms-transform:translateY(-50%);
					-moz-transform:translateY(-50%);
					cursor: pointer;
				}
				.arrow_left{
					
					left:-23px;
					
					background:url('../../../../static/img/user/left.png') no-repeat;
				}
				.arrow_right{
					right:22px;
					background:url('../../../../static/img/user/right.png') no-repeat;
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
		.upload_btn{
			width:100%;
			padding-left:70px;
			padding-right:70px;
			.btn{
				margin-top:20px;
				float: right;
			}
			.file_name{
				width:100%;
				height:50px;
				margin-top:20px;
				input{
					border:1px solid #ccc;
					height:30px;
					width:200px;
					margin-left:20px;
					border-radius: 5px;
					padding-left: 5px;
				}
			}
		}
	}
</style>