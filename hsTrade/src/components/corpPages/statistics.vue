<template>
    <div class="statistics">
        <div class="totalNums">
            <div>
                <ul>
                    <li><img src=""/></li>
                    <li class="colorRed">154</li>
                    <li>累计交易数(笔)</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li><img src=""/></li>
                    <li class="colorRed">{{100000|toDoubleThousands}}</li>
                    <li>累计交易金额(元)</li>
                </ul>
            </div>
        </div>

        <div class="typeStatistics">
            <div class="name">交易类型统计</div>
            <div>
                <ul>
                    <li><img src=""/></li>
                    <li class="colorRed">154</li>
                    <li>累计交易数(笔)</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li><img src=""/></li>
                    <li class="colorRed">{{100000|toDoubleThousands}}</li>
                    <li>累计交易金额(元)</li>
                </ul>
            </div>
        </div>

        <div class="preference">
            <div class="name">交易偏好分布统计</div>
            <div>
                <div id="myChart" :style="{width:'300px', height:'300px'}"></div>
            </div>
        </div>

        <div class="partner">
            <div class="name">交易伙伴分布统计</div>

        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            aa: [
                    {value:235, name:'视频广告'},
                    {value:274, name:'联盟广告'},
                    {value:310, name:'邮件营销'},
                    {value:335, name:'直接访问'},
                    {value:400, name:'搜索引擎'}
                ]
        }
    },
    created(){},
    mounted(){
        let chart = this.$echarts.init(document.getElementById('myChart'));
        let options = {
            // backgroundColor: '#2c343c',
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    // label:{            //饼图图形上的文本标签
                    //     normal:{
                    //         show:true,
                    //         position:'inner', //标签的位置
                    //         textStyle : {
                    //             fontWeight : 300 ,
                    //             fontSize : 16    //文字的字体大小
                    //         },
                    //         formatter:'{d}%'
                    //     }
                    // },
                    data: this.aa,
                    // roseType: 'angle',
                    // label: {
                    //     normal: {
                    //         textStyle: {
                    //             color: 'rgba(255, 255, 255, 0.3)'
                    //         }
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         lineStyle: {
                    //             color: 'rgba(255, 255, 255, 0.3)'
                    //         }
                    //     }
                    // },
                    // itemStyle: {
                    //     normal: {
                    //         color: '#c23531',
                    //         shadowBlur: 200,
                    //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //     }
                    // }
                }
            ]
        };
        chart.setOption(options)
    },

}
</script>

<style>

</style>
