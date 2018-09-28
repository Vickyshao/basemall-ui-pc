<template>
    <div>
        <div class="inline-block sigh" v-if="pendingPay>0">
            您还剩<span style="color:red">{{pendingPay|remainTime}}</span>来付款。
        </div>
        <!-- <div v-if="pendingPay<=0">
                <span style="color:red">您的操作已超时。</span>
                <span v-if="date>0">{{pendingPay|remainTime}}</span>
            </div> -->
    </div>
</template>

<script>
    export default {
        props: ['time'],
        created() {
            this.init();
            this.run();
        },
        data() {
            return {
                date: null,
                pendingPay: null
            }
        },
        methods: {
            init() {
                this.pendingPay = ((this.time.createTime+3*86400000)-this.time.currentTime)/1000;
            },
            run() {
                let t = setTimeout(() => {
                    if (this.pendingPay > 0) {
                        --this.pendingPay;
                        clearTimeout(t);
                        this.run();
                    } else {
                        this.pendingPay = 0;
                        clearTimeout(t);
                    }
                }, 1000);
            },
        },
    }
</script>
