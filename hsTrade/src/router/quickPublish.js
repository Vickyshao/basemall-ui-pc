export default {
    name: "快速发布",
    path: "/publish",
    // show: true,
    redirect: "/publish/seek-purchase",
    component: require("@/components/quickPublish/index.vue").default,
    children: [
        {
            name: "发布求购",
            path: "/publish/seek-purchase",
            component: require("@/components/quickPublish/publishSeekPurchase.vue")
                .default
        },
        {
            name: "发布成功",
            path: "/publish/success",
            component: require("@/components/quickPublish/publishSuc.vue")
                .default
        },
        {
            name: "发布商品",
            path: "/publish/goods",
            component: require("@/components/quickPublish/publishGoods.vue")
                .default
        }
    ]
};
