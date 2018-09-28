<template>
    <div class="user-sidebar">
        <div class="group">
            <ul class="child">
                <li :key="child.id" v-for="child in data.nav.child" :class="{active:data.current===child.id}" @click="select_jump(child.id,child.url)">
                    <span :class="child.icon">{{child.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>

export default {
    props:['data'],
    data(){
        return{
            
        }
    },
    methods:{
        select_jump(id,url){
            this.data.current=id;
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
            .child li{ cursor: pointer; }
            .child{
                overflow: hidden;
                transition: all .2s linear;
                margin: 20px 0 30px;
                li{
                    height: 50px;
                    line-height: 50px;
                    font-size: 16px;
                    border-bottom: 1px solid #dddddd;
                    span{
                        display: inline-block;
                        padding-left: 35px;
                        height: 50px;
                        margin-right: 5px;
                        background-repeat: no-repeat;
                        background-position: left center;
                        background-size: auto 20px;
                        &.icon-brief{
                            background-image: url(/static/img/aboutUs/book_1@2x.png);
                        }
                        &.icon-group{
                            background-image: url(/static/img/aboutUs/member_1@2x.png);
                        }
                        &.icon-contact{
                            background-image: url(/static/img/aboutUs/message_1@2x.png);
                        }
                        &.icon-publish{
                            background-image: url(/static/img/aboutUs/horn_1@2x.png);
                        }
                    }
                   &.active{
                        background-color: #1650a2;
                        &:hover{
                            color: #FFFFFF;
                        }
                        span{
                            color: #FFFFFF;
                            &.icon-brief{
                                background-image: url(/static/img/aboutUs/book_2@2x.png);
                            }
                            &.icon-group{
                                background-image: url(/static/img/aboutUs/member_2@2x.png);
                            }
                            &.icon-contact{
                                background-image: url(/static/img/aboutUs/message_2@2x.png);
                            }
                            &.icon-publish{
                                background-image: url(/static/img/aboutUs/horn_2@2x.png);
                            }
                            &:hover{
                                color: #FFFFFF;
                            }
                        }
                    }
                    &:hover{
                        color: #1650a2;
                    }
                }
            }
        }
    }
</style>
