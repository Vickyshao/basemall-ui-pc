<template>
    <div class="block text-center">
        <el-pagination
        background
        @current-change="pageChanged"
        :current-page="pageData.pageIndex"
        :page-size="pageData.pageSize||10"
        layout="total, prev, pager, next, jumper"
        :total="pageData.total">
        </el-pagination>
    </div>
</template>
<script>
export default {
    props:['pageData'],
    methods: {
      pageChanged(val) {
          this.$emit('page-changed',val)
      }
    }
}
</script>
<style lang="less" scoped>
    .el-pagination {
      margin: 26px auto 36px;
      span, li {
        font-size: 14px !important;
      }
    }
    .text-center{
        text-align: center;
    }
</style>
