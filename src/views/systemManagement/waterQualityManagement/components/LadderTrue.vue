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
        oninput="value=value.replace(/[^\d]/g,'')"
        placeholder="长度1-50"
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
        <el-option label="全部" value="-1" />
        <el-option v-for="item in roleList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="污水费：">
      <el-input
        v-model="temp.num"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
    </el-form-item>
    <el-form-item label="其他费用1：">
      <el-input
        v-model="temp.num"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
    </el-form-item>
    <el-form-item label="其他费用2：">
      <el-input
        v-model="temp.num"
        oninput="value=value.replace(/[^\d]/g,'')"
      />
    </el-form-item>
    <div class="ladder-box">
      <div class="display-flex" v-for="(item) in ladder">
        <div class="display-flex align-items-center ladder-item">
          <i class="main-color-red">*</i>
          <span>{{item.type}}阶单价：</span>
          <div class="table-input-y">
            <input type="text" v-model="item.num"/>
            <span>元/吨</span>
          </div>
        </div>
        <div class="display-flex align-items-center ladder-item">
          <i class="main-color-red">*</i>
          <span>{{item.type}}阶起始量：</span>
          <div class="table-input-y">
            <input type="text" v-model="item.start"/>
            <span>元/吨</span>
          </div>
        </div>
        <div class="display-flex align-items-center ladder-item">
          <i class="main-color-red">*</i>
          <span>{{item.type}}阶合计单价：</span>
          <div class="table-input-y">
            <input type="text" v-model="item.tot"/>
            <span>元/吨</span>
          </div>
        </div>
      </div>
      
    </div>
  </el-form>
</template>
<script>
export default {
  mounted() {},
  data() {
    return {
      temp: {
        name: "这",
        num: 0
      },
      roleList: [{ Id: "1", Name: "为" }],
      ladder:[{type:1,num:0,start:0,tot:20},{type:2,num:0,start:0,tot:20},{type:3,num:0,start:0,tot:20}]
    };
  },
  methods: {
    handleFilter() {
      console.log(typeof this.temp.name);
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
  .ladder-item {
    padding-left: 15px;
  }

  .table-input-y {
    border: 1px solid rgba(216, 226, 231, 1);
    border-top: none;
    height: 32px;
    background: #fff;
    padding-right: 10px;

    input {
      border: none;
      height: 100%;
      text-align: center;
      width: 120px;
      &:focus {
        outline: none;
        // border-color:#00B3A1;
      }
    }
  }
  > .display-flex:first-child .table-input-y {
    border-top: 1px solid rgba(216, 226, 231, 1);
  }
}
</style>

