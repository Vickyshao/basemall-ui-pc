<template>
    <span>
        <span style="color:red" v-if="date<=0">已超时</span>
        <span v-if="date>0">{{date|timeCount}}</span>
    </span>
</template>
<script>
export default {
    props:['time'],
    created(){
        this.date=this.time;
        this.run()
    },
    data(){return{date:null}},
    methods:{
        run(){
            let t=setTimeout(()=>{
                if(this.date>0){
                    this.date=new Date(this.date).getTime()-1;
                    clearTimeout(t);
                    this.run();
                }else{
                    clearTimeout(t);
                    this.date=0
                }
            },1000)
        }
    }
}
</script>
