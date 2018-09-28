export default {
    name: '企业主页',
    path: '/company',
    redirect: '/company/home',
    show: false,
    component: require('@/components/corpPages/index.vue').default,
    children: [{
        name: '企业主页',
        path: '/company/home',
        component: require('@/components/corpPages/corpHome.vue').default
    }]
}
