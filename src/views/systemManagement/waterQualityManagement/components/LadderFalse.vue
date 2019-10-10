<template>
  <!-- 新增弹窗 -->

  <el-form
    ref="dataFormAdd"
    :model="temp"
    :inline="true"
    class="form-inline-small-input ladder-form-padding"
    size="small"
    label-width="100px"
  >
    <el-form-item label="用水性质：">
      <el-input
        v-model="temp.name"
        placeholder="长度1-50"
        maxlength="50"
      />
    </el-form-item>
    <el-form-item label="用水性质类型：">
      <el-select v-model="temp.name" placeholder="请选择">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in roleList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="阶梯结算月数：">
      <el-select v-model="temp.name" placeholder="请选择">
        <el-option  v-for="item in 12" :key="item" :label="item" :value="item"/>     
      </el-select>
    </el-form-item>
    <el-form-item label="污水费：">
      <el-input v-model="temp.num" @blur="changeTwoDecimal_x($event)" @keyup.native="money($event)"
      />
    </el-form-item>
    <el-form-item label="其他费用1：">
      <el-input
        v-model="temp.num"
        @blur="changeTwoDecimal_x($event)" @keyup.native="money($event)"
      />
    </el-form-item>
    <el-form-item label="其他费用2：">
      <el-input
        v-model="temp.num"
        @blur="changeTwoDecimal_x($event)" @keyup.native="money($event)"
      />
    </el-form-item>
    <div class="ladder-box">
     <el-form-item label="单价：" label-width="80px">
      <el-input
        v-model="temp.num"
        @blur="changeTwoDecimal_x($event)" @keyup.native="money($event)"
      />
    </el-form-item>
    <el-form-item label="合计单价：" label-width="100px">
      <el-input
        v-model="temp.num"
        @blur="changeTwoDecimal_x($event)" @keyup.native="money($event)"
      />
    </el-form-item>
    </div>
    <el-form-item label="开始执行日期：">
        <el-date-picker v-model="value3" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
  </el-form>
  
</template>
<script>
import {updateMoney,delDecimal} from "@/utils/index.js"
export default {
   props: {
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mounted() {},
  data() {
    return {
      value3: new Date(),
      roleList: [{ Id: "1", Name: "为" }],
      ladder:[{type:1,num:0,start:0,tot:20},{type:2,num:0,start:0,tot:20},{type:3,num:0,start:0,tot:20}]
    };
  },
  methods: {
     // 输入金额保留2位
    money(e){
       e.target.value=updateMoney(e.target.value)
    },
    // 补齐小数
    changeTwoDecimal_x(e){
      e.target.value=delDecimal(e.target.value)
    }
  }
};
</script>
<style lang="scss" scoped>
.ladder-form-padding{
  padding:40px 20px;
}
.ladder-box {
  padding: 15px 0;
  background: #f5f5f5;
  margin:0 20px;
  
}
</style>

