<template>
  <div>
    <h2>已分配表册用户</h2>
    <el-form
      :inline="true"
      :model="rbdp"
      class="head-search-form"
      size="small"
      label-width="61px"
      @submit.native.prevent>
      <el-form-item label="所属区域" prop="SA_WaterFactory_Id" style="margin-right: 70px">
        <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1" v-if="waterFactory.length>1"></el-option>
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="CustomerQueryValue">
        <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" class="short-select-item"
                   style="width: 100px;float: left;">
          <el-option label="姓名" value="1"/>
          <el-option label="用户编号" value="2"/>
          <el-option label="电话" value="2"/>
        </el-select>
        <el-input v-model="rbdp.SA_WaterFactory_Id" maxlength="50" placeholder="(长度1-50)"
                  style="width: 180px;float: left"/>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询
        </el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 fr">
      <el-button size="mini" class="cl-operation-btn" round @click=""><i class="icon iconfont">&#xe650;</i> 删除
      </el-button>
      <el-button size="mini" class="cl-operation-btn" round @click="">分配至</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AllocationTable",
    data() {
      return {
        waterFactory:[],
        dataTypes:[],
        rbdp: {//临时表册参数
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000010",
          ecqt: "",
          Customer: "",
          SA_WaterFactory_Id: "姓名",
          SA_RegisterBookInfo_Id: "-1",
          MeterReaderId: "",
          BookTypeKey: "",
          SA_UserArea_Id: ""
        },
      }
    },
    methods:{
      searchFun(){}
    }
  }
</script>
