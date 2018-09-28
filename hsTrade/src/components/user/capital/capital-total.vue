<template>
    <div class="capital-total">
        <div class="cell">
            <p class="clear">
                <img src="/static/img/user/purchase@2x.png" height="33px">
                <span class="ml" v-if="$store.state.userData.userType==1">累计采购总额</span>
                <span class="ml" v-if="$store.state.userData.userType==3">累计投资总额</span>
                <span class="ml big">{{info.a|toDoubleThousands}}</span>
                <span>元</span>
            </p>
        </div>
        <div class="cell">
            <p  class="clear">
                <img src="/static/img/user/sale@2x.png" height="33px">
                <span class="ml" v-if="$store.state.userData.userType==1">累计销售总额</span>
                <span class="ml" v-if="$store.state.userData.userType==3">累计收益总额</span>
                <span class="ml big">{{info.b|toDoubleThousands}}</span>
                <span>元</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props:['info']
}
</script>

<style lang="scss" scoped>
    .capital-total{
        width: 100%;
        height: 94px;
        background: #3cb239;
        color: #fff;
        text-align: center;
        margin: 36px 0 28px;
        position: relative;
        &:before{
            content:"";
            position: absolute;
            width: 1px;
            height: 36px;
            background: #fff;
            left: 50%;
            top: 29px;
        }
        .cell{
            float: left;
            padding-top: 30px;
            width: 50%;
            line-height: 33px;
            p{
                display: inline-block;
                .ml{
                    margin-left: 10px;
                }
                .big{
                    font-size: 22px;
                }
                img,span{
                    float: left;
                }
            }
        }
    }
</style>
