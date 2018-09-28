<template>
    <div class="capital-wrapper">
        <info v-if="$store.state.userData.userType==1" :info-data="infoData"></info>
        <info-r v-if="$store.state.userData.userType==3" :info-data="infoData"></info-r>
        <list :info="infoData.info"></list>
    </div>
</template>
<script>
import info from './capital-info.vue'
import infoR from './capital-info-r.vue'
import list from './capital-list.vue'

export default {
    created(){
        this.getInfo()
    },
    data(){
        return{
            infoData:{
                loading:false,
                state:null,
                info:{}
            }
        }
    },
    methods:{
        getInfo(){
            this.infoData.loading=true;
            let userType=this.$store.state.userData.userType;
            let time=new Date().getTime();
            let url=userType==3?`/basemall-fax/account/my-account-by-financing?`+time:`/basemall-fax/account/my-account?`+time;
            this.$ajax.get(url).then((res)=>{
                this.infoData.loading=false;
                if(userType==1){
                    this.infoData.state=res.state;
                };
                this.infoData.info=res.account;
            }).catch(()=>{
                this.infoData.loading=false
            })
        }
    },
    components:{
        info,
        infoR,
        list
    }
}
</script>

<style lang="scss" scoped>
    .capital-wrapper{
        width: 100%;
    }
</style>
