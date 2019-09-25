<template>
  <el-form
    :inline="true"
    :model="jp"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent
  >
    <el-form-item label="部门：">
      <el-select v-model="jp.SYS_Department_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in postArray" :key="index" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="岗位：">
      <el-input
        @keyup.enter.native="searchFun"
        v-model="jp.JobName"
        placeholder="请输入岗位名称"
        maxlength="10"
        size="small"
      />
    </el-form-item>
    <el-form-item label="操作人：">
      <el-select v-model="jp.createUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间：">
      <el-date-picker
        @keydown.enter.native="searchFun"
        :editable="false"
        v-model="createStartTimes"
        :unlink-panels="true"
        size="small"
        type="datetimerange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        @change="getTime1"
      />
    </el-form-item>
    <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "SelectHead",
    data() {
      return {
        postArray: [],//部门值
        operatorArray: [],//操作员值
        createStartTimes:[],
        jp: {}//查询参数
      }
    },
    methods: {
      /**
       * 触发组建查询方法
       * */
      searchFun(){
        this.$parent.searchFun();
      },
      /**
      * 从事件组建中分割开始结束时间
       * createStartTime 开始
       * createEndTime 结束
      * */
      getTime1(data) {
        if(data !=null) {
          this.jp.createStartTime = data[0]
          this.jp.createEndTime = data[1]
        }else {
          this.jp.createStartTime = ''
          this.jp.createEndTime = ''
        }
      }
    },
    mounted() {
      this.jp = this.$parent.jp;//从父组件获取初始化查询参数
    }
  }
</script>
