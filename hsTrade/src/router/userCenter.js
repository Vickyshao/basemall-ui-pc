export default {
  name: "会员中心",
  path: "/user-center",
  redirect: "/user-center/capital",
  show: true,
  component: require("@/components/user/index.vue").default,
  children: [
    {
      name: "我的账户",
      path: "/user-center/capital",
      component: require("@/components/user/capital/capital.vue").default
    },
    {
      name: "融资管理",
      path: "/user-center/financing",
      component: require("@/components/user/financing/financing.vue").default
    },
    {
      name: "融资详情",
      path: "/user-center/financing-detail",
      component: require("@/components/user/financing/financingDetail.vue").default
    },
    {
      name: "还款",
      path: "/user-center/financing-repayment",
      component: require("@/components/user/financing/financingRepayment.vue").default
    },
    {
      name: "资产明细",
      path: "/user-center/asset-detail",
      component: require("@/components/user/financing/assetDetail.vue").default
    },
    {
      name: "充值",
      path: "/user-center/recharge",
      component: require("@/components/user/recharge/index.vue").default
    },
    {
      name: "提现",
      path: "/user-center/present",
      component: require("@/components/user/present/index.vue").default
    },
    {
      name: "充值记录",
      path: "/user-center/recharge-record",
      component: require("@/components/user/recharge/rechargeList.vue").default
    },
    {
      name: "提现记录",
      path: "/user-center/present-record",
      component: require("@/components/user/present/presentList.vue").default
    },
    {
      name: "我的投资",
      path: "/user-center/my-investment",
      component: require("@/components/user/investManage/myInvestment.vue").default
    },
    {
      name: "我的投资",
      path: "/user-center/my-investment-detail",
      component: require("@/components/user/investManage/myInvestmentDetail.vue").default
    },
    {
      name: "订单列表",
      path: "/user-center/order-list",
      component: require("@/components/user/orderManage/orderList.vue").default
    },
    {
      name: "订单处理",
      path: "/user-center/order-list/order-detail",
      component: require("@/components/user/orderManage/orderDetail.vue").default
    },
    {
      name: "订单信息",
      path: "/user-center/order-list/delivery-suc",
      component: require("@/components/user/orderManage/deliverySuc.vue").default

    },
    {
      name: "订单支付",
      path: "/user-center/order-list/order-pay",
      component: require("@/components/user/orderManage/orderPay.vue").default
    },
    {
      name: "订单附件上传",
      path: "/user-center/order-list/upload-file",
      component: require("@/components/user/orderManage/orderList_uploadFile.vue").default
    },
    {
      name: "我的供求",
      path: "/user-center/my-buy",
      component: require("@/components/user/supplyAndBuyManage/mySupply.vue").default
    },
    {
      name: "消息列表",
      path: "/user-center/message-list",
      component: require("@/components/user/messageNotification/messageList.vue").default
    },
    {
      name: "企业信息",
      path: "/user-center/company-info",
      redirect: '/company/home',
      component: require("@/components/user/accountManage/companyInfo.vue").default
    },
    {
      name: "账户安全",
      path: "/user-center/account-safety",
      component: require("@/components/user/accountManage/accountSafety.vue").default
    },
  ]
};
