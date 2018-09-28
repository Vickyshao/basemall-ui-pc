export default {
    name: "供货专区",
    path: "/supply",
    redirect: "/supply/list",
    show:true,
    component: require('@/components/supplyList/index.vue').default,
    children: [
        {
            name: "供货列表",
            path: "/supply/list",
            component: require('@/components/supplyList/supply.vue').default
        },
        {
            name: "商品详情",
            path: "/supply/detail",
            component: require('@/components/supplyList/supplyDetail.vue').default
        },
        {
            name: "询价",
            path: "/supply/chat",
            component: require('@/components/chat/chat_new.vue').default
        }
    ]
}
