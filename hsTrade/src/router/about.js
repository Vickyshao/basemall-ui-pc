export default {
    name: "关于我们",
    path: "/about",
    redirect: "/about/brief",
    show:true,
    component: require('@/components/about/about.vue').default,
    children:[
        {
            name: "公司简介",
            path: "/about/brief",
            component: require("@/components/about/brief.vue").default
        },
        {
            name: "法律申明",
            path: "/about/group",
            component: require("@/components/about/group.vue").default
        },
        {
            name: "联系我们",
            path: "/about/contact",
            component: require("@/components/about/contact.vue").default
        },
        {
            name: "网站公告",
            path: "/about/publish",
            component: require("@/components/about/publish.vue").default
        },
        {
            name: "公告详情",
            path: "/about/publish-detail",
            component: require("@/components/about/publishDetail.vue").default
        }
    ]
}