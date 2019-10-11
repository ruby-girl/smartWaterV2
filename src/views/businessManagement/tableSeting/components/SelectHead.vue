<template>
  <el-form
    :inline="true"
    :model="sbap"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>
    <div style="display: flex">
      <div style="flex:1;float: left">
          <el-form-item label="水厂：">
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
          <el-form-item label="表册类型：">
            <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="表册编号：">
            <el-input v-model="sbap.BlockAreaName" maxlength="20" placeholder="片区名称(长度20)"
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item label="表册名称：">
            <el-input v-model="sbap.BlockAreaName" maxlength="20" placeholder="片区名称(长度20)"
                      @keyup.enter.native="handleFilter"/>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i
              class="icon iconfont">&#xe694;</i>
              搜索
            </el-button>
          </el-form-item>
      </div>
      <div style="width: 270px;float: left">
          <div style="background: #f5f5f5;padding-top: 12px;margin-bottom: 18px;">
            <el-form-item label="用户:" label-width="70px">
              <el-input v-model="sbap.BlockAreaName" maxlength="20" placeholder="姓名/编码/简码"
                        @keyup.enter.native="handleFilter"/>
            </el-form-item>
            <el-form-item style="text-align: right;width: 100%">
              <el-button @click="getListUser()" style="margin-right: 17px;background: #75C200;border: solid 1px #75C200;" type="primary" size="mini" class="cl-search"><i class="el-icon-location-outline"></i>
                用户表册定位
              </el-button>
            </el-form-item>
          </div>
      </div>
    </div>
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
      getListUser(){
        this.$parent.setChildFun()
      },
    },
    mounted() {
      this.sbap = this.$parent.sbap;//从父组件获取初始化查询参数
      this.GetLoginNameList()
    }
  }
</script>
