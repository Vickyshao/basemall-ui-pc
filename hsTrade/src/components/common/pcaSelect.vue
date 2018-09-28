<template>
    <div>
        <el-cascader placeholder="请选择" v-model="param.address" :options="options" filterable></el-cascader>
    </div>
</template>

<script>
    import PCAC from '../common/PCAC';
    export default {
        props:['param'],
        data() {
            return {
                options: PCAC
            }
        },
        created() {
            this.$emit('pca-select', PCAC)
        },
        methods: {

        }
    }
</script>

<style>

</style>

