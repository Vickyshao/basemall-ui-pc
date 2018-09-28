<template>
    <div class="breadNav_container">
      <div class="bread_nav">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: x.path }" v-for="x in list" :key="x.path">{{x.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
</template>
<script>
export default {
  props:['list']
}
</script>

<style lang="less" scoped>
    .bread_nav{
      max-width: 1200px;
      text-align: left;
      margin: 15px auto;
    }
</style>
