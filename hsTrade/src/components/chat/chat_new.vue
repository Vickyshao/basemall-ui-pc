<template>
	<div class="chat">
		<div class='chat_left'>
			<div class="chat_top">
				<div class="chat_top_p">
					<img src="./images/defaut_h.jpg" alt="">
				</div>
				<div class="chat_top_c">{{my_account}}</div>
			</div>
			<ul class="chat_tab" v-if="false">
				<li @click="check_tab(1)">
					<span class="icon icon-session" :class="{active1:tab==1}"></span>
					<b class="msg_num" v-if="unread_num!=0">{{unread_num}}</b>
				</li>
				<li @click="check_tab(2)"> <span class="icon icon-friend" :class="{active2:tab==2}"></span></li>
				<li @click="check_tab(3)"> <span class="icon icon-team" :class="{active3:tab==3}"></span></li>
			</ul>
			<div v-if="tab == 0" class="list_friend">
				<ul>
					<li v-if="msg_data.length==0" style="text-align: center;width:100%;display: inline-block;background:transparent;">暂无消息</li>
					<li v-for='v in	msg_data' @click="ask(v.from)">
						<div class="chat_tops">
							<span>{{v.from}}</span>
							<span>{{v.time|formatTime("YMDHMS")}}</span>
						</div>
						<div class="chat_bottom">
							{{v.text}}
							<b class="msg_ty" v-if="v.unread != 0 && v.from != account_friend">{{v.unread}}</b>
						</div>
					</li>
				</ul>
			</div>
			<div v-if="tab==1" class="list_friend">
				<ul>
					<li v-for="v in friends_list" @click="ask(v.account)" :class="{active:v.account == account_friend}">
						<span class="incons_friend"><img src="./images/default_pic.jpg" alt=""></span>
						<span class="fiend_count">{{v.account}}</span>
						<b class="msg_ty_f" v-if="every_unread[v.account]!=0 && every_unread[v.account] && v.account != account_friend">{{every_unread[v.account]}}</b>
						<b class="msg_ty_tag" v-if="v.account==account_friend"></b>
					</li>
				</ul>
			</div>
			<div v-if="tab==0" class="list_friend">
				暂时还没有群哟
			</div>
		</div>
		<div class="chat_right" v-show='true'>
			<div class="cont_top">
				<span class="incons_friend"><img src="./images/default_pic.jpg" alt=""></span>
				<span class="incons_account">{{account_friend}}</span>
			</div>
			<div class="cont_center" id="cont_center">
				<span @click="showMoreMsg" class="show_more_msg" v-if="show_more_msg">点击加载更多消息</span>
				<em class="no_msg" v-if="message.length == 0 && !show_more_msg">暂无消息</em>
				<ul>
					<li v-for = "v in message" :class="{f_r:v.tag != 'other',f_l:v.tag == 'other'}">

						<span class="incons_friend" :class='{other_h:v.tag=="other",self_h:v.tag != "other",f_r:v.tag != "other"}'>
							<img src="./images/defaut_h.jpg" alt=""  v-if="v.tag != 'other'">
							<img src="./images/default_pic.jpg" alt="" v-if="v.tag == 'other'">
						</span>
						<span class="mag_cont_f" :class="{other_c:v.tag=='other',self_c:v.tag != 'other',f_r:v.tag != 'other'}">{{v.text}}</span>
						<!-- <em>18111111111</em> -->
					</li>
				</ul>

			</div>
			<div class="cont_foot">
				<div class="div_input">
					<span class="emoji">
						<div class='emoji_list' v-if="false">
							<ul class='clearfix'>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
								<li></li>
							</ul>
						</div>
					</span>
					<input type="text" v-model="MsgText" @keyup.enter="sendMsg">
					<button @click="sendMsg">发送</button>
				</div>
			</div>
		</div>
		<div class="goods_list" v-if="account_friend==this.$route.query.to">
			<goods :accountFriend="account_friend" @sendlink="sendlink"></goods>
		</div>
	</div>
