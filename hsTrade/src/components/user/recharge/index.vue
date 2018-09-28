<template>
    <div>
        <el-tabs class="tab_full-width" v-model="status.tab" @tab-click="tabChecked" v-if="!status.paySuccess">
            <el-tab-pane label="充值" name="1"></el-tab-pane>
            <el-tab-pane label="充值记录" name="2"></el-tab-pane>
        </el-tabs>

        <recharge :status="status" v-if="status.tab==1"></recharge>

        <recharge-list v-if="status.tab==2"></recharge-list>
    </div>
</template>
<script>
import recharge from './recharge'
import rechargeList from './rechargeList'
export default {
    components:{
        recharge,
        rechargeList
    },
    data(){
        return{
            status:{
                tab:'1',
                paySuccess:false
            }
        }
    },
    methods:{
        tabChecked(){

        },
    }
}
</script>
