export default [
  {
    title: { id: "01", name: "资金管理", icon: "icon-capital", open: true },
    child: [
      { id: "011", name: "我的账户", url: "/user-center/capital" },
      { id: "013", name: "资产明细", url: "/user-center/asset-detail" },
      { id: "014", name: "充值记录", url: "/user-center/recharge-record" },
      { id: "015", name: "提现记录", url: "/user-center/present-record" }
    ]
  },
  {
    title: { id: "02", name:"投资管理", icon: "icon-order", open: false},
    child: [
      { id: "021", name: "我的投资", url: "/user-center/my-investment"}
    ]
  },
  {
    title: { id: "03", name: "消息中心", icon: "icon-notice", open: false },
    child: [{ id: "031", name: "消息列表", url: "/user-center/message-list" }]
  },
  {
    title: { id: "04", name: "账户管理", icon: "icon-account", open: false },
    child: [
      { id: '051', name: '企业信息', url:'/user-center/company-info'},
      { id: "041", name: "账户安全", url: "/user-center/account-safety" }
    ]
  }
];