</template>
<script>
	import goodsDetail from './doodsDetail_new.vue'
	export default{
		name:'newchat',
		components:{
			goods:goodsDetail
		},
		data(){
			return{
				tab:1,
				msg_data:[],
				friends_list:[],
				account_friend:'',
				MsgText:"",
				getMsg:null,
				message:[],
				show_right:false,
				my_account:'',
				unread_num:0,
				every_unread:{},
				history_msg:[],
				history_index:0,
				show_more_msg:true
			}
		},
		methods:{
			ask(acc){
				this.show_more_msg = true
				this.history_index = this.every_unread[acc]
				if(acc != this.account_friend){
					this.message = []
					this.getHistoryMsg(acc)
				}
				this.account_friend = acc
				this.show_right = true

				nim.resetSessionUnread('p2p-'+ acc)
				if(this.tab ==1){
					//在第一个tab页
					this.getMsgList()
				}
			},
			check_tab(id){
				this.tab = id
				if(id==1){
					this.getMsgList()
				}
				if(id==2){
					this.getFriend()
				}
			},
			getHistoryMsg(account){
				nim.getLocalMsgs({
	              sessionId: 'p2p-'+account,
	              limit: 100,
	              asc:true,
	              done: this.getLocalMsgsDone
	            })
			},
			getLocalMsgsDone(error, msg){
				this.history_msg=[]
              	msg.msgs.forEach(v=>{
              		let obj = {
                	text:v.text,
                	tag:v.from==this.account_friend?'other':'mine'
                }
                this.history_msg.unshift(obj)

              	})
              	console.log(this.history_index)
              	if(this.history_index != 0){
              		console.log(this.history_msg)
              		console.log(this.history_msg[-this.history_index])
              		this.message = this.history_msg.splice(-this.history_index)
              	}
              	
			},
			getMsgList(){
				this.msg_data = []
				//获取消息列表
				nim.getLocalSessions({
		            limit: 100,
		            done: this.getLocalSessionsDone
		        });
			},
			getLocalSessionsDone(error, obj){
				this.unread_num = 0
				//console.log('获取消息列表成功',obj,error)
	            if(!error){
	                let sessions = obj.sessions
	                if(!this.account_friend && sessions[0]){
	                	this.account_friend = sessions[0].to
	                	this.getHistoryMsg(this.account_friend)
	                }
	                sessions.forEach(v=>{
	                    // console.log(v)	          
	                    if(v.lastMsg){
	                    	let obj = {}
		                    obj.from = v.to
		                    obj.time = v.updateTime
		                    obj.unread = v.unread
		                    obj.text = v.lastMsg.text
		                    this.msg_data.push(obj)
		                    this.every_unread[v.to] = v.unread
		                    if(v.to == this.account_friend){
		                    	this.every_unread[v.to] = 0
		                    }
		                    if(v.to != this.account_friend){
		                    	this.unread_num = this.unread_num + v.unread
		                    }
	                    }
	                })

	                //console.log('这是标记每个人以度数量',this.every_unread)
	            }
	        },
	        getFriend(){
	        	window.nim.getFriends({
	                done: this.getFriendsDone
	            });
	        },
	        getFriendsDone(error, friends){
	        	let isFriend = false
	        	if(!error){
	        		//console.log('friend',friends)
	        		this.friends_list = friends
	        		for(let i = 0; i < friends.length; i++){
	        			if(friends[i].account == this.account_friend){
	        				isFriend = true
	        			}
	        		}
	        		if(!isFriend){
	        			//添加好友
	        			nim.addFriend({
	                        account: this.account_friend,
	                        done: this.addFriendDone
	                    });
	        		}
	        	}
	        },
	        sendMsg(){
	        	let options = {
                    scene: 'p2p',
                    to: this.account_friend,
                    from: this.$store.state.userData.username,
                    text: this.MsgText,
                    done: this.handlerMsg,
                    isHistoryable: true
                };
                window.nim.sendText(options);
	        	this.MsgText = ''
	        },
	        handlerMsg(err,msg){
	        	let obj = {
                	text:msg.text,
                	tag:'mine'
                }
                this.message.push(obj)
	        },
	        addFriendDone(error, obj){
	        	console.log('直接加为好友' + (!error?'成功':'失败'), error, obj)
	        	if(!error){
	        		this.getFriend()
	        	}
	        },
	        scroll(){
	        	//让滚动条出现在底部
				$('#cont_center').scrollTop( $('#cont_center')[0].scrollHeight );
	        },
	        getAllPic(){
	        	//获取文件夹内所有图片
	        	let url = './images/emoji/'
	        	let hdfiles = ''
				let objFSO =new ActiveXObject('Scripting.FileSystemObject');
				var objFolder = objFSO.GetFolder(tbsource)
				var colFiles = new Enumerator(objFolder.Files);
				for (; !colFiles.atEnd(); colFiles.moveNext()) {
					 
				    var objFile = colFiles.item();
				     
				    if(re_inf1.test(objFile.Name.toLowerCase()))
				     
				    {
				     
				    hdfiles = hdfiles+"<img src='./images/emoji/"+objFile.Name+"'>";
				     
				    }
					 
				}

				console.log(hdfiles)

	        },
	        sendlink(){
	        	console.log('点击了发送链接按钮')
	        	let options = {
                    scene: 'p2p',
                    to: this.account_friend,
                    from: this.$store.state.userData.username,
                    text: '这是一个链接',
                    done: this.handlerMsg,
                    isHistoryable: true
                };
                window.nim.sendText(options);
	        	// this.MsgText = ''
	        },
	        showMoreMsg(){
	        	this.show_more_msg = false
	        	this.message = this.history_msg.concat(this.message)
	        }
		},
		created(){
			window.nim = window.opener.nim
			this.my_account = nim.account
			this.getMsgList()
			if(this.$route.query.to){
				this.account_friend = this.$route.query.to
				this.getHistoryMsg(this.$route.query.to)
			}
			this.getMsg = window.opener.dataMsg
			//获取好友
			this.getFriend()
			// this.getAllPic()
		},
		watch:{
			getMsg:{
                handler(newVal, oldVal){
                    console.log(555,newVal)
                    if(newVal.val){
                        // console.log(121212121,newVal.val)
                        //更新会话列表
                        //收到消息
                        if(oldVal){
                        	this.getMsgList()
                        }
                        this.getFriend()
                        let obj = {
                        	text:newVal.val.lastMsg.text,
                        	tag:'other'
                        }
                        //判断是不是当前打开的会话对象
                        //如果有消息来了，且对话框是当前对话框，则标记消息为已读
                        if(newVal.val.lastMsg.from == this.account_friend){
                        	// nim.resetSessionUnread('p2p-'+ this.account_friend)
                        	this.message.push(obj)
                        }
                        
                        
                    }
                },
                deep: true
            },
            message:{
            	handler(newVal,oldVal){
            		let that = this
            		// console.log('我在这里打印的')
            		setTimeout(function(){
            			that.scroll()
            			nim.resetSessionUnread('p2p-'+ that.account_friend)
            		},100)
            	},
            	deep:true
            },
            every_unread:{
            	handler(newVal,oldVal){
            		console.log(oldVal[this.account_friend])
            		// this.history_index = oldVal[this.account_friend]
            	},
            	deep:true
            }
		}
	}
