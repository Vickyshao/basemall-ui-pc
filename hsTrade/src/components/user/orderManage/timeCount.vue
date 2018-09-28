<template>
    <span>
        <span class="text-danger" v-if="info.leftTime<=0">已超时</span>
        <span class="text-danger" v-if="info.leftTime>0">{{info.leftTime|timeCount("HMS")}}</span>
    </span>
</template>
<script>
export default {
    props:['info'],
    created(){
        this.date=this.time;
        this.run()
    },
    methods:{
        run(){
            let t=setTimeout(()=>{
                clearTimeout(t);
                if(this.info.leftTime>0){
                    this.info.leftTime=new Date(this.info.leftTime).getTime()-1;
                    this.run();
                }else{
                    this.info.leftTime=0
                }
            },1000)
        }
    }
}
</script>
