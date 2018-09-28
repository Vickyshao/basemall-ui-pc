export default {
    name: "我要融资",
    path: "/finance",
    redirect: "/finance/list",
    show:true,
    component: require('@/components/financeList/index.vue').default,
    children: [
        {
            name: "我要融资",
            path: "/finance/list",
            component: require('@/components/financeList/finance.vue').default
        },
        {
            name: "详情",
            path: "/finance/detail",
            component: require('@/components/financeList/financeDetail.vue').default
        },
        {
            name: "投资成功",
            path: "/finance/investSuc",
            component: require('@/components/financeList/investSuc.vue').default
        },
    ]
}
