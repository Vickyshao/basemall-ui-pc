export default {
    name: "求购专区",
    redirect:'/buy/list',
    path: "/buy",
    show:true,
    component: require('@/components/buyList/index.vue').default,
    children: [
        {
            name: "求购列表",
            path: "/buy/list",
            component: require('@/components/buyList/buy.vue').default
        },
        {
            name: "商品详情",
            path: "/buy/detail",
            component: require('@/components/buyList/buyDetail.vue').default
        },
        {
            name: "报价",
            path: "/buy/chat",
            component: require('@/components/chat/chat-buy.vue').default
        }

    ]
}
