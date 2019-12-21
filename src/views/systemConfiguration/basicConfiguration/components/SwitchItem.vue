<template>
  <!-- 卡片-->
  <el-row>
    <el-col :md="15">
        <div style="font-size: 18px">{{label}}</div>
    </el-col>
    <el-col :md="9">
        <el-switch v-model="valueItem"></el-switch>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    swithValue:{}
  },
  watch:{
    swithValue:{
       handler(val, oldVal) {
       this.valueItem=val
      },
      immediate: true
    },
  },
  data(){
      return {
          valueItem:''
      }
  }
};
</script>

