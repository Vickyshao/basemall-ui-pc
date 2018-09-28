export default [
    {
        title:{id:'01',name:'资金管理',icon:'icon-capital',open:true},
        child:[
            {id:'011',name:'我的账户',url:'/user-center/capital'},
            {id:'012',name:'融资管理',url:'/user-center/financing'},
            {id:'013',name:'资产明细',url:'/user-center/asset-detail'},
            {id:'014',name:'充值',url:'/user-center/recharge'},
            {id:'015',name:'提现',url:'/user-center/present'},
        ]
    },
    {
        title:{id:'02',name:'订单管理',icon:'icon-order',open:false},
        child:[
            {id:'021',name:'订单列表',url:'/user-center/order-list'},
        ]
    },
    {
        title:{id:'03',name:'供求管理',icon:'icon-supply',open:false},
        child:[
            { id: '031', name: '我的供求', url:'/user-center/my-buy'},
        ]
    },
    {
        title:{id:'04',name:'消息中心',icon:'icon-notice',open:false},
        child:[
            {id:'041',name:'消息列表',url:'/user-center/message-list'},
        ]
    },
    {
        title:{id:'05',name:'账户管理',icon:'icon-account',open:false},
        child:[
            { id: '051', name: '企业信息', url:'/user-center/company-info'},
            { id: '052', name: '账户安全', url:'/user-center/account-safety'},
        ]
    }
]
