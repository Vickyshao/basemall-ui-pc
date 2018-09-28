<template>
    <div class="enterpriseInfo">
        <div class="subtitle">基本信息</div>
        <div class="basicInfo">
            <table>
                <tr>
                    <td>注册资本：</td>
                    <td>{{corpInfo.register_capital}}万人民币元</td>
                    <td>成立日期：</td>
                    <td>{{corpInfo.register_date}}</td>
                    <!-- <td>{{corpInfo.register_date|formateTime}}</td> -->
                </tr>
                <tr>
                    <td>经营状态：</td>
                    <td>xx</td>
                    <td>营业执照号：</td>
                    <td>{{corpInfo.register_number}}</td>
                </tr>
                <tr>
                    <td>公司类型：</td>
                    <td>{{corpInfo.corp_type}}</td>
                    <td>组织机构代码：</td>
                    <td>{{corpInfo.organization_code}}</td>
                </tr>
                <tr>
                    <td>所属地区：</td>
                    <td>{{corpInfo.corp_location}}</td>
                    <td>所属行业：</td>
                    <td>{{corpInfo.business_main}}</td>
                </tr>
                <tr>
                    <td>营业期限：</td>
                    <td colspan="3">{{corpInfo.business_term}}</td>
                </tr>
                <tr>
                    <td>企业地址：</td>
                    <td colspan="3">{{corpInfo.corp_location}}</td>
                </tr>
                <tr>
                    <td>经营范围：</td>
                    <td colspan="3" class="smallHeight">
                        {{corpInfo.business_scope}}
                    </td>
                </tr>
            </table>
        </div>

        <div class="certificate" v-if="!!corpInfo.auditImages && corpInfo.auditImages.length>0">
            <div class="subtitle">企业证照（{{corpInfo.auditImages.length||''}}）</div>
            <div class="proInfos">
                <div class="ins">
                    <img class="leftIcon" @click="prev()" src="/static/img/corpPages/leftArr.png" />
                    <div class="imgs">
                        <div class="sw">
                            <ul>
                                <li v-for="x in corpInfo.auditImages">
                                    <div><img src="/static/img/corpPages/goods.png"/></div>
                                    <div class="desc">这是一个证件</div>
                                </li>
                                <li>
                                    <div><img src="/static/img/corpPages/goods.png"/></div>
                                    <div class="desc">这是一个证件</div>
                                </li>
                                <li>
                                    <div><img src="/static/img/corpPages/goods.png"/></div>
                                    <div class="desc">这是一个证件</div>
                                </li>
                                <li>
                                    <div><img src="/static/img/corpPages/goods.png"/></div>
                                    <div class="desc">这是一个证件</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <img class="rightIcon" @click="next()" src="/static/img/corpPages/rihgtArr.png" />
                </div>
            </div>
        </div>

        <div class="presentInfo">
            <div class="subtitle">提供资料</div>
            <ul>
                <li><img src="/static/img/corpPages/file1.png"/><div>财务报表</div></li>
                <li><img src="/static/img/corpPages/file2.png"/><div>营业执照</div></li>
                <li><img src="/static/img/corpPages/file3.png"/><div>贸易合同</div></li>
                <li><img src="/static/img/corpPages/file4.png"/><div>资质证明</div></li>
                <li><img src="/static/img/corpPages/file5.png"/><div>交割凭证</div></li>
                <li><img src="/static/img/corpPages/file6.png"/><div>完税凭证</div></li>
            </ul>
        </div>

        <div class="partner">
            <div class="subtitle">合作伙伴</div>
            <div class="more">更多</div>
            <ul>
                <li><img src="/static/img/corpPages/partner1.png"/><div></div></li>
                <li><img src="/static/img/corpPages/partner2.png"/><div></div></li>
                <li><img src="/static/img/corpPages/partner3.png"/><div></div></li>
                <li><img src="/static/img/corpPages/partner4.png"/><div></div></li>
                <li><img src="/static/img/corpPages/partner5.png"/><div></div></li>
            </ul>
        </div>

        <div class="distribut">
            <div class="subtitle">业务分布</div>
            <div class="mapChart">
                <div class="echart" id="mapChart" :style="{width:'500px', height:'500px'}"></div>
            </div>
        </div>

        <div class="finance">
            <div class="subtitle mB0">融资情况</div>
            <div class="financeChart">
                <div class="echart" id="financeChart" :style="{width:'800px', height:'600px'}"></div>
            </div>
        </div>

    </div>
</template>

