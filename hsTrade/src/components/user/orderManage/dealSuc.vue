<template>
    <div class="orderStatus">
        <div class="status">
            <span class="icoSuc">交易已成功</span>
        </div>
    </div>
</template>

<script>
    export default {
        created() {},
        components: {},
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>
    $blueColor: #f5f8fb;
    $darkBlueColor: #1952a3;
    .status {
        height: 137px;
        line-height: 147px;
        padding-top: 10px;
        font-size: 24px;
        text-align: center;
        background: #f1f1f1;
        .icoSuc {
            display: inline-table;
            padding-left: 80px;
            background: url("/static/img/user/payment@2x.png") no-repeat left center;
        }
    }
</style>
