<template>
    <div class="publish">
        <div class="publish_title">网站公告</div>
        <div class="publish_body" v-loading="tableData.loading">
            <ul class="publish_list">
                <li v-for="item in tableData.publishDataList" :key="item.id"><router-link class="blue_link" :to="{path:'/about/publish-detail',query:{ id:item.id }}">{{item.title}}</router-link><i class="gray_text float_r">{{item.publishTime|formatTime("YMD")}}</i></li>
            </ul>
            <pagination v-if="tableData.total>0" :page-data="tableData" @page-changed="pageChanged"></pagination>
        </div>
        <div class="aircraft">
        </div>
    </div>
</template>
<script>
import pagination from '@/components/common/pagination'
export default {
  name:'publish',
  components: {
      pagination
  },
  data () {
      return {
          tableData:{
                loading:false,
                pageIndex:1,
                pageSize:10,
                total:0,
                publishDataList:[],
          }
      }
  },
  created () {
      this.getNoteList()
  },
  methods:{
      pageChanged(pageIndex){
        this.tableData.pageIndex=pageIndex;
        this.getNoteList()
      },
      getNoteList() {
        this.tableData.loading=true;
        let data={
          pageIndex:this.tableData.pageIndex,
          pageSize:this.tableData.pageSize,
        };
        this.$ajax.post('/basemall-cms/index/get-announcement-list',data).then((res)=>{
           this.tableData.loading=false;
           this.tableData.total = res.total;
           this.tableData.publishDataList = res.gongGaoList;
        }).catch((err)=>{
          this.tableData.loading=false;
        })
      }
  }
}
</script>

<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
  .publish{
      position: relative;
   .publish_title{
       font-size: 22px;
       padding-bottom: 25px;
       border-bottom: 1px solid @line-color;
   }
   .publish_body{
       margin-top: 15px;
       .publish_list{
           li{
               height: 60px;
               line-height: 60px;
               border-bottom: 1px solid @line-color;
               padding-left: 20px;
               a{
                   display:inline-block;
                   width: 700px;
                   overflow: hidden;
                   text-overflow: ellipsis;
                   white-space: nowrap;
               }
           }li:hover{
               cursor: pointer;
               background-color: @table-th-color;
           }
       }
   }
   .aircraft{
       position: absolute;
       width: 300px;
       height: 55px;
       background: url(/static/img/aboutUs/aircraft@2x.png) no-repeat right top/contain;
       top:0;
       right: 0;
   }
  }
</style>
