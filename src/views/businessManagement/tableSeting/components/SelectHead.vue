<template>
  <el-form
    :inline="true"
    :model="rbp"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>
    <div style="display: flex">
      <div style="flex:1;float: left">
          <el-form-item label="水厂：">
            <el-select v-model="rbp.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getMeterRead">
              <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表员：">
            <el-select v-model="rbp.MeterReaderId" placeholder="请选择" size="small">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="表册类型：">
            <el-select v-model="rbp.BookTypeKey" placeholder="请选择" size="small">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in formArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="表册编号：">
            <el-input v-model="rbp.BookNo" maxlength="20" placeholder="片区名称(长度20)"
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item label="表册名称：">
            <el-input v-model="rbp.BookName" maxlength="20" placeholder="片区名称(长度20)"/>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i
              class="icon iconfont">&#xe694;</i>
              搜索
            </el-button>
          </el-form-item>
      </div>

    </div>
  </el-form>
</template>

<script>
  import { getDictionaryOption } from "@/utils/permission"

  export default {
    name: "SelectHead",
    data() {
      return {
        rbp:{},
        formArry:[],//表册类型
        waterFactory:[],//具有权限水厂数据
        meterArry:[],//抄表员
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        this.$parent.searchFun();
      },
      getMeterRead(id){
        this.$parent.getMeterReaderList(1,id)
      }
    },
    mounted() {
      this.formArry = getDictionaryOption('表册类型')
      this.rbp = this.$parent.rbp;//从父组件获取初始化查询参数
    }
  }
</script>
