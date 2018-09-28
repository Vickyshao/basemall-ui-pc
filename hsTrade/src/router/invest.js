export default {
    name: "我要投资",
    path: "/invest",
    redirect: "/invest/list",
    show:true,
    component: require('@/components/invest/index.vue').default,
    children: [
        {
            name: "投资列表",
            path: "/invest/list",
            component: require('@/components/invest/invest.vue').default
        },
        {
            name: "详情",
            path: "/invest/detail",
            component: require('@/components/invest/investDetail.vue').default
        }
    ]
}