<template>
    <div>
        <div class="details">
            <div class="icoSuc">确认收货成功.</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        created() {},
        methods: {}
    }
</script>

</script>

<style lang="less" scoped>
    .details {
        background: #fff;
        margin: 0 auto;
        padding: 83px 73px 130px;
        margin-bottom: 38px;
        color: #000;
        font-size: 18px;
        .icoSuc {
            width: 432px;
            white-space: nowrap;
            height: 55px;
            padding-left: 80px;
            margin: 0 auto;
            font-size: 24px;
            line-height: 49px;
            background: url('/static/img/user/payment@2x.png') no-repeat left center;
        }
    }
</style>


