<template>
    <div>
        <div class="IM">
            <div class="bad-network hide tc radius5px" id="errorNetwork">已与服务器断开，请检查网络连接</div>
            <div class="wrapper box-sizing">
                <div class="content">
                    <div class="left-panel radius5px" id="left-panel">
                        <div class="hide loading" id="loading"></div>
                        <div class="title">
                            <img src="" alt="" width="56" height="56" class="radius-circle avatar" id="userPic" />
                            <span id="userName">&nbsp;</span>
                            <span>
                                <img src="./images/pen.png" class="u-modify" id="showMyInfo">
                            </span>
                            <span class="exit" title="退出" id="logout">退出</span>
                        </div>
                        <div class="m-devices hide">正在使用云信web版</div>
                        <div class="panel" id="switchPanel">
                            <a class="box-sizing tc m-unread panel_tab cur" data-type="sessions" @click="switchPanel(ev)">
                                <span class="icon icon-session"></span>
                                <b class="u-unread hide"> </b>
                            </a>
                            <a class="box-sizing tc panel_tab" data-type="friends" @click="switchPanel(ev)">
                                <span class="icon icon-friend"></span>
                            </a>
                            <a class="box-sizing tc panel_tab" data-type="teams" @click="switchPanel(ev)">
                                <span class="icon icon-team"></span>
                            </a>
                        </div>
                        <div class="item" id="sessionsWrap" data-type="sessions">
                            <!-- 最近联系人 -->
                            <div class="list">
                                <div class="m-panel">
                                    <div class="panel_item m-sysMsg" id="showNotice">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/notice.png" alt="消息中心" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">消息中心</p>
                                        </div>
                                        <b class="count j-sysMsgCount hide"></b>
                                    </div>
                                </div>
                                <div id="sessions">
                                    <p>正在获取最近联系人...</p>
                                </div>
                            </div>
                        </div>
                        <div class="item hide" id="friendsWrap" data-type="friends">
                            <!-- 通讯录 -->
                            <div class="list">
                                <div class="m-panel">
                                    <div class="panel_item" id="addFriend">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/addFriend.png" alt="添加好友" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">添加好友</p>
                                        </div>
                                    </div>
                                    <div class="panel_item" id="showBlacklist">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/black.png" alt="黑名单" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">黑名单</p>
                                        </div>
                                    </div>
                                    <div class="panel_item" id="myPhone">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/myPhone.png" alt="我的手机" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">我的手机</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="friends">
                                    <p>正在获取通讯录...</p>
                                </div>
                            </div>
                        </div>
                        <div class="item hide" id="teamsWrap" data-type="teams">
                            <!-- 群 -->
                            <div class="list">
                                <div class="m-panel">
                                    <div class="panel_item" id="createTeam">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/addTeam.png" alt="创建讨论组" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">创建讨论组</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="m-panel">
                                    <div class="panel_item" id="createAdvanceTeam">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/addTeam.png" alt="创建高级群" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">创建高级群</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="m-panel">
                                    <div class="panel_item" id="searchAdvanceTeam">
                                        <div class="panel_avatar">
                                            <img class="panel_image" src="./images/searchTeam.png" alt="搜索高级群" />
                                        </div>
                                        <div class="panel_text">
                                            <p class="panel_single-row">搜索高级群</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="teams m-panel" id="teams">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chatVernier" id="chatVernier">
                        <span class="radius-circle hide"></span>
                    </div>
                    <div class="right-panel hide radius5px" id="rightPanel">
                        <!-- 聊天面板 -->
                        <div class="chat-box show-netcall-box" id="chatBox">
                            <div class="title" id="chatTitle">
                                <img src="" width="56" height="56" class="radius-circle img" id="headImg" />
                                <span id="nickName"></span>
                                <div class="cloudMsg tc radius4px" data-record-id="" id="cloudMsg">
                                    <i class="icon icon-team-info"></i>
                                    <p>云记录</p>
                                </div>
                                <div class="team-info hide tc radius4px" data-team-id="" id="teamInfo">
                                    <i class="icon icon-team-info"></i>
                                    <p>资料</p>
                                </div>
                            </div>
                            <div class="netcall-box" id="netcallBox">
                                <div class="netcall-mask hide">
                                    <div class="netcallTip"></div>
                                </div>
                                <div class="top hide">
                                    <span class="transferAudioAndVideo switchToAudio" id="switchToAudio">切换音频</span>
                                    <span class="transferAudioAndVideo switchToVideo" id="switchToVideo">切换视频</span>
                                    <span class="fullScreenIcon toggleFullScreenButton" id="toggleFullScreenButton" title="切换全屏">&nbsp;</span>
                                </div>
                                <!-- p2p呼叫界面 -->
                                <div class="netcall-calling-box hide">
                                    <img alt="用户头像" class="avatar">
                                    <div class="nick"></div>
                                    <div class="tip">等待对方接听...</div>
                                    <div class="op">
                                        <button id="callingHangupButton" class="netcall-button red">挂断</button>
                                    </div>
                                </div>
                                <!-- p2p视频界面 -->
                                <div class="netcall-show-video hide">
                                    <div class="netcall-video-left">
                                        <div class="netcall-video-remote bigView">
                                            <div class="message"></div>
                                            <span class="switchViewPositionButton"></span>
                                        </div>
                                    </div>
                                    <div class="netcall-video-right">
                                        <div class="netcall-video-local smallView">
                                            <div class="message"></div>
                                            <span class="switchViewPositionButton"></span>
                                        </div>
                                        <div class="operation">
                                            <div class="control">
                                                <div class="microphone control-item">
                                                    <div class="slider hide">
                                                        <div class="txt">10</div>
                                                        <input class="microSliderInput" id="microSliderInput1" type="range" min="0" max="10" step="1" value="10" data-orientation="vertical">
                                                    </div>
                                                    <span class="icon-micro"></span>
                                                </div>
                                                <div class="volume control-item">
                                                    <div class="slider hide">
                                                        <div class="txt">10</div>
                                                        <input class="volumeSliderInput" id="volumeSliderInput1" type="range" min="0" max="10" step="1" value="10" data-orientation="vertical">
                                                    </div>
                                                    <span class="icon-volume"></span>
                                                </div>
                                                <div class="camera control-item">
                                                    <span class="icon-camera"></span>
                                                </div>
                                            </div>
                                            <div class="op">
                                                <button class="hangupButton netcall-button red">挂断</button>
                                            </div>
                                            <div class="tip">00 : 00</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- p2p音频界面 -->
                                <div class="netcall-show-audio hide">
                                    <img alt="用户头像" class="avatar">
                                    <div class="nick">test</div>
                                    <div class="tip">00 : 00</div>
                                    <div class="control">
                                        <div class="microphone control-item ">
                                            <div class="slider hide">
                                                <div class="txt">10</div>
                                                <input class="microSliderInput" id="microSliderInput" type="range" min="0" max="10" step="1" value="10" data-orientation="vertical">
                                            </div>
                                            <span class="icon-micro"></span>
                                        </div>
                                        <div class="volume control-item">
                                            <div class="slider hide">
                                                <div class="txt">10</div>
                                                <input class="volumeSliderInput" id="volumeSliderInput" type="range" min="0" max="10" step="1" value="10" data-orientation="vertical">
                                            </div>
                                            <span class="icon-volume"></span>
                                        </div>
                                    </div>
                                    <div class="op">
                                        <button class="hangupButton netcall-button red">挂断</button>
                                    </div>

                                </div>
                                <!-- 多人音视频互动界面 -->
                                <div class="netcall-meeting-box hide" id="netcallMeetingBox"></div>
                                <!-- 被叫界面 -->
                                <div class="netcall-becalling-box hide">
                                    <img alt="用户头像" class="avatar">
                                    <div class="nick"></div>
                                    <p id="becallingText" class="tip"></p>
                                    <div class="op">
                                        <div class="normal">
                                            <div class="checking-tip">检查插件中...
                                                <span class="netcall-icon-checking"></span>
                                            </div>
                                            <button class="netcall-button blue beCallingAcceptButton" id="beCallingAcceptButton">
                                                <span class="txt">接听</span>
                                                <span class="netcall-icon-checking"></span>
                                            </button>
                                            <button class="netcall-button red beCallingRejectButton" id="beCallingRejectButton">
                                                拒绝
                                            </button>
                                        </div>
                                        <div class="exception">
                                            <button class="netcall-button blue" id="downloadAgentButton">下载音视频插件</button>
                                            <br/>
                                            <button class="netcall-button red beCallingRejectButton">拒绝</button>
                                            <div class="exception-tip">拒绝调用插件申请会导致无法唤起插件,需重启浏览器</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="dialogs hide">
                                </div>
                            </div>
                            <div id="whiteboard"></div>
                            <div class="chat-content box-sizing" id="chatContent">
                                <!-- 聊天记录 -->
                            </div>
                            <div class="u-chat-notice">您已退出</div>
                            <div class="chat-mask"></div>
                            <div class="chat-editor box-sizing" id="chatEditor" data-disabled="1">
                                <div id="emojiTag" class="m-emojiTag"></div>
                                <a class="chat-btn u-emoji" id="showEmoji"></a>
                                <span class="chat-btn msg-type" id="chooseFileBtn">
                                    <a class="icon icon-file" data-type="file"></a>
                                </span>
                                <a class="chat-btn u-netcall-audio-link" id="showNetcallAudioLink">&nbsp;</a>
                                <a class="chat-btn u-netcall-video-link" id="showNetcallVideoLink">&nbsp;</a>
                                <!-- 在netcall_ui.js的fn.whenOpenChatBox中隐藏 -->
                                <a class="chat-btn u-whiteboard" id="showWhiteboard">&nbsp;</a>
                                <textarea id="messageText" class="chat-btn msg-input box-sizing radius5px p2p" rows="1" autofocus="autofocus" maxlength="500"></textarea>
                                <span class="chat-context" id="showTeamMsgReceipt">
                                    <label for="needTeamMsgReceipt">
                                    <input id="needTeamMsgReceipt" type="checkbox" name="needTeamMsgReceipt" />回执</label>
                                </span>
                                <a class="btn-send radius5px" id="sendBtn">发送</a>
                                <form action="#" id="uploadForm">
                                    <input multiple="multiple" type="file" name="file" id="uploadFile" class="hide" />
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="right-panel hide radius5px devices-container" id="devices">
                        <!-- 设备管理面板 -->
                        <div class="info-box">
                            <div class="title tc">
                                <button class="btn back-btn radius5px" id="backBtn2">返回</button>多端登录管理
                            </div>
                            <div class="content">
                                <div class="main">
                                    <div class="pic"></div>
                                    <div class="mobile hide">
                                        <p>云信手机版</p>
                                        <a class="u-kick j-kickMoblie">下线</a>
                                    </div>
                                    <div class="pc hide">
                                        <p>云信PC版</p>
                                        <a class="u-kick j-kickPc">下线</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="asideBox">
                    <div class="m-goWhiteboard hide">
                        <span class="whiteboard-icon-state netcall-icon-state-audio"></span>
                        <div class="nick"></div>
                        <div class="tip"></div>
                    </div>
                    <div class="m-goNetcall hide">
                        <span class="netcall-icon-state netcall-icon-state-audio"></span>
                        <div class="nick">&nbsp;</div>
                        <div class="tip">00 : 00</div>
                    </div>
                    <a href="./chatroom/list.html" target="_blank">
                        <div class="u-goChartRoom"></div>
                    </a>
                </div>
                <!-- 群资料 -->
                <div class="team-info-container hide" id="teamInfoContainer"></div>
                <!-- 云记录 -->
                <div class="cloud-msg-container hide" id="cloudMsgContainer"></div>
                <!-- 群弹框 -->
                <div class="dialog-team-container radius5px hide" id="dialogTeamContainer"></div>
                <!-- 技术方案弹框 -->
                <div class="dialog-team-container radius5px hide" id="dialogCallMethod"></div>
                <!-- 黑名单 -->
                <div class="m-blacklist radius5px hide" id="blacklist">
                    <div class="title box-sizing">
                        黑名单
                        <i class="icon icon-close j-close"></i>
                    </div>
                    <div class="notice">你不会接收到列表中联系人的任何消息</div>
                    <ul class="f-cb list">
                        <li class="items f-cb">
                            <img src="./images/default-icon.png" class="head">
                            <span class="nick">未知</span>
                            <button class="btn radius4px btn-ok j-rm">解除</button>
                        </li>
                    </ul>
                </div>
                <!-- 消息中心 -->
                <div class="m-notice radius5px hide" id="notice">
                    <div class="title box-sizing">
                        消息中心
                        <i class="icon icon-close j-close"></i>
                        <b class="j-rmAllSysNotice rmAll"></b>
                    </div>
                    <ul class="tab f-cb">
                        <li class="crt" data-value="sys">系统通知</li>
                        <li data-value="other">自定义通知</li>
                    </ul>
                    <div class="content j-sysMsg">
                    </div>
                    <div class="content j-customSysMsg hide">
                    </div>
                </div>
                <!-- 搜索高级群 -->
                <div class="m-dialog hide" id="searchTeamBox">
                    <div class="title box-sizing">
                        搜索高级群
                        <i class="icon icon-close j-close"></i>
                    </div>
                    <div class="content tc">
                        <input type="text" class="ipt radius5px box-sizing j-account" placeholder="请输入群id" />
                        <div class="info f-cb">
                            <img src="./images/advanced.png">
                            <div class="desc">
                                <p class="j-name"></p>
                                <p>
                                    <span class="j-teamId"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="btns tc">
                        <button class="btn btn-cancel radius4px cancel j-close">取消</button>
                        <button class="btn btn-ok radius4px search j-search">确定</button>
                        <button class="btn btn-cancel radius4px back j-back">继续搜索</button>
                        <button class="btn btn-ok radius4px add j-add">申请加入</button>
                        <button class="btn btn-ok radius4px chat j-chat">聊天</button>
                    </div>
                </div>
            </div>
            <div class="footer tc">
                <span>&copy;1997 - 2018 网易公司版权所有</span>
            </div>

            <!-- 退出确认框 -->
            <div class="dialog radius5px hide" id="logoutDialog">
                <span class="icon icon-close j-close"></span>
                <div class="content tc">确定要退出云信网页版吗？</div>
                <div class="buttons tc">
                    <button class="btn radius4px btn-cancel j-close">取消</button>
                    <button class="btn radius4px btn-ok j-ok">确定</button>
                </div>
            </div>
            <!-- 添加好友 -->
            <div class="m-dialog hide" id="addFriendBox">
                <div class="title box-sizing">
                    添加好友
                    <i class="icon icon-close j-close"></i>
                </div>
                <div class="content tc">
                    <input type="text" class="ipt radius5px box-sizing j-account" placeholder="请输入帐号" />
                    <div class="info f-cb">
                        <img src="">
                        <div class="desc">
                            <p class="j-nickname"></p>
                            <p>
                                <span class="j-username"></span>
                            </p>
                        </div>
                    </div>
                    <div class="tip">
                    </div>
                </div>
                <div class="btns tc">
                    <button class="btn btn-cancel radius4px cancel j-close">取消</button>
                    <button class="btn btn-ok radius4px search j-search">确定</button>
                    <button class="btn btn-cancel radius4px back j-back">继续搜索</button>
                    <button class="btn btn-ok radius4px add j-add">加为好友</button>
                    <button class="btn btn-ok radius4px done j-close">完成</button>
                    <button class="btn btn-ok radius4px chat j-chat">聊天</button>
                    <button class="btn btn-del radius4px blacklist j-blacklist">移出黑名单</button>
                </div>
            </div>
            <!-- 人物信息 -->
            <div class="m-card hide" id="personCard">
                <i class="icon icon-close j-close"></i>
                <div class="uInfo f-cb">
                    <img class="u-icon" src="">
                    <div class="desc">
                        <p class="j-nick nick">超级大饼</p>
                        <img src="" class="j-gender gender">
                        <p>
                            <span class="j-username">帐号：caojidabin</span>
                        </p>
                        <p>
                            <span class="j-nickname">昵称：caojidabin</span>
                        </p>
                    </div>
                </div>
                <div class="infos">
                    <div class="items alias">
                        <div class="item">备注名</div>
                        <input type="text" class="e-alias ipt" maxlength="16">
                        <a class="j-saveAlias save">保存</a>
                    </div>
                    <div class="items">
                        <div class="item">生日</div>
                        <div class="j-birth">1990-08-18</div>
                    </div>
                    <div class="items">
                        <div class="item">手机</div>
                        <div class="j-tel">18072912974</div>
                    </div>
                    <div class="items">
                        <div class="item">邮箱</div>
                        <div class="j-email">w8@173.com </div>
                    </div>
                    <div class="items">
                        <div class="item">签名</div>
                        <div class="j-sign sign">相信真善美,相信真善美相信真善美相信真善美,相信真善美,相信真善美,相信真善美,相信真善美,相信真善美</div>
                    </div>
                </div>
                <ul>
                    <li class="mutelist">消息提醒
                        <div class="u-switch">
                            <img src="./images/btn_switch.png">
                            <span class="off">off</span>
                            <span class="on">on</span>
                        </div>
                    </li>
                    <li class="blacklist">黑名单
                        <div class="u-switch">
                            <img src="./images/btn_switch.png">
                            <span class="off">off</span>
                            <span class="on">on</span>
                        </div>
                    </li>
                    <li class="mute hide" id="setTeamMute">设置禁言
                        <div class="u-switch">
                            <img src="./images/btn_switch.png">
                            <span class="off">off</span>
                            <span class="on">on</span>
                        </div>
                    </li>
                </ul>
                <div class="btns tc">
                    <button class="btn btn-del radius4px j-del del">删除好友</button>
                    <button class="btn btn-cancel radius4px j-add add">加为好友</button>
                    <button class="btn btn-ok radius4px j-chat chat">聊天</button>
                </div>
            </div>
            <!-- 个人信息 -->
            <div class="m-card m-card-1 hide" id="myInfo">
                <i class="icon icon-close j-close"></i>
                <div class="uInfo f-cb">
                    <img class="u-icon modifyAvatar j-modifyAvatar" src="" alt="更换头像">
                    <div class="desc">
                        <p class="j-nickname nick">超级大饼</p>
                        <img src="" class="j-gender gender">
                        <p>
                            <span class="j-username">帐号：caojidabin</span>
                        </p>
                    </div>
                </div>
                <div class="infos">
                    <div class="operate">
                        <span class="edit j-edit">编辑</span>
                        <span class="save j-save">保存</span>
                        <span class="cancel j-cancel"> 取消</span>
                    </div>
                    <div class="tt">基本信息</div>
                    <div class="showUI">
                        <div class="items">
                            <div class="item">生日</div>
                            <div class="j-birth">1990-08-18</div>
                        </div>
                        <div class="items">
                            <div class="item">手机</div>
                            <div class="j-tel">18072912974</div>
                        </div>
                        <div class="items">
                            <div class="item">邮箱</div>
                            <div class="j-email">w8@173.com </div>
                        </div>
                        <div class="items">
                            <div class="item">签名</div>
                            <div class="j-sign sign">相信真善美,相信真善美相信真善美相信真善美,相信真善美,相信真善美,相信真善美,相信真善美,相信真善美</div>
                        </div>
                    </div>
                    <div class="editUI">
                        <div class="items">
                            <div class="item">昵称</div>
                            <input type="text" class="e-nick ipt" maxlength="10">
                        </div>
                        <div class="items">
                            <div class="item">性别</div>
                            <select class="e-gender slt">
                                <option value="unknown">不显示</option>
                                <option value="male">男</option>
                                <option value="female">女</option>
                            </select>
                        </div>
                        <div class="items">
                            <div class="item">生日</div>
                            <input type="text" class="e-birth ipt" maxlength="20" id="datepicker">
                        </div>
                        <div class="items">
                            <div class="item">手机</div>
                            <input type="text" class="e-tel ipt ipt-1" maxlength="13">
                        </div>
                        <div class="items">
                            <div class="item">邮箱</div>
                            <input type="text" class="e-email ipt ipt-1" maxlength="30">
                        </div>
                        <div class="items">
                            <div class="item">签名</div>
                            <textarea class="e-sign" maxlength="30"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 修改头像 -->
            <div class="m-modifyAvatar hide" id="modifyAvatar">
                <i class="icon icon-close j-close"></i>
                <div class="choseFileCtn">
                    <form action="#" class="j-uploadForm">
                        <input type="file" class="j-upload" style="display: none;">
                    </form>
                    <div class="choseFile j-choseFile"> 选择图片</div>
                </div>
                <div class="tt">头像更换</div>
                <div class="chose" id="cropImg">
                    <img src="" class="hide">
                </div>
                <div class="big">
                    <div class="img">
                        <img src="" class="hide">
                    </div>
                    <p>160*160</p>
                </div>
                <div class="small">
                    <div class="img">
                        <img src="" class="hide">
                    </div>
                    <p>40*40</p>
                </div>
                <div class="btns f-cb">
                    <button class="f-fr btn btn-ok radius4px j-save">保存</button>
                    <button class="f-fr btn btn-cancel radius4p j-reupload">重新选择</button>
                    <button class="f-fr btn btn-cancel radius4p j-close">取消</button>
                </div>
            </div>
            <div id="mask" class="mask hide"></div>
        </div>

        <!-- <div v-if="!isCreateOrder||!isShowGenerated" class="chat-wrapper" > -->
        <div v-if="false" class="chat-wrapper" >
            <div class="chat-container clear">
                <div class="top">
                    <div class="title color-blue">卖方: {{chatData.remoteCorpName}}</div>
                </div>
                <div class="bot">
                    <div class="left">
                        <div class="tops">
                            <!-- <div class="seeMore" @click="seeMore">点击查看更多消息</div> -->
                            <!-- <div v-if="isShowSeeMore&&!!msgDatas&&msgDatas.length>10" class="seeMore" @click="seeMore">点击查看更多消息</div> -->
                            <div class="chat-box chat-box-supply">
                                <ul class="chat-list chat-list-supply">
                                    <li class="chat-item offer" :class="{self:account==v.lastMsg.from,other:account!=v.lastMsg.from}" v-for="(v,i) in msgDatas">
                                    <!-- 222, {{account}},{{v.lastMsg.from}} -->
                                        <p>{{v.lastMsg.text}}</p>
                                       <p style="margin-top: 7px">{{v.updateTime|formatTime("YMDHMS")}}</p>
                                    </li>
                                    <li v-if="!msgDatas||msgDatas.length==0" style="text-align:center">暂无未读消息</li>
                                </ul>
                            </div>
                        </div>
                        <div class="chat-select-option clear">
                            <div class="offer">
                                <div>
                                    <input class="input-width m-l-xs inputMsgs" v-model="msg"  @input="tipCount=''"></input>
                                    <el-button id="sendBtn" class="btn color-blue" type="primary" @click="send" >发送</el-button>
                                    <el-button class="btn createOrder color-orange" type="warning" @click="createOrder" :loading="isInsertOrder" :disabled="detail.status!=2||detail.dataQuantity<=0">下单</el-button>
                                    <em class="tips" v-if="!!tipCount">　　  {{tipCount}}</em>
                                </div>
                                <div>
                                    <!-- <el-button id="sendBtn" class="btn color-blue" type="primary" @click="send" :disabled="detail.status!=2||detail.dataQuantity<=0">发送</el-button> -->
                                </div>
                            </div>
                            <!-- <div class="partners">
                                <span class="fl">目前对方认可的价格及数量为</span>
                                <div class="prices">
                                    <span class="color-red">{{partinerPrice}}<em> 元</em></span>
                                    <span class="color-red">{{partinerNum}}<em> {{detail.unit}}</em></span>
                                </div>
                                <div>是否以此价格下单</div>
                                <div>
                                    <el-button class="btn createOrder color-orange" type="warning" @click="createOrder" :loading="isInsertOrder" :disabled="detail.status!=2||detail.dataQuantity<=0">下单</el-button>
                                </div>
                            </div>  -->
                        </div>
                    </div>
                    <div class="right">
                        <goods-detail :detail="detail" :params-detail="paramsDetail"></goods-detail>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isCreateOrder&&isShowGenerated">
            <order-generated :order-data="orderData"></order-generated>
        </div>
    </div>
