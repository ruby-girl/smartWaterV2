<template>
  <!-- 选择打印机 -->
 <div>
     <el-row class="head-bottom-box">
      <el-col :md="8" :lg="3" :xl="2"><span>姓名:</span><span>{{user.CustomerName}}</span>
      </el-col>
      <el-col :md="8" :lg="4" :xl="3">
        水表类型:
        <span>{{user.WaterMeterTypeName}}</span>
      </el-col>
      <el-col :md="8" :lg="4" :xl="3">
        电话:
        <span>{{user.Tel}}</span>
      </el-col>
      <el-col :md="8" :lg="6" :xl="4">
        水表编号:
        <span>{{user.SA_WaterMeterNo}}</span>
      </el-col>
      <el-col :md="12" :lg="7" :xl="12" class="text-wrap">
        地址:
        <span>{{user.Address}}</span>
      </el-col>
    </el-row>
    <!-- <el-row class="head-bottom-box">
      <el-col :md="8" :lg="3" :xl="2"><span>姓名:</span><span>{{user.CustomerName}}</span>
      </el-col>
      <el-col :md="8" :lg="4" :xl="3">
        水表类型:
        <span>{{user.WaterMeterTypeName}}</span>
      </el-col>
      <el-col :md="8" :lg="4" :xl="3">
        电话:
        <span>{{user.Tel}}</span>
      </el-col>
      <el-col :md="8" :lg="6" :xl="4">
        水表编号:
        <span>{{user.SA_WaterMeterNo}}</span>
      </el-col>
      <el-col :md="12" :lg="7" :xl="12" class="text-wrap">
        地址:
        <span>{{user.Address}}</span>
      </el-col>
    </el-row> -->
 </div>
</template>
<script>
export default {
  props:['headUser'],
 watch: {
    headUser(val) {
      this.user = val;
    }
  },
  data() {
    return {
    user:{}
    };
  },
  methods: {
   
  }
};
</script>
<style lang="scss" scoped>
.head-bottom-box {
  background: #f5f5f5;
  padding: 15px;
  line-height: 30px;
  font-size: 14px;
  position: absolute;
  top:50px;
  width: calc(100% - 20px);
}
</style>

