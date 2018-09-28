<template>
    <div class="publishSuc">
        <div class="details">
            <div class="icoSuc" v-if="sucInfos.type == 'SeekPurchase'">求购信息发布成功</div>
            <div class="icoSuc" v-if="sucInfos.type == 'goods'">供货信息发布成功</div>
            <ul>
                <li><span>商品名称 :</span>{{sucInfos.name}}</li>
                <li><span>商品分类 :</span>{{sucInfos.modelName}}</li>
                <li><span>参考单价 :</span>{{sucInfos.price | toDoubleThousands}}{{sucInfos.currency=='人民币'?'元':sucInfos.currency}}</li>
                <li><span>发布时间 :</span>{{sucInfos.pubdateTime | formatTime}}</li>
            </ul>
            <div class="btns">
                <button @click="continuePublish">继续发布</button>
                <button @click="viewDetail">查看</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['sucInfos'],
        data() {
            return {
                isShowSucc: true,
            }
        },
        created() {},
        methods: {
            continuePublish() {
                this.$emit('continue-publish', this.isShowSucc);
            },
            viewDetail() {
                let id = this.sucInfos.id;
                let modelId = this.sucInfos.modelId;
                if (this.sucInfos.type == 'goods') {
                    this.$router.push({
                        // path: `/supply/detail?id=${id}&modelId=${modelId}`
                        path: `/user-center/my-buy?activeName=first&type=2`
                    });
                } else if (this.sucInfos.type == 'SeekPurchase') {
                    this.$router.push({
                        // path: `/buy/detail?id=${id}&modelId=${modelId}`
                        path: `/user-center/my-buy?activeName=second&type=1`
                    });
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "../../less/quickRelease.less";
</style>