</script>
<style lang="scss" scoped>
.chat{
	height: 700px;
	width:1300px;
	margin:20px auto;
	margin-top:100px;
	div,ul,li,span,input,button{
		box-sizing:border-box;
	}
	.chat_left{
		background: #fff;
		border:1px solid #ccc;
		width:300px;
		height: 600px;
		border-top-left-radius:5px;
		border-bottom-left-radius:5px;
		overflow: hidden;
		display:inline-block;
		float:left;
		.chat_top{
			width:100%;
			height:100px;
			background:#e5f4ff;
			padding-top:30px;
			padding-left:20px;
			.chat_top_p{
				width:50px;
				height:50px;
				border:1px solid #ccc;
				float:left;
				img{
					width:100%;
					height:100%;
				}
			}
			.chat_top_c{
				height:50px;
				line-height:50px;
				float:left;
				font-size:16px;
				padding-left:20px;
			}
		}
		.chat_tab{
			width: 100%;
			height: 40px;
			border-bottom:1px solid #ccc;
			li{
				width: 33%;
				height:100%;
				float:left;
				text-align:center;
				line-height:40px;
				cursor:pointer;
				&:nth-child(1){
					position:relative;
					background-position:-35px 0px
				}
				&:nth-child(2){
					background-position:-35px -25px
				}
				&:nth-child(3){
					background-position:-35px 50px
				}
			}
			.active1{
				background-image:url('./images/m_b.png')
			}
			.active2{
				background-image:url('./images/p_h_b.png')
			}
			.active3{
				background-image:url('./images/q_b.png')
			}
			.msg_num{
				position:absolute;
				top:11px;
				right:0;
				width:30px;
				height:18px;
				background:red;
				line-height:18px;
				border-radius:8px;
				color:#fff;
			}
		}
		.list_friend{
			width:100%;
			height:460px;
			overflow:auto;
			li{
				width:100%;
				height:60px;
				margin:2px 0;
				// border-bottom:1px solid #ccc;
				background: #f5f5f5;
				cursor:pointer;
				padding:5px;
				font-size:14px;
				.chat_tops{
					height:50%;
					span{
						&:nth-child(1){
							float:left;
						}
						&:nth-child(2){
							float:right;
						}
					}
				}
				.msg_ty_f{
					display:inline-block;
					float:right;
					background:red;
					width:30px;
					height:18px;
					line-height:18px;
					margin-top:10px;
					text-align:center;
					color:#fff;
					border-radius:10px;
				}
				.msg_ty_tag{
					display:inline-block;
					float:right;
					background:#67c23a;
					width:16px;
					height:16px;
					margin-top:14px;
					border-radius:10px;
				}
				.chat_bottom{
					color:#8899a7;
					width:100%;
					position:relative;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					.msg_ty{
						position:absolute;
						right:10px;
						top:0;
						background:red;
						width:30px;
						height:18px;
						line-height:18px;
						text-align:center;
						color:#fff;
						border-radius:10px;
					}
				}
				.incons_friend{
					display:inline-block;
					width: 40px;
				    height: 40px;
				    border-radius: 50%;
				    vertical-align: top;
				    background-size:100% 100%;
				    img{
				    	width:100%;
				    	height:100%;
				    }
				}
				.fiend_count{
					height:40px;
					line-height:40px;
					display:inline-block;
					margin-left:20px;					
				}
			}
			.active{
				background:#e4e7ed;
				font-weight:900;
			}
		}
	}
	.chat_right{
		display:inline-block;
		background: #fff;
		border:1px solid #ccc;
		width:640px;
		height: 600px;
		float:left;
		// border-radius:5px;
		overflow: hidden;
		// margin-left:30px;
		// float:right;
		.cont_top{
			width:100%;
			height:70px;
			border-bottom:1px solid #ccc;
			padding-top:10px;
			padding-left:20px;
		}
		.cont_foot{
			width:100%;
			height: 80px;
			background: #e5f4ff;
			padding-top:20px;
			.div_input{
				height:35px;
				width:100%;
				// background:red;
				// margin-left:40px;
				padding-left:40px;
				input{
					height:100%;
					background:#fff;
					border-radius:10px;
					width:350px;
					border:1px solid #ccc;
					font-size:14px;
					padding-left:5px;
					float:left;
				}
				button{
					width:100px;
					text-align:center;
					line-height:35px;
					height:35px;
					border-radius:5px;
					margin-left:30px;
					float:left;
				}
				.emoji{
					display:inline-block;
					width:25px;
					height:25px;
					margin-top:5px;
					// background:url('./images/emo.png') no-repeat;
					float:left;
					margin-right:20px;
					border-radius:50%;
					position:relative;
					.emoji_list{
						position:absolute;
						right:-300px;
						top:-200px;
						width:302px;
						height:200px;
						background:#fff;
						z-index:10;
						overflow:auto;
						border:1px solid #ccc;
						ul{
							width:300px;
							// border-left:1px solid red;
							// border-top:1px solid red;
							box-sizing:content-box;
							li{
								width:30px;
								height:30px;
								float:left;
								border-bottom:1px solid #ccc;
								border-right:1px solid #ccc;
							}
						}
					}
				}
			}
		}
		.cont_center{
			width:100%;
			height:450px;
			overflow:auto;
			padding-top:20px;
			position:relative;
			.show_more_msg{
				position:absolute;
				top:0;
				left:50%;
				transform:translateX(-50%);
				-webkit-transform:translateX(-50%);
				-o-transform:translateX(-50%);
				-ms-transform:translateX(-50%);
				-moz-transform:translateX(-50%);
				font-size:14px;
				cursor:pointer;
			}
			// em{
			// 	position:absolute;
			// 	right:65px;
			// 	top:-14px;
			// 	color:#ccc;
			// }
			.no_msg{
				position:absolute;
				display:inline-block;
				height:20px;
				width:100px;
				line-height:20px;
				font-size:14px;
				text-align:center;
				top:5px;
				left:50%;
				transform:translateX(-50%);
				-webkit-transform:translateX(-50%);
				-moz-transform:translateX(-50%);
				-ms-transform:translateX(-50%);
				-o-transform:translateX(-50%);
			}
			ul{
				width:100%;
				li{
					width:100%;
					min-height:50px;
					padding-top:5px;
					position:relative;
					// margin-top:25px;
				}
			}
			.incons_friend{
				width:40px;
				height:40px;
			}
			.mag_cont_f{
				max-width:80%;
				font-size:14px;
				line-height:40px;
				margin-left:15px;
				min-height:40px;
				display:inline-block;
				border-radius:10px;
				padding:0 10px;
				word-break: break-all;
			}
		}

		.incons_friend{
			display:inline-block;
			width: 50px;
		    height: 50px;
		    border-radius: 50%;
		    vertical-align: top;
		    // background:url('images/default-icon.png');
		    background-size:100% 100%;
		    img{
		    	width:100%;
		    	height:100%;
		    }
		}
		.incons_account{
			height:50px;
			display:inline-block;
			line-height:50px;
			margin-left:10px;
			font-size:14px;
		}
	}
	.goods_list{
		background:#fff;
		border:1px solid #ccc;
		width:300px;
		height: 600px;
		border-top-right-radius:5px;
		border-bottom-right-radius:5px;
		// overflow: auto;
		display:inline-block;
		float:left;
	}
}
.f_l{
	float:left;
}
.f_r{
	float:right;
}
.self_c{
	margin-right:10px;
	background:#5cacde;
}
.other_c{
	background:#e5f4ff;
}
.self_h{
	margin-right:10px;
}
.other_h{
	margin-left:10px;
}

.icon-session {
  background-image:url('./images/m_d.png')
}
.icon-friend {
    background-image:url('./images/p_h_d.png')
}
.icon-team {
   background-image:url('./images/q_d.png')
}

.icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    vertical-align: middle;
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
</style>