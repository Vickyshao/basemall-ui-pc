
require('./NIM_Web_NIM_v5.2.0.js')
require('./NIM_Web_SDK_v5.2.0.js')
require('./config.js')
import store from '../../../store.js'
let begin = location.href.indexOf('#')
let end = location.href.indexOf('?')
if(location.href.slice(begin,end) != '#/supply/chat'&&location.href.slice(begin,end) != '#/supply/cha'){
  if(!window.dataMsg){
    window.dataMsg ={time:null,val:''}
  }
var nim = new NIM({
  // 初始化SDK
  // debug: true
  appKey: '57bbce55b0631938cfbbaef5264206a4',
  account: !!localStorage.UD?JSON.parse(localStorage.UD).username:'11111111111',
  token: 'hs123456',
  onconnect: onConnect,
  onerror: onError,
  onwillreconnect: onWillReconnect,
  ondisconnect: onDisconnect,
  // 多端
  // onloginportschange: onLoginPortsChange,
  // 好友关系
  // onfriends: onFriends,
  // 会话
  onsessions: onSessions,
  mergesessions: mergeSessions,
  onupdatesession: onUpdateSession,
  onsyncfriendaction: onSyncFriendAction,
  // 用户名片
  onmyinfo: onMyInfo,
  onupdatemyinfo: onUpdateMyInfo,
  onusers: onUsers,
  onupdateuser: onUpdateUser,
  // 群组
  onteams: onTeams,
  onsynccreateteam: onCreateTeam,
  onteammembers: onTeamMembers,
  onsyncteammembersdone: onSyncTeamMembersDone,
  onupdateteammember: onUpdateTeamMember,
  // 消息
  onroamingmsgs: onRoamingMsgs,
  onofflinemsgs: onOfflineMsgs,
  onmsg: onMsg,
  // 系统通知
  onofflinesysmsgs: onOfflineSysMsgs,
  onsysmsg: onSysMsg,
  onupdatesysmsg: onUpdateSysMsg,
  onsysmsgunread: onSysMsgUnread,
  onupdatesysmsgunread: onUpdateSysMsgUnread,
  onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
  oncustomsysmsg: onCustomSysMsg,
  // 同步完成
  onsyncdone: onSyncDone,
  getHistoryMsgs: getHistoryMsgs,
  getHistoryMsgsDone: getHistoryMsgsDone,
  syncSessionUnread:true
});
window.nim = nim;
  var that = this;
  var data = {};
  // var friend_num = ""
  this.nim = window.nim;

  function onConnect() {
      console.log('连接成功');
  }
  function onWillReconnect(obj) {
      // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
      console.log('即将重连', obj);
  }
  function onDisconnect(error) {
      // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
      console.log('连接断开', error);
      if (error) {
          switch (error.code) {
          // 账号或者密码错误, 请跳转到登录页面并提示错误
          case 302:
              break;
          // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
          case 417:
              break;
          // 被踢, 请提示错误后跳转到登录页面
          case 'kicked':
              onConnect()
              break;
          default:
              break;
          }
      }
  }
  function onError(error, obj) {
      console.log('发生错误', error, obj);
  }

  function onSessions(sessions) {
    // cosns
      // console.log(sessions)
      // updateSessionsUI();
  }
  function onUpdateSession(session) {
      // console.log('会话更新了', session);
      onSessions(session);
      console.log('0000000',session)
      store.commit('updateRead',{account:session.lastMsg.from,unread:session.unread})
  }
  function mergeSessions(olds, news){
      console.log(789);
  }


  function addToBlacklist(obj) {
      data.blacklist = nim.mergeRelations(data.blacklist, obj.record);
      refreshBlacklistUI();
  }
  function removeFromBlacklist(obj) {
      data.blacklist = nim.cutRelations(data.blacklist, obj.record);
      refreshBlacklistUI();
  }
  function refreshBlacklistUI() {
      // 刷新界面
  }
  function addToMutelist(obj) {
      data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
      refreshMutelistUI();
  }
  function removeFromMutelist(obj) {
      data.mutelist = nim.cutRelations(data.mutelist, obj.record);
      refreshMutelistUI();
  }
  function refreshMutelistUI() {
      // 刷新界面
  }
  function onSyncFriendAction(obj) {
      console.log('收到好友操作', obj);
      switch (obj.type) {
      case 'addFriend':
          console.log('你在其它端直接加了一个好友' + obj);
          onAddFriend(obj.friend);
          break;
      case 'applyFriend':
          console.log('你在其它端申请加了一个好友' + obj);
          break;
      case 'passFriendApply':
          console.log('你在其它端通过了一个好友申请' + obj);
          onAddFriend(obj.friend);
          break;
      case 'rejectFriendApply':
          console.log('你在其它端拒绝了一个好友申请' + obj);
          break;
      case 'deleteFriend':
          console.log('你在其它端删了一个好友' + obj);
          onDeleteFriend(obj.account);
          break;
      case 'updateFriend':
          console.log('你在其它端更新了一个好友', obj);
          onUpdateFriend(obj.friend);
          break;
      }
  }
  function onAddFriend(friend) {
      data.friends = nim.mergeFriends(data.friends, friend);
      // refreshFriendsUI();
  }
  function onDeleteFriend(account) {
      data.friends = nim.cutFriendsByAccounts(data.friends, account);
      refreshFriendsUI();
  }
  function onUpdateFriend(friend) {
      data.friends = nim.mergeFriends(data.friends, friend);
      refreshFriendsUI();
  }
  function refreshFriendsUI() {
      // 刷新界面
  }

  function onMyInfo(user) {
      console.log('收到我的名片', user);
      data.myInfo = user;
      updateMyInfoUI();
  }
  function onUpdateMyInfo(user) {
      console.log('我的名片更新了', user);
      data.myInfo = NIM.util.merge(data.myInfo, user);
      updateMyInfoUI();
  }
  function updateMyInfoUI() {
      // 刷新界面
  }
  function onUsers(users) {
      console.log('收到用户名片列表', users);
      data.users = nim.mergeUsers(data.users, users);
  }
  function onUpdateUser(user) {
      console.log('用户名片更新了', user);
      data.users = nim.mergeUsers(data.users, user);
  }

  function onTeams(teams) {
      console.log('群列表', teams);
      data.teams = nim.mergeTeams(data.teams, teams);
      onInvalidTeams(teams.invalid);
  }
  function onInvalidTeams(teams) {
      data.teams = nim.cutTeams(data.teams, teams);
      data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
      refreshTeamsUI();
  }
  function onCreateTeam(team) {
      console.log('你创建了一个群', team);
      data.teams = nim.mergeTeams(data.teams, team);
      refreshTeamsUI();
      onTeamMembers({
          teamId: team.teamId,
          members: owner
      });
  }
  function refreshTeamsUI() {
      // 刷新界面
  }
  function onTeamMembers(obj) {
      console.log('收到群成员', obj);
      var teamId = obj.teamId;
      var members = obj.members;
      data.teamMembers = data.teamMembers || {};
      data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
      data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
      refreshTeamMembersUI();
  }
  function onSyncTeamMembersDone() {
      console.log('同步群列表完成');
  }
  function onUpdateTeamMember(teamMember) {
      console.log('群成员信息更新了', teamMember);
      onTeamMembers({
          teamId: teamMember.teamId,
          members: teamMember
      });
  }
  function sendMsg() {
      var options = {
          scene: scene || 'p2p',
          to: to,
          text: text,
          done: this.sendMsgDone.bind(this)
      };
      nim.sendText(options);
  }

  function refreshTeamMembersUI() {
      // 刷新界面
  }
  function updateSessionsUI() {
      // 刷新界面
  }

  function onRoamingMsgs(obj) {
      console.log('漫游消息', obj);
      pushMsg(obj.msgs);
  }
  function onOfflineMsgs(obj) {
      console.log('离线消息', obj);
      pushMsg(obj.msgs);
  }
  function onMsg(msg) {

   console.log('收到消息')
    //
      let obj = {}
      obj.lastMsg = msg
      obj.updateTime = msg.time
      // window.dataMsg = obj
      window.dataMsg.time = msg.time
      window.dataMsg.val = obj
      store.commit('updateMsgDatas',obj)
      // that.msgDatas.push(obj)
      store.commit('updateMsgOption',msg);
  
      store.commit('updataChatnum',nim)
      // console.log(msg.text)
      // // console.log('收到消息', msg.text, msg.scene, msg.type, msg);
      // //pushMsg(msg);
      // let obj = {}
      // obj.lastMsg = msg
      // obj.updateTime = msg.time
      // store.commit('updateMsgDatas',obj);
      // that.msgDatas.push(obj)
  }
  function pushMsg(msgs) {
      if (!Array.isArray(msgs)) { msgs = [msgs]; }
      var sessionId = msgs[0].sessionId;
      data.msgs = data.msgs || {};
  }

  function onOfflineSysMsgs(sysMsgs) {
      console.log('收到离线系统通知', sysMsgs);
      pushSysMsgs(sysMsgs);
  }
  function onSysMsg(sysMsg) {
      console.log('收到系统通知', sysMsg)
      pushSysMsgs(sysMsg);
  }
  function onUpdateSysMsg(sysMsg) {
    console.log('更新系统通知', sysMsg)
      pushSysMsgs(sysMsg);
  }
  function pushSysMsgs(sysMsgs) {
    console.log('合并通知')
    data.sysMsgs = nim.mergeSysMsgs(data.sysMsgs, sysMsgs);
      // refreshSysMsgsUI();
  }
  function onSysMsgUnread(obj) {
      console.log('收到系统通知未读数', obj);
      // data.sysMsgUnread = obj;
      // refreshSysMsgsUI();
  }
  function onUpdateSysMsgUnread(obj) {
      console.log('系统通知未读数更新了', obj);
      data.sysMsgUnread = obj;
      refreshSysMsgsUI();
  }
  function refreshSysMsgsUI() {
      // 刷新界面
  }
  function onOfflineCustomSysMsgs(sysMsgs) {
      console.log('收到离线自定义系统通知', sysMsgs);
  }
  function onCustomSysMsg(sysMsg) {
      console.log('收到自定义系统通知', sysMsg);
  }

  function onSyncDone() {
      console.log('同步完成');
  }

  function getHistoryMsgs(to){
    nim.getHistoryMsgs({
      scene: 'p2p',
      to: to,
      reverse: true,
      done: getHistoryMsgsDone
    });
  }
  function getHistoryMsgsDone(error, obj) {
      console.log('获取云端历史记录' + (!error?'成功':'失败'), error, obj);
      if (!error) {
          console.log('890获取云端历史记录obj',obj.msgs, obj);
          store.commit('updateMsgDatas',obj.msgs);
      } else{
        onConnect()
      }
  }
}
// updataNim
// store.nim = nim

// export default nim
//
// store.commit('updateNim',nim)
