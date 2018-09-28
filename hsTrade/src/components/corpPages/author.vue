<template>
    <div class="author">
        <img :src="img"/>
    </div>
</template>

<script>
export default {
    data(){
        return {
            img: '',
        }
    },
    created(){
        this.getAuthor();
    },
    methods: {
        getAuthor(){
            this.$ajax.get('/basemall-account//account/get-corp-authorization').then((res)=>{
                if(res.auditImage) {
                    this.img = res.imageBase + res.auditImage;
                }
            });
        },
    },

}
</script>

<style>

</style>
