<template>
  <!-- 新增弹窗 -->
  <div>
    
    <div class="main-padding-20-y">
        卡片
    </div>
  </div>
</template>
<script>
export default {
  props: {
    listQuery: {
      type: Object,
      default: function() {
        return {};
      }
    },
    total:{
        type: Number,
        default:0
    },
     tableHeight:{
        type: Number,
        default:100
    },
    formHeight:{
        type: Number,
        default:100
    }
  },
  data() {
    return {
        tableKey:1,
        tableData: [],
      checksData: []
    };
  },
  methods: {
  
     sortChanges({prop, order }){//筛选
      this.listQuery.filed=prop
      this.listQuery.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
      if(this.tableData.length>0){
        this.listQuery.page=1
        this.getList()
      }
    },
    getList(){

    }
  }
};
</script>
<style lang="scss" scoped>

</style>

