<template>
    <div class="user-sidebar">
        <div class="group" :class="{open:x.title.open,active:x.title.id===current.tab}" :key="x.title.id" v-for="(x,i) in navList">
            <div class="title" @click="open(i,x.title.id)">
                <span :class="x.title.icon">{{x.title.name}}</span>
            </div>
            <ul class="child" :style="{height:x.title.open?(x.child.length*44+'px'):0}">
                <li :key="child.id" v-for="child in x.child" :class="{active:current.child===child.id}" @click="select_jump(child.id,x.title.id,child.url)">{{child.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>

export default {
    props:['navList','current'],
    methods:{
        open(i,id){
            this.current.tab=id;
            this.navList[i].title.open=!this.navList[i].title.open;
        },
        select_jump(id,tabId,url){
            this.current.child=id;
            this.current.tab=tabId;
            let path=this.$route.path;
            path!=url && this.$router.push({path:url})
        }
    }
}
</script>
<style lang="less" scoped>
    .user-sidebar{
        width: 240px;
        background: #fff;
        .group{
            text-align: center;
            .title,.child li{ cursor: pointer; }
            .title{
                height: 47px;
                line-height: 47px;
                background: #ddd;
                span{
                    display: inline-block;
                    padding-left: 30px;
                    height: 47px;
                    margin-right: 5px;
                    background-repeat: no-repeat;
                    background-position: left center;
                    background-size: auto 23px;
                }
                .icon-capital{ background-image:url(/static/img/user/capital_1@2x.png); }
                .icon-order{ background-image:url(/static/img/user/order_1@2x.png); }
                .icon-supply{ background-image:url(/static/img/user/supply_1@2x.png); }
                .icon-notice{ background-image:url(/static/img/user/notice_1@2x.png); }
                .icon-account{ background-image:url(/static/img/user/account_1@2x.png); }
            }
            .child{
                overflow: hidden;
                transition: all .2s linear;
                li{
                    height: 44px;
                    line-height: 44px;
                    font-size: 14px;
                    &:hover,&.active{ color: #1650a2; }
                }
            }
            &.active{
                .title{
                    background: #1650a2;
                    color: #fff;
                    .icon-capital{ background-image:url(/static/img/user/capital_2@2x.png); }
                    .icon-order{ background-image:url(/static/img/user/order_2@2x.png); }
                    .icon-supply{ background-image:url(/static/img/user/supply_2@2x.png); }
                    .icon-notice{ background-image:url(/static/img/user/notice_2@2x.png); }
                    .icon-account{ background-image:url(/static/img/user/account_2@2x.png); }
                }
            }
        }

    }
</style>