<script>
require('../../../static/js/china.js')
export default {
    props: ['corpInfo'],
    data(){
        return {
            step: 1,
            finance: [
                    {value:235, name:'应收账款融资'},
                    {value:274, name:'信用融资'},
                ]

        }
    },
    created(){
        console.log('corpInfo:',this.corpInfo);

    },
    methods: {
        prev() {
            if (this.step <= 5) {
                console.log('prev1', this.step);
                --this.step;
                $('.proInfos .ins .imgs div').animate({
                    'right': '0',
                    'left': (227 * (this.step - 1)) + 'px'
                }, 500);
                if (this.step <= 1) {
                    console.log('prev2', this.step);
                    this.step = 1;
                }
            }
        },
        next() {
            if (this.step < 5) {
                console.log('next1', this.step);
                ++this.step;
                $('.proInfos .ins .imgs div').animate({
                    'right': '0',
                    'left': -(227 * (this.step - 1)) + 'px'
                }, 500);
            } else if (this.step >= 4) {
                console.log('next2', this.step);
                this.step = 1;
            }
        },
    },
    mounted(){
        let financeChart = this.$echarts.init(document.getElementById('financeChart'));
        let financeOptions = {
            // visualMap: {
            //     show: false,
            //     min: 80,
            //     max: 600,
            //     inRange: {
            //         colorLightness: [0, 1]
            //     }
            // },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: 'right',
                top: 'bottom',
                data: this.finance
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['60%', '50%'],
                    label:{            //饼图图形上的文本标签
                        normal:{
                            show:true,
                            position:'inner', //标签的位置
                            textStyle : {
                                fontWeight : 300 ,
                                fontSize : 16    //文字的字体大小
                            },
                            formatter:'{d}%'
                        }
                    },
                    data: this.finance,
                    // itemStyle: {
                    //     emphasis: {
                    //         shadowBlur: 10,
                    //         shadowOffsetX: 0,
                    //         // shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //     }
                    // }
                }
            ],
            color: ['#1650a2','#67aef5']
        };
        financeChart.setOption(financeOptions);

        let mapChart = this.$echarts.init(document.getElementById('mapChart'));
        let mapOptions = {
            tooltip : {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data:['iphone3','iphone4','iphone5']
            },
            visualMap: {
                min: 0,
                max: 2500,
                left: 'left',
                top: 'bottom',
                text:['高','低'],           // 文本，默认为数值文本
                calculable : true
            },
            toolbox: {
                show: true,
                orient : 'vertical',
                left: 'right',
                top: 'center',
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name: 'iphone3',
                    type: 'map',
                    // mapType: 'china',
                    map: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                        {name: '北京',value: Math.round(Math.random()*1000)},
                        {name: '天津',value: Math.round(Math.random()*1000)},
                        {name: '上海',value: Math.round(Math.random()*1000)},
                        {name: '重庆',value: Math.round(Math.random()*1000)},
                        {name: '河北',value: Math.round(Math.random()*1000)},
                        {name: '河南',value: Math.round(Math.random()*1000)},
                        {name: '云南',value: Math.round(Math.random()*1000)},
                        {name: '辽宁',value: Math.round(Math.random()*1000)},
                        {name: '黑龙江',value: Math.round(Math.random()*1000)},
                        {name: '湖南',value: Math.round(Math.random()*1000)},
                        {name: '安徽',value: Math.round(Math.random()*1000)},
                        {name: '山东',value: Math.round(Math.random()*1000)},
                        {name: '新疆',value: Math.round(Math.random()*1000)},
                        {name: '江苏',value: Math.round(Math.random()*1000)},
                        {name: '浙江',value: Math.round(Math.random()*1000)},
                        {name: '江西',value: Math.round(Math.random()*1000)},
                        {name: '湖北',value: Math.round(Math.random()*1000)},
                        {name: '广西',value: Math.round(Math.random()*1000)},
                        {name: '甘肃',value: Math.round(Math.random()*1000)},
                        {name: '山西',value: Math.round(Math.random()*1000)},
                        {name: '内蒙古',value: Math.round(Math.random()*1000)},
                        {name: '陕西',value: Math.round(Math.random()*1000)},
                        {name: '吉林',value: Math.round(Math.random()*1000)},
                        {name: '福建',value: Math.round(Math.random()*1000)},
                        {name: '贵州',value: Math.round(Math.random()*1000)},
                        {name: '广东',value: Math.round(Math.random()*1000)},
                        {name: '青海',value: Math.round(Math.random()*1000)},
                        {name: '西藏',value: Math.round(Math.random()*1000)},
                        {name: '四川',value: Math.round(Math.random()*1000)},
                        {name: '宁夏',value: Math.round(Math.random()*1000)},
                        {name: '海南',value: Math.round(Math.random()*1000)},
                        {name: '台湾',value: Math.round(Math.random()*1000)},
                        {name: '香港',value: Math.round(Math.random()*1000)},
                        {name: '澳门',value: Math.round(Math.random()*1000)}
                    ]
                },
                {
                    name: 'iphone4',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                        {name: '北京',value: Math.round(Math.random()*1000)},
                        {name: '天津',value: Math.round(Math.random()*1000)},
                        {name: '上海',value: Math.round(Math.random()*1000)},
                        {name: '重庆',value: Math.round(Math.random()*1000)},
                        {name: '河北',value: Math.round(Math.random()*1000)},
                        {name: '安徽',value: Math.round(Math.random()*1000)},
                        {name: '新疆',value: Math.round(Math.random()*1000)},
                        {name: '浙江',value: Math.round(Math.random()*1000)},
                        {name: '江西',value: Math.round(Math.random()*1000)},
                        {name: '山西',value: Math.round(Math.random()*1000)},
                        {name: '内蒙古',value: Math.round(Math.random()*1000)},
                        {name: '吉林',value: Math.round(Math.random()*1000)},
                        {name: '福建',value: Math.round(Math.random()*1000)},
                        {name: '广东',value: Math.round(Math.random()*1000)},
                        {name: '西藏',value: Math.round(Math.random()*1000)},
                        {name: '四川',value: Math.round(Math.random()*1000)},
                        {name: '宁夏',value: Math.round(Math.random()*1000)},
                        {name: '香港',value: Math.round(Math.random()*1000)},
                        {name: '澳门',value: Math.round(Math.random()*1000)}
                    ]
                },
                {
                    name: 'iphone5',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                        {name: '北京',value: Math.round(Math.random()*1000)},
                        {name: '天津',value: Math.round(Math.random()*1000)},
                        {name: '上海',value: Math.round(Math.random()*1000)},
                        {name: '广东',value: Math.round(Math.random()*1000)},
                        {name: '台湾',value: Math.round(Math.random()*1000)},
                        {name: '香港',value: Math.round(Math.random()*1000)},
                        {name: '澳门',value: Math.round(Math.random()*1000)}
                    ]
                }
            ]
        };
        mapChart.setOption(mapOptions);
    },
}
</script>

<style>

</style>
