<template>
    <div>
        <el-tabs class="tab_full-width" v-model="status.tab" @tab-click="tabChecked" v-if="!status.paySuccess">
            <el-tab-pane label="提现" name="1"></el-tab-pane>
            <el-tab-pane label="提现记录" name="2"></el-tab-pane>
        </el-tabs>

        <present :status="status" v-if="status.tab==1"></present>

        <present-list v-if="status.tab==2"></present-list>
    </div>
</template>
<script>
import present from './present'
import presentList from './presentList'
export default {
    components:{
        present,
        presentList
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
