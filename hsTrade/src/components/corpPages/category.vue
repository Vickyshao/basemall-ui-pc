<template>
    <div class="table_class">
      <div class="radio_class">
        <el-row>
          <span>行业：</span>
          <el-radio-group v-model="business" @change="changeBusiness">
            <el-radio-button v-for="(item,i) in businessOptions" :label="item" :key="i">{{item}}</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row>
          <span>金额 (万元)：</span>
          <el-radio-group v-model="amount" @change="changeAmount">
            <el-radio-button v-for="(a,j) in amountOptions" :label="a" :key="j">{{a}}</el-radio-button>
          </el-radio-group>
       </el-row>
       <el-row>
          <span>期限：</span>
          <el-radio-group v-model="limit" @change="changeLimit">
            <el-radio-button v-for="(b,g) in limitOptions" :label="b" :key="g">{{b}}</el-radio-button>
          </el-radio-group>
        </el-row>
      </div>
  </div>
</template>

<script>
  export default {
    name:'classify',
    data () {
        return {
            businessOptions: ['全部','电池', '光缆', '柴油', '燃料'],
            amountOptions: ['全部','100以下 ', '100-500', '500-1000', '1000以上'],
            limitOptions: ['全部','3个月','6个月','9个月','1年','1年以上',],
            business: '全部',
            amount: '全部',
            limit: '全部',
            selectedCategories: {
                business: '',
                amount: '',
                borrowSumMin: null,
                borrowSumMax: null,
                limit: null,
            },
        }
    },
    created(){
        this.$emit('changeCategory', this.selectedCategories);
    },
    methods: {
        changeBusiness() {
            this.selectedCategories.business = this.business;
        },
        changeAmount() {
            this.selectedCategories.amount = this.amount;
            let index = this.amountOptions.indexOf(this.amount);
            switch (index) {
                case 0:
                    this.selectedCategories.borrowSumMin=null;
                    this.selectedCategories.borrowSumMax=null;
                    break;
                case 1:
                    this.selectedCategories.borrowSumMin=0;
                    this.selectedCategories.borrowSumMax=100;
                    break;
                case 2:
                    this.selectedCategories.borrowSumMin=100;
                    this.selectedCategories.borrowSumMax=500;
                    break;
                case 3:
                    this.selectedCategories.borrowSumMin=500;
                    this.selectedCategories.borrowSumMax=1000;
                    break;
                case 4:
                    this.selectedCategories.borrowSumMin=1000;
                    this.selectedCategories.borrowSumMax=999999999;
                    break;
                default:
                    break;
            }
            this.selectedCategories.borrowSumMin = !!this.selectedCategories.borrowSumMin ? this.selectedCategories.borrowSumMin*10000:null;
            this.selectedCategories.borrowSumMax = !!this.selectedCategories.borrowSumMax ? this.selectedCategories.borrowSumMax*10000:null;
        },
        changeLimit() {
            this.selectedCategories.limit = this.limit;
        },
    },
    watch: {
        selectedCategories: {
            handler(newVal, oldVal){
                if(newVal) {
                    this.$emit('changeCategory', this.selectedCategories);
                }
            },
            deep: true
        },
    }
  }
</script>
<style lang="less">
@import '../../assets/css/comcss/com_UI.less';
@import '../../less/areaClass.less';
</style>
