<template>
  <el-form
    :inline="true"
    :model="sbap"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>
    <el-form-item label="抄表计划：">
      <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="抄表员：">
      <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="表册：">
      <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="人员：">
      <el-input v-model="sbap.BlockAreaName" maxlength="20" placeholder="(长度1-30)" @keyup.enter.native="handleFilter"/>
    </el-form-item>
    <el-form-item label="抄表状态：">
      <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="抄表日期：">
      <el-date-picker
        :editable="false"
        @keydown.enter.native="searchFun"
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
    <el-form-item label="">
      <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i>
        搜索
      </el-button>
    </el-form-item>
    <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
  </el-form>
</template>

<script>
  import { GetLoginNameList } from "@/api/user"

  export default {
    name: "SelectHead",
    data() {
      return {
        sbap:{},
        createStartTimes:[],
        operatorArray:[]
      }
    },
    methods: {
      setCustomData() {
        this.$parent.setCustomData()
      },
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        this.$parent.searchFun();
      },
      getTime1(data) {
        if(data !=null){
          this.sbap.editStartTime = data[0]
          this.sbap.editEndTime = data[1]
        }else{
          this.sbap.editStartTime = ''
          this.sbap.editEndTime = ''
        }
      },
      /**
       * 获取操作人信息
       * */
      GetLoginNameList() {
        GetLoginNameList().then(res => {
          if (res.code ==0 ) {
            this.operatorArray = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
    },
    mounted() {
      this.sbap = this.$parent.sbap;//从父组件获取初始化查询参数
      this.GetLoginNameList()
    }
  }
</script>
