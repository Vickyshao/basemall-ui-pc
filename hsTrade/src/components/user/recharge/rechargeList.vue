<template>
  <div class="assetDetail">
    <div class="topTitle" v-if="$store.state.userData.userType==3">充值记录</div>
    <div class="table-status-bar clear">
			<date-range-picker class="fl" @date-changed="dateChanged"></date-range-picker>
      <el-select class="fl m-l" v-model="listData.type" @change="changeType">
          <el-option label="全部" value="0"></el-option>
          <el-option label="网银" value="1"></el-option>
          <el-option label="企业网银" value="2"></el-option>
      </el-select>
		</div>
    <div v-nodata="listData.total==0">
      <table class="table">
        <thead>
          <tr>
            <th>充值时间</th>
            <th>充值金额</th>
            <th>充值渠道</th>
            <th>充值状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2016.04.23 12:32:12</td>
            <td>1000000.00</td>
            <td>网银</td>
            <td class="success">成功</td>
          </tr>
        </tbody>
      </table>
    </div>
    <pagination v-if="!!listData.total" :page-data="listData"></pagination>
  </div>
</template>

<script>
  import dateRangePicker from '@/components/common/dateRangePicker'
  import pagination from '@/components/common/pagination.vue'
  export default {
    name: "assetDetail",
    components: {
      pagination,
      dateRangePicker
    },
    data() {
      return {
        listData:{
          pageIndex:1,
          pageSize:10,
          total:1,
          type:'0'
        }
      }
    },
    methods: {
      dateChanged(date){

      },
      changeType(){

      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../../less/financingUser.less";
  .fl{float:left;}
  .m-l{margin-left:20px;}
  .table-status-bar{
		margin-bottom: 20px;
		line-height: 40px;
		.label{
			font-size: 12px;
			margin:0 14px 0 38px;
			&:first-child{
				margin:0 14px 0 0;
			}
		}
	}
</style>
