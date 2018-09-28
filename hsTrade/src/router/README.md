# router 说明

index.js为路由主文件，已配置好，无须变动

alias.js为路由容器，所有路由js文件引入其中并以数组形式导出到index.js

其它所有js文件为路由模块

模块中子路由定义在children中，例：

```javascript
export default {
    name: "关于我们",
    path: "/about",
    redirect: "/about/publish", // redirect的作用为进入当前路由重定向到指定子路由
    show:true, // show的作用为是否在nav中显示
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
```