</template>

<script>
    // require('../chat/js/main.js')
    // import nim from './js/init.js'
    require('../chat/js/emoji.js')
    require('../chat/js/util.js')
    require('../chat/js/cache.js')
    require('../chat/js/link.js')
    require('../chat/js/ui.js')
    require('../chat/js/widget/uiKit.js')
    require('../chat/js/widget/minAlert.js')
    require('../chat/js/module/base.js')
    require('../chat/js/module/message.js')
    require('../chat/js/module/sysMsg.js')
    require('../chat/js/module/personCard.js')
    require('../chat/js/module/session.js')
    require('../chat/js/module/friend.js')

    import goodsDetail from './goodsDetail'
    import orderGenerated from './orderGenerated'
    export default {
        created() {
            window.nim = window.opener.nim
            this.getMsg = window.opener.dataMsg
            this.uniqueAskNum = 0;
            this.chatData.remoteId = this.$route.query.remoteId;
            this.chatData.remoteCorpName = this.$route.query.remoteCorpName;
            window.RCorpName = this.chatData.remoteCorpName;
            window.updateStatus = this.updateStatus;

            if(!window.uniqueAskNum){
                window.uniqueAskNum={value:null};
            }

            this.chatData.itemDataIds = localStorage.getItem('itemDataIds');
            this.getGoodsDetail();
            document.addEventListener("visibilitychange", function() {
                if (!document.hidden) {
                    window.uniqueAskNum.value = 0;
                    // window.unreadAskList.value = 0;
                    window.unreadAskList = {value: 0};

                    newMessageRemind.clear();
                    window.isCurrentPage ={supply:true};
                    window.updateStatus();
                    document.title = '沪深商贸';
                } else {
                    window.isCurrentPage ={supply:false};
                }
                // judgeCurrentPage();
            });

            window.onfocus = function() {
                if (this.uniqueAskNum > 0) {
                    this.updateStatus();
                }
                document.title = '沪深商贸';
            };

            this.account = this.$store.state.userData.username;
            //window.nim.options.getHistoryMsgs(this.$route.query.to);
            //
            nim.getLocalMsgs({
              sessionId: 'p2p-'+this.$route.query.to,
              limit: 100,
              done: this.getLocalMsgsDone
            })
            this.isShowSeeMore = false;
        },
        components: {
            goodsDetail,
            orderGenerated
        },
        data() {
            return {
                amount: null,
                count: 1,
                userId: null,
                tipCount: '',
                tipAmount: '',
                pageIndex: 1,
                pageSize: 10,
                pageDatas: [],
                isShowSeeMore: true,
                isShowGenerated: false,
                isCreateOrder: false,
                isFirstExec: true,
                disId: null,
                readStatus: null,
                // uniqueAskNum: 0,
                orderData: {
                    orderId: null,
                    orderType: 1
                },
                unreadAskList: null,
                isInsertOrder: false,
                data: {
                    sessions: [],
                },
                nim: null,
                msg: '',
                msgDatas: [],
                account: null,
                newMags : null,
                friend_num:'',
                getMsg:null
            }
        },
        methods: {
            getLocalMsgsDone(error, obj) {
              console.log('获取本地消息' + (!error?'成功':'失败'))
              console.log(obj)
              this.$store.commit('updateMsgDatas', obj.msgs);
            },
            switchPanel(ev){
                YX.fn.switchPanel();
            },
            beforeClose(done) {
                done();
                this.amount = this.count = '';
                this.$store.commit('closeChatDialog')
            },
            getGoodsDetail() {
                let {
                    shopId,
                    itemDataIds
                } = this.chatData;
                let data = {
                    shopId: this.$route.query.id,
                    skuId: this.$route.query.skuId,
                    skuKeyId: this.$route.query.skuKeyId
                };
                // let data = {shopId: shopId,itemDataIds: itemDataIds.join(',')};
                this.$ajax.post('/basemall-shop/shop-goods/select-goods-detail', data).then((res) => {
                    this.$store.commit('updateChatGoodsInfo', res.goodsMap);
                    this.$store.commit('updateChatGoodsParamsInfo', res.itemList);
                    this.amount = this.detail.price;
                    // this.count = this.detail.dataQuantity;
                    if (this.detail.status != 2 || this.detail.dataQuantity <= 0) {
                        this.amount = null;
                        this.count = null;
                    }
                })
                this.uniqueDiscuss();
            },
            uniqueDiscuss() {
                this.$ajax.post('/basemall-message/discuss/unique-discuss', {
                    chatMethod: 1,
                    remoteId: this.chatData.remoteId,
                    goodsId: this.$route.query.id,
                    goodsPropertiesIds: this.$route.query.skuKeyId
                }).then((res) => {
                    this.disId = !!res?res.id:'';
                    this.getAllMsgList(this.chatData.remoteId);
                });
            },
            getAllMsgList() {
                clearTimeout(window.updateSupplyChat);
                window.updateSupplyChat = null;
                this.$ajax.post('/basemall-message/discuss/window-discuss-list', {
                    discussId: this.$route.query.disId || this.disId,
                    remoteId: this.chatData.remoteId,
                    goodsId: this.$route.query.id,
                    pageIndex: '',
                    pageSize: '',
                    chatMethod: 1
                }).then((res) => {
                    this.$store.commit('updateChatList', res);
                    this.userId = res.userId;
                    this.pageDatas = this.chatList.filter((x, i) => {
                        return i < this.pageIndex * this.pageSize
                    }).reverse();

                    // setTimeout(() => {
                        window.unreadAskList = {value:this.$store.state.globalData.noticeCount.askList};
                    // }, 40);
                    this.unreadAskList = window.unreadAskList;
                    if(window.isCurrentPage.supply) {
                        newMessageRemind.clear();
                        if(window.uniqueAskNum.value>0){
                            this.updateStatus();
                        }
                        window.unreadAskList.value = 0;
                    }

                    this.readStatus = this.pageDatas.length > 0 ? this.pageDatas[this.pageDatas.length - 1].readStatus : '';
                    window.chat.disId = this.pageDatas.length>0 ? this.pageDatas[0].discussId : null;
                    this.pageDatas.forEach((x, i) => {
                        // if(!!x&&x.orderId) {
                        //     this.orderData.orderId=x.orderId;
                        //     this.isShowGenerated = true;
                        // } else {
                        //     this.isShowGenerated = false;
                        // }
                        if (x.sellerId == this.userId) {
                            this.orderData.orderType = 2;
                        } else {
                            this.orderData.orderType = 1;
                        }
                    });

                    if (this.isFirstExec) {
                        // this.uniqueDiscuss();
                    } else {
                        if (this.chatList.length > 0) {
                            this.isFirstExec = false;
                        } else {
                            this.isFirstExec = true;
                        }
                    }
                    if (!!this.uniqueAskNum && this.uniqueAskNum > 0 && this.$route.path == '/supply/chat') {
                        // newMessage()
                    }
                    window.updateSupplyChat = setInterval(() => {
                        this.getAllMsgList(this.chatData.remoteId);
                    }, 10000);
                    setTimeout(scrollToBottom, 5);
                }).catch(() => {
                    this.$store.commit('updateChatList', []);
                })
            },
            getMsgList(id) {
                clearTimeout(window.updateSupplyChat);
                window.updateSupplyChat = null;
                this.$ajax.post('/basemall-message/discuss/window-discuss-list', {
                    discussId: this.$route.query.disId,
                    remoteId: id,
                    goodsId: this.$route.query.id,
                    pageIndex: 1,
                    pageSize: 10 * (this.pageIndex * 1),
                    chatMethod: 1
                }).then((res) => {
                    this.$store.commit('updateChatList', res);
                    this.userId = res.userId;
                    window.updateSupplyChat = setInterval(() => {
                        this.getMsgList(this.chatData.remoteId);
                    }, 10000);
                    setTimeout(scrollToBottom, 5);
                }).catch(() => {
                    this.$store.commit('updateChatList', []);
                })
            },
            getCount(){
                clearTimeout(window.noticeMessage);
                // this.$ajax.get('/basemall-message/message/unread-count').then((res) => {
                //     let obj={};
                //     res.forEach(x=>{
                //         obj[x.typeId]=x.unreadCount
                //     });
                //     obj.askList = res[res.length-1].askList;
                //     obj.answerList = res[res.length-1].answerList;
                //     this.$store.commit('updateNoticeCount',obj);
                //     window.noticeMessage=setTimeout(this.getCount,10000)
                // }).catch(()=>{
                //     if(!!window.noticeMessage){
                //         window.noticeMessage=setTimeout(this.getCount,10000)
                //     }
                // })
            },
            seeMore() {
                // if (this.pageIndex < Math.ceil(this.msgDatas.length / 10)) {
                //     this.pageIndex++;
                // } else {
                //     this.pageIndex = Math.ceil(this.msgDatas.length / 10);
                //     this.isShowSeeMore = false;
                // }
                // clearTimeout(window.updateSupplyChat);
                // window.updateSupplyChat = null;
                // this.getAllMsgList(this.chatData.remoteId);

                // console.log(345, Array.from(this.msgDatas));
                // console.log(88, this.msgDatas.length , Math.ceil(this.msgDatas.length / 10) , this.pageIndex, this.msgDatas);

                if(Math.ceil(this.msgDatas.length / 10) > this.pageIndex){
                    // this.msgDatas.length=this.pageIndex*10;
                    console.log(33);
                } else {
                    // this.msgDatas.length=10;
                    console.log(56,this.msgDatas);
                }
                ++this.pageIndex;
                window.nim.options.getHistoryMsgs(this.$route.query.to);
                this.isShowSeeMore = false;
            },
            addLetter(content) {
                this.$ajax.post('/basemall-message/discuss/add-discuss', {
                    corpName: this.corpName,
                    goodsName: this.detail.name,
                    // goodsId: this.chatData.goodsInfo.id * 1,
                    goodsId: this.$route.query.id * 1,
                    goodsProperties: this.paramsVal,
                    goodsPropertiesIds: this.$route.query.skuKeyId,
                    chatMethod: 1,
                    recieverId: this.chatData.remoteId * 1,
                    letterContent: this.detail.name + '　' + this.paramsVal + content,
                    price: this.amount * 1,
                    amount: this.count * 1,
                    goodsUnit: this.detail.unit,
                    status: 2
                }).then((res) => {
                    if (!this.disId) {
                        this.disId = res.discussId;
                    }
                    if (this.isFirstExec) {
                        // this.uniqueDiscuss();
                    }
                    this.pageIndex = 1;
                    this.isShowSeeMore = true;
                    this.getAllMsgList(this.chatData.remoteId);
                    this.amount = null;
                    this.count = null;
                    setTimeout(scrollToBottom, 5);
                })
            },
            send() {
                var options = {
                    scene: 'p2p',
                    to: this.$route.query.to,
                    from: this.$store.state.userData.username,
                    id: this.$route.query.id||'',
                    skuId: this.$route.query.skuId||'',
                    skuKeyId: this.$route.query.skuKeyId||'',
                    remoteId: this.$route.query.remoteId||'',
                    remoteCorpName: this.$route.query.remoteCorpName||'',
                    text: `${this.msg}`,
                    done: this.handlerMsg,
                    isHistoryable: true
                };
                console.log('sendOptions', options);
                window.nim.sendText(options);
                console.log('send',window.nim)
                this.msg = '';
            },
            handlerMsg(err,msg){
                let obj = {}
                obj.lastMsg = msg
                obj.updateTime = msg.time
                this.msgDatas.push(obj)
            },
            validate(next) {
                if (!this.amount) {
                    this.tipAmount = '请输入价格';
                } else if (!/^[1-9]\d*(\.\d{1,2})?$/.test(this.amount)) {
                    this.amount = null;
                    this.tipAmount = '请输入正确价格';
                } else if (this.count == null) {
                    this.tipCount = '请输入数量';
                } else if (!/^[1-9]\d*$/.test(this.count) || this.count > this.detail.dataQuantity) {
                    this.count = null;
                    this.tipCount = '数量必须是大于 1, 小于等于商品剩余数量的整数';
                } else {
                    let a = parseFloat(this.amount).toFixed(3);
                    this.amount = a.substring(0, a.indexOf('.') + 3);
                    next()
                };
            },
            getTotalAmountAndCount(content) {
                // let contentArr = content.split(';');
                let amt, count, price;
                // amt = contentArr[0].split(':')[1].replace(/[\u4E00-\u9FA5]/g, '');
                // count = contentArr[1].split(':')[1].replace(/[\u4E00-\u9FA5]/g, '');
                // price = content.price;
                // count = content.amount;
                price = this.partinerPrice;
                count = this.partinerNum;
                return {
                    amt: price * count,
                    count,
                    price
                }
            },
            createOrder() {
                let {
                    self,
                    other
                } = this.SOList;
                // if (!other || other.length == 0) {
                //     this.$message.warning('供应商未报价，不能下单！')
                // } else {
                if (this.partinerNum > this.detail.dataQuantity) {
                    this.$message.warning('目前对方认可的的数量小于剩余数量，请重新更改数量后下单');
                    return false;
                } else {
                    this.$confirm('是否根据当前报价价格下单？').then(_ => {
                        this.isInsertOrder = true;
                        let total = this.getTotalAmountAndCount(other[other.length - 1]);
                        let otherLast = this.SOList.other[this.SOList.other.length - 1];
                        this.$store.commit('updateOrderNums',total.count);
                        let data = {
                            // goodsId: this.chatData.shopId * 1,
                            goodsId: this.$route.query.id * 1,
                            sellerId: this.chatData.remoteId,
                            shippingAddress: this.detail.supplyAddress,
                            currency: 1,
                            meterUnit: this.detail.unit,
                            totalAmount: total.amt,
                            shopCount: total.count * 1,
                            type: this.chatData.type == 1 ? 2 : 1,
                            letterCenterId: !!this.chatList[this.chatList.length - 1] ? this.chatList[this.chatList.length - 1].letterCenterId : '',
                            letterContent: `卖方已同意买方对 ${this.detail.name} ${this.paramsVal}的询价, 价格: ${total.price}元，数量：${total.count}${this.detail.unit},订单已生成，订单编号`,
                            letterTitle: `${this.detail.name} 价格: ${total.price}元，数量：${total.count}${this.detail.unit}`,
                            skuId: this.$route.query.skuId,
                            skuQuantity: this.detail.dataQuantity,
                            goodsPropertiesIds: this.$route.query.skuKeyId,
                            corpName: this.chatData.remoteCorpName,
                            goodsName: this.detail.name,
                            goodsProperties: this.paramsVal,
                        };
                        if (total.count == this.detail.dataQuantity) {
                            data.shopStatus = 4
                        };
                        this.$ajax.post('/basemall-shop/shop-order/insert-order', data).then((res) => {
                            window.unreadAskList.value = 0;
                            this.isCreateOrder = true;
                            this.isShowGenerated = true;
                            this.orderData.orderId = res.orderId;
                            this.getGoodsDetail();
                            this.getAllMsgList(this.chatData.remoteId);
                        })
                    })
                }
                // }
            },
            viewOrderDetail(opt) {
                this.$store.commit('closeChatDialog');
                let orderType;
                if (opt.sellerId == this.userId) {
                    orderType = 2
                } else {
                    orderType = 1;
                }
                this.$router.push({
                    path: `/user-center/order-list/order-detail?id=${opt.orderId}&orderType=${orderType}`
                })
            },

            updateStatus() {
                let data = {discussId: this.disId};
                this.$ajax.post('/basemall-message/discuss/update-discuss-status', data).then(() => {
                    // opt.data.readStatus=1
                })
            },
            uniqueAskNums() {
                // this.getCount();
                // setTimeout(() => {
                    let askList = this.$store.state.globalData.noticeCount.askList, a = 0;
                    if(!!askList && askList.length>0) {
                        askList.forEach((x)=>{
                            if(x.discussId == this.disId) {
                                a += 1;
                            }
                        });
                    }
                    window.uniqueAskNum.value = a;

                    if(window.uniqueAskNum.value>0 && this.$route.path == '/supply/chat'){
                        newMessageRemind.show();
                    } else {
                        window.uniqueAskNum.value = 0;
                        document.title='沪深商贸';
                        clearNewMessageRemind();
                        return;
                    }
                    return a;
            },

            //查询好友列表
            getFriendsDone(error, friends){

                console.log('获取好友列表' + (!error?'成功':'失败'), error, friends);
                if (!error) {
                  let isFriend = false
                  for(var i = 0; i < friends.length; i++){
                    if(friends[i].account == this.$route.query.to){
                      isFriend = true
                    }
                  }
                  if(this.$route.query.to == nim.account){
                    console.log('不能添加自己为好友')
                    return
                  }
                  if(!isFriend){
                    nim.addFriend({
                        account: this.$route.query.to,
                        done: this.addFriendDone
                    });
                 }
                }
            },
            addFriendDone(error, obj){
                console.log('直接加为好友' + (!error?'成功':'失败'), error, obj)
            }
        },
        mounted(){


            window.nim.getFriends({
                done: this.getFriendsDone
            });
        },
        computed: {
            chatData() {
                return this.$store.state.globalData.chatData
            },
            chatList() {
                return this.chatData.chatList;
            },
            remoteCorpName() {
                return this.chatData.chatList[0].remoteCorpName;
            },
            num() {
                return this.$store.state.globalData.noticeCount.unreadChatNum
            },
            show() {
                return this.chatData.showSupplyChat
            },
            SOList() {
                let self = [],
                    other = [];
                // if(!!this.chatData&&!!this.chatData.allChatList){
                if (!!this.chatList) {
                    this.chatList.forEach(_ => {
                        // if (_.createBy == this.detail.userId) {
                        if (_.createBy == this.userId && !_.orderId) {
                            self.push({ ..._
                            })
                        } else {
                            if (!_.orderId) {
                                other.push({ ..._
                                })
                            }
                        }
                    });
                }
                self = self.reverse();
                other = other.reverse();
                return {
                    self,
                    other
                }
            },
            lastChat() {
                if (this.SOList.other) {
                    return this.SOList.other[this.SOList.other.length - 1];
                }
            },
            partinerPrice() {
                // let a, lPrice;
                // if(!!this.lastChat.letterContent&&this.lastChat.letterContent.split(' ')[0]) {
                //     a = this.lastChat.letterContent.split(' ')[0].replace(/[\u4E00-\u9FA5]/g,'');
                //     lPrice = a.includes(':')?a.replace(':',''):a;
                //     return lPrice;
                // } else {
                //     return '';
                // }
                if (!!this.lastChat && this.userId != this.lastChat.createBy) {
                    if (this.lastChat.letterContent.includes(this.paramsVal)) {
                        return this.lastChat.price * 1;
                    } else {
                        return this.detail.price * 1;
                    }
                } else {
                    return this.detail.price * 1;
                }
            },
            partinerNum() {
                // let a, lNum;
                // if(!!this.lastChat.letterContent && this.lastChat.letterContent.split(' ')[1]) {
                //     a = this.lastChat.letterContent.split(' ')[1].replace(/[\u4E00-\u9FA5]/g,'');
                //     lNum = a.includes(':')?a.replace(':',''):a;
                //     return lNum;
                // } else {
                //     return '';
                // }
                // return !!this.lastChat&&this.userId!=this.lastChat.createBy?this.lastChat.amount:this.detail.dataQuantity;
                if (!!this.lastChat && this.userId != this.lastChat.createBy) {
                    if (this.lastChat.letterContent.includes(this.paramsVal)) {
                        return this.lastChat.amount * 1;
                    } else {
                        return 1;
                    }
                } else {
                    return 1;
                }
            },
            detail() {
                return this.chatData.goodsInfo
            },
            paramsDetail() {
                let arr = [];
                let params = this.chatData.goodsParamsInfo;
                params.forEach((x) => {
                    let dataName = [];
                    if (x.dataName) {
                        if (x.dataName.split(',').length > 1) {
                            let names = x.dataName.split(',');
                            names.forEach((x) => {
                                dataName.push(x.split('|')[1]);
                            });
                            dataName = dataName.toString();
                        } else {
                            dataName = x.dataName.split('|')[1];
                        }
                    };
                    arr.push({
                        label: x.itemName,
                        value: dataName
                    })
                });
                return arr
            },
            paramsVal() {
                let vals = this.paramsDetail.map((x) => {
                    return x.value
                }).toString();
                vals = vals.includes(',') ? vals.replace(/\,/g, ' ') : vals;
                return vals;
            },
            lastContent() {
                if (this.chatList.length > 0) {
                    let last = this.chatList[this.chatList.length - 1].letterContent;
                    return last.split(';')
                } else {
                    return [];
                }
            },
            corpName() {
                return JSON.parse(localStorage.UD).corpName;
            },
            askList() {
                setTimeout(() => {
                    return this.$store.state.globalData.noticeCount.askList;
                }, 2);
            },
            chatNum(){
                let num = this.$store.state.globalData.noticeCount.unreadChatNum;
                return !!num?`(${num})`:''
            },
            msgs(){
                return this.$store.state.globalData.msgDatas
                console.log(666, this.$store.state.globalData.msgDatas);
            },
        },
        watch: {
            getMsg:{
                handler(newVal, oldVal){
                    console.log(555,newVal)
                    if(newVal.val){
                        // nim.resetSessionUnread('p2p-'+ newVal.val.lastMsg.from)
                        this.msgDatas.push(newVal.val);
                    }
                },
                deep: true
            },
            msgs: {
                handler(newVal, oldVal){
                    this.msgDatas.push(...newVal);
                },
                deep: true
            },
            show(val) {
                if (val) {
                    this.getGoodsDetail();
                }
            },
            // uniqueAskNum(val) {
            //     if (val > 0) {
            //         // newMessage();
            //     } else {
            //         this.updateStatus();
            //     }
            // },
            // chatNum(val){
            //     this.getAllMsgList(this.chatData.remoteId);
            // },

            // uniqueAskNum(val) {
            unreadAskList(val) {
                let lists = val.value||[], isHas=false;
                lists.forEach((x)=>{
                    if(x.discussId == this.disId){
                        isHas = true;
                    } else {
                        isHas = false;
                    }
                });
                if(!!val.value&&val.value.length>0&&isHas){
                    this.uniqueAskNums();
                    // this.getAllMsgList();
                } else {
                    newMessageRemind.clear();
                    document.title='沪深商贸';
                    return false;
                }
            },
            // uniqueAskNum: {
            //     handler(newVal, oldVal) {
            //         if(newVal.value>0){
            //             // this.uniqueAnswerNums();
            //             this.uniqueAskNums();
            //         } else {
            //             clearNewMessageRemind();
            //             return false;
            //         }
            //     },
            //     deep: true
            // },
            pageDatas(val) {
                // val.forEach((x,i) => {
                //     if (!!x.orderId) {
                //         return x;
                //         this.getGoodsDetail()
                //     }
                // });

                // if(!!val[val.length-1]&&!!val[val.length-1].orderId) {
                //     this.getGoodsDetail()
                // }

            },
            watch: {
                $route(to) {
                    this.init(to);
                    clearInterval(window.indexNotice);
                    if (to.path != '/supply/chat') {
                        clearTimeout(window.updateSupplyChat);
                        window.updateSupplyChat = null;
                    }
                },
                "chatData": {
                    handler() {
                        let self = [],
                            other = [];
                        if (!!this.chatData) {
                            this.chatData.allChatList.forEach(_ => {
                                if (_.createBy == this.userId && !_.orderId) {
                                    self.push({ ..._
                                    })
                                } else {
                                    if (!_.orderId) {
                                        other.push({ ..._
                                        })
                                    }
                                }
                            });
                        }
                        self = self.reverse();
                        other = other.reverse();
                        return {
                            self,
                            other
                        }
                        this.SOList.self = self;
                        this.SOList.other = other;
                    },
                    deep: true
                },
            }
        }
    };

    function scrollToBottom() {
        setTimeout(() => {
            let chatBox = document.querySelector('.chat-box');
            let chatList = document.querySelector('.chat-list');
            if (chatBox && chatList) {
                chatBox.scrollTo(0, chatList.offsetHeight)
            }
        }, 0)
    }

    var newMessageRemind = {
        _step: 0,
        _title: document.title,
        _timer: null,
        //显示新消息提示
        show:function(){
            // var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
            newMessageRemind._timer = setTimeout(function() {
                newMessageRemind.show();
                //这里写Cookie操作
                newMessageRemind._step++;
                // if (newMessageRemind._step == 3) { newMessageRemind._step = 1 };
                // if (newMessageRemind._step == 1) { document.title = "【　　　】" + '您有1条新消息'};
                // // if (newMessageRemind._step == 1) { document.title = "【　　　】" + temps };
                // if (newMessageRemind._step == 2) { document.title = "【新消息】" + '您有1条新消息'};
                // // if (newMessageRemind._step == 2) { document.title = "【新消息】" + temps };
                if (newMessageRemind._step % 2 == 0) {
                    document.title = `【新消息】您有1条新消息 ${window.RCorpName}`
                } else {
                    document.title = `【　　　】您有1条新消息 ${window.RCorpName}`
                }
            }, 800);
            return [newMessageRemind._timer, newMessageRemind._title];
        },
        //取消新消息提示
        clear: function(){
            clearTimeout(newMessageRemind._timer );
            document.title = newMessageRemind._title;
            //这里写Cookie操作
        }
    };
    // newMessageRemind.show();
    function clearNewMessageRemind() {
        newMessageRemind.clear();
    }

    function judgeCurrentPage() {
        if(window.isCurrentPage.supply) {
            newMessageRemind.clear();
            window.updateStatus();
            document.title='沪深商贸';
        } else {
            newMessageRemind.show();
        }
    }

    // 页面加载时绑定点击事件，单击取消闪烁提示
    function bind() {
        document.onclick = function() {
            message.clear();
        };
    }
</script>

<style lang="scss">
    @import './chat-dialog.scss';
</style>